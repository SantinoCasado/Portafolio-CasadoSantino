import { Component, Signal, EventEmitter, Output } from '@angular/core';
import { ProjectInterface } from './interfaces/Proyect.interface'
import projectsData from '../../assets/data/projects.json'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { LanguageService } from '../../services/language.service';


@Component({
  selector: 'app-google-proyects',
  imports: [CommonModule, FormsModule, CdkDrag, CdkDragHandle],
  templateUrl: './google-proyects.html',
  styleUrl: './google-proyects.css',
})
export class GoogleProyects{
  @Output() minimize = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  isMaximized = false;

  // Cargo el json y le aplico interfaz
  projects : ProjectInterface[] = projectsData as ProjectInterface[];

  // Estado del flujo Google
  hasSearched: boolean = false; // Controla si estamos en Home o en Resultados
  currentSearch: string = '';

  matchBar: string[] = [];
  showSuggestions : boolean = false;
  projectMatches : ProjectInterface[] = [];  

  // Lista global de palabras clave únicas (Tecnologías + Tipos)
  private dictionary : string[] = [];

  constructor(public langService: LanguageService) {
    this.buildDictionary();
  }

  private buildDictionary(){
    const keyWordsSet = new Set<string>();  // Set por default guarda datos UNICOS

    this.projects.forEach(project =>{
      keyWordsSet.add(project.type);
      project.technologies.forEach(tech => keyWordsSet.add(tech));
    })
  }

  // Se ejecuta por cada tecla que apreta el usuario
  onInputChange(): void {
    const term = this.currentSearch.trim().toLowerCase();

    if (!term) {
      this.matchBar = [];
      this.showSuggestions = false;
      return;
    }

    const terms = term.split(' ');
    const lastTerm = terms[terms.length - 1];

    if (lastTerm) {
      this.matchBar = this.dictionary.filter(item => 
        item.toLowerCase().includes(lastTerm)
      );
      this.showSuggestions = this.matchBar.length > 0;
    } else {
      this.matchBar = [];
      this.showSuggestions = false;
    }
  }
  
  // Ejecuta la búsqueda al apretar Enter o clic en Buscar
  executeSearch(): void {
    this.showSuggestions = false;
    const query = this.currentSearch.trim().toLowerCase();

    this.hasSearched = true;

    if (!query) {
      this.projectMatches = [...this.projects];
      return;
    }

    const searchTerms = query.split(' ').filter(t => t.length > 0);
    const currentLang = this.langService.currentLang();

    this.projectMatches = this.projects.filter(project => {
      // 1. Obtención segura del título según el idioma activo
      const rawTitle = typeof project.title === 'object' 
        ? project.title[currentLang] 
        : project.title;
      const title = (rawTitle || '').toLowerCase();

      // 2. Obtención de la descripción
      const rawDesc = typeof project.description === 'object' 
        ? project.description[currentLang] 
        : project.description;
      const desc = (rawDesc || '').toLowerCase();

      const type = (project.type || '').toLowerCase();
      const techs = project.technologies ? project.technologies.map(t => t.toLowerCase()) : [];

      // Evaluación de términos
      return searchTerms.every(term => 
        title.includes(term) ||
        type.includes(term) ||
        desc.includes(term) ||
        techs.some(tech => tech.includes(term))
      );
    });
  }

  selectSuggestion(suggestion: string): void {
    const terms = this.currentSearch.trim().split(' ');
    terms[terms.length - 1] = suggestion;
    
    this.currentSearch = terms.join(' ') + ' ';
    this.showSuggestions = false;
    this.executeSearch();
  }

  // Vuelve a la pantalla principal de Google
  goHome(): void {
    this.hasSearched = false;
    this.currentSearch = '';
    this.matchBar = [];
    this.showSuggestions = false;
  }

  openUrl(url?: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  // Devuelve una imagen temática dependiendo del tipo de proyecto
  getProjectIcon(type: string): string {
    switch (type) {
      case 'Web Page':
        return 'html.ico'; // Cambiá por el nombre de tu ícono web (ej: Internet Explorer.ico)
      case 'Mobile App':
        return 'Phone.ico'; // Cambiá por el ícono que quieras para mobile
      case 'Desktop App':
        return 'Computer.ico'; // Cambiá por el ícono de escritorio
      case 'Shell':
        return 'Command Prompt.ico'; // Cambiá por tu ícono de consola/terminal
      default:
        return 'File.ico';
    }
  }

  onMinimize() { this.minimize.emit(); }
  onClose() { this.close.emit(); }
  toggleMaximize() { this.isMaximized = !this.isMaximized; }
}
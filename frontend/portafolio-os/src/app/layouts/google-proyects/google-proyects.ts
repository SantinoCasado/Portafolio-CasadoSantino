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

  // Cargo el json y le aplico interfaz
  projects : ProjectInterface[] = projectsData as ProjectInterface[];

  currentSearch : string = '';  // Busqueda del usuario
  matchBar : ProjectInterface[] = []; 
  showSuggestions: boolean = false; 

  // Lista global de palabras clave únicas (Tecnologías + Tipos)
  private dictionary : string[] = [];
}

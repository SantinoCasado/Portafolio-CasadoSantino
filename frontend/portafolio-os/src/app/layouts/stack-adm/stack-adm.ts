import { Component, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';
import stackData from '../../assets/data/stackData.json';
import { TechCategory } from './interfaces/techCategory';
import { TechItem } from './interfaces/TechItem';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-stack-adm',
  imports: [CommonModule, CdkDrag, CdkDragHandle],
  templateUrl: './stack-adm.html',
  styleUrl: './stack-adm.css',
})
export class StackAdm {
  selectedItem: TechItem | null = null;
  // Cargo y tipo los datos del JSON
  stackData: TechCategory[] = stackData as TechCategory[];

  // --- ESTADOS DE LA VENTANA ---
  isMaximized = false; // El hijo controla si ocupa toda la pantalla

  // Emisores para avisarle al Escritorio
  @Output() minimize = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  // Inyectao el servicio de idioma
  constructor(public langService: LanguageService) {}

  // 0 si es Español, o 1 si es Inglés.
  // Esto hace que en el HTML solo escribas "item.status[langIndex]"
  get langIndex(): number {
    return this.langService.currentLang() === 'es' ? 0 : 1;
  }

  toggleCategory(category: TechCategory) {
    category.expanded = !category.expanded;
  }

  selectItem(item: TechItem) {
    this.selectedItem = item;
    console.log('Lenguaje seleccionado:', this.selectedItem);
  }

  toggleMaximize() {
    this.isMaximized = !this.isMaximized;
  }

  onMinimize() {
    this.minimize.emit();
  }

  onClose() {
    this.close.emit();
  }
}

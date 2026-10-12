import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-curriculum',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDragHandle],
  templateUrl: './curriculum.html',
  styleUrl: './curriculum.css'
})
export class Curriculum {
  @Output() minimize = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  isMaximized = false;

  constructor(public langService: LanguageService) {}

  // Propiedad reactiva para la imagen del visor
  get cvImageSrc(): string {
    return this.langService.currentLang() === 'es' 
      ? 'curriculum-Espanol.png'  
      : 'curriculum-English.png';   
  }

  // Descarga el PDF correcto según el idioma activo
  downloadCv() {
    const isEs = this.langService.currentLang() === 'es';
    const link = document.createElement('a');
    
    // Rutas con encodeURI para evitar que los espacios en el nombre rompan la descarga
    const pathEs = encodeURI('/pdf/Curriculum - Casado Santino .pdf');
    const pathEn = encodeURI('/pdf/Curriculum - Casado Santino - English.pdf');
    
    link.href = isEs ? pathEs : pathEn; 
    link.download = isEs ? 'CV_Santino_Casado_ES.pdf' : 'CV_Santino_Casado_EN.pdf';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  onMinimize() { this.minimize.emit(); }
  onClose() { this.close.emit(); }
  toggleMaximize() { this.isMaximized = !this.isMaximized; }
}
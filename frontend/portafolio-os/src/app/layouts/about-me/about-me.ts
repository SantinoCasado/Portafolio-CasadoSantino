import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragHandle } from '@angular/cdk/drag-drop';
import { LanguageService } from '../../services/language.service';
import aboutMe  from '../../assets/data/aboutMe.json';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDragHandle],
  templateUrl: './about-me.html',
  styleUrl: './about-me.css'
})
export class AboutMe {
  @Output() minimize = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  isMaximized = false;

  githubAvatarUrl = 'https://avatars.githubusercontent.com/u/173967001?v=4';

  constructor(public langService: LanguageService) {}

  // Esta función decide automáticamente que texto mostrar
  get currentContent() {
    return this.langService.currentLang() === 'es' ? aboutMe.es : aboutMe.en;
  }

  onMinimize() {
    this.minimize.emit();
  }

  onClose() {
    this.close.emit();
  }

  toggleMaximize() {
    this.isMaximized = !this.isMaximized;
  }
}
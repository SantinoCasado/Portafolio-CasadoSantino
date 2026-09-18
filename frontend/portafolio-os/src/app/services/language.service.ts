import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class LanguageService {
  // Lee de localStorage o pone Español ('es') por defecto
  currentLang = signal<'es' | 'en'>((localStorage.getItem('lang') as 'es' | 'en') || 'es');

  toggleLanguage() {
    const newLang = this.currentLang() === 'es' ? 'en' : 'es';
    this.currentLang.set(newLang);
    localStorage.setItem('lang', newLang);
  }
}
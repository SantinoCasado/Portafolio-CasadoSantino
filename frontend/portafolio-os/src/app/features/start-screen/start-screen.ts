import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from '../../utilities/device-detector';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-start-screen',
  imports: [],
  templateUrl: './start-screen.html',
  styleUrl: './start-screen.css',
})
export class StartScreen implements OnInit {
  private router = inject(Router);
  private deviceDetector = inject(DeviceDetectorService);

  public langService = inject(LanguageService);

  isMobile = signal(false);
  showMobileModal = signal(false);
  showLangModal = signal(false);

  ngOnInit() {
    // Detecta si es movil al cargar la pantalla
    this.isMobile.set(this.deviceDetector.isMobileDevice());
  }

  LogIn() {
    // Si es movil y el modal AÚN NO se mostró, lo muestro y freno el logueo
    if (this.isMobile() && !this.showMobileModal()) {
      this.showMobileModal.set(true);
    } else {
      // Si es PC, o si es móvil y ya pasó el modal, entra al sistema
      this.proceedToDesktop();
    }
  }

  // Abre y cierra el formulario viejo
  toggleLangModal() {
    this.showLangModal.set(!this.showLangModal());
  }

  // Establece el idioma cuando eligen una opción en el formulario
  setLanguage(lang: 'es' | 'en') {
    this.langService.currentLang.set(lang);
    localStorage.setItem('lang', lang);
  }

  acceptModal() {
    this.showMobileModal.set(false);
    this.proceedToDesktop();
  }

  private proceedToDesktop() {
    // Entrega la llave del Guard final y lo mandamos al escritorio
    sessionStorage.setItem('userLogged', 'true');
    this.router.navigate(['/desktop']);
  }
}

import { Component, OnInit, OnDestroy, signal, Input, Output, EventEmitter } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { AppProcess } from '../../features/desk-screen/interfaces/AppProcess'; 

@Component({
  selector: 'app-task-bar',
  standalone: true,
  templateUrl: './task-bar.html',
  styleUrls: ['./task-bar.css']
})
export class TaskBar implements OnInit, OnDestroy {
  // Variable para guardar la hora actual
  currentTime = signal<string>('');
  private timerId: any;
  showLangModal = signal(false);
  showWindowsModal = signal(false)

  // Recibe del escritorio si el admin está abierto o minimizado
  @Input() isStackOpen = false;
  @Input() isStackMinimized = false;
  // Recibe la lista de TODAS las ventanas abiertas
  @Input() activeApps: AppProcess[] = [];


  // Le avisa al escritorio que hicieron clic en el botón
  @Output() stackAppClick = new EventEmitter<void>();
  // Emite el ID de la app que el usuario clickeó en la barra
  @Output() appClick = new EventEmitter<string>();

  // Inyectamos el servicio como PUBLIC para que el HTML pueda leerlo
  constructor(public langService: LanguageService) {}

  ngOnInit() {
    // Ejecuta la hora ni bien carga la barra
    this.updateTime();
    // Actualiza la hora cada 1 segundo (1000 milisegundos)
    this.timerId = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy() {
    // Limpiamos el intervalo si el componente se destruye para no gastar memoria
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  private updateTime() {
    const now = new Date();
    // Formatea la hora estilo XP (ej: "10:38 AM")
    this.currentTime.set(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }

  // Abre y cierra el formulario viejo
  toggleLangModal() {
    this.showLangModal.set(!this.showLangModal());
  }

  toggleWindowsModal(){
    this.showWindowsModal.set(!this.showWindowsModal());
  }

  // Establece el idioma cuando eligen una opción en el formulario
  setLanguage(lang: 'es' | 'en') {
    this.langService.currentLang.set(lang);
    localStorage.setItem('lang', lang);
  }
}
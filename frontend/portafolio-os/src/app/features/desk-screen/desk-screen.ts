import { Component, HostListener, OnInit } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { TaskBar } from '../../layouts/task-bar/task-bar';
import { CdkDrag, CdkDropList, CdkDropListGroup, CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { StackAdm } from '../../layouts/stack-adm/stack-adm';

@Component({
  selector: 'app-desk-screen',
  standalone: true,
  imports: [TaskBar, StackAdm, CdkDrag, CdkDropList, CdkDropListGroup], 
  templateUrl: './desk-screen.html',
  styleUrl: './desk-screen.css',
})
export class DeskScreen implements OnInit {
  // Medidas estrictas que limitan el "escritorio"
  readonly slotWidth = 95;  
  readonly slotHeight = 95; 
  readonly taskbarHeight = 40;

  // Variables para determinar el espacio actual
  columns = 0;
  rows = 0;
  totalSlots = 0;

  // Grilla que alojara los íconos
  desktopGrid: any[][] = [];

  // Estados de administración de ventanas
  isStackAdminOpen = false;
  isStackAdminMinimized = false;

  // Guardado de iconos originales
  private myIcons = [
    { id: 'about', img: 'User 1.ico', nameEs: 'Sobre Mi', nameEn: 'About Me', preferredIndex: 0 },
    { id: 'projects', img: 'My Network Places.ico', nameEs: 'Proyectos', nameEn: 'Proyects', preferredIndex: 8 },
    { id: 'stack', img: 'List File.ico', nameEs: 'Administrar Stack', nameEn: 'Administrate Stack', preferredIndex: 16 },
    { id: 'contact', img: 'Phone.ico', nameEs: 'Contacto', nameEn: 'Contact', preferredIndex: 1 },
    { id: 'resume', img: 'File.ico', nameEs: 'Curriculum', nameEn: 'Resume', preferredIndex: 9 },
    // Los juegos los tiramos más adelante. Si la pantalla es chica, el rescate los reubicará solos
    { id: 'minesweeper', img: 'Minesweeper.ico', nameEs: 'Busca Minas', nameEn: 'Minesweeper', preferredIndex: 136 },
    { id: 'tetris', img: 'Game Controller.ico', nameEs: 'Tetris', nameEn: 'Tetris', preferredIndex: 137 }
  ];

  constructor(public langService: LanguageService) {}

  ngOnInit() {
    this.calculateGridSize();
    this.initializeGrid();
  }

  // Escucha cada vez que cambia el tamaño de la venta, es decir si hace zoom
  @HostListener('window:resize')
  onResize() {
    const oldGrid = [...this.desktopGrid]; // Saca una foto a la grilla antes del cambio
    
    this.calculateGridSize(); // Actualiza la cantidad de celdas disponibles

    // Arma la grilla nueva con el nuevo tamaño
    this.desktopGrid = Array.from({ length: this.totalSlots }, () => []);
    const lostIcons: any[] = [];

    // Revisa la foto vieja celda por celda
    oldGrid.forEach((slot, index) => {
      if (slot.length > 0) {
        const icon = slot[0];
        if (index < this.totalSlots) {
          // Si el indice sigue existiendo en la pantalla nueva, lo deja donde estaba
          this.desktopGrid[index].push(icon);
        } else {
          // Si el indice quedó fuera de la pantalla, lo manda a la lista de perdidos
          lostIcons.push(icon);
        }
      }
    });

    // Rescata a los perdidos ubicándolos en los primeros lugares vacíos
    lostIcons.forEach(icon => {
      const firstEmptyIndex = this.desktopGrid.findIndex(slot => slot.length === 0);
      if (firstEmptyIndex !== -1) {
        this.desktopGrid[firstEmptyIndex].push(icon);
      }
    });
  }

  // Funcion para calcular el tamaño del escritorio
  private calculateGridSize() {
    const availableWidth = window.innerWidth;
    // Resto a la barra de tareas el alto total
    const availableHeight = window.innerHeight - this.taskbarHeight;

    // Calculacion de cuantas celdas enteras entran (Math.floor redondea hacia abajo)
    this.columns = Math.floor((availableWidth - 10) / 95);
    this.rows = Math.floor((availableHeight - 10) / 95);

    // Capacidad total de la pantalla
    this.totalSlots = this.columns * this.rows;
  }

  // Funcion para iniciar el rezise del grid de columnas y filas
  private initializeGrid() {
    this.desktopGrid = Array.from({ length: this.totalSlots }, () => []);

    this.myIcons.forEach(icon => {
      // Si el indice preferido entra en la pantalla, lo pone ahi. Si no, lo manda al primer lugar vacío.
      if (icon.preferredIndex < this.totalSlots && this.desktopGrid[icon.preferredIndex].length === 0) {
        this.desktopGrid[icon.preferredIndex].push(icon);
      } else {
        const firstEmptyIndex = this.desktopGrid.findIndex(slot => slot.length === 0);
        if (firstEmptyIndex !== -1) {
          this.desktopGrid[firstEmptyIndex].push(icon);
        }
      }
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) return;
    if (event.container.data.length > 0) return; 

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );
  }

  // ---------------- LOGICA ADMINISTRACION DE STACK ----------------
  openApp(appId: string) {
    if (appId === 'stack') {
      this.openStackAdmin();
    }
  }
  // Cuando hace doble clic en el ícono del escritorio:
  openStackAdmin() {
    this.isStackAdminOpen = true;
    this.isStackAdminMinimized = false; // Si estaba minimizado, lo trae al frente
  }

  // Cuando el hijo emite el evento de minimizar:
  handleStackAdminMinimize() {
    this.isStackAdminMinimized = true;
    // Acá le pasarías el dato a la TaskBar para que dibuje el botoncito
  }

  // Cuando el hijo emite el evento de cerrar:
  handleStackAdminClose() {
    this.isStackAdminOpen = false; // Angular destruye el componente de la memoria
    this.isStackAdminMinimized = false;
  }
}
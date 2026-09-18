import { Component, OnInit, signal } from '@angular/core'; // <-- Importamos signal
import { Router } from '@angular/router';
import { DeviceDetectorService } from '../../utilities/device-detector';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  templateUrl: './loading-screen.html',
  styleUrls: ['./loading-screen.css']
})
export class LoadingScreen implements OnInit {
  
  // 1. Convertimos la propiedad en un Signal reactivo
  progressValue = signal(0);

  constructor(
    private deviceDetector: DeviceDetectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const isMobile = this.deviceDetector.isMobileDevice();
    localStorage.setItem('isMobile', JSON.stringify(isMobile));

    // Esperamos 2.2 segundos (2200ms) a que termine el FadeIn del CSS
    setTimeout(() => {
      
      // Recién acá arranca la carga real
      const interval = setInterval(() => {
        this.progressValue.update(val => val + 1);
        
        if (this.progressValue() >= 100) {
          clearInterval(interval);

          sessionStorage.setItem('systemBooted', 'true');
          this.router.navigate(['/login']);
        }
      }, 25); // Podés ajustar los milisegundos para que sea más rápida o más lenta

    }, 2200); 
  }
}
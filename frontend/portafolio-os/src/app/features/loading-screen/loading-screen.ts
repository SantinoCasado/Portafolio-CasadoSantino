import { Component, OnInit, signal } from '@angular/core'; // <-- Importamos signal
import { Router } from '@angular/router';
import { DeviceDetectorService } from '../../utilities/device-detector';

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  templateUrl: './loading-screen.html',
  styleUrls: ['./loading-screen.css']
})
export class LoadingScreenComponent implements OnInit {
  
  // 1. Convertimos la propiedad en un Signal reactivo
  progressValue = signal(0);

  constructor(
    private deviceDetector: DeviceDetectorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const isMobile = this.deviceDetector.isMobileDevice();
    localStorage.setItem('isMobile', JSON.stringify(isMobile));

    const interval = setInterval(() => {
      // 2. Actualizamos el signal sumándole 1 al valor anterior
      this.progressValue.update(val => val + 1);
      
      // 3. Leemos el valor actual del signal usando los paréntesis ()
      if (this.progressValue() >= 100) {
        clearInterval(interval);
        // this.router.navigate(['/login']);
      }
    }, 35); 
  }
}
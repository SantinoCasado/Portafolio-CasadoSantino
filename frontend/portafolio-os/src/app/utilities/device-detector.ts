import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectorService {

  constructor() { }

  // Función que devuelve true si es celular/tablet, y false si es PC
  isMobileDevice(): boolean {
    const width = window.innerWidth;
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    // Si la pantalla es chica (típico de celular) o el navegador es móvil
    return width <= 768 || isMobileUserAgent;
  }
}
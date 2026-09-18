import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// Evita que alguien vuelva a ver la pantalla de loading si ya pasó al login o al escritorio.

export const initialGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  if (sessionStorage.getItem('userLogged') === 'true') {
    router.navigate(['/desktop']);
    return false;
  }
  
  if (sessionStorage.getItem('systemBooted') === 'true') {
    router.navigate(['/login']);
    return false;
  }
  
  return true; // Solo lo deja pasar si no tiene ninguna llave
};
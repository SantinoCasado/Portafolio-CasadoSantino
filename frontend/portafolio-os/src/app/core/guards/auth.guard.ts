import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// Exige que hayas hecho clic en "Iniciar Sesión" para ver el contenido real del portafolio.

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  if (sessionStorage.getItem('userLogged') === 'true') {
    return true; // Tiene la llave, entra al escritorio
  }
  
  router.navigate(['/login']); // Si no, rebota al login
  return false;
};
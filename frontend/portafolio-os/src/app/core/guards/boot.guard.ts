import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

// Exige que la PC haya arrancado, pero bloquea el acceso si ya estás dentro del escritorio.

export const bootGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  if (sessionStorage.getItem('userLogged') === 'true') {
    router.navigate(['/desktop']); // Si ya inició sesión, lo devuelve al escritorio
    return false;
  }
  
  if (sessionStorage.getItem('systemBooted') !== 'true') {
    router.navigate(['/']); // Si no booteó, lo manda a la pantalla de carga
    return false;
  }
  
  return true; // Lo deja pasar solo si booteó y no inició sesión
};
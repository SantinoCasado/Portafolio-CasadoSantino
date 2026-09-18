import { Routes } from '@angular/router';
import { initialGuard } from './core/guards/initial.guard';
import { bootGuard } from './core/guards/boot.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/loading-screen/loading-screen').then(m => m.LoadingScreen),
    canActivate: [initialGuard] // <-- No podés volver acá si ya booteaste
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/start-screen/start-screen').then(m => m.StartScreen),
    canActivate: [bootGuard] // <-- Requiere booteo, bloquea si ya logueaste
  },
  /*
  { 
    path: 'desktop', 
    loadComponent: () => import('./features/desktop/desktop').then(m => m.DesktopComponent)
  }*/
  { 
    path: '**', 
    redirectTo: '', // Lo patea de nuevo a la pantalla de booteo (loading-screen)
    pathMatch: 'full' 
  }
];
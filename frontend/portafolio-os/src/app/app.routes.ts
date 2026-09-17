import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { LoadingScreenComponent } from './features/loading-screen/loading-screen';

export const routes: Routes = [
  { 
    path: '', 
    component: LoadingScreenComponent // Este se carga de inmediato al entrar a la web
  },
  /*
  { 
    path: 'login', 
    loadComponent: () => import('./components/login/login.component')
      .then(m => m.LoginComponent)
  },
  { 
    path: 'desktop', 
    loadComponent: () => import('./components/desktop/desktop.component')
      .then(m => m.DesktopComponent)
  }*/
];

@NgModule({
  // Acá está la magia: PreloadAllModules
  imports: [RouterModule.forRoot(routes, { 
    preloadingStrategy: PreloadAllModules 
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
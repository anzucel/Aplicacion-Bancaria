import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'inicio-admin',
    loadChildren: () => import('./pages/inicio-admin/inicio-admin.module').then( m => m.InicioAdminPageModule)
  },
  {
    path: 'inicio-usuario',
    loadChildren: () => import('./pages/inicio-usuario/inicio-usuario.module').then( m => m.InicioUsuarioPageModule)
  },
  {
    path: 'crear-usuario',
    loadChildren: () => import('./pages/crear-usuario/crear-usuario.module').then( m => m.CrearUsuarioPageModule)
  },
  {
    path: 'transferencia-terceros',
    loadChildren: () => import('./pages/transferencia-terceros/transferencia-terceros.module').then( m => m.TransferenciaTercerosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

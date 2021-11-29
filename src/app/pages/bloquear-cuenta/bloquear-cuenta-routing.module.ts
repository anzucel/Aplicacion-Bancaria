import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BloquearCuentaPage } from './bloquear-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: BloquearCuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BloquearCuentaPageRoutingModule {}

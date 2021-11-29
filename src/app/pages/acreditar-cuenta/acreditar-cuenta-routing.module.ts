import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcreditarCuentaPage } from './acreditar-cuenta.page';

const routes: Routes = [
  {
    path: '',
    component: AcreditarCuentaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcreditarCuentaPageRoutingModule {}

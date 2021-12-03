import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransferenciaPropiaPage } from './transferencia-propia.page';

const routes: Routes = [
  {
    path: '',
    component: TransferenciaPropiaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferenciaPropiaPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransferenciaTercerosPage } from './transferencia-terceros.page';

const routes: Routes = [
  {
    path: '',
    component: TransferenciaTercerosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransferenciaTercerosPageRoutingModule {}

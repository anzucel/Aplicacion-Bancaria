import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferenciaTercerosPageRoutingModule } from './transferencia-terceros-routing.module';

import { TransferenciaTercerosPage } from './transferencia-terceros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransferenciaTercerosPageRoutingModule
  ],
  declarations: [TransferenciaTercerosPage]
})
export class TransferenciaTercerosPageModule {}

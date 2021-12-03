import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransferenciaPropiaPageRoutingModule } from './transferencia-propia-routing.module';

import { TransferenciaPropiaPage } from './transferencia-propia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransferenciaPropiaPageRoutingModule
  ],
  declarations: [TransferenciaPropiaPage]
})
export class TransferenciaPropiaPageModule {}

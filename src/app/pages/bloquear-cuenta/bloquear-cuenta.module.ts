import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BloquearCuentaPageRoutingModule } from './bloquear-cuenta-routing.module';

import { BloquearCuentaPage } from './bloquear-cuenta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BloquearCuentaPageRoutingModule
  ],
  declarations: [BloquearCuentaPage]
})
export class BloquearCuentaPageModule {}

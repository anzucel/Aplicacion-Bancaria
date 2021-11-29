import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcreditarCuentaPageRoutingModule } from './acreditar-cuenta-routing.module';

import { AcreditarCuentaPage } from './acreditar-cuenta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcreditarCuentaPageRoutingModule
  ],
  declarations: [AcreditarCuentaPage]
})
export class AcreditarCuentaPageModule {}

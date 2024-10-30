import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyConsultPageRoutingModule } from './my-consult-routing.module';

import { MyConsultPage } from './my-consult.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyConsultPageRoutingModule
  ],
  declarations: [MyConsultPage]
})
export class MyConsultPageModule {}

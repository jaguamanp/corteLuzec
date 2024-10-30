import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyConsultPage } from './my-consult.page';

const routes: Routes = [
  {
    path: '',
    component: MyConsultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyConsultPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Tab1DropPage } from './tab1-drop.page';

const routes: Routes = [
  {
    path: '',
    component: Tab1DropPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Tab1DropPageRoutingModule {}

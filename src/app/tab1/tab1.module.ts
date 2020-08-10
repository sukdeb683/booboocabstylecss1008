import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import { MenuoneComponentModule } from '../menuone/menuone.module';

const tab1routes: Routes = [
  { path: '', component: Tab1Page },
  {
    path: 'tab1-drop',
    loadChildren: () => import('../tab1-drop/tab1-drop.module').then( m => m.Tab1DropPageModule)
  }
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    MenuoneComponentModule,
    RouterModule.forChild(tab1routes),
    Tab1PageRoutingModule
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}

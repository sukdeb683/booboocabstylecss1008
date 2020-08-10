import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Tab1DropPageRoutingModule } from './tab1-drop-routing.module';

import { Tab1DropPage } from './tab1-drop.page';
import { MenuoneComponentModule } from '../menuone/menuone.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab1DropPageRoutingModule,
    MenuoneComponentModule
  ],
  declarations: [Tab1DropPage]
})
export class Tab1DropPageModule {}

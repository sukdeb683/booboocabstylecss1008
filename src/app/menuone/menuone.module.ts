import { MenuoneComponent } from './menuone.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [MenuoneComponent],
  exports:[MenuoneComponent],
  imports: [
    CommonModule, FormsModule, IonicModule
  ]
})
export class MenuoneComponentModule { }

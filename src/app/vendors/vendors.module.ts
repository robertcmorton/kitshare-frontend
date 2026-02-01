import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSliderModule} from '@angular/material/slider';
import { NgxFileDropModule } from 'ngx-file-drop';

const modules = [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, MatSlideToggleModule, MatSliderModule, NgxFileDropModule];

@NgModule({
  imports: modules,
  declarations: [],
  exports: modules
})
export class VendorsModule { }

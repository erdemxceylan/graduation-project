import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NutrientSearchComponent } from './nutrient-search/nutrient-search.component';
import { InputComponent } from './input/input.component';
import { LabelComponent } from './label/label.component';
import { ButtonComponent } from './button/button.component';

@NgModule({
  declarations: [
    NutrientSearchComponent,
    InputComponent,
    LabelComponent,
    ButtonComponent,
  ],
  imports: [CommonModule],
  exports: [
    NutrientSearchComponent,
    InputComponent,
    LabelComponent,
    ButtonComponent,
  ],
})
export class ComponentsModule {}

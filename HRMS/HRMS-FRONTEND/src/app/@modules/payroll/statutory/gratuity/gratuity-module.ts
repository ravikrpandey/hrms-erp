import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GratuityRoutingModule } from './gratuity-routing-module';
import { Gratuitycreate } from './gratuitycreate/gratuitycreate';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectFilterModule } from 'mat-select-filter';

@NgModule({
  declarations: [Gratuitycreate],
  imports: [
    CommonModule,
    GratuityRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSelectFilterModule,
    MatSelectModule,
  ],
})
export class GratuityModule {}

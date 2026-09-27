import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NpsRoutingModule } from './nps-routing-module';
import { Nps } from './nps';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [Nps],
  imports: [
    CommonModule,
    NpsRoutingModule,
   MatFormFieldModule,
   MatSelectModule,
   MatCheckboxModule,
   ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
  ]
})
export class NpsModule { }

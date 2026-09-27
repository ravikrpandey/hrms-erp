import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuperannuationRoutingModule } from './superannuation-routing-module';
import { Superannuation } from './superannuation/superannuation';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [Superannuation],
  imports: [
    CommonModule,
    SuperannuationRoutingModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule


  ]
})
export class SuperannuationModule { }

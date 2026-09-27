import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComplianceFyRoutingModule } from './compliance-fy-routing-module';
import { Compliance } from './compliance/compliance';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';


@NgModule({
  declarations: [Compliance],
  imports: [
    CommonModule,
    ComplianceFyRoutingModule,
    CommonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
  ]
})
export class ComplianceFyModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerReviewRoutingModule } from './customer-review-routing.module';
import { CustomerReviewComponent } from './customer-review.component';
import { CustomerReviewActionComponent } from './customer-review-action/customer-review-action.component';
import { CustomerReviewDialogComponent } from './customer-review-dialog/customer-review-dialog.component';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    CustomerReviewComponent,
    CustomerReviewActionComponent,
    CustomerReviewDialogComponent,
    CustomerReviewStatusComponent
  ],
  imports: [
    CommonModule,
    CustomerReviewRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatSelectFilterModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatIconModule,
    MatTooltipModule
  ]
})
export class CustomerReviewModule { }import { MaterialModule } from 'src/app/@shared/material/material.module';
import { CustomerReviewStatusComponent } from './customer-review-status/customer-review-status.component';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnBoardingEmpListRoutingModule } from './on-boarding-emp-list-routing.module';
import { OnBoardingEmpListComponent } from './on-boarding-emp-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { OnActionComponent } from './on-action/on-action.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OnboardingApprovalDialogComponent } from './onboarding-approval-dialog/onboarding-approval-dialog.component';


@NgModule({
  declarations: [
    OnBoardingEmpListComponent,
    OnActionComponent,
    OnboardingApprovalDialogComponent,
  ],
  imports: [
    CommonModule,
    OnBoardingEmpListRoutingModule,
    MaterialModule,
    AgGridModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatTooltipModule,
  ]
})
export class OnBoardingEmpListModule { }

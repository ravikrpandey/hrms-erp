import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterviewStatusRoutingModule } from './interview-status-routing.module';
import { InterviewStatusListComponent } from './varification-list/varification-list.component';
import { BvgListComponent } from './bvg-list/bvg-list.component';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InterviewUpdateComponent } from './interview-update/interview-update.component';
import { ActionDupComponent } from './actions/actions.component';
import { ActionNotiComponent } from './actionsNoti/actionsNoti.component';
import { MatSelectFilterModule } from 'mat-select-filter';


@NgModule({
  declarations: [
    InterviewStatusListComponent,
    BvgListComponent,
    InterviewUpdateComponent,
    ActionDupComponent,
    ActionNotiComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    InterviewStatusRoutingModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSelectFilterModule
  ]
})
export class InterviewStatusModule { }

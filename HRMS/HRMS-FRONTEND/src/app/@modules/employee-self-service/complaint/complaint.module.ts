import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { ComplaintRoutingModule } from './complaint-routing.module';
import { ComplaintCreateComponent } from './complaint-create/complaint-create.component';
import { ComplaintListComponent } from './complaint-list/complaint-list.component';
import { AgGridModule } from 'ag-grid-angular';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatInputModule} from '@angular/material/input';
import { ActionComponent } from './action/action.component';
import { ComplaintDialogComponent } from './complaint-list/complaint-dialog/complaint-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CKEditorModule } from 'ckeditor4-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AssignedComplaintComponent } from './assigned-complaint/assigned-complaint.component';
import { AgainstComplaintComponent } from './against-complaint/against-complaint.component';
import { AssignedActionComponent } from './assigned-action/assigned-action.component';
import { SearchFilterComponent } from 'src/app/@shared/components/search-filter/search-filter.component';
@NgModule({
  declarations: [
    ComplaintCreateComponent,
    ComplaintListComponent,
    ActionComponent,
    ComplaintDialogComponent,
    AssignedComplaintComponent,
    AgainstComplaintComponent,
    AssignedActionComponent,
  ],
  imports: [
    CommonModule,
    ComplaintRoutingModule,
    MatCardModule,
    AgGridModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatDialogModule,
    MatSelectFilterModule,
    CKEditorModule,
    MaterialModule,
    SearchFilterComponent
  ]
})
export class ComplaintModule { }

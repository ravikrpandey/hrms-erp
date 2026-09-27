import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveManagementRoutingModule } from './leave-management-routing.module';
import { LeavePolicyComponent } from './leave-policy/leave-policy.component';
import { LeaveMasterComponent } from './leave-master/leave-master.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { AddLeaveComponent } from './add-leave/add-leave.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LeaveMgtStatusComponent } from './leave-mgt-status/leave-mgt-status.component';
import { FormsModule } from '@angular/forms';
import { LeaveActionsComponent } from './leave-actions/leave-actions.component';
import { EditLeaveComponent } from './edit-leave/edit-leave.component'; // Add this import
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { CUSTOM_DATE_FORMATS, CustomDateAdapter } from 'src/app/@shared/adapter/custom-date-adapter';

@NgModule({
  declarations: [
    LeavePolicyComponent,
    LeaveMasterComponent,
    AddLeaveComponent,
    LeaveMgtStatusComponent,
    LeaveActionsComponent,
    EditLeaveComponent,
  ],
  imports: [
    CommonModule,
    LeaveManagementRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatSelectFilterModule,
    MaterialModule,
    MatSlideToggleModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    MatTabsModule,
    AgGridModule,
    ReactiveFormsModule,
    FormsModule 
  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
  ],
})
export class LeaveManagementModule { }

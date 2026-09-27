import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShiftListComponent } from './shift-list/shift-list.component';
import { ShiftMasterRouting } from './shift-master-route.routing';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
import { ShiftCreateComponent } from './shift-create/shift-create.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ActionComponent } from './shift-list/action/action.component';
import { DatePipe } from '@angular/common';
import { ActionStatusComponent } from './shift-list/action/action-status/action-status.component';



@NgModule({
  declarations: [
    ShiftListComponent,
    ShiftCreateComponent,
    ActionComponent,
    ActionStatusComponent,
  ],
  providers: [
    DatePipe,
  ],
  imports: [
    CommonModule,
    ShiftMasterRouting,
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
    MatTooltipModule,
    NgxMaterialTimepickerModule,
    NgxMatTimepickerModule,
    DatePipe,
  ]
})
export class ShiftMasterModule { }

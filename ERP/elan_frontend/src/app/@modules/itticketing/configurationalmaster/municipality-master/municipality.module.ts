import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectFilterModule } from 'mat-select-filter';
import { MunicipalityComponent } from './municipality.component';
import { MunicipalityRoutingModule } from './municipality-routing.module';
import { MunicipalityDialogComponent } from './municipality-dialog/municipality-dialog.component';
import { MunicipalityActionComponent } from './municipality-action/municipality-action.component';
import { MunicipalityActionStatusComponent } from './municipality-action/municipality-action-status/municipality-action-status.component';

@NgModule({
  declarations: [
    MunicipalityComponent,
    MunicipalityActionComponent,
    MunicipalityDialogComponent,
    MunicipalityActionStatusComponent
  ],
  imports: [
    CommonModule,
    MunicipalityRoutingModule,
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
  ],
  providers: [DatePipe] 
})
export class MunicipalityModule { }

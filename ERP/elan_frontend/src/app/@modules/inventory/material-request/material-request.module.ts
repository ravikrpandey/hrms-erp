import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MaterialRequestRoutingModule } from './material-request-routing.module';
import { MaterialRequestDetailsComponent } from './material-request-details/material-request-details.component';
import { MaterialAllocateComponent } from './material-allocate/material-allocate.component';
import { ActionComponent } from './action/action.component';


@NgModule({
  declarations: [
    
  
    MaterialRequestDetailsComponent,
              MaterialAllocateComponent,
              ActionComponent
  ],
  imports: [
    CommonModule,
    
    MaterialRequestRoutingModule,
    AgGridModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    ShairedModule,
    MatExpansionModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule
    

  ]
})
export class MaterialRequestModule { }

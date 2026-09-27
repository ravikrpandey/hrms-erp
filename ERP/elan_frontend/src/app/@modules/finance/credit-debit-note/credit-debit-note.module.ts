import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreditDebitNoteRoutingModule } from './credit-debit-note-routing.module';
import { CreditDebitListComponent } from './credit-debit-list/credit-debit-list.component';
 
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
import { ShairedModule } from 'src/app/@shared/shaired/shaired.module';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectFilterModule } from 'mat-select-filter';
import { NgChartsModule } from 'ng2-charts';
import { NgImageSliderModule } from 'ng-image-slider';
import { AddCreditDebitNoteComponent } from './add-credit-debit-note/add-credit-debit-note.component';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CreditDebitNoteActionComponent } from './credit-debit-note-action/credit-debit-note-action.component';
 


@NgModule({
  declarations: [
    CreditDebitListComponent,
     AddCreditDebitNoteComponent,
     CreditDebitNoteActionComponent,
     CreditDebitNoteActionComponent,
  ],
  imports: [
    CommonModule,
    CreditDebitNoteRoutingModule,
    AgGridModule,
        HttpClientModule,
        FormsModule,
        MatFormFieldModule,
       HttpClientModule,
    FormsModule,
   
AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatMenuModule,
    MatSidenavModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
     MatButtonModule,
    MatSelectFilterModule
    
  ]
})
export class CreditDebitNoteModule { }

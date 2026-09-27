import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationsRoutingModule } from './quotations-routing.module';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ApprovedQuotationsComponent } from './approved-quotations/approved-quotations.component';
import { RejectedQuotationsComponent } from './rejected-quotations/rejected-quotations.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { QuotationActionComponent } from './quotation-action/quotation-action.component';
import { MatIconModule } from '@angular/material/icon';
import { QuotationStatusPopComponent } from './quotation-status-pop/quotation-status-pop.component';
import { QuotationStatusComponent } from './quotation-status/quotation-status.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    ApprovedQuotationsComponent,
    RejectedQuotationsComponent,
    QuotationActionComponent,
    QuotationStatusPopComponent,
    QuotationStatusComponent
  ],
  imports: [
    CommonModule,
    QuotationsRoutingModule,
    AgGridModule,
    HttpClientModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatTooltipModule,
    ReactiveFormsModule,
    ShairedModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatIconModule,
    MatSelectModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule
  ],
})
export class QuotationsModule { }

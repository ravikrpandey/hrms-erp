import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from 'src/app/@shared/material/material.module';
import { MatDialogModule } from '@angular/material/dialog';
import { InvoiceRequestRoutingModule } from './invoice-request-routing.module';
import { InvoiceRequestComponent } from './invoice-request.component';
import { RaiseInvoiceComponent } from './raise-invoice/raise-invoice.component';
import { ActionInvoiceRequestComponent } from './action-invoice-request/action-invoice-request.component';
import { ManualInvoiceComponent } from './manual-invoice/manual-invoice.component';
// import { LeadModule } from "../../../lead/lead.module";
import { InvoiceRequestCreateComponent } from './invoice-request-create/invoice-request-create.component';
import { InvoiceRequestListComponent } from './invoice-request-list/invoice-request-list.component';
import { ApprovedInvoiceListComponent } from './approved-invoice-list/approved-invoice-list.component';
import { RejectInvoiceListComponent } from './reject-invoice-list/reject-invoice-list.component';

@NgModule({
    declarations: [
        InvoiceRequestComponent,
        RaiseInvoiceComponent,
        ActionInvoiceRequestComponent,
        ManualInvoiceComponent,
        InvoiceRequestCreateComponent,
        InvoiceRequestListComponent,
        ApprovedInvoiceListComponent,
        RejectInvoiceListComponent
    ],
    imports: [
        CommonModule,
        InvoiceRequestRoutingModule,
        AgGridModule,
        HttpClientModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MaterialModule,
        ReactiveFormsModule,
        MatDialogModule,
        // LeadModule
    ]
})
export class InvoiceRequestModule { }

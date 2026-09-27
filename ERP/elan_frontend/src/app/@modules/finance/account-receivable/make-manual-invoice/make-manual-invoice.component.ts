import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { LeadService } from 'src/app/@shared/services/lead.service';

@Component({
  selector: 'app-make-manual-invoice',
  templateUrl: './make-manual-invoice.component.html',
  styleUrls: ['./make-manual-invoice.component.scss']
})
export class MakeManualInvoiceComponent {
  private gridApi!: GridApi<any>;
  constructor(private activeroute: ActivatedRoute,private fb: FormBuilder,private _empService: EmpRegistrationService,private _finaceService:FinaceService, public dialog: MatDialog, private leadService:LeadService,
   private route:Router,
    
    ){}

  ngOnInint(){

  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    

  }
  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  navigate(){
    this.route.navigate(["master/finance/account-receivable/invoice-request/invoice-request-list"]);
  }

}

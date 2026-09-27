import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { ToastrService } from 'ngx-toastr';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-credit-debit-note-action',
  templateUrl: './credit-debit-note-action.component.html',
  styleUrls: ['./credit-debit-note-action.component.scss']
})
export class CreditDebitNoteActionComponent
  implements OnInit, ICellRendererAngularComp {
  cellValue:any;
constructor(private router:Router,public dialog: MatDialog,private financeService:FinaceService, private toasterService:ToastrService){}

ngOnInit(): void {

}

agInit(params: ICellRendererParams): void {
  this.cellValue = this.getValueToDisplay(params);
}

getValueToDisplay(params: ICellRendererParams) {
  return params.valueFormatted ? params.valueFormatted : params.data
}

refresh(params: ICellRendererParams): boolean {
  this.cellValue = this.getValueToDisplay(params);
  return true;
}






viewChart(event:any){
  event.stopPropagation();
  this.router.navigate(
    ['master/finance/credit-debit-note/add-credit-debit-note'],
    {
      queryParams: {
        id: this.cellValue.id,
        view: true,
        party_type: this.cellValue.party_type
      }
    }
  );
}

reloadCurrentRoute() {
  let currentUrl = this.router.url;
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    this.router.navigate([currentUrl]);
  });
}

}


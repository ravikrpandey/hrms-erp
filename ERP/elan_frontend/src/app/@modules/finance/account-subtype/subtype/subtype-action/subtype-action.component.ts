import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-subtype-action',
  templateUrl: './subtype-action.component.html',
  styleUrls: ['./subtype-action.component.scss']
})
export class SubtypeActionComponent implements OnInit {
  cellValue:any;
constructor(private router:Router,public dialog: MatDialog,){}

ngOnInit(): void {
  
}

agInit(params: ICellRendererParams): void {
  this.cellValue = this.getValueToDisplay(params);
}

getValueToDisplay(params: ICellRendererParams) {
  return params.valueFormatted ? params.valueFormatted : params.data.id;
}

refresh(params: ICellRendererParams): boolean {
  this.cellValue = this.getValueToDisplay(params);
  return true;
}

editSubtype(event:any){
   event.stopPropagation();
    this.router.navigate(['master/finance/account-subtype/list-acc-subtypes/add-subtype'], {
      queryParams: { id: this.cellValue },skipLocationChange:true
    });
}
veiwSubtype(event:any){
   event.stopPropagation();
    this.router.navigate(['master/finance/account-subtype/list-acc-subtypes/view-subtype'], {
      queryParams: { id: this.cellValue },skipLocationChange:true
    });
}
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-chart-account-action',
  templateUrl: './chart-account-action.component.html',
  styleUrls: ['./chart-account-action.component.scss']
})
export class ChartAccountActionComponent implements OnInit {
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

editChart(event:any){
   event.stopPropagation();
    this.router.navigate(['master/finance/account-subtype/account-charts/add-chart'], {
      queryParams: { id: this.cellValue },skipLocationChange:true
    });
}
viewChart(event:any){
   event.stopPropagation();
    this.router.navigate(['master/finance/account-subtype/account-charts/view-chart'], {
      queryParams: { id: this.cellValue },skipLocationChange:true
    });
}
// openDialog() {
//   const dialogRef = this.dialog.open(ViewWorkFlowPrpoComponent, {
//     data: { id: this.cellValue },

//     width: '500px',
//   });

//   dialogRef.afterClosed().subscribe((result:any) => {
    
//   });
  
// }
}


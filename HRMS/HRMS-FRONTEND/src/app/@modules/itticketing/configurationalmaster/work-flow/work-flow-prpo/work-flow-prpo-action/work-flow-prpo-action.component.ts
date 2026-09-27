import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ViewWorkFlowPrpoComponent } from '../view-work-flow-prpo/view-work-flow-prpo.component';

@Component({
  selector: 'app-work-flow-prpo-action',
  templateUrl: './work-flow-prpo-action.component.html',
  styleUrls: ['./work-flow-prpo-action.component.scss']
})
export class WorkFlowPrpoActionComponent  implements OnInit {
  cellValue:any;
constructor(private router:Router,public dialog: MatDialog,){}

ngOnInit(): void {
  
}

agInit(params: ICellRendererParams): void {
  this.cellValue = this.getValueToDisplay(params);
}

getValueToDisplay(params: ICellRendererParams) {
  return params.valueFormatted ? params.valueFormatted : params.data.workflow_id;
}

refresh(params: ICellRendererParams): boolean {
  this.cellValue = this.getValueToDisplay(params);
  return true;
}

editWorklow(event:any){
   event.stopPropagation();
    this.router.navigate(['master/workflow/workflow-PR/add-work-flow'], {
      queryParams: { id: this.cellValue },
    });
}
openDialog() {
  const dialogRef = this.dialog.open(ViewWorkFlowPrpoComponent, {
    data: { id: this.cellValue },

    width: '500px',
  });

  dialogRef.afterClosed().subscribe((result:any) => {
    
  });
  
}
}
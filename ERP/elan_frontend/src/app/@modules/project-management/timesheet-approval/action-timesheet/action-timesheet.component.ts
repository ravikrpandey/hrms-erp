import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { DialogTimesheetApprovalComponent } from '../dialog-timesheet-approval/dialog-timesheet-approval.component';

@Component({
  selector: 'app-action-timesheet',
  templateUrl: './action-timesheet.component.html',
  styleUrls: ['./action-timesheet.component.scss']
})
export class ActionTimesheetComponent {
  timesheet_approval_status : any;
  project_id: any;
  assignAction: any;
  constructor(
    private _rbackService: RbacMasterService,
    public dialog: MatDialog,
  ){}
  ngOnInit(): void {}
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogTimesheetApprovalComponent, {
      width: '800px',
      data: {
        id: this.cellValue,          
        project_id: this.project_id, 
        timesheet_approval_status: this.timesheet_approval_status,
      },
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  getValueToDisplay(params: ICellRendererParams) {
    if (params.data.id) {
      this.project_id = params.data.id;
      this.timesheet_approval_status = params.data.timesheet_approval_status;
      this.assignAction = this._rbackService.accessAssignAction();
      return params.data.id;
    }
}
}

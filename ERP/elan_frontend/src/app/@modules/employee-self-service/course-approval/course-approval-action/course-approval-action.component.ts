import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr'; import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CourseApprovalDialogComponent } from '../course-approval-dialog/course-approval-dialog.component';

@Component({
  selector: 'app-course-approval-action',
  templateUrl: './course-approval-action.component.html',
  styleUrls: ['./course-approval-action.component.scss']
})
export class CourseApprovalActionComponent {
  singleId: any;
  cellValue1: any;
  assignAction: any;
  entity_id: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.cellValue1 = params.data;

  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params?.data?.req_id
  }

  refresh(params: ICellRendererParams): boolean {


    if (params) {
      const data: any = {
        department_name: params.data.department_name.trim(),
        status: params.data.status,

      }
    } else {
      this.toaster.error("department_name is All Ready Exits!", 'Error Message');
    }


    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  createDepartment(data: any) {
    this._configurationalMasterService.createDepartment(data, this.entity_id).subscribe(
      (res: any) => {

        this.toaster.success('Department Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {

        this.toaster.error("department_name is All Ready Exits!", 'Error Message');
      }
    )
  };


  view(e: any) {
    const dialogRef = this.dialog.open(CourseApprovalDialogComponent, {
      data: { id: this.cellValue },

      width: '50%',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

}

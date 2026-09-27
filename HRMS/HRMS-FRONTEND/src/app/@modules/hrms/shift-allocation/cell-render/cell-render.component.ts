import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { EmployeeTransferService } from 'src/app/@shared/services/employee-transfer.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ShiftAllocationService } from 'src/app/@shared/services/shift-allocation.service';

@Component({
  selector: 'app-cell-render',
  templateUrl: './cell-render.component.html',
  styleUrls: ['./cell-render.component.scss'],
})
export class CellRenderComponent {
  assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private shiftAllocatedservices: ShiftAllocationService,
    private toster: ToastrService,
    private _rbackService: RbacMasterService
  ) {}

  ngOnInit(): void {
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
    this.singleData = params?.data;
    this.id = params.data.dept_id;
    console.log(">>>>>>>>>>>>>>>>", typeof(this.id))
  }
  getValueToDisplay(params: ICellRendererParams) {
    this.checkBox = params.data.status;
    if (this.checkBox === 'ACTIVE') {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }

    return params.valueFormatted ? params.valueFormatted : params.data.dept_id;
  }

  id: any;
  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);

    return true;
  }

  toggle(e: any, isChecked: boolean) {
    try {
      e.stopPropagation();
      let status;
      if (isChecked) status = 'ACTIVE';
      else status = 'INACTIVE';

      let body = {
        status: status,
      };
      this.shiftAllocatedservices
        .ShiftAllocationstatusUpdate(this.id, body)
        .subscribe(
          (response: any) => {
            if (response) {
              this.toster.success('Status Changed Successfully');
            }
          },
          (err) => {
            console.log(err);
          }
        );
    } catch (error) {
      console.log(error);
    }
  }
}

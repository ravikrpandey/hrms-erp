import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { HelpdeskService } from 'src/app/@shared/services/HelpDeskService/helpdesk.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
@Component({
  selector: 'app-action-cell-renderer',
  templateUrl: './action-cell-renderer.component.html',
  styleUrls: ['./action-cell-renderer.component.scss'],
})
export class ActionCellRenderer {
 assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;

  constructor(private route: Router,
    public dialog: MatDialog,
    private helpdesk: HelpdeskService,
    private toster: ToastrService,
    private _rbackService: RbacMasterService,

  ) {
  }

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

  }
  getValueToDisplay(params: ICellRendererParams) {
    this.checkBox = params.data.status;
    if (this.checkBox === "ACTIVE") {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }


    return params.valueFormatted
      ? params.valueFormatted
      : params.data.id;
  }

  refresh(params: ICellRendererParams): boolean {

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }


  toggle(e: any, isChecked: boolean) {
    try {
      e.stopPropagation();
      let status;
      if (isChecked) status = "ACTIVE";
      else status = "INACTIVE";

      let body = {
        status: status,
      }
      this.helpdesk.TikcetcategorystatusUpdated(this.cellValue, body).subscribe((response: any) => {
        if (response) {
          this.toster.success("Status Changed Successfully");
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
}

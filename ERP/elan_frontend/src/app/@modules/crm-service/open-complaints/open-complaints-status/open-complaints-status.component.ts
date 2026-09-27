import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service'
@Component({
  selector: 'app-open-complaints-status',
  templateUrl: './open-complaints-status.component.html',
  styleUrls: ['./open-complaints-status.component.scss']
})
export class OpenComplaintsStatusComponent implements OnInit {
  assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;
  constructor(private route: Router,
    public dialog: MatDialog,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toster: ToastrService,
    private $crm: CrmService,
    private _rbackService: RbacMasterService,) { }

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
    this.cellValue = this.statuseServicecenterMasterById(params);
    this.singleData = params?.data;

  }
  statuseServicecenterMasterById(params: ICellRendererParams) {
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

    this.cellValue = this.statuseServicecenterMasterById(params);
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
      this._configurationalMasterService.statuseServicecenterMasterById(this.cellValue, this.checkBox).subscribe((response: any) => {
        if (response) {
          this.toster.success("Status Changed Successfully..");
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }
  // Form update end
}

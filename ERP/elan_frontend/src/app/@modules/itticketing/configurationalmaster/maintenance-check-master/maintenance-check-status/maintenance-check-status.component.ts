import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-maintenance-check-status',
  templateUrl: './maintenance-check-status.component.html',
  styleUrls: ['./maintenance-check-status.component.scss']
})
export class MaintenanceCheckStatusComponent {
  assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;
  constructor(private route: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toster: ToastrService,
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
    this.cellValue = this.statusUpdate(params);
    this.singleData = params?.data;

  }
  statusUpdate(params: ICellRendererParams) {
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

    this.cellValue = this.statusUpdate(params);
    return true;
  }

  toggle(e: any, isChecked: boolean) {
    try {
      e.stopPropagation();
      let status;
      if (isChecked) status = "ACTIVE";
      else status = "INACTIVE";
      let data={
        id:this.singleData?.id,
        status:status
      }
      // this._configurationalMasterService.changeIssue_Status(data).subscribe((response: any) => {
      //   if (response) {
      //     this.toster.success("Status Changed Successfully..");
      //   }
      // }, (err:any) => {
      //   console.log(err);
      // })
    } catch (error) {
      console.log(error);
    }
  }
  // Form update end
}



import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';

@Component({
  selector: 'app-kpa-status',
  templateUrl: './kpa-status.component.html',
  styleUrls: ['./kpa-status.component.scss']
})
export class KpaStatusComponent {
  assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;
  idGet: any;
  public cellValue: any;
  constructor(private route: Router,
    public dialog: MatDialog,
    private _hrmMasterService: HrmServiceService,
    private toster: ToastrService,
  ) {
  }

  ngOnInit(): void {
    this.assignAction = this._hrmMasterService.accessAssignAction();
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params?.data;
    this.idGet=params?.data?.id
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
    // set value into cell again
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  // Form update start
  toggle(e: any, isChecked: boolean) {
    try {
      e.stopPropagation();
      let status;
      if (isChecked) status = "ACTIVE";
      else status = "INACTIVE";

      let body = {
        status: status,
      }
      // console.log(this.cellValue,'this.cellValue');
      // console.log("this.idGet_staus",this.idGet);
      // console.log("body of status",body);
      
    
      
      this._hrmMasterService.updatekpaStatus(this.idGet, body).subscribe((response: any) => {
        if (response) {
          this.toster.success("Status Changed Successfully");
          this.reloadCurrentRoute();
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

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-zone-typestatus',
  templateUrl: './zone-typestatus.component.html',
  styleUrls: ['./zone-typestatus.component.scss'],
})
export class ZoneTypestatusComponent {

  isChecked = false;
  cellValue: any;
  rowData: any;

  constructor(
    private router: Router,
    private _configService: ConfigurationalmasterService,
    private toastr: ToastrService,
    private _rbac: RbacMasterService,
    private _commonService: CommonService,
  ) {}

  agInit(params: ICellRendererParams): void {
    this.rowData = params.data;
    this.cellValue = params.data.id;
    this.isChecked = params.data.status === "ACTIVE";
  }

  toggle(event: any) {
    event.source._elementRef.nativeElement.stopPropagation?.();

    const newStatus = event.checked ? "ACTIVE" : "INACTIVE";

    this._commonService.showLoader();
    this._configService.updateZoneType(this.cellValue, { status: newStatus })
      .subscribe(
        () => {
          this._commonService.hideLoader();
          this.toastr.success('Status Updated Successfully');
        },
        () => {
          this._commonService.hideLoader();
          this.toastr.error("Failed to update status");
        }
      );
  }
}

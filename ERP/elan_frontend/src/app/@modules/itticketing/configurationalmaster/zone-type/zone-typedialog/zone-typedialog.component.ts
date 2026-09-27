import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-zone-typedialog',
  templateUrl: './zone-typedialog.component.html',
  styleUrls: ['./zone-typedialog.component.scss'],
})
export class ZoneTypedialogComponent {

  cellValue: any;
  rowData: any;
  assignAction: any;

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private _configService: ConfigurationalmasterService,
    private _rbac: RbacMasterService,
    private _commonService: CommonService,
  ) {}

  agInit(params: ICellRendererParams): void {
    this.rowData = params.data;
    this.cellValue = params.data.id;
    this.assignAction = this._rbac.accessAssignAction();
  }

  edit(event: any) {
    event.stopPropagation();
    this.router.navigate(['master/configurational-master/zone-type-master/create-zone'], {
      queryParams: { id: this.cellValue, action_type: 'edit' }
    });
  }

  view(event: any) {
    event.stopPropagation();
    this.router.navigate(['configurational-master/zone-type-master/create-zone'], {
      queryParams: { id: this.cellValue, action_type: 'view' }
    });
  }

  delete(event: any) {
    event.stopPropagation();

    Swal.fire({
      title: 'Do You Want to Remove?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#3f51b5",
      cancelButtonColor: "#f44336",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (!result.isConfirmed) return;

      this._commonService.showLoader();
      this._configService.deletezoneTypeById(this.cellValue).subscribe(
        (res) => {
          this._commonService.hideLoader();
          this.toastr.success('Deleted Successfully');
          window.location.reload();
        },
        (err) => {
          this._commonService.hideLoader();
          this.toastr.error("Something went wrong. Please try again.");
        }
      );
    });
  }
}

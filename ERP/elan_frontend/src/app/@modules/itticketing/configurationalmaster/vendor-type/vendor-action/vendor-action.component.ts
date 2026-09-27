import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-action',
  templateUrl: './vendor-action.component.html',
  styleUrls: ['./vendor-action.component.scss']
})
export class VendorActionComponent implements OnInit {
  assignAction: any;
  public cellValue: any;

  constructor(
    private route: Router,
    private toaster: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService
  ) {}

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    this.route.navigate(
      ['master/configurational-master/travel-master/add-travel-type'],
      {
        queryParams: { id: this.cellValue, mode: 'edit', type: 'vendor-type' },
      }
    );
  }

  view(e: any) {
    this.route.navigate(
      ['master/configurational-master/travel-master/add-travel-type'],
      {
        queryParams: { id: this.cellValue, mode: 'view', type: 'vendor-type' },
      }
    );
  }

  delete(e: any) {
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this._configurationalMasterService
          .deleteTravelType(this.cellValue)
          .subscribe(
            (res) => {
              this.toaster.success('Deleted successfully');
              this.reloadCurrentRoute();
            },
            (err) => {
              this.toaster.error(
                'Something went wrong. Please try again',
                'Error Message'
              );
            }
          );
      }
    });
  }
}
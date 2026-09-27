import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-price-action',
  templateUrl: './price-action.component.html',
  styleUrls: ['./price-action.component.scss']
})
export class PriceActionComponent {
  paramsVal: any;
  params: any;
  cellValue1: any;
  assignAction: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
    private _commonService: CommonService
  ) { }

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
    this.params = params;
    this.paramsVal = params.data.id;
    this.cellValue = this.getValueToDisplay(params);
    this.cellValue1 = params.data;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.id
  }

  edit(e: any) {
    e.stopPropagation();
    this.router.navigate(['master/configurational-master/price-master/create'], { queryParams: { id: this.cellValue1.id, action_type: 'edit' } })
  }

  view(e: any) {
    e.stopPropagation();
    this.router.navigate(['master/configurational-master/price-master/create'], { queryParams: { id: this.cellValue1.id, action_type: 'view' } })
  }

  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Do You Want to Remove?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._commonService?.showLoader()
        this._configurationalmasterService.deletePriceList(this.cellValue1.id).subscribe(
          (res) => {
            this._commonService?.hideLoader()
            this.toaster.success('Delete successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this._commonService?.hideLoader()
            this.toaster.error("Somthing went wrong.. Please try agin", "Error Message")
          }
        )
      }
    });
  }

}

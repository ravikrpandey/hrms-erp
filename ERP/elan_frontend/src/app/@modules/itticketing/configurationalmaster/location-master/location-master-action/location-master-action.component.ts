import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-location-master-action',
  templateUrl: './location-master-action.component.html',
  styleUrls: ['./location-master-action.component.scss']
})
export class LocationMasterActionComponent {
  singleId: any;
  paramsVal: any;
  params: any;
  cellValue1: any;
  assignAction: any;
  scannedData: any;
  qrCodeImageUrl: string | null = null;
  itemType: any = [];
  entity_id: any;
  financial_year_id: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
    private prService: PurchaseRequestService,
    private _commonService: CommonService,
    private _empRegistration: EmpRegistrationService,

  ) { }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    // this.getItemType();
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
    // console.log("this.cellValue ---this.cellValue", this.cellValue)
    this.cellValue1 = params.data;
    this.entity_id = localStorage.getItem('entity_id');
    this.financial_year_id = localStorage.getItem('financial_year_id');
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.id
  }

  // getItemType() {
  //   this._configurationalmasterService.getItemType().subscribe(
  //     (res: any) => {
  //       if (res.data) {
  //         this.itemType = res.data;
  //       }
  //     },
  //     (err: any) => {
  //       console.log(err.error.message);
  //     }
  //   );
  // }

  edit(e: any) {
    e.stopPropagation();
    this.router.navigate(['master/configurational-master/location-master/create_location'], { queryParams: { id: this.cellValue, action_type: 'edit' } })
  }

  view(e: any) {
    e.stopPropagation();
    this.router.navigate(['master/configurational-master/location-master/create_location'], { queryParams: { id: this.cellValue, action_type: 'view' } })
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
        this._empRegistration.deleteLocation(this.cellValue).subscribe(
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

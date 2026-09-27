import { Component } from '@angular/core';
import { CourierDailogComponent } from '../courier-dailog/courier-dailog.component';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-courier-action',
  templateUrl: './courier-action.component.html',
  styleUrls: ['./courier-action.component.scss']
})
export class CourierActionComponent {
  courier_Service_id: any;
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;
  allCurrencyData: any;

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);

    this.courier_Service_id = params.data.courier_Service_id
  }
  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted ? params.valueFormatted : params.data.courier_Service_id
  }

  refresh(params: ICellRendererParams): boolean {
    if (params) {
      const data: any = {
        courier_Service_name: params.data.courier_Service_name.trim(),
        status: params.data.status,
      }

      if (params.data.color === null && params.data.color !== "") {

        this.createAssetCategory(data);
      } else {
        const courier_Service_id: number = Number(params.data.courier_Service_id);
      }

    } else {
      this.toaster.error("Asset Category is All Ready Exits!", 'Error Message');
    }


    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  createAssetCategory(data: any) {
    this._configurationalmasterService.createCourier(data).subscribe(
      (res: any) => {

        this.toaster.success('Asset category Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {

        this.toaster.error("Asset category is All Ready Exits!", 'Error Message');
      }
    )
  };

  // openDialog() {
  //   const dialogRef
  //     = this.dialog.open(CourierDailogComponent, {
  //       width: '30%',
  //       data: { id: this.courier_Service_id }

  //     });

  //   dialogRef.afterClosed().subscribe(result => {

  //   });


  // }
  edit(e: any) {

    const dialogRef = this.dialog.open(CourierDailogComponent, {
      data: { id: this.cellValue },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
  view(e: any) {
    const dialogRef = this.dialog.open(CourierDailogComponent, {
      data: { id: this.cellValue, view: "view" },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._configurationalmasterService.CourierDelete(this.cellValue).subscribe(
          (res) => {

            this.toaster.success('Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")

          }
        )
      }
    });
  }
}


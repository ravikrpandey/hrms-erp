import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ContainDailogComponent } from '../contain-dailog/contain-dailog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-contain-action',
  templateUrl: './contain-action.component.html',
  styleUrls: ['./contain-action.component.scss']
})
export class ContainActionComponent {
  courier_contains_id: any;
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
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

    this.courier_contains_id = params.data.courier_contains_id
  }
  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted ? params.valueFormatted : params.data.courier_contains_id
  }

  refresh(params: ICellRendererParams): boolean {
    if (params) {
      const data: any = {
        courier_contains_name: params.data.courier_contains_name.trim(),
        status: params.data.status,
      }

      if (params.data.color === null && params.data.color !== "") {

        this.createAssetCategory(data);
      } else {
        const courier_contains_id: number = Number(params.data.courier_contains_id);
      }

    } else {
      this.toaster.error("Asset Category is All Ready Exits!", 'Error Message');
    }


    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  createAssetCategory(data: any) {
    this._configurationalMasterService.createContains(data).subscribe(
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
  //     = this.dialog.open(ContainDailogComponent, {
  //       width: '30%',
  //       data: { id: this.courier_contains_id }

  //     });

  //   dialogRef.afterClosed().subscribe(result => {

  //   });


  // }

  edit(e: any) {

    const dialogRef = this.dialog.open(ContainDailogComponent, {
      data: { id: this.cellValue },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
  view(e: any) {
    const dialogRef = this.dialog.open(ContainDailogComponent, {
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
        this._configurationalMasterService.deleteContains(this.cellValue).subscribe(
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

import { Component } from '@angular/core';
import { AmcDailogComponent } from '../amc-dailog/amc-dailog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';


@Component({
  selector: 'app-laaction-amc-des',
  templateUrl: './laaction-amc-des.component.html',
  styleUrls: ['./laaction-amc-des.component.scss']
})
export class LaactionAmcDesComponent {
  amc_description_id: any;
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

    this.amc_description_id = params.data.amc_description_id
  }
  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted ? params.valueFormatted : params.data.amc_description_id
  }

  refresh(params: ICellRendererParams): boolean {
    if (params) {
      const data: any = {
        amc_description: params.data.amc_description.trim(),
        status: params.data.status,
      }

      if (params.data.color === null && params.data.color !== "") {

        this.createAmcDes(data);
      } else {
        const amc_description_id: number = Number(params.data.amc_description_id);
      }

    } else {
      this.toaster.error("Asset Category is All Ready Exits!", 'Error Message');
    }


    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  createAmcDes(data: any) {
    this._configurationalMasterService.createAmcDes(data).subscribe(
      (res: any) => {

        this.toaster.success('Amc Des.. Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {

        this.toaster.error("Amc Des.. is All Ready Exits!", 'Error Message');
      }
    )
  };

  openDialog() {
    const dialogRef
      = this.dialog.open(AmcDailogComponent, {
        width: '30%',
        data: { id: this.amc_description_id }

      });

    dialogRef.afterClosed().subscribe(result => {

    });


  }

  edit(e: any) {

    const dialogRef = this.dialog.open(AmcDailogComponent, {
      data: { id: this.cellValue },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }
  view(e: any) {
    const dialogRef = this.dialog.open(AmcDailogComponent, {
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
        this._configurationalMasterService.DeleteAmcDes(this.cellValue).subscribe(
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

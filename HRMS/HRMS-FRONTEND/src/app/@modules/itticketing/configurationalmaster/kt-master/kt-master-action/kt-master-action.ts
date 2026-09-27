import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { KtMasterCreateDialog } from '../kt-master-create-dialog/kt-master-create-dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-kt-master-action',
  templateUrl: './kt-master-action.html',
  styleUrls: ['./kt-master-action.scss']
})
export class KtMasterAction {

  paramsVal: any;
  assignAction: any;
  singleData: any = {};
  isChecked = false;
  checkBox: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService
  ) {

  }
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
    this.paramsVal = params.data.id;
    this.cellValue = this.getValueToDisplay(params);

  }
  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted
      ? params.valueFormatted
      : params.data.id;
  }
  refresh(params: ICellRendererParams): boolean {

    // write code to modify cell

    //EDIT DATA FROM API
    if (params) {
      const data: any = {
        category_name: params.data.category_name,
        description: params.data.description,
        status: params.data.status,
      };
      if (params.data.color === null && params.data.color !== '') {
        this.createKtCategory(data);
      } else {
        const id: number = Number(params.data.id);
        // this.updateGrade(business_unit_id, data);
      }
    } else {
      this.toaster.error(
        "KT Category Name All Ready Exits!",
        'Error Message'
      );
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  createKtCategory(data: any) {
    this._configurationalmasterService.createKtCategory(data).subscribe(
      (res: any) => {

        this.toaster.success('KT Category Name Created Successfully!');
        this.reloadCurrentRoute();
      },
      (err: any) => {

        this.toaster.error(
          "KT Category Name is All Ready Exits!",
          'Error Message'
        );
      }
    );
  }

  // updateGrade(id: any, data: any) {
  //   this._configurationalmasterService.editGrade(id, data).subscribe(
  //     (res: any) => {
  //       
  //       this.toaster.success('Updated Successfully!');
  //       this.reloadCurrentRoute()
  //     },
  //     (err: any) => {
  //       this.toaster.error(
  //         'Something went wrong please try again',
  //         'Error Message'
  //       );
  //       
  //     }
  //   );
  // }
  openDialog() {
    const dialogRef = this.dialog.open(KtMasterCreateDialog, {
      data: { visible: 'visible', id: this.paramsVal },
      width: '40%',
    })
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  editData() {
    const dialogRef = this.dialog.open(KtMasterCreateDialog, {
      data: { grade: 'edit', id: this.paramsVal },
      width: '40%',
    })
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
  deleteData(event: any) {
    event.stopPropagation();
    Swal.fire({
      title: 'Are you sure want to remove?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._configurationalmasterService.deleteKtCategoryById(this.cellValue).subscribe(
          (res) => {

            this.toaster.success('Deleted successfully!');
            this.reloadCurrentRoute();
          },
          (err) => {
            this.toaster.error("Somthing went wrong, Please try again!", "Error Message!")

          }
        )
      }
    });
  }

}

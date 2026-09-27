import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { AssetcategoryDialog } from '../assetcategory-dialog/assetcategory-dialog';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service'

@Component({
  selector: 'app-assetcategory-action',
  templateUrl: './assetcategory-action.html',
  styleUrls: ['./assetcategory-action.scss'],
})
export class AssetcategoryAction {
  paramsVal: any;
  mainId: any
  assignAction: any;
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
    this.mainId = localStorage.getItem('EmpMainId');
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
    this.paramsVal = params.data.asset_category_id;
    this.cellValue = this.getValueToDisplay(params);

  }
  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted
      ? params.valueFormatted
      : params.data.asset_category_id;
  }
  refresh(params: ICellRendererParams): boolean {

    // write code to modify cell

    //EDIT DATA FROM API
    if (params) {
      const data: any = {
        asset_category_name: params.data.asset_category_name,
        status: params.data.status,
      };
      if (params.data.color === null && params.data.color !== '') {
        this.assetCategoryCreate(data);
      } else {
        const asset_category_id: number = Number(params.data.asset_category_id);
        // this.updateGrade(asset_category_id, data);
      }
    } else {
      this.toaster.error(
        "Asset category already exists!",
        'Error Message'
      );
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  assetCategoryCreate(data: any) {
    this._configurationalmasterService.assetCategoryCreate(data).subscribe(
      (res: any) => {

        this.toaster.success('Asset Category Created Successfully!');
        this.reloadCurrentRoute();
      },
      (err: any) => {

        this.toaster.error(
          "Asset category already exists!",
          'Error Message'
        );
      }
    );
  }
  openDialog() {
    const dialogRef = this.dialog.open(AssetcategoryDialog, {
      data: { visible: 'visible', id: this.paramsVal },
      width: '30%',
    })
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  editData() {
    const dialogRef = this.dialog.open(AssetcategoryDialog, {
      data: { category: 'edit', id: this.paramsVal },
      width: '30%',
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
        this._configurationalmasterService.deleteAssetCategory(this.cellValue).subscribe(
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
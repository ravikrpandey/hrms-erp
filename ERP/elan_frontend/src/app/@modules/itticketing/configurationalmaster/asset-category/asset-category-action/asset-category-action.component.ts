import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { AssetCategoryDilogComponent } from '../asset-category-dilog/asset-category-dilog.component';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { DEFAULT_CATEGORIES } from 'src/app/@shared/global.variable';

@Component({
  selector: 'app-asset-category-action',
  templateUrl: './asset-category-action.component.html',
  styleUrls: ['./asset-category-action.component.scss'],
})
export class AssetCategoryActionComponent {
  assignAction: any;
  public data: any;
  defaultCategory = DEFAULT_CATEGORIES;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private toaster: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
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
    this.data = params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.data = params.data;
    return true;
  }

  edit(e: any) {
    const dialogRef = this.dialog.open(AssetCategoryDilogComponent, {
      data: { id: this.data.id },
      width: '30%',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  view(e: any) {
    const dialogRef = this.dialog.open(AssetCategoryDilogComponent, {
      data: { id: this.data.id, view: 'view' },
      width: '30%',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  delete(e: any) {
    e.stopPropagation();
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
          .deleteAssetMaster(this.data.id)
          .subscribe(
            (res) => {
              this.toaster.success('Deleted successfully ');
              this.reloadCurrentRoute();
            },
            (err) => {
              this.toaster.error(
                'Somthing went wrong Please try agin',
                'Error Message',
              );
            },
          );
      }
    });
  }

  isNotShowable() {}
}

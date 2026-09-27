import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service'
import { AssetAllotmentCompDialog } from '../asset-allotment-comp-dialog/asset-allotment-comp-dialog';
import { AssetallotmentService } from '../../assetallotment-service';

@Component({
  selector: 'app-asset-allotment-comp-action',
  templateUrl: './asset-allotment-comp-action.html',
  styleUrls: ['./asset-allotment-comp-action.scss'],
})
export class AssetAllotmentCompAction {
paramsVal: any;
  mainId: any
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _assetAllotmentService: AssetallotmentService,
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
    this.paramsVal = params.data.asset_allotment_id;
    this.cellValue = this.getValueToDisplay(params);

  }
  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted
      ? params.valueFormatted
      : params.data.asset_allotment_id;
  }
  refresh(params: ICellRendererParams): boolean {

    // write code to modify cell

    //EDIT DATA FROM API
    if (params) {
      const data: any = {
        asset_master_name: params.data.asset_master_name,
        status: params.data.status,
      };
      if (params.data.color === null && params.data.color !== '') {
        this.assetAllotmentCreate(data);
      } else {
        const asset_allotment_id: number = Number(params.data.asset_allotment_id);
        // this.updateGrade(asset_allotment_id, data);
      }
    } else {
      this.toaster.error(
        "asset_master_name is All Ready Exits!",
        'Error Message'
      );
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  assetAllotmentCreate(data: any) {
    this._assetAllotmentService.assetAllotmentCreate(data).subscribe(
      (res: any) => {

        this.toaster.success('Asset Allotment Created Successfully!');
        this.reloadCurrentRoute();
      },
      (err: any) => {

        this.toaster.error(
          "asset_master_name is All Ready Exits!",
          'Error Message'
        );
      }
    );
  }
  openDialog() {
    const dialogRef = this.dialog.open(AssetAllotmentCompDialog, {
      data: { visible: 'visible', id: this.paramsVal },
      width: '30%',
    })
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  editData() {
    const dialogRef = this.dialog.open(AssetAllotmentCompDialog, {
      data: { assetallotment: 'edit', id: this.paramsVal },
      width: '30%',
    })
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
}
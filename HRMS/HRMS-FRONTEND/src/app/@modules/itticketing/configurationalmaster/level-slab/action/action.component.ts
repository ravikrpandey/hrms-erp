import { Component } from '@angular/core';
import {
  ICellRendererParams,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LevelDialogComponent } from '../level-dialog/level-dialog.component';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';


@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
  isChecked = false;
  achieveId: any;
  checkedActive: any;
  checkedInActive: any;
  levelSlab: any;
  checkBox: any;
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
    this.getCustomerType();
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;
  allCustomerTypeData: any;

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
    this.checkBox = params.data.isChecked;

    if (this.checkBox === true) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }


    return params.valueFormatted
      ? params.valueFormatted
      : params.data.level_slab_id;
  }
  refresh(params: ICellRendererParams): boolean {

    // wrirte code to modify cell

    if (params) {
      const data: any = {
        level_slab_name: params.data.level_slab_name.trim(),
      }
      if (params.data.color === null && params.data.color !== "") {


        this.createLevelSlab(data);
      } else {
        const level_slab_id: number = Number(params.data.level_slab_id);
        this.updateSingleLevel(level_slab_id, data);

      }
    } else {
      this.toaster.error('Something went wrong please try again', 'Error Message');
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  createLevelSlab(data: any) {
    this._configurationalmasterService.CreateLevelSlab(data).subscribe(
      (res: any) => {

        this.toaster.success('Level Slab Created Successfully');
        this.reloadCurrentRoute();
      },
      (err: any) => {

        this.toaster.error(
          'Something went wrong please try again',
          'Error Message'
        );
      }
    );
  }

  updateSingleLevel(id: any, data: any) {
    this._configurationalmasterService.updateSingleLevelSlab(id, data).subscribe(
      (res: any) => {

        this.toaster.success('Level Slab Updated Successfully')
      }, (err: any) => {
        this.toaster.error('Something went wrong please try again', 'Error Message');

      });
  };

  toggle(e: any, isChecked: boolean) {
    e.stopPropagation();

    // let checked =isChecked;


    if (isChecked) {
      this.checkedActive = 'ACTIVE';


      // 
    } else {
      this.checkedActive = 'INACTIVE';

      // 
    }

    let body = {
      status: this.checkedActive,
      isChecked: isChecked,
    }

    if (this.checkBox === true) {
      this._configurationalmasterService.editLevelSlab(this.cellValue, body).subscribe((res: any) => {
        this.levelSlab = res;
        this.toaster.success("Training Name successfully Inactivate")


      })
      this.reloadCurrentRoute();
    } else {
      this._configurationalmasterService.editLevelSlab(this.cellValue, body).subscribe((res: any) => {
        this.levelSlab = res;
        this.toaster.success("Training Name successfully activate")

      })
      this.reloadCurrentRoute();
    }

  }
  openDialog() {


    const dialogRef = this.dialog.open(LevelDialogComponent, {
      width: '30%',
      data: { id: this.cellValue },
    });

    dialogRef.afterClosed().subscribe((result) => {

    });

  }


  getCustomerType() {
    this._configurationalmasterService.getCustomerType().subscribe((res: any) => {
      this.allCustomerTypeData = res.data;

    });
  }

  edit(e: any) {

    const dialogRef = this.dialog.open(LevelDialogComponent, {
      data: { id: this.cellValue },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  view(e: any) {
    const dialogRef = this.dialog.open(LevelDialogComponent, {
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
        this._configurationalmasterService.deleteSlab(this.cellValue).subscribe(
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


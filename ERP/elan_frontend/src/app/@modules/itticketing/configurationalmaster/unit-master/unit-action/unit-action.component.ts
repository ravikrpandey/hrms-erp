import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { UnitDialogComponent } from '../unit-dialog/unit-dialog.component';

@Component({
  selector: 'app-unit-action',
  templateUrl: './unit-action.component.html',
  styleUrls: ['./unit-action.component.scss']
})
export class UnitActionComponent {
  isChecked = false;
  checkedActive: any;
  checkedInActive: any;
  unit_name: any;
  checkBox: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private toaster: ToastrService,
  ) {
  }

  ngOnInit(): void { }
  public cellValue: any;
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

    return params.valueFormatted ? params.valueFormatted : params.data.unit_id
  }
  refresh(params: ICellRendererParams): boolean {
    if (params) {
      const data: any = {
        unit_name: params.data.unit_name.trim(),
      }
      if (params.data.color === null && params.data.color !== "") {
        this.createUnit(data);
      } else {
        const unit_id: number = Number(params.data.unit_id);
        this.updateUnit(unit_id, data);

      }
    } else {
      this.toaster.error('Something went wrong please try again', 'Error Message');
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  createUnit(data: any) {
    this._configurationalmasterService.createUnit(data).subscribe(
      (res: any) => {

        this.toaster.success('Unit Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {

        this.toaster.error("unit_name is All Ready Exits!");
      }
    )
  };

  updateUnit(id: any, data: any) {
    this._configurationalmasterService.editUnit(id, data).subscribe(
      (res: any) => {

        this.toaster.success('Unit Updated Successfully')
      }, (err: any) => {
        this.toaster.error("unit_name is All Ready Exits!");

      });
  };

  toggle(e: any, isChecked: boolean) {
    e.stopPropagation();
    if (isChecked) {
      this.checkedActive = 'ACTIVE';
    } else {
      this.checkedActive = 'INACTIVE';
    }

    let body = {
      status: this.checkedActive,
      isChecked: isChecked,
    }

    if (this.checkBox === true) {
      this._configurationalmasterService.editUnit(this.cellValue, body).subscribe((res: any) => {
        this.unit_name = res;
        this.toaster.success("Unit data successfully Inactivate")



      })
      this.reloadCurrentRoute();
    } else {
      this._configurationalmasterService.editUnit(this.cellValue, body).subscribe((res: any) => {
        this.unit_name = res;
        this.toaster.success("Unit data successfully activate")


      })
      this.reloadCurrentRoute();
    }

  }
  openDialog() {
    const dialogRef
      = this.dialog.open(UnitDialogComponent, {
        width: '30%',
        // maxWidth: '100vw',
        // maxHeight: '100vh',
        // height: '100%',
        // panelClass: 'full-screen-modal',
        data: { id: this.cellValue }

      });

    dialogRef.afterClosed().subscribe(result => {

    });


  }
}

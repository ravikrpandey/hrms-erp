import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import Swal from 'sweetalert2';
import { CityMasterDialogComponent } from '../city-master-dialog/city-master-dialog.component';

@Component({
  selector: 'app-city-master-action',
  templateUrl: './city-master-action.component.html',
  styleUrls: ['./city-master-action.component.scss']
})
export class CityMasterActionComponent {
  allStateData: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private toaster: ToastrService,
  ) {
  }

  ngOnInit(): void {
  }

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
    return params.valueFormatted ? params.valueFormatted : params.data.city_id
  }

  refresh(params: ICellRendererParams): boolean {
    if (params) {
      const data: any = {
        city_id: params.data.city_id,
        city_name: params.data.city_name.trim(),
      }
      if (params.data.color === null && params.data.color !== "") {
        this.createCountry(data);
      } else {
        const city_id: number = Number(params.data.city_id);
        // this.updateSingleCountry(country_id, data);
      }
    } else {
      this.toaster.error('Something went wrong please try again', 'Error Message');
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    const dialogRef = this.dialog.open(CityMasterDialogComponent, {
      data: { id: this.cellValue },
      width: '500px',
    });
    dialogRef.afterClosed().subscribe((result) => { });
  }

  createCountry(data: any) {
    this._configurationalmasterService.createCountry(data).subscribe(
      (res: any) => {
        this.toaster.success('Country Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {
        this.toaster.error("countryss_name is All Ready Exits!");
      }
    )
  };

  updateSingleCountry(id: any, data: any) {
    this._configurationalmasterService.updateSingleCountry(id, data).subscribe(
      (res: any) => {
        this.toaster.success('Country Updated Successfully')
      }, (err: any) => {
        this.toaster.error("Name is All Ready Exits!", 'Error Message');
      });
  };

  openDialog() {
    const dialogRef
      = this.dialog.open(CityMasterDialogComponent, {
        width: '30%',
        data: { id: this.cellValue, view: 'view' }
      });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getState() {
    this._configurationalmasterService.getState().subscribe((res: any) => {
      this.allStateData = res.data
    })
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
        this._configurationalmasterService.deleteSingleCity(this.cellValue).subscribe(
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

import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { CreateTransportChargeComponent } from '../create-transport-charge/create-transport-charge.component';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-transporter-charge-action',
  templateUrl: './transporter-charge-action.component.html',
  styleUrls: ['./transporter-charge-action.component.scss']
})
export class TransporterChargeActionComponent {
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
    return params.valueFormatted ? params.valueFormatted : params.data.id
  }

  refresh(params: ICellRendererParams): boolean {
    if (params) {
      const data: any = {
        id: params.data.id,
        charge_name: params.data.charge_name.trim(),
      }
      if (params.data.color === null && params.data.color !== "") {
      
      } else {
        const city_id: number = Number(params.data.id);
        // this.updateSingleCountry(country_id, data);
      }
    } else {
      this.toaster.error('Something went wrong please try again', 'Error Message');
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    
    const dialogRef = this.dialog.open(CreateTransportChargeComponent, {
      data: { id: this.cellValue },
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

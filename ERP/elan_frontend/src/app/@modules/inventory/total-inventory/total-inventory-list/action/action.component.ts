import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
    
  constructor(private route: Router,
    public dialog: MatDialog,
    private toast: ToastrService,
    private location: Location,
  ) {
  }

  ngOnInit(): void {
  }
  public cellValue: any;
  public managedBy: any;

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    // console.log(this.cellValue,"----- ----- this is the assined cellvalue ----- -----");
    
    this.managedBy = this.cellValue.manage_by;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  redirect(e: any) {
    e.stopPropagation();
    if ( this.managedBy == 'Batch Only'){
      const navigationExtras: NavigationExtras = {
        queryParams:{ cellData: JSON.stringify(this.cellValue) },
        skipLocationChange: true,
      };
      this.route.navigate(["master/inventory-management/total-inventory/batch-allocation"],navigationExtras);
    }else if (this.managedBy == 'S.No. Only'){
      const navigationExtras: NavigationExtras = {
        queryParams:{ cellData: JSON.stringify(this.cellValue) },
        skipLocationChange: true,
      };
      this.route.navigate(["master/inventory-management/total-inventory/serial-allocation"],navigationExtras);
    }
  }

  graphRedirect(e: any){
    this.route.navigate(["master/inventory-management/total-inventory/dashboard"],{ queryParams: { id: 1 } });
  }

  openDialog(e: any) {
  }

}


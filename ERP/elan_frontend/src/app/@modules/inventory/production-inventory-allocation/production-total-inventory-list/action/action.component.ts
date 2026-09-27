import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    // this.managedBy = this.cellValue.managed_by;
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    
    this.cellValue = this.getValueToDisplay(params);
    console.log(this.cellValue,"cell val ");
    
    return true;
  }

  // redirect(e: any) {
  //   e.stopPropagation();
  //   if ( this.managedBy == 'Batch'){
  //     this.route.navigate(["master/inventory-management/inventory-allocation/production-batch-allocation"],{ queryParams: { id: 1 } });
  //   }else if (this.managedBy == 'Serial No'){
  //     this.route.navigate(["master/inventory-management/inventory-allocation/production-serial-allocation"],{ queryParams: { id: 1 } });
  //   }
  // }
  redirect(){
    this.route.navigate(["master/inventory-management/inventory-allocation/view-production-inventory"],{queryParams:{id:this.cellValue.id}});
  }

  openDialog(e: any) {
  }

}


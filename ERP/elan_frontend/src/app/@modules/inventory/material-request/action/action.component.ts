import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import Swal from 'sweetalert2';
import { MaterialRequestDetailsComponent } from '../material-request-details/material-request-details.component';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {


  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router:Router,
    private toaster:ToastrService,
    private productService:ProductionService,
    private dialogRef: MatDialogRef<MaterialRequestDetailsComponent>
  ) {
  }

  ngOnInit(): void {}
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    console.log(this.cellValue,"klklklklklkl")
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.data
  }
  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  openDialog() {  
    
    this.router.navigate(["/master/inventory-management/material-request-list/material-allocate"],{queryParams:{id:this.cellValue.id,itemName:this.cellValue.ItemMaster.item_name,quantity:this.cellValue.quantity,Total_inventory:this.cellValue.ItemMaster.Total_inventory
   
    }})
    this.dialogRef.close();
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

}

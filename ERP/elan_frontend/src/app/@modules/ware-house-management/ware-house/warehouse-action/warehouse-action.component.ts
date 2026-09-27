import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
import { InventoryManagementService } from '../../inventory-management.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-warehouse-action',
  templateUrl: './warehouse-action.component.html',
  styleUrls: ['./warehouse-action.component.scss']
})
export class WarehouseActionComponent {
  assignAction: any;
    constructor(
      private route: Router,
      public dialog: MatDialog,
      private router:Router,
      private _rbackService:RbacMasterService,
      private _inventory:InventoryManagementService,
      private toaster:ToastrService,
    ) { }

    ngOnInit(): void {}

    ngAfterViewInit(): void {
      setTimeout(()=>{
        this.assignAction = this._rbackService.accessAssignAction();
      },0);
    }
    public cellValue: any;

    agInit(params: ICellRendererParams): void {
      this.cellValue = params
    }
    getValueToDisplay(params: ICellRendererParams) {
      return params
    }
    refresh(params: ICellRendererParams): boolean {
      this.cellValue = this.getValueToDisplay(params);
      return true;
    }

     

    navigatetoView(event:any){
      this.router.navigate(['/master/warehouse-management/warehouse/create-warehouse-new'], { queryParams: { id: this.cellValue.data?.id,view:'view'
        }})
    }

    nevigateToEdit(e:any){ 
        e.stopPropagation();
        this.router.navigate(['/master/warehouse-management/warehouse/create-warehouse-new'], { queryParams: { id: this.cellValue.data.id } })
      }

      deleteData(even:any){
        Swal.fire({
      title: 'Are you sure you want to Remove it?',
       
      icon: 'warning', 
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
         this._inventory.deleteByIdWarehouse(this.cellValue.data.id).subscribe((res:any)=>{
          if(res){
        this.toaster.success(res.message)

            this.reloadCurrentRoute()
          }
         })
      } 
     
    })
      }

      reloadCurrentRoute() {
        let currentUrl = this.route.url;
        this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.route.navigate([currentUrl]);
        });
      }

}

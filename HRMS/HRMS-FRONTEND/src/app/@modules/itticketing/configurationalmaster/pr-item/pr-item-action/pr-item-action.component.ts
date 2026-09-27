import { Component } from '@angular/core';
import { PrItemDilogComponent } from '../pr-item-dilog/pr-item-dilog.component';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import Swal from 'sweetalert2';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-pr-item-action',
  templateUrl: './pr-item-action.component.html',
  styleUrls: ['./pr-item-action.component.scss']
})
export class PrItemActionComponent {
  singleId:any;
  cellValue1:any;
  assignAction: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toaster: ToastrService,
    private prService: PurchaseRequestService

  ) {}

  ngOnInit(): void { 
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
    this.cellValue = this.getValueToDisplay(params);
    this.cellValue1 = params.data;
    
  }

  getValueToDisplay(params: ICellRendererParams) {
    

    return params.valueFormatted ? params.valueFormatted : params.data.id
  }

  refresh(params: ICellRendererParams): boolean {
    
    // this.singleId = params.data.dept_id
    // wrirte code to modify cell 

    if (params) {
      const data: any = {
        asset_category: params.data.asset_category.trim(),
        asset_category_status: params.data.asset_category_status,
      }
      
      if (params.data.color === null && params.data.color !== "") {
        
        this.createAssetCategory(data);
      } else {
        const asset_category_id: number = Number(params.data.asset_category_id);
      }

    } else {
      this.toaster.error("Asset Category is All Ready Exits!", 'Error Message');
    }


    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  createAssetCategory(data: any) {
    this.prService.createAssetCategory(data).subscribe(
      (res: any) => {
        
        this.toaster.success('Asset category Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {
        
        this.toaster.error("Asset category is All Ready Exits!", 'Error Message');
      }
    )
  };

  // openDialog() {

  //   const dialogRef
  //     = this.dialog.open(PrItemDilogComponent, {
  //       width: '30%',
  //       // maxWidth: '100vw',
  //       // maxHeight: '100vh',
  //       // height: '100%',
  //       // panelClass: 'full-screen-modal',
  //       data: { id: this.cellValue }

  //     });

  //   dialogRef.afterClosed().subscribe(result => {
  //     
  //   });
  //   

  // }

  edit(e:any) {
    e.stopPropagation();
    
    
    this.router.navigate(['master/configurational-master/pr-item/create-item'], { queryParams: { item_id: this.cellValue}})
  }
  view(e:any) {
    e.stopPropagation();
    this.router.navigate(['master/configurational-master/pr-item/view'], { queryParams: { item_id: this.cellValue}})
  }

  // delete(e:any){
  //   this.prService.deleteItem(this.id , formData).subscribe((res:any)=>{
  //     this.createdata = res.data
  //   })   
  // }

  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Do You Want to Remove?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this._configurationalmasterService.deleteItemMaster(this.cellValue).subscribe(
          (res) => {
            
            this.toaster.success('Delete successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this.toaster.error("Somthing went wrong.. Please try agin", "Error Message")
            
          }
        )
      }
    });
  }


  
}

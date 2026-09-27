import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ProductionService } from 'src/app/@shared/services/production/production.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bom-action',
  templateUrl: './bom-action.component.html',
  styleUrls: ['./bom-action.component.scss']
})
export class BomActionComponent {
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router:Router,
    private toaster:ToastrService,
    private productService:ProductionService
  ) {
  }

  ngOnInit(): void {}
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
   
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.id
  }
  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  edit(){
    this.router.navigate(["/master/production/bom-create"],{queryParams:{uomId:this.cellValue}})
  }
   
  openDialog() {  
    this.router.navigate(["/master/production/bom-create"],{queryParams:{uomId:this.cellValue,view:'view'}})
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
deleteBom(event:any){
  event.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#5d6c7c',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Skip',
    }).then((result) => {
      if (result.value) {
        this.productService.deleteBomMaster(this.cellValue).subscribe(
          (res:any) => {
            if(res){
              this.toaster.success(res.message)
              this.reloadCurrentRoute()
            }
            // else if(result.dismiss === Swal.DismissReason.cancel){

            // }
          },
          (err:any) => {
            this.toaster.error(err.error.message)
          })
      } 
      // else if (result.dismiss === Swal.DismissReason.cancel) {
      // }
    });
}


  
}

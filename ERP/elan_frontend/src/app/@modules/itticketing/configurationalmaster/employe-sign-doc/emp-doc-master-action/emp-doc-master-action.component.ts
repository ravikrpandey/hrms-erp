import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
// import { ProductMasterDialogComponent } from '../product-master-dialog/product-master-dialog.component';
@Component({
  selector: 'app-emp-doc-master-action',
  templateUrl: './emp-doc-master-action.component.html',
  styleUrls: ['./emp-doc-master-action.component.scss']
})
export class EmpDocMasterActionComponent {
  isChecked = false;
  achieveId: any;
  checkedActive: any;
  checkedInActive: any;
  new_region_name: any;
  checkBox: any;
  product_master_name: any;
  show: boolean;
  @ViewChild('container') containerRef: ElementRef;
  maping_id: any;
  getById: any;
  idDocument: any;
  constructor(
    private elementRef: ElementRef, private renderer: Renderer2,
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private toaster: ToastrService,
  ) {
    // this.data = localStorage.getItem("jobId");
    // 

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
    this.idDocument=Number(params.data.employee_id);
    console.log(this.idDocument,'this.idDocument');
    
    if (this.checkBox === true) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }

    return params.valueFormatted ? params.valueFormatted : params.data.product_master_id
  }
  refresh(params: ICellRendererParams): boolean {
    
    // wrirte code to modify cell 

    if (params) {
      // const country = this.allStateData.find((e: any) => e.countryss_name.toUpperCase() === params.data.countryss_name.trim().toUpperCase())
      // 
      const data: any = {
        // countryss_id:country.countryss_id,
        product_master_name: params.data.product_master_name.trim(),
      }
      if (params.data.color === null && params.data.color !== "") {
        

        this.CreateProduct(data);
      } else {
        const product_master_id: number = Number(params.data.product_master_id);
        this.updateProductMaster(product_master_id, data);
        
      }
    } else {
      this.toaster.error('Something went wrong please try again', 'Error Message');
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  //update_product_master
  edit(e:any){
    // alert("1")
    this._configurationalmasterService.idvalueSetDocu(this.idDocument)
  }

  CreateProduct(data: any) {
    this._configurationalmasterService.CreateProduct(data).subscribe(
      (res: any) => {
        
        this.toaster.success('Product Master Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {
        
        this.toaster.error("product_master_name is All Ready Exits!");
      }
    )
  };

  updateProductMaster(id: any, data: any) {
    this._configurationalmasterService.updateProductMaster(id, data).subscribe(
      (res: any) => {
        
        this.toaster.success('Product Master Updated Successfully')
      }, (err: any) => {
        this.toaster.error("product_master_name is All Ready Exits!");
        
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
      this._configurationalmasterService.updateProductMaster(this.cellValue, body).subscribe((res: any) => {
        this.product_master_name = res;
        this.toaster.success("Product Master data successfully Inactivate")

        

      })
      this.reloadCurrentRoute();
    } else {
      this._configurationalmasterService.updateProductMaster(this.cellValue, body).subscribe((res: any) => {
        this.product_master_name = res;
        this.toaster.success("Product Master data successfully activate")
        

      })
      this.reloadCurrentRoute();
    }

  }
  // openDialog() {
  //   const dialogRef
  //     = this.dialog.open(ProductMasterDialogComponent, {
  //       width: '30%',
  //       // maxWidth: '100vw',
  //       // maxHeight: '100vh',
  //       // height: '100%',
  //       // panelClass: 'full-screen-modal',
  //       data: { id: this.cellValue }

  //     });

  //   dialogRef.afterClosed().subscribe(result => {
      
  //   });
    

  // }
}

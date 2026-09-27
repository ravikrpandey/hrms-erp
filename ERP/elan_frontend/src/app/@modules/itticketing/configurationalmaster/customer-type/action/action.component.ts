import { Component } from '@angular/core';
import {
   ICellRendererParams,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CustomerDialogComponent } from '../customer-dialog/customer-dialog.component';


@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
  isChecked = false;
  achieveId: any;
  checkedActive: any;
  checkedInActive: any;
  customer_type_name: any;
  checkBox: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private toaster: ToastrService
  ) {
  
  }

  ngOnInit(): void {
    this.getCustomerType();
  }
  public cellValue: any;
  allCustomerTypeData: any;

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
    

    return params.valueFormatted
      ? params.valueFormatted
      : params.data.customer_type_id;
  }
  refresh(params: ICellRendererParams): boolean {
    
    // wrirte code to modify cell

    if (params) {
              const data: any = {
                customer_type_name: params.data.customer_type_name.trim(),
            }
            if (params.data.color === null && params.data.color !== "") {
              
              
              this.createCustomer(data);
            } else {
              const customer_type_id: number = Number(params.data.customer_type_id);
              this.updateSingleCustomer(customer_type_id, data);
              
            }
          } else {
            this.toaster.error('Something went wrong please try again', 'Error Message');
          }
      
          this.cellValue = this.getValueToDisplay(params);
          return true;
        }

  createCustomer(data: any) {
    // alert("Hellow");
    this._configurationalmasterService.CreateCustomerType(data).subscribe(
      (res: any) => {
        
        this.toaster.success('Customer Type Created Successfully');
        this.reloadCurrentRoute();
      },
      (err: any) => {
        
        this.toaster.error(
          'Something went wrong please try again',
          'Error Message'
        );
      }
    );
  }

  updateSingleCustomer(id: any, data: any) {
    this._configurationalmasterService.updateSingleCustomer(id, data).subscribe(
      (res: any) => {
        
        this.toaster.success('Segment Updated Successfully')
      }, (err: any) => {
        this.toaster.error('Something went wrong please try again', 'Error Message');
        
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
      this._configurationalmasterService.editCustomerType(this.cellValue, body).subscribe((res: any) => {
        this.customer_type_name = res;
        this.toaster.success("Customer Type successfully Inactivate")
        

      })
      this.reloadCurrentRoute();
    } else {
      
      this._configurationalmasterService.editCustomerType(this.cellValue, body).subscribe((res: any) => {
        this.customer_type_name = res;
        this.toaster.success("Category Type successfully activate")
        
      })
      this.reloadCurrentRoute();
    }

  }
  openDialog() {
    

    const dialogRef = this.dialog.open(CustomerDialogComponent, {
      width: '25%',     
      data: { id: this.cellValue },
    });

    dialogRef.afterClosed().subscribe((result) => {
      
    });
    
  }


  getCustomerType() {
    this._configurationalmasterService.getCustomerType().subscribe((res: any) => {
      this.allCustomerTypeData = res.data;
      
    });
  }
}
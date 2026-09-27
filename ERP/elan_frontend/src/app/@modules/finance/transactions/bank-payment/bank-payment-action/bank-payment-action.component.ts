import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { SalesService } from 'src/app/@modules/sales/service/sales.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-bank-payment-action',
  templateUrl: './bank-payment-action.component.html',
  styleUrls: ['./bank-payment-action.component.scss']
})
export class BankPaymentActionComponent {
  assignAction: any;
  public cellValue: any;
  checkCustomer:any;
  lead_id:any;
  new_customer:any;
  isLoading: boolean = false;
  constructor(private route: Router ,private _rbackService: RbacMasterService,  private _configurationalmasterService: ConfigurationalmasterService,
    public dialog: MatDialog,private salesService: SalesService, private toast: ToastrService,) {
  }
  ngOnInit(): void {
    
    this.assignAction = this._rbackService.accessAssignAction();    
  }
 
  agInit(params: ICellRendererParams): void {
    console.log("params", params);
    this.cellValue = this.getValueToDisplay(params);
    this.new_customer=params.data?.new_customer;
    this.lead_id=params.data?.lead_id;
if(params.data?.status === true){
this.checkCustomer="Exit"
}else{
this.checkCustomer="New"

}
  }
  getValueToDisplay(params: ICellRendererParams) {
    
    return params.data.id;
  }
  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  viewData(e:any) {
    e.stopPropagation();
    this.route.navigate(['/master/finance/transactions/add-bank-payment'], { queryParams: { id: this.cellValue}})

  }
  
  
    reloadCurrentRoute() {
      let currentUrl = this.route.url;
      this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.route.navigate([currentUrl]);
      });
    }
    downloadPDF(e: Event) {
      e.stopPropagation();
      this.isLoading = true;
      
      this._configurationalmasterService.downloadBankPaymentById(this.cellValue).subscribe(
        (res: ArrayBuffer) => {
          this.isLoading = false;
          
          try {
            const blob = new Blob([res], { type: 'application/pdf' });
            
            if (blob.size === 0) {
              this.toast.error('Generated PDF is empty', 'Error');
              return;
            }
            
            const link = document.createElement('a');
            const url = window.URL.createObjectURL(blob);
            
            link.href = url;
            link.download = `BankPayment_${this.cellValue}.pdf`;
            
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }, 100);
            
            this.toast.success('PDF downloaded successfully', 'Success');
            
          } catch (error) {
            console.error('Download error:', error);
            this.toast.error('Failed to download PDF', 'Error');
          }
        },
        (error: any) => {
          this.isLoading = false;
          console.error('Download error:', error);
          
          if (error.status === 404) {
            this.toast.error('Data not found', 'Error');
          } else if (error.status === 500) {
            this.toast.error('Server error while generating PDF', 'Error');
          } else {
            this.toast.error('Failed to download PDF', 'Error');
          }
        }
      );
    }
}

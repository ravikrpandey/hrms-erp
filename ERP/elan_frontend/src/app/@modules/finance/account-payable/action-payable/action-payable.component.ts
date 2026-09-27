import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { MatDialog } from '@angular/material/dialog';
// import { EmpListDialogComponent } from '../emp-list-dialog/emp-list-dialog.component';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { EmpListDialogComponent } from 'src/app/@shared/components/emp-list-dialog/emp-list-dialog.component';
import { DialogAccountPayableComponent } from '../dialog-account-payable/dialog-account-payable.component';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { th } from 'date-fns/locale';
@Component({
  selector: 'app-action-payable',
  templateUrl: './action-payable.component.html',
  styleUrls: ['./action-payable.component.scss']
})
export class ActionPayableComponent {
  vendorInvoiceId: any;
  vendorInvoiceData: any;
  rowData: any;
  myExpenseId: any;
  urll2: any;
  expenseSubmit: boolean = false;
  vendorSubmit: boolean = false;
  myExpenseInvoiceId: any;
  vendorId: any;
  leadIdCopy: any;
  cannelPartnerId: any;
  cpCreateOpen: boolean = false;
  leadIdCreate: boolean = false;
  expenseZohoId: any;
  cpId: any;
  vendorInvoiceList: boolean=false;
  vendorInvoicePayble: boolean=false;
  cpInvoicePayble: boolean=false;
  procurementId: any;
  constructor(private route: Router,
    public dialog: MatDialog,
    private employService: EmpRegistrationService,
    private toster: ToastrService,
    private _finaceService: FinaceService
  ) {
  }

  ngOnInit(): void {
    this.urll2 = this.route.url.toString();


    if (this.urll2 == '/master/finance/account-payable/all-payable/expense-invoice-payble') {
      this.expenseSubmit = true;
    }
    else if (this.urll2 == '/master/finance/account-payable/all-payable/vendor-invoice-payble') {
      this.vendorSubmit = true;
    }
    else if(this.urll2=='/master/finance/account-payable/all-recived-invoice/cp-invoice-list'){
      this.cpCreateOpen = true;
    }else if(this.urll2=='/master/finance/account-payable/all-recived-invoice/auditor-invoice-list'){
      this.leadIdCreate = true;
    }
    else if(this.urll2=='/master/finance/account-payable/all-recived-invoice/vendor-invoice-list'){
      this.vendorInvoiceList = true;
    }
    else if(this.urll2=='/master/finance/account-payable/all-payable/cp-invoice-payble'){
      this.cpInvoicePayble = true;
    }
    
   

    this.getByVendorInvoice();
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
    console.log(params, 'params aginit');

    this.vendorInvoiceId = params.data.vendor_management_id;

    this.myExpenseId = params.data.myexpense_id;
    this.myExpenseInvoiceId = params.data.myexpense_id;
    console.log(this.myExpenseInvoiceId, 'this.myExpenseInvoiceId');
    this.vendorId = params.data.vendor_management_id;
    console.log(this.vendorId, 'this.vendorId');

    this.leadIdCopy = params.data.lead_genration_id;
    console.log(this.leadIdCopy, 'this.leadIdCopy');

 this.expenseZohoId=params.data.expense_zoho_data_id;
 console.log(this.expenseZohoId,'this.expenseZohoId');
 
 this.cpId=params.data.channel_partner_provision_id;
 console.log(this.cpId,'this.cpId');
 


    // if (params.data.lead_genration_id) {
    //   this.leadIdCreate = true;
    // }

    this.cannelPartnerId = params.data.channel_partner_provision_id;
    console.log(this.cannelPartnerId, ' this.cannelPartnerId');

    this.procurementId=params.data.procurement_product_id;
    console.log( this.procurementId,' this.procurementId');
    

    // if (params.data.channel_partner_provision_id) {
    //   this.cpCreateOpen = true;
    // }

  }
  getValueToDisplay(params: ICellRendererParams) {
    console.log(params, 'params');

    return params.valueFormatted ? params.valueFormatted : params.data.employee_id;


  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    e.stopPropagation();
    // 
    this.route.navigate(['master/hrms/employee-master/employ/employee-create/basic-details'],
      { queryParams: { employee_id: this.cellValue } })
    this.employService.setEmpId(Number(this.cellValue))
    // edit(e: any) {
    //   e.stopPropagation();
    // }
  }

  delete(e: any) {
    e.stopPropagation();

    Swal.fire({
      title: 'Are you sure to delete this Employee ?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        const data = {
          status: "INACTIVE"
        }
        this.employService.deleteSingleEmployee(this.cellValue, data).subscribe(
          (res: any) => {

            this.toster.success('Deleted Successfully')
            this.reloadCurrentRoute();
          }, (err) => {

            this.toster.success('Something went wrong please try again', 'Error Message')
          }
        )
      };
    });
  }
  openDialog() {
    const dialogRef
      = this.dialog.open(EmpListDialogComponent, {
        width: '100%',
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        panelClass: 'full-screen-modal',
        data: { id: this.cellValue }
      });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  viewVendorInvoice() {
    const dialogRef
      = this.dialog.open(DialogAccountPayableComponent, {
        width: '40%',
        //  maxWidth: '100vw',
        // maxHeight: '100vh',
        // height: '100%',
        panelClass: 'full-screen-modal',
        data: { vendorInvoiceid: this.vendorInvoiceId }
      });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  getByVendorInvoice() {
    this._finaceService.getRecivedVendorInvoice().subscribe((res: any) => {

      this.rowData = res.data;



    })
  }

  vendorPdf() {
    const dialogRef
      = this.dialog.open(DialogAccountPayableComponent, {
        width: '30%',
        //  maxWidth: '100vw',
        // maxHeight: '100vh',
        // height: '100%',
        panelClass: 'full-screen-modal',
        data: { vendorPdf: this.vendorInvoiceId }
      });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  viewExpenseInvoice() {
    const dialogRef
      = this.dialog.open(DialogAccountPayableComponent, {
        width: '30%',
        //  maxWidth: '100vw',
        // maxHeight: '100vh',
        // height: '100%',
        panelClass: 'full-screen-modal',
        data: { expenseId: this.myExpenseId }
      });
    dialogRef.afterClosed().subscribe(result => {

    });
  }


  viewcPInvoice() {
    const dialogRef
      = this.dialog.open(DialogAccountPayableComponent, {
        width: '30%',
        //  maxWidth: '100vw',
        // maxHeight: '100vh',
        // height: '100%',
        panelClass: 'full-screen-modal',
        data: { cpId:this.cannelPartnerId}
      });
    dialogRef.afterClosed().subscribe(result => {

    });
  }
  myExpensSubmit() {
    // this.toster.info("Zoho Integration Under Progess..")
    this.route.navigate(['master/finance/account-payable/all-recived-invoice/expense-invoice-create'], { queryParams: { myExpenseInvoiceId: this.myExpenseInvoiceId } })

  }
  myVenderSubmit() {
    this.toster.info("Zoho Integration Under Progess..")
    this.route.navigate(['master/finance/account-payable/all-recived-invoice/vendor-invoice-create'], { queryParams: { vendorId: this.procurementId} })

  }


  submitAudit() {
    // this.toster.info("Zoho Integration Under Progess..")
    this.route.navigate(['master/finance/account-payable/all-recived-invoice/auditor-invoice-create'], { queryParams: { leadId: this.leadIdCopy } })

  }
  cpCreate() {
    this.route.navigate(['master/finance/account-payable/all-recived-invoice/cp-invoice-create'], { queryParams: { CPId: this.cannelPartnerId } })

  }

  expenseInvoice(){
    this.route.navigate(['master/finance/account-payable/all-payable/expense-invoice-pdf'], { queryParams: { expenseZohoId:this.expenseZohoId} })
    
  }

  vendorInvoice(){
    this.route.navigate(['master/finance/account-payable/all-payable/vendor-invoice-pdf'], { queryParams: { CPId: this.cannelPartnerId } })

  }

  cpInvoice(){
    this.route.navigate(['master/finance/account-payable/all-payable/cp-invoice-pdf'], { queryParams: { CPId: this.cannelPartnerId } })

  }
}

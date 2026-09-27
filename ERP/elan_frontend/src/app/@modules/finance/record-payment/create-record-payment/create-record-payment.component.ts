import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SalesManagementService } from 'src/app/@modules/sales-management/sales-management-service/sales-management.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-create-record-payment',
  templateUrl: './create-record-payment.component.html',
  styleUrls: ['./create-record-payment.component.scss']
})
export class CreateRecordPaymentComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any[] = [];
  public gridOptions: any = { rowSelection: 'multiple',enableRangeSelection: true,  
    enableClipboard: true,  };
  isDeleteButtonVisible: boolean = false;
  selectedRows: any[] = [];
  queryParamss: any;
  id: any;
  collegeids: any;
  collegeIdCopy: any;
  loginUser: any;
  assignAction: any;
  entity_id: string | null;
  baseUrl: any;
  createCustomerPayment:FormGroup
  constructor(
    public dialog: MatDialog,
    private _finaceservice: FinaceService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService :ConfigurationalmasterService,
    private SalesManagementSer: SalesManagementService,
    private vendorService: VendorManagementService,
    private _finaceService: FinaceService,
    private $common: CommonService,
    private _fb: FormBuilder,
    private $miscellaneousService: MiscellaneousService,
    private location: Location,
     
  ) {
    this.baseUrl = environment.servralUrl;


    this.rowClass = 'rowClass';
    this.createCustomerPayment = _fb.group({
      documentNo:[''],
      document_type:[''],
      customer_id:[''],
      sales_quotation_id:[''],
      proforma_invoice_id:[''],
      sales_booking_id:[''],
      sales_order_id:[''],
  
      invoiceNo:['',Validators.required],
      note_type:['',Validators.required],
      date:['',Validators.required],
       
      amount_due:['00'],
      total_amount:[''],
      record_amount:[''],
      recieved_amount:['00'],
      voucher_type:[''],
      subvoucher_type:[''],
      payment_type:[''],
      chartOfAccountList:this._fb.array([this.createItemsField()]),
      
      remarks:[''],
    })

  }

  ngOnInit(): void {
    this.createCustomerPayment.get('note_type')?.disable()
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getBankList()
    let entityId = localStorage.getItem("selectedEntityId");
    this.getAllCustomersData()
    this.getAllSuperUserData(entityId);
    this.getAllBranch()
    this.getChartAccountList() 
    // this.getAllVendorData(entityId)
  }
  isEmployee: boolean = true; // Default to "Employee"

toggleUserType(event: MatSlideToggleChange) {
  this.isEmployee = event.checked;
}

goBack(){
  this.location.back()
}
getBranchById(data:any){
  this._finaceService.createVendorPaymentVoucherSeries(data.id).subscribe((res:any)=>{
    console.log(res.data)
    this.createCustomerPayment.get('documentNo')?.setValue(res.data)
  })
}

  getClassForPrice2(lowThsthresholdStock: any): string {
    return 'statusAssets2';
  }
  viewImg() {
    window.open(this.baseUrl + '/' + this.upload_document, '_blank');
  }


  createItemsField(): FormGroup {
    return this._fb.group({
      chart_of_account_id: ['', Validators.required],
      payment_mode: ['debit', Validators.required],
      amount: [''],    
      
       
    });
  }
  
  addItem() {
    for (let control of this.chartOfAccountList.controls) {
      if (control.invalid) {
        control.markAllAsTouched(); 
        this.toast.warning('Please fill all required fields before adding a new item.')
        return; 
      }
    }
    this.chartOfAccountList.push(this.createItemsField());
  }
  
  removeItem(index: number) {
    this.chartOfAccountList.removeAt(index);
  }
  
  
  get chartOfAccountList(): FormArray {
    return this.createCustomerPayment.get('chartOfAccountList') as FormArray;
  }
  


  chartedAccount1: any[] = [];
  chartedAccount2: any[] = [];
  chartedAccount:any=[]
  getChartAccountList() {
    this._finaceService.getchartedAccount(this.entity_id).subscribe((res: any) => {

      this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no');
      this.chartedAccount1 = this.chartedAccount.map((res: any) => res.account_name);
      this.chartedAccount2 = this.chartedAccount;

    });
  }
  accountFilter(e: any) {
    const aa = e
    let filteredVariable = this.chartedAccount2.filter((item: any) => aa.includes(item.account_name));
    this.chartedAccount = filteredVariable
  }

  upload_document: any;
  uploadDoc(event: any) {
    try {
      let isValidExtension = this.$common.checkForValidFile(event);
      if (!isValidExtension) {
        this.createCustomerPayment.patchValue({ upload_document: null });
        return (this.upload_document = '');
      }
      const formData = new FormData();
      if (event.target.files && event.target.files[0]) {
        formData.append('file', event.target.files[0]);
      }
      this.$miscellaneousService.documents(formData).subscribe(
        (response: any) => {
          if (response) {
            this.upload_document = `uploaded_files/${response?.url}`;
          }
        },
        (err) => {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }
  getAllUsageHistory:any=[]
  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      maxWidth: 85,
    },
    {
      headerName: 'Item Name',
      field: 'item_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Item Code',
      field: 'item_code',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Item Brand',
      field: 'asset_category_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
   

    {
      headerName: 'Quantity',
      field: 'receiveQty',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },

    {
      headerName: 'Price',
      field: 'price',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      // cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount)) {
          return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }
        return '₦ 0.00';
      }
      
    },
    {
      headerName: 'Discount',
      field: 'discount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      // cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount)) {
          return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }
        return '₦ 0.00';
      }
      
    },
    
    {
      headerName: 'Amount',
      field: 'amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      // cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount)) {
          return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }
        return '₦ 0.00';
      }
    },


    
  ];

  public columnDefsHistory = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      maxWidth: 85,
    },
    {
      headerName: 'Date',
      field: 'date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Party Name',
      field: 'customer_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    
   

    {
      headerName: 'Document Number',
      field: 'documentNo',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },

    {
      headerName: 'Document Type',
      field: 'document_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      // cellClass: 'grid-cell-centered',
      
      flex: 1,
      minWidth: 150,
      
    },
    {
      headerName: 'Proforma Number',
      field: 'pi_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      // cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      
    },
    {
      headerName: 'Due Amount',
      field: 'amount_due',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      // cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount)) {
          return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }
        return ' 0.00';
      }
    },
    
    {
      headerName: 'Record Amount',
      field: 'record_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      // cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount)) {
          return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }
        return ' 0.00';
      }
    },
    {
      headerName: 'Total Amount',
      field: 'total_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      // cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount)) {
          return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }
        return ' 0.00';
      }
    },


    
  ];


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  getBankList() {
    this._finaceservice.getBankList(this.entity_id).subscribe((response: any) => {
      
      if (response) {
        this.rowData = response.data;
        // this.toast.success(response.message)
      }
    }, (err: any) => {
      // this.toast.error(err.error.message);
    })
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  navigateToForm(){
    this.route.navigate(['/master/finance/add-bank'])
  }
  customersData:any=[]
  customersData1:any=[]
  customersData2:any=[]
  getAllSuperUserData(entity_id:any){
    this.SalesManagementSer.getAllActiveSuperUser(entity_id).subscribe((data: any) => {
      this.customersData = data.data;
      this.customersData1 = data?.data?.map((x:any)=>x.business_name);
      this.customersData2 = this.customersData
    },(error)=>{
    this.customersData = [];
  })
}

customerFilter(e:any){
  let aa= e;
  let filteredVariable = this.customersData2.filter((item: any) => aa.includes(item.business_name));
  this.customersData = filteredVariable
}

vendorData:any=[]
vendorData1:any=[]
vendorData2:any=[]
getUnAppVendor(){
  let entity_ids = localStorage.getItem('selectedEntityId')
  this._finaceService.getGPartyByEntityId('VENDOR',entity_ids).subscribe((res:any)=>{
    this.vendorData = res.data;
    this.vendorData1 = res?.data?.map((x:any)=>x.vendor_name);
    this.vendorData2=this.vendorData
    
  })
}

getAllCustomerDataList:any=[]
getAllCustomersData(){
  let entity_ids = localStorage.getItem('selectedEntityId')
  this._finaceService.getGPartyByEntityId('CUSTOMER',entity_ids).subscribe((res:any)=>{
    this.getAllCustomerDataList = res.data;
    // this.vendorData1 = res?.data?.map((x:any)=>x.vendor_name);
    // this.vendorData2=this.vendorData
    
  })
}

vendorFilter(e:any){
  let aa= e;
  let filteredVariable = this.vendorData2.filter((item: any) => aa.includes(item.vendor_name));
  this.vendorData = filteredVariable
}



getAllInvoiceData:any=[]
historyData:any=[]
total_invoice_amt:any;
due_amount:any;
getAllInvoicesData(event:any){
  if(this.vendor){
    // this._finaceService.getInvoiceByDataByIdVendor(event.value,this.vendor_id).subscribe((res:any)=>{
    //   if(!res.data?.length){
    //      this.getAllInvoiceData=res.data;
    //      this.historyData=res.history;
    //      this.total_invoice_amt = res.total_invoice_amt;
    //      this.due_amount = res.amount_due;  
    //      this.createCustomerPayment.patchValue({
    //       due_amount:res.amount_due
    //      })
    //      console.warn(this.getAllInvoiceData,'vensor');
         
    //     return this.toast.error('No Data found....')
        
    //    } else{
    //     this.getAllInvoiceData=res.data
    //     this.historyData=res.history;
    //     this.due_amount = res.amount_due;
    //     this.total_invoice_amt = res.total_invoice_amt;
    //     this.createCustomerPayment.patchValue({
    //       due_amount:res.amount_due
    //      })
    //    }
    // })
  }
  else if(this.customer){
    // this._finaceService.getInvoiceByDataByIdCustomer(event.value,this.customer_id).subscribe((res:any)=>{
    //   if(!res.data?.length){
    //     this.getAllInvoiceData=res.data;
    //     this.historyData=res.history;
    //     this.total_invoice_amt = res.total_invoice_amt;
    //     console.warn(this.getAllInvoiceData,'customer');
    //     this.createCustomerPayment.patchValue({
    //       due_amount:res.amount_due
    //      })
    //     this.createCustomerPayment.get('invoiceNo')?.reset()
    //    return this.toast.error('No Data found....')
       
    //   } else{
    //    this.getAllInvoiceData=res.data
    //    this.historyData=res.history;
    //    this.total_invoice_amt = res.total_invoice_amt;
    //    this.createCustomerPayment.patchValue({
    //     due_amount:res.amount_due
    //    })
      // }
    // },(err:any)=>{
    //   this.createCustomerPayment.get('invoiceNo')?.reset()
    //   return this.toast.error('No Data found....')

    // })
  }
}

 vendor:boolean=false;
 customer:boolean=true;
  getData(data:any){
    console.warn(data,'data');
    
    if(data=='VENDOR'){
      this.vendor=true;
      this.customer=false;
      this.getUnAppVendor()
      this.createCustomerPayment.reset()
      this.getAllInvoiceData=[]
    }else{
      this.vendor=false;
      this.customer=true;
      this.getAllCustomersData()
      this.createCustomerPayment.reset()
      this.getAllInvoiceData=[]
      
      
    }
  }
  getCategoryById:any=[]
  vendor_id:any
  getAllVendorData(event:any){
    this.vendor_id= event.value;
this._finaceService.getGParty(event.value).subscribe((res:any)=>{
 if(!res.data?.length){
  this.getCategoryById=res.data
  return this.toast.error('Category not found on this vendor')
     
 } else{
  this.getCategoryById=res.data
  this.createCustomerPayment.get('note_type')?.enable()
 }
},(err:any)=>{
  this.toast.error(err.error.message)
})


  }

  calculations(event: any): void {
    const remainig_due = this.paymentHistoryData[this.paymentHistoryData.length - 1]?.amount_due;
  
    const record_amount = +event?.target?.value || 0;
    const total_amount = +this.createCustomerPayment.get('total_amount')?.value || 0;
  
    let amount_due: number;
  
    if (remainig_due != null && !isNaN(remainig_due)) { 
      amount_due = remainig_due - record_amount;
    } else { 
      amount_due = total_amount - record_amount;
    } 
    amount_due = Math.max(amount_due, 0);
  
    this.createCustomerPayment.get('amount_due')?.setValue(amount_due, { emitEvent: false });
   
    const accountDetailsArray = this.createCustomerPayment.get('chartOfAccountList') as FormArray;
    if (accountDetailsArray?.length > 0) {
      accountDetailsArray.at(0).get('amount')?.setValue(record_amount, { emitEvent: false });
    }
  }
  


 getAllINvoicesDataList:any=[];
  getCategoryByInvoice(event:any){
    if(this.vendor){
      let entity_id = localStorage.getItem('selectedEntityId')
      // this._finaceService.getInvoiceByIdVendor(this.vendor_id,event.value,entity_id).subscribe((res:any)=>{
         
         
      //     if(!res.data?.length){
      //       this.createCustomerPayment.get('category_id')?.reset()
      //       this.getAllINvoicesDataList= res.data;
      //       return this.toast.error('Invoice not found on this vendor category')
      //      } else{
      //       this.getAllINvoicesDataList= res.data;
      //      }   
         
      // },(err:any)=>{
      //    return this.toast.error('Invoices Not found on this')
      // })
    }
    else if(this.customer){
      let entity_id = localStorage.getItem('selectedEntityId')
    //   this._finaceService.getInvoiceByIdCustomer(this.customer_id,event.value,entity_id).subscribe((res:any)=>{
    //       if(!res.data?.length){
    //         this.getAllINvoicesDataList= res.data;
    //         this.createCustomerPayment.get('category_id')?.reset()
    //         return this.toast.error('Invoice not found on this customer category')
            
    //        } else{
    //         this.getAllINvoicesDataList= res.data;
    //        }
         
        
    //  },(err:any)=>{
    //     return this.toast.error('Invoices Not found on this')
    //  })
   }
 
  }


 customer_id:any;
  getAllCustomerData(event:any){
    this.customer_id = event.value;
   
     
  }
  lastNumber:any
  lastNumber1:any
  getNotedeta(event:any){
  
    // if(this.customer){
    //   if(event.value=='debit_note'){
    //     this._finaceService.creditDebitCodeCustomer(this.customer_id,event.value).subscribe((res:any)=>{
    //      if(res){
    //        this.createCustomerPayment.patchValue({
    //          documentNo:res.data
    //        })
    //      }
    //     })
    //    }else{
    //     this._finaceService.creditDebitCodeCustomer(this.customer_id,event.value).subscribe((res:any)=>{
    //       if(res){
    //         this.createCustomerPayment.patchValue({
    //           documentNo:res.data
    //         })
    //       }
    //      })
    //    }
    // }
    // else if(this.vendor){
    //   if(event.value=='credit_note'){
    //     this._finaceService.creditDebitCodeVendor(this.vendor_id,event.value).subscribe((res:any)=>{
    //       if(res){
    //         this.createCustomerPayment.patchValue({
    //           documentNo:res.data
    //         })
    //       }
    //      })
    //   }else if(event.value=='debit_note'){
    //     this._finaceService.creditDebitCodeVendor(this.vendor_id,event.value).subscribe((res:any)=>{
    //       if(res){
    //         this.createCustomerPayment.patchValue({
    //           documentNo:res.data
    //         })
    //       }
    //      })
    //   }
    // }
    
    
 
    
  }

  
  submitCustomerPayment(data:any){
 
    let entity_id = localStorage.getItem('selectedEntityId')
    console.warn(data,'data');
    let payload={
        ...this.createCustomerPayment.value,
      entity_id:entity_id,
       
    }
     
this.$common.showLoader();
    this._finaceService.createCustomerRecordPayment(payload).subscribe((res:any)=>{
      if(res)   
        this.route.navigate(['master/finance/customer-record-payment'])
      this.$common.hideLoader();
        return this.toast.success(res.message)
    },(err:any)=>{
      this.$common.hideLoader();
      return this.toast.error(err.error.message)

    })

  }

  documentType:any=''
  getAllAdvanceData:any;
  payload:any
 getAllDocumentType(event:any){
     
   this.documentType = event.value
   if(this.documentType!=='OTHERS'){
    
       this.payload={  
        customer_id:this.customer_id,
         document_type:this.documentType,
          entity_id:this.entity_id
       }
  
     }
       this._finaceService.getAllPoGrnSoByVendorId(this.payload).subscribe((res:any)=>{
         console.log(res);
         this.getAllAdvanceData= res.data
         if(this.getAllAdvanceData.length == 0){
          this.createCustomerPayment.get('document_type')?.reset()
         }
       },(err:any)=>{
         this.documentType=''
       
         this.toast.warning(err.error.message)
       })
  
   }
paymentHistoryData:any=[]
recordData:any=[]
   getDataBYId(event:any){
     
    if(event.value){
    let payload={
      proforma_id:event.value,
      customer_id:this.customer_id,
      documentType:this.documentType,
      entity_id:this.entity_id
    }

    this._finaceService.customerRecordPayment(payload).subscribe((res:any)=>{
      this.recordData = res.data
      this.paymentHistoryData = res.data?.historyData || []
      if(this.recordData){
        let amount_paid = this.paymentHistoryData.reduce((acc:number,res:any)=>{
          return acc + parseFloat(res.record_amount) || 0
        },0)
        this.createCustomerPayment.patchValue({
        total_amount:parseFloat(this.recordData.grant_total),
       amount_due:this.paymentHistoryData[this.paymentHistoryData.length-1]?.amount_due,
       recieved_amount:amount_paid,
      })
      }
    },(err)=>{
      return this.toast.error(err.error.message)
    })



    }
   }

    
   getAllBranchData:any=[]
   getAllBranch(){
     this._configurationalMasterService.getListBranchSetup().subscribe((res: any) => {
       this.getAllBranchData = res.data
      
     })
   }
 }



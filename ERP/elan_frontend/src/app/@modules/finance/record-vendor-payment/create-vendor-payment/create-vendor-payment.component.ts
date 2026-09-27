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
  selector: 'app-create-vendor-payment',
  templateUrl: './create-vendor-payment.component.html',
  styleUrls: ['./create-vendor-payment.component.scss']
})
export class CreateVendorPaymentComponent {
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
  createVendorPayment:FormGroup
  tds_amout_value: any;
  constructor(
    public dialog: MatDialog,
    private _finaceservice: FinaceService,
    private _rbackService: RbacMasterService,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private SalesManagementSer: SalesManagementService,
    private vendorService: VendorManagementService,
    private _finaceService: FinaceService,
    private $common: CommonService,
    private _fb: FormBuilder,
    private $miscellaneousService: MiscellaneousService,
    private location: Location,
    private _configurationalMasterService :ConfigurationalmasterService
     
  ) {
    this.baseUrl = environment.servralUrl;


    this.rowClass = 'rowClass';
    this.createVendorPayment = _fb.group({
      date:[''],
      vendor_id:[''],
      document_type:[''],
      others:[''],
      po_id:[null],
      grn_id:[null],
      invoice_id:[null],
      delivery_order_id:[null],
      sales_order_id:[null],
      sales_invoice_id:[null],
      payment_type:[null],
      documentNo:[''],
      payment_method:[''],
      tds_id:[''],
      nature:[''],
      transactions_of_nature:[''],
      tds_rate:[''],
      total_amount:[''],
      recieved_amount:['00'],
      amount_due:[''],
      record_amount:['',],
      nature_id:[''],
      tds_amount:[''],
      net_amount:[''],
      branch_id:[''],
      threshold_limits:[''],
      chartOfAccountList:this._fb.array([this.createItemsField()]),
       
    })

  }
calculatedTdsAmt:any;
  ngOnInit(): void {
    this.createVendorPayment.get('note_type')?.disable()
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getBankList()
    let entityId = localStorage.getItem("selectedEntityId");
    this.getAllCustomersData()
    this.getAllSuperUserData(entityId);
    this.getUnAppVendor()
    this.getChartAccountList()
    this. getAllBranch()
   
    // this.getAllVendorData(entityId)
  }
  isEmployee: boolean = true; // Default to "Employee"

toggleUserType(event: MatSlideToggleChange) {
  this.isEmployee = event.checked;
}
createItemsField(): FormGroup {
  return this._fb.group({
    chart_of_account_id: ['', Validators.required],
    payment_mode: ['credit', Validators.required],
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
  return this.createVendorPayment.get('chartOfAccountList') as FormArray;
}

goBack(){
  this.location.back()
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
  getClassForPrice2(lowThsthresholdStock: any): string {
    return 'statusAssets2';
  }
  viewImg() {
    window.open(this.baseUrl + '/' + this.upload_document, '_blank');
  }

  upload_document: any;
  uploadDoc(event: any) {
    try {
      let isValidExtension = this.$common.checkForValidFile(event);
      if (!isValidExtension) {
        this.createVendorPayment.patchValue({ upload_document: null });
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
      headerName: 'Date',
      field: 'createdAt',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Payment Method',
      field: 'payment_method',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
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
        return '₹0.00';
      }
      
      
    },
    {
      headerName: 'Amount Paid',
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
        return '₹0.00';
      }
      
      
    },
    
    {
      headerName: 'TDS Amount',
      field: 'tds_amount',
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
        return '₹0.00';
      }
      
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
        return '₹0.00';
      }
      
    },
    {
      headerName: 'Net Amount',
      field: 'net_amount',
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
        return '₹0.00';
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
    //      this.createVendorPayment.patchValue({
    //       due_amount:res.amount_due
    //      })
    //      console.warn(this.getAllInvoiceData,'vensor');
         
    //     return this.toast.error('No Data found....')
        
    //    } else{
    //     this.getAllInvoiceData=res.data
    //     this.historyData=res.history;
    //     this.due_amount = res.amount_due;
    //     this.total_invoice_amt = res.total_invoice_amt;
    //     this.createVendorPayment.patchValue({
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
    //     this.createVendorPayment.patchValue({
    //       due_amount:res.amount_due
    //      })
    //     this.createVendorPayment.get('invoiceNo')?.reset()
    //    return this.toast.error('No Data found....')
       
    //   } else{
    //    this.getAllInvoiceData=res.data
    //    this.historyData=res.history;
    //    this.total_invoice_amt = res.total_invoice_amt;
    //    this.createVendorPayment.patchValue({
    //     due_amount:res.amount_due
    //    })
      // }
    // },(err:any)=>{
    //   this.createVendorPayment.get('invoiceNo')?.reset()
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
      this.createVendorPayment.reset()
      this.getAllInvoiceData=[]
    }else{
      this.vendor=false;
      this.customer=true;
      this.getAllCustomersData()
      this.createVendorPayment.reset()
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
  this.createVendorPayment.get('note_type')?.enable()
 }
},(err:any)=>{
  this.toast.error(err.error.message)
})


  }
 getAllINvoicesDataList:any=[];
  getCategoryByInvoice(event:any){
    if(this.vendor){
      let entity_id = localStorage.getItem('selectedEntityId')
      // this._finaceService.getInvoiceByIdVendor(this.vendor_id,event.value,entity_id).subscribe((res:any)=>{
         
         
      //     if(!res.data?.length){
      //       this.createVendorPayment.get('category_id')?.reset()
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
    //         this.createVendorPayment.get('category_id')?.reset()
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
    this._finaceService.getCustomerCategory(event.value).subscribe((res:any)=>{
      if(!res.data?.length){
        this.getCategoryById=res.data
       return this.toast.error('Category not found on this Customer')
       
      } else{
       this.getCategoryById=res.data
       this.createVendorPayment.get('note_type')?.enable()
      }
     },(err:any)=>{
       this.toast.error(err.error.message)
     })
     
  }



  partyCustomers: boolean = false
  customerTypess: any = []
  partyTypeCheck:any=''
  vendorPartyData:any=[]
  customerPartyData:any=[]
 
  getAllTdsSection:any=[]
  vendor_ids:any
  vendorHistoryData:any=[]
  getVendorData(data: any) {
    this.vendor_ids = data.id;
  
    this._finaceService.getVendorDataByTds(data.id).subscribe((res: any) => {
      console.log(res.data);
  
      if (!res.data?.length) {
        this.getAllTdsSection = [];
        return this.toast.warning('TDS Not Mapped On This Vendor');
      }
  
      
      this.getAllTdsSection = res.data;
  
      
      this.vendorHistoryData = [];
      this.createVendorPayment.get('document_type')?.reset();
      this.documentType = '';
      this.createVendorPayment.get('po_id')?.reset();
      this.createVendorPayment.get('nature')?.reset();
      this.createVendorPayment.get('nature_id')?.reset();
      this.createVendorPayment.get('tds_rate')?.reset();
      this.createVendorPayment.get('total_amount')?.reset();
      this.createVendorPayment.get('recieved_amount')?.reset();
      this.createVendorPayment.get('amount_due')?.reset();
      this.createVendorPayment.get('tds_id')?.reset();
      this.createVendorPayment.get('total_amount')?.reset();
      this.createVendorPayment.get('recieved_amount')?.reset();
      this.createVendorPayment.get('amount_due')?.reset();
      this.createVendorPayment.get('record_amount')?.reset();

      this._finaceService.getTdsNatureOfTransaction(res.data[0].nature_id,this.vendor_ids).subscribe((res:any)=>{
             
          
        //  this.total_amount = res.data[0]?.total_amount
        //  this.maximum_amount = +res.data[0]?.maximum_amount    
         this.current_rate_amount = +data.current_rate 
         this.getAllNatureOfTrsanction=res.data
          this.sections = res.data[0]?.section
          this.threshold_limits = res.data[0]?.threshold_limit
      this.total_amount = res.data[0]?.total_amount
      this.maximum_amount = res.data[0]?.maximum_amount    
      this.current_rate_amount = res.data[0]?.current_rate
         this.threshold_limits=res.data[0]?.threshold_limit
        this.createVendorPayment.get('nature_id')?.setValue(res.data[0]?.id)
        this.createVendorPayment.get('tds_rate')?.setValue(res.data[0]?.current_rate)
      
   
    
        
        
       })
      
      if (res.data.length === 1) {
        this.createVendorPayment.patchValue({
          tds_id: res.data[0]?.tds_id,
          nature: res.data[0]?.nature,
          nature_id: res.data[0]?.nature_id,
          tds_rate: res.data[0]?.tds_rate
        });
      }
    });
  }
  
sections:any
  getAllNatureOfTrsanction:any=[]
  getAllNatureTransaction(data:any){
   
    this.calculatedTdsAmt = this.vendorHistoryData.reduce((acc:any,res:any)=>{
    return  acc + Number(res.tds_amount)
  },0)
  console.log(this.calculatedTdsAmt,'calculatedTdsAmt')
       this.createVendorPayment.get('nature')?.setValue(data.nature)
         this._finaceService.getTdsNatureOfTransaction(data.nature_id,this.vendor_ids).subscribe((res:any)=>{
             
          
          //  this.total_amount = res.data[0]?.total_amount
          //  this.maximum_amount = +res.data[0]?.maximum_amount    
           this.current_rate_amount = +data.current_rate 
           this.getAllNatureOfTrsanction=res.data
            this.sections = res.data[0]?.section
           this.threshold_limits=res.data[0]?.threshold_limit
          this.createVendorPayment.get('nature_id')?.setValue(res.data[0]?.id)
          this.createVendorPayment.get('tds_rate')?.setValue(res.data[0]?.current_rate)
        
     
      
          
          
         })
  }



  threshold_limits:any;
  tds_rate:any;
  current_rate_amount:any;
  total_amount:any;
  maximum_amount:any;
    getTdsRateData(data:any){
      console.warn(data.threshold_limit);
       this.sections = data.section
      this.threshold_limits = +data.threshold_limit
      this.total_amount = +data.total_amount
      this.maximum_amount = +data.maximum_amount    
      this.current_rate_amount = +data.current_rate
       if(data.current_rate){
        this.createVendorPayment.get('tds_rate')?.setValue(data.current_rate)
       }
       this.calculatedTdsAmt = this.vendorHistoryData.reduce((acc:any,res:any)=>{
        return  acc + Number(res.tds_amount)
      },0)
    
    } 




   documentType:any=''
   getAllAdvanceData:any;
   payload:any
  getAllDocumentType(event:any){
      
    this.documentType = event.value
    if(this.documentType!=='OTHERS'){
      if(this.partyTypeCheck=='VENDOR'){
        this.payload={
          vendor_id:this.vendor_ids,
          document_type:this.documentType,
           entity_id:this.entity_id
        }
      }else{
        this.payload={
          vendor_id:this.vendor_ids,
          document_type:this.documentType,
           entity_id:this.entity_id
        }
      }
        this._finaceService.getAllPoGrnSoByVendorId(this.payload).subscribe((res:any)=>{
          console.log(res);
          this.getAllAdvanceData= res.data
        },(err:any)=>{
          this.documentType=''
        
          this.toast.warning(err.error.message)
        })
   
    }
    this.createVendorPayment.get('po_id')?.reset()
  }
remainingAmount:any;
ischeckedTdsAmount:any;
  getAmountByPo(data:any){
    console.warn(data,'data');
    let payload={
      entity_id:this.entity_id,
      vendor_id:this.vendor_ids,
      document_type:this.documentType,
      po_id:data.po_id,
      
    }
  
    this._finaceService.getVendorPaymentHistoryByVendor(payload).subscribe((res:any)=>{
  
      this.vendorHistoryData = res.data
      this.ischeckedTdsAmount=res.tds_valid
      this.tds_amout_value = res.tds_amount
      if(this.vendorHistoryData.length){
        
        let paid_amount_till_now = this.vendorHistoryData[this.vendorHistoryData.length-1] 
        
        this.remainingAmount = paid_amount_till_now.amount_due-parseFloat(this.tds_amout_value)
        this.createVendorPayment.get('recieved_amount')?.setValue(paid_amount_till_now?.paid_amount_till_now)
        this.createVendorPayment.get('amount_due')?.setValue(paid_amount_till_now?.amount_due)

      }
      if(this.ischeckedTdsAmount && this.vendorHistoryData.length==0){
        this.createVendorPayment.get('amount_due')?.setValue(data.total_amount-parseFloat(this.tds_amout_value))

      }
      if(this.ischeckedTdsAmount && this.vendorHistoryData.length == 1){
        let paid_amount_till_now = this.vendorHistoryData[this.vendorHistoryData.length-1] 
         
        this.remainingAmount = paid_amount_till_now.amount_due-parseFloat(this.tds_amout_value)
        this.createVendorPayment.get('recieved_amount')?.setValue(paid_amount_till_now?.paid_amount_till_now)
        this.createVendorPayment.get('amount_due')?.setValue(this.remainingAmount)
      }
    },(err:any)=>{
      this.toast.error('History Not Found..')
    })
    if(data.total_amount){
      this.createVendorPayment.get('total_amount')?.setValue(data.total_amount)
      
    }
  }


  blockExceed(event: any) {
   
  
    // if (Number(event.target?.value) >= Number(this.remainingAmount)) {
    //   event.preventDefault();
    // }
  }
  
  

  
  lastNumber:any
  lastNumber1:any
  getNotedeta(event:any){
  
    // if(this.customer){
    //   if(event.value=='debit_note'){
    //     this._finaceService.creditDebitCodeCustomer(this.customer_id,event.value).subscribe((res:any)=>{
    //      if(res){
    //        this.createVendorPayment.patchValue({
    //          documentNo:res.data
    //        })
    //      }
    //     })
    //    }else{
    //     this._finaceService.creditDebitCodeCustomer(this.customer_id,event.value).subscribe((res:any)=>{
    //       if(res){
    //         this.createVendorPayment.patchValue({
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
    //         this.createVendorPayment.patchValue({
    //           documentNo:res.data
    //         })
    //       }
    //      })
    //   }else if(event.value=='debit_note'){
    //     this._finaceService.creditDebitCodeVendor(this.vendor_id,event.value).subscribe((res:any)=>{
    //       if(res){
    //         this.createVendorPayment.patchValue({
    //           documentNo:res.data
    //         })
    //       }
    //      })
    //   }
    // }
    
    
 
    
  }

  
  submitCreditDebitNote(data:any){
  
if(this.createVendorPayment.invalid){
  this.createVendorPayment.markAllAsTouched()
  return this.toast.error('Please fill required fields')
}
 
  

    let entity_id = localStorage.getItem('selectedEntityId')
     
    this.createVendorPayment.value.entity_id =entity_id 


let finalValue = this.createVendorPayment.value?.chartOfAccountList.reduce((a: number, b: any) => {
  return a + (parseFloat(b.amount || 0));  
}, 0);

 

if(!this.tdsAmountForPopup){
  if(this.createVendorPayment.value?.net_amount != finalValue){
     return this.toast.error('Debit and Credit Not Equal')
  }

}
this.createVendorPayment.value.finalTdsAmt = this.tdsAmountForPopup - this.calculatedTdsAmt
this.$common.showLoader();
   
    this._finaceService.vendorPayment(this.createVendorPayment.value).subscribe((res:any)=>{
      if(res)   
        this.route.navigate(['/master/finance/vendor-record-payment'])
      this.$common.hideLoader();
        return this.toast.success(res.message)
    },(err:any)=>{
      this.$common.hideLoader();
      return this.toast.error(err.error.message)

    })

  }
tdsAmountForPopup:any;
getRecordPaymentVal:number
maximum_amount_cross:boolean=false;
  calculations(event: any): void {
    
    let record_amount = +this.createVendorPayment.get('record_amount')?.value || 0;
    const current_rate = +this.createVendorPayment.get('current_rate')?.value || 0;
    let total_amount = +this.createVendorPayment.get('total_amount')?.value || 0;
    
if(this.ischeckedTdsAmount){
 
     if(this.remainingAmount){
       var amount_due = (parseFloat(this.remainingAmount) - record_amount);
       this.createVendorPayment.get('amount_due')?.setValue(amount_due);
     this.createVendorPayment.get('net_amount')?.setValue(record_amount.toFixed(2), { emitEvent: false }); 
     this.createVendorPayment.get('tds_amount')?.setValue(0, { emitEvent: false }); 
     }else{
       let amount_due = this.total_amount - this.tds_amout_value
       var amount_due1 = amount_due - record_amount
      this.createVendorPayment.get('amount_due')?.setValue(amount_due1);
      this.createVendorPayment.get('net_amount')?.setValue(record_amount.toFixed(2), { emitEvent: false }); 
      this.createVendorPayment.get('tds_amount')?.setValue(0, { emitEvent: false }); 
     }
 
}else{
  if(this.sections =='194C' || this.sections=='194c'){
    
    if ((record_amount + this.total_amount) > this.maximum_amount) {
      this.maximum_amount_cross = true;
      this.getRecordPaymentVal = record_amount
      const tdsAmount = ((record_amount + this.total_amount) * this.current_rate_amount) / 100;
      this.tdsAmountForPopup = tdsAmount;
      this.createVendorPayment.get('tds_amount')?.setValue(tdsAmount.toFixed(2), { emitEvent: false });
  
      const net_amount = record_amount - tdsAmount;
      this.createVendorPayment.get('net_amount')?.setValue(net_amount.toFixed(2), { emitEvent: false });
    } 
    

    else if (record_amount > this.threshold_limits) {
      this.maximum_amount_cross = false;
      const tdsAmount = (record_amount * this.current_rate_amount) / 100;
      this.tdsAmountForPopup = tdsAmount;
      this.createVendorPayment.get('tds_amount')?.setValue(tdsAmount.toFixed(2), { emitEvent: false });
  
      const net_amount = record_amount - tdsAmount;
      this.createVendorPayment.get('net_amount')?.setValue(net_amount.toFixed(2), { emitEvent: false });
    } 
    
   
    else if (record_amount < this.threshold_limits) {
      this.maximum_amount_cross = false;
      this.tdsAmountForPopup = false;
      this.createVendorPayment.get('tds_amount')?.setValue('0.00', { emitEvent: false });
  
      const net_amount = record_amount;
      this.createVendorPayment.get('net_amount')?.setValue(net_amount.toFixed(2), { emitEvent: false });
  
      let amount_due = total_amount - record_amount;
      this.createVendorPayment.get('amount_due')?.setValue(amount_due);
    }
    if(this.total_amount > this.maximum_amount){
      this.maximum_amount_cross = false;
      const tdsAmount = (record_amount * this.current_rate_amount) / 100;
      this.tdsAmountForPopup = tdsAmount;
      this.createVendorPayment.get('tds_amount')?.setValue(tdsAmount.toFixed(2), { emitEvent: false });
  
      const net_amount = record_amount - tdsAmount;
      this.createVendorPayment.get('net_amount')?.setValue(net_amount.toFixed(2), { emitEvent: false }); 
    }
   
    if (+this.remainingAmount) {
      let amount_due = this.remainingAmount - record_amount;
      this.createVendorPayment.get('amount_due')?.setValue(amount_due);
    } else {
      let amount_due = total_amount - record_amount;
      this.createVendorPayment.get('amount_due')?.setValue(amount_due);
      
    }
    if(record_amount === this.threshold_limits){
     
      this.createVendorPayment.get('net_amount')?.setValue(record_amount.toFixed(2), { emitEvent: false });
    }
    
     

  }
  else {
     
    if (record_amount > this.maximum_amount) {
     
      const tdsAmount = (record_amount * this.current_rate_amount) / 100;
      this.createVendorPayment.get('tds_amount')?.setValue(tdsAmount.toFixed(2), { emitEvent: false });
      const net_amount = record_amount - tdsAmount;
      this.createVendorPayment.get('net_amount')?.setValue(net_amount.toFixed(2), { emitEvent: false });
    
    }else if(this.total_amount > this.maximum_amount ){
      const tdsAmount = (record_amount * this.current_rate_amount) / 100;
      this.createVendorPayment.get('tds_amount')?.setValue(tdsAmount.toFixed(2), { emitEvent: false });
      const net_amount = record_amount - tdsAmount;
      this.createVendorPayment.get('net_amount')?.setValue(net_amount.toFixed(2), { emitEvent: false });
    }
     
    else{
    
      this.createVendorPayment.get('tds_amount')?.setValue(0, { emitEvent: false });
      this.createVendorPayment.get('net_amount')?.setValue(record_amount, { emitEvent: false });
    }

    if ((record_amount + this.total_amount) > this.maximum_amount) {
      
      const tdsAmount = ((record_amount + this.total_amount) * this.current_rate_amount) / 100;
      this.tdsAmountForPopup = tdsAmount;
      this.createVendorPayment.get('tds_amount')?.setValue(tdsAmount.toFixed(2), { emitEvent: false });
  
      const net_amount = record_amount - tdsAmount;
      this.createVendorPayment.get('net_amount')?.setValue(net_amount.toFixed(2), { emitEvent: false });
    } 
if(record_amount > this.threshold_limits){
  const tdsAmount = (record_amount * this.current_rate_amount) / 100;
      this.tdsAmountForPopup = tdsAmount;
      this.createVendorPayment.get('tds_amount')?.setValue(tdsAmount.toFixed(2), { emitEvent: false });
  
      const net_amount = record_amount - tdsAmount;
      this.createVendorPayment.get('net_amount')?.setValue(net_amount.toFixed(2), { emitEvent: false }); 
}


    if(this.total_amount > this.maximum_amount){
      
      const tdsAmount = (record_amount * this.current_rate_amount) / 100;
      this.tdsAmountForPopup = tdsAmount;
      this.createVendorPayment.get('tds_amount')?.setValue(tdsAmount.toFixed(2), { emitEvent: false });
  
      const net_amount = record_amount - tdsAmount;
      this.createVendorPayment.get('net_amount')?.setValue(net_amount.toFixed(2), { emitEvent: false }); 
    }
   
    if (+this.remainingAmount) {
      let amount_due = this.remainingAmount - record_amount;
      this.createVendorPayment.get('amount_due')?.setValue(amount_due);
    }
     else {
      // let final_amount = this.vendorHistoryData[this.vendorHistoryData.length-1]
      let total_amount = +this.createVendorPayment.get('total_amount')?.value || 0;
      let amount_due = total_amount - record_amount;
      this.createVendorPayment.get('amount_due')?.setValue(amount_due);
      
    }
     

  }
}

   
   
     
   

    }








    getAllBranchData:any=[]
    getAllBranch(){
      this._configurationalMasterService.getListBranchSetup().subscribe((res: any) => {
        this.getAllBranchData = res.data
       
      })
    }

    getBranchById(data:any){
      this._finaceService.createVendorPaymentVoucherSeries(data.id).subscribe((res:any)=>{
        console.log(res.data)
        this.createVendorPayment.get('documentNo')?.setValue(res.data)
      })
    }

}

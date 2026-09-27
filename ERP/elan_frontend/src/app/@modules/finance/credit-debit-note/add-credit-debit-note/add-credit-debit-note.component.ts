import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { GrnServiceService } from 'src/app/@modules/purchase-management/services/grn-service.service';
import { SalesManagementService } from 'src/app/@modules/sales-management/sales-management-service/sales-management.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-add-credit-debit-note',
  templateUrl: './add-credit-debit-note.component.html',
  styleUrls: ['./add-credit-debit-note.component.scss']
})
export class AddCreditDebitNoteComponent {
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
  creditDebitBuilder:FormGroup
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
    private _GrnService: GrnServiceService,
    private $common: CommonService,
    private _fb: FormBuilder,
    private $miscellaneousService: MiscellaneousService,
    private location: Location,
     
  ) {
    this.baseUrl = environment.servralUrl;


    this.rowClass = 'rowClass';
    this.creditDebitBuilder = _fb.group({
      documentNo:[''],
      vendor_id:[''],
      customer_id:[''],
      category_id:['',Validators.required],
      invoiceNo:['',Validators.required],
      note_type:['',Validators.required],
      date:['',Validators.required],
      amount:['',Validators.required],
      due_amount:[''],
      invoice_due_amount:[''],
      upload_document:[''],
      remarks:[''],
    })

  }
return_id:any;
status:any;
financial_id:any;
party_type:any
isViewMode:boolean = false;
  ngOnInit(): void {
    // this.creditDebitBuilder.get('note_type')?.disable()
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_id = localStorage.getItem('financial_id');
    this.getBankList()
    let entityId = localStorage.getItem("selectedEntityId");
    
    this.getAllSuperUserData(entityId);
    this.getUnAppVendor();
    

    this.activeroute.queryParams.subscribe((res: any) => {
      this.return_id = res.po_id;
      this.status = res.status;
      this.id = res.id;
      this.party_type=res.party_type
  
      this.isViewMode = res.view == 'true';
    
      if (this.id) {
        this.getCreditNoteById(this.id,this.party_type);
      }
    
    });
  }
  isEmployee: boolean = true; // Default to "Employee"

toggleUserType(event: MatSlideToggleChange) {
  this.isEmployee = event.checked;
}

replacementDataList:any=[]
category_name:any;
// getCreditDebitData(){
//   this._GrnService.replacementGRN(this.return_id,'credit_note').subscribe((response: any) => {
//     console.log(response.data)
//     this.replacementDataList = response.data?.item
//     this.total_invoice_amt = response.data?.amount;
//     this.category_name = response.data.name
//      if(response.data.vendor_id){
//       this.getData('VENDOR')
//       this._finaceService.creditDebitCodeCustomer(response.data?.vendor_id,'credit_note').subscribe((res:any)=>{
//         if(res){
//           this.creditDebitBuilder.patchValue({
//             documentNo:res.data
//           })}
//         })

//        let vendor_id=response.data.vendor_id
//        this._finaceService.getVendorDetails(vendor_id).subscribe((res:any)=>{
//         if(!res.data?.length){ 
//          this.getCategoryById=res.data
//          return this.toast.error('Category not found on this vendor')
            
//         } else{
//          this.getCategoryById=res.data
//          this.creditDebitBuilder.get('note_type')?.enable()
//         }    
//        },(err:any)=>{
//          this.toast.error(err.error.message)
//        })

       
//      }
//      else{
//       this.getData('CUSTOMER')

//      }
//      let entity_id = localStorage.getItem('selectedEntityId')
//      this._finaceService.getInvoiceByIdVendor(response.data?.vendor_id,response.data?.product_id,entity_id).subscribe((res:any)=>{
        
        
//          if(!res.data?.length){
//            this.creditDebitBuilder.get('category_id')?.reset()
//            this.getAllINvoicesDataList= res.data;
//            return this.toast.error('Invoice not found on this vendor category')
//           } else{
//            this.getAllINvoicesDataList= res.data;
//           }   
        
//      },(err:any)=>{
//         return this.toast.error('Invoices Not found on this')
//      })
//     this.creditDebitBuilder.patchValue({
//       vendor_id:response.data?.vendor_id,
//       category_id:response.data?.product_id,
//       invoiceNo:response.data?.grn_id,
//       note_type:'credit_note',
//       date:new Date(),
//       amount:response.data?.amount,
//       due_amount:response.data?.amount_due 
//     })
//   });
// }


goBack(){
  this.location.back()
}
getCreditNoteById(id: any,party_type:any) {

  this.$common.showLoader();

  this._finaceService.getCreditNoteById(id,party_type).subscribe(

    (res: any) => {

      this.$common.hideLoader();

      if (res && res.data) {

        let data = res.data;
        if(data.party_type=='VENDOR'){
          this.getData('VENDOR')
        }else{
            this.getData('CUSTOMER')
        }
      

        if (data.vendor_id) {

          this.vendor = true;
          this.customer = false;

        } else {

          this.vendor = false;
          this.customer = true;

        }

    

        this.getAllInvoiceData = [...(data.itmeList || [])];

        // =========================
        // TOTAL AMOUNT
        // =========================

        this.total_invoice_amt = data.amount;

        // =========================
        // UPLOAD DOC
        // =========================

        this.upload_document = data.upload_doc;

        // =========================
        // HISTORY
        // =========================

        this.historyData = data.itmeList || [];

        // =========================
        // FORM PATCH
        // =========================

        this.creditDebitBuilder.patchValue({
          documentNo: data.document_number,
          vendor_id: data.vendor_id,
          customer_id: data.customer_id,
          category_id:
            data.party_type == 'CUSTOMER'
              ? 'sales_return'
              : 'purchase_return',

          invoiceNo:
            data.itmeList?.length
              ? data.itmeList[0].sales_invoice_id
              : '',

          note_type: data.note_type,

          date: new Date(data.builder_date),

          amount: data.amount,

          due_amount: data.due_amount,

          remarks: data.remark

        });

      
        let payload: any;

        if (this.vendor) {

          payload = {
            document_type: 'purchase_return',
            entity_id: this.entity_id,
            vendor_id: data.vendor_id
          };

        } else {

          payload = {
            document_type: 'sales_return',
            entity_id: this.entity_id,
            customer_id: data.customer_id
          };

        }

        this._finaceService
          .getAllPoGrnSoByVendorId(payload)
          .subscribe((response: any) => {

            this.getAllINvoicesDataList = response.data || [];

          });

      }

    },

    (err: any) => {

      this.$common.hideLoader();

      this.toast.error(err.error.message);

    }

  );

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
        this.creditDebitBuilder.patchValue({ upload_document: null });
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
      headerName: 'Quantity',
      field: 'quantity',
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
      field: 'price_per_unit',
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
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }
        return '0.00';
      }
      
    },
    {
      headerName: 'Total Discount',
      field: 'totalDiscountAmount',
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
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }
        return '0.00';
      }
      
    }, 
    {
      headerName: 'Total Amount',
      field: 'totalPrice',
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
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }
        return '0.00';
      }
    },
    {
      headerName: 'Total GST Amount',
      field: 'totalWithGst',
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
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(amount);
        }
        return '0.00';
      }
      
    },


    
  ];

  // public columnDefsHistory = [
  //   {
  //     headerName: 'S.No.',
  //     valueGetter: "node.rowIndex + 1",
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     cellClass: "grid-cell-centered",
  //     flex: 1,
  //     maxWidth: 85,
  //   },
  //   {
  //     headerName: 'Date',
  //     field: 'builder_date',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     cellClass: 'grid-cell-centered',
  //     flex: 1,
  //     minWidth: 150,
  //   },
  //   {
  //     headerName: 'Party Name',
  //     field: 'party_type',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     cellClass: 'grid-cell-centered',
  //     flex: 1,
  //     minWidth: 150,
  //   },
  //   {
  //     headerName: 'Category',
  //     field: 'name',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     cellClass: 'grid-cell-centered',
  //     flex: 1,
  //     minWidth: 150,
  //   },
   

  //   {
  //     headerName: 'Invoice Number',
  //     field: 'invoiceNo',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     cellClass: 'grid-cell-centered',
  //     flex: 1,
  //     minWidth: 150,
  //   },

  //   {
  //     headerName: 'Note Type',
  //     field: 'note_type',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     // cellClass: 'grid-cell-centered',
  //     valueFormatter: function(params: any) {
  //       return params.value=='credit_note'?'CREDIT NOTE':'DEBIT NOTE';
  //     },
  //     flex: 1,
  //     minWidth: 150,
      
  //   },
  //   {
  //     headerName: 'Document Number',
  //     field: 'document_number',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     // cellClass: 'grid-cell-centered',
  //     flex: 1,
  //     minWidth: 150,
      
  //   },
    
  //   {
  //     headerName: 'Amount',
  //     field: 'amount',
  //     sortable: true,
  //     resizable: true,
  //     wrapHeaderText: true,
  //     autoHeaderHeight: true,
  //     // cellClass: 'grid-cell-centered',
  //     flex: 1,
  //     minWidth: 150,
  //     cellRenderer: (params: any) => {
  //       const amount = Number(params.value);
  //       if (!isNaN(amount)) {
  //         return new Intl.NumberFormat('en-NG', {
  //           style: 'currency',
  //           currency: 'NGN',
  //           minimumFractionDigits: 2,
  //           maximumFractionDigits: 2
  //         }).format(amount);
  //       }
  //       return '₦ 0.00';
  //     }
  //   },


    
  // ];


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
    this._finaceService.getGParty('CUSTOMER').subscribe((data: any) => {
      this.customersData = data.data;
      this.customersData1 = data?.data?.map((x:any)=>x.company_name);
      this.customersData2 = this.customersData
    },(error)=>{
    this.customersData = [];
  })
}

customerFilter(e:any){
  let aa= e;
  let filteredVariable = this.customersData2.filter((item: any) => aa.includes(item.company_name));
  this.customersData = filteredVariable
}

vendorData:any=[]
vendorData1:any=[]
vendorData2:any=[]
getUnAppVendor(){
  let entity_ids = localStorage.getItem('selectedEntityId')
  this._finaceService.getGParty('VENDOR').subscribe((res:any)=>{
    this.vendorData = res.data;
    this.vendorData1 = res?.data?.map((x:any)=>x.vendor_name);
    this.vendorData2=this.vendorData
    
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
invoice_due_amount:any;
type:any
purchase_return_id:any;
getAllInvoicesData(data:any){
  this.purchase_return_id = data.purchase_return_id
    if(this.vendor){
     this.type = 'VENDOR'
    }else{
      this.type = 'CUSTOMER'
    }
    this._finaceService.getInvoiceItemByinvoiceId(data.sales_invoice_id,data.purchase_return_id,this.type).subscribe((res:any)=>{
      if(!res.data?.length){
         this.getAllInvoiceData=res.data;
         this.historyData=res.history;
         this.total_invoice_amt = res.total_amount;
         this.due_amount = res.amount_due;  
         this.invoice_due_amount = res.invoice_due_amount;  
         this.creditDebitBuilder.patchValue({
          due_amount:res.amount_due,
          invoice_due_amount:res.invoice_due_amount
         })
         console.warn(this.getAllInvoiceData,'vensor');
         
        return this.toast.error('No Data found....')
        
       } else{
        this.getAllInvoiceData=res.data
        this.historyData=res.history;
        this.due_amount = res.amount_due;
        this.total_invoice_amt = res.total_invoice_amt;
        this.creditDebitBuilder.patchValue({
          due_amount:res.amount_due,
          invoice_due_amount:res.invoice_due_amount
         })
       }
    })
  
  
}

 vendor:boolean=true;
 customer:boolean=false;
  getData(data:any){
    if(data=='VENDOR'){
      this.vendor=true;
      this.customer=false;
      this.getUnAppVendor()
      this.creditDebitBuilder.reset()
      this.getAllInvoiceData=[]
    }else{
      this.vendor=false;
      this.customer=true;
      this.creditDebitBuilder.reset()
      this.getAllInvoiceData=[]
      
    }
  }
  getCategoryById:any=[]
  vendor_id:any
  payload:any
 getAllINvoicesDataList:any=[];
  getCategoryByInvoice(event:any){
let vendor_id = this.creditDebitBuilder.get('vendor_id')?.value
let customer_id = this.creditDebitBuilder.get('customer_id')?.value
 
if(this.vendor){
   this.payload={
  document_type:event.value,
  entity_id:this.entity_id,
  vendor_id:vendor_id,
  purchase_return_id:event.purchase_return_id
}
}else{

     this.payload={
  document_type:event.value,
  entity_id:this.entity_id,
  customer_id:customer_id,
  purchase_return_id:event.purchase_return_id
}
}

this._finaceService.getAllPoGrnSoByVendorId(this.payload).subscribe((res:any)=>{
   if(!res.data?.length){
         this.getAllINvoicesDataList=res.data;
         this.total_invoice_amt = res.total_amount;
         this.historyData=res.history;
         this.due_amount = res.amount_due;  
         this.creditDebitBuilder.patchValue({
          due_amount:res.amount_due,
          invoice_due_amount:res.invoice_due_amount
         })
         
         
        return this.toast.error('No Data found....')
        
       } else{
        this.getAllINvoicesDataList=res.data
        this.total_invoice_amt = res.total_amount;
        this.historyData=res.history;
        this.due_amount = res.amount_due; 
        this.creditDebitBuilder.patchValue({
          due_amount:res.amount_due,
          invoice_due_amount:res.invoice_due_amount
         })
       }
},(err:any)=>{
  this.creditDebitBuilder.get('category_id')?.reset()
   return this.toast.error(err.error.message)
})

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
       this.creditDebitBuilder.get('note_type')?.enable()
      }
     },(err:any)=>{
       this.toast.error(err.error.message)
     })
     
  }
  lastNumber:any
  lastNumber1:any
  getNotedeta(event:any){
  
    if(this.customer){
      if(event.value=='debit_note'){
        this._finaceService.creditDebitCodeCustomer(event.value).subscribe((res:any)=>{
         if(res){
           this.creditDebitBuilder.patchValue({
             documentNo:res.data
           })
         }
        })
       }else{
        this._finaceService.creditDebitCodeCustomer(event.value).subscribe((res:any)=>{
          if(res){
            this.creditDebitBuilder.patchValue({
              documentNo:res.data
            })
          }
         })
       }
    }
    else if(this.vendor){
      if(event.value=='credit_note'){
        this._finaceService.creditDebitCodeCustomer(event.value).subscribe((res:any)=>{
          if(res){
            this.creditDebitBuilder.patchValue({
              documentNo:res.data
            })
          }
         })
      }else if(event.value=='debit_note'){
        this._finaceService.creditDebitCodeCustomer(event.value).subscribe((res:any)=>{
          if(res){
            this.creditDebitBuilder.patchValue({
              documentNo:res.data
            })
          }
         })
      }
    }
    
    
 
    
  }

  
  submitCreditDebitNote(data:any){
    let payload={
      document_number:data.value?.documentNo,
      builder_date:moment(data.date).format('YYYY-MM-DD'),
      note_type:data.value?.note_type,
      sales_invoice_id:data.value?.invoiceNo,
      vendor_id:data.value?.vendor_id,
      customer_id:data.value?.customer_id,
      itmeList:this.return_id?this.replacementDataList:this.getAllInvoiceData,
      amount:data.value?.amount,
      status:this.return_id?'Replacement':null,
      purchase_return_id:this.purchase_return_id,
      upload_doc:this.upload_document,
      entity_id:this.entity_id,
      remark:data.value.remarks,
      financial_id:this.financial_id,
      amount_due: this.creditDebitBuilder.get('due_amount')?.value,
    }
     
this.$common.showLoader();
    this._finaceService.createcreditdebitNote(payload).subscribe((res:any)=>{
      if(res)   
        this.route.navigate(['/master/finance/credit-debit-note'])
      this.$common.hideLoader();
        return this.toast.success(res.message)
    },(err:any)=>{
      this.$common.hideLoader();
      return this.toast.error(err.error.message)

    })

  }
 clearData(control: any) {
    this.creditDebitBuilder.get(control)?.setValue(null)
   
  }
}

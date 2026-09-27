import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { environment } from 'src/app/environments/environment';



@Component({
  selector: 'app-tds-sections',
  templateUrl: './tds-sections.component.html',
  styleUrls: ['./tds-sections.component.scss']
})
export class TdsSectionsComponent {
  rowClass: any;
  tdsForm: any;
  non_register: boolean = false;
 
  private gridApi!: GridApi<any>;
  // supplier_purchase: boolean = false;
  vendor_id: any;
  codeGet: any;
  cccodeGet: any;
  codeSncGet: any;
  checkRegister: string;
  supplierCheck: string;
  editBankData: any;
  supplierPurchaseChecked: boolean =false;
  type: any;
  data:any=[]
  rowData:any=[]
  entity_id: any= null;
  constructor(
    private route: Router,
    private _empRegistration: EmpRegistrationService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    private vendorService: VendorManagementService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _commonService : CommonService,
    private crm : CrmService,
  ) {
    this.rowClass = 'rowClass';

    this.tdsForm = this.fb.group({
      // tds_id:new FormControl(null),
      // nature_id:new FormControl(null),
      // threshold_limit:new FormControl(null),
      // tds_rate:new FormControl(null),
      //  nature:new FormControl(null),
      isChecked:new FormControl(null),
      time_periods_from:new FormControl(null),
      time_periods_to:new FormControl(null),
      rate:new FormControl(null),
      certificate_doc:new FormControl(null),
      isChecked_194:new FormControl(null),
      rate_194:new FormControl(null),
      declaration_doc:new FormControl(null),
      from_month:new FormControl(null),
      to_month:new FormControl(null),
      tdsList: this.fb.array([this.createItemsField()])
    
    })

  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.getAllTdsData()
    this.activeroute.queryParams.subscribe((params: any) => {
    this.vendor_id = params.id;
     this.type=params?.type;

    });
     this.getAccountChart();
    if(this.type =="Edit" ||  this.type =="View"){
      this.getByVendor()
      // this.getCcCode();
      // this.getSncCode();
    }
    // this.getAccountChart();
    
   
  }

  createItemsField(): FormGroup {
    return this.fb.group({
      tds_id: ['', Validators.required],
      nature: [''],    
      nature_id: ['', Validators.required],
      threshold_limit: ['', Validators.required],
      tds_rate: ['', Validators.required],
      maximum_amount: ['',Validators.required]
    });
  }

  addItem() {
    for (let control of this.tdsList.controls) {
      if (control.invalid) {
        control.markAllAsTouched(); 
        this.toast.warning('Please fill all required fields before adding a new item.')
        return; 
      }
    }
    this.tdsList.push(this.createItemsField());
  }

  removeItem(index: number) {
    this.tdsList.removeAt(index);
  }


  get tdsList(): FormArray {
    return this.tdsForm.get('tdsList') as FormArray;
  }

  tdsData:any=[]
  getAllTdsData = () => {
     
    this._configurationalMasterService.getAllTdsData(this.entity_id).subscribe((res: any) => {  
      this.tdsData = res.data;
    },(err: any) => {
      this.tdsData = []
    });
  }

natureData:any=[]
  getTdsById(data:any,i:any){
    this._configurationalMasterService.getTdsDataByIdVendor(data.id).subscribe((res:any)=>{
    this.natureData[i] = res.data;
    })
     
     this.tdsList.controls[i]?.get('nature')?.setValue(data.nature)
   
  }

  getNatureData(data:any,i:any){
    this.tdsForm.patchValue({
      threshold_limit:data.threshold_limit,
      tds_rate:data.rate,
      maximum_amount:data.maximum_amount
    })
    this.tdsList.controls[i]?.get('threshold_limit')?.setValue(data.threshold_limit)
    this.tdsList.controls[i]?.get('maximum_amount')?.setValue(data.maximum_amount)
    this.tdsList.controls[i]?.get('tds_rate')?.setValue(data.rate)
  }

imagePath:any
  getByVendor(){
    this.vendorService.getByVendor(this.vendor_id).subscribe((res: any) => {
      this.editBankData= res.data ;
       this.rowData = res.data.recordPaymentHistory;
      this.tdsForm.patchValue({
        account_chart: this.editBankData?.chart_of_account_id
      })
      // chart_of_account_id
     
        if(this.editBankData?.certificate_doc){
           this.imagePath = environment.servralUrl+'/uploaded_files/'+this.editBankData?.certificate_doc
        }
        console.log(this.imagePath,'imagePath')
      this.tdsForm.patchValue({
         
        isChecked:this.editBankData?.isChecked==1?true:false,
        isChecked_194:this.editBankData?.isChecked_194==1?true:false,
        rate:this.editBankData?.rate,
        rate_194:this.editBankData?.rate_194,
        from_month:this.editBankData?.from_month,
        to_month:this.editBankData?.to_month,
        time_periods:this.editBankData?.time_periods,
        time_periods_from:this.editBankData?.time_periods_from,
        time_periods_to:this.editBankData?.time_periods_to,
  
      })
      this.isChecked=this.editBankData.isChecked==1?true:false
      this.isCheckeddata=this.editBankData.isChecked_194==1?true:false
       this.editBankData.tdsList.forEach((res:any,i:any)=>{
        this.tdsList.push(this.createItemsField())
        
        this._configurationalMasterService.getTdsDataByIdVendor(res.tds_id).subscribe((res:any)=>{
          this.natureData[i] = res.data;
          })
        this.tdsList.controls[i]?.get('tds_id')?.setValue(res.tds_id)
        this.tdsList.controls[i]?.get('nature')?.setValue(res.nature)
        this.tdsList.controls[i]?.get('nature_id')?.setValue(res.nature_id)
        this.tdsList.controls[i]?.get('threshold_limit')?.setValue(res.threshold_limit)
        this.tdsList.controls[i]?.get('maximum_amount')?.setValue(res.maximum_amount)
        this.tdsList.controls[i]?.get('tds_rate')?.setValue(res.tds_rate)
       })
       })
       this.tdsList.removeAt(this.editBankData?.tdsList?.length-1)
  }

  viewFile(data:any){
    window.open(data,'_blank')
  }

  getAccountChart(){
    ;
    // this._commonService?.showLoader()
    this.vendorService.getAccountChart(this.entity_id).subscribe((res:any)=>{
      this._commonService?.hideLoader()
      this.data=res?.data;
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  cancels(path: any) {
    this.route.navigate([path])
  }


  onSubmit(){
let val=this.tdsForm.value;
console.log(val,'vall');
if (this.tdsForm.invalid) {
  this.tdsForm.markAllAsTouched();
  this.toast.error('Required fields should not be empty', 'Fields Error');

  return;
}
val.id=this.vendor_id
val.tab_type='tds_section'
val.certificate_doc=this.imageURL
this.vendorService.createVendorNew(val).subscribe(
  (res: any) => {
    this._commonService?.hideLoader();
    if (res.code == 200) {
      this.toast.success(res.message);
      this.vendor_id = res.data;

       
      this.route.navigate(
        ['master/vendor/vendor-list'],
      
      );
    }
  },
  (err) => {
    this._commonService?.hideLoader();
    this.toast.error(err.error.message);
  }
);
}
isChecked:boolean=false;
isCHeckedData(event:any){
    if(event.checked){
      this.isChecked=true
      this.isCheckeddata=false
      this.tdsForm.get('isChecked_194')?.reset()
      this.tdsForm.get('rate')?.setValidators([Validators.required]);
      this.tdsForm.get('time_periods')?.setValidators([Validators.required]);
      this.tdsForm.get('certificate_doc')?.setValidators([Validators.required]);
    }else{
      this.isChecked=false
      this.tdsForm.get('isChecked_194')?.reset()
      this.tdsForm.get('rate')?.clearValidators()
      this.tdsForm.get('ratime_periodste')?.clearValidators()
      this.tdsForm.get('certificate_doc')?.clearValidators()

    }
    this.tdsForm.get('rate')?.updateValueAndValidity();
    this.tdsForm.get('time_periods')?.updateValueAndValidity();
    this.tdsForm.get('certificate_doc')?.updateValueAndValidity();
}


imageURL:any;
uploadDoc(event: any) {
  let isValidExtension = this._commonService.checkForValidFile(event);
  if (!isValidExtension) {
    return;
  }

  let data = '';
  if (event.target.files && event.target.files[0]) {
    data = event.target.files[0];
  }

  const formData = new FormData();
  formData.append('file', data);

  this.crm.uploadDoc(formData).subscribe(
    (res: any) => {
      if (res?.url) {
        this.imageURL = res.url
        this.imagePath = res.url
      }
    },
    (err) => {
      if (err) {
        this.toast.error('Something went wrong');
      }
    }
  );
}

getMonthYearRange() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;  

  let startMonthYear: string;
  let endMonthYear: string;

  if (currentMonth >= 3) {
  
    startMonthYear = `04-${String(currentYear)}`;
    endMonthYear = `05-${currentYear + 1}`;
  } else {
    
    startMonthYear = `04-${String(currentYear - 1)}`;
    endMonthYear = `05-${currentYear}`;
  }

  console.log('Start:', startMonthYear);
  console.log('End:', endMonthYear);

  this.tdsForm.patchValue({
    from_month: startMonthYear,
    to_month: endMonthYear
  });

  return {
    start: startMonthYear,
    end: endMonthYear
  };
}


isCheckeddata:boolean=false;
isCHeckedDatass(event:any){
 
    if(event.checked){
      this.tdsForm.get('isChecked')?.reset()
      this.isCheckeddata=true
      this.isChecked=false
       this.tdsForm.get('rate_194').setValue(0)
      //  this.getMonthYearRange()
    }else{
      this.isCheckeddata=false
      this.tdsForm.get('isChecked')?.reset()

    }
     
}

public columnDefs = [
  {
    headerName: 'S.No',
    field: 'serialNumber',
    sortable: false,  
    resizable: true,
    wrapHeaderText: true,
    autoHeight: true,
    cellClass: "grid-cell-centered",
    flex: 1,
    minWidth: 150,
    valueGetter: (params:any) => params.node.rowIndex + 1
  },
  {
    headerName: 'Date',
    field: 'date',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: "grid-cell-centered",
    flex:1,
    minWidth:150,
  },
 
  {
    headerName: 'Document Type ',
    field: 'document_type',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: "grid-cell-centered",
    flex:1,
    minWidth:150,
  },
  
  
  {
    headerName: 'Document Number',
    field: 'documentNo',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: "grid-cell-centered",
    flex:1,
    minWidth:150,
    
  },
  {
    headerName: 'Document Amount',
    field: 'total_amount',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: "grid-cell-centered",
    flex:1,
    minWidth:150,
  },
  {
    headerName: 'Amount Paid',
    field: 'recieved_amount',
    sortable: true,
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    cellClass: "grid-cell-centered",
    flex:1,
    minWidth:150,
  },
  {
    headerName: 'Threshold Limit',
    field: 'threshold_limit', 
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    flex:1,
    minWidth:150,
    cellClass: "grid-cell-centered",
  }, 
  {
    headerName: 'Maximum Threshold Limit',
    field: 'maximum_amount', 
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    flex:1,
    minWidth:150,
    cellClass: "grid-cell-centered",
  }, 
  {
    headerName: ' TDS Rate',
    field: 'rate', 
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    flex:1,
    minWidth:150,
    cellClass: "grid-cell-centered",
   
  },
  {
    headerName: 'TDS Amount',
    field: 'tds_amount', 
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    flex:1,
    minWidth:150,
    cellClass: "grid-cell-centered",
   
  },
  {
    headerName: 'Remaining Limit',
    field: 'amount_due', 
    resizable: true,
    wrapHeaderText: true,
    autoHeaderHeight: true,
    flex:1,
    minWidth:150,
    cellClass: "grid-cell-centered",
   
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

onFilterTextBoxChanged() {
  this.gridApi.setQuickFilter(
    (document.getElementById('filter-text-box') as HTMLInputElement).value
  );
}


  }

 

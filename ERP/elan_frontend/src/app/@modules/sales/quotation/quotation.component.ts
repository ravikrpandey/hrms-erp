import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CrmSubjectService } from 'src/app/@shared/services/crm/crm-subject.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { ActionLeadStatusComponent } from '../../crm/pages/action/action-lead-status/action-lead-status.component';
import { ViewLeadStatusDialogComponent } from '../../crm/pages/dialogs/view-lead-status-dialog/view-lead-status-dialog.component';
import { Location } from '@angular/common';
import { QuotationActionComponent } from './quotation-action/quotation-action.component';
import { SalesService } from '../service/sales.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss'],
})
export class QuotationComponent {
  private gridApi!: GridApi<any>;
  rowData: Candidate[] = [];
  candidate_id?: number;
  assignAction: any;
  rowClass: any;
  matBtnColor: boolean = true;
  leadSummaryForm: FormGroup;
  public gridOptions: any = { rowSelection: 'multiple' };
  selectedLeadList: any = [];
  userLoginId: any;
  entity_id: any;
  radioGroup:any
  financial_year_id: any;
  loginUser: any;
  openExisting: boolean = false;
  openDealersClient: boolean = false;
  dealerRadio: boolean = false;
  existClientData: boolean = false;
  selectedOption: any;
  selectedDealerOption: any;
  customerList: any[] = [];
  quotationType:boolean=false;
  constructor(
    private location: Location,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private recruitService: RecruitService,
    private _rbackService: RbacMasterService,
    private $crm: CrmService,
    private crmSubject: CrmSubjectService,
    private toast: ToastrService,
    private salesService: SalesService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) {
    this.rowClass = 'rowClass';
    this.leadSummaryForm = this.fb.group({
      user_id: new FormControl(null),
      from_date: new FormControl(null),
      to_date: new FormControl(null),
      status: new FormControl(null),
      dealer_status: new FormControl(null),
      assign_id: new FormControl(null),
    });
  }

  ngOnInit(): void {
    let a: any = localStorage.getItem('signInUser');
    this.userLoginId = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.loginUser = JSON.parse(a);
    this.getAllExistingClient();
    if (this.userLoginId) {
      this.getLeadSummaryData();
      this.getEmployee();
      this.getLeadStatusData();
    }
    
    this.activeRoute.queryParams.subscribe((params: any) => {
   if(params.quotationType==='direct'){
    this.quotationType=true
    this.openExisting=true
    }
    })
  }
isForDealers:boolean=false;
  changeSelect(e: any) {
    if (e?.value === '1') {
      this.openExisting = false;
      this.existClientData=false;
      Swal.fire({
        title: 'Are you sure you want to Process This New Quotation?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f44336', // red
        cancelButtonColor: '#063178', // blue
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.openExisting = false;
          this.router.navigate(['/master/sales/create-proposal'], {
            queryParams: {
              client_id: 'new',
              type: 'new_client',
              actionType: 'create',
              flag: 'Add New',
            },
          });
        } else {
          this.selectedOption = null;
        }
      });
    } else if (e?.value === '2') {
      this.openExisting = true;
      this.isForDealers=false;
      this.dealerRadio=false;
      this.dealerClientData3=[];
      this.dealerClientData=[];
      this.dealerClientData2=[];
      this.clientData=[];
      this.clientData2=[];
      this.clientData3=[];
      this.exsitingDealersData=null;
      this.exsitingData=null;
      this.radioGroup = e?.value;
      this.existClientData=false;
      this.leadSummaryForm.get('dealer_status')?.patchValue(null);
      this.leadSummaryForm.get('status')?.patchValue(null);
      this.getAllExistingClient();
    }else if(e?.value ==='3'){
      this.dealerRadio=false;
      this.openExisting = true;
      this.isForDealers=true;
      this.radioGroup = e?.value;
      this.openDealersClient=false;
      this.leadSummaryForm.get('dealer_status')?.patchValue(null);
      this.leadSummaryForm.get('status')?.patchValue(null);
      this.getAllExistingClient();
    }
  }
  isExistigDealer='';
  changeDealerSelect(e: any) {
    if (e?.value === '1') {         
      Swal.fire({
        title: 'Are you sure you want to Process This New Quotation?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f44336', // red
        cancelButtonColor: '#063178', // blue
        confirmButtonText: 'Yes!',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.leadSummaryForm.get('dealer_status')?.patchValue(null);
          this.exsitingDealersData=null;
          this.dealerClientData3=[];
          this.dealerClientData=[];
          this.dealerClientData2=[];
          this.openDealersClient=false;
          this.existClientData=false
          this.openExisting = true;
          this.router.navigate(['/master/sales/create-proposal'], {
            queryParams: {
              client_id: 'new',
              type: 'new_client',
              actionType: 'create',
              flag: 'Add New',
              dealer:this.existingClientId.id
            },
          });
        } else {
          
          this.leadSummaryForm.get('dealer_status')?.patchValue(null);
          this.exsitingDealersData=null;
          this.dealerClientData3=[];
          this.dealerClientData=[];
          this.dealerClientData2=[];
          this.openDealersClient=false;
          this.existClientData=false;
          this.getAllExistingClient();  
          // this.openExisting = true;
          // this.clientData = this.clientData2;
        }
      });
    } else if (e?.value === '2') {
      this.isExistigDealer=e?.value;
     this.getDealerCustomer()
    }
  }
  dateRangeValidator(formGroup: FormGroup) {
    const fromDate = formGroup?.get('from_date')?.value;
    const toDate = formGroup?.get('to_date')?.value;
    if ((fromDate && toDate && fromDate > toDate) || (!fromDate && toDate)) {
      formGroup?.get('to_date')?.setErrors({ invalidDateRange: true });
      this.leadSummaryForm.patchValue({
        to_date: '',
      });
    } else {
      formGroup?.get('to_date')?.setErrors(null);
    }
  }
  getDealerCustomer(){
    let existingClient = this.leadSummaryForm.get('status')?.value;
    this.salesService.getsCustomerByDealer(existingClient).subscribe({
      next:(res:any)=> {
        
        this.openDealersClient = true;
        this.isForDealers=true;
        this.dealerClientData = res.data;
        this.existClientData=true
      this.dealerClientData2 = res?.data;
      this.dealerClientData3 = this.dealerClientData.map(
        (value: any) => value.company_name
      );
        // this.toast.success(res.message)
      },error:(err)=> {
        this.toast.error(err.error.message)
      },
    })
  
  }
  clientData2: any;
  clientData3: any;
  clientData: any = [];
  dealerClientData2: any;
  dealerClientData3: any;
  dealerClientData: any = [];
  getAllExistingClient() {
    // this.salesService.existingClient().subscribe((res:any)=>{
    //   if(res){
    //     this.clientData=res.data
    //   }
    // })
    let data = {
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id,
      employee_id: this.userLoginId,
      userRole: this.loginUser?.role,
      status: 'Quotation',
    };
    this.salesService.getAllCustomersList(data).subscribe((res: any) => {
      if (res) {
        this.clientData = res.data;

        this.clientData2 = res?.data;
        this.clientData3 = this.clientData.map(
          (value: any) => value.company_name
        );
    // this.getAllProspectList()

      }
    });
    // this.getAllProspectList();
  }
  typeFilter(e: any) {
    const aa = e;
    let filteredVariable = this.clientData2.filter((item: any) =>
      aa.includes(item.company_name)
    );
    this.clientData = filteredVariable;
  }
  getAllProspectList() {
    let data = {
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id,
      employee_id: this.loginUser?.employee_id,
      userRole: this.loginUser?.role,
      status: 'Pending',
    };
    this.salesService.getAllCustomersList(data).subscribe((res: any) => {
      if (res && res.data) {
        this.customerList = res.data;
        console.log(this.clientData,"this.clientData<<<<<<<<<");
    console.log(this.customerList,"this.clientData<<<<<<<<<2");
    const merged = [...this.clientData, ...this.customerList];
console.log(merged,"this.clientData<<<<<<<<<3")
this.clientData = merged
this.clientData2 = merged;
        this.clientData3 = this.clientData.map(
          (value: any) => value.company_name
        );
      } else {
        this.customerList = [];
      }
    });

    

    
  }
  // Get all start
  getLeadSummaryData() {
    try {
      this.rowData = [];
      let data = this.leadSummaryForm?.value;
      data.from_date = moment(data?.from_date).format('YYYY-MM-DD');
      data.to_date = moment(data?.to_date).format('YYYY-MM-DD');
      //
      this.$crm.getLeadSummaryData(data, this.userLoginId).subscribe(
        (response: any) => {
          if (response) {
            this.rowData = response.data;
            this.rowData?.map((item: any) => {
              item.isChecked = false;
            });
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
  // Get all end

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.assignAction = this._rbackService.accessAssignAction();
    }, 0);
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  public columnDefs = [
    // {
    //   headerName: '',
    //   field: 'isChecked',
    //   filter: true,
    //   sortable: true,
    //   headerCheckboxSelection: true,

    //   checkboxSelection: true,
    //   width: 50,
    // },
    {
      headerName: 'S No.',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered ',
      flex: 1,
    },
    {
      headerName: 'Contact Person Name',
      field: 'contact_person_name',
      minWidth: 175,
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Contact Number',
      field: 'contact_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Company Name',
      field: 'company_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Lead Owner',
      field: 'lead_owner',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
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
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: QuotationActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    //
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onCellClicked(e: any) {
    return;
    this.candidate_id = e.data.candidate_id;
    const dialogRef = this.dialog.open(ViewLeadStatusDialogComponent, {
      width: '500px',
      data: e.data,
    });
    dialogRef.afterClosed().subscribe((result: any) => {});
  }

  goBack() {
    // this.location.back()
    window.location.reload();
  }

  // Get employee start
  employeeList: any = [];
  getEmployee() {
    // try {
    //   this.$crm.registrationall().subscribe((response: any) => {
    //     if (response) {
    //       this.employeeList = response.data;
    //     }
    //   }, err => {
    //     console.log(err);
    //   })
    // } catch (error) {
    //   console.log(error);
    // }
  }
  // Get employee end

  // Get status start
  statusList: any = [];
  getLeadStatusData() {
    try {
      this.$crm.getLeadStatusData().subscribe(
        (response: any) => {
          if (response) {
            this.statusList = response.data;
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
  // Get status end

  assignLead() {
    let userId = this.leadSummaryForm?.value?.assign_id;
    if (!userId || !this.selectedLeadList?.length) {
      return this.toast.error(
        'Required fields should not be empty',
        'Fields Error'
      );
    }
    if (userId && this.selectedLeadList?.length) {
      try {
        let req = {
          assign_id: userId,
          leadList: this.selectedLeadList,
          login_id: this.userLoginId,
        };
        this.$crm.createLeadSummary(req).subscribe(
          (response: any) => {
            if (response) {
              this.toast.success(response.message);
              window.location.reload();
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
  }

  onSelectionChanged(event: any): void {
    // Access the selected rows
    this.selectedLeadList = [];
    let selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows?.length) {
      selectedRows?.map((item: any) => {
        this.selectedLeadList.push({ create_lead_id: item?.id });
      });
    }
    console.log('Selected Rows:', selectedRows, this.selectedLeadList);
  }

  // from date and to date validation start
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  FromDate: string;
  toDate: string;
  noOfDay: any;
  todate: any;
  // day = this.now.getDay();
  date = this.now.getDate();
  maxDate = moment({
    year: this.year + 100,
    month: this.month,
    date: this.date,
  }).format('YYYY-MM-DD');
  minDate = moment({
    year: this.year - 0,
    month: this.month,
    date: this.date,
  }).format('YYYY-MM-DD');
  fromDate(e: any) {
    this.FromDate = moment(e.value).format('YYYY-MM-DD');
    this.leadSummaryForm.patchValue({ to_date: '' });
    this.getLeadSummaryData();
  }
  ToDate(e: any) {
    this.toDate = moment(e.value).format('YYYY/MM/DD');
    this.getLeadSummaryData();
  }

  calculateDiff() {
    this.todate = this.leadSummaryForm.value.to_date;
    if (
      this.leadSummaryForm.value.from_date &&
      this.leadSummaryForm.value.to_date
    ) {
      let currentDate = new Date(this.leadSummaryForm.value.from_date);
      let dateSent = new Date(this.leadSummaryForm.value.to_date);
      this.noOfDay =
        (Date.UTC(
          dateSent.getFullYear(),
          dateSent.getMonth(),
          dateSent.getDate()
        ) -
          Date.UTC(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          )) /
        86400000;

      this.leadSummaryForm.controls['leaveCountDays'].patchValue(
        this.noOfDay + 1
      );
    }
  }
  // from date and to date validation end
  exsitingData: any;
  exsitingDealersData: any;
  isDealersClient:boolean=false;
  existingClientId:any;

  getClientDataByName(item: any) {
    
    // this.openDealersClient=false;
    this.selectedDealerOption=null;
    
    
    this.existingClientId = item;
    this.exsitingData = item;
    if(this.radioGroup=='3'){
      
      this.openDealersClient=true;
        this.dealerRadio=true;
      let status = this.leadSummaryForm.get('status')?.value;
      if(status && this.isExistigDealer=='2'){
        this.getDealerCustomer()
      }
      }

    
  }
  getDealerClient(item: any) {
    this.exsitingDealersData=item;
    this.exsitingData = item;
  }

  process(item: any) {
    // this.router.navigate(['/master/sales/create-proposal'], {
    //   queryParams: {
    //     client_id: item.id,
    //     type: 'existing_client',
    //     actionType: 'create',
    //     quotationType:this.quotationType?'direct':''
    //   },
    // });
    
    const queryParams: any = {
      client_id: item.id,
      type: 'existing_client',
      actionType: 'create',
      dealer:this.openDealersClient?this.openDealersClient:null
    };
   
    if (this.quotationType) {
      queryParams.quotationType = this.quotationType;
    }
    
    this.router.navigate(['/master/sales/create-proposal'], {
      queryParams: queryParams,
    });
  }

  createData() {
    this.router.navigate(['/master/sales/create-proposal-new'], {
      queryParams: { actionType: 'create', flag: 'Add New' },
    });
  }
}

export interface Candidate {
  candidate_id: number;
  condidate_name: string;
  email: string;
  mobile: string;
  assigned_hiring_manager: string;
  status: string;
  updatedAt: string;
  upload_resume: string;
}

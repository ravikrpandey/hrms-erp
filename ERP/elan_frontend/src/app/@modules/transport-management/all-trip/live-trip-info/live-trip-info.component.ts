import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { AllTripActionComponent } from '../all-trip-action/all-trip-action.component';
import { AddExpenseDialogComponent } from '../add-expense-dialog/add-expense-dialog.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-live-trip-info',
  templateUrl: './live-trip-info.component.html',
  styleUrls: ['./live-trip-info.component.scss'],
})
export class LiveTripInfoComponent implements OnInit {
  quickFilter: string;
  rowClass = 'rowClass';
  private gridApi!: GridApi<any>;
  depData: any;
  catData: any;
  assignAction: any;
  filteredData: any;
  entity_id: any;
  userDetails: any;
  financial_id: any;
  paginationPageSize = 10;
  public gridOptions: any = { rowSelection: 'multiple', rowHeight: 55 };
  transData: any;
  login_id: any;
  completeForm: FormGroup;
  uploadedFile: File | null = null;
  tripId: any;
  isData:any;
  status:any='status';
  constructor(
    private route: Router,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    public dialog: MatDialog,
    private configService: ConfigurationalmasterService,
    private prService: PurchaseRequestService,
    private _rbackService: RbacMasterService,
    private _commonService: CommonService,
    private transport_service: TransportManagementService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createForm();  

    this.activatedRoute.queryParams.subscribe((params) => {
      this.tripId = params['id'];
      this.completeForm.patchValue({ tripId: this.tripId }); //  
      this.getliveTripInfo(this.tripId);
      this.allExpensesInfo(this.tripId);
    });

    this.entity_id = localStorage.getItem('selectedEntityId');
    this.completeForm.patchValue({ entityId: this.entity_id }); 

    this.financial_id = localStorage.getItem('financial_id');
    this.login_id = localStorage.getItem('EmpMainId');
    this.assignAction = this._rbackService.accessAssignAction();

    // this.configService.getDepartment(this.entity_id).subscribe((res: any) => {
    //   this.depData = res.data;
    // });
  }

  createForm() {
    this.completeForm = this.fb.group({
      remark: ['', Validators.required],
      tripEndKM: ['', [Validators.required]],
      tripId: [''],
      entityId: [''],
    });
  }

  isActive: any = 'liveTripView';
  public rowData: any = [];

  public columnDefs = [
    {
      headerName: 'S.NO',
      valueGetter: 'node.rowIndex + 1',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Category',
      field: 'TRIP_EXPENSE_MASTER.expense_category',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Date',
      field: 'expense_date',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Decription',
      field: 'expense_des',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Amount',
      field: 'expense_amount',
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Receipt',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: AllTripActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  navigate() {
    this.route.navigate(['master/purchase-main/purchase-request/create-pr']);
  }

  onPageSizeChanged() {
    const value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onFilterByDepartment(event: any) {
    if (!event) {
      this.filteredData = this.rowData;
    } else {
      this.filteredData = this.rowData.filter(
        (res: any) => res.department_name === event
      );
    }
  }

  reloadCurrentRoute() {
    const currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
request_id_data:any
  getliveTripInfo(id: any) {
    this.transport_service.getliveTripInfo(this.tripId).subscribe({
      next: (res: any) => {
        this.rowData = [res.data];
        console.log(this.rowData, 'this.transData <<<<<<<<');
        this.request_id_data = this.rowData[0]?.TRANSPORT_REQUEST?.id
      },
      error: (err: any) => {
        console.error('Error fetching transport data', err);
      },
    });
  }

  allExpensesInfoData: any = [];

  allExpensesInfo(tripId: any) {
    this.transport_service.allExpensesInfo(tripId).subscribe({
      next: (res: any) => {
        this.allExpensesInfoData = res.data;
      },
      error: (err: any) => {
        console.error('Error fetching expenses', err);
      },
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadedFile = file;
    }
  }

  submitForm() {
    if (this.completeForm.invalid) {
      alert('Please fill all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('remarks', this.completeForm.get('remark')?.value);
    formData.append('trip_end_km', this.completeForm.get('tripEndKM')?.value);
    formData.append('trip_id', this.completeForm.get('tripId')?.value);
    formData.append('entity_id', this.completeForm.get('entityId')?.value);

    if (this.uploadedFile) {
      formData.append('upload_pod', this.uploadedFile);
    }

    this.transport_service.completeTrip(formData).subscribe({
      next: (res: any) => {
        console.log('Trip completed successfully:', res);
        this.toast.success('Trip completed successfully!', 'Success');
        this.completeForm.reset();
        this.uploadedFile = null;
        this.route.navigate(['/master/transport-management/all-trip/live-trip-list']);
      },
      error: (err: any) => {
        console.error('Error submitting trip:', err);
        this.toast.error('Failed to complete trip. Please try again.', 'Error');
      },
    });
  }

  openDialog() {
    this.dialog
      .open(AddExpenseDialogComponent, {
        width: '500px',
        data: { tripId: this.tripId },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
        this.allExpensesInfo(this.tripId)
         
        }
      });
  }



}


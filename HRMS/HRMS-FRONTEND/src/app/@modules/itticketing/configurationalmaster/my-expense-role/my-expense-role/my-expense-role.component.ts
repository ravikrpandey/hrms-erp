import { Component, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CellValueChangedEvent, GridReadyEvent, ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { LeadService } from 'src/app/@shared/services/lead.service';

@Component({
  selector: 'app-my-expense-role',
  templateUrl: './my-expense-role.component.html',
  styleUrls: ['./my-expense-role.component.scss']
})
export class MyExpenseRoleComponent {
  productMasterForm: any;
  rowData: any
  gridApi: any;
  rowClass: any
  show: boolean = false;
  getAllData: any;
  emplId: any;
  loginUser: any;

  constructor(
    private fb: FormBuilder,
    private elementRef: ElementRef, private renderer: Renderer2,
    private _configurationalMasterService: ConfigurationalmasterService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService, private router: Router,
    private _empService: EmpRegistrationService,
    private _leadService: LeadService
  ) {
    this.productMasterForm = this.fb.group({
      // product_master_name: new FormControl('', Validators.required),
      // certificate_type: new FormControl('', Validators.required),
      // segmentType: new FormControl(null),
      // expenseApprovalfile:new FormControl(null),
      moduleName: new FormControl(),
      employeName: new FormControl(),
      levelModule: new FormControl(),

      //
    });
  }
  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);

    this.getAllEmployMast();
    this.employeList();
  }
  public columnDefs: any = [
    {
      headerName: 'S. No',
      field: 'signature_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Employee Name',
      field: 'employee_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Document ',
      field: 'emp_signature',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },

    // {
    //     headerName: 'Action',
    //     field: 'product_master_name',
    //     flex: 1,
    //     minWidth: 150,
    //     cellRenderer: EmpDocMasterActionComponent,
    //     cellRendererParams: {
    //       className: 'mat-blue',
    //       hideRequestButton: true,
    //       hideDetailsButton: false,
    //       hideDownloadIcon: false,
    //       showCustomIcon: false, // Hide attachment icon
    //     },

    //   }
  ];


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;


  }

  agInit(params: ICellRendererParams): void {

  }

  onFactoryButtonClick(e: any) {
    this.show = true
    // setTimeout(() => {
    //   const element = this.elementRef.nativeElement;
    //   console.log(element);
    //   element.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    // }, 500);

  }
  onCellValueChanged(event: CellValueChangedEvent) {
    let id1 = event.data.segment_id;
    let val = event.newValue;

    //  --------------- change on cell -------------------


    let sta = event.data;


    // if (val == event.data.status) {
    //   this._configurationalMasterService.updateProductMaster(id1, sta).subscribe(
    //     (res: any) => {

    //       this.toaster.success('Status Updated Successfully')
    //     }, (err: any) => {
    //       // this.toaster.error('Something went wrong please try again', 'Error Message');

    //     });
    // }
  }
  save() {
    let val = this.productMasterForm.value;
    this._leadService.createExpenseMaster(val).subscribe((res: any) => {
      console.log(res, 'resssss');

    })
  }

  getAllEmployMast() {
    this._leadService.getAllExpenseMaster().subscribe((res: any) => {
      this.rowData = res.data;
      for (let a = 0; a <= res.data.length; a++) {

      }
    })
  }
  employeList() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._empService.grtEmployeeList(entity_id, this.loginUser?.role).subscribe((res: any) => {
      // 
      // this.rowData = res.data;
      this.getAllData = res.data;

    });
  }
  segmentType(e: any) {
    this.emplId = e
    // console.log(this.segment_certificate);
    // const certificate_filter = this.segment_certificate.filter((res: any) => Number(res.segment_id) == e)
    // console.log(certificate_filter, "check")
    // this.certificate_filter = certificate_filter
    // this.seg_name = certificate_filter[0].segmentName
  }
}

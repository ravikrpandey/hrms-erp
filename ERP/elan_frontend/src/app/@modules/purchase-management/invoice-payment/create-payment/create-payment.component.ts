import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridReadyEvent } from 'ag-grid-community';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { GrnServiceService } from '../../services/grn-service.service';

@Component({
  selector: 'app-create-payment',
  templateUrl: './create-payment.component.html',
  styleUrls: ['./create-payment.component.scss']
})
export class CreatePaymentComponent {
  frmMakePayments: FormGroup;
  now = new Date();
  paymentList: any = [];
  PaymentModeList: any = ['Cash', 'Bank'];
  bankList: any = [];
  rowData: any = [];
  invoiceDocCode: any;
  selectedDate: Date;
  entity_id: string | null;
  constructor(
    private route: Router,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private GrnService: GrnServiceService,
    private _finaceservice: FinaceService,
    private commonService: CommonService,
    private location: Location
  ) {
    this.frmMakePayments = this.fb.group({
      vendor_name: [''],
      invoiceNo: [''],
      invoiceDate: [''],
      cheque_ref_date: [''],
      paymentMode: ['', Validators.required],
      bank: [''],
      accountNumber: [''],
      chequeNumber: [''],
      totalAmt: [''],
      // advancePaid:[''],
      amountDue: ['00'],
      amountPaid: ['', Validators.required],
      image: [''],
      terms: [''],
      remarks: [''],
    });
  }

  grn_id: any;
  payment_status: any;
  product_id: any;
  grnId: any;

  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.frmMakePayments.patchValue({
      invoiceDate: new Date(),
    });
    let invoiceId = this.activeroute.snapshot.queryParams?.['pr_id'] || '';
    let version_id =
      this.activeroute.snapshot.queryParams?.['version_id'] || '';
    this.activeroute.queryParams.subscribe((res: any) => {
      // this.payment_status=res.payment_status
      this.product_id = res.category_id;
      this.grnId = res.id;
    });

    this.grn_id = invoiceId;
    this.getInvoiceById(this.grnId, version_id);
    let entity_id: any = localStorage.getItem('selectedEntityId');
    var empData: any = localStorage.getItem('signInUser');
    let financial_id: any = localStorage.getItem('financial_id');
    const singleEmpData = JSON.parse(empData);
    let data = {
      emp_id: singleEmpData.employee_id,
      loggedUserRole: singleEmpData.role,
    };
    this.getBankList();

    setTimeout(() => {
      if (invoiceId) {
        this.getInvoiceData(parseInt(invoiceId));
      }
    }, 1000);
  }

  bankHistory1: any = [];
  totalCalculatedAmt: any = [];
  dueAmount: any;
  totalPayment: any;
  patchedDueAmy: any = [];
  vendor_id: any;

  getInvoiceById(id: any, version_id: any) {
    this.GrnService.getCompletedGRNInvoice(id, version_id).subscribe(
      (res: any) => {
        this.totalPayment = res.data.total_amount;
        this.dueAmount = res.data.due_amount;
        this.patchedDueAmy = res.data.historyBank;
        this.totalCalculatedAmt = res.data.historyBank;
        this.bankHistory1 = res.data?.historyBank;
        this.payment_status = res.data.payment_status;
        this.vendor_id = res.data.vendor_id;

        this.patchedDueAmy = this.patchedDueAmy[this.patchedDueAmy.length - 1];
        this.frmMakePayments.patchValue({
          amountDue: this.patchedDueAmy?.amount_due || '00',
        });
        if (this.payment_status == 'PAID') {
          this.frmMakePayments.patchValue({
            amountDue: this.patchedDueAmy?.amount_due,
            amountPaid: this.patchedDueAmy?.total_amount,
          });
        } else {
          this.frmMakePayments.patchValue({
            amountDue: this.patchedDueAmy?.amount_due || '00',
          });
        }

        if (res) {
          this.frmMakePayments.patchValue({
            invoiceNo: res.data.invoiceNo,
            // invoiceDate:res.data.invoiceDate,
            vendor_name: res.data.vendor_name,
            totalAmt: res.data.total_amount,
            // advancePaid:res.data.advance_payment==null?'00': res.data.advance_payment,
          });
        }
      }
    );
  }

  getValue(value: any) {
    let amountData = value.replace(/,/g, '');
    if (this.bankHistory1.length) {
      let data = this.patchedDueAmy?.amount_due - parseFloat(amountData);
      this.frmMakePayments.patchValue({
        amountDue: data.toFixed(4),
      });
    } else {
      let data = this.totalPayment - amountData;
      this.frmMakePayments.patchValue({
        amountDue: data.toFixed(4),
      });
    }
  }

  public columnDefs = [
    {
      headerName: 'S.NO',
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Cheque Number',
      field: 'cheque_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
      valueFormatter: (params: any) => {
        return params.value ? params.value : '----';
      },
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

      //editable: true,
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
      //editable: true,
    },
    {
      headerName: 'Amount Paid',
      field: 'amount_paid',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount)) {
          return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(amount);
        }
        return '₦ 0.00';
      },
      //editable: true,
    },
    {
      headerName: 'Due Amount',
      field: 'amount_due',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount)) {
          return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(amount);
        }
        return '₦ 0.00';
      },
      //editable: true,
    },
    {
      headerName: 'Total Amount',
      field: 'total_amount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: (params: any) => {
        const amount = Number(params.value);
        if (!isNaN(amount)) {
          return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(amount);
        }
        return '₦ 0.00';
      },
    },
    // {
    //   headerName: 'Take Action',
    //   field: 'id',
    //   flex: 1,
    //   minWidth: 150,
    //   // cellRenderer: PaymentHistoryActionComponent,
    //   cellRendererParams: {
    //     className: 'mat-blue',
    //     hideRequestButton: true,
    //     hideDetailsButton: false,
    //     hideDownloadIcon: false,
    //     showCustomIcon: false
    //   },
    // }
  ];

  gridApi: any;
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  back() {
    this.location.back();
  }
  isActive: boolean = false;
  selectedPayMode(e: any) {
    if (e == 'Cash') {
      this.isActive = true;
      this.frmMakePayments.get('bank')?.disable();
      this.frmMakePayments.get('accountNumber')?.disable();
      this.frmMakePayments.get('chequeNumber')?.disable();
    } else {
      this.isActive = false;
      this.frmMakePayments.get('bank')?.enable();
      this.frmMakePayments.get('accountNumber')?.enable();
      this.frmMakePayments.get('chequeNumber')?.enable();
    }
  }
  accountDetails: any = [];
  selectedbank(e: any) {
    this.GrnService.getAccountNumberByID(e).subscribe(
      (res: any) => {
        this.accountDetails = res.data;
      },
      (err: any) => {
        this.toast.error(err.error.message);
      }
    );
  }
  getBankList() {
    this._finaceservice.getBank(this.entity_id).subscribe((res: any) => {
      this.bankList = res.data;
    });
  }

  getInvoiceData(invId: any) {
    this.rowData = this.rowData.find((x: any) => x.id === invId);
    this.frmMakePayments.patchValue(this.rowData);
  }

  //   {
  //     "vendor_name": "Prabhakar",
  //     "invoiceNo": 1232,
  //     "invoiceDate": "2024-11-29",
  //     "refrenceDocNo": "",
  //     "paymentMode": "Cheque",
  //     "bank": 2,
  //     "accountNumber": 2,
  //     "chequeNumber": "3252352352",
  //     "totalAmt": "299.88",
  //     "advancePaid": "5000.00",
  //     "amountDue": "00",
  //     "amountPaid": "100",
  //     "image": "C:\\fakepath\\second_first.png",
  //     "terms": "sdgsdgsdg",
  //     "remarks": "sdgsdgdsgds"
  // }
  spinner: Boolean = false;
  onSubmit() {
    this.spinner = true;
    if (this.frmMakePayments.invalid) {
      this.frmMakePayments.markAllAsTouched();
      return this.toast.error('Required Field Should Not Empty');
    }

    let data = this.frmMakePayments?.value;
    let payload = {
      date: moment(data.invoiceDate).format('YYYY-MM-DD'),
      cheque_ref_date: data?.cheque_ref_date,
      payment_method: data.paymentMode,
      cheque_number: data.chequeNumber,
      amount_paid: data.amountPaid.replace(/,/g, ''),
      amount_due: data.amountDue,
      upload_document: data.image,
      terms: data.terms,
      remarks: data.remarks,
      bank_id: data.bank,
      account_number_id: data.accountNumber,
      grn_id: this.grnId,
      vendor_id: this.vendor_id,
      entity_id: this.entity_id,
      product_id: this.product_id,
    };

    if (+data.amountDue < 0) {
      this.spinner = false;
      this.commonService.hideLoader();
      return this.toast.error('Paid Amount should be less than total amount');
    }
    this.commonService.showLoader();
    this._finaceservice.createMakePayment(payload).subscribe(
      (res: any) => {
        if (res) {
          this.spinner = false;
          this.toast.success(res.message);
          this.commonService.hideLoader();
          this.route.navigate(['/master/purchase-main/invoice-payment']);
        }
      },
      (err: any) => {
        this.toast.error(err.error.message);
        this.spinner = false;
        this.commonService.hideLoader();
      }
    );
  }
}

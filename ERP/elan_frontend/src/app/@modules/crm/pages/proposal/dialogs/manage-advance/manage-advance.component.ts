import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SalesService } from 'src/app/@modules/sales/service/sales.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';


@Component({
  selector: 'app-manage-advance',
  templateUrl: './manage-advance.component.html',
  styleUrls: ['./manage-advance.component.scss']
})
export class ManageAdvanceComponent implements OnInit {
  entity_id: any;
  financial_id: any;
  advanceForm!: FormGroup;
  isBankSelected = false;
  totalAdvanceAmount: any;
  totalBaseAdvanceAmount: any;
  currencySign: any;
  bankAccountList: any = [];
  bankList: any = [];
  selectedCurrency: any = [];
  paymentModes = [
    'Cash',
    'Bank'
  ];
  suspenseAccount: any = []

  constructor(
    private fb: FormBuilder, public dialogRef: MatDialogRef<ManageAdvanceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private sales: SalesService,
    private finance: FinaceService, private configMaster: ConfigurationalmasterService
  ) { }


  ngOnInit(): void {
    
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.financial_id = localStorage.getItem("financial_id");
    this.advanceForm = this.fb.group({
      transaction_date: [this.data?.advanceDetails?.transaction_date || null, Validators.required],
      remarks: [this.data?.advanceDetails?.remarks || null],
      paymentDetails: this.fb.array([]),
      suspense_account: [[]],
      advance_adjustment_percentage: [this.data?.advanceDetails?.advance_adjustment_percentage || 0, [Validators.min(0), Validators.max(100)]]
    });
    this.addPaymentRow();
    this.selectedCurrency = this.data.selectedCurrency
    
    this.getExistingAdvance(this.data?.customer_id);
    this.getBanckAccount(this.entity_id);
    this.suspenseCustomerAccountList(this.entity_id);
    
  }
  ngAfterViewInit() {

    this.currencySign = this.data.selectedCurrency.symbols
    this.selectedCurrency = this.data.selectedCurrency
   
  }

  getExistingAdvance(customer_id: any) {
    this.sales.advanceCustomerRecieptById(customer_id).subscribe({
      next: (res: any) => {
        console.log('res=======', res.data)
        this.totalBaseAdvanceAmount = parseFloat(res?.data?.advance_amount);
        this.totalAdvanceAmount = this.configMaster.convertAmount(Number(res?.data?.advance_amount), 1, this.selectedCurrency?.Currency_Convert_id);

      }, error: (err: any) => {

      }
    })
  }
  getBanckAccount(entityId: any) {
    this.finance.getBankAccount(entityId).subscribe({
      next: (res: any) => {
        console.log('res=======', res.data)
        this.bankList = res?.data;
      }, error: (err: any) => {

      }
    })
  }
  get paymentDetails(): FormArray {
    return this.advanceForm.get('paymentDetails') as FormArray;
  }
  createPaymentRow(): FormGroup {
    return this.fb.group({
      payment_mode: ['', Validators.required],
      bank_id: [null],
      bank_account_name: [null],
      cheque_no: [''],
      amount: [null, [Validators.required, Validators.min(1)]],
      document: [null],
      suspense_account_id: [null],
      payment_currency: [this.selectedCurrency?.currency_code],
      exchange_rate: [this.selectedCurrency?.exchange_rate],
      base_amount: [0],
    });
  }
  selectedBank(bank: any, index: any) {
    const row = this.paymentDetails.at(index) as FormGroup;
    const account = row.get('bank_account_name');
    account?.patchValue(bank?.account_name);
  }
  onPaymentModeChange(index: number): void {
    const row = this.paymentDetails.at(index) as FormGroup;
    const mode = row.get('payment_mode')?.value;
    const bank = row.get('bank_id');
    const account = row.get('bank_account_name');
    const txn = row.get('cheque_no');
    if (mode === 'Bank') {
      bank?.setValidators([Validators.required]);
      account?.setValidators([Validators.required]);
      txn?.setValidators([Validators.required]);
    } else {
      bank?.clearValidators();
      account?.clearValidators();
      txn?.clearValidators();
      row.patchValue({
        bank_id: null,
        bank_account_name: null,
        cheque_no: '',
        document: null
      });
    }
    bank?.updateValueAndValidity();
    account?.updateValueAndValidity();
    txn?.updateValueAndValidity();
  }

  addPaymentRow(): void {
    this.paymentDetails.push(this.createPaymentRow());
  }

  removePayment(index: number): void {
    if (this.paymentDetails.length > 1) {
      this.paymentDetails.removeAt(index);
    }

  }

  onFileChange(event: any, index: number): void {

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    this.paymentDetails.at(index).patchValue({
      document: file
    });

  }
  viewDocument(index: number): void {

    const file = this.paymentDetails.at(index).value.document;

    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);

    window.open(url, '_blank');

  }
  removeDocument(index: number): void {

    this.paymentDetails.at(index).patchValue({
      document: null
    });

  }
  calculateAmount(index: number) {

    const row = this.paymentDetails.at(index);

    const amount = Number(row.get('amount')?.value || 0);

    const paymentCurrencyId = row.get('payment_currency_id')?.value;

    const baseCurrencyId = this.selectedCurrency.Currency_Convert_id;

    const convertedAmount =this.configMaster.convertAmount(amount,paymentCurrencyId,baseCurrencyId);

    row.patchValue({base_amount: convertedAmount}, { emitEvent: false });
    this.getTotalAmount();
    this.grandTotal();
  }

  getTotalAmt: any;
  getBaseTotalAmt: any;
  getTotalAmount(): number {

    const baseTotal = this.paymentDetails.controls.reduce(
      (total: number, control: AbstractControl) => {
        return total + Number(control.get('base_amount')?.value || 0);
      }, 0);

    this.getBaseTotalAmt = this.paymentDetails.controls.reduce(
      (total: number, control: AbstractControl) => {
        return total + Number(control.get('amount')?.value || 0);
      }, 0);

    this.getTotalAmt = this.configMaster.convertAmount(
      this.getBaseTotalAmt,
      1,
      this.selectedCurrency?.Currency_Convert_id
    );

    return this.getTotalAmt;
  }
  grandTotalAmt: any;
  grandTotalAmt2: any;
  grandTotal() {

    const baseAdvance = Number(this.totalBaseAdvanceAmount || 0);
    const paymentTotal = Number(this.getBaseTotalAmt || 0);

    if (!this.selectedCurrency?.Currency_Convert_id) {
      return baseAdvance + paymentTotal;
    }
    ;
    this.grandTotalAmt2= baseAdvance + paymentTotal;
    this.grandTotalAmt = this.configMaster.convertAmount(
      baseAdvance + paymentTotal,
      1,
      this.selectedCurrency.Currency_Convert_id
    );
  }
  selectedSuspenseAcc(selectedAccounts: any[]): void {
    const paymentArray = this.paymentDetails;
    const selectedIds = selectedAccounts.map(x => x.id);
    selectedAccounts.forEach(acc => {
      const exists = paymentArray.controls.find(control =>
        control.get('payment_mode')?.value === 'Suspense' &&
        control.get('suspense_account_id')?.value === acc.id
      );
      if (exists) {
        return;
      }

      const emptyRow = paymentArray.controls.find(control => {
        const paymentMode = control.get('payment_mode')?.value;
        const amount = control.get('amount')?.value;
        return (!paymentMode && (!amount || Number(amount) === 0));
      });

      if (emptyRow) {
        emptyRow.patchValue({ payment_mode: 'Suspense', suspense_account_id: acc.id, amount: acc.advance_amount || 0 });
        const rowIndex = paymentArray.controls.indexOf(emptyRow);
        this.calculateAmount(rowIndex);
      } else {
        const row = this.createPaymentRow();
        row.patchValue({
          payment_mode: 'Suspense',
          suspense_account_id: acc.id,
          amount: acc.advance_amount || 0
        });
        paymentArray.push(row);
        this.calculateAmount(paymentArray.length - 1);
      }
    });
    for (let i = paymentArray.length - 1; i >= 0; i--) {
      const row = paymentArray.at(i);
      if (row.get('payment_mode')?.value === 'Suspense' && !selectedIds.includes(row.get('suspense_account_id')?.value)) {
        paymentArray.removeAt(i);
      }
    }

  }

  suspenseCustomerAccountList(entity_id: any) {
    this.sales.suspenseCustomerAccountList(entity_id).subscribe({
      next: (res: any) => {
        this.suspenseAccount = res.data;
 if (this.data?.advanceDetails?.paymentDetails) {
      this.patchData(this.data?.advanceDetails?.paymentDetails);
    }
  }, error: (error: any) => {
        if (this.data?.advanceDetails?.paymentDetails) {
             this.patchData(this.data?.advanceDetails?.paymentDetails);
           }
        console.log(error);
      }
    })
  }
  saveAdvance(): void {

    this.advanceForm.markAllAsTouched();

    if (
      this.advanceForm.invalid
    ) {
      return;
    }

    const payload = {...this.advanceForm.value,grandTotalAmt2:this.grandTotalAmt2};

    console.log(payload);
    this.dialogRef.close(payload);


  }

  closeModal(): void {
    this.dialogRef.close();
  }
  patchData(data: any[]) {

    const paymentArray = this.paymentDetails;

    // Clear existing rows
    paymentArray.clear();

    data.forEach((item: any,index:number) => {

      const row = this.createPaymentRow();

      row.patchValue({
        payment_mode: item.payment_mode,
        bank_id: item.bank_id,
        bank_account_name: item.bank_account_name,
        cheque_no: item.cheque_no,
        amount: Number(item.amount),
        document: item.document,
        suspense_account_id: item.suspense_account_id,
        payment_currency: item.payment_currency || this.selectedCurrency?.currency_code,
        exchange_rate: item.exchange_rate || this.selectedCurrency?.exchange_rate,
        base_amount: item.base_amount
      });

      paymentArray.push(row);
      this.calculateAmount(index)
    });

    const selectedSuspenseAccounts = this.suspenseAccount.filter((acc: any) =>
  this.data?.advanceDetails?.suspense_account?.some(
    (x: any) => x.id === acc.id
  )
);

this.advanceForm.patchValue({
  suspense_account: selectedSuspenseAccounts
});
      
    // const selectedSuspenseAccounts = this.suspenseAccount.filter((acc: any) =>this.data?.advanceDetails?.suspense_account.some((x: any) =>x.payment_mode === 'Suspense' && x.suspense_account_id === acc.id ));

    // this.advanceForm.patchValue({suspense_account: selectedSuspenseAccounts});
   
  }
}
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-approval-dialog',
  templateUrl: './approval-dialog.component.html',
  styleUrls: ['./approval-dialog.component.scss']
})
export class ApprovalDialogComponent {
  assetForm: FormGroup;
  isSell: boolean;
  entity_id:any;
  loginUser:any;
  employee_id:any;
  columnDefs: any[] = [];
  rowData: any[] = [];
  lastSegment:any;
  asset_list:any;
  account_list:any;
  disposition_id:any;
  actionMode:any;
  defaultColDef = { flex: 1, resizable: true, editable: false };
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ApprovalDialogComponent>,
    private asset_service:AssetListService,
    private toast: ToastrService,
    private route: Router,
    private _finaceService: FinaceService,
    private activeroute: ActivatedRoute,
  @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isSell = data.actionType === 'sell';
    this.asset_list = this.data.assets[0].item_list;
    this.account_list = this.data.assets[0].Accountlist;
    this.actionMode = this.data.actionMode;
    this.initForm();
  }

  ngOnInit(): void {
    this.setupColumns();
    this.updateRowData();
    this.entity_id = localStorage.getItem('selectedEntityId');
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.employee_id = this.loginUser.employee_id;
    this.getChartAccountList();
    const fullUrl = this.route.url;
    this.lastSegment = fullUrl.split('/').pop();
    this.assetForm.patchValue({
      saleDate: this.data.assets[0].disposition_date,
      buyerName:this.data.assets[0].buyer_name,
      buyerContact:this.data.assets[0].buyer_contact,
      buyerCompany: this.data.assets[0].buyer_company,
      notes: this.data.assets[0].note,
      paymentMode: this.data.assets[0].paymentMode,
      approvalStatus: this.data.assets[0].approval_status
    });
    this.disposition_id = this.data.assets[0].disposition_id;
    if(this.account_list){
      this.patchAccountList(this.account_list);
    }
   
  }

  initForm() {
    this.assetForm = this.fb.group({
      actionType: [this.data.actionType],
      approvalStatus: ['',[Validators.required]],
      notes: ['',[Validators.required]],
      saleDate: ['',[Validators.required]],
      buyerName: ['',],
      buyerContact: ['',],
      buyerCompany: ['',],
      paymentMode: ['',[Validators.required]],
      invoiceUpload: [null],
      discardDate: [''],
      writeoffReason: [''],
      disposalMethod: [''],
      supportingDocs: [null],
      Account_details: this.fb.array([
        this.fb.group({
          chart_account_id: [null, Validators.required],
          debit_amount: [null],
          credit_amount: [null],
        }),
        this.createAccountDetailGroup()
      ]), 

      assets: this.fb.array(this.asset_list.map((asset:any) => this.createAssetFormGroup(asset)))
    });

    this.assets.controls.forEach(assetGroup => this.setupAutoCalculations(assetGroup));

    if (this.data.actionType === 'sell') {
      this.assetForm.get('discardDate')?.clearValidators();
      this.assetForm.get('writeoffReason')?.clearValidators();
      this.assetForm.get('disposalMethod')?.clearValidators();
    
      this.assetForm.get('discardDate')?.updateValueAndValidity();
      this.assetForm.get('writeoffReason')?.updateValueAndValidity();
      this.assetForm.get('disposalMethod')?.updateValueAndValidity();
    }
    this.updateAssetArrayValidators(this.data.actionType);

  if (this.data.actionType === 'writeOff') {
    this.assetForm.get('saleDate')?.clearValidators();
    this.assetForm.get('paymentMode')?.clearValidators();

    this.assetForm.get('saleDate')?.setValue(null); 
    this.assetForm.get('paymentMode')?.setValue(null); 

    this.assetForm.get('saleDate')?.updateValueAndValidity();
    this.assetForm.get('paymentMode')?.updateValueAndValidity();
  }

  }

  updateAssetArrayValidators(actionType: string) {
    const assetsArray = this.assetForm.get('assets') as FormArray;
  
    assetsArray.controls.forEach((group: AbstractControl) => {
      const salePriceControl = group.get('salePrice');
      const scrapValueControl = group.get('scrapValue');
  
      if (actionType === 'sell') {
        salePriceControl?.setValidators([Validators.required]);
        scrapValueControl?.clearValidators();
      }
      else {
        salePriceControl?.clearValidators();
        scrapValueControl?.setValidators([]);
      }
  
      salePriceControl?.updateValueAndValidity();
      scrapValueControl?.updateValueAndValidity();
    });
  }
  
  createAssetFormGroup(asset: any): FormGroup {
    return this.fb.group({
      assetId: [asset.asset_tagId],
      assetName: [asset.item_name],
      originalPrice: [asset.total_amount],
      depreciation: [asset.accumulated_dep],
      netBookValue: [asset.net_value],
      profitLoss: [''],
      salePrice: [asset.sell_price],
      scrapValue: [''],
      grn_id:[asset.id]
    });
  }
  createAccountDetailGroup(): any {
    return this.fb.group({
      chart_account_id: [null, Validators.required],
      debit_amount: [null],
      credit_amount: [null],
    });
  }
  get Account_details(): FormArray {
    return this.assetForm.get('Account_details') as FormArray;
  }
  AddRow(): void {
    const lastIndex = this.Account_details.length - 1;
    const lastRow = this.Account_details.at(lastIndex);
  
    if (lastRow.get('chart_account_id')?.invalid) {
      lastRow.get('chart_account_id')?.markAsTouched();
      return;
    }
    this.Account_details.push(this.createAccountDetailGroup());
  }

  removeRow(index:any): void {
    this.Account_details.removeAt(index);
  }
  chartedAccount: any;
  chartedAccount1: any[] = [];
  chartedAccount2: any[] = [];

  getChartAccountList() {
    this._finaceService.getchartedAccount(this.entity_id).subscribe((res: any) => {

      this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no');
      this.chartedAccount1 = this.chartedAccount.map((res: any) => res.account_name);
      this.chartedAccount2 = this.chartedAccount;

    });
  }

   patchAccountList(data: any[]) {
    const formArray = this.assetForm.get('Account_details') as FormArray;

    formArray.clear();

    data.forEach(account => {
      formArray.push(new FormGroup({
        chart_account_id: new FormControl(account.chart_account_id),
        debit_amount: new FormControl(account.debit_amount),
        credit_amount: new FormControl(account.credit_amount),
      }));
    });
  }

  onAccountChange(): void {
    this._finaceService.getchartedAccount(this.entity_id).subscribe((res: any) => {

      this.chartedAccount = res.data.filter((element: any) => element.is_group === 'no');
      this.chartedAccount1 = this.chartedAccount.map((res: any) => res.account_name);
      this.chartedAccount2 = this.chartedAccount;


      this.chartedAccount.forEach((element1: any) => {
        element1['hidden'] = false;
      });
      this.chartedAccount.forEach((element1: any) => {
        this.Account_details.controls.forEach((element: any, index: any) => {
          const value = this.Account_details.controls[index]?.get('chart_account_id')?.value;
          if (value == element1.id) {
            element1['hidden'] = true;
          }
        });
      });
    });
  }

  accountFilter(e: any) {
    const aa = e
    let filteredVariable = this.chartedAccount2.filter((item: any) => aa.includes(item.account_name));
    this.chartedAccount = filteredVariable
  }

  clearDropdown(control: any, index: any) {
    this.Account_details.controls[index].get(control)?.setValue(null)
    if (control == 'chart_account_id') {
      this.onAccountChange();
    }
  }
  get assets(): FormArray {
    return this.assetForm.get('assets') as FormArray;
  }

  setupAutoCalculations(assetGroup: any) {
    assetGroup.get('salePrice')?.valueChanges.subscribe(() => this.recalculate(assetGroup));
  }

  recalculate(assetGroup: FormGroup) {
    const salePrice = parseFloat(assetGroup.get('salePrice')?.value);
    if(salePrice){

      const original = parseFloat(assetGroup.get('originalPrice')?.value) || 0;
      const depreciation = parseFloat(assetGroup.get('depreciation')?.value) || 0;
  
      const nbv = original - depreciation;
      const profit = salePrice - nbv;
  
      if(this.isSell){
  
        assetGroup.patchValue({
          netBookValue: nbv,
          profitLoss: profit
        }, { emitEvent: false });
      }
    }

  }

  onFileChange(event: any, field: string) {
    const file = event.target.files[0];
    this.assetForm.patchValue({ [field]: file });
  }
  checkCreditDebitBalance(): boolean {
    const formArray = this.Account_details;
    let totalDebit = 0;
    let totalCredit = 0;
  
    formArray.controls.forEach(control => {
      totalDebit += Number(control.get('debit_amount')?.value || 0);
      totalCredit += Number(control.get('credit_amount')?.value || 0);
    });
  
    if (totalDebit !== totalCredit) {
      this.toast.error("Credit and Debit amounts must be equal.");
      return false;
    }

    // if (totalCredit !== Number(this.createDirectAsset.get('amount')?.value)) {
    //   this.toast.error("Total amount should match credit amount.");
    //   return false;
    // }
    return true;
  }
  submit() {
    if (!this.checkCreditDebitBalance()) {
      return 
    }
    if (this.assetForm.valid) {
      let data = this.assetForm.value;
      data.entity_id = this.entity_id;
      data.employee_id = this.employee_id
      this.asset_service.updateDisposition(this.disposition_id,data).subscribe((res:any)=>{
        console.log('ressss',res)
        if(res.code===200){
          this.toast.success('Disposition processed successfully!');
          this.dialogRef.close(this.assetForm.value);
          this.reloadCurrentRoute();
        }
      },(err:any)=>{
        this.toast.error(err.message||'Something went Wrong');
       this.dialogRef.close(this.assetForm.value);

      })
    }else{
      const invalidFields: string[] = [];
      Object.keys(this.assetForm.controls).forEach(key => {
        const control = this.assetForm.get(key);
        if (control && control.invalid) {
          invalidFields.push(this.getFriendlyFieldName(key));
        }
      });

      const assetsArray = this.assetForm.get('assets') as FormArray;
      assetsArray.controls.forEach((group: AbstractControl, index: number) => {
        if (group instanceof FormGroup) {
          Object.keys(group.controls).forEach(key => {
            const control = group.get(key);
            if (control && control.invalid) {
              invalidFields.push(`Asset #${index + 1} - ${this.getFriendlyFieldName(key)}`);
            }
          });
        }
      });
  
      const message = `Please fill required fields: ${invalidFields.join(', ')}`;
      this.toast.error(message);
    }
  }
  getFriendlyFieldName(controlName: string): string {
    const fieldMap: { [key: string]: string } = {
      actionType: 'Action Type',
      approvalStatus: 'Approval Status',
      notes: 'Notes',
      saleDate: 'Sale Date',
      buyerName: 'Buyer Name',
      buyerContact: 'Buyer Contact',
      buyerCompany: 'Buyer Company',
      paymentMode: 'Payment Mode',
      invoiceUpload: 'Invoice Upload',
      discardDate: 'Discard Date',
      writeoffReason: 'Write-off Reason',
      disposalMethod: 'Disposal Method',
      supportingDocs: 'Supporting Documents',
  
      // asset fields
      assetId: 'Asset ID',
      assetName: 'Asset Name',
      originalPrice: 'Original Price',
      depreciation: 'Depreciation',
      netBookValue: 'Net Book Value',
      profitLoss: 'Profit/Loss',
      salePrice: 'Sale Price',
      scrapValue: 'Scrap Value',
      grn_id: 'GRN ID'
    };
    return fieldMap[controlName] || controlName;
  }
  cancel() {
    this.dialogRef.close();
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  setupColumns() {
    this.columnDefs = [
      { headerName: 'Asset ID', field: 'assetId' },
      { headerName: 'Asset Name', field: 'assetName' },
      { headerName: 'Original Price', field: 'originalPrice' },

      {
        headerName: ' Accumulated Depreciation',
        field: 'depreciation',
        valueParser: (params:any) => Number(params.newValue),
      },

      { headerName: 'Net Book Value', field: 'netBookValue' },

      ...(this.isSell
        ? [
          {
            headerName: 'Sale Price',
            field: 'salePrice',
            editable: false,
            valueParser: (params:any) => Number(params.newValue),
            cellRenderer: (params: any) => {
              const inputId = 'input-' + params.rowIndex;
              setTimeout(() => {
                const input = document.getElementById(inputId);
                if (input) {
                  input.addEventListener('blur', (event: any) => {
                    const newValue = Number(event.target.value);
                    params.node.setDataValue('salePrice', newValue);
                  });
                }
              });
              return `<input id="${inputId}" type="number" value="${params.value || ''}"
              style="width: 100%; border: 1px solid #ccc;" />`;
            }
          },
            { headerName: 'Profit/Loss', field: 'profitLoss' },
          ]
        : [
          {
            headerName: 'Sale Price',
            field: 'salePrice',
            editable: false,
            valueParser: (params:any) => Number(params.newValue),
            cellRenderer: (params: any) => {
              const inputId = 'input-' + params.rowIndex;
              setTimeout(() => {
                const input = document.getElementById(inputId);
                if (input) {
                  input.addEventListener('blur', (event: any) => {
                    const newValue = Number(event.target.value);
                    params.node.setDataValue('salePrice', newValue);
                  });
                }
              });
              return `<input id="${inputId}" type="number" value="${params.value || ''}"
              style="width: 100%; border: 1px solid #ccc;" />`;
            }
          },
        ])
    ];

    this.defaultColDef = {
      editable: false,
      resizable: true,
      flex:1
    };
  }

  updateRowData() {
    this.rowData = this.assets.value;
  }

  onCellValueChanged(event: any) {
    const rowIndex = event.rowIndex;
    const updated = event.data;

    const formGroup = this.assets.at(rowIndex) as FormGroup;
    formGroup.patchValue(updated, { emitEvent: false });

    this.recalculate(formGroup);

    this.updateRowData(); // Update the grid view with new computed values
  }
}

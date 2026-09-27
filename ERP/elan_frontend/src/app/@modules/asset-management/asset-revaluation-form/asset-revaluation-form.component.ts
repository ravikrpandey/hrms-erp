import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { AssetSaleWriteoffFormComponent } from '../asset-sale-writeoff-form/asset-sale-writeoff-form.component';

@Component({
  selector: 'app-asset-revaluation-form',
  templateUrl: './asset-revaluation-form.component.html',
  styleUrls: ['./asset-revaluation-form.component.scss']
})
export class AssetRevaluationFormComponent {
  assetForm: FormGroup;
  entity_id:any;
  loginUser:any;
  employee_id:any;
  columnDefs: any[] = [];
  rowData: any[] = [];
  defaultColDef = { flex: 1, resizable: true, editable: false };
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssetSaleWriteoffFormComponent>,
    private asset_service:AssetListService,
    private toast: ToastrService,
    private route: Router,
    private _finaceService: FinaceService,




    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.setupColumns();
    this.updateRowData();
    this.entity_id = localStorage.getItem('selectedEntityId');
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.employee_id = this.loginUser.employee_id;
    this.getChartAccountList();

  }

  initForm() {
    this.assetForm = this.fb.group({
      approvalStatus: ['Pending',[Validators.required]],
      notes: ['',[Validators.required]],

      // Shared sale or write-off fields
      revaluation_date: ['',[Validators.required]],

      // invoiceUpload: [null],

      Account_details: this.fb.array([
        this.fb.group({
          chart_account_id: [null],
          debit_amount: [null],
          credit_amount: [null],
        }),
        this.createAccountDetailGroup()
      ]), 

      assets: this.fb.array(this.data.assets.map((asset:any) => this.createAssetFormGroup(asset)))
    });

    // this.assets.controls.forEach(assetGroup => this.setupAutoCalculations(assetGroup));


  }

  
  createAssetFormGroup(asset: any): FormGroup {
    return this.fb.group({
      assetId: [asset.asset_tagId],
      assetName: [asset.item_name],
      originalPrice: [asset.total_amount],
      depreciation: [asset.accumulated_dep],
      netBookValue: [asset.net_value],
      newValue: ['',[Validators.required]],
      grn_id:[asset.id]
    });
  }
  createAccountDetailGroup(): any {
    return this.fb.group({
      chart_account_id: [null],
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

  // setupAutoCalculations(assetGroup: any) {
  //   assetGroup.get('salePrice')?.valueChanges.subscribe(() => this.recalculate(assetGroup));
  // }


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
    // if (!this.checkCreditDebitBalance()) {
    //   return 
    // }
    if (this.assetForm.valid) {
      let data = this.assetForm.value;
      data.entity_id = this.entity_id;
      data.employee_id = this.employee_id
      this.asset_service.createRevaluation(data).subscribe((res:any)=>{
        console.log('ressss',res)
        if(res.code===200){
          this.toast.success('Revaluation processed successfully!');
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
      approvalStatus: 'Approval Status',
      notes: 'Notes',
      revaluation_date: 'Revaluation Date',
      
      // invoiceUpload: 'Invoice Upload',

  
      // asset fields
      assetId: 'Asset ID',
      assetName: 'Asset Name',
      originalPrice: 'Original Price',
      depreciation: 'Depreciation',
      netBookValue: 'Net Book Value',
      newValue: 'New Value',
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
       {
          headerName: 'New Value',
          field: 'newValue',
          editable: false,
           valueParser: (params:any) => Number(params.newValue),
            cellRenderer: (params: any) => {
              const inputId = 'input-' + params.rowIndex;
              setTimeout(() => {
                const input = document.getElementById(inputId);
                if (input) {
                  input.addEventListener('blur', (event: any) => {
                    const newValue = Number(event.target.value);
                    params.node.setDataValue('newValue', newValue);
                  });
                }
              });
              return `<input id="${inputId}" type="number" value="${params.value || ''}"
              style="width: 100%; border: 1px solid #ccc;" />`;
            }
        },
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


    this.updateRowData(); // Update the grid view with new computed values
  }
}

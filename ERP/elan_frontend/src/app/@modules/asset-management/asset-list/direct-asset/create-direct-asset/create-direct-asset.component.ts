import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { AssetListService } from 'src/app/@shared/services/asset-list.service';
import { debounceTime } from 'rxjs';
import { EntityMasterService } from 'src/app/@shared/services/entity-master/entity-master.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { DepreciationService } from 'src/app/@shared/services/depreciation.service';
import { environment } from 'src/app/environments/environment';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-create-direct-asset',
  templateUrl: './create-direct-asset.component.html',
  styleUrls: ['./create-direct-asset.component.scss'],
})
export class CreateDirectAssetComponent {
  createDirectAsset: FormGroup;
  entity_id: any;
  financial_year_id: any;
  assetCategoryList: any;
  itemsList: any;
  VendorData: any;
  VendorData2: any;
  hsnCodeList: any;
  manageBy: any;
  selectedItems: any;
  filterItem: any;
  filterCategory: any;
  loginUser: any;
  employee_id: any;
  branchDataList: any[];
  supplierDataList: any[];
  branchData2: any;
  addressData: any;
  showGst: boolean = true;
  isCheckedCondition: boolean = false;
  filterItemControl = new FormControl();
  filterCatControl = new FormControl();
  filterAccControl = new FormControl();
  id: any;
  assetData: any;
  chartedAccount: any;
  filterchartedAccount: any;
  totalDebit: any;
  totalCredit: any;
  Different: any;
  redColor: boolean;
  depreciationData: any;
  assetStatuses: any;
  arrayDataPush: any = [];
  documents: any;
  calculateData: any;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private $common: CommonService,
    private router: Router,
    private toast: ToastrService,
    private $miscellaneousService: MiscellaneousService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private vendorService: VendorManagementService,
    private asset_service: AssetListService,
    private activetRoute: ActivatedRoute,
    private _finaceService: FinaceService,
    private depreciationService: DepreciationService,
    private prService: PurchaseRequestService,
  ) {
    this.createDirectAsset = this.fb.group({
      asset_category: new FormControl(null, [Validators.required]),
      item_id: new FormControl(null, [Validators.required]),
      purchase_date: new FormControl(null, [Validators.required]),
      item_use_date: new FormControl('', [Validators.required]),
      asset_tag_id: new FormControl(null, [Validators.required]),
      serial_number: new FormControl(null),
      batch_number: new FormControl(null),
      amount: new FormControl(null, [Validators.required]),
      suplier_id: new FormControl(null, [Validators.required]),
      // hsn_code_id: new FormControl(null, [Validators.required]),
      gst: new FormControl(null),
      vat: new FormControl(null),
      // quantity: new FormControl(null, [Validators.required]),
      // total_amt: new FormControl(null, [Validators.required]),
      branch: new FormControl(null, [Validators.required]),
      depriciation_by: new FormControl(null, [Validators.required]),
      depriciated_value: new FormControl(null),
      depMethod_id: new FormControl(null, [Validators.required]),
      asset_type: new FormControl(null, [Validators.required]),
      frequency: new FormControl(null, [Validators.required]),
      use_full_life: new FormControl(null, [Validators.required]),
      salvage_value: new FormControl(null, [Validators.required]),
      assetStatus: new FormControl(null, [Validators.required]),
      document_name: new FormControl(null),
      upload_document: new FormControl(null),
      // accumulated_dep: new FormControl(null),
      Account_details: this.fb.array([
        this.fb.group({
          chart_account_id: [null, Validators.required],
          debit_amount: [null],
          credit_amount: [null],
        }),
        this.createAccountDetailGroup(),
      ]),

      itemSpecification: new FormArray([
        new FormGroup({
          specificationType: new FormControl(null),
          specificationDetails: new FormControl(null),
        }),
      ]),
    });

    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params.id;
    });
    if (this.id) {
      this.getAssetDetailsById();
    }
  }

  get CF_1(): any {
    return this.createDirectAsset.controls;
  }

  get Account_details(): FormArray {
    return this.createDirectAsset.get('Account_details') as FormArray;
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.employee_id = this.loginUser.employee_id;

    this.getAllAssetCategory();
    this.getCalculationMethods();
    this.getAssetStatuses();
    this.getVendorData();
    this.filterSearch();
    this.getBranch();
    this.getChartAccountList();
    this.createDirectAsset
      .get('depriciation_by')
      ?.valueChanges.subscribe((value) => {
        if (value === 'by_value') {
          this.createDirectAsset
            .get('depriciated_value')
            ?.setValidators([Validators.required]);
        } else {
          this.createDirectAsset.get('depriciated_value')?.clearValidators();
        }
        // Manually trigger validation to update the form
        this.createDirectAsset
          .get('depriciated_value')
          ?.updateValueAndValidity();
      });
  }

  createAccountDetailGroup(): any {
    return this.fb.group({
      chart_account_id: [null, Validators.required],
      debit_amount: [null],
      credit_amount: [null],
    });
  }

  getCalculationMethods() {
    this.depreciationService.getCalculationMethods().subscribe(
      (res: any) => {
        this.calculateData = res.data;
      },
      (err: any) => {},
    );
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

  removeRow(index: any): void {
    this.Account_details.removeAt(index);
  }

  chartedAccount1: any[] = [];
  chartedAccount2: any[] = [];

  getChartAccountList() {
    this._finaceService
      .getchartedAccount(this.entity_id)
      .subscribe((res: any) => {
        this.chartedAccount = res.data.filter(
          (element: any) => element.is_group === 'no',
        );
        this.chartedAccount1 = this.chartedAccount.map(
          (res: any) => res.account_name,
        );
        this.chartedAccount2 = this.chartedAccount;
      });
  }

  onAccountChange(): void {
    this._finaceService
      .getchartedAccount(this.entity_id)
      .subscribe((res: any) => {
        this.chartedAccount = res.data.filter(
          (element: any) => element.is_group === 'no',
        );
        this.chartedAccount1 = this.chartedAccount.map(
          (res: any) => res.account_name,
        );
        this.chartedAccount2 = this.chartedAccount;

        this.chartedAccount.forEach((element1: any) => {
          element1['hidden'] = false;
        });
        this.chartedAccount.forEach((element1: any) => {
          this.Account_details.controls.forEach((element: any, index: any) => {
            const value =
              this.Account_details.controls[index]?.get(
                'chart_account_id',
              )?.value;
            if (value == element1.id) {
              element1['hidden'] = true;
            }
          });
        });
      });
  }

  accountFilter(e: any) {
    const aa = e;
    let filteredVariable = this.chartedAccount2.filter((item: any) =>
      aa.includes(item.account_name),
    );
    this.chartedAccount = filteredVariable;
  }

  clearDropdown(control: any, index: any) {
    this.Account_details.controls[index].get(control)?.setValue(null);
    if (control == 'chart_account_id') {
      this.onAccountChange();
    }
  }

  calculation(event: any, control: any, index: any) {
    const key = event.key;
    if (key == 'Tab') {
      return;
    }
    const value = parseFloat('00:0');

    if (control == 'debit_amount') {
      this.Account_details.controls[index]
        ?.get('credit_amount')
        ?.setValue(value);
    }
    if (control == 'credit_amount') {
      this.Account_details.controls[index]
        ?.get('debit_amount')
        ?.setValue(value);
    }
    this.totalDebit = '';
    this.totalCredit = '';
    this.Different = '';
    this.Account_details.controls.forEach((element: any) => {
      this.totalDebit =
        Number(this.totalDebit) + Number(element.controls.debit_amount.value);
      this.totalCredit =
        Number(this.totalCredit) + Number(element.controls.credit_amount.value);
      this.Different = Number(this.totalDebit) - Number(this.totalCredit);
    });
    if (this.Different < 0 || this.Different > 0) {
      this.redColor = true;
    } else {
      this.redColor = false;
    }
  }

  getAssetDetailsById(): void {
    this.asset_service.getAssetDetailsById(this.id).subscribe(
      (res: any) => {
        this.assetData = res.data[0];
        this.createDirectAsset.patchValue({
          asset_category: this.assetData?.asset_id,
          item_id: this.assetData?.item_id,
          purchase_date: this.assetData?.purchase_date,
          item_use_date: this.assetData?.item_use_date,
          asset_tag_id: this.assetData?.asset_tagId,
          serial_number: this.assetData?.itemSerialNo,
          vat: this.assetData?.vat,
          depMethod_id: this.assetData?.depreciationMethod,
          amount: this.assetData?.amount,
          suplier_id: this.assetData?.vendor_id,
          hsn_code_id: this.assetData?.hsn_code_id,
          gst: this.assetData?.gst,
          quantity: this.assetData?.itemQty,
          // total_amt: this.assetData?.total_amount,
          branch: this.assetData?.branch_id,
          depriciation_by: this.assetData?.depriciation_by,
          asset_type: this.assetData?.asset_type,
          frequency: this.assetData?.frequency,
          use_full_life: this.assetData?.use_full_life,
          salvage_value: this.assetData?.depreciation_rate,
          assetStatus: this.assetData?.asset_status_id,
        });
        if (!this.assetData?.asset_tagId) {
          this.createAssetTagId();
        }
        this.arrayDataPush = this.assetData?.uploaded_documents || [];
        this.isCheckedCondition =
          this.assetData?.asset_for_pm == 0 ? false : true;
        if (
          this.assetData?.Accountlist &&
          this.assetData.Accountlist.length > 0
        ) {
          this.patchAccountList(this.assetData.Accountlist);
        }
        this.getItemMasterlist(this.assetData?.asset_id);
        if (this.assetData?.Specificationlist) {
          this.patchSpecificationList(this.assetData.Specificationlist);
        }
      },
      (error: any) => {
        this.toast.error(error.error.message);
      },
    );
  }

  patchSpecificationList(data: any[]) {
    const formArray = this.createDirectAsset.get(
      'itemSpecification',
    ) as FormArray;

    formArray.clear();

    data?.forEach((spec) => {
      formArray.push(
        new FormGroup({
          specificationType: new FormControl(spec.specificationType),
          specificationDetails: new FormControl(spec.specificationDetails),
        }),
      );
    });
  }

  patchAccountList(data: any[]) {
    const formArray = this.createDirectAsset.get(
      'Account_details',
    ) as FormArray;

    formArray.clear();

    data?.forEach((account) => {
      formArray.push(
        new FormGroup({
          chart_account_id: new FormControl(account.chart_account_id),
          debit_amount: new FormControl(account.debit_amount),
          credit_amount: new FormControl(account.credit_amount),
        }),
      );
    });
  }

  // applyVat(){
  //   this.createDirectAsset.addControl('vat', new FormControl(null));
  //   this.showGst = false;
  // }
  getBranch() {
    this._configurationalMasterService.branch_get_active().subscribe({
      next: (res: any) => {
        if (res?.data && res.data.length > 0) {
          this.addressData = res.data;
          this.branchData2 = res.data;
          this.branchDataList = this.addressData.map(
            (value: any) => value.branch_name,
          );
        } else {
          this._configurationalMasterService
            .listLocation()
            .subscribe((locRes: any) => {
              this.addressData = locRes?.data || [];
              this.branchData2 = locRes?.data || [];
              this.branchDataList = this.addressData.map(
                (value: any) => value.branch_name,
              );
            });
        }
      },
      error: () => {
        this._configurationalMasterService
          .listLocation()
          .subscribe((locRes: any) => {
            this.addressData = locRes?.data || [];
            this.branchData2 = locRes?.data || [];
            this.branchDataList = this.addressData.map(
              (value: any) => value.branch_name,
            );
          });
      },
    });
  }
  getAssetStatuses() {
    this.asset_service.getAllAssetStatuses().subscribe((res: any) => {
      this.assetStatuses = res?.data;
    });
  }
  calculateTotalAmt() {
    const quantity = this.createDirectAsset.get('quantity')?.value || 0;

    const amount = this.createDirectAsset.get('amount')?.value || 0;

    let tax = 0;
    tax = this.createDirectAsset.get('vat')?.value || 0;

    const baseTotal = amount * quantity;

    let taxAmount = baseTotal * (tax / 100);

    let totalAmount = baseTotal + taxAmount;
    this.createDirectAsset.get('total_amt')?.patchValue(totalAmount);
  }
  onCheckboxChange(event: any) {
    const isChecked = event.checked;
    this.isCheckedCondition = isChecked;
  }
  filterSearch() {
    this.filterItemControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.itemsList = this.filterItem.filter((item: any) =>
          item.item_name.toLowerCase().includes(value.toLowerCase()),
        );
      });

    this.filterCatControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.assetCategoryList = this.filterCategory.filter((category: any) =>
          category.asset_category_name
            .toLowerCase()
            .includes(value.toLowerCase()),
        );
      });

    this.filterAccControl.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        this.chartedAccount = this.filterchartedAccount.filter((account: any) =>
          account.account_name.toLowerCase().includes(value.toLowerCase()),
        );
      });
  }
  branchDataFilter(e: any) {
    const aa = e;
    let filteredVariable = this.branchData2.filter((item: any) =>
      aa.includes(item.branch_name),
    );
    this.addressData = filteredVariable;
  }
  removePlus(event: any): void {
    const key = event.key;
    if (key === '+' || key === '-') {
      event.preventDefault();
    }
  }
  supplierDataFilter(e: any) {
    const aa = e;
    let filteredVariable = this.VendorData2.filter((item: any) =>
      aa.includes(item.vendor_name),
    );
    this.VendorData = filteredVariable;
  }
  getAllAssetCategory() {
    this._configurationalMasterService.getActiveAssetMasterList().subscribe(
      (res: any) => {
        this.assetCategoryList = res.data;
        this.filterCategory = res.data;
      },
      (err: any) => {},
    );
  }

  async OnAsset(asset: any) {
    this.itemsList = [];
    await this.getItemMasterlist(asset);
    await this.getAssetCompantDepriciation(asset);
  }

  async getItemMasterlist(asset: any) {
    let asset_id: any = asset?.value ?? asset;
    this.prService
      .getAllAssetbyCat_id(this.entity_id, asset_id)
      .subscribe((res: any) => {
        this.itemsList = res?.data || [];
        this.filterItem = this.itemsList;
        if (this.itemsList.length === 0) {
          this.toast.warning(
            'In selected Category, Asset Type Item Not Found!',
          );
          this.createDirectAsset.get('item_id')?.patchValue(null);
        }
      });
  }

  async getAssetCompantDepriciation(asset_id: any) {
    this.asset_service.getAssetCompanyDepriciation(asset_id).subscribe(
      (res: any) => {
        this.depreciationData = res.data;
        this.createDirectAsset.patchValue({
          frequency: this.depreciationData.frequency,
          use_full_life: this.depreciationData.use_full_life,
          salvage_value: this.depreciationData.salvage_value,
        });
      },
      (err: any) => {},
    );
  }

  getVendorData() {
    this.vendorService.getAllVendorList(this.entity_id).subscribe(
      (res: any) => {
        this.VendorData = res.data;
        this.VendorData2 = res.data;
        this.supplierDataList = this.VendorData.map(
          (value: any) => value.vendor_name,
        );
      },
      (err: any) => {
        this.$common?.hideLoader();
        this.VendorData = [];
      },
    );
  }

  updateValidators() {
    const serialNumber = this.createDirectAsset.get('serial_number');
    const batchNumber = this.createDirectAsset.get('batch_number');

    if (this.manageBy === 'Batch Only') {
      serialNumber?.clearValidators();
      batchNumber?.setValidators([Validators.required]);
    } else {
      batchNumber?.clearValidators();
      serialNumber?.setValidators([Validators.required]);
    }

    serialNumber?.updateValueAndValidity();
    batchNumber?.updateValueAndValidity();
  }

  async itemDetails(Itemid: any) {
    const singleItem = await this.itemsList.find(
      (element: any) => element.id == Itemid,
    );
    this.createDirectAsset
      .get('hsn_code_id')
      ?.patchValue(singleItem?.hsn_code_id);
    if (this.showGst)
      this.createDirectAsset.get('gst')?.patchValue(singleItem?.igst);
    if (!this.showGst)
      this.createDirectAsset.get('vat')?.patchValue(singleItem?.vat);
    this.manageBy = singleItem?.manage_by;
    await this.createAssetTagId();
    await this.createBatchCode();

    if (this.manageBy != 'Batch Only') {
      await this.updateValidators();
    }
  }

  createBatchCode() {
    this.asset_service.getBatchCode().subscribe(
      (res: any) => {
        this.createDirectAsset.get('batch_number')?.patchValue(res.data);
      },
      (err: any) => {
        console.log(err);
      },
    );
  }

  createAssetTagId() {
    this.asset_service.getAssetTagId().subscribe(
      (res: any) => {
        this.createDirectAsset.get('asset_tag_id')?.patchValue(res.data);
      },
      (err: any) => {
        console.log(err);
      },
    );
  }

  addrow() {
    const itemSpecificationArray = this.CF_1.itemSpecification as FormArray;

    if (itemSpecificationArray.invalid) {
      itemSpecificationArray.controls.forEach((group: AbstractControl) => {
        (group as FormGroup).controls['specificationType'].markAsTouched();
        (group as FormGroup).controls['specificationDetails'].markAsTouched();
      });

      return this.toast.error('Please fill required field');
    }

    const newRow = this.fb.group({
      specificationType: new FormControl(null, [
        Validators.required,
        noLeadingSpaces(),
      ]),
      specificationDetails: new FormControl(null, [
        Validators.required,
        noLeadingSpaces(),
      ]),
    });

    itemSpecificationArray.push(newRow);
  }

  deleteRow(i: any) {
    if (this.CF_1.itemSpecification.length >= 1) {
      this.CF_1.itemSpecification.removeAt(i);
    } else {
      this.toast.error('must be one', "Can't Deleted!");
    }
  }

  checkCreditDebitBalance(): boolean {
    const formArray = this.Account_details;
    let totalDebit = 0;
    let totalCredit = 0;

    formArray.controls.forEach((control) => {
      totalDebit += Number(control.get('debit_amount')?.value || 0);
      totalCredit += Number(control.get('credit_amount')?.value || 0);
    });

    if (totalDebit !== totalCredit) {
      this.toast.error('Credit and Debit amounts must be equal.');
      return false;
    }

    if (totalCredit !== Number(this.createDirectAsset.get('amount')?.value)) {
      this.toast.error('Total amount should match credit amount.');
      return false;
    }
    return true;
  }

  onChange(evemt: any) {
    try {
      let isValidExtension = this.$common.checkForValidFile(
        evemt,
        false,
        true,
        false,
      );
      if (!isValidExtension) return (this.documents = null);
      const formData = new FormData();
      if (evemt.target.files && evemt.target.files[0]) {
        formData.append('file', evemt.target.files[0]);
      }
      this.$miscellaneousService.documents(formData).subscribe(
        (response: any) => {
          if (response) {
            this.documents = `uploaded_files/${response?.url}`;
          }
        },
        (err) => {
          console.log(err);
        },
      );
    } catch (error) {
      console.log(error);
    }
  }

  async addDocument() {
    const uploadControl = this.createDirectAsset.get('upload_document');
    const doc_name = this.createDirectAsset.get('document_name');
    if (uploadControl?.value == null || uploadControl?.value[0] == null) {
      return this.toast.warning('Please upload document first!');
    }
    if (doc_name?.value == null || doc_name?.value[0] == null) {
      return this.toast.warning('Name is Missing!');
    }

    let payload = {
      document_name: this.createDirectAsset.value.document_name,
      upload_document: this.documents,
    };

    this.arrayDataPush.push(payload);

    this.createDirectAsset.get('document_name')?.setValue([null]);
    this.createDirectAsset.get('upload_document')?.setValue([null]);
    return this.toast.success('Document added successfully!');
  }

  deletData(data: any, index: number) {
    this.arrayDataPush.splice(index, 1);
  }

  generateImageUrl() {
    return environment.servralUrl + '/';
  }

  onSubmitForm() {
    this.createDirectAsset.markAllAsTouched();
    if (!this.checkCreditDebitBalance()) {
      return;
    }
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    if (this.createDirectAsset.invalid) {
      this.isSubmitting = false;
      const controls = this.createDirectAsset.controls;

      for (const name in controls) {
        if (controls[name].invalid) {
          console.warn(
            `Field "${name}" is invalid. Errors:`,
            controls[name].errors,
          );
        }
      }
      return this.toast.warning('Please fill all require field !');
    }
    const endpoint = {
      entity_id: this.entity_id,
      financial_year_id: this.financial_year_id,
      employee_id: this.employee_id,
    };
    const data = {
      ...this.createDirectAsset.value,
      asset_for_pm: this.isCheckedCondition,
      file: this.arrayDataPush,
    };

    if (this.id) {
      if (Array.isArray(data.file) && data.file.length > 0) {
        this.asset_service.updateDirectAsset(data, this.id).subscribe(
          (res: any) => {
            this.toast.success(res.message || 'Asset Updated Successfully');
            this.router.navigate(['/master/asset-management/asset-list']);
          },
          (err: any) => {
            this.isSubmitting = false;
            this.toast.error(err.message || 'Somethins went wrong !');
          },
        );
      } else {
        this.isSubmitting = false;
        this.toast.error('Document is required');
      }
    } else {
      this.asset_service.CreateDirectAsset(data, endpoint).subscribe(
        (res: any) => {
          this.toast.success(res.message || 'Asset created Successfully');
          this.router.navigate(['/master/asset-management/asset-list']);
        },
        (err: any) => {
          this.isSubmitting = false;
          this.toast.error(err.message || 'Somethins went wrong !');
        },
      );
    }
  }
}

import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ToastrService } from 'ngx-toastr';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';

@Component({
  selector: 'app-create-kit',
  templateUrl: './create-kit.component.html',
  styleUrls: ['./create-kit.component.scss']
})
export class CreateKitComponent implements OnInit {

  entity_id: any;
  financial_year_id: any;
  isEditMode = false;
  bomId: any;
  pageMode: any;
  bomForm!: FormGroup;
  hsnCodeList: any[] = [];
  searchListHSN: any;
  itemList: any[] = [];
  originalData: any;

  // Search Controls
  primarySearchCtrl: FormControl[] = [];
  substituteSearchCtrl: FormControl[] = [];

  // Filtered Data
  filteredPrimaryItems: ReplaySubject<any>[] = [];
  filteredSubstituteItems: ReplaySubject<any>[] = [];

  getSalesCRMData: any; // use for create / update master from sales crm panel

  constructor(
    private fb: FormBuilder,
    private location: Location,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
    private accessData: AccessControlService,
    private toast: ToastrService,
    private router: Router, private cryptoService: CryptoService,
    @Optional() public dialogRef: MatDialogRef<CreateKitComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
      this.getSalesCRMData = data;
  }

  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();

    if (this.entity_id) {
      this.getHSNCodeList();
      this.getItemListData();
    }

    if (!this.getSalesCRMData) {
      this.activeroute.queryParams.subscribe((params: any) => {
        this.bomId = this.cryptoService.decrypt(params.id);
        this.pageMode = this.cryptoService.decrypt(params.pageMode);
        this.isEditMode = !!this.bomId;
      });
    } else {
      this.bomId = this.getSalesCRMData?.bomId;
      this.pageMode = 'edit';
      this.isEditMode = !!this.bomId;
    } 

    this.bomForm = this.fb.group({
      bom_name: ['', Validators.required],
      bom_price: [null],
      hsn_id: [null],
      items: this.fb.array([])
    });

    if (!this.isEditMode) {
      this.addRow();
    }else{
      this.getData();
    }

    this.bomForm
      .get('bom_price')
      ?.valueChanges.subscribe(price => {

        const hsnControl =
          this.bomForm.get('hsn_id');

        if (price && Number(price) > 0) {

          hsnControl?.setValidators([
            Validators.required
          ]);

        } else {
          hsnControl?.clearValidators();
        }
        hsnControl?.updateValueAndValidity();
      });
  }

  get items(): FormArray {
    return this.bomForm.get('items') as FormArray;
  }

  getHSNCodeList() {
    this._configurationalMasterService.getHSNCode(this.entity_id, 'HSN').subscribe(
      (res: any) => {
        this.hsnCodeList = res?.data;
        this.searchListHSN = this.hsnCodeList.map(
          (value: any) => value.hsn_sac_code
        );
      });
  }

  searchFilterHSN(e: any) {
    const aa = e;
    let filteredVariable = this.hsnCodeList.filter((item: any) =>
      aa.includes(item.hsn_sac_code),
    );
    this.hsnCodeList = filteredVariable;
  }

  getHSNData(id: number) {
    return this.hsnCodeList.find((x) => x.id === id)?.value;
  }

  getItemListData() {
    this._configurationalMasterService.getItemListForBOM(this.entity_id).subscribe(
      (res: any) => {
        this.itemList = (res?.data || []).map((item: any) => ({
          id: item.id,
          item_name: `${item.item_name} | ${item.item_code} | ${item.MASTER_ITEM_ITEMTYPE?.itemType || ''}`
        }));
        setTimeout(() => {
          this.refreshAllDropdowns();
        });
      });
  }

  createRow(): FormGroup {
    return this.fb.group({
      itemId: [null, Validators.required],
      quantity: [
        1,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],
      substituteItems: [[]]
    });
  }

  addRow(): void {
    this.items.push(
      this.createRow()
    );

    const index = this.items.length - 1;
    this.initializeSearchControls(index);
  }

  removeRow(index: number): void {
    this.items.removeAt(index);
    this.refreshAllDropdowns();
  }

  getUsedItems(
    currentIndex?: number
  ): number[] {

    const usedItems: number[] = [];

    this.items.controls.forEach(
      (row: any, index: number) => {

        if (index === currentIndex) {
          return;
        }

        if (row.value.itemId) {
          usedItems.push(
            row.value.itemId
          );
        }

        if (
          row.value.substituteItems &&
          row.value.substituteItems.length
        ) {
          usedItems.push(
            ...row.value.substituteItems
          );
        }
      }
    );
    return [...new Set(usedItems)];
  }

  getAvailablePrimaryItems(
    index: number
  ) {

    const usedItems = this.getUsedItems(index);

    const currentItem =
      this.items
        .at(index)
        .get('itemId')
        ?.value;

    return this.itemList.filter(
      item => !usedItems.includes(item.id) || item.id === currentItem
    );
  }

  getAvailableSubstituteItems(
    index: number
  ) {
    const usedItems = this.getUsedItems(index);

    const currentPrimary =
      this.items
        .at(index)
        .get('itemId')
        ?.value;

    const selectedSubs =
      this.items
        .at(index)
        .get('substituteItems')
        ?.value || [];

    return this.itemList.filter(item =>
      item.id !== currentPrimary && (!usedItems.includes(item.id) || selectedSubs.includes(item.id))
    );
  }

  initializeSearchControls(index: number): void {

    this.primarySearchCtrl[index] =
      new FormControl('');

    this.substituteSearchCtrl[index] =
      new FormControl('');

    this.filteredPrimaryItems[index] =
      new ReplaySubject<any[]>(1);

    this.filteredSubstituteItems[index] =
      new ReplaySubject<any[]>(1);

    this.filteredPrimaryItems[index]
      .next(
        this.getAvailablePrimaryItems(index)
      );

    this.filteredSubstituteItems[index]
      .next(
        this.getAvailableSubstituteItems(index)
      );

    this.primarySearchCtrl[index]
      .valueChanges
      .subscribe(() => {
        this.filterPrimary(index);
      });

    this.substituteSearchCtrl[index]
      .valueChanges
      .subscribe(() => {
        this.filterSubstitute(index);
      });
  }

  filterPrimary(
    index: number
  ): void {

    let search =
      this.primarySearchCtrl[index]
        ?.value || '';

    const data = this.getAvailablePrimaryItems(index);
    if (!search) {
      this.filteredPrimaryItems[index]
        .next(data);
      return;
    }

    search = search.toLowerCase();
    this.filteredPrimaryItems[index]
      .next(
        data.filter(x =>
          x.item_name
            .toLowerCase()
            .includes(search)
        )
      );
  }

  filterSubstitute(
    index: number
  ): void {

    let search =
      this.substituteSearchCtrl[index]
        ?.value || '';

    const data = this.getAvailableSubstituteItems(index);
    if (!search) {
      this.filteredSubstituteItems[index]
        .next(data);
      return;
    }

    search = search.toLowerCase();
    this.filteredSubstituteItems[index]
      .next(
        data.filter(x =>
          x.item_name
            .toLowerCase()
            .includes(search)
        )
      );
  }

  refreshAllDropdowns(): void {
    for (
      let i = 0;
      i < this.items.length;
      i++
    ) {
      this.filterPrimary(i);
      this.filterSubstitute(i);
    }
  }

  onPrimaryChange(): void {
    this.refreshAllDropdowns();
  }

  onSubstituteChange(): void {
    this.refreshAllDropdowns();
  }

  getData(){
    this._configurationalMasterService.getBOMDataById(this.bomId).subscribe((res: any) => {
      this.loadBomForEdit(res?.data);
    });
  }

  loadBomForEdit(data: any): void {

    this.originalData = JSON.parse(JSON.stringify(data));

    this.bomForm.patchValue({
      bom_name: data.bom_name,
      bom_price: data.bom_price,
      hsn_id: data.hsn_id
    });

    this.items.clear();

    this.primarySearchCtrl = [];
    this.substituteSearchCtrl = [];

    this.filteredPrimaryItems = [];
    this.filteredSubstituteItems = [];

    data.items.forEach((item: any) => {

      const row = this.fb.group({
        itemId: [
          item.itemId,
          Validators.required
        ],
        quantity: [
          item.quantity,
          [
            Validators.required,
            Validators.min(1)
          ]
        ],
        substituteItems: [
          item.substituteItems || []
        ]
      });

      this.items.push(row);
      const index = this.items.length - 1;
      this.initializeSearchControls(index);
    });

    setTimeout(() => {
      this.refreshAllDropdowns();
    });

    if (this.pageMode === 'view') {
      this.bomForm.disable();
    }
  }

  saveBom(): void {
    if (this.bomForm.invalid) {
      this.bomForm.markAllAsTouched();
      return;
    }

    const formData = this.bomForm.getRawValue();
    const gstValue = this.getHSNData(formData.hsn_id);

    const payload = {
      ...formData,
      gst_value: gstValue || 0,
      entity_id: this.entity_id,
      financial_id: this.financial_year_id,
      bom_id: this.bomId,
      pageMode: this.getSalesCRMData?.mode
    };

    // compare only editable fields
    const currentData = {
      bom_name: payload.bom_name,
      bom_price: payload.bom_price,
      hsn_id: payload.hsn_id,
      items: payload.items
    };

    if (this.isEditMode && JSON.stringify(currentData) === JSON.stringify(this.originalData)) {
      this.toast.error('No Changes Found');
      return;
    }

    this._configurationalMasterService.createUpdateBOM(payload).subscribe((response: any) => {
      if (response) {
        this.toast.success(response.message);
        if(this.getSalesCRMData){
           this.dialogRef.close({refresh: true});
        }else{
          this.router.navigate(['master/configurational-master/installation-kit']);
        }
      }
    }, (err: any) => {
      this.toast.error(err.error.message)
    })
  }

  goBack(): void {
    this.location.back();
  }

  closeDialog(){
    this.dialogRef.close({refresh: false});
  }

}
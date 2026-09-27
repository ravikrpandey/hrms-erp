import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-accessory-item-create',
  templateUrl: './accessory-item-create.component.html',
  styleUrls: ['./accessory-item-create.component.scss'],
})
export class AccessoryItemCreateComponent implements OnInit {
  createPrItemForm: FormGroup;
  createParentForm: FormGroup;
  id: any;
  asset_id: any;
  sub_category_id: any;
  action_type: any;
  entity_id: any;
  financial_year_id: any;

  getCat_data: any;
  getCat_data2: any;
  itemCategoryList: any;
  subCategoryList: any;
  uomList: any;

  hsnCodeList: any[] = [];
  searchListHSN: any;

  documents: any;
  arrayDataPush: any = [];
  editIndex: number | null = null;
  singleItem: any;

  constructor(
    private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private activeroute: ActivatedRoute,
    private toaster: ToastrService,
    public $common: CommonService,
    private $miscellaneousService: MiscellaneousService,
    private route: Router
  ) {
    this.createPrItemForm = this.fb.group({
      item_name: new FormControl(null, [Validators.required]),
      uom_id: new FormControl(null, [Validators.required]),
      hsn_code_id: new FormControl(null, [Validators.required]),
      igst: new FormControl(null, [Validators.required]),
      accessories_price: new FormControl(null, [Validators.required]),
      upload_document: new FormControl(null),
      hsn_name: new FormControl(null),
      fitment_qty: new FormControl(null),
      removal_qty: new FormControl(null),
    });

    this.createParentForm = this.fb.group({
      asset_id: new FormControl(null, [Validators.required]),
      sub_category_name: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    this.financial_year_id = localStorage.getItem('financial_id');
    this.entity_id = localStorage.getItem('selectedEntityId');
    if (this.entity_id) {
      this.getHSNCodeList(this.entity_id);
    }

    this._configurationalMasterService.getActiveAssetMasterList().subscribe((res: any) => {
      this.getCat_data = res.data;
      this.getCat_data2 = res.data;
      this.itemCategoryList = this.getCat_data?.map((value: any) => value.asset_category_name) || [];
    });

    this._configurationalMasterService.getActiveUOMList().subscribe((res: any) => {
      this.uomList = res.data;
    });
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.item_id;
      this.asset_id = params.asset_id;
      this.sub_category_id = params.sub_category_id;
      this.action_type = params.action_type;
      if (this.id) {
        this.getItemMasterById();
      }
    });
  }

  onCategorySelect(event: any) {
    this.getItemSubCategory(event.value);
  }

  getItemSubCategory(id: any) {
    this._configurationalMasterService.getSubCategory(id).subscribe(
      (res: any) => {
        this.subCategoryList = res.data;
      },
      (err: any) => {
        console.log(err?.error?.message);
      }
    );
  }

  onChange(event: any) {
    try {
      let isValidExtension = this.$common.checkForValidFile(event, false, true, false);
      if (!isValidExtension) return this.documents = null;
      const formData = new FormData();
      if (event.target.files && event.target.files[0]) {
        formData.append('file', event.target.files[0]);
      }
      this.$miscellaneousService.documents(formData).subscribe((response: any) => {
        if (response) {
          this.documents = `uploaded_files/${response?.url}`;
        }
      }, err => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  }

  generateImageUrl() {
    return environment.servralUrl + '/';
  }

  getItemMasterById() {
    this._configurationalMasterService.getByAccessory(this.id, this.asset_id, this.sub_category_id).subscribe((res: any) => {
      this.singleItem = res.data;
      this.arrayDataPush = res.data?.accesseryArray || [];

      this.createParentForm.patchValue({
        asset_id: this.singleItem.accessories_cat_id,
        sub_category_name: this.singleItem.sub_category_id
      });

      this.getItemSubCategory(this.singleItem.accessories_cat_id);
    });
  }

  onSubmit() {
    if (this.createParentForm.invalid) {
      this.createParentForm.markAllAsTouched();
      this.toaster.error('Please fill required fields');
      return;
    }

    if (this.arrayDataPush.length === 0) {
      this.toaster.error('Please add at least one accessory item.');
      return;
    }

    const modifyArray: any = []
    this.arrayDataPush.forEach((item: any) => {
      modifyArray.push({
        id: item?.id,
        item_name: item?.item_name || item?.accessories_name,
        accessories_price: item?.accessories_price,
        hsn_code_id: item?.hsn_code_id,
        igst: item?.igst || item?.value,
        uom_id: item?.uom_id,
        accessories_doc: item?.accessories_doc,
        hsn_name: item?.hsn_name,
        fitment_qty: item?.fitment_qty,
        removal_qty: item?.removal_qty
      })
    });

    let createParentForm = this.createParentForm.value;
    let data = {
      asset_id: createParentForm.asset_id,
      accessories_cat_id: createParentForm.asset_id,
      sub_category_id: createParentForm.sub_category_name,
      financial_year_id: this.financial_year_id,
      entity_id: this.entity_id,
      accesseryArray: modifyArray,
      id: this.id || null
    };

    if (this.id) {
      this.$common.showLoader();
      this._configurationalMasterService.updateAccessoryMaster(data).subscribe(
        (res: any) => {
          this.$common.hideLoader();
          this.toaster.success(res.message);
          this.route.navigate(['master/configurational-master/accessory-item']);
        },
        (err) => {
          this.$common.hideLoader();
          this.toaster.error(err?.error?.message);
        }
      );
    } else {
      this.$common.showLoader();
      this._configurationalMasterService.createAccessory(data).subscribe(
        (res: any) => {
          this.$common.hideLoader();
          this.toaster.success(res.message);
          this.route.navigate(['master/configurational-master/accessory-item']);
        },
        (err) => {
          this.$common.hideLoader();
          this.toaster.error(err?.error?.message);
        }
      );
    }
  }

  removePlus(event: any): void {
    const key = event.key;
    if (key === '+' || key === '-') {
      event.preventDefault();
    }
  }

  itemFilter(e: any) {
    const aa = e;
    let filteredVariable = this.getCat_data2?.filter((item: any) =>
      aa.includes(item.asset_category_name)
    );
    this.getCat_data = filteredVariable;
  }

  getHSNCodeList(id: any) {
    this._configurationalMasterService.getHSNCode(id).subscribe((res: any) => {
      this.hsnCodeList = res?.data || [];
      this.searchListHSN = this.hsnCodeList.map((value: any) => value.hsn_sac_code);
    });
  }

  searchFilterHSN(e: any) {
    const aa = e;
    let filteredVariable = this.hsnCodeList?.filter((item: any) =>
      aa.includes(item.hsn_sac_code)
    );
    this.hsnCodeList = filteredVariable;
  }

  onHSNCodeChange(event: any) {
    const selectedHSN = this.hsnCodeList?.find((hsn: any) => hsn.id === event.value);
    if (selectedHSN) {
      this.createPrItemForm.patchValue({
        igst: selectedHSN.value,
        hsn_name: selectedHSN.hsn_sac_code
      });
    }
  }

  addDetails() {
    if (this.createPrItemForm.invalid) {
      this.createPrItemForm.markAllAsTouched();
      this.toaster.error('Please fill required item details!');
      return;
    }
    let val = this.createPrItemForm.value;

    let payload: any = {
      item_name: val?.item_name,
      accessories_price: val?.accessories_price,
      hsn_code_id: val?.hsn_code_id,
      igst: val?.igst,
      uom_id: val?.uom_id,
      accessories_doc: this.documents,
      hsn_name: val?.hsn_name,
      fitment_qty: val?.fitment_qty,
      removal_qty: val?.removal_qty
    };

    if (this.editIndex !== null) {
      let existingId = this.arrayDataPush[this.editIndex]?.id;
      if (existingId) {
        payload.id = existingId;
      }
      this.arrayDataPush[this.editIndex] = payload;
      this.toaster.success('Details updated successfully!');
      this.editIndex = null;
    } else {
      this.arrayDataPush.push(payload);
      this.toaster.success('Details added successfully!');
    }

    this.createPrItemForm.reset();
    this.documents = null;
  }

  deletData(data: any, index: number) {
    this.arrayDataPush.splice(index, 1);
  }

  editData(doc: any, index: number) {
    this.editIndex = index;
    this.createPrItemForm.patchValue({
      item_name: doc.item_name || doc?.accessories_name,
      accessories_price: doc.accessories_price,
      hsn_code_id: doc.hsn_code_id,
      igst: doc.igst || doc?.value,
      uom_id: doc.uom_id,
      hsn_name: doc.hsn_name || doc?.hsn_sac_code,
      fitment_qty: doc?.fitment_qty,
      removal_qty: doc?.removal_qty
    });
    this.documents = doc.accessories_doc || doc.file || '';
  }
}

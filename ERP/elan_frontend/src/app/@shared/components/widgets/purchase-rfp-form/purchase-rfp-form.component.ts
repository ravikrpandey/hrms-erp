import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AddProductDialogComponent } from 'src/app/@modules/purchase-management/dialog/add-product-dialog/add-product-dialog.component';
import { ItemInterface } from 'src/app/@shared/interface/item.interface';
import { PurchaseItemFormInterface } from 'src/app/@shared/interface/purchase.interface';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ItemQuestionDialogComponent } from 'src/app/@modules/purchase-management/dialog/item-question-dialog/item-question-dialog.component';
import { ShowQuestionAnswerDialogComponent } from 'src/app/@modules/purchase-management/dialog/show-question-answer-dialog/show-question-answer-dialog.component';

@Component({
  selector: 'app-purchase-rfp-form',
  templateUrl: './purchase-rfp-form.component.html',
  styleUrls: ['./purchase-rfp-form.component.scss'],
})
export class PurchaseRfpFormComponent implements OnInit, OnChanges {
  @Input() title = 'Purchase Management';
  @Input() subTitle = '';
  @Input() subheading = '';
  @Input() buttonText = '';
  @Input() buttonLink = '';
  @Input() isBack: boolean = true;
  @Output() buttonClick = new EventEmitter<void>();
  @Input() showActions: boolean = false;
  @Input() actions: {
    label: string;
    icon?: string;
    callback: () => void;
    color?: string;
  }[] = [];
  @Input() formType: 'RFP' | 'NEGOTIATION' | 'PR' | 'PO' | 'CLOSE_RFP' | 'VQA' =
    'RFP';
  @Output() submitForm = new EventEmitter<FormGroup>();
  @Output() updateForm = new EventEmitter<FormGroup>();
  @Output() approvalForm = new EventEmitter<FormGroup>();

  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
  form: FormGroup;
  mode: 'Add' | 'Edit' | 'View' | 'Approval' = 'Add';
  id: string = '';
  totalPurchaseAmount: number = 0;
  branchData: any[] = [];
  employeeData: any = {};
  approvalQuoteTable: any[] = [];
  rfpApprvovelId: string = '';
  rfp_number: string = '';
  rawPrItems: any[] = [];

  levels: any;
  levelsThree: any;
  levelsTwo: any;
  levelsOne: any;

  vendorList: any[] = [];
  prData: any;
  approval_status: boolean = false;
  isReNego: boolean = false;

  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
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
  minEndDate: Date;

  rfpRequiredKeys = [
    'prCategory',
    'financial_year_id',
    'department_id',
    'type',
    'employee_id',
    'employee_code',
    'warehouse_id',
    'end_date_pr',
  ];
  negoRequiredKeys = [
    'prCategory',
    'billing_branch_id',
    'financial_year_id',
    'department_id',
    'type',
    'employee_id',
    'employee_code',
    'vendor_id',
    'warehouse_id',
    'date',
    'cost_center_id',
  ];

  rfpItemRequiredKeys = [
    'item_master_id',
    'item_name',
    'item_code',
    'quantity',
    'priority',
    'vendor_ids',
    'expected_delivery_date',
  ];
  negoItemRequiredKeys = [
    'item_master_id',
    'item_name',
    'item_code',
    'quantity',
    'priority',
  ];

  constructor(
    private toast: ToastrService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private prService: PurchaseRequestService,
    private vendorService: VendorManagementService,
    private finance: FinaceService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private accessCtrl: AccessControlService,
  ) {
    this.form = this.fb.group({
      id: [null],
      prCategory: ['Item'],
      start_date_pr: [null],
      end_date_pr: [null],
      createdBy: [null],
      billing_branch_id: [null],
      delivery_date: [null],
      rfp_number: [null],
      rfpStatus: [true],
      entity_id: [this.accessCtrl.getEntityId()],
      financial_year_id: new FormControl(this.accessCtrl.getFinancialId()),
      department_id: new FormControl(this.accessCtrl.getUser()?.department_id),
      department_name: [null],
      type: new FormControl(null, Validators.required),
      employee_id: new FormControl(this.accessCtrl.getEmployeeId()),
      employee_code: new FormControl(null),
      vendor_id: [null],
      warehouse_id: [null],
      delivery_address: new FormControl(null),
      state: new FormControl(null),
      purchase_number: new FormControl(null),
      date: new FormControl(new Date(), Validators.required),
      remark: new FormControl(null),
      cost_center_id: new FormControl(null),
      totalPurchaseAmount: [0],
      remainingAmount: [0],
      item_detail: this.fb.array([]),
      remarks_approvel: [null],
      quotation_for: [null],
      file: new FormControl(null),
    });
    // this.fileArray.push({ imagePath: null, url: null });

    this.form.get('start_date_pr')?.valueChanges.subscribe((value: any) => {
      if (value) {
        this.minEndDate = value;
        const endDate = this.form.get('end_date_pr')?.value;
        if (endDate < this.minEndDate) {
          this.form.get('end_date_pr')?.setValue(null);
        }
      }
    });
    this.getVendorName();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.mode = params.type;
      this.id = params.pr_id;
      this.rfp_number = params.rfp_number || '';
      const pr_category = params.pr_category;
      this.form.get('prCategory')?.setValue(pr_category);
      if (this.formType === 'RFP') {
        this.form.patchValue({ id: this.id || null });
        this.generateRfpNumber();
      }
      if (!this.id) {
        this.getEmployeeData(this.accessCtrl.getEmployeeId());
      } else {
        this.getPRDataById(this.id, this.rfp_number);
        if (
          (this.formType === 'CLOSE_RFP' || this.formType === 'VQA') &&
          this.id
        ) {
          if (this.formType === 'CLOSE_RFP') {
            this.getQuotationLevel();
            this.getApprovelId();
            this.getApprovalQuoteTable();
          } else if (this.formType === 'VQA') {
            this.rfpApprvovelId = params.rfp_approval_id;
            this.getRFPNegoQuotationDetails(this.rfpApprvovelId);
          } else {
            this.rfpApprvovelId = params.rfp_approval_id;
            this.getByPendingApprover();
          }
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['formType']) {
      this.formType = changes['formType'].currentValue;
      if (this.formType === 'RFP') {
        this.rfpRequiredKeys.forEach((key: string) => {
          this.form.get(key)?.setValidators(Validators.required);
          this.form.get(key)?.updateValueAndValidity();
        });
      } else if (this.formType === 'NEGOTIATION') {
        this.negoRequiredKeys.forEach((key: string) => {
          this.form.get(key)?.setValidators(Validators.required);
          this.form.get(key)?.updateValueAndValidity();
        });
      }
    }
  }

  get itemDetail(): FormArray {
    return this.form.get('item_detail') as FormArray;
  }

  addItem(item: PurchaseItemFormInterface) {
    const fb = this.createItem(item);
    if (this.formType === 'RFP') {
      this.rfpItemRequiredKeys.forEach((key: string) => {
        fb.get(key)?.setValidators(Validators.required);
        fb.get(key)?.updateValueAndValidity();
      });
    } else if (this.formType === 'NEGOTIATION') {
      // add required fields for PO
      this.negoItemRequiredKeys.forEach((key: string) => {
        fb.get(key)?.setValidators(Validators.required);
        fb.get(key)?.updateValueAndValidity();
      });
    }
    this.itemDetail.push(fb);
  }

  createItem(item: PurchaseItemFormInterface): FormGroup {
    const group = this.fb.group({
      item_id: [item.id || null],
      item_master_id: [item.item_master_id],
      item_name: [item.item_name || null],
      item_code: [item.item_code || null],
      quantity: [item.quantity || null],
      mvp: [item.mvp || 0],
      total_mvp: [item.total_mvp || 0],
      grand_total: [item.grand_total || 0],
      priority: [item.priority || 'HIGH'],
      vendor_ids: [item.vendor_ids || null],
      item_image: [item.item_image],
      asset_category_id: [item.asset_category_id],
      expected_delivery_date: [item?.expected_delivery_date || null],
      questions: [item.questions || []],
      selected: [false],
      already_initiated: [false],
    });

    if (this.formType === 'RFP') {
      const fields = ['priority', 'vendor_ids', 'expected_delivery_date'];
      fields.forEach(field => group.get(field)?.disable());

      group.get('selected')?.valueChanges.subscribe((isSelected: boolean | null) => {
        if (isSelected === true) {
          fields.forEach(field => {
            if (!group.get('already_initiated')?.value) {
              group.get(field)?.enable();
            }
          });
        } else {
          fields.forEach(field => group.get(field)?.disable());
        }
      });
    }

    return group;
  }

  getEmployeeData(id: number) {
    this.prService.getEmployeData(id).subscribe((res: any) => {
      if (res && res.data.length > 0) {
        this.employeeData = res.data[0];
        this.form.patchValue({
          department_id: this.employeeData.department_id,
          employee_id: this.employeeData.employee_id,
          employee_code: this.employeeData.employee_code,
          billing_branch_id: this.employeeData.location_id,
          financial_year_id: this.accessCtrl.getFinancialId(),
          entity_id: this.accessCtrl.getEntityId(),
        });
      }
    });
  }

  generateRfpNumber() {
    this.vendorService.getRfpNumber().subscribe((res: any) => {
      if (res && res.data) {
        this.form.patchValue({
          rfp_number: res?.data,
        });
      }
    });
  }

  getVendorName() {
    this.vendorService
      .getAllVendorList(this.accessCtrl.getEntityId())
      .subscribe((res: any) => {
        if (res && res.data) {
          const data = [];
          for (let a = 0; a <= res.data.length - 1; a++) {
            data.push({
              asset_category_name:
                res?.data[a]?.MASTER_ASSET?.asset_category_name,
              vendor_name: res?.data[a]?.vendor_name,
              id: res?.data[a]?.id,
            });
          }

          this.vendorList = data;
        }
      });
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe((result: ItemInterface[]) => {
      console.log(result);
      if (result && result.length > 0) {
        result?.map((item: ItemInterface) => {
          let duplicateItems = '';
          for (let i = 0; i < this.itemDetail.value.length; i++) {
            if (this.itemDetail.value[i].item_id == item.id) {
              duplicateItems += ', ' + item.item_name;
            }
          }
          if (duplicateItems.length > 0) {
            duplicateItems = duplicateItems.slice(2);
            this.toast.error(`${duplicateItems}  already added`);
            return;
          }
          let payload: PurchaseItemFormInterface;
          payload = {
            item_name: item?.item_name,
            item_code: item?.item_code,
            quantity: item?.quantity,
            mvp:
              typeof item?.MVP === 'string' ? parseFloat(item.MVP) : item.MVP,
            total_mvp: Number(
              item.quantity == null
                ? 0
                : item.quantity * parseFloat(item.MVP ? item.MVP : '0'),
            ),
            grand_total: item.MVP
              ? Number(item.MVP) * Number(item.quantity)
              : 0,
            item_image: item?.MASTER_ITEM_IMAGE_DOCUMENTs[0]?.image || '',
            asset_category_id: item.asset_id,
            item_master_id: item.id,
          };
          this.addItem(payload);
        });
        if (this.totalPurchaseAmount) {
          this.totalPurchaseAmount -= this.totalPurchaseAmount;
        }
        for (const item of this.itemDetail.value) {
          this.totalPurchaseAmount +=
            typeof item.mvp === 'string' ? parseFloat(item.mvp) : item.mvp;
        }
      }
    });
  }

  generateImageUrl(uploadDoc: any): string {
    const servralUrl = environment.servralUrl;
    return `${servralUrl}/${uploadDoc}`;
  }

  seePreviewTable(path: string) {
    if (path) {
      Swal.fire({
        imageUrl: path,
        imageHeight: 250,
        imageAlt: 'Document',
        confirmButtonColor: '#858586',
        confirmButtonText: 'Ok',
      });
    }
  }

  onSubmit() {
    const payload = this.form.getRawValue();
    console.log(payload);
    if (this.form.invalid) {
      this.toast.error('Please fill all the required fields');
      return;
    }
    this.submitForm.emit(this.form);
  }

  onUpdate() {
    const payload = this.form.getRawValue();
    console.log(payload);
    if (this.form.invalid) {
      this.toast.error('Please fill all the required fields');
      return;
    }
    this.updateForm.emit(this.form);
  }

  onApproval() {
    const payload = this.form.getRawValue();
    console.log(payload);
    if (this.form.invalid) {
      this.toast.error('Please fill all the required fields');
      return;
    }
    if (this.formType === 'CLOSE_RFP') {
      this.approvalQuoteTable[0].items = this.approvalQuoteTable[0].items.map(
        (item: any) => {
          if (item.checked) {
            item.rfp_approvel_status = true;
          } else {
            item.rfp_approvel_status = false;
          }
          return item;
        },
      );
      if (!this.hasCheckedTrue(this.approvalQuoteTable)) {
        this.toast.warning('First Select The Item');
        return;
      }
      this.form.value.approvalQuoteTable = this.approvalQuoteTable;
      this.form.value.rfp_approval_id = this.rfpApprvovelId;
      this.form.value.rfp_number = this.rfp_number || (this.prData && this.prData.rfp_number) || '';
    }
    if (this.formType === 'VQA') {
      let workflow_type = this.form.value.quotation_for;
      if (this.rfpApprvovelId.startsWith('N')) {
        workflow_type = 'Negotiation';
      }
      if (this.rfpApprvovelId.startsWith('R')) {
        workflow_type = 'RFP';
      }
      this.form.value.workflow_type = workflow_type;
      this.form.value.rfp_approval_id = this.rfpApprvovelId;
      this.form.value.employee_id = this.accessCtrl.getEmployeeId();
      this.form.value.entity_id = this.accessCtrl.getEntityId();
    }
    this.approvalForm.emit(this.form);
  }

  onRejected() {
    const payload = this.form.getRawValue();
    console.log(payload);
    if (this.form.invalid) {
      this.toast.error('Please fill all the required fields');
      return;
    }
    if (this.formType === 'CLOSE_RFP') {
      this.approvalQuoteTable[0].items = this.approvalQuoteTable[0].items.map(
        (item: any) => {
          if (item.checked) {
            item.rfp_approvel_status = true;
          } else {
            item.rfp_approvel_status = false;
          }
          return item;
        },
      );
      if (!this.hasCheckedTrue(this.approvalQuoteTable)) {
        this.toast.warning('First Select The Item');
        return;
      }
      this.form.value.approvalQuoteTable = this.approvalQuoteTable;
      this.form.value.rfp_approval_id = this.rfpApprvovelId;
      this.form.value.rfp_number = this.rfp_number || (this.prData && this.prData.rfp_number) || '';
    }
    if (this.formType === 'VQA') {
      let workflow_type = this.form.value.quotation_for;
      if (this.rfpApprvovelId.startsWith('N')) {
        workflow_type = 'Negotiation';
      }
      if (this.rfpApprvovelId.startsWith('R')) {
        workflow_type = 'RFP';
      }
      this.form.value.workflow_type = workflow_type;
      this.form.value.rfp_approval_id = this.rfpApprvovelId;
      this.form.value.employee_id = this.accessCtrl.getEmployeeId();
      this.form.value.entity_id = this.accessCtrl.getEntityId();
    }
    this.updateForm.emit(this.form);
  }

  hasCheckedTrue(data: any) {
    for (let i = 0; i < data.length; i++) {
      const hasChecked = data[i].items.some(
        (item: any) => item.checked === true,
      );
      if (hasChecked) {
        return true;
      }
    }
    return false;
  }

  getPRDataById(id: any, rfp_number?: string) {
    this.prService
      .getByIdPR(this.id, this.form.get('prCategory')?.value, rfp_number)
      .subscribe((res: any) => {
        if (res && res.data && Array.isArray(res.data) && res.result) {
          this.prData = res.data[0];
          if (res.vendor_details?.re_negotiation) {
            this.isReNego = true;
          } else {
            this.isReNego = false;
          }
          this.approval_status = res.approval_status;
          this.getEmployeeData(this.prData?.employee_id);

          this.totalPurchaseAmount = 0;
          const newFileView: any[] = [];

          const hasNullValue = res?.data?.data_image?.every(
            (doc: any) => doc.uploade_image === null,
          );
          if (hasNullValue === true) {
            // this.withoutFile = "Not Available Any File"
          } else {
            res?.data?.data_image?.forEach((file: any) => {
              if (file?.uploade_image !== null) {
                const parts = file?.uploade_image?.split('.');
                const fileNameWithoutExtension = parts?.slice(0, -1).join('.');
                newFileView.push({
                  img_name: fileNameWithoutExtension,
                  uploade_image: file?.uploade_image,
                });
              }
            });
            // this.fileView = newFileView
          }

          // Patch Form Data
          this.form.patchValue({
            createdBy: res.result,
            start_date_pr: this.now,
            employee_id: this.prData?.employee_id,
            financial_year_id: this.prData?.financial_year_id,
            entity_id: this.prData.entity_id,
            employee_code: this.prData?.employee_code,
            department_id: this.prData?.department_id,
            department_name: this.prData?.MASTER_DEPARTMENT?.department_name,
            // cost_center_id: this.prData?.cost_center_id,
            type: this.prData?.pr_type,
            date: this.prData?.pr_date,
            delivery_address: this.prData?.pr_address,
            state: this.prData?.pr_state,
            warehouse_id: this.prData?.warehouse_id,
            purchase_number: this.prData?.pr_number,
            remark: this?.prData?.remark,
            id: id,
          });

          this.form
            .get('cost_center_id')
            ?.setValue(this.prData?.cost_center_id, { emitEvent: false });

        this.rawPrItems = this.prData?.PROCUREMENT_PURCHASE_REQUEST_ITEMs || [];
        this.filterAndPopulateItems();
      }
    });
  }

  openItemQuestionDialog(item: AbstractControl, index: number) {
    const dialogRef = this.dialog.open(ItemQuestionDialogComponent, {
      width: '600px',
      data: { item: item.value },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.itemDetail.at(index).patchValue({ questions: result });
      }
    });
  }

  getQuotationLevel() {
    this.prService.quotationLevelGet(this.id, this.rfp_number, this.rfpApprvovelId)?.subscribe(
      (res: any = []) => {
        this.levelsOne = res?.data?.Level1;
        this.levelsTwo = res?.data?.Level2;
        this.levelsThree = res?.data?.Level3 || [];
      },
      (err: any) => {},
    );
  }

  getApprovalQuoteTable() {
    this.prService.approvelQuoteRFP(this.id, this.rfp_number).subscribe(
      (res: any) => {
        this.approvalQuoteTable = res.data;
        this.filterAndPopulateItems();
      },
      (err: any) => {},
    );
  }

  getRFPNegoQuotationDetails(rfp_approval_id?: string) {
    this.prService.getRFPNegoQuotationDetails(this.id, rfp_approval_id).subscribe(
      (res: any) => {
        this.approvalQuoteTable = res.data;
        this.form
          .get('quotation_for')
          ?.setValue(res.quotationData.quotation_for);
        this.form
          .get('remarks_approvel')
          ?.setValue(res.quotationData.remarks_approval);
        
        this.rfp_number = res.quotationData.rfp_number || '';
        this.getPRDataById(this.id, this.rfp_number);
        if (res.quotationData.quotation_for === 'Negotiation') {
          this.prService.updateQutationnegotiate(this.id, undefined, res.quotationData.negotiation_id).subscribe(
            (levelRes: any) => {
              this.levelsOne = levelRes?.data?.Level1 || [];
              this.levelsTwo = levelRes?.data?.Level2 || [];
              this.levelsThree = levelRes?.data?.Level3 || [];
            }
          );
        } else {
          this.getQuotationLevel();
        }
        
        this.filterAndPopulateItems();
      },
      (err: any) => {},
    );
  }

  viewAnswer(name: any, questionFormArray: []) {
    const dialogRef = this.dialog.open(ShowQuestionAnswerDialogComponent, {
      width: '600px',
      data: { name, questionFormArray, show: false }, // pass FormArray reference
    });
  }

  selectedItemMap: { [itemId: string]: any } = {}; // item_id → vendor_id

  checkboxSele(vendorData: any, vendorId: number) {
    const itemId = vendorData.item_id;
    const selectedVendor = this.selectedItemMap[itemId];

    if (vendorData.checked) {
      if (selectedVendor && selectedVendor !== vendorId) {
        alert('This item is already selected by another vendor.');
        vendorData.checked = false;
        return;
      }
      this.selectedItemMap[itemId] = vendorId;
    } else {
      delete this.selectedItemMap[itemId];
    }
    const vendorToUpdate = this.approvalQuoteTable.find(
      (vendor: any) => vendor.vendor_id === vendorId,
    );
    if (vendorToUpdate) {
      const itemToUpdate = vendorToUpdate.items.find(
        (item: any) => item.item_id === itemId,
      );
      if (itemToUpdate) {
        itemToUpdate.checked = vendorData.checked;
      }
    }
  }

  getApprovelId() {
    this.prService.getApprovelId().subscribe((id: any) => {
      this.rfpApprvovelId = id?.data;
    });
  }

  getByPendingApprover() {
    this.prService
      .getByApproverSendData(this.id, this.rfpApprvovelId, this.isReNego)
      .subscribe(
        (res: any) => {
          this.approvalQuoteTable = res.data;
          this.filterAndPopulateItems();
        },
        (err: any) => {
          this.toast.error(`${err.code.message}`);
        },
      );
  }

  filterAndPopulateItems() {
    if (!this.rawPrItems) return;

    this.itemDetail.clear();
    this.totalPurchaseAmount = 0;

    const allowedItemMasterIds = new Set<number>();
    const allowedServiceMasterIds = new Set<number>();
    let hasApprovalTable = false;

    if (this.approvalQuoteTable && this.approvalQuoteTable.length > 0) {
      hasApprovalTable = true;
      this.approvalQuoteTable.forEach((vendor: any) => {
        vendor.items?.forEach((item: any) => {
          if (item.item_id) allowedItemMasterIds.add(item.item_id);
          if (item.service_id) allowedServiceMasterIds.add(item.service_id);
        });
      });
    }

    for (let item of this.rawPrItems) {
      if (this.formType === 'CLOSE_RFP' || this.formType === 'VQA') {
        if (hasApprovalTable) {
          const isItemAllowed = allowedItemMasterIds.has(item.item_master_id) || allowedServiceMasterIds.has(item.service_master_id);
          if (!isItemAllowed) {
            continue;
          }
        } else if (this.rfp_number) {
          const matchesRfp = item?.PROCUREMENT_PURCHASE_VENDOR_RFP_ITEMs?.some(
            (rfp: any) => rfp.rfp_number === this.rfp_number
          );
          if (!matchesRfp) {
            continue;
          }
        }
      }

      let vendor_ids: number[] = [];
      item?.PROCUREMENT_PURCHASE_REQUEST_VENDORs?.forEach((value: any) => {
        vendor_ids.push(value?.vendor_id);
      });
      item.vendor_ids = vendor_ids;
      let payload: PurchaseItemFormInterface;
      payload = {
        item_name: item?.MASTER_ITEM?.item_name || item?.MASTER_SERVICE?.service_name,
        item_code: item?.MASTER_ITEM?.item_code || item?.MASTER_SERVICE?.service_code,
        quantity: item?.quantity,
        priority: item?.priority,
        vendor_ids: item.vendor_ids,
        mvp: item?.MASTER_ITEM?.MVP || item?.MASTER_SERVICE?.MVP,
        total_mvp: item?.total_mvp,
        grand_total: item.grand_total,
        item_image:
          item?.MASTER_ITEM?.MASTER_ITEM_IMAGE_DOCUMENTs?.[0]?.image || item?.MASTER_SERVICE?.service_document,
        asset_category_id: item.item_categroy_id,
        id: item.id,
        item_master_id: item.item_master_id,
        expected_delivery_date: item?.PROCUREMENT_PURCHASE_VENDOR_RFP_ITEMs?.[0]?.expected_delivery_date,
      };
      this.addItem(payload);
      const fbGroup = this.itemDetail.at(this.itemDetail.length - 1) as FormGroup;
      const alreadyInitiated = item?.PROCUREMENT_PURCHASE_VENDOR_RFP_ITEMs?.length > 0;
      if (alreadyInitiated) {
        fbGroup.get('already_initiated')?.setValue(true);
        fbGroup.get('priority')?.disable();
        fbGroup.get('vendor_ids')?.disable();
        fbGroup.get('expected_delivery_date')?.disable();
      }
      this.totalPurchaseAmount +=
        typeof item?.grand_total === 'string'
          ? parseFloat(item?.grand_total)
          : item?.grand_total;
    }
  }
}

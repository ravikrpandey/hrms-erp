import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { StoreManagementService } from 'src/app/@modules/store-management/store-management.service';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { GrnServiceService } from '../../services/grn-service.service';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit {
  POformGroup: FormGroup;
  submitBtn: boolean = true;
  showBtn: boolean = true;
  imageToUpload: any;
  imagePath: any;
  po_category_type: any;
  fileType: any;
  entity_id: any;
  finacial_id: any;
  employee_id: any;
  loginUserDetails: any;
  role: any;
  rowData: any;
  getByData: any;
  getByItem: any;
  getByService: any;
  withoutFile: string;
  fileView: any[];
  typeCateg: string;
  totalAmountItem: number;
  CF_1: any;
  totalAmountService: number;
  createPrForm: any;
  budgetAmount: any;
  remainingAmount: any;
  dept_po: any;
  mode: string;
  poBypr: any;
  selectedGRNs: string[] = [];
  a: any = [];
  finalDataForVersion: any;
  filteredPOData: any;
  emp_id: any;
  formDisabled: boolean = false;

  constructor(
    public _location: Location,
    private _GrnService: GrnServiceService,
    private _ActiveRoute: ActivatedRoute,
    private _fb: FormBuilder,
    public dialog: MatDialog,
    private _toasterService: ToastrService,
    private router: Router,
    private $common: CommonService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _inventory: InventoryManagementService,
    private storeService: StoreManagementService,
    private _commonService: CommonService,
    private prService: PurchaseRequestService,
    private fb: FormBuilder,
    private GrnService: GrnServiceService
  ) {
    this.POformGroup = _fb.group({
      po_number: new FormControl(),
      po_date: new FormControl(),
      po_type: new FormControl(),
      invoice_no: new FormControl('', [Validators.required]),
      po_id: new FormControl(''),
      grn_id: new FormControl(''),
      invoice_date: new FormControl(''),
      grn_number: new FormControl(''),
      image: new FormControl(),
      vendor_name: new FormControl(),
      warehouse_id: new FormControl(''),
      container_type: new FormControl(''),
      store_id: new FormControl(''),
      shelf_id: new FormControl(),
      advance_payment: new FormControl(),
      section_id: new FormControl(),
      row_id: new FormControl(),
      grn_date: new FormControl(''),
      grnItem: new FormArray([
        new FormGroup({
          item_cat: new FormControl(),
          item_name: new FormControl(),
          manage_by: new FormControl(),
          item_code: new FormControl(),
          po_qty: new FormControl(),
          invoice_qty: new FormControl(),
          rcvd_qty: new FormControl(''),
          select_qty: new FormControl(),
          reject_qty: new FormControl(),
          isQuantityEqual: new FormControl(),
          item_id: new FormControl(),
          po_item_id: new FormControl(),
          amount: new FormControl(),
          remaining_qty: new FormControl(),
          total_amount: new FormControl(),
          grn_item_id: new FormControl(),
          isDisabled: new FormControl(false),
        }),
      ]),
      chargesDetailList: new FormArray([]),
    });

    this.employee_id = localStorage.getItem('EmpMainId');
    this.loginUserDetails = localStorage.getItem('signInUser');
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.role = this.loginUserDetails.roles;
    let entity_id: any = localStorage.getItem('selectedEntityId');
    var empData: any = localStorage.getItem('signInUser');
    let financial_id: any = localStorage.getItem('financial_id');
    this.entity_id = entity_id;
    this.finacial_id = financial_id;
    this.emp_id = JSON.parse(empData).employee_id;
    // this.getApprovePoList(this.loginUserDetails.employee_id)
    // this.getAllPoList(this.finacial_id,this.entity_id,this.loginUserDetails.emp_id,2)
    this.getAllPoList2(this.finacial_id, this.entity_id, this.emp_id, 2);
  }

  get grnItems(): FormArray {
    return this.POformGroup.get('grnItem') as FormArray;
  }

  getPOData(e: any) {
    this.po_id = e;
    // this.getById()
    let po_number = null;
    this.rowData.forEach((value: any) => {
      if (value.po_Id == e) {
        po_number = value.po_number;
        this.mode = value.mode;
        this.poBypr = value.poBypr;
      }
    });
    this.getGRNList(po_number);
    // this.getPoListById()
  }

  // get promotionalDetails() {
  //   return this.POformGroup.get('promotional_details') as FormArray;
  // }

  get GrnDataItem() {
    return this.POformGroup.get('grnItem') as FormArray;
  }

  patchData(data: any[]): FormArray {
    const formArray: any = this.fb.array([]); // Create a new FormArray instance

    // Loop through each item in your data and create a FormGroup for each item
    data.forEach((item) => {
      const group = this.fb.group({
        item_cat: new FormControl(item.asset_category_name || ''), // Adjust field names based on actual data structure
        item_name: new FormControl(item.item_name),
        manage_by: new FormControl(item.manage_by || ''), // Optional field with a default value if missing
        item_code: new FormControl(item.item_code),
        po_qty: new FormControl(
          item.item_quantity ? item.item_quantity : item.receiveQty
        ),
        invoice_qty: new FormControl(item.invoice_qty || 0),
        receiveQty: new FormControl(item.receiveQty || 0),
        select_qty: new FormControl(item.select_qty || 0),
        reject_qty: new FormControl(item.reject_qty || 0),
        isQuantityEqual: new FormControl(item.isQuantityEqual || false),
        item_id: new FormControl(item.item_id),
        po_item_id: new FormControl(item.po_item_id),
        amount: new FormControl(item.amount),
        remaining_qty: new FormControl(item.remaining_qty || 0),
        total_amount: new FormControl(item.amount),
        hsnCode: new FormControl(item.hsnCode),
        gstRate: new FormControl(item.gstRate),
        grn_item_id: new FormControl(item.grn_item_id || ''),
        isDisabled: new FormControl(item.isDisabled || false),
      });

      // Add each group to the FormArray
      formArray.push(group);
    });

    return formArray;
  }

  grnDataAllItems: any = [];
  po_id: any;
  status: any;
  version_id: any;
  closedStatus: any;
  rejectView: any;

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    let finacial_id = localStorage.getItem('financial_id');
    // this.getAllWarehouseList(this.entity_id)
    // this.getListType()
    this.getAllWarehouseList(this.entity_id, finacial_id);
    // this.getAllStoreList();

    this.finacial_id = Number(finacial_id);
    this._ActiveRoute.queryParams.subscribe((res: any) => {
      this.po_id = res.po_id;
      this.status = res.status;
      this.version_id = res.version_id;
      (this.closedStatus = res.rejectGRN), (this.rejectView = res.RejectStatus);
    });
    if (this.po_id) {
      this.getPoListById();
    }
    this.getExistingPo(this.entity_id);
    this.getHsnCode();
  }

  // getAllUses:any=[]
  //   getListType = () => {
  //     this._configurationalMasterService.getAllUsesData(this.entity_id).subscribe((res: any) => {
  //       this.getAllUses = res.data;
  //     },(err: any) => {
  //       this.getAllUses = []
  //     });
  //   }

  // warehouseList:any=[]
  // getAllWarehouseList(id:any){
  //   this._inventory.getAllWarehouseList(id).subscribe((res:any)=>{
  //     this.warehouseList=res.data;
  //   })
  // }
  // getWarehouseRowList(event: any): void {
  //   this.getAllRowList(event.value);
  // }
  rowList: any = [];
  // getAllRowList(warehouse_id:any){
  //   this._inventory.getAllRowList(this.entity_id, warehouse_id).subscribe((res: any) => {
  //     this.rowList = res.data;
  //     const rowControl = this.POformGroup.get('row_id');
  //     if (this.rowList.length) {
  //       rowControl?.addValidators([Validators.required]);
  //     } else {
  //       rowControl?.clearValidators();
  //     }
  //     rowControl?.updateValueAndValidity();
  //   });
  // }
  storeList: any = [];

  getAllStoreList() {
    this.storeService
      .getAllStockList(
        this.entity_id,
        this.finacial_id,
        this.employee_id,
        this.role
      )
      .subscribe((response: any) => {
        this.storeList = response.data;
      });
  }

  itemList: any[] = [];

  getGRNList(id: any) {
    this.prService.getGRNList(id).subscribe((response: any) => {
      this.storeList = response.data;
      this.itemList = response.itemList;
      this.a = this.storeList;

      const allIds = this.storeList.map((item: any) => item.grn_number);
      this.POformGroup.get('grn_id')?.setValue(allIds);
      this.POformGroup.setControl('grnItem', this.patchData(this.itemList));

      this.totalAmount = this.itemList.reduce((sum: number, item: any) => {
        return +sum + parseFloat(item.amount);
      }, 0);
    });
  }

  getApprovePoList(data: any) {
    this._commonService?.showLoader();
    this.prService.getApprovedApprovel(data).subscribe(
      (res: any) => {
        // this.rowData = res.data;

        this._commonService?.hideLoader();
        // this.rowData.map((item: any) => {
        //   item.approvel_status = item?.approvalDetails?.Approvel_status
        // })
      },
      (err: any) => {
        this._commonService?.hideLoader();
      }
    );
  }

  getAllPoList2(
    financial_id: any,
    entity_id: any,
    employee_id: any,
    status: any
  ) {
    this.GrnService.getAllGRNData(
      financial_id,
      entity_id,
      employee_id,
      status,
      true
    ).subscribe((res: any) => {
      this.finalDataForVersion = res.data;
      if (status == 0) {
        res.data.map((res: any) => {
          return (res.status = 'po-list');
        });
      } else if (status == 1) {
        res.data.map((res: any) => {
          return (res.status = 'partial-list');
        });
      }

      const modify: any = [];
      res.data?.map((data: any) => {
        modify.push({
          po_number: data?.po_number,
          status: data?.status,
          grnStatus: data?.grnStatus,
          version_id: data?.version_id,
          version: data?.version,
          po_type: data?.po_type,
          vendor_name: data?.vendor_name,
          po_category: data?.po_category,
          branch_name: data?.branch_name,
          po_date: data?.po_date,
          id: data?.id,
          item_quantity: data?.item_quantity,
          total_purchase: data?.total_purchase,
          name: data?.name,
          discardStatus: data.discardStatus,
          grn_id: data.grn_id,
          invoice_status: data.invoice_status
            ? data.invoice_status
            : 'INCOMPLETE',
          mode: data.mode,
          po_Id: data.po_Id,
        });
      });
      this.filteredPOData = modify;
      console.log('+++filtered Po Data+++', this.filteredPOData);
      // const inputData:any =

      const data = this.filteredPOData;

      const groupedByPO: any = {};

      // Group by po_number
      data.forEach((entry: any) => {
        if (!groupedByPO[entry.po_number]) {
          groupedByPO[entry.po_number] = [];
        }
        groupedByPO[entry.po_number].push(entry);
      });

      const result = [];

      // Filter PO groups where all entries have invoice_status === "INCOMPLETE"
      for (const po in groupedByPO) {
        const entries = groupedByPO[po];
        const allIncomplete = entries.every(
          (e: any) => e.invoice_status === 'INCOMPLETE'
        );

        if (allIncomplete) {
          result.push(entries[0]); // include all entries for this PO
        }
      }

      // this.rowData = result;
    });
  }

  getAllPoList(
    financial_id: any,
    entity_id: any,
    employee_id: any,
    status: any
  ) {
    this.GrnService.getAllGRNData(
      financial_id,
      entity_id,
      employee_id,
      status,
      true
    ).subscribe((res: any) => {
      this.finalDataForVersion = res.data;
      if (status == 0) {
        res.data.map((res: any) => {
          return (res.status = 'po-list');
        });
      } else if (status == 1) {
        res.data.map((res: any) => {
          return (res.status = 'partial-list');
        });
      }

      const modify: any = [];
      res.data?.map((data: any) => {
        modify.push({
          po_number: data?.po_number,
          status: data?.status,
          grnStatus: data?.grnStatus,
          version_id: data?.version_id,
          version: data?.version,
          po_type: data?.po_type,
          vendor_name: data?.vendor_name,
          po_category: data?.po_category,
          branch_name: data?.branch_name,
          po_date: data?.po_date,
          id: data?.id,
          item_quantity: data?.item_quantity,
          total_purchase: data?.total_purchase,
          name: data?.name,
          discardStatus: data.discardStatus,
          grn_id: data.grn_id,
          invoice_status: data.invoice_status
            ? data.invoice_status
            : 'INCOMPLETE',
          mode: data.mode,
        });
      });
      this.filteredPOData = modify;
      const inputData: any = this.filteredPOData;
      const grouped: any = {};

      // Group entries by po_number
      inputData.forEach((entry: any) => {
        if (!grouped[entry.po_number]) {
          grouped[entry.po_number] = [];
        }
        grouped[entry.po_number].push(entry);
      });

      const result = [];

      for (const po in grouped) {
        const entries = grouped[po];
        const allBulk = entries.every((e: any) => e.mode === 'BULK');

        if (allBulk) {
          result.push(entries[0]); // Push only one entry if all are BULK
        } else {
          result.push(...entries); // Push all entries otherwise
        }
      }

      console.log(result);
      this.filteredPOData = result;
    });
  }

  manageStore(event: any) {
    let manage_by = event.target.value;
    if (manage_by == 'store') {
      const storeControl = this.POformGroup.get('store_id');
      storeControl?.addValidators([Validators.required]);
      storeControl?.updateValueAndValidity();

      this.POformGroup.get('warehouse_id')?.setValue(null);
      this.POformGroup.get('row_id')?.setValue(null);
      this.POformGroup.get('shelf_id')?.setValue(null);
      this.POformGroup.get('section_id')?.setValue(null);

      const warehouseControl = this.POformGroup.get('warehouse_id');
      warehouseControl?.clearValidators();
      warehouseControl?.updateValueAndValidity();

      const rowControl = this.POformGroup.get('row_id');
      rowControl?.clearValidators();
      rowControl?.updateValueAndValidity();

      const shelfControl = this.POformGroup.get('shelf_id');
      shelfControl?.clearValidators();
      shelfControl?.updateValueAndValidity();

      const sectionControl = this.POformGroup.get('section_id');
      sectionControl?.clearValidators();
      sectionControl?.updateValueAndValidity();
    } else {
      this.POformGroup.get('store_id')?.setValue(null);
      const storeControl = this.POformGroup.get('store_id');
      storeControl?.clearValidators();
      storeControl?.updateValueAndValidity();

      const warehouseControl = this.POformGroup.get('warehouse_id');
      warehouseControl?.addValidators([Validators.required]);
      warehouseControl?.updateValueAndValidity();

      const rowControl = this.POformGroup.get('row_id');
      rowControl?.addValidators([Validators.required]);
      rowControl?.updateValueAndValidity();

      const shelfControl = this.POformGroup.get('shelf_id');
      shelfControl?.addValidators([Validators.required]);
      shelfControl?.updateValueAndValidity();

      const sectionControl = this.POformGroup.get('section_id');
      sectionControl?.addValidators([Validators.required]);
      sectionControl?.updateValueAndValidity();
    }
  }

  warehouseList: any = [];

  getAllWarehouseList(entity_id: any, id: any) {
    this._inventory.getAllWarehouseList(entity_id, id).subscribe((res: any) => {
      this.warehouseList = res.data;
    });
  }

  getWarehouseRowList(event: any): void {
    this.getAllRowList(event.value);
  }

  getAllRowList(warehouse_id: any) {
    this._inventory
      .getAllRowList(this.entity_id, this.finacial_id, warehouse_id)
      .subscribe((res: any) => {
        this.rowList = res.data;
        const rowControl = this.POformGroup.get('row_id');
        if (this.rowList.length) {
          rowControl?.addValidators([Validators.required]);
        } else {
          rowControl?.clearValidators();
        }
        rowControl?.updateValueAndValidity();
      });
  }

  selfList: any = [];

  getAllSelfList(row_id: any) {
    this._inventory.getAllSelfList(row_id).subscribe(
      (res: any) => {
        this.selfList = res.data;
        const shelfControl = this.POformGroup.get('shelf_id');
        if (this.selfList.length) {
          shelfControl?.addValidators([Validators.required]);
        } else {
          shelfControl?.clearValidators();
        }
        shelfControl?.updateValueAndValidity();
      },
      (err: any) => {
        this._toasterService.error('Self data not found!', 'Error Message');
      }
    );
  }

  sectionList: any = [];

  getAllSectionList(row_id: any) {
    this._inventory.getAllSectionList(row_id).subscribe(
      (res: any) => {
        this.sectionList = res.data;
        const sectionControl = this.POformGroup.get('section_id');
        if (this.sectionList.length) {
          sectionControl?.addValidators([Validators.required]);
        } else {
          sectionControl?.clearValidators();
        }
        sectionControl?.updateValueAndValidity();
      },
      (err: any) => {
        this._toasterService.error('Section data not found!', 'Error Message');
      }
    );
  }

  getValue(e: any) {
    return 0;
  }

  goBack() {
    this._location.back();
  }

  calculateInvoiceQty(index: number) {
    const grnItem = this.GrnDataItem.at(index) as FormGroup;
    const rcvdQty = grnItem.get('rcvd_qty')?.value;
    const rejectQty = grnItem.get('reject_qty')?.value || 0;
    const invoiceQty = rcvdQty + rejectQty;

    grnItem.patchValue({
      invoice_qty: invoiceQty,
    });
  }

  getAllPartialData: any = [];
  statusNumber: any;
  promoDataAllItems: any[] = [];
  getAllItemPoList: any = [];
  vendor_id: any;

  getById() {
    this._commonService?.showLoader();
    this.prService.getBYPoNew(this.po_id).subscribe(
      (res: any) => {
        this._commonService?.hideLoader();
        this.getByData = res.data;
        this.getByItem = res?.data?.data_Item;
        this.getByService = res?.data?.data_service;

        const newFileView: any[] = [];

        const hasNullValue = res?.data?.data_image?.every(
          (doc: any) => doc.uploade_image === null
        );

        console.log(hasNullValue, 'hasNullValue');
        if (hasNullValue === true) {
          this.withoutFile = 'Not Available Any File';
        } else {
          res?.data?.data_image?.forEach((file: any) => {
            if (file?.uploade_image !== null) {
              const parts = file?.uploade_image?.split('.');
              const fileNameWithoutExtension = parts?.slice(0, -1).join('.');

              newFileView.push({
                img_name: fileNameWithoutExtension,
                uploade_image: file?.uploade_image,
              });
              console.log(newFileView, 'newFileView');
            }
          });
          this.fileView = newFileView;
        }
        if (this.getByItem.length > 0) {
          let dataItem: any = [];
          let totalAmountPrice = 0;
          for (let i = 0; i <= this.getByItem.length - 1; i++) {
            dataItem.push({
              // new FormControl(`${environment.servralUrl + '/' + e.item_document}`)
              item_document: `${environment.servralUrl + '/' + this.getByItem[i]?.item_document
                }`,
              item_name: this.getByItem[i]?.item_name,
              item_code: this.getByItem[i]?.item_code,
              manage_by: this.getByItem[i]?.manage_by,
              asset_category_name: this.getByItem[i]?.asset_category_name,
              item_quantity: this.getByItem[i]?.quantity,
              priority: this.getByItem[i]?.priority,
              mvp: this.getByItem[i]?.total_mvp,
              asset_category_id: this.getByItem[i]?.asset_id,
              item_id: this.getByItem[i]?.id,
              old_mvp: Number(this.getByItem[i]?.MVP),
              vendor_name: this.getByItem[i]?.vendor_name,
              unit_price: this.getByItem[i]?.unit_price,
              cgst: Number(this.getByItem[i]?.total_cgst),
              sgst: Number(this.getByItem[i]?.total_sgst),
              igst: Number(this.getByItem[i]?.total_igst),
              discount: Number(this.getByItem[i]?.total_discount),
              // tax:this.getByItem[i]?.tax,
              amount: this.getByItem[i]?.total_mvp,
              grand_total: this.getByItem[i]?.grand_total,
            });
            totalAmountPrice += this.getByItem[i]?.grand_total;
          }
          this.totalAmountItem = totalAmountPrice;
          console.log(this.totalAmountItem, ' this.totalAmountItem');
          console.log(dataItem, 'dataItem');
          this.POformGroup.setControl('grnItem', this.patchData(dataItem));

          // this.CF_1.item_detail = this.patchData(dataItem);
        } else {
          let dataService: any = [];
          let totalAmountPrice = 0;
          for (let i = 0; i <= this.getByService.length - 1; i++) {
            dataService.push({
              service_document: `${environment.servralUrl +
                '/' +
                this.getByService[i]?.service_document
                }`,
              service_name: this.getByService[i]?.service_name,
              service_code: this.getByService[i]?.service_code,
              manage_by: this.getByService[i]?.manage_by,
              service_quantity: this.getByService[i]?.quantity,
              asset_category_name: this.getByService[i]?.asset_category_name,
              priority: this.getByService[i]?.priority,
              mvp: this.getByService[i]?.total_mvp,
              asset_category_id: this.getByService[i]?.asset_id,
              item_id: this.getByService[i]?.id,
              old_mvp: Number(this.getByService[i]?.MVP),
              vendor_name: this.getByService[i]?.vendor_name,
              amount: this.getByService[i]?.total_mvp,
              unit_price: this.getByService[i]?.unit_price,
              // tax:this.getByService[i]?.tax,
              cgst: Number(this.getByService[i]?.total_cgst),
              sgst: Number(this.getByService[i]?.total_sgst),
              igst: Number(this.getByService[i]?.total_igst),
              discount: Number(this.getByService[i]?.total_discount),
              grand_total: this.getByService[i]?.grand_total,
            });
            totalAmountPrice += this.getByService[i]?.grand_total;
          }
          this.totalAmountService = totalAmountPrice;
          console.log(this.totalAmountService, ' this.totalAmountItem');

          this.POformGroup.setControl('grnItem', this.patchData(dataService));
          // this.CF_2.service_detail = this.patchData(dataService);
        }

        this.POformGroup.patchValue({
          branchName: this.getByData?.branch_name,
          branchCode: this.getByData?.branchCode,
          department_name: this.getByData?.department_name,
          po_type: this.getByData?.po_type,
          financial_year: this.getByData?.financial_year,
          po_number: this.getByData?.po_number,
          // po_supplier_vendor_name:this.getByData?.po_supplier_vendor_name,
          employee_id: this.getByData?.employee_id,
          item_detail: this.getByData?.item_detail,
          po_remark: this.getByData?.po_remark,
          billing_address: this.getByData?.billing_address_id,
          department_code: this.getByData?.department_code,
          cost_center: this.getByData?.cost_center_name,
          cc_code: this.getByData?.cost_center_code,
          po_supplier_vendor_name: this.getByData?.vendor_name,
          state: this.getByData?.po_state,
          delivery_address: this.getByData?.po_address,
          location: this.getByData?.location_id,
          vendor_account_name: this.getByData?.vendor_account_name,
        });
        let data = {
          cost_center_id: this.getByData?.cost_center_id,
          dept_id: this.getByData?.department_id,
          type: this.getByData?.po_type,
          financial_year: this.getByData?.financial_year_id,
          entity_id: this.getByData?.entity_id,
        };
        // "dept_name": "Finance and Accounting",
        // "type": "Capex",
        // "financial_year":2

        this.prService.getBudgetNew(data).subscribe((res: any) => {
          // this.budget_details = res.data

          // this.financialYear = res.data?.MASTER_FINANCIAL_YEAR?.financial_year;
          this.budgetAmount = res.data?.amount;
          this.remainingAmount = res.remainingAmount;
          this.dept_po = res.Total_purchase;
          if (
            this.mode == 'view-approve' ||
            this.mode == 'pending' ||
            this.mode == 'rejected'
          ) {
            if (!this.poBypr) {
              if (this.totalAmountItem) {
                this.dept_po += this.totalAmountItem;
              }
              if (this.totalAmountService) {
                this.dept_po += this.totalAmountService;
              }
            }
          }

          // this.budgetId = res.data.id;
        });
      },
      (err: any) => {
        this._commonService?.hideLoader();
      }
    );
  }

  getPoListById() {
    this.createGrnNo();
    if (this.po_id) {
      while (this.GrnDataItem.length > 0) {
        this.GrnDataItem.removeAt(0);
      }

      if (this.status == 'po-list') {
        this.statusNumber = 0;
      } else if (this.status == 'partial-list') {
        this.statusNumber = 1;
      } else {
        this.statusNumber = 2;
      }
      this._GrnService
        .getPoGrnGetBy(this.po_id, this.statusNumber, this.version_id)
        .subscribe((response: any) => {
          this.getAllPartialData = response.data?.ItemList;

          this.vendor_id = response.data.vendor_id;
          this.POformGroup.patchValue({
            // advance_payment:response.data.advance_payment,
          });
          if (this.version_id) {
            this.getAllPartialData = response.data?.ItemList;
          }
          if (this.status == 'partial-list' || this.version_id) {
            // this.getAllRowList(response.data.warehouse_id)
            this.getAllSelfList(response.data.row_id);
            this.getAllSectionList(response.data.shelf_id);
            this.totalAmount = this.getAllPartialData.reduce(
              (sum: number, item: any) => {
                return (
                  +sum + (item.total_mvp / item.quantity) * item.receiveQty
                );
              },
              0
            );
            console.warn(this.totalAmount, 'totalAmountdddd');

            if (response.data.total_amount) {
              // this.totalAmount=response.data.amount
            }
            this.POformGroup.patchValue({
              invoice_no:
                this.closedStatus == 'OPEN' ? '' : response.data.invoiceNo,
              grn_date: response.data.grn_date,
              warehouse_id: response.data.warehouse_id,
              row_id: response.data.row_id,
              shelf_id: response.data.shelf_id,
              section_id: response.data.section_id,
              // advance_payment:response.data.advance_payment,
              invoice_date: response.data.invoiceDate,
              po_type: response.data.po_category_type,
              vendor_name: response.data.vendor_name,
              po_number: response.data.po_number,
              po_date: response.data.po_date,
              uses_id: response.data.uses_id,
            });
            console.warn(this.getAllPartialData, 'this.getAllPartialData');

            const isValid = this.getAllPartialData?.every((item: any) => {
              return item.receiveQty == '0' && item.rejectQty == '0';
            });

            if (isValid) {
              this.submitBtn = true;
            } else {
              this.submitBtn = false;
            }

            this.totalAmount = this.getAllPartialData.reduce(
              (sum: number, item: any) => {
                return (
                  +sum + (item.total_mvp / item.quantity) * item.receiveQty
                );
              },
              0
            );
            console.warn(response.data?.ItemList, 'totalAmountdddd');
            response.data?.ItemList?.forEach((itemSpec: any) => {
              const rcvdQty =
                itemSpec?.manage_by === 'S.No. Only'
                  ? itemSpec?.receiveQty
                  : itemSpec?.receiveQty || 0;

              const rejectQty =
                itemSpec?.manage_by === 'S.No. Only'
                  ? itemSpec?.rejectedCount
                  : itemSpec?.rejectQty || 0;

              const invoiceQty = rcvdQty + rejectQty;

              console.warn(invoiceQty, 'invoice');
              const newRow = this._fb.group({
                item_id: itemSpec?.item_id,
                manage_by: itemSpec?.manage_by,
                status: this.status,
                item_cat: itemSpec?.asset_category_name,

                item_name: itemSpec?.item_name,
                item_code: itemSpec?.item_code,
                po_qty: itemSpec?.quantity,
                remaining_qty: itemSpec?.remaining_qty,
                invoice_qty: itemSpec?.invoice_qty,
                rcvd_qty: itemSpec.receiveQty,
                reject_qty: itemSpec.rejectQty,
                isQuantityEqual: itemSpec?.isQuantityEqual,
                po_item_id: itemSpec?.po_item_id,
                amount: itemSpec?.total_mvp,
                total_amount:
                  itemSpec.rejectQty == null
                    ? ''
                    : (itemSpec.total_mvp / itemSpec.quantity) *
                    itemSpec.receiveQty,
                grn_item_id: itemSpec?.grn_item_id,
                rejectQty: itemSpec?.rejectQty,
                final_reject: itemSpec.final_reject,
                receiveQty: itemSpec?.receiveQty,
                isDisabled:
                  itemSpec?.quantity == itemSpec?.selection_item ? true : false,
              });

              this.GrnDataItem.push(newRow);
            });
          } else {
            this.po_category_type = response.data?.po_category_type;
            this.grnDataAllItems = response.data?.itemList;
            this.totalAmount = this.grnDataAllItems.reduce(
              (sum: number, item: any) => {
                return sum + (item.total_mvp / item.quantity) * item.receiveQty;
              },
              0
            );
            console.warn(this.totalAmount, 'totalAmount');

            if (response) {
              this.POformGroup.patchValue({
                po_number: response?.data?.po_number,
                po_date: response.data.po_date,
                po_type: response?.data?.po_type,
                vendor_name: response?.data?.vendor_name,
              });
            }

            this.grnDataAllItems?.forEach((itemSpec: any) => {
              const rcvdQty =
                itemSpec?.manage_by === 'S.No. Only'
                  ? itemSpec?.receiveQty
                  : itemSpec?.receiveQty || 0;

              const rejectQty =
                itemSpec?.manage_by === 'S.No. Only'
                  ? itemSpec?.rejectedCount
                  : itemSpec?.rejectQty || 0;

              const invoiceQty = rcvdQty + rejectQty;

              console.warn(invoiceQty, 'invoice');

              const newRow = this._fb.group({
                item_id: itemSpec?.item_id,
                manage_by: itemSpec.manage_by,
                item_cat: itemSpec?.asset_category_name,
                item_name: itemSpec?.item_name,
                item_code: itemSpec?.item_code,
                po_qty: itemSpec?.quantity,
                remaining_qty: itemSpec?.remaining_qty,
                invoice_qty: itemSpec?.invoice_qty,
                rcvd_qty: itemSpec?.receiveQty,
                select_qty: itemSpec?.selection_item,
                reject_qty: itemSpec?.rejectQty,
                amount: itemSpec?.total_mvp,
                total_amount:
                  itemSpec.rejectQty == null
                    ? ''
                    : (itemSpec.total_mvp / itemSpec.quantity) *
                    itemSpec.receiveQty,
                isQuantityEqual: itemSpec?.isQuantityEqual,
                po_item_id: itemSpec?.po_item_id,
                grn_item_id: itemSpec?.grn_item_id,
                rejectQty: itemSpec?.rejectQty,
                receiveQty: itemSpec?.receiveQty,
                final_reject: itemSpec.final_reject,
                isDisabled:
                  itemSpec?.quantity == itemSpec?.selection_item ? true : false,
              });

              this.GrnDataItem.push(newRow);
            });
          }

          this.promoDataAllItems = response.data?.promotion_detail;

          console.warn(this.promoDataAllItems, 'ddd');

          if (this.promoDataAllItems.length) {
            // for (let i = 0; i < this.promoDataAllItems?.length; i++) {
            // const itemSpec = this.promoDataAllItems[i];
            // const newRow1 = this._fb.group({
            //  item_id: itemSpec?.item_id,
            //  manage_by: itemSpec?.manage_by,
            //  status: this.status,
            //  item_cat: itemSpec?.asset_category_name,
            //  item_name: itemSpec?.item_name,
            //  item_code: itemSpec?.item_code,
            //  po_qty: itemSpec?.quantity,
            //  remaining_qty: itemSpec?.remaining_qty,
            //  invoice_qty: itemSpec?.invoice_qty,
            //  rcvd_qty: itemSpec.receiveQty,
            //  reject_qty: itemSpec.rejectQty,
            //  isQuantityEqual: itemSpec?.isQuantityEqual,
            //  po_item_id: itemSpec?.po_item_id,
            //  amount :itemSpec?.total_mvp,
            //  total_amount :itemSpec.rejectQty==null?'':itemSpec?.amount ,
            //  grn_item_id: itemSpec?.grn_item_id,
            //  isDisabled: itemSpec?.quantity == itemSpec?.selection_item ? true : false,
            // });
            // this.promotionalDetails.push(newRow1);
            // }
          }
        });
    }
  }

  totalAmount: any;
  invoiceValues: any;

  keyUpValues(value: any, i: number, grnItem: any) {
    const control = this.POformGroup.get('grnItem') as FormArray;

    const item = control.at(i).value;
    let values = (item.amount / item.po_qty) * item.rcvd_qty;
    control.at(i).patchValue({ total_amount: values });
    let finalData = control.controls.reduce((sum, formGroup) => {
      return sum + formGroup.get('total_amount')?.value;
    }, 0);

    this.totalAmount = finalData;

    if (grnItem.manage_by !== 'S.No. Only') {
      console.warn(grnItem.value.po_qty, 'envform');

      const poQty = grnItem.value?.po_qty;
      if (value > poQty) {
        this._toasterService.error('Invoice QTY should less than the PO-QTY');
      } else {
        this.invoiceValues = value;
      }
    }
  }

  generateImageUrl() {
    return environment.servralUrl + '/';
  }

  uploadImage: any;
  uploadImageData: any;
  imagePathData: any;

  onChange(e: any) {
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0);
    }

    let isValidExtension = this.$common.checkForValidFile(e, false, false);
    if (!isValidExtension) {
      return this.POformGroup.patchValue({
        image: null,
      });
    }

    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0) || null;

      this.imagePathData = this.imageToUpload?.name;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
      };

      reader.readAsDataURL(this.imageToUpload);

      console.log(this.imageToUpload.name, 'fff');

      let formData = new FormData();
      formData.append('file', this.imageToUpload);

      console.warn(formData.get('file'), 'formData');

      this._configurationalMasterService
        .uploadImg(formData)
        .subscribe((res: any) => {
          this.uploadImageData = res.backendUrl;
          console.warn(res.backendUrl, 'backendfa');

          console.warn(this.uploadImage, 'upload');
        });
    }
  }

  seePreview(imagePath: any) {
    if (this.imagePath) {
      if (imagePath) {
        Swal.fire({
          imageUrl: imagePath,
          imageHeight: 250,
          imageAlt: 'Profile Image',
          confirmButtonColor: '#063178',
          confirmButtonText: 'Ok',
        });
      }
    }
  }

  onGRNChange(event: MatSelectChange) {
    // a = []
    let b: any = [];
    this.storeList.forEach((item: any) => b.push(item.grn_number));
    const allValues = this.storeList.map((item: any) => item.grn_number);
    this.POformGroup.get('grn_id')?.setValue(allValues);
    // this.selectedGRNs =  b; // this is the array of selected values
    // console.log('Selected GRNs:', this.selectedGRNs);
    // this.POformGroup.get('grn_id')?.setValue(b);
    this.storeList.forEach((value: any) => {
      this.selectedGRNs.forEach((element: any) => {
        if (element == value.grn_number) {
          this.a.push({
            grn_number: value.grn_number,
            version_id: value.version_id,
          });
        }
      });
    });
  }

  getExistingPo(entity_id: any) {
    this.GrnService.allExistingPo(entity_id).subscribe({
      next: (res: any) => {
        console.log(res);
        this.rowData = res.data;
      },
      error(err) {
        console.log(err);
      },
    });
  }

  onSubmitData() {
    this.POformGroup.markAllAsTouched();
    if (this.POformGroup.invalid) {
      this._toasterService.error('Please Fill all required fields');
      return;
    }

    let obj = {
      type: 'InDirect',
      po_number: this.POformGroup.value.po_number,
      invoice_number: this.POformGroup.value.invoice_no,
      purchase_oredr_id: this.po_id,
      entity_id: this.entity_id,
      financial_year_id: this.finacial_id,
      invoice_status: 'COMPLETE',
      invoice_version: this.a,
      chargesDetailList: this.additionalCharges.getRawValue(),
      mode: 'BULK',
      grand_total: this.totalAmount,
    };

    this._GrnService.createPoInvoice(obj).subscribe((res: any) => {
      let data = res.message;
      if (data) {
        this._toasterService.success(res.message);
        this.router.navigate(['master/purchase-management/invoice']);
      }
    });
  }

  close() {
    this.router.navigate(['/master/purchase-management/invoice']);
  }

  createGrnNo() {
    this._GrnService.CreateGrnNo().subscribe((res: any) => {
      this.POformGroup.patchValue({
        grn_number: res.data,
      });
    });
  }

  viewImage() {
    window.open(this.item_document_images, '_blank');
  }

  item_document_images: any;

  generateFileUrl(uploadDoc: any) {
    this.item_document_images =
      environment.servralUrl + '/uploadDoc/' + uploadDoc;
  }

  chargesToggle: boolean = false;

  toggleChargesRow(event: any) {
    if (this.chargesToggle) {
      if (this.CF_2.chargesDetailList.length === 0) {
        this.addChargesRow();
      }
    } else {
      const chargesFormArray = <FormArray>this.CF_2.chargesDetailList;
      while (chargesFormArray.length !== 0) {
        chargesFormArray.removeAt(0);
      }
      this.productCalculation();
    }
  }

  get CF_2(): any {
    return this.POformGroup.controls;
  }

  addChargesRow() {
    if (!this.chargesToggle) return; // Prevent adding if toggle is off
    (<FormArray>this.CF_2.chargesDetailList).push(
      new FormGroup({
        additional_charges_name: new FormControl(null, Validators.required),
        amount: new FormControl(null, Validators.required),
        hsn_code_id: new FormControl(null, Validators.required),
        tax_rate: new FormControl(null),
        description: new FormControl(null),
        version_id: new FormControl(this.version_id),
        grn_master_id: new FormControl(null),
      })
    );
  }

  deleteChargesRow(i: any, control: any) {
    if (this.CF_2.chargesDetailList.length >= 1) {
      this.CF_2.chargesDetailList.removeAt(i);
      this.productCalculation();
    } else {
      // this.toast.error('must be one', "Can't Deleted!");
    }
  }

  hsnCodeList: any = [];
  hsnCodeList2: any;
  hsn: any;

  getHsnCode() {
    this._configurationalMasterService
      .getHsnCode(this.entity_id)
      .subscribe((res: any) => {
        this.hsnCodeList = res.data;
        this.hsnCodeList2 = this.hsnCodeList;
        this.hsn = this.hsnCodeList2.map((res: any) => res.hsn_sac_code);
      });
  }

  hsnSearch(e: any) {
    const aa = e;
    let filteredVariable = this.hsnCodeList2.filter((item: any) =>
      aa.includes(item.hsn_sac_code)
    );
    this.hsnCodeList = filteredVariable;
  }

  onHSNCodeChange(value: any, index: number): void {
    let chargesDetailList = this.POformGroup.get(
      'chargesDetailList'
    ) as FormArray;
    const selectedHSN = this.hsnCodeList.find(
      (hsn: { id: any }) => hsn.id == value
    );
    chargesDetailList.at(index).patchValue({
      tax_rate: selectedHSN.value,
      description: selectedHSN.description,
    });
  }

  keyPress2(event: KeyboardEvent) {
    const inputChar = String.fromCharCode(event.charCode);
    const currentValue = (event.target as HTMLInputElement).value;

    const isNumber = /[0-9]/.test(inputChar);
    const isDot = inputChar === '.';

    if (event.keyCode !== 8 && !isNumber) {
      if (isDot) {
        if (currentValue.includes('.')) {
          event.preventDefault();
        }
      } else {
        event.preventDefault();
      }
    }

    if (event.key === ' ' || event.key === '+' || event.key === '-') {
      event.preventDefault();
    }
  }

  get additionalCharges() {
    return this.POformGroup.get('chargesDetailList') as FormArray;
  }

  productCalculation() {
    const chargeList = this.additionalCharges.value || [];
    const currentList = this.CF_2.grnItem.value || [];

    // const additionalCharges = parseFloat(formObj?.additional_charges) || 0;
    let totalPrice: any = 0;
    currentList.forEach((item: any) => {
      // const qty = Number(item?.po_qty);
      const amount = Number(item?.total_amount);
      totalPrice += amount;
    });

    let totalAdditionalCharges = 0;
    let totalGSTonCharges = 0;
    chargeList.forEach((charge: any) => {
      const chargeAmount = Number(charge?.amount) || 0;
      const chargeRate = Number(charge?.tax_rate) || 0;

      totalAdditionalCharges += chargeAmount;
      totalGSTonCharges += (chargeAmount * chargeRate) / 100;
    });

    this.totalAmount = totalPrice + totalGSTonCharges + totalAdditionalCharges;
  }
}

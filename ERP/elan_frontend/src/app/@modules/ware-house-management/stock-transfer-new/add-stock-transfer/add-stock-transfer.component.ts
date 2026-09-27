import { Location } from '@angular/common';
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
import { environment } from 'src/app/environments/environment';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { InventoryManagementService } from '../../inventory-management.service';
import { MatDialog } from '@angular/material/dialog';
import { SerialSelectionDialogComponent } from './serial-selection-dialog.component';

function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-add-stock-transfer',
  templateUrl: './add-stock-transfer.component.html',
  styleUrls: ['./add-stock-transfer.component.scss'],
})
export class AddStockTransferComponent {
  createStockTransfer: any;
  file: any;
  itemsList: any[] = [];
  itemsList2: any[] = [];
  itemsList3: any[] = [];
  masterItems: any[] = [];
  imageToUpload: any;
  imagePath: any;
  entity_id: any;
  warehouseList: any;
  randomId: any;
  targetWarehouseList: any;
  sourseWarehouseList: any;
  financial_year_id: string | null;
  documentUpload: any;
  id: any;
  actionType: any;

  // Source layout lists
  sourceZones: any[] = [];
  sourceBays: any[] = [];
  sourceRacks: any[] = [];
  sourceBins: any[] = [];

  // Target layout lists
  targetZones: any[] = [];
  targetBays: any[] = [];
  targetRacks: any[] = [];
  targetBins: any[] = [];

  // Icon markers
  closeIcon: boolean = false;
  targetWarehouseCloseIcon: boolean = false;
  closeIcon2: boolean = false;
  closeIcon3: boolean = false;
  closeIcon4: boolean = false;
  targetCloseIcon2: boolean = false;
  targetCloseIcon3: boolean = false;
  targetCloseIcon4: boolean = false;

  warehouseList2: any[] = [];
  warehouseList3: any[] = [];
  targetWarehouseList2: any[] = [];
  targetWarehouseList3: any[] = [];

  constructor(
    private fb: FormBuilder,
    private _configurationalMasterService: ConfigurationalmasterService,
    private recruitService: RecruitService,
    private inventory_services: InventoryManagementService,
    private $common: CommonService,
    private router: Router,
    private toast: ToastrService,
    private locatin: Location,
    private location: Location,
    private toaster: ToastrService,
    private _inventory: InventoryManagementService,
    private acctivate: ActivatedRoute,
    public mtdialog: MatDialog,
  ) {
    this.createStockTransfer = this.fb.group({
      stock_entry_type: new FormControl(null, [Validators.required]),
      date: new FormControl(null, [Validators.required]),
      reason: new FormControl(null, [Validators.required, noLeadingSpaces()]),
      source_warehouse_id: new FormControl(null, [Validators.required]),
      target_warehouse_id: new FormControl(null, [Validators.required]),
      expected_transfer_date: new FormControl(null, [Validators.required]),
      driver_name: new FormControl(null, [
        Validators.required,
        noLeadingSpaces(),
      ]),
      vehicle_no: new FormControl(null, [Validators.required]),
      uploadedFile: new FormControl(null),
      remarks: new FormControl(null, [Validators.required]),
      source_zone_id: new FormControl(null),
      source_row_id: new FormControl(null),
      source_shelf_id: new FormControl(null),
      source_section_id: new FormControl(null),
      target_zone_id: new FormControl(null),
      target_row_id: new FormControl(null),
      target_shelf_id: new FormControl(null),
      target_section_id: new FormControl(null),
      random_id: new FormControl(null),
      item_details: new FormArray([
        new FormGroup({
          item_id: new FormControl(null, [Validators.required]),
          quantity: new FormControl(null, [Validators.required]),
          item_code: new FormControl(null),
          serial_ids: new FormControl([]),
          serial_details: new FormControl([]),
          batch_no: new FormControl(null),
          manage_by: new FormControl(null),
        }),
      ]),
    });
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.getItemMasterlist();
    this.getAllWarehouseList();
    this.generateRandomStockId();

    this.acctivate.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.actionType = params.actionType;

      if (this.id) {
        this.inventory_services
          .getAllStockTransferById(this.id)
          .subscribe((resp: any) => {
            let res = resp.data;
            this.documentUpload =
              res.uploadedFile == null
                ? null
                : environment.servralUrl +
                  '/uploaded_files/' +
                  res.uploadedFile;

            // Load available items and layouts based on existing source/target
            this.loadAvailableItems(res.source_warehouse_id);
            this.loadLayoutData(res);

            this.createStockTransfer.patchValue({
              stock_entry_type: res.stock_entry_type,
              date: res.date,
              reason: res.reason,
              source_warehouse_id: res.source_warehouse_id,
              target_warehouse_id: res.target_warehouse_id,
              expected_transfer_date: res.expected_transfer_date,
              driver_name: res.driver_name,
              vehicle_no: res.vehicle_no,
              remarks: res.remarks,
            });

            // Populate form array
            const detailsArray = this.stakeHoldersFormArray;
            detailsArray.clear();
            for (let i = 0; i < res.itemDetails.length; i++) {
              const itemDetail = res.itemDetails[i];
              const control = this.fb.group({
                item_id: [itemDetail.item_id, Validators.required],
                quantity: [itemDetail.quantity, Validators.required],
                item_code: [itemDetail.item_code],
                serial_ids: new FormControl(
                  itemDetail.serials
                    ? itemDetail.serials.map((s: any) => s.grn_item_status_id)
                    : [],
                ),
                serial_details: new FormControl(itemDetail.serials || []),
                batch_no: [itemDetail.batch_no || null],
                manage_by: [itemDetail.manage_by || 'Batch Only'],
              });
              detailsArray.push(control);
            }

            if (this.actionType == 'view') {
              this.createStockTransfer.disable(); // field disable (readonly)
            } else {
              this.createStockTransfer.enable(); // field enable (editable)
            }
          });
      }
    });
  }

  getItemMasterlist() {
    this._configurationalMasterService.getAllItem().subscribe((res: any) => {
      this.masterItems = res.data || [];
    });
  }

  getAllWarehouseList() {
    this.inventory_services
      .getAllWarehouseList(this.entity_id, this.financial_year_id)
      .subscribe((response: any) => {
        this.warehouseList = response.data;
        this.targetWarehouseList = response.data;
        this.sourseWarehouseList = response.data;

        this.warehouseList2 = response?.data?.map((x: any) => x.name);
        this.warehouseList3 = this.warehouseList;
        this.targetWarehouseList2 = response?.data?.map((x: any) => x.name);
        this.targetWarehouseList3 = this.targetWarehouseList;
      });
  }

  generateRandomStockId() {
    const now = new Date();
    const datePart =
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0');
    const randomPart = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .toUpperCase()
      .padStart(6, '0');
    this.randomId = `WST-${datePart}-${randomPart}`;
    this.createStockTransfer.get('random_id').setValue(this.randomId);
  }

  loadAvailableItems(warehouseId: any) {
    if (!warehouseId) {
      this.itemsList = [];
      this.itemsList3 = [];
      return;
    }
    this._inventory
      .getInventoryStockData(this.entity_id, warehouseId)
      .subscribe((res: any) => {
        const stockItems = res.data?.StockList || [];
        this.itemsList = stockItems.map((s: any) => ({
          id: s.item_id,
          item_name: s.item_name,
          item_code: s.item_code,
          manage_by: s.manage_by,
          available_qty: s.qty,
        }));

        // Fallback merge for edit/view mode to prevent blank items
        const currentItems =
          this.createStockTransfer.get('item_details')?.value || [];
        currentItems.forEach((cItem: any) => {
          if (
            cItem.item_id &&
            !this.itemsList.some((i) => i.id === cItem.item_id)
          ) {
            const matched = this.masterItems.find(
              (m: any) => m.id === cItem.item_id,
            );
            if (matched) {
              this.itemsList.push(matched);
            } else {
              this.itemsList.push({
                id: cItem.item_id,
                item_name: cItem.item_name || 'Item Name',
                item_code: cItem.item_code,
                manage_by: cItem.manage_by || 'Batch Only',
              });
            }
          }
        });
        this.itemsList3 = this.itemsList;
      });
  }

  loadLayoutData(res: any) {
    if (res.source_warehouse_id) {
      this.inventory_services
        .getWarehouseByIdWithBifurcation(res.source_warehouse_id)
        .subscribe((respSource: any) => {
          this.sourceZones = respSource.data?.zones || [];
          let matchedZoneId = null;

          if (res.source_row_id && this.sourceZones.length) {
            for (const zone of this.sourceZones) {
              const bays = zone.warehouseBay || [];
              if (bays.some((b: any) => b.id === res.source_row_id)) {
                matchedZoneId = zone.id;
                this.sourceBays = bays;
                break;
              }
            }
          }

          if (res.source_row_id && this.sourceBays.length) {
            const bay = this.sourceBays.find(
              (b: any) => b.id === res.source_row_id,
            );
            if (bay) {
              this.sourceRacks = bay.warehouseRack || [];
            }
          }

          if (res.source_shelf_id && this.sourceRacks.length) {
            const rack = this.sourceRacks.find(
              (r: any) => r.id === res.source_shelf_id,
            );
            if (rack) {
              this.sourceBins = rack.warehouseBin || [];
            }
          }

          this.createStockTransfer.patchValue({
            source_zone_id: matchedZoneId,
            source_row_id: res.source_row_id,
            source_shelf_id: res.source_shelf_id,
            source_section_id: res.source_section_id,
          });
          this.updateSourceValidators();
        });
    }

    if (res.target_warehouse_id) {
      this.inventory_services
        .getWarehouseByIdWithBifurcation(res.target_warehouse_id)
        .subscribe((respTarget: any) => {
          this.targetZones = respTarget.data?.zones || [];
          let matchedZoneId = null;

          if (res.target_row_id && this.targetZones.length) {
            for (const zone of this.targetZones) {
              const bays = zone.warehouseBay || [];
              if (bays.some((b: any) => b.id === res.target_row_id)) {
                matchedZoneId = zone.id;
                this.targetBays = bays;
                break;
              }
            }
          }

          if (res.target_row_id && this.targetBays.length) {
            const bay = this.targetBays.find(
              (b: any) => b.id === res.target_row_id,
            );
            if (bay) {
              this.targetRacks = bay.warehouseRack || [];
            }
          }

          if (res.target_shelf_id && this.targetRacks.length) {
            const rack = this.targetRacks.find(
              (r: any) => r.id === res.target_shelf_id,
            );
            if (rack) {
              this.targetBins = rack.warehouseBin || [];
            }
          }

          this.createStockTransfer.patchValue({
            target_zone_id: matchedZoneId,
            target_row_id: res.target_row_id,
            target_shelf_id: res.target_shelf_id,
            target_section_id: res.target_section_id,
          });
          this.updateTargetValidators();
        });
    }
  }

  onSourceWarehouseChange(warehouseId: any) {
    if (!warehouseId) {
      this.sourceZones = [];
      this.sourceBays = [];
      this.sourceRacks = [];
      this.sourceBins = [];
      this.createStockTransfer.patchValue({
        source_zone_id: null,
        source_row_id: null,
        source_shelf_id: null,
        source_section_id: null,
      });
      this.updateSourceValidators();
      return;
    }

    this.inventory_services
      .getWarehouseByIdWithBifurcation(warehouseId)
      .subscribe((res: any) => {
        this.sourceZones = res.data?.zones || [];
        this.sourceBays = [];
        this.sourceRacks = [];
        this.sourceBins = [];
        this.createStockTransfer.patchValue({
          source_zone_id: null,
          source_row_id: null,
          source_shelf_id: null,
          source_section_id: null,
        });
        this.updateSourceValidators();
      });
  }

  onTargetWarehouseChange(warehouseId: any) {
    if (!warehouseId) {
      this.targetZones = [];
      this.targetBays = [];
      this.targetRacks = [];
      this.targetBins = [];
      this.createStockTransfer.patchValue({
        target_zone_id: null,
        target_row_id: null,
        target_shelf_id: null,
        target_section_id: null,
      });
      this.updateTargetValidators();
      return;
    }

    this.inventory_services
      .getWarehouseByIdWithBifurcation(warehouseId)
      .subscribe((res: any) => {
        this.targetZones = res.data?.zones || [];
        this.targetBays = [];
        this.targetRacks = [];
        this.targetBins = [];
        this.createStockTransfer.patchValue({
          target_zone_id: null,
          target_row_id: null,
          target_shelf_id: null,
          target_section_id: null,
        });
        this.updateTargetValidators();
      });
  }

  onSourceSelectionChange(event: any) {
    const val = event.value;
    this.closeIcon = !!val;
    this.targetWarehouseList.forEach((element: any) => {
      element['hidden'] = element.id == val;
    });
    let target_warehouse_id = this.createStockTransfer.get(
      'target_warehouse_id',
    ).value;
    if (target_warehouse_id && val == target_warehouse_id) {
      this.createStockTransfer.get('target_warehouse_id').setValue(null);
      this.onTargetWarehouseChange(null);
    }
    this.onSourceWarehouseChange(val);
    this.loadAvailableItems(val);
  }

  onTargetSelectionChange(event: any) {
    const val = event.value;
    this.targetWarehouseCloseIcon = !!val;
    this.sourseWarehouseList.forEach((element: any) => {
      element['hidden'] = element.id == val;
    });
    let source_warehouse_id = this.createStockTransfer.get(
      'source_warehouse_id',
    ).value;
    if (source_warehouse_id && val == source_warehouse_id) {
      this.createStockTransfer.get('source_warehouse_id').setValue(null);
      this.onSourceWarehouseChange(null);
    }
    this.onTargetWarehouseChange(val);
  }

  onSourceZoneChange(zoneId: any) {
    this.sourceBays = [];
    this.sourceRacks = [];
    this.sourceBins = [];
    this.createStockTransfer.patchValue({
      source_row_id: null,
      source_shelf_id: null,
      source_section_id: null,
    });

    if (zoneId) {
      const zone = this.sourceZones.find((z) => z.id === zoneId);
      if (zone) {
        this.sourceBays = zone.warehouseBay || [];
      }
    }
    this.updateSourceValidators();
  }

  onSourceBayChange(bayId: any) {
    this.sourceRacks = [];
    this.sourceBins = [];
    this.createStockTransfer.patchValue({
      source_shelf_id: null,
      source_section_id: null,
    });

    if (bayId) {
      const bay = this.sourceBays.find((b) => b.id === bayId);
      if (bay) {
        this.sourceRacks = bay.warehouseRack || [];
      }
    }
    this.updateSourceValidators();
  }

  onSourceRackChange(rackId: any) {
    this.sourceBins = [];
    this.createStockTransfer.patchValue({
      source_section_id: null,
    });

    if (rackId) {
      const rack = this.sourceRacks.find((r) => r.id === rackId);
      if (rack) {
        this.sourceBins = rack.warehouseBin || [];
      }
    }
    this.updateSourceValidators();
  }

  onSourceBinChange(binId: any) {
    this.updateSourceValidators();
  }

  onTargetZoneChange(zoneId: any) {
    this.targetBays = [];
    this.targetRacks = [];
    this.targetBins = [];
    this.createStockTransfer.patchValue({
      target_row_id: null,
      target_shelf_id: null,
      target_section_id: null,
    });

    if (zoneId) {
      const zone = this.targetZones.find((z) => z.id === zoneId);
      if (zone) {
        this.targetBays = zone.warehouseBay || [];
      }
    }
    this.updateTargetValidators();
  }

  onTargetBayChange(bayId: any) {
    this.targetRacks = [];
    this.targetBins = [];
    this.createStockTransfer.patchValue({
      target_shelf_id: null,
      target_section_id: null,
    });

    if (bayId) {
      const bay = this.targetBays.find((b) => b.id === bayId);
      if (bay) {
        this.targetRacks = bay.warehouseRack || [];
      }
    }
    this.updateTargetValidators();
  }

  onTargetRackChange(rackId: any) {
    this.targetBins = [];
    this.createStockTransfer.patchValue({
      target_section_id: null,
    });

    if (rackId) {
      const rack = this.targetRacks.find((r) => r.id === rackId);
      if (rack) {
        this.targetBins = rack.warehouseBin || [];
      }
    }
    this.updateTargetValidators();
  }

  onTargetBinChange(binId: any) {
    this.updateTargetValidators();
  }

  updateSourceValidators() {
    const zoneCtrl = this.createStockTransfer.get('source_zone_id');
    const rowCtrl = this.createStockTransfer.get('source_row_id');
    const shelfCtrl = this.createStockTransfer.get('source_shelf_id');
    const sectionCtrl = this.createStockTransfer.get('source_section_id');

    if (this.sourceZones && this.sourceZones.length > 0) {
      zoneCtrl?.setValidators([Validators.required]);
    } else {
      zoneCtrl?.clearValidators();
    }
    zoneCtrl?.updateValueAndValidity();

    if (this.sourceBays && this.sourceBays.length > 0) {
      rowCtrl?.setValidators([Validators.required]);
    } else {
      rowCtrl?.clearValidators();
    }
    rowCtrl?.updateValueAndValidity();

    if (this.sourceRacks && this.sourceRacks.length > 0) {
      shelfCtrl?.setValidators([Validators.required]);
    } else {
      shelfCtrl?.clearValidators();
    }
    shelfCtrl?.updateValueAndValidity();

    if (this.sourceBins && this.sourceBins.length > 0) {
      sectionCtrl?.setValidators([Validators.required]);
    } else {
      sectionCtrl?.clearValidators();
    }
    sectionCtrl?.updateValueAndValidity();
  }

  updateTargetValidators() {
    const zoneCtrl = this.createStockTransfer.get('target_zone_id');
    const rowCtrl = this.createStockTransfer.get('target_row_id');
    const shelfCtrl = this.createStockTransfer.get('target_shelf_id');
    const sectionCtrl = this.createStockTransfer.get('target_section_id');

    zoneCtrl?.clearValidators();
    zoneCtrl?.updateValueAndValidity();
    rowCtrl?.clearValidators();
    rowCtrl?.updateValueAndValidity();
    shelfCtrl?.clearValidators();
    shelfCtrl?.updateValueAndValidity();
    sectionCtrl?.clearValidators();
    sectionCtrl?.updateValueAndValidity();
  }

  clearWarehouse() {
    this.closeIcon = false;
    this.createStockTransfer.get('source_warehouse_id').patchValue(null);
    this.onSourceWarehouseChange(null);
    this.loadAvailableItems(null);
  }

  clearTargetWarehouse() {
    this.targetWarehouseCloseIcon = false;
    this.createStockTransfer.get('target_warehouse_id').patchValue(null);
    this.onTargetWarehouseChange(null);
  }

  // Fallbacks for layout close click icons (if any)
  clearRow() {
    this.createStockTransfer.get('source_row_id').patchValue(null);
    this.onSourceBayChange(null);
  }
  clearTargetRow() {
    this.createStockTransfer.get('target_row_id').patchValue(null);
    this.onTargetBayChange(null);
  }
  clearSelf() {
    this.createStockTransfer.get('source_shelf_id').patchValue(null);
    this.onSourceRackChange(null);
  }
  clearTargetSelf() {
    this.createStockTransfer.get('target_shelf_id').patchValue(null);
    this.onTargetRackChange(null);
  }
  clearSection() {
    this.createStockTransfer.get('source_section_id').patchValue(null);
  }
  clearTargetSection() {
    this.createStockTransfer.get('target_section_id').patchValue(null);
  }

  warehouseFilter(e: any) {
    const aa = e;
    let filteredVariable = this.warehouseList3.filter((item: any) =>
      aa.includes(item.name),
    );
    this.sourseWarehouseList = filteredVariable;
  }

  targetWarehouseFilter(e: any) {
    const aa = e;
    let filteredVariable = this.targetWarehouseList3.filter((item: any) =>
      aa.includes(item.name),
    );
    this.targetWarehouseList = filteredVariable;
  }

  // Rest of calculations and items selection logic
  calculateValue(index: any) {
    let basicRate =
      this.createStockTransfer
        .get('item_details')
        ?.get(index.toString())
        ?.get('basic_rate')?.value || 0;
    let quantity =
      this.createStockTransfer
        .get('item_details')
        ?.get(index.toString())
        ?.get('quantity')?.value || 0;
    let value = basicRate * quantity;
    this.createStockTransfer
      .get('item_details')
      ?.get(index.toString())
      ?.get('value')
      ?.setValue(value);
  }

  itemCloseIcon: boolean[] = [];
  clearItem(i: number) {
    this.itemCloseIcon[i] = false;
    const controls = this.createStockTransfer.get('item_details') as FormArray;
    const itemControl = controls.at(i) as FormGroup;
    itemControl.patchValue({
      item_code: null,
      item_id: null,
      quantity: null,
      serial_ids: [],
      batch_no: null,
      manage_by: null,
    });
  }

  goBack() {
    this.location.back();
  }

  get stakeHoldersFormArray() {
    return this.createStockTransfer.get('item_details') as FormArray;
  }

  onChange(e: any) {
    let uploadedFileType = e.target.files[0].type
      .split('/')
      .pop()
      .toLowerCase();
    let isValidExtension = this.$common.checkForValidFile(
      e,
      false,
      true,
      false,
    );
    if (!isValidExtension)
      return this.createStockTransfer.value.file.setValue(null);
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0) || null;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath =
          uploadedFileType == 'pdf'
            ? '/assets/icons/pdfimg.png'
            : e.target.result;
      };
      reader.readAsDataURL(this.imageToUpload);
    }
    let formData = new FormData();
    formData.append('file', this.imageToUpload);

    this.recruitService.documentsUpdate(formData).subscribe((res: any) => {
      let fileUpload = res?.url;
      this.createStockTransfer.patchValue({
        uploadedFile: fileUpload,
      });
    });
  }

  addNewItem() {
    const details = this.createStockTransfer.get('item_details') as FormArray;
    details.push(this.createItemGroup());
  }

  createItemGroup(): FormGroup {
    return this.fb.group({
      item_id: new FormControl(null, [Validators.required]),
      quantity: new FormControl(null, [Validators.required]),
      item_code: new FormControl(null),
      serial_ids: new FormControl([]),
      serial_details: new FormControl([]),
      batch_no: new FormControl(null),
      manage_by: new FormControl(null),
    });
  }

  removeStakeHoldersRow(index: number): void {
    this.stakeHoldersFormArray.removeAt(index);
  }

  getItemDetail(data: any, index: number) {
    this.itemCloseIcon[index] = true;
    const controls = this.createStockTransfer.get('item_details') as FormArray;
    const itemControl = controls.at(index) as FormGroup;
    itemControl.patchValue({
      item_code: data.item_code,
      manage_by: data.manage_by,
      serial_ids: [],
      batch_no: null,
    });
  }

  openSerialSelection(index: number) {
    const sourceWarehouse = this.createStockTransfer.get(
      'source_warehouse_id',
    ).value;
    if (!sourceWarehouse) {
      this.toast.warning('Please select Source Warehouse first.');
      return;
    }
    const rowControl = this.createStockTransfer.get(
      'item_details',
    ) as FormArray;
    const itemGroup = rowControl.at(index) as FormGroup;
    const itemId = itemGroup.get('item_id')?.value;
    const qty = parseInt(itemGroup.get('quantity')?.value || 0);

    if (!itemId) {
      this.toast.warning('Please select an Item first.');
      return;
    }
    if (qty <= 0) {
      this.toast.warning('Please enter a valid Quantity first.');
      return;
    }

    // Lookup matching item details in active items list
    const selectedItem = this.itemsList.find((i: any) => i.id === itemId);
    const itemName = selectedItem ? selectedItem.item_name : '';
    const manageBy = itemGroup.get('manage_by')?.value || 'Batch Only';

    const dialogRef = this.mtdialog.open(SerialSelectionDialogComponent, {
      width: '650px',
      data: {
        item_id: itemId,
        item_name: itemName,
        quantity: qty,
        warehouse_id: sourceWarehouse,
        row_id: this.createStockTransfer.get('source_row_id').value,
        shelf_id: this.createStockTransfer.get('source_shelf_id').value,
        section_id: this.createStockTransfer.get('source_section_id').value,
        manageBy: manageBy,
        serial_ids: itemGroup.get('serial_ids')?.value,
        serial_details: itemGroup.get('serial_details')?.value || [],
        batch_no: itemGroup.get('batch_no')?.value,
        isReadOnly: this.actionType === 'view',
        stock_transfer_id: this.id,
      },
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        itemGroup.patchValue({
          serial_ids: res.serial_ids || [],
          serial_details: res.serial_details || [],
          batch_no: res.batch_no || null,
        });
        this.toast.success('Selection saved successfully.');
      }
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (Object as any)
      .values(formGroup.controls)
      .forEach((control: FormGroup<any>) => {
        control.markAsTouched();
        if (control.controls) {
          this.markFormGroupTouched(control);
        }
      });
  }

  onSubmitForm(status: string = 'Draft') {
    if (this.createStockTransfer.invalid) {
      this.markFormGroupTouched(this.createStockTransfer);
      return;
    }

    if (status === 'Submitted') {
      const items = this.createStockTransfer.get('item_details')?.value || [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (
          item.manage_by === 'S.No. Only' &&
          (!item.serial_ids || item.serial_ids.length !== Number(item.quantity))
        ) {
          this.toast.error(
            `Please select exactly ${item.quantity} serial numbers for item row ${i + 1}.`,
          );
          return;
        }
        if (item.manage_by === 'Batch Only' && !item.batch_no) {
          this.toast.error(`Please select a batch for item row ${i + 1}.`);
          return;
        }
      }
    }

    // Sanitize layout IDs: strip zone fields (not in DB schema) and null-out any falsy value
    const sanitizeId = (v: any) => (v && parseInt(v) > 0 ? parseInt(v) : null);

    const payload = {
      ...this.createStockTransfer.value,
      id: this.id || null,
      transfer_status: status,
      financial_year_id: this.financial_year_id,
      employee_id: localStorage.getItem('EmpMainId'),
      // Layout IDs — strip zone (not a DB column), sanitize row/shelf/section
      source_zone_id: undefined,
      target_zone_id: undefined,
      source_row_id: sanitizeId(
        this.createStockTransfer.get('source_row_id')?.value,
      ),
      source_shelf_id: sanitizeId(
        this.createStockTransfer.get('source_shelf_id')?.value,
      ),
      source_section_id: sanitizeId(
        this.createStockTransfer.get('source_section_id')?.value,
      ),
      target_row_id: sanitizeId(
        this.createStockTransfer.get('target_row_id')?.value,
      ),
      target_shelf_id: sanitizeId(
        this.createStockTransfer.get('target_shelf_id')?.value,
      ),
      target_section_id: sanitizeId(
        this.createStockTransfer.get('target_section_id')?.value,
      ),
    };
    // Remove undefined keys so they are not serialised
    Object.keys(payload).forEach(
      (k) => (payload as any)[k] === undefined && delete (payload as any)[k],
    );

    this.inventory_services
      .createStockTransferNew(payload, this.entity_id)
      .subscribe(
        (res: any) => {
          if (res) {
            this.toaster.success(res.message);
            this.router.navigate([
              'master/warehouse-management/stock-transfer',
            ]);
          }
        },
        (err: any) => {
          this.toaster.error(err?.error?.message || 'Something went wrong');
        },
      );
  }
}

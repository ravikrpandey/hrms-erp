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

const databaseKey: any = environment.servralUrl;
function noLeadingSpaces(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value && control.value.trimLeft() !== control.value) {
      return { leadingSpaces: true };
    }
    return null;
  };
}
@Component({
  selector: 'app-create-receive-stock-transfer',
  templateUrl: './create-receive-stock-transfer.component.html',
  styleUrls: ['./create-receive-stock-transfer.component.scss'],
})
export class CreateReceiveStockTransferComponent {
  createStockTransfer: any;
  file: any;
  itemsList: any;
  imageToUpload: any;
  imagePath: any;
  entity_id: any;
  warehouseList: any;
  randomId: any;
  targetWarehouseList: any;
  sourseWarehouseList: any;
  isView: boolean = false;
  financial_year_id: string | null;
  id: any;
  status: any;

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
      recieve_by: new FormControl(null),
      date_recieved: new FormControl(null),
      acknowledge: new FormControl(null),
      item_details: new FormArray([
        new FormGroup({
          item_id: new FormControl(null, [Validators.required]),
          quantity: new FormControl(null, [Validators.required]),
          item_code: new FormControl(null, [Validators.required]),
          damaged_qty: new FormControl(0, [Validators.required]),
          accepted_qty: new FormControl(null, [Validators.required]),
          batch_no: new FormControl(null),
          manage_by: new FormControl(null),
          serials_list: new FormControl([]),
        }),
      ]),
    });
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.acctivate.queryParams.subscribe((params: any) => {
      this.id = params.id;
      let type = params?.view;
      if (type === 'view') {
        this.isView = true;
      }
      this.inventory_services
        .getAllStockTransferById(this.id)
        .subscribe((resp: any) => {
          let res = resp.data;
          this.status = res.default_status;

          // Load layouts based on existing source/target
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
            recieve_by: res.received_by,
            date_recieved: res.date_received,
            acknowledge: res.acknowledged,
          });

          // Ensure itemsList is initialized
          if (!this.itemsList) {
            this.itemsList = [];
          }

          // Populate items list
          const detailsArray = this.stakeHoldersFormArray;
          detailsArray.clear();
          for (let i = 0; i < res.itemDetails.length; i++) {
            const itemDetail = res.itemDetails[i];
            const serials = itemDetail.serials || [];
            serials.forEach((s: any) => {
              s.isDamaged = s.status === 'DAMAGED';
            });

            const item_id_num = itemDetail.item_id ? Number(itemDetail.item_id) : null;
            if (item_id_num && !this.itemsList.some((item: any) => Number(item.id) === item_id_num)) {
              this.itemsList.push({
                id: item_id_num,
                item_name: itemDetail.item_name || 'Item Name',
                item_code: itemDetail.item_code,
                manage_by: itemDetail.manage_by || 'Batch Only'
              });
            }

            const control = this.fb.group({
              item_id: [item_id_num, Validators.required],
              quantity: [itemDetail.quantity, Validators.required],
              item_code: [itemDetail.item_code, Validators.required],
              damaged_qty: [
                itemDetail.damaged_qty || 0,
                Validators.required,
              ],
              accepted_qty: [
                itemDetail.accepted_qty || itemDetail.quantity,
                Validators.required,
              ],
              batch_no: [itemDetail.batch_no || null],
              manage_by: [itemDetail.manage_by || 'Batch Only'],
              serials_list: [serials],
            });
            detailsArray.push(control);
          }

          if (this.isView) {
            this.createStockTransfer.disable();
          }
        });
    });

    this.getItemMasterlist();
    this.getAllWarehouseList();
    this.generateRandomStockId();
  }

  getItemMasterlist() {
    this._configurationalMasterService.getAllItem().subscribe((res: any) => {
      this.itemsList = res.data;
    });
  }

  getAllWarehouseList() {
    this.inventory_services
      .getAllWarehouseList(this.entity_id, this.financial_year_id)
      .subscribe((response: any) => {
        this.warehouseList = response.data;
        this.targetWarehouseList = response.data;
        this.sourseWarehouseList = response.data;
      });
  }

  generateRandomStockId() {
    this.inventory_services
      .generateRandomStockId()
      .subscribe((response: any) => {
        this.randomId = response.data;
        this.createStockTransfer.get('random_id').setValue(this.randomId);
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
        });
    }
  }

  // Layout selection handers - read-only/informational during receipt, but helpful to map dynamically
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
      });
  }

  onSourceSelectionChange(event: any) {
    this.onSourceWarehouseChange(event.value);
  }

  onTargetSelectionChange(event: any) {
    this.onTargetWarehouseChange(event.value);
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
      if (zone) this.sourceBays = zone.warehouseBay || [];
    }
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
      if (bay) this.sourceRacks = bay.warehouseRack || [];
    }
  }

  onSourceRackChange(rackId: any) {
    this.sourceBins = [];
    this.createStockTransfer.patchValue({ source_section_id: null });
    if (rackId) {
      const rack = this.sourceRacks.find((r) => r.id === rackId);
      if (rack) this.sourceBins = rack.warehouseBin || [];
    }
  }

  onSourceBinChange(binId: any) {}

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
      if (zone) this.targetBays = zone.warehouseBay || [];
    }
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
      if (bay) this.targetRacks = bay.warehouseRack || [];
    }
  }

  onTargetRackChange(rackId: any) {
    this.targetBins = [];
    this.createStockTransfer.patchValue({ target_section_id: null });
    if (rackId) {
      const rack = this.targetRacks.find((r) => r.id === rackId);
      if (rack) this.targetBins = rack.warehouseBin || [];
    }
  }

  onTargetBinChange(binId: any) {}

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

  toggleSerialStatus(itemIndex: number, serialIndex: number) {
    if (this.isView) return;
    const itemDetails = this.createStockTransfer.get(
      'item_details',
    ) as FormArray;
    const itemGroup = itemDetails.at(itemIndex) as FormGroup;
    const serialsList = itemGroup.get('serials_list')?.value || [];

    const serial = serialsList[serialIndex];
    serial.isDamaged = !serial.isDamaged;

    const damagedQty = serialsList.filter((s: any) => s.isDamaged).length;
    const totalQty = parseInt(itemGroup.get('quantity')?.value || 0);

    itemGroup.patchValue({
      damaged_qty: damagedQty,
      accepted_qty: totalQty - damagedQty,
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

  validateItems(data: any) {
    for (let item of data) {
      const quantity = parseInt(item.quantity || 0);
      const damaged_qty = parseInt(item.damaged_qty || 0);
      const accepted_qty = parseInt(item.accepted_qty || 0);
      if (accepted_qty + damaged_qty !== quantity) {
        return false;
      }
    }
    return true;
  }

  getItemDetail(data: any, index: number) {
    const controls = this.createStockTransfer.get('item_details') as FormArray;
    const itemControl = controls.at(index) as FormGroup;
    itemControl.patchValue({
      item_code: data.item_code
    });
  }

  calculateValue(index: any) {
    // No-op for receipt component
  }

  onSubmitForm() {
    if (this.createStockTransfer.invalid) {
      this.markFormGroupTouched(this.createStockTransfer);
      return this.toast.error('Required Field Should be Empty');
    }
    const isValid = this.validateItems(
      this.createStockTransfer?.value?.item_details,
    );
    if (isValid) {
      this.createStockTransfer.value.id = this.id;
      const payload = {
        ...this.createStockTransfer.value,
        financial_year_id: this.financial_year_id,
        employee_id: localStorage.getItem('EmpMainId'),
      };
      this.inventory_services
        .createReceivedStockTransfer(payload, this.entity_id)
        .subscribe(
          (res: any) => {
            if (res) {
              this.toaster.success(res.message);
              this.router.navigate([
                '/master/warehouse-management/receive-stock-transfer',
              ]);
            }
          },
          (err: any) => {
            this.toaster.error(err?.error?.message || 'Something went wrong');
          },
        );
    } else {
      return this.toast.error(
        'Validation failed for item, Accepted + Damaged quantities must equal the total Quantity.',
      );
    }
  }
}

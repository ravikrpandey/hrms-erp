import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
  FormArray,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

import {
  Rack,
  BulkStorage,
  Bay,
  Bin,
  Zone,
} from '../../interface/bifurcation.interface';

@Component({
  selector: 'app-setup-warehouse-bifurcation',
  templateUrl: './setup-warehouse-bifurcation.component.html',
  styleUrls: ['./setup-warehouse-bifurcation.component.scss'],
})
export class SetupWarehouseBifurcationComponent {
  form: FormGroup;
  getAllCat: any[] = [];
  zoneTypes: any[] = [];

  id: any;
  rackExpanded: boolean[][] = [];
  shelfExpanded: boolean[][][] = [];
  binExpanded: boolean[][][][] = [];
  zoneExpanded: { [zoneIndex: number]: boolean } = {};
  selectedZoneType: string = '';

  totalArea = 0;
  zoneSize = 0;
  showRacks: boolean = true;
  showBulkStorage: boolean = false;

  rackss: Rack[] = [];
  selectedRackIndex = 0;

  bulk!: BulkStorage;

  constructor(
    private inventoryService: InventoryManagementService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private _configurationalMasterService: ConfigurationalmasterService,
  ) {
    this.form = this.fb.group({
      // Warehouse Details
      warehouse_id: [null],
      warehouse_name: [null],
      warehouse_code: [null],
      address: [null],
      area: [null],
      //
      zones: this.fb.array([]),

      // totalArea: ['', Validators.required],
      // zoneType: ['', Validators.required],
      // dimentions: [''],
      // zone_size: [''],
      // bulk_zone_area: [null],
      // stack_height: [null],
      // zone_status: [null],
      // racks: this.fb.array([]),

      // total_storage_capacity: new FormControl(null),
      // weight_limit: new FormControl(null),
      // rack_capacity: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.getAllCategory();
    this.getZoneTypes();
    this.activeroute.queryParams.subscribe((res: any) => {
      this.id = res.id;
      this.form.get('warehouse_id')?.setValue(this.id);
      this.getByWarehouseBifurcation(this.id);
    });
  }

  getAllCategory() {
    this._configurationalMasterService.getAssetMasterList().subscribe(
      (res: any) => {
        this.getAllCat = res.data?.filter(
          (item: any) => item.asset_category_name != 'Service',
        );
      },
      (err: any) => {
        console.error(err);
        this.toast.error('Unable to load category');
      },
    );
  }

  getZoneTypes() {
    this._configurationalMasterService.zoneTypeList().subscribe(
      (res: any) => {
        this.zoneTypes = res.data;
      },
      (err) => {
        this.toast.error('Unable to load Sub Location types');
      },
    );
  }

  getByWarehouseBifurcation(id: any) {
    this.inventoryService
      .getWarehouseByIdWithBifurcation(id)
      .subscribe((res: any) => {
        const data = res.data;
        this.form.patchValue({
          warehouse_name: data.name,
          warehouse_code: data.code,
          address: data.address,
          area: data.area,
        });

        this.patchData(data.zones);
      });
  }

  patchData(zoneData: Zone[]) {
    this.zones.clear();
    zoneData.forEach((zone, zoneIndex) => {
      const zoneGroup = this.createZoneFormGroup(zone);

      this.zones.push(zoneGroup);

      const warehouseBay = zoneGroup.get('warehouseBay') as FormArray;
      zone.warehouseBay?.forEach((bay: Bay, bayIndex: number) => {
        const bayGroup = this.createBayFormGroup(bay);

        warehouseBay.push(bayGroup);

        const warehouseRack = bayGroup.get('warehouseRack') as FormArray;

        bay.warehouseRack?.forEach((rack: Rack, rackIndex: number) => {
          const rackGroup = this.createRackFormGroup(rack);

          warehouseRack.push(rackGroup);
          const warehouseBin = rackGroup.get('warehouseBin') as FormArray;

          rack.warehouseBin?.forEach((bin: Bin, binIndex: number) => {
            const binGroup = this.createBinFormGroup(bin);

            warehouseBin.push(binGroup);
          });
        });
      });
    });
  }

  get zones(): FormArray {
    return this.form.get('zones') as FormArray;
  }

  private createZoneFormGroup(zone?: Zone): FormGroup {
    return this.fb.group({
      name: [zone?.name || null, Validators.required],
      area: [zone?.area || null, Validators.required],
      zone_type_id: [zone?.zone_type_id || null, Validators.required],
      item_category: [zone?.item_category || null, Validators.required],
      status: [zone?.status || null],
      bulk_status: [zone?.bulk_status || null],
      id: [zone?.id || null],
      warehouseBay: this.fb.array([]),
    });
  }

  addZone(): void {
    const fb = this.createZoneFormGroup();
    this.zones.push(fb);
    // this.setValueChanges();
  }

  removeZone(index: number): void {
    this.zones.removeAt(index);
  }

  // Bay Form
  private createBayFormGroup(bay?: Bay): FormGroup {
    const group = this.fb.group({
      id: [bay?.id || null],
      name: [bay?.name || null, [Validators.required]],
      area: [bay?.area || null, [Validators.required]],
      volume: [bay?.volume || null],
      item_category: [bay?.item_category || null, [Validators.required]],
      zone_id: [bay?.zone_id || null],
      status: [bay?.status || null],
      warehouseRack: this.fb.array([]),
    });

    return group;
  }

  getBayFormArray(zoneIndex: number): FormArray {
    const zone = this.zones.at(zoneIndex) as FormGroup;
    return zone.get('warehouseBay') as FormArray;
  }

  addNewBay(zoneIndex: number): void {
    const newBayGroup = this.createBayFormGroup();
    this.getBayFormArray(zoneIndex).push(newBayGroup);
  }

  removeBayAt(zoneIndex: number, bayIndex: number): void {
    const bayArray = this.getBayFormArray(zoneIndex);
    bayArray.removeAt(bayIndex);
  }

  // Rack Form
  private createRackFormGroup(rack?: Rack): FormGroup {
    const group = this.fb.group({
      id: [rack?.id || null],
      name: [rack?.name || null, [Validators.required]],
      area: [rack?.area || null, [Validators.required]],
      volume: [rack?.volume || null],
      item_category: [rack?.item_category || null, [Validators.required]],
      bay_id: [rack?.bay_id || null],
      status: [rack?.status || null],
      warehouseBin: this.fb.array([]),
    });

    return group;
  }

  getRackFormArray(zoneIndex: number, bayIndex: number): FormArray {
    const bay = this.getBayFormArray(zoneIndex).at(bayIndex) as FormGroup;
    return bay.get('warehouseRack') as FormArray;
  }

  addNewRack(zoneIndex: number, bayIndex: number): void {
    const newRackGroup = this.createRackFormGroup();
    this.getRackFormArray(zoneIndex, bayIndex).push(newRackGroup);
  }

  removeRackAt(zoneIndex: number, bayIndex: number, rackIndex: number): void {
    const rackArray = this.getRackFormArray(zoneIndex, bayIndex);
    rackArray.removeAt(rackIndex);
  }

  //  Bin Form
  private createBinFormGroup(bin?: Bin): FormGroup {
    const group = this.fb.group({
      id: [bin?.id || null],
      name: [bin?.name || null, [Validators.required]],
      area: [bin?.area || null, [Validators.required]],
      item_category: [bin?.item_category || null, [Validators.required]],
      volume: [bin?.volume || null],
      rack_id: [bin?.rack_id || null],
      status: [bin?.status || null],
    });

    return group;
  }

  getBinFormArray(
    zoneIndex: number,
    bayIndex: number,
    rackIndex: number,
  ): FormArray {
    const rack = this.getRackFormArray(zoneIndex, bayIndex).at(
      rackIndex,
    ) as FormGroup;
    return rack.get('warehouseBin') as FormArray;
  }

  addNewBin(zoneIndex: number, bayIndex: number, rackIndex: number): void {
    const newBinGroup = this.createBinFormGroup();
    this.getBinFormArray(zoneIndex, bayIndex, rackIndex).push(newBinGroup);
  }

  removeBinAt(
    zoneIndex: number,
    bayIndex: number,
    rackIndex: number,
    binIndex: number,
  ): void {
    const binArray = this.getBinFormArray(zoneIndex, bayIndex, rackIndex);
    binArray.removeAt(binIndex);
  }
  //

  getSelectedZoneType(zoneIndex: number) {
    const typeId = this.zones.at(zoneIndex).get('zone_type_id')?.value;
    return this.zoneTypes.find((type) => type.id === typeId);
  }

  onSubmit() {
    let val = this.form.getRawValue();
    console.log(val);

    if (this.form.invalid) {
      this.toast.error('Please fill all the required fields');
      return;
    }

    this.inventoryService.createWarehousebifurcation(val).subscribe(
      (res: any) => {
        this.toast.success(res.message);
        this.router.navigate([
          'master/warehouse-management/warehouse-bifurcation',
        ]);
      },
      (err) => {
        this.toast.error(err.error.message);
      },
    );
  }
}

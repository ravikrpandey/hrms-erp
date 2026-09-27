import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InventoryManagementService } from 'src/app/@modules/ware-house-management/inventory-management.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';

@Component({
  selector: 'app-create-warehouse',
  templateUrl: './create-warehouse.component.html',
  styleUrls: ['./create-warehouse.component.scss']
})
export class CreateWarehouseComponent implements OnInit {
  form: FormGroup;
  getAllWareHouseType: any[] = [];
  managerData: any[] = [];
  postOffice: any[] = [];
  locationData: any[] = [];
  addressData: any;
  mode: string = "";
  warehouse_id: string = "";
  warehouseData: any;

  constructor(
    private inventoryService: InventoryManagementService,
    private _empRegistration: EmpRegistrationService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private activeroute: ActivatedRoute,
    private commonService: CommonService,
    private accessCtrl: AccessControlService
  ) {
    this.form = this.fb.group({
      warehouse_name: new FormControl(null, Validators.required),
      code: new FormControl(null),
      warehouse_type_id: new FormControl(null, Validators.required),
      pin: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[0-9]{6}$'),
      ]),
      address: new FormControl(null),
      manager_id: new FormControl(null, Validators.required),
      inOut: new FormControl(null, Validators.required),
      postal_address: new FormControl(null),
      gst_number: new FormControl(null),
      pan_number: new FormControl(null),
      warehouse_license_number: new FormControl(null),
      location_id: new FormControl(null),
      area: new FormControl(null, Validators.required),
      entity_id: new FormControl(this.accessCtrl.getEntityId()),
      financial_year_id: new FormControl(this.accessCtrl.getFinancialId())
    });

  }

  ngOnInit() {
    this.activeroute.queryParams.subscribe((res: any) => {
      if (res.id) {
        this.mode = res.mode;
        this.warehouse_id = res.id;
        this.getWarehouseByidNew(this.warehouse_id);
        if (this.mode === 'view') {
          this.form.disable();
        }
      }
    });

    this.form
      .get('pin')!
      .setValidators([Validators.required, Validators.pattern('^[0-9]{6}$')]);

    this.form.get('pin')!.updateValueAndValidity();

    this.form
      .get('pin')!
      .valueChanges.pipe() // Adjust debounce time as needed (e.g., 300ms)
      .subscribe((value: any) => {
        if (value && value.length === 6) {
          this.commonService.getPostOfficeByPincode(value).subscribe(
            (response: any) => {
              this.postOffice = response.PostOffice || [];
              const postalFromBackend = this.warehouseData.postal_address;
              const matchedPostOffice = this.postOffice.find(
                (post) =>
                  post.Pincode === postalFromBackend.Pincode &&
                  post.Name === postalFromBackend.Name // optionally match more fields
              );

              this.form.patchValue({
                postal_address: matchedPostOffice,
              });
            },
            (error: HttpErrorResponse) => {
              console.error(error);
            }
          );
        }
      });

    this.getWareHouseType();
    this.getManagerList();
  }

  postalAddressChanged(selectedPost: any) {
    this.addressData = selectedPost;
    this.form.patchValue({
      location_id: selectedPost?.Block,
    });
  }

  getWarehouseByidNew(id: string) {
    this.inventoryService.getWarehouseByidNew(id).subscribe((res: any) => {
      if (res && res.data) {
        this.warehouseData = res.data;
        if (this.warehouse_id) {
          this.locationSave();
        }

        this.form.patchValue({
          area: this.warehouseData.area,
          warehouse_name: this.warehouseData.name,
          address: this.warehouseData.address,
          manager_id: this.warehouseData.manager_id,
          location_id: this.warehouseData.location_id,
          inOut: this.warehouseData.inOut,
          pan_number: this.warehouseData.pan_tin,
          warehouse_license_number: this.warehouseData.license_number,
          gst_number: this.warehouseData.gst,
          code: this.warehouseData.code,
          warehouse_type_id: this.warehouseData.warehouse_type_id,
          pin: this.warehouseData.pin,
          postal_address: this.warehouseData.postal_address,
          entity_id: this.warehouseData.entity_id,
          financial_year_id: this.warehouseData.financial_year_id
        });
      }
    });
  }

  getManagerList() {
    this._empRegistration
      .warehouseEmployeeList()
      .subscribe(
        (res: any) => {
          this.managerData = (res.data || []).map((row: any) => ({
            ...row,
            full_name: `${row.first_name || ''} ${row.last_name || ''} [${row.role_master_name || ''}]`.trim()
          })).sort((a: { full_name: string; }, b: { full_name: any; }) => a.full_name.localeCompare(b.full_name));
          if (this.warehouseData) {
            this.form.patchValue({
              manager_id: this.warehouseData.manager_id
            });
          }
        },
        (err) => {
          console.error('Error fetching warehouse employees', err);
          this.managerData = [];
        }
      );
  }

  getWareHouseType() {
    this.inventoryService.getWarehouse_type().subscribe((res: any) => {
      if (res && res.data) {
        this.getAllWareHouseType = res.data;
        if (this.getAllWareHouseType.length > 0) {
          const selectedType = this.getAllWareHouseType.filter((item: any) => item.warehouse_type_name.toLowerCase().includes('mother'));
          this.form.get('warehouse_type_id')?.setValue(selectedType[0].id);
        }
      }
    });
  }

  locationSave() {
    let data = {
      state:
        this.addressData?.State || this.warehouseData?.postal_address?.State,
      city:
        this.addressData?.District ||
        this.warehouseData?.postal_address?.District,
    };

    this.inventoryService.findLocation(data).subscribe((res: any) => {
      if (res && res.data) {
        this.locationData = res.data;
        if (this.warehouse_id && this.warehouseData) {
          this.form.patchValue({
            location_id: this.warehouseData.location_id
          });
        }
      }
    });
  }

  onSubmitForm() {
    let val = this.form.value;
    if (this.form.invalid) {
      this.toast.error('All Filed Are Required');
      return;
    }

    let data = {
      warehouse_name: val?.warehouse_name,
      address: val?.address,
      pin: Number(val?.pin),
      manager_id: val?.manager_id,
      gst: val?.gst_number,
      pan_tin: val?.pan_number,
      license_number: val?.warehouse_license_number,
      // entity_id: this.entity_id,
      // financial_year_id: this.financial_year_id,
      inOut: val?.inOut,
      location_id: val?.location_id,
      postal_address: val?.postal_address,
      area: val?.area || null,
      code: null
    };
    if (this.warehouse_id) {
      data.code = this.warehouseData?.code;
      this.inventoryService.updateWarehouse(this.warehouse_id, data).subscribe(
        (res: any) => {
          this.toast.success(res.message);
          this.router.navigate(['master/warehouse-management/warehouse']);
        },
        (err) => {
          if (err.status == 400) {
            this.toast.error('Something went Wrong!');
          } else {
            this.toast.error(err.error?.message || 'Error in submission!');
          }
        }
      );
    } else {
      this.inventoryService.createWarehouse(data).subscribe(
        (res: any) => {
          this.toast.success(res.message);
          this.router.navigate(['master/warehouse-management/warehouse']);
        },
        (err) => {
          if (err.status == 400) {
            this.toast.error('Something went Wrong!');
          } else {
            // this.toast.error('Error in submission!');
            this.toast.error(err.error?.message || 'Error in submission!');
          }
        }
      );
    }
  }
}

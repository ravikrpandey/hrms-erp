import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminSupportService } from 'src/app/@shared/services/admin-support.service';
import { AssetManagementService } from 'src/app/@shared/services/asset-management.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';

@Component({
  selector: 'app-product-asset-create',
  templateUrl: './product-asset-create.component.html',
  styleUrls: ['./product-asset-create.component.scss']
})
export class ProductAssetCreateComponent {
  status = [
    { id: 1, name: 'ACTIVE' },
    { id: 2, name: 'INACTIVE' },
  ];

  productupdateForm: FormGroup;
  de_allocate: boolean = false;
  scrap_asset: boolean = false;
  assign_asset: boolean = false;
  return_date: boolean = false;
  id: any;
  catData: any;
  vendorData: any;
  singleEmpData: any;
  scrap_fields: boolean;
  scrap_type: any;
  getSingleData: any;
  empdata: any;

  constructor(
    private route: Router,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private assetService: AssetManagementService,
    private activeroute: ActivatedRoute,
    private prService: PurchaseRequestService,
    private vendorService: VendorManagementService,
    private adminService: AdminSupportService,

  ) {
    this.productupdateForm = this.fb.group({
      select_category: new FormControl(null, [Validators.required]),
      asset_name: new FormControl(null, [Validators.required]),
      asset_description: new FormControl(null, [Validators.required]),
      purchased_date: new FormControl(null),
      vendor_name: new FormControl(null, [Validators.required]),
      purchased_cost: new FormControl(null),
      asset_ID: new FormControl(null),
      serial_number: new FormControl(null),
      assigned_date: new FormControl(null),
      assigned_to: new FormControl(null),
      assigned_by: new FormControl(null),
      scrap_type: new FormControl(null),
      scrap_date: new FormControl(null),
      asset_status: new FormControl(null, [Validators.required]),
      return_date: new FormControl(null),
      remark: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit() {
    var empData: any = localStorage.getItem('signInUser');
    this.singleEmpData = JSON.parse(empData);
    this.productupdateForm.patchValue({
      assigned_by: this.singleEmpData.first_name,
    });

    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.asset_management_id;
    });

    this.assetService
      .get_ById_Asset_Management(this.id)
      .subscribe((res: any) => {
        this.getSingleData = res.data;
        this.productupdateForm.patchValue({
          select_category: this.getSingleData?.select_category,
          asset_name: this.getSingleData?.asset_name,
          asset_description: this.getSingleData?.asset_description,
          purchased_date: this.getSingleData?.purchased_date,
          vendor_name: this.getSingleData?.vendor_name,
          purchased_cost: this.getSingleData?.purchased_cost,
          asset_ID: this.getSingleData?.asset_ID,
          serial_number: this.getSingleData?.serial_number,
          assigned_date: this.getSingleData?.assigned_date,
          assigned_to: this.getSingleData?.assigned_to,
          assigned_by: this.getSingleData?.assigned_by,
          scrap_type: this.getSingleData?.scrap_type,
          scrap_date: this.getSingleData?.scrap_date,
          asset_status: this.getSingleData?.asset_status,
          return_date: this.getSingleData?.return_date,
          remark: this.getSingleData?.remark,
        });
      });

    this.getAllCategory();
    this.getAllVerifyVendors();
    this.getScrapType();
    
    this.adminService.getAllEmp().subscribe((res: any) => {
      this.empdata = res.data;
    });
  }

  onStatusChange(e: any) {
    let statusvalue = e.value;
    
    if (statusvalue == 'Assigned') {
      this.de_allocate = true;
      this.scrap_asset = false;
      this.assign_asset = false;
      this.return_date = false;
      this.scrap_fields = false;
    }

    if (statusvalue == 'Open') {
      this.de_allocate = false;
      this.scrap_asset = true;
      this.assign_asset = true;
      this.return_date = true;
      this.scrap_fields = false;
    }

    if (statusvalue == 'Issue') {
      this.de_allocate = false;
      this.scrap_asset = true;
      this.assign_asset = false;
      this.return_date = false;
      this.scrap_fields = false;
    }

    if (statusvalue == 'Lost') {
      this.de_allocate = true;
      this.scrap_asset = true;
      this.assign_asset = false;
      this.return_date = false;
      this.scrap_fields = false;
    }

    if (statusvalue == 'Dispossed/Scraped') {
      this.de_allocate = false;
      this.scrap_asset = true;
      this.assign_asset = false;
      this.return_date = false;
      this.scrap_fields = true;
    }
  }

  onCancel(path: any) {
    this.route.navigate([path]);
  }

  onSubmit() {
    if (this.productupdateForm.invalid) {
      this.toastr.error('Required fields should not be empty', 'Fields Error');
      
      return;
    }

    let value = this.productupdateForm.value;
    this.assetService.crateProductAsset(value).subscribe((res: any) => {
      
      if (res.code == 200) this.toastr.success(res.massege);
      this.route.navigate([
        'master/itticket/configurational-master/product-asset-master',
      ]);
    });
  }

  getAllCategory() {
    this.prService.getAllCategory().subscribe((res: any) => {
      this.catData = res.data;
    });
  }

  getAllVerifyVendors() {
    this.vendorService.getAllVerifyVendor().subscribe((res: any) => {
      this.vendorData = res.data;
    });
  }

  onUpdate() {
    let value = this.productupdateForm.value;
    this.assetService
      .updateProductAsset(this.id, value)
      .subscribe((res: any) => {
        
        if (res.code == 200){
          this.toastr.success(res.message);
        } 
        this.route.navigate([
          'master/itticket/configurational-master/product-asset-master',
        ]);
      });
  }

  getScrapType() {
    this.assetService.getScrapType().subscribe((res: any) => {
      this.scrap_type = res.data;
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CrmService } from 'src/app/@shared/services/crm/crm.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';

import { ProductionService } from 'src/app/@shared/services/production/production.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment';
import { SalesService } from 'src/app/@modules/sales/service/sales.service';
import { MatDialog } from '@angular/material/dialog';
import { DispatchDialogComponent } from '../dispatch-dialog/dispatch-dialog.component';
import { InventoryManagementService } from '../../inventory-management.service';
import { SchemeDialogComponent } from 'src/app/@modules/crm/pages/proposal/scheme-dialog/scheme-dialog.component';
import * as moment from 'moment';

@Component({
  selector: 'app-dispatched-product',
  templateUrl: './dispatched-product.component.html',
  styleUrls: ['./dispatched-product.component.scss'],
})
export class DispatchedProductComponent implements OnInit {
  productList: any[] = [];
  filterproduct: any[] = [];
  categoryList: any[] = [];
  filterCategory: any[] = [];
  isView: boolean = false;
  entityId: any;
  proposalTypeList: any = ['B2B', 'B2C', 'EXPORT'];
  gstTypeList: any = ['CGST/SGST', 'IGST'];
  formDisabled: boolean = false;
  frmSalesOrder: FormGroup;
  type_existing: any;
  hideTableColumns: boolean;
  isSOStatus: boolean = false;
  salesId: any;
  financial_year_id: any;
  actionType: any;
  proposalId: any;
  version_id: any;
  status: any;
  customer_type: any;
  leadId: any;
  client_id: any;
  schemeData: any;
  customisation_branding_date: any;
  
  constructor(
    private _fb: FormBuilder,
    private _active: ActivatedRoute,
    private router: Router,
    private $miscellaneousService: MiscellaneousService,
    private $common: CommonService,
    private matDialog: MatDialog,
    private $crm: CrmService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _empRegistration: EmpRegistrationService,
    private salesService: SalesService,
    private inventoryServices: InventoryManagementService,
    private $productionService: ProductionService,
    private toster: ToastrService,
    private toast: ToastrService
  ) {}
  ngOnInit() {
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    this.frmSalesOrder = this._fb.group({
      sales_order_no: [, [Validators.required]],
      sales_order_date: [, [Validators.required]],
      elan_sales_order_no: [, [Validators.required]],
      elan_so_date: [, [Validators.required]],
      proposal_no: [],
      proposal_type: [],
      dispatched_date: [],
      company_name: [],
      contact_person_name: [],
      contact_number: [],
      mail_id: [],
      source_name: [],
      gst_no: [],
      grant_total: [],
      remark: [],
      customisation_branding_date: [],
      discount: [],
      igst: [],
      notes: [],
      terms_and_conditions: [],
      totalAMTAfterDiscount: [],
      schemeData: [],
      customisation_data: [],
      branding_data: [],
      customisation: [],
      select_scheme: [],
      custom_branding: [],
      product_master_name: [],
      expected_delivery_date: [],
      expected_dispatch_date: [],
      promo_item: [],
      apply_scheme: [],
      // items: this._fb.array([this.createItems()]),
      // chargeDetailList: this._fb.array([this.chargeDetail()]),
      deliveryAddress: []
    });
    // this.getAllCategory(0);
    // this.getHsnCode();
    // this.generateSalesOrderNO(this.financial_year_id);

    this._active.queryParams.subscribe({
      next: (res: any) => {
        this.status = res?.status;
        this.isSOStatus = this.status == 'dispatch' ? true : false;
        console.log(res);
        if (res?.sales_id) {
          this.proposalId = res?.proposal_id;
          this.salesId = res?.sales_id;
          this.getSOByid(res?.sales_id);
        }
      },
      error: (err) => {
        this.toster.error(err.error.message);
      },
    });

  }
  
  // uploadedFile: any;
  // uploadDoc(event: any) {
  //   try {
  //     let isValidExtension = this.$common.checkForValidFile(
  //       event,
  //       false,
  //       true,
  //       false
  //     );
  //     if (!isValidExtension) {
  //       return;
  //     }

  //     const formData = new FormData();
  //     if (event.target.files && event.target.files[0]) {
  //       formData.append('file', event.target.files[0]);
  //     }

  //     this.$miscellaneousService.documents(formData).subscribe(
  //       (response: any) => {
  //         if (response) {
  //           this.uploadedFile = `uploaded_files/${response?.url}`;
  //           this.toster.success('Document uploaded successfully');
  //         }
  //       },
  //       (err) => {
  //         console.log(err);
  //       }
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  // viewImg1() {
  //   window.open(environment.servralUrl + '/' + this.uploadedFile, '_blank');
  // }

  handleFormDisabled() {
    if (this.salesId && this.actionType != 'edit') {
      this.formDisabled = true;
    }
  }

  keyPress(event: KeyboardEvent) {
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

  proposalSelection(e: any) {
    if (e.value === 'EXPORT') {
      this.hideTableColumns = true;
    } else {
      this.hideTableColumns = false;
    }
  }

  customerId: number;
  getAllProductDetails: any;
  getSOByid(id: any) {
    this.salesService.getSOByid(id).subscribe((res: any) => {
      let obj = res.data;
      this.getAllProductDetails = obj?.productDetailList;

      if (res) {
        let data = res.data;
        this.customisation_branding_date = data?.customisation_branding_date;
        this.frmSalesOrder.patchValue({
          sales_order_no: data?.sales_order_no,
          sales_order_date: data?.sales_order_date,
          elan_sales_order_no: data?.elan_sales_order_no,
          elan_so_date: data?.elan_so_date,
          notes: data?.notes,
          dispatched_date: data?.dispatched_date,
          expected_delivery_date: data?.expected_delivery_date,
          expected_dispatch_date: data?.expected_dispatch_date,
          terms_and_conditions: data?.terms_and_conditions,
          contact_person_name: data?.contact_person_name,
          proposal_no: data?.proposal_no,
          contact_number: data?.contact_number,
          company_name: data?.company_name,
          deliveryAddress: data?.deliveryAddress,
          mail_id: data?.mail_id,
          remark: data?.remark,
          customisation_branding_date: data?.customisation_branding_date,
          proposal_type: data?.proposal_type,
          grant_total: data?.grant_total,
          totalAMTAfterDiscount: data?.totalAMTAfterDiscount,
          discount: data?.discount,
          igst: data?.igst,
          schemeData: obj?.productDetailList[0]?.scheme_id,
        });
        this.version_id = data?.version_id;
      }
    });
  }

  updateSO() {
    let data = this.frmSalesOrder.value;

    let formData = {
      remark: data.remark,
      customisation_branding_date: moment(
        data.customisation_branding_date
      ).format('YYYY-MM-DD'),
    };

    this.inventoryServices.applyCustBranding(formData, this.salesId).subscribe({
      next: (res: any) => {
        this.toster.success(res.message);
        this.router.navigate(['/master/warehouse-management/dispatch']);
      },
      error: (err) => {
        console.log(err);
        this.toster.error(err.error.message);
      },
    });
    console.log(formData);
  }

  getChildItems(parentId: number) {
    return this.getAllProductDetails.filter(
      (item: any) => item.parent_item_id === parentId
    );
  }
}

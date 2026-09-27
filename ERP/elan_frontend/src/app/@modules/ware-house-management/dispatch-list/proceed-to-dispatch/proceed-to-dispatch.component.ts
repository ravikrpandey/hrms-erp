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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-proceed-to-dispatch',
  templateUrl: './proceed-to-dispatch.component.html',
  styleUrls: ['./proceed-to-dispatch.component.scss'],
})
export class ProceedToDispatchComponent implements OnInit {
  productList: any[] = [];
  filterproduct: any[] = [];
  categoryList: any[] = [];
  filterCategory: any[] = [];
  isView: boolean = false;
  entityId: any;
  minDate: any;
  proposalTypeList: any = ['B2B', 'B2C', 'EXPORT'];
  gstTypeList: any = ['CGST/SGST', 'IGST'];
  formDisabled: boolean = false;
  frmSalesOrder: FormGroup;
  type_existing: any;
  hideTableColumns: boolean;
  isSOStatus: boolean = false;
  isCustomisation: boolean = false;
  salesId: any;
  financial_year_id: any;
  actionType: any;
  proposalId: any;
  status: any;
  customer_type: any;
  leadId: any;
  client_id: any;
  schemeData: any;
  isDispatchExceeded = false;

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
      product_master_name: [],
      promo_item: [],
      expected_delivery_date: [],
      expected_dispatch_date: [],
      reason: [],
      apply_scheme: [],
      // items: this._fb.array([this.createItems()]),
      // chargeDetailList: this._fb.array([this.chargeDetail()]),
      deliveryAddress:[]
    });

    // Subscribe to both date fields to react to any changes
    this.frmSalesOrder
      .get('expected_dispatch_date')
      ?.valueChanges.subscribe(() => {
        this.checkDispatchVsDelivery();
      });

    this.frmSalesOrder
      .get('expected_delivery_date')
      ?.valueChanges.subscribe(() => {
        this.checkDispatchVsDelivery();
      });

    // this.getAllCategory(0);
    // this.getHsnCode();
    // this.generateSalesOrderNO(this.financial_year_id);

    this._active.queryParams.subscribe({
      next: (res: any) => {
        this.status = res?.status;
        this.isSOStatus = this.status == 'dispatch' ? true : false;
        this.isCustomisation = this.status == 'customisation' ? true : false;
        console.log(res);
        if (res?.sales_id) {
          this.salesId = res?.sales_id;
          this.getSOByid(res?.sales_id);
        }
      },
      error: (err) => {
        this.toster.error(err.error.message);
      },
    });

    // this.getAllScheme();
  }

  checkDispatchVsDelivery() {
    const dispatchDate = this.frmSalesOrder.get(
      'expected_dispatch_date'
    )?.value;
    const deliveryDate = this.frmSalesOrder.get(
      'expected_delivery_date'
    )?.value;
    const reasonCtrl = this.frmSalesOrder.get('reason');

    if (dispatchDate && deliveryDate) {
      const dispatch = new Date(dispatchDate);
      const delivery = new Date(deliveryDate);

      if (dispatch > delivery) {
        // Dispatch after delivery → Reason required
        reasonCtrl?.setValidators([Validators.required]);
        this.isDispatchExceeded = true;
      } else {
        // Valid case → remove required
        reasonCtrl?.clearValidators();
        this.isDispatchExceeded = false;
      }
      reasonCtrl?.updateValueAndValidity();
    }
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

        this.frmSalesOrder.patchValue({
          sales_order_no: data?.sales_order_no,
          sales_order_date: data?.sales_order_date,
          elan_sales_order_no: data?.elan_sales_order_no,
          elan_so_date: data?.elan_so_date,
          notes: data?.notes,
          dispatched_date: data?.dispatched_date,
          terms_and_conditions: data?.terms_and_conditions,
          contact_person_name: data?.contact_person_name,
          proposal_no: data?.proposal_no,
          contact_number: data?.contact_number,
          company_name: data?.company_name,
          mail_id: data?.mail_id,
          expected_delivery_date: data?.expected_delivery_date,
          expected_dispatch_date: data?.expected_dispatch_date,
          remark: data?.remark,
          customisation_branding_date: data?.customisation_branding_date,
          proposal_type: data?.proposal_type,
          grant_total: data?.grant_total,
          totalAMTAfterDiscount: data?.totalAMTAfterDiscount,
          discount: data?.discount,
          igst: data?.igst,
          schemeData: obj?.productDetailList[0]?.scheme_id,
          deliveryAddress: obj?.deliveryAddress
        });
      }
    });
  }
  
  // serialNoList: any[] = [];
  // openDispatchDialog(item: any) {
  //   let dialogRef = this.matDialog.open(DispatchDialogComponent, {
  //     width: '1000px',
  //     height: '600px',
  //     data: item,
  //   });

  //   dialogRef.afterClosed().subscribe({
  //     next: (result: any) => {
  //       if (result) {
  //         let count = 0;
  //         let itemIds = result.data.serialNo[0].item_id;
  //         this.serialNoList.forEach((x: any) => {
  //           if (x.item_id === result.data.serialNo[0].item_id) {
  //             count = count + 1;
  //           }
  //         });
  //         if (count === result.data.serialNo.length) {
  //           const swalWithBootstrapButtons = Swal.mixin({
  //             customClass: {
  //               confirmButton: 'btn btn-success',
  //               cancelButton: 'btn btn-danger',
  //             },
  //             buttonsStyling: false,
  //           });
  //           swalWithBootstrapButtons
  //             .fire({
  //               title: 'Are you sure?',
  //               text: 'Serial no already assigned !',
  //               icon: 'warning',
  //               showCancelButton: true,
  //               confirmButtonText: 'Replace',
  //               cancelButtonText: 'Skip',
  //               reverseButtons: true,
  //             })
  //             .then((results) => {
  //               if (results.isConfirmed) {
  //                 this.serialNoList = this.serialNoList.filter(
  //                   (item: any) => item.item_id !== itemIds
  //                 );
  //                 this.serialNoList.push(...result.data.serialNo);
  //                 swalWithBootstrapButtons.fire({
  //                   title: 'Replace!',
  //                   text: 'Serial no. has been replace.',
  //                   icon: 'success',
  //                 });
  //               } else if (results.dismiss === Swal.DismissReason.cancel) {
  //                 swalWithBootstrapButtons.fire({
  //                   title: 'Skip',
  //                   text: 'Serial no is safe',
  //                   icon: 'error',
  //                 });
  //               }
  //             });
  //         } else {
  //           this.serialNoList.push(...result.data.serialNo);
  //         }
  //         console.log(
  //           'Dialog resultserialNoListserialNoListserialNoListserialNoListserialNoList:',
  //           this.serialNoList
  //         );
  //       } else {
  //         console.log('Dialog was closed without saving.');
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Dialog closed with error:', err);
  //     },
  //   });
  // }

  // proceedToDispatch() {
  //   let formData = {
  //     is_proceed_to_dispatched: true,
  //   };

  //   this.inventoryServices
  //     .proceedToDispatched(formData, this.salesId)
  //     .subscribe({
  //       next: (res: any) => {
  //         console.log(res);
  //         this.toster.success(res.message);
  //         this.router.navigate(['/master/warehouse-management/dispatch']);
  //       },
  //       error: (err) => {
  //         console.log(err);
  //         this.toster.error(err.error.message);
  //       },
  //     });
  //   console.log(formData);
  // }

  createSalesOrder() {
    let frmData = this.frmSalesOrder.value.items;
    // const hasMissingSerial = frmData.some((item: any) => {
    //   return !this.serialNoList.some(
    //     (x: any) => x.item_id === item.product_master_id
    //   );
    // });

    if (
      !this.frmSalesOrder.value.expected_delivery_date ||
      !this.frmSalesOrder.value.expected_dispatch_date
    ) {
      this.toster.warning(
        'Expected delivery date and expected dispatch date is required '
      );
      return;
    }

    if(this.isDispatchExceeded && !this.frmSalesOrder.value.reason) {
      this.toster.warning(
        'Reason is required due to dispatch date is exceeded delivery date.'
      );
      return;
    }
    let formData = {
      customer_id: this.customerId || this.salesId,
      financial_id: this.financial_year_id,
      entity_id: this.entityId,
      sales_order_id: this.salesId,
      ...this.frmSalesOrder.value,
      // serialNoList: this.serialNoList,
      is_proceed_to_dispatched: true,
      isDispatchExceeded: this.isDispatchExceeded
    };

    formData.expected_delivery_date = moment(
      this.frmSalesOrder.value.expected_delivery_date
    ).format('YYYY-MM-DD');
    formData.expected_dispatch_date = moment(
      this.frmSalesOrder.value.expected_dispatch_date
    ).format('YYYY-MM-DD');
    // console.log(formData,"____ABBABA");
    // return;
    this.inventoryServices.dispatchedOrder(formData).subscribe({
      next: (res: any) => {
        console.log(res);
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
  
  // updateSO() {
  //   console.log(this.frmSalesOrder.value);

  //   let data = this.frmSalesOrder.value;

  //   let formData = {
  //     remark: data.remark,
  //     customisation_branding_date: moment(
  //       data.customisation_branding_date
  //     ).format('YYYY-MM-DD'),
  //   };

  //   this.inventoryServices.applyCustBranding(formData, this.salesId).subscribe({
  //     next: (res: any) => {
  //       console.log(res);
  //       this.toster.success(res.message);
  //       this.router.navigate(['/master/warehouse-management/dispatch']);
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.toster.error(err.error.message);
  //     },
  //   });
  //   console.log(formData);
  // }

  getChildItems(parentId: number) {
    return this.getAllProductDetails.filter(
      (item: any) => item.parent_item_id === parentId
    );
  }
}

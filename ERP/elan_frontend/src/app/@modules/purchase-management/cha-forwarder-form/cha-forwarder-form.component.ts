import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-cha-forwarder-form',
  templateUrl: './cha-forwarder-form.component.html',
  styleUrls: ['./cha-forwarder-form.component.scss'],
})
export class ChaForwarderFormComponent implements OnInit {
  @ViewChild('billContent') billContent!: ElementRef;
  formGroup!: FormGroup;
  forwarderForm!: FormGroup;
  formGroupFor!: FormGroup;
  order_id: any;
  page: any;
  pageMode: any;
  data: any;
  modeKeys: string[] = [];
  BOEData: any;
  totalVariance: number = 0;
  isBOECompleted: boolean = false;
  isItemsCompleted: boolean = false;
  isCHACompleted: boolean = false;
  buttonHide: boolean = false;
  buttonHideFor: boolean = false;
  uploadedFiles: string[] = [];
  folderName: string = 'cha_documents';
  company: any = {};
  billDownloadHide: boolean = false;
  forwarderRoadId: Number = 0;
  billDownloadHideForwarder: boolean = true;
  forData: any;
  billName: string = 'CUSTOMS HOUSE AGENT (CHA) BILL';
  gatePassId: string = '';
  currencyList: any[] = [];

  constructor(
    public toasterSer: ToastrService,
    private _ActiveRoute: ActivatedRoute,
    private prService: PurchaseRequestService,
    private fb: FormBuilder,
    private transport_service: TransportManagementService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private configMaster: ConfigurationalmasterService,
  ) {
    this.formGroup = this.fb.group({
      boe_id: [''],
      boe_number: ['', Validators.required],
      boe_date: ['', Validators.required],
      exchange_rate: ['', Validators.required],
      invoice_amount: ['', Validators.required],
      freight_charges: [0],
      insurance_charges: [0],
      assessable_value: ['', Validators.required],
      duty_percent: [0],
      duty_amount: [0],
      items: this.fb.array([]),
      variance_remark: [''],
      cha_service_charges: ['', Validators.required],
      cha_other_charges: ['', Validators.required],
      file: ['', Validators.required],
    });

    this.formGroupFor = this.fb.group({
      freight_charges: ['', Validators.required],
      loading_unloading_charges: [null],
      port_to_warehouse_charges: ['', Validators.required],
      vehicle_number: ['', Validators.required],
      driver_name: ['', Validators.required],
      driver_mobile: ['', Validators.required],
      transporter_name: ['', Validators.required],
      lr_number: ['', Validators.required],
    });

    this.forwarderForm = this.fb.group({
      road: this.fb.group({
        vehicle_number: [''],
        driver_name: [''],
        driver_mobile: ['', [Validators.pattern(/^[0-9+\s\-]{7,15}$/)]],
        transporter_name: [''],
        lr_number: [''],
        pickup_location: [''],
        delivery_location: [''],
      }),

      air: this.fb.group({
        airline_name: [''],
        flight_number: [''],
        awb_number: [''],
        awb_date: [null],
        departure_airport: [''],
        arrival_airport: [''],
        etd: [null],
        eta: [null],
        total_packages: [null, Validators.min(0)],
        gross_weight: [null, Validators.min(0)],
        chargeable_weight: [null, Validators.min(0)],
        freight_type: ['PREPAID'],
        freight_forwarder: [''],
      }),

      sea: this.fb.group({
        vessel_name: [''],
        voyage_number: [''],
        shipping_line: [''],

        port_of_loading: [''],
        port_of_discharge: [''],
        final_destination: [''],

        containers: this.fb.array([
          this.fb.group({
            container_number: [''],
            container_type: ['20FT'],
            seal_number: [''],
          }),
        ]),

        bl_number: [''],
        bl_date: [null],
        bl_type: ['Original'],

        etd: [null],
        eta: [null],

        total_packages: [null, Validators.min(0)],
        gross_weight: [null, Validators.min(0)],
        volume: [null, Validators.min(0)],

        freight_type: ['Prepaid'],
        ocean_freight: [null, Validators.min(0)],
        currency_id: [null],
        forwarder: [''],
      }),
    });

    this.company = {
      name: 'Elan Professional Appliances Pvt. Ltd.',
      address:
        'Tower-2, DLF Corporate Greens, 802, Sector 74A, Gurugram, Haryana 122004',
      phone: '9999000011',
      email: 'info@elanpro.com',
      gstin: '09ABCDE1234F1Z5',
    };
  }

  ngOnInit(): void {
    this.getCurrencyList();
    this._ActiveRoute.queryParams.subscribe((res: any) => {
      this.order_id = res.id;
      this.page = res.page;
      this.pageMode = res.mode;
      this.billDownloadHide = this.pageMode === 'view';

      if (
        (this.page === 'CHA' && this.pageMode === 'view') ||
        (this.page === 'TRANSPORT' && this.pageMode === 'edit')
      ) {
        this.billName = 'CUSTOMS HOUSE AGENT (CHA) INVOICE';
      } else if (this.page === 'TRANSPORT' && this.pageMode === 'view') {
        this.billName = 'CONSOLIDATED CHA & TRANSPORT INVOICE';
      }

      if (this.order_id) {
        this.getData();
      }
    });

    // Watch changes on freight, insurance, duty %
    this.formGroup
      .get('freight_charges')!
      .valueChanges.subscribe(() => this.calculateAssessable());
    this.formGroup
      .get('insurance_charges')!
      .valueChanges.subscribe(() => this.calculateAssessable());
    this.formGroup
      .get('duty_percent')!
      .valueChanges.subscribe(() => this.calculateDuty());

    this.gatePassId = this.generateGatePassId();
  }

  calculateAssessable() {
    const invoiceAmount =
      Number(this.formGroup.get('invoice_amount')!.value) || 0;
    const freight = Number(this.formGroup.get('freight_charges')!.value) || 0;
    const insurance =
      Number(this.formGroup.get('insurance_charges')!.value) || 0;

    const assessable = invoiceAmount + freight + insurance;
    this.formGroup
      .get('assessable_value')!
      .setValue(assessable, { emitEvent: false });

    // Recalculate duty if duty % already there
    this.calculateDuty();
  }

  calculateDuty() {
    const assessable =
      Number(this.formGroup.get('assessable_value')!.value) || 0;
    const dutyPercent = Number(this.formGroup.get('duty_percent')!.value) || 0;

    const dutyAmount = (assessable * dutyPercent) / 100;
    this.formGroup
      .get('duty_amount')!
      .setValue(dutyAmount, { emitEvent: false });
  }

  get items(): FormArray {
    return this.formGroup.get('items') as FormArray;
  }

  get seaContainers(): FormArray {
    return this.forwarderForm.get('sea.containers') as FormArray;
  }

  addContainer(): void {
    this.seaContainers.push(
      this.fb.group({
        container_number: [''],
        container_type: ['20FT'],
        seal_number: [''],
      }),
    );
  }

  removeContainer(index: number): void {
    if (this.seaContainers.length > 1) {
      this.seaContainers.removeAt(index);
    }
  }

  getData() {
    this.prService.getCHAForwarderData(this.order_id).subscribe(
      (res: any) => {
        this.data = res.data;
        if (res.data.vendor_category === 'Domestic') {
          this.billName = 'CONSOLIDATED TRANSPORTER INVOICE';
        }

        if (this.data?.modeData) {
          this.modeKeys = Object.keys(this.data.modeData);
        }

        const restrictedStatus = [
          'CHA_BILL_GENERATED',
          'OUT_FOR_DELIVERY',
          'RECEIVED',
        ];

        this.buttonHide = restrictedStatus.includes(this.data?.audit);

        const restrictedStatusFor = ['OUT_FOR_DELIVERY', 'RECEIVED'];

        this.buttonHideFor = restrictedStatusFor.includes(this.data?.audit);

        let BOE = this.data?.BOEDetails;
        let amtDetails = this.data?.amtDetails;

        this.formGroup.patchValue({
          exchange_rate: amtDetails.exchange_rate,
          invoice_amount: amtDetails.invoice_amount,
          assessable_value: BOE
            ? BOE.assessable_value
            : amtDetails.invoice_amount,
        });

        // clone BOE original object
        let BOEToPatch = { ...BOE };

        // remove keys only from patch object
        delete BOEToPatch.exchange_rate;
        delete BOEToPatch.invoice_amount;
        this.BOEData = BOE;

        if (BOE) {
          this.formGroup.patchValue({
            ...BOEToPatch,
            boe_id: BOE.id,
            variance_remark: this.data?.variance_remark,
            cha_service_charges: this.data?.cha_service_charges,
            cha_other_charges: this.data?.cha_other_charges,
          });
          this.isBOECompleted = true;
          this.isItemsCompleted =
            this.data?.audit === 'ITEMS_CLAIM' ||
            this.data?.audit === 'CHA_APPROVED'
              ? true
              : false;
          this.isCHACompleted = this.data?.cha_service_charges ? true : false;
        }

        this.setItems(this.data.itemList);
        this.setRemarkValidation();

        let forDetails = this.data?.ForDetails;
        this.forData = forDetails;
        this.forwarderRoadId = forDetails?.id;
        this.formGroupFor.patchValue({
          ...forDetails,
          freight_charges: this.data?.freight_charges,
          loading_unloading_charges: this.data?.loading_unloading_charges,
          port_to_warehouse_charges: this.data?.port_to_warehouse_charges,
        });

        // Patch forwarderForm details for sea, air, or road modes
        if (this.data?.modeData) {
          const mode = this.data.mode?.toLowerCase();
          if (mode === 'sea') {
            const modeGroup = this.forwarderForm.get('sea') as FormGroup;
            if (modeGroup) {
              const containersFormArray = modeGroup.get(
                'containers',
              ) as FormArray;
              while (containersFormArray.length) {
                containersFormArray.removeAt(0);
              }

              let containersList: any[] = [];
              if (this.data.modeData.containers) {
                try {
                  containersList = JSON.parse(this.data.modeData.containers);
                } catch (e) {
                  containersList = [];
                }
              }

              if (
                !Array.isArray(containersList) ||
                containersList.length === 0
              ) {
                const numbers = (this.data.modeData.container_number || '')
                  .split(',')
                  .map((s: string) => s.trim());
                const types = (this.data.modeData.container_type || '')
                  .split(',')
                  .map((s: string) => s.trim());
                const seals = (this.data.modeData.seal_number || '')
                  .split(',')
                  .map((s: string) => s.trim());

                const maxLen = Math.max(
                  numbers.length,
                  types.length,
                  seals.length,
                  1,
                );
                for (let i = 0; i < maxLen; i++) {
                  containersList.push({
                    container_number: numbers[i] || '',
                    container_type: types[i] || '20FT',
                    seal_number: seals[i] || '',
                  });
                }
              }

              for (let i = 0; i < containersList.length; i++) {
                containersFormArray.push(
                  this.fb.group({
                    container_number: [
                      containersList[i].container_number || '',
                    ],
                    container_type: [
                      containersList[i].container_type || '20FT',
                    ],
                    seal_number: [containersList[i].seal_number || ''],
                  }),
                );
              }

              modeGroup.patchValue({
                vessel_name: this.data.modeData.vessel_name || '',
                voyage_number: this.data.modeData.voyage_number || '',
                shipping_line: this.data.modeData.shipping_line || '',
                port_of_loading: this.data.modeData.port_of_loading || '',
                port_of_discharge: this.data.modeData.port_of_discharge || '',
                final_destination: this.data.modeData.final_destination || '',
                bl_number: this.data.modeData.bl_number || '',
                bl_date: this.data.modeData.bl_date || null,
                bl_type: this.data.modeData.bl_type || 'Original',
                etd: this.data.modeData.etd || null,
                eta: this.data.modeData.eta || null,
                total_packages: this.data.modeData.total_packages || null,
                gross_weight: this.data.modeData.gross_weight || null,
                volume: this.data.modeData.volume || null,
                freight_type: this.data.modeData.freight_type || 'Prepaid',
                ocean_freight: this.data.modeData.ocean_freight || null,
                currency_id: this.data.modeData.currency_id || null,
                forwarder: this.data.modeData.forwarder || '',
              });
            }
          } else if (mode === 'air' || mode === 'road') {
            this.forwarderForm.get(mode)?.patchValue(this.data.modeData);
          }
        }

        // Disable forms if in view mode
        if (this.pageMode === 'view') {
          this.forwarderForm.disable();
          this.formGroup.disable();
          this.formGroupFor.disable();
        }
      },
      (err: any) => {
        this.data = [];
      },
    );
  }

  // Header format
  formatKey(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Value format
  formatValue(key: string, value: any): any {
    if (!value) return '-';

    // date format
    if (
      key.toLowerCase().includes('date') ||
      key === 'createdAt' ||
      key.toLowerCase().includes('eta') ||
      key.toLowerCase().includes('etd')
    ) {
      return new Date(value).toLocaleDateString('en-GB'); // DD-MM-YYYY
    }

    return value;
  }

  setItems(data: any[]) {
    const itemArray = this.fb.array(
      data.map((item) =>
        this.fb.group({
          id: [item.id],
          name: [item.itemName],
          qty: [item.quantity],
          shipping_alert_id: [item.shipping_alert_id],
          item_master_id: [item.item_master_id],
          po_item_id: [item.po_item_id],
          claim_qty: [
            item.claim_qty ?? item.quantity,
            [
              Validators.required,
              Validators.min(0),
              Validators.max(item.quantity),
            ],
          ],
        }),
      ),
    );

    this.formGroup.setControl('items', itemArray);

    this.calculateVariance();
  }

  onClaimChange(index: number) {
    const item = this.items.at(index);

    let claimQty = item.get('claim_qty')?.value;
    const shippedQty = item.get('qty')?.value;

    if (claimQty < 0) {
      item.get('claim_qty')?.setValue(0);
    }

    if (claimQty > shippedQty) {
      item.get('claim_qty')?.setValue(shippedQty);
      this.toasterSer.warning(
        'Claimed quantity cannot exceed shipped quantity!',
      );
    }

    this.calculateVariance();
    this.setRemarkValidation();
  }

  calculateVariance() {
    this.totalVariance = this.items.controls.reduce((sum, ctrl) => {
      const qty = ctrl.get('qty')?.value || 0;
      const claim = ctrl.get('claim_qty')?.value || 0;
      return sum + (qty - claim);
    }, 0);
  }

  setRemarkValidation() {
    const remark = this.formGroup.get('variance_remark');

    if (this.totalVariance > 0) {
      remark?.setValidators([Validators.required]);
    } else {
      remark?.clearValidators();
    }

    remark?.updateValueAndValidity();
  }

  approveBOE() {
    this.removeChargesValidation();

    if (
      this.formGroup.get('boe_number')?.invalid ||
      this.formGroup.get('boe_date')?.invalid ||
      this.formGroup.get('exchange_rate')?.invalid ||
      this.formGroup.get('invoice_amount')?.invalid ||
      this.formGroup.get('assessable_value')?.invalid
    ) {
      this.toasterSer.warning('Please fill all required fields!');
      return;
    }

    const payload = {
      id: this.formGroup.value.boe_id,
      boe_number: this.formGroup.value.boe_number,
      boe_date: this.formGroup.value.boe_date,
      exchange_rate: this.formGroup.value.exchange_rate,
      invoice_amount: this.formGroup.value.invoice_amount,
      freight_charges: this.formGroup.value.freight_charges,
      insurance_charges: this.formGroup.value.insurance_charges,
      assessable_value: this.formGroup.value.assessable_value,
      duty_percent: this.formGroup.value.duty_percent,
      duty_amount: this.formGroup.value.duty_amount,
      shipping_alert_id: this.order_id,
    };

    this.prService.createOrUpdateBOE(payload).subscribe(
      (res: any) => {
        this.formGroup.patchValue({
          boe_id: res.id,
        });
        this.isBOECompleted = true;
        this.toasterSer.success(res.message);
      },
      (err: any) => {
        this.toasterSer.warning('Something went wrong. please try again!');
      },
    );
  }

  approveItems() {
    this.removeChargesValidation();
    this.setRemarkValidation();

    if (this.items.invalid) {
      this.toasterSer.warning('Please fill claimed qty!');
      return;
    } else if (this.formGroup.get('variance_remark')?.invalid) {
      this.toasterSer.warning('Please fill variance remark fields!');
      return;
    }

    const payload = this.items.value.map((item: any) => ({
      ...item,
      variance_remark: this.formGroup.value.variance_remark,
    }));

    this.prService.claimItemsCHA(payload).subscribe(
      (res: any) => {
        this.isItemsCompleted = true;
        this.toasterSer.success(res.message);
      },
      (err: any) => {
        this.toasterSer.warning('Something went wrong. please try again!');
      },
    );
  }

  onFileSelected(event: any) {
    const files = Array.from(event.target.files);

    files.forEach((file: any) => {
      const formData = new FormData();
      formData.append('file', file);

      this.transport_service
        .uploaddocuments(formData, this.folderName, true)
        .subscribe(
          (res: any) => {
            this.toasterSer.success('Your file has been uploaded successfully');
            res.url.forEach((file: string) => {
              this.uploadedFiles.push(file);
            });
          },
          (err: any) => {
            this.toasterSer.warning('File upload failed. please try again!');
          },
        );
    });
  }

  removeChargesValidation() {
    this.formGroup.get('cha_other_charges')?.clearValidators();
    this.formGroup.get('cha_service_charges')?.clearValidators();
    this.formGroup.get('file')?.clearValidators();
    this.updateValidation();
  }

  applyChargesValidation() {
    this.formGroup
      .get('cha_other_charges')
      ?.setValidators([Validators.required]);
    this.formGroup
      .get('cha_service_charges')
      ?.setValidators([Validators.required]);
    this.formGroup.get('file')?.setValidators([Validators.required]);
    this.updateValidation();
  }

  updateValidation() {
    this.formGroup.get('cha_other_charges')?.updateValueAndValidity();
    this.formGroup.get('cha_service_charges')?.updateValueAndValidity();
    this.formGroup.get('file')?.updateValueAndValidity();
  }

  approveCHA() {
    this.setRemarkValidation();
    this.applyChargesValidation();

    if (
      this.formGroup.get('cha_service_charges')?.invalid ||
      this.formGroup.get('cha_other_charges')?.invalid
    ) {
      this.toasterSer.warning('Please fill all required fields!');
      return;
    }

    const isCHAExists = this.data?.docList?.some(
      (doc: { entryType: string }) => doc.entryType === 'CHA',
    );

    if (!isCHAExists) {
      if (!this.uploadedFiles || this.uploadedFiles.length === 0) {
        this.toasterSer.warning('Please upload at least one document!');
        return;
      }
    }

    const payload = {
      id: this.order_id,
      cha_service_charges: this.formGroup.value.cha_service_charges,
      cha_other_charges: this.formGroup.value.cha_other_charges,
      documentsArray: this.uploadedFiles,
    };

    this.prService.updateCHACharges(payload).subscribe(
      (res: any) => {
        this.isCHACompleted = true;
        this.toasterSer.success(res.message);
        this.getData();
      },
      (err: any) => {
        this.toasterSer.warning('Something went wrong. please try again!');
      },
    );
  }

  getFileName(file: string): string {
    return file.split('-').slice(1).join('-');
  }

  viewFile(fileName: string) {
    const baseUrl =
      environment.servralUrl + '/uploaded_files/' + this.folderName + '/';
    const url = baseUrl + fileName;
    window.open(url, '_blank');
  }

  removeFile(index: number, id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This document will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No',
    }).then((result) => {
      // IF NO
      if (!result.isConfirmed) return;

      // loader show
      Swal.fire({
        title: 'Deleting...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // API call
      this.prService.deleteCHADocument(id).subscribe(
        (res: any) => {
          this.data.docList.splice(index, 1);
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Document has been removed',
            timer: 1500,
            showConfirmButton: false,
          });
        },
        (err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err?.error?.message || 'Something went wrong',
          });
        },
      );
    });
  }

  CHABillGenerate() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Please confirm you have checked everything. After bill generation, no changes will be allowed.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Generate Bill',
      cancelButtonText: 'No',
      allowOutsideClick: false,
      allowEscapeKey: false,
      preConfirm: () => {
        // return promise → popup will wait
        return this.prService
          .generateCHABill({ id: this.order_id })
          .toPromise()
          .then((res: any) => {
            return res;
          })
          .catch((err) => {
            Swal.showValidationMessage(
              'Something went wrong. Please try again!',
            );
          });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.toasterSer.success(result.value.message);
        this.router.navigate(['master/purchase-management/cha-list']);
      }
    });
  }

  forwardUpdate() {
    const formData = this.forwarderForm.getRawValue();
    const charges = this.formGroupFor.value;

    const payload = {
      shipping_alert_id: this.order_id,
      mode: this.data?.mode,
      sea: formData.sea,
      air: formData.air,
      road: formData.road,
      freight_charges: charges.freight_charges,
      loading_unloading_charges: charges.loading_unloading_charges,
      port_to_warehouse_charges: charges.port_to_warehouse_charges,
      buttonAction: 'FORWARDER',
    };

    this.prService.createOrUpdateForwarder(payload).subscribe(
      (res: any) => {
        this.toasterSer.success(
          res.message || 'Details & Charges updated successfully',
        );
        this.router.navigate(['master/purchase-management/forwarder-list']);
      },
      (err: any) => {
        this.toasterSer.warning('Something went wrong. Please try again!');
      },
    );
  }

  actionForwarder(buttonAction: any) {
    const formValues = this.formGroupFor.value;

    const payload = {
      id: this.forwarderRoadId,
      ...formValues,
      shipping_alert_id: this.order_id,
      entryType: this.page,
      buttonAction: buttonAction,
    };

    // Draft
    if (buttonAction === 'draft') {
      const hasValue = Object.values(formValues).some(
        (val: any) => val !== null && val !== '' && val !== 0,
      );

      if (!hasValue) {
        this.toasterSer.warning(
          'Please fill at least one field before saving draft!',
        );
        return;
      }

      Object.keys(this.formGroupFor.controls).forEach((field) => {
        this.formGroupFor.get(field)?.clearValidators();
        this.formGroupFor.get(field)?.updateValueAndValidity();
      });

      this.callForwarderAPI(payload); // 👈 single place API call
    }

    // OUT FOR DELIVERY
    else {
      Object.keys(this.formGroupFor.controls).forEach((field) => {
        this.formGroupFor.get(field)?.setValidators([Validators.required]);
        this.formGroupFor.get('loading_unloading_charges')?.clearValidators();
        this.formGroupFor.get(field)?.updateValueAndValidity();
      });

      if (this.formGroupFor.invalid) {
        this.formGroupFor.markAllAsTouched();
        this.toasterSer.warning('Please fill all required fields!');
        return;
      }

      Swal.fire({
        title: 'Are you sure?',
        text: 'Please confirm all details are correct. After this, no changes will be allowed.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Continue',
        cancelButtonText: 'No',
        allowOutsideClick: false,
        showLoaderOnConfirm: true,

        preConfirm: () => {
          return this.callForwarderAPI(payload, true); // 👈 same API function
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.forwarderRoadId = result.value.id;
          this.toasterSer.success(result.value.message);
          this.router.navigate(['master/purchase-management/forwarder-list']);
        }
      });
    }
  }

  callForwarderAPI(payload: any, isPromise = false) {
    if (isPromise) {
      return this.prService
        .createOrUpdateForwarder(payload)
        .toPromise()
        .catch(() => {
          Swal.showValidationMessage('Something went wrong. Please try again!');
        });
    } else {
      this.prService.createOrUpdateForwarder(payload).subscribe(
        (res: any) => {
          this.forwarderRoadId = res.id;
          this.toasterSer.success(res.message);
        },
        () => {
          this.toasterSer.warning('Something went wrong. please try again!');
        },
      );
    }
  }

  // PDF Download
  downloadPDF() {
    this.billDownloadHide = true;

    const isForwarder = this.page === 'TRANSPORT';
    const isViewMode = this.pageMode === 'view';

    this.billDownloadHideForwarder = isForwarder && isViewMode;

    this.cd.detectChanges();

    setTimeout(() => {
      const data = this.billContent.nativeElement;

      html2canvas(data, {
        scale: 1.2,
        useCORS: true,
        logging: false,
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 0.6);

        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = 210;
        const pageHeight = 295;

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        let pdfName =
          this.data.vendor_category === 'Domestic'
            ? 'CONSOLIDATED_TRANSPORTER'
            : this.page;

        pdf.save(`${pdfName}_INVOICE-${this.data?.shiped_no}.pdf`);

        this.billDownloadHide = isViewMode;
        this.billDownloadHideForwarder = true;

        this.cd.detectChanges();
      });
    }, 100);
  }

  getCurrencyList() {
    this.configMaster.CurrencyList().subscribe({
      next: (res: any) => {
        this.currencyList = res.data;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  generateGatePassId(): string {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `${random}`;
  }
}

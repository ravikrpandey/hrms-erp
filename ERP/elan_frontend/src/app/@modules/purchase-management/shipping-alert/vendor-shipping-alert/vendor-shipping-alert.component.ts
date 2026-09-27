import { getCurrencySymbol } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormControl,
} from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CryptoService } from 'src/app/@shared/services/crypto/crypto.service';

// ── Cross-field validator: arrival must be after shipment date ───────────────
function arrivalAfterShipment(group: AbstractControl): ValidationErrors | null {
  const ship = group.get('shipment_date')?.value;
  const arr = group.get('expected_arrival')?.value;
  if (ship && arr && new Date(arr) < new Date(ship)) {
    return { arrivalBeforeShipment: true };
  }
  return null;
}

import { Subscription } from 'rxjs';
import { PurchaseMasterService } from 'src/app/@modules/itticketing/configurationalmaster/purchase-masters/services/purchase-master.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { environment } from 'src/app/environments/environment';

export interface ShipmentItem {
  item_master_id: string;
  item_name: string;
  item_code: string;
  // total_mvp:string;
  quantity: number;
  shipped_quantity: number;
  remaining_quantity: number;
  // unit_price:string;
}
@Component({
  selector: 'app-vendor-shipping-alert',
  templateUrl: './vendor-shipping-alert.component.html',
  styleUrls: ['./vendor-shipping-alert.component.scss'],
})
export class VendorShippingAlertComponent implements OnInit {
  po_id: any;
  vendor_id: any;
  po_id_header: any;
  vendor_id_header: any;
  type: any;
  shipped: boolean = false;
  // ── Tab state ─────────────────────────────────────────────────────────────
  activeTab = 0;
  folderName: string = 'cha_documents';
  currencySymbols: any;
  currencyCode: string = 'INR';
  // ── Form ────────────────────────────────────────────────────────────────
  shippingForm!: FormGroup;

  // ── Mat Table ────────────────────────────────────────────────────────────
  displayedColumns = [
    'item_name',
    'item_code',
    'quantity',
    'shipped_quantity',
    'remaining_quantity',
    'unit_price',
    'this_shipment',
  ];
  // itemsDataSource!: MatTableDataSource<AbstractControl>;

  // ── File name display map ─────────────────────────────────────────────────
  // fileNames: Record<string, string> = {};

  // ── Transport modes ───────────────────────────────────────────────────────
  readonly transportModes = [
    { value: 'ROAD', label: 'Road', icon: '🚛' },
    { value: 'COURIER', label: 'Courier', icon: '🚚' },
    { value: 'AIR', label: 'Air', icon: '✈️' },
    { value: 'SEA', label: 'Sea', icon: '🚢' },
    { value: 'RAIL', label: 'Rail', icon: '🚂' },
  ];

  sampleItems: ShipmentItem[] = [];

  private modeSub!: Subscription;
  incotermList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private activeRoute: ActivatedRoute,
    private poService: PurchaseRequestService,
    private toaster: ToastrService,
    private purchaseMasterService: PurchaseMasterService,
    private $common: CommonService,
    private $miscellaneousService: MiscellaneousService,
    private transport_service: TransportManagementService,
    private cryptoService: CryptoService,
    private router: Router,
  ) {}

  // ── Getters ───────────────────────────────────────────────────────────────
  get mode(): string {
    return this.shippingForm.get('mode')?.value;
  }
  get items(): FormArray {
    return this.shippingForm.get('items') as FormArray;
  }

  hasError(path: string, error: string): boolean {
    const ctrl = this.shippingForm.get(path);
    return !!(ctrl?.hasError(error) && (ctrl.dirty || ctrl.touched));
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.buildForm();
    this.listenToModeChanges();
    this.getAllPorts();
    this.getAllIncoterms();
    this.activeRoute.queryParams.subscribe({
      next: (res: any) => {
        this.vendor_id_header = res?.vendor_id;
        this.type = res?.type;
        this.po_id_header = res?.po_id;
        this.vendor_id =
          this.cryptoService.decrypt(this.vendor_id_header) || '';
        this.po_id = this.cryptoService.decrypt(this.po_id_header) || '';

        if (res?.type == 'history') {
          this.activeTab = 1;
        }
        this.getPoWithVendorDetails(this.po_id);
      },
      error: (err) => {
        console.log('error==>', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.modeSub?.unsubscribe();
  }

  // ── Build Form ────────────────────────────────────────────────────────────
  private buildForm(): void {
    this.shippingForm = this.fb.group(
      {
        shipmentType: [''],
        mode: ['ROAD', Validators.required],
        shipment_date: [null, Validators.required],
        expected_arrival: [null, Validators.required],
        po_no: [null, Validators.required],
        departure_location: [null],
        po_date: [null, Validators.required],
        terms_condition: [null, Validators.required],
        port_id: [null],
        advance_amount: [null],
        invoice_amount: [null, Validators.required],
        invoice_no: [null, Validators.required],
        invoice_date: [null, Validators.required],
        incoterm_details: [null],
        delivery_location: [null],

        road: this.fb.group({
          vehicle_number: [''],
          driver_name: [''],
          driver_mobile: ['', [Validators.pattern(/^[0-9+\s\-]{7,15}$/)]],
          transporter_name: [''],
          lr_number: [''],
          pickup_location: [''],
          delivery_location: [''],
        }),

        courier: this.fb.group({
          courier_name: [''],
          awb_number: [''],
          tracking_url: [''],
          remarks: [''],
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
          container_number: [''],
          container_type: ['20FT'],
          seal_number: [''],
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
          forwarder: [''],
        }),

        rail: this.fb.group({
          train_number: [''],
          train_name: [''],
          railway_zone: [''],
          wagon_number: [''],
          coach_number: [''],
          container_number: [''],
          departure_station: [''],
          arrival_station: [''],
          departure_date: [null],
          expected_arrival: [null],
          total_packages: [null, Validators.min(0)],
          gross_weight: [null, Validators.min(0)],
          cargo_type: [''],
          rr_number: [''],
          rr_date: [null],
        }),

        items: new FormArray([]),

        documents: this.fb.group({
          packingList: [[]],
          invoice: [null, Validators.required],
          transportDocument: [[]],
          otherDocument: [[]],
        }),
      },
      // { validators: arrivalAfterShipment }
    );
  }
  private patchItemsData(items: any[]): FormArray {
    return this.fb.array(
      items.map((item) => {
        return this.fb.group({
          po_item_id: [item.id],
          item_name: [item.MASTER_ITEM?.item_name],
          item_code: [item.MASTER_ITEM?.item_code],
          item_master_id: [item.item_master_id],
          quantity: [item.quantity],
          shipped_quantity: [item.shipped_quantity || 0],
          remaining_quantity: [item.remaining_quantity],
          this_shipment: [
            null,
            [
              Validators.required,
              Validators.min(1),
              Validators.max(item.remaining_quantity),
            ],
          ],
          unit_price: [item.unit_price],
        });
      }),
    );
  }
  // ── Dynamic validators on mode switch ─────────────────────────────────────
  private listenToModeChanges(): void {
    this.applyModeValidators(this.mode);
    this.modeSub = this.shippingForm
      .get('mode')!
      .valueChanges.subscribe((m) => {
        this.applyModeValidators(m);
      });
  }

  private applyModeValidators(mode: string): void {
    ['road', 'air', 'sea', 'rail', 'courier'].forEach((group) => {
      const g = this.shippingForm.get(group) as FormGroup;
      Object.values(g.controls).forEach((c) => {
        c.clearValidators();
        c.updateValueAndValidity({ emitEvent: false });
      });
    });

    const req = Validators.required;
    if (mode === 'ROAD') {
      this.setV('road.vehicle_number', [req]);
      this.setV('road.driver_name', [req]);
      this.setV('road.lr_number', [req]);
      // this.setV('road.pickup_location', [req]);
      // this.setV('road.delivery_location', [req]);
    } else if (mode === 'COURIER') {
      this.setV('courier.courier_name', [req]);
      this.setV('courier.awb_number', [req]);
    } else if (mode === 'AIR') {
      this.setV('air.airlineName', [req]);
      this.setV('air.flightNumber', [req]);
      this.setV('air.awbNumber', [req]);
      // this.setV('air.departureAirport', [req]);
      // this.setV('air.arrivalAirport', [req]);
      this.setV('air.gross_weight', [req, Validators.min(0.01)]);
    } else if (mode === 'SEA') {
      this.setV('sea.vessel_name', [req]);
      // this.setV('sea.port_of_loading', [req]);
      // this.setV('sea.port_of_discharge', [req]);
      this.setV('sea.bl_number', [req]);
    } else if (mode === 'RAIL') {
      this.setV('rail.train_number', [req]);
      this.setV('rail.wagon_number', [req]);
      // this.setV('rail.departure_station', [req]);
      // this.setV('rail.arrival_station', [req]);
      this.setV('rail.rr_number', [req]);
    }
  }

  private setV(path: string, validators: any[]): void {
    const ctrl = this.shippingForm.get(path);
    ctrl?.setValidators(validators);
    ctrl?.updateValueAndValidity({ emitEvent: false });
  }

  // ── File change handler ───────────────────────────────────────────────────
  fileNames: any = {
    packingList: [],
    invoice: [],
    transportDocument: [],
    otherDocument: [],
  };
  documentList = [
    {
      key: 'packingList',
      label: 'Packing List',
      hint: 'PDF, XLS, XLSX',
      icon: 'description',
      accept: '.pdf,.xlsx,.xls',
    },
    {
      key: 'invoice',
      label: 'Invoice',
      hint: 'PDF, XLS, XLSX',
      icon: 'receipt',
      accept: '.pdf,.xlsx,.xls',
    },
    {
      key: 'transportDocument',
      label: 'Transport Document',
      hint: 'PDF, DOC, DOCX',
      icon: 'article',
      accept: '.pdf,.doc,.docx',
    },
    {
      key: 'otherDocument',
      label: 'Other Document',
      hint: 'PDF, DOC, JPG, PNG',
      icon: 'folder_open',
      accept: '.pdf,.doc,.docx,.jpg,.jpeg,.png',
    },
  ];
  uploadStatus: any = {
    packingList: { progress: 0, status: 'idle' },
    invoice: { progress: 0, status: 'idle' },
    transportDocument: { progress: 0, status: 'idle' },
    otherDocument: { progress: 0, status: 'idle' },
  };

  onFileChange(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);

    if (!files.length) {
      return;
    }
    const allowedExtensions = [
      'pdf',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'jpg',
      'jpeg',
    ];

    const maxSize = 5 * 1024 * 1024; // 5 MB

    for (const file of files) {
      const extension = file.name.split('.').pop()?.toLowerCase();

      if (!extension || !allowedExtensions.includes(extension)) {
        this.toaster.warning(
          `${file.name} is not a valid file. Allowed formats: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG`,
        );

        input.value = '';
        return;
      }

      if (file.size > maxSize) {
        this.toaster.warning(
          `${file.name} size must be less than or equal to 5 MB`,
        );

        input.value = '';
        return;
      }
    }
    const formData = new FormData();

    files.forEach((file) => {
      formData.append('files', file);
    });

    this.uploadStatus[key] = {
      progress: 0,
      status: 'uploading',
    };

    this.transport_service.uploadDocument(formData).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(
            (100 * event.loaded) / (event.total || 1),
          );

          this.uploadStatus[key].progress = percentDone;
        }

        if (event.type === HttpEventType.Response) {
          const response = event.body;

          const uploadedFiles = response?.url || [];

          const docs = this.shippingForm.get('documents') as FormGroup;

          const existingFiles = docs.get(key)?.value || [];

          docs.get(key)?.setValue([...existingFiles, ...uploadedFiles]);

          this.fileNames[key] = [
            ...(this.fileNames[key] || []),
            ...files.map((f) => f.name),
          ];

          this.uploadStatus[key] = {
            progress: 100,
            status: 'success',
          };

          this.toaster.success(
            `${uploadedFiles.length} file(s) uploaded successfully`,
          );
        }
      },

      error: () => {
        this.uploadStatus[key] = {
          progress: 0,
          status: 'error',
        };

        this.toaster.error('File upload failed');
      },
    });
  }

  getFileUrls(key: string): string[] {
    const docs = this.shippingForm.get('documents') as FormGroup;

    if (!docs) {
      return [];
    }

    const files = docs.get(key)?.value || [];

    return files.map(
      (file: string) =>
        `${environment.servralUrl}/uploaded_files/cha_documents/${file}`,
    );
  }

  removeFile(key: string, index: number): void {
    const docs = this.shippingForm.get('documents') as FormGroup;

    const files = [...(docs.get(key)?.value || [])];

    files.splice(index, 1);

    docs.get(key)?.setValue(files);

    if (this.fileNames[key]?.length) {
      this.fileNames[key].splice(index, 1);
    }

    if (!files.length) {
      this.uploadStatus[key] = {
        progress: 0,
        status: 'idle',
      };
    }
  }

  poDetails: any;

  getPoWithVendorDetails(po_id: any) {
    this.poService.getPoWithVendorDetails(po_id).subscribe({
      next: (res: any) => {
        this.poDetails = res.data;
        this.patchShippingForm(res.data);
      },
      error: (err: any) => {
        console.log('error', err);
      },
    });
  }
  get itemsFormArray(): FormArray {
    return this.shippingForm.get('items') as FormArray;
  }
  patchShippingForm(data: any) {
    const vendorData = data?.VENDOR_BASIC_DETAIL;
    const currencyData = data?.MASTER_CURRENCY_CONVERT || vendorData?.MASTER_CURRENCY_CONVERT;
    this.currencySymbols = getCurrencySymbol(
      currencyData?.symbols || 'INR',
      'wide',
    );
    this.currencyCode = currencyData?.Currency_Type || 'INR';

    const portData = data?.MASTER_PORT;

    const shipmentTypeControl = this.shippingForm.get('shipmentType');
    shipmentTypeControl?.patchValue(vendorData?.vendor_category);
    shipmentTypeControl?.disable();

    const poNoControl = this.shippingForm.get('po_no');
    this.shippingForm.get('advance_amount')?.setValue(vendorData.advance_amount)
    poNoControl?.patchValue(data?.po_number);
    if (data?.incoterm_id) {
      setTimeout(() => {
        const incoterm = this.incotermList?.find(
          (incoterm: any) => incoterm.id === data?.incoterm_id,
        );
        this.shippingForm
          .get('incoterm_details')
          ?.patchValue(
            incoterm?.incoterm_code + ' - ' + incoterm?.incoterm_meaning,
          );
      }, 1000);
    }
    const poDateControl = this.shippingForm.get('po_date');
    poDateControl?.patchValue(data?.po_date);
    poDateControl?.disable();
    const poDeliveryControl = this.shippingForm.get('delivery_location');
    let location: any;
    if (!data?.port_id) {
      location = [data?.WAREHOUSE_MASTER?.address];
      const departure_location_control =
        this.shippingForm.get('departure_location');
      departure_location_control?.setValidators([Validators.required]);
      departure_location_control?.updateValueAndValidity();
    } else {
      location = [portData?.port_name, portData?.port_type]
        .filter(Boolean)
        .join(', ');
      const port_id_control = this.shippingForm.get('port_id');
      port_id_control?.setValidators([Validators.required]);
      port_id_control?.updateValueAndValidity();
    }

    poDeliveryControl?.patchValue(location);
    let mode: any = 'ROAD';
    switch (portData?.port_type) {
      case 'Sea':
        mode = 'SEA';
        break;
      case 'Air':
        mode = 'AIR';
        break;
      case 'Rail':
        mode = 'RAIL';
        break;
      default:
        mode = 'ROAD';
        break;
    }
    this.shippingForm.get('mode')?.patchValue(mode);
    this.patchPoItemValue(data?.PROCUREMENT_PURCHASE_ORDER_ITEMs);
  }

  itemsDataSource: AbstractControl[] = [];
  patchPoItemValue(items: any) {
    // this.shipped = items.some((item: any) => item.remaining_quantity > 0);
    this.shipped = items.every((item: any) => item.remaining_quantity == 0);
    this.sampleItems = items;
    this.shippingForm.setControl('items', this.patchItemsData(items));
    this.itemsDataSource = this.itemsFormArray.controls;
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  createShipping(): void {
    this.shippingForm.markAllAsTouched();

    const payload = this.shippingForm.getRawValue();

    if (this.shippingForm.invalid) {
      this.toaster.warning(
        'Please fix the validation errors before submitting.',
      );
      this.findInvalidControls(this.shippingForm);
      return;
    }

    if (!payload.terms_condition) {
      this.toaster.warning(
        'Please check terms and conditions before submitting.',
      );
      return;
    }

    payload.po_id = this.poDetails.id;
    payload.vendor_id = this.poDetails.vendor_id;
    console.log('Shipping Alert Payload:', payload);

    this.poService.createShippingAlert(payload).subscribe({
      next: (res: any) => {
        this.toaster.success(res.message);
        this.router.navigate(['/vendor-tracking-alert'], {
          queryParams: {
            po_id: this.po_id_header,
            vendor_id: this.vendor_id_header,
          },
        });
      },
      error: (err: any) => {
        this.toaster.warning(err.error.message);
      },
    });
  }

  // ── Cancel ────────────────────────────────────────────────────────────────
  cancel(): void {
    const ref = this.snackBar.open(
      'Are you sure? All data will be lost.',
      'Yes, Clear',
      {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      },
    );
    ref.onAction().subscribe(() => {
      this.shippingForm.reset({ shipmentType: 'Domestic', mode: 'ROAD' });
      this.fileNames = {};
      this.applyModeValidators('ROAD');
    });
  }

  // ── Tab handlers ──────────────────────────────────────────────────────────
  onTabChange(event: MatTabChangeEvent): void {
    this.activeTab = event.index;
    // if (event.index === 1) this.applyFilters();
  }

  switchToCreateTab(): void {
    this.activeTab = 0;
  }
  portList: any[] = [];

  getAllPorts() {
    this.purchaseMasterService.getAllPorts().subscribe((res: any) => {
      this.portList = res?.data;
    });
  }
  getAllIncoterms() {
    this.purchaseMasterService.getAllIncoterms().subscribe((res: any) => {
      this.incotermList = res?.data;
    });
  }
  findInvalidControls(formGroup: FormGroup, parentKey: string = '') {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);

      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      if (control instanceof FormGroup) {
        this.findInvalidControls(control, fullKey);
      } else if (control && control.invalid) {
        console.log('Invalid Control:', fullKey);
        console.log('Errors:', control.errors);
      }
    });
  }

  enterQty(event: any) {
    let total = 0;

    this.itemsFormArray.controls.forEach((control: AbstractControl) => {
      const qty = Number(control.get('this_shipment')?.value || 0);
      const price = Number(control.get('unit_price')?.value || 0);

      total += qty * price;
    });

    this.shippingForm.get('invoice_amount')?.setValue(total, {
      emitEvent: false,
    });
  }
}

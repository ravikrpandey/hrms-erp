import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-negotiation',
  templateUrl: './create-negotiation.component.html',
  styleUrls: ['./create-negotiation.component.scss']
})
export class CreateNegotiationComponent implements OnInit {
  createPrForm: FormGroup;
  id: string = "";
  typePr: string = "";
  negotiationId: string = "";
  rfp_number: string = "";
  baseUrl = environment.servralUrl;
  prData: any;
  procurement_requests: any[] = [];
  levelsOne: any[] = [];
  levelsTwo: any[] = [];
  levelsThree: any[] = [];

  createdBy: any;
  details_pr_service: any;
  loading: boolean = false;

  now = new Date();
  maxDate = moment().add(100, 'years').toDate();
  minDate = new Date();
  minEndDate: Date;

  constructor(
    private route: Router,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    private fb: FormBuilder,
    private prService: PurchaseRequestService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.getNegotiateId();
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.pr_id;
      this.typePr = params.prType;
      this.rfp_number = params.rfp_number || '';
      this.getByPr();
      this.quotationlevel();
    });
  }

  private initForm() {
    this.createPrForm = this.fb.group({
      start_date_nego: [null, [Validators.required]],
      end_date_nego: [null, [Validators.required]],
      items: this.fb.array([])
    });

    this.createPrForm.get('start_date_nego')?.valueChanges.subscribe((value: any) => {
      if (value) {
        this.minEndDate = value;
        const endDate = this.createPrForm.get('end_date_nego')?.value;
        if (endDate && moment(endDate).isBefore(moment(value))) {
          this.createPrForm.get('end_date_nego')?.setValue(null);
        }
      }
    });
  }

  get itemsFormArray(): FormArray {
    return this.createPrForm.get('items') as FormArray;
  }

  private getNegotiateId() {
    this.prService.createNegotiateId().subscribe((res: any) => {
      this.negotiationId = res.data;
    });
  }

  getByPr() {
    const payload = {
      procurementId: Number(this.id),
      pr_category: this.typePr,
      rfp_number: this.rfp_number
    };

    this.prService.getByNewNegotiate(payload).subscribe((res: any) => {
      this.createdBy = res?.employeeName;
      this.prData = res?.data[0];
      this.details_pr_service = res?.data;

      let itemsData = [];
      if (this.typePr === "BOM PR") {
        const modifiedData: any[] = [];
        res?.vData?.forEach((obj: any) => {
          const index = modifiedData.findIndex(entry => entry.item_id === obj.item_id);
          const vendorInfo = {
            vendor_management: obj.vendor_management,
            vendors: obj.vendors,
            VENDOR_BASIC_DETAIL: obj.VENDOR_BASIC_DETAIL
          };
          if (index !== -1) {
            modifiedData[index].vendors.push(vendorInfo);
          } else {
            modifiedData.push({ item_id: obj.item_id, vendors: [vendorInfo] });
          }
        });

        itemsData = res.data?.map((item: any) => {
          const vendorData = modifiedData.find(obj => obj.item_id === item.item_id)?.vendors || [];
          return {
            ...item,
            item_document: `${this.baseUrl}/${item.item_document}`,
            vendorData: vendorData
          };
        });
      } else {
        const rawItems = res.data[0]?.PROCUREMENT_PURCHASE_REQUEST_ITEMs || res.data?.PROCUREMENT_PURCHASE_REQUEST_SERVICEs || [];
        const filteredItems = rawItems.filter((item: any) => {
          if (this.rfp_number) {
            return item?.PROCUREMENT_PURCHASE_VENDOR_RFP_ITEMs?.some(
              (rfp: any) => rfp.rfp_number === this.rfp_number
            );
          }
          return true;
        });
        itemsData = filteredItems.map((item: any) => ({
          PR_category: item?.PR_category,
          product_name: item?.product_name,
          item_code: item?.MASTER_ITEM?.item_code || item?.MASTER_SERVICE?.service_code,
          item_document: `${this.baseUrl}/${item?.MASTER_ITEM?.MASTER_ITEM_IMAGE_DOCUMENTs?.[0]?.image || item?.MASTER_SERVICE?.service_document}`,
          item_name: item?.MASTER_ITEM?.item_name || item?.MASTER_SERVICE?.service_name,
          item_id: item?.item_master_id,
          priority: item?.priority,
          service_id: item?.service_master_id,
          vendorData: (item?.PROCUREMENT_PURCHASE_VENDOR_RFP_ITEMs || []).filter((rfp: any) => !this.rfp_number || rfp.rfp_number === this.rfp_number)
        }));
      }

      this.procurement_requests = itemsData;
      this.patchItems(itemsData);
    });
  }

  private patchItems(items: any[]) {
    this.itemsFormArray.clear();
    items.forEach(item => {
      this.itemsFormArray.push(this.fb.group({
        item_id: [item.item_id || item.service_id],
        service_id: [item.service_id],
        product_name: [item.product_name || item.item_name],
        target_price: [null, [Validators.required]],
        vendor_nego: [null, [Validators.required]]
      }));
    });
  }

  quotationlevel() {
    const serviceCall = this.typePr === "Bom" ?
      this.prService.bomQuotationGet(this.id) :
      this.prService.quotationLevelGet(this.id, this.rfp_number);

    serviceCall.subscribe((res: any) => {
      this.levelsOne = res?.data?.Level1 || [];
      this.levelsTwo = res?.data?.Level2 || [];
      this.levelsThree = res?.data?.Level3 || [];
    });
  }

  OpenDefineDate() {
    if (this.createPrForm.invalid) {
      this.createPrForm.markAllAsTouched();
      this.toast.error('Please fill all required fields', 'Validation Error');
      return;
    }

    const formVal = this.createPrForm.value;
    const itemDetails = formVal.items.map((item: any) => ({
      item_id: item.item_id,
      service_id: item.service_id,
      bom_id: item.item_id,
      target_amount: item.target_price,
      vendor_ids: item.vendor_nego
    }));

    const data = {
      rfpNumber: this.rfp_number || this.prData?.rfp_number || this.prData?.RFP_MASTER?.rfp_number,
      rfp_number: this.rfp_number || this.prData?.rfp_number || this.prData?.RFP_MASTER?.rfp_number,
      procurement_id: this.id,
      start_date_nego: moment(formVal.start_date_nego).format("YYYY-MM-DD"),
      end_date_nego: moment(formVal.end_date_nego).format("YYYY-MM-DD"),
      site_url: `${window.origin}/send-negotiation-link`,
      item_detail: itemDetails,
      Negotiation_Id: this.negotiationId,
      procurement_type: this.typePr,
      nego_status: "CLOSE NEGO",
    };

    this.loading = true;
    let obs;
    if (this.typePr === "Item") obs = this.prService.sendNegotiate(this.id, data);
    else if (this.typePr === "Service") obs = this.prService.sendNegotiateService(this.id, data);
    else if (this.typePr === "BOM PR") obs = this.prService.sendNegotiateBom(this.id, data);

    if (obs) {
      obs.subscribe({
        next: () => {
          this.loading = false;
          this.toast.success("Initiate Negotiation successfully");
          this.route.navigate(['master/purchase-management/negotiation'], { queryParams: { tab: 'live-negotiation' } });
        },
        error: () => {
          this.loading = false;
          this.toast.error("Something went wrong");
        }
      });
    } else {
      this.loading = false;
      this.toast.error("Invalid PR Type");
    }
  }

  seePreviewTable(path: string) {
    if (!path) return;
    const fullPath = path.includes('http') ? path : this.generateImageUrl(path);
    Swal.fire({
      imageUrl: fullPath,
      imageHeight: 400,
      imageWidth: 400,
      imageAlt: 'Document',
      confirmButtonColor: '#063178',
      confirmButtonText: 'Ok',
    });
  }

  generateImageUrl(imageUrl: any): string {
    return `${this.baseUrl}/${imageUrl}`;
  }
}


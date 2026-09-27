import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormArray,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-close-negotiation-update',
  templateUrl: './close-negotiation-update.component.html',
  styleUrls: ['./close-negotiation-update.component.scss'],
})
export class CloseNegotiationUpdateComponent {
  prData: any;
  prResponse: any;

  typePr: any;
  id: any;
  levelsOne: any[] = [];
  levelsTwo: any[] = [];
  levelsThree: any[] = [];
  negotiationData: any;
  remarkForm: FormGroup;
  entity_id: any;
  finacial_id: any;
  negoApprvovelId: string = '';
  negotiation_code: string = '';
  allProcurementRequests: any[] = [];

  procurement_requests: any;
  fileBind: string;
  imageToUpload: any;
  imagePath: any;
  noOfVendor: any;
  gridApi: GridApi<any>;
  singlePrData: any;
  url: string;
  tablequote: any;
  isChecked: any;
  renegoStart: boolean = false;
  view: string = 'close';

  public rowData: any;

  constructor(
    private route: Router,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private prService: PurchaseRequestService,
    private configurationalMasterService: ConfigurationalmasterService,
  ) {
    this.remarkForm = this.fb.group({
      remarks_approval: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.url = window.location.origin;
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.finacial_id = Number(localStorage.getItem('financial_id')!);
    this.getNegoApprovalId();
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.pr_id;
      this.typePr = params.prType;
      this.view = params.actionType;
      this.negotiation_code = params.negotiation_code || '';
      this.getByPr();
      this.quotationlevel();
      this.quoteTable();
    });
  }

  getNegoApprovalId() {
    this.prService.createNegoApprovelId().subscribe((res: any) => {
      this.negoApprvovelId = res?.data;
    });
  }

  quoteTable() {
    this.prService
      .approvelQuoteNego(this.id, this.negotiation_code)
      .subscribe((res: any) => {
        this.tablequote = res.data;
        const tablecopy = res.data.map((vendor: any) => {
          vendor.items = vendor.items.map((item: any) => {
            return {
              ...item,
              nego_approval_id: this.negoApprvovelId,
              type: this.typePr,
              procurement_id: Number(this.id),
            };
          });
          return vendor;
        });
        this.tablequote = tablecopy;
        this.filterItems();
      });
  }

  checkboxSele(selectedItem: any, vendorId: any, itemData: any) {
    const selectedItemId = selectedItem.item_id;
    const selectedServiceId = selectedItem.service_id;
    if (selectedItem.checked) {
      // Deselect same item in all other vendors
      this.tablequote.forEach((vendor: any) => {
        if (vendor.vendor_id !== vendorId) {
          vendor.items.forEach((prod: any) => {
            if (this.typePr == 'Service') {
              if (prod.service_id === selectedServiceId) {
                prod.checked = false;
              }
            } else {
              if (prod.item_id === selectedItemId) {
                prod.checked = false;
              }
            }
          });
        }
      });
    }
  }

  isItemSelectedByOtherVendor(
    itemId: number,
    currentVendorId: number,
    serviceId?: number,
  ): boolean {
    return this.tablequote?.some(
      (vendor: any) =>
        vendor.vendor_id !== currentVendorId &&
        vendor.items.some((prod: any) => {
          if (this.typePr == 'Service') {
            return prod.service_id === serviceId && prod.checked;
          } else {
            return prod.item_id === itemId && prod.checked;
          }
        }),
    );
  }

  getByPr() {
    this.prService.getByIdPR(this.id, this.typePr).subscribe((res: any) => {
      this.prResponse = res;
      this.prData = res.data[0];
      this.procurement_requests =
        res.data[0]?.PROCUREMENT_PURCHASE_REQUEST_ITEMs;
      this.fileBind = `${environment.servralUrl + '/' + this.prData?.file}`;

      const data = [];
      for (let a = 0; a <= this.procurement_requests.length - 1; a++) {
        data.push({
          PR_category: this.procurement_requests[a]?.PR_category,
          product_name: this.procurement_requests[a]?.product_name,
          product_varient: this.procurement_requests[a]?.product_varient,
          item_quantity: this.procurement_requests[a]?.item_quantity,
          product_quantity:
            this.procurement_requests[a]?.product_quantity ||
            this.procurement_requests[a]?.item_quantity,
          item_code: this.procurement_requests[a]?.MASTER_ITEM?.item_code,
          item_document:
            this.procurement_requests[a]?.MASTER_ITEM
              ?.MASTER_ITEM_IMAGE_DOCUMENTs[0]?.image,
          item_name: this.procurement_requests[a]?.MASTER_ITEM?.item_name,
          item_id:
            this.procurement_requests[a]?.item_master_id ||
            this.procurement_requests[a]?.item_id,
          priority: this.procurement_requests[a]?.priority,
        });
      }

      this.allProcurementRequests = data;
      this.filterItems();
    });
  }

  filterItems() {
    if (!this.tablequote || !this.allProcurementRequests) return;

    const negoItemIds = new Set<number>();
    const negoServiceIds = new Set<number>();
    this.tablequote.forEach((vendor: any) => {
      vendor.items?.forEach((item: any) => {
        if (item.item_id) negoItemIds.add(item.item_id);
        if (item.service_id) negoServiceIds.add(item.service_id);
      });
    });

    this.procurement_requests = this.allProcurementRequests.filter(
      (item: any) => {
        if (this.typePr === 'Service') {
          return negoServiceIds.has(item.service_id);
        } else {
          return negoItemIds.has(item.item_id);
        }
      },
    );
  }

  quotationlevel() {
    this.prService
      .updateQutationnegotiate(this.id, this.negotiation_code)
      .subscribe((res: any) => {
        this.negotiationData = res.additionalInfo;
        this.remarkForm.patchValue({
          remarks_approval: this.negotiationData?.remarks_approval,
        });
        this.levelsOne = res?.data?.Level1 || [];
        this.levelsTwo = res.data?.Level2 || [];
        this.levelsThree = res.data?.Level3 || [];
      });
  }

  onChange(e: any) {
    if (e.target.files && e.target.files[0]) {
      const data: FileList = e.target.files;
      this.imageToUpload = data.item(0) || null;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result;
      };
      reader.readAsDataURL(this.imageToUpload);
    }
  }

  OpenDefineDate(e: any) {
    // this.prService.procurementProductId.next(this.id)
    // const dialogRef = this.dialog.open(QuotationDefineDateComponent, { width: '450px'  ,data:this.singlePrData});
    // dialogRef.afterClosed().subscribe(result => {

    // })this.id

    this.route.navigate(['master/purchase-main/negotiation/re-negotiation'], {
      queryParams: {
        pr_id: this.id,
        prType: this.typePr,
      },
    });
  }

  productOpen(path: any) {
    if (path) {
      Swal.fire({
        imageUrl: this.generateImageUrl(path),
        imageHeight: 250,
        imageAlt: 'Image',
        confirmButtonColor: '#063178',
      });
    }
  }

  renegoTog(e: any) {
    if (e.checked == true) {
      this.renegoStart = true;
    } else if (e.checked == false) {
      this.renegoStart = false;
    }
  }

  sendForApprovel(e: any) {
    Swal.fire({
      title: 'Are you sure to send this approvel?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#063178',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const val = this.remarkForm.value;
        let payload = {
          approval_for: 'Negotiation',
          pr_type: this.typePr,
          department_id: this.prData?.department_id,
          remarks_approval: val.remarks_approval,
          purchase_request_id: this.id,
          financial_year_id: this.finacial_id,
          entity_id: this.entity_id,
          approval_code: this.negoApprvovelId,
          items_data: null,
          service_data: null,
          bom_data: null,
        };
        if (this.typePr == 'Item') {
          payload.items_data = this.tablequote;
        } else if (this.typePr == 'Service') {
          payload.service_data = this.tablequote;
        } else {
          payload.bom_data = this.tablequote;
        }

        this.prService.createApprovelRfp(payload).subscribe(
          (res: any) => {
            if (res.code == 200) {
              this.toast.success(
                'Quotation send successfully for approval',
                'Fields Success',
              );
              this.remarkForm.reset();
              this.route.navigate(
                ['master/purchase-management/vendor-quotation'],
                {
                  queryParams: {
                    tab: 'pending-approval',
                  },
                },
              );
            }
          },
          (err) => {
            if (err) {
              this.toast.error(`${err.error.message}`);
            }
          },
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  generateImageUrl(uploadDoc: any): string {
    const servralUrl = environment.servralUrl;
    return `${servralUrl}/${uploadDoc}`;
  }
}

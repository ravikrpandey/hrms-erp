import { Component } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { PurchaseRequestService } from 'src/app/@shared/services/purchase-request.service';
import { environment } from 'src/app/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-re-negotiation',
  templateUrl: './re-negotiation.component.html',
  styleUrls: ['./re-negotiation.component.scss']
})
export class ReNegotiationComponent {
  createPrForm: FormGroup;
  minEndDate: Date;
  liveUrl: string;
  id: any;
  typePr: any;
  vendorData: any;
  procurement_requests: any;
  createdBy: any;
  details_pr: any;
  rfpNumber: any;
  fileBind: string;
  myDate: any;
  vendorNegot: any;
  datesRfp: any;
  levelsOne: any;
  levelsTwo: any;
  levelsThree: any;
  vendorList: any;
  negotiationId: any;
  newItemData: any;
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  date = this.now.getDate();
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.date }).format('YYYY-MM-DD');
  minDate = moment({ year: this.year, month: this.month, date: this.date }).format('YYYY-MM-DD');
  negotiateNo: any;
  loading: boolean = false;
  finacial_id: any;
  entity_id: any;

  constructor(private route: Router,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    public dialog: MatDialog, private fb: FormBuilder, private prService: PurchaseRequestService, private configurationalMasterService: ConfigurationalmasterService) {
    this.createPrForm = this.fb.group({
      location: new FormControl(null),
      state: new FormControl(null),
      city: new FormControl(null),
      pin: new FormControl(null),
      delivery_address: new FormControl(null),
      start_date_nego: new FormControl(null, [Validators.required]),
      end_date_nego: new FormControl(null, [Validators.required]),
      vendor_nego: new FormControl(null),
      target_price: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    let finacial_id = localStorage.getItem('financial_id');
    this.finacial_id = Number(finacial_id)
    this.liveUrl = window.location.origin;
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.pr_id;
      this.typePr = params.prType;
      this.getByPr();
      this.quotationlevel();
    });
    this.configurationalMasterService
      .getVendorType()
      .subscribe((params: any) => {
        this.vendorData = params.data;
      });
    this.vendorNegotiation();
  }

  getByPr() {
    let data = {
      procurementId: Number(this.id),
      PR_categories: this.typePr,
      re_negotiation: true
    }
    if (this.typePr === "BOM PR") {
      this.prService.getByRenegotiate(data).subscribe((res: any) => {
        this.createdBy = res?.employeeName;
        this.details_pr = res.bomPRData[0];
        // this.rfpNumber = res.rfp_No?.Rfp_Number;
        this.negotiateNo = res?.nego_id;

        // const allDateModify:any=[];
        const modifiedData: any = [];
        const entryExists = (itemId: any) => modifiedData.findIndex((entry: any) => entry.item_id === itemId);

        res?.bomPRData.forEach((obj: any) => {
          const itemId = obj.item_id;

          const item_name = obj.product_name;
          const item_code = obj.item_code;
          // const priority=obj.priority;
          const item_document = `${environment.servralUrl + '/' + obj.item_document}`;
          const vendorInfo = {
            vendor_management: obj.vendor_name,
            vendors: obj.vendors
          };

          const index = entryExists(itemId);

          if (index !== -1) {

            modifiedData[index].vendors.push(vendorInfo);
          } else {

            modifiedData.push({

              item_id: itemId,
              item_name: item_name,
              item_code: item_code,
              item_document: item_document,
              // priority:priority,
              vendors: [vendorInfo]
            });
          }
        });

        console.log(modifiedData, 'modifiedData');


        this.procurement_requests = modifiedData
        const data = [];
        this.createPrForm.patchValue({
          start_date_pr: this.myDate,
          location: this.details_pr?.location,
          state: this.details_pr?.state,
          pin: this.details_pr?.pin,
          city: this.details_pr?.city,
          delivery_address: this.details_pr?.delivery_address,
          file: `${environment.servralUrl + '/' + this.details_pr?.file}`
        })
      });
    } else if (this.typePr === "Item") {
      this.prService.getByRenegotiate(data).subscribe((res: any) => {
        this.createdBy = res?.employeeName;
        this.details_pr = res?.itemPRData[0];
        console.log(this.details_pr, ' this.details_pr');
        this.negotiateNo = res?.nego_id;

        // this.rfpNumber = res.rfp_No?.Rfp_Number;
        console.log(res?.itemPRData, 'itemPRData');
        this.getBrahc()

        this.createPrForm.patchValue({

          // location: this.details_pr?.location,
          state: this.details_pr?.state,
          pin: this.details_pr?.pin,
          city: this.details_pr?.city,
          delivery_address: this.details_pr?.delivery_address,
          // file: `${environment.servralUrl + '/' + this.details_pr?.file}`
        })
        //
        const modifiedData: any = [];
        const entryExists = (itemId: any) => modifiedData.findIndex((entry: any) => entry.item_id === itemId);

        res?.itemPRData.forEach((obj: any) => {
          const itemId = obj.item_master_id;
          const item_name = obj.item_name;
          const item_code = obj.item_code;
          const priority = obj.priority;
          const item_document = obj.item_document;
          const vendorInfo = {
            vendor_management: obj.vendor_name,
            vendors: obj.vendors
          };

          const index = entryExists(itemId);

          if (index !== -1) {

            modifiedData[index].vendors.push(vendorInfo);
          } else {

            modifiedData.push({
              item_id: itemId,
              item_name: item_name,
              item_code: item_code,
              item_document: item_document,
              priority: priority,
              vendors: [vendorInfo]
            });
          }
        });

        console.log(modifiedData, 'modifiedData');
        this.procurement_requests = modifiedData;

      });
    } else {


      this.prService.getByRenegotiate(data).subscribe((res: any) => {
        this.details_pr = res?.servicePRData[0];
        console.log(this.details_pr, ' this.details_pr');
        this.createdBy = res?.employeeName;

        // this.rfpNumber = res.rfp_No?.Rfp_Number;
        console.log(res?.servicePRData, 'itemPRData');
        this.getBrahc()
        this.createPrForm.patchValue({

          // location: this.details_pr?.location,
          state: this.details_pr?.state,
          // pin: this.details_pr?.pin,
          // city: this.details_pr?.city,
          delivery_address: this.details_pr?.delivery_address,
          // file: `${environment.servralUrl + '/' + this.details_pr?.file}`
        })
        const modifiedData: any = [];
        const entryExists = (itemId: any) => modifiedData.findIndex((entry: any) => entry.service_id === itemId);

        res?.servicePRData.forEach((obj: any) => {
          const itemId = obj.service_master_id;
          const item_name = obj.service_name;
          const item_code = obj.service_code;
          const priority = obj.priority;
          // const item_document=`${environment.servralUrl + '/' + obj.item_document}`;
          const vendorInfo = {
            vendor_management: obj.vendor_name,
            vendors: obj.vendors
          };

          const index = entryExists(itemId);

          if (index !== -1) {

            modifiedData[index].vendors.push(vendorInfo);
          } else {

            modifiedData.push({
              service_id: itemId,
              item_name: item_name,
              item_code: item_code,
              // item_document:item_document,
              priority: priority,
              vendors: [vendorInfo]
            });
          }
        });

        console.log(modifiedData, 'modifiedData');
        this.procurement_requests = modifiedData;

        this.negotiateNo = res?.nego_id;


      });
    }
  }

  vendorNegotiation() {
    this.prService.getNegotiateVendor(this.id).subscribe((res: any) => {
      this.vendorNegot = res.data;
    })
  }

  quotationlevel() {
    this.prService.updateQutationnegotiate(this.id).subscribe((res: any) => {
      this.datesRfp = res.additionalInfo;

      this.levelsOne = res?.data?.Level1;
      this.levelsTwo = res.data?.Level2;
      this.levelsThree = res.data?.Level3 || "-";
    })
  }

  keyUpAmount(event: any, i: any, data: any) {
    this.procurement_requests.forEach((item: any) => {
      if (item?.item_id === data?.item_id) {
        item.target_amount = event;
      }
    });

    const newArray = [];

    for (let i = 0; i < this.procurement_requests.length; i++) {
      newArray.push({
        item_id: this.procurement_requests[i]?.item_id,
        target_amount: this.procurement_requests[i]?.target_amount
      });
    }
    this.newItemData = newArray
  }

  OpenDefineDate() {
    let val = this.createPrForm.value;
    if (this.createPrForm.invalid) {
      this.toast.error('Required fields should not be empty', 'Fields Error');
      return;
    }

    const modifyData = this.procurement_requests?.map((item: any) => {
      return {
        item_id: item.item_id,
        service_id: item.service_id,
        bom_id: item.item_id,
        target_amount: item?.target_amount,
        list: item.venderSelectedList?.map((vendor: any) => vendor)
      };
    });
    for (const item of modifyData) {
      if (item?.target_amount === undefined) {
        this.toast.warning("Please Fills target price for each item.");
        return;
      }
      if (item?.list === undefined) {
        this.toast.warning("Please assign the vendors for each item.");
        return;
      }
    }

    modifyData.forEach((item: any) => {
      item.list.forEach((id: any, index: any) => {
        item.list[index] = { id, ...item.list[index] };
      });
    });
    let alld = JSON.stringify(modifyData);

    let data = {
      rfpNumber: this.rfpNumber,
      procurement_id: this.id,
      start_date_nego: moment(val.start_date_nego).format("YYYY-MM-DD"),
      end_date_nego: moment(val.end_date_nego).format("YYYY-MM-DD"),
      vendor_nego: this.vendorList,
      site_url: `${this.liveUrl + '/send-negotiation-link'}`,
      item_detail: JSON.parse(alld),
      Negotiation_Id: this.negotiateNo,
      procurement_type: this.typePr,
      is_submitted: "false",
      nego_status: "LIVE Nego",
      re_negotiation: true,
      entity_id: this.entity_id,
      financial_year_id: this.finacial_id
    }
    console.log(data, 'data');
    if (this.typePr == "Item") {
      this.loading = true;
      this.prService.sendItemReNegotiate(this.id, data).subscribe((res: any) => {
        console.log(res);
        this.loading = false;
        this.toast.success(" Initiate Negotiation successFully ")
        this.route.navigate(['master/purchase-main/negotiation/live-negotiation'])
      }, ((err: any) => {
        this.loading = false;
        this.toast.error("Something Went To Wrong..")
      }))
    } else if (this.typePr === "Service") {
      this.loading = true;
      this.prService.sendSeriveReNegotiate(this.id, data).subscribe((res: any) => {
        console.log(res);
        this.loading = false;
        this.toast.success(" Initiate Negotiation successFully ")
        this.route.navigate(['master/purchase-main/negotiation/live-negotiation'])
      }, ((err: any) => {
        this.loading = false;
        this.toast.error("Something Went To Wrong..")
      }))

    } else if (this.typePr == "BOM PR") {
      this.loading = true;
      this.prService.sendBomReNegotiate(this.id, data).subscribe((res: any) => {
        console.log(res);
        this.loading = false;
        this.toast.success(" Initiate Negotiation successFully ")
        this.route.navigate(['master/purchase-main/negotiation/live-negotiation'])
      }, ((err: any) => {
        this.loading = false;
        this.toast.error("Something Went To Wrong..")
      }))
    } else {
      this.loading = false;
      this.toast.error("Something Went To Wrong")
    }

  }

  seePreviewTable(path: string) {
    if (path) {
      Swal.fire({
        imageUrl: path,
        imageHeight: 400,
        imageWidth: 400,
        imageAlt: 'Document',
        confirmButtonColor: '#063178',
        confirmButtonText: 'Ok',
      });
    }
  }

  vendorSelec(e: any, index: any, data: any) {

    console.log(e, 'eeeeeee');
    let eValue = e.value
    console.log(eValue, 'eValue');
    console.log(data, 'data');
    const item_vender: any = [];
    for (let a = 0; a <= eValue.length - 1; a++) {
      // item_vender.push(eValue[a]?.vendor_management_id),
      // item_vender.push(eValue[a]?.vendor_name)
      item_vender.push({
        id: eValue[a]
        // vendor_name: eValue[a]?.vendor_name
      })
    }
    console.log(item_vender, 'item_vender');
    const itemData: any = [];
    this.procurement_requests[index].venderSelectedList = e.value;
    console.log('itemData', this.procurement_requests);

    itemData?.map((item: any) => {
      if (item?.item_id == data?.item_id) {
        item.list = item_vender;
      }
    })
    console.log(itemData, 'itemDatacopy');
    console.log(this.procurement_requests, 'procurement_requests return');
  }

  getBrahc() {
    this.configurationalMasterService.getListBranchSetup().subscribe((res: any) => {

      res?.data.map((branch: any) => {
        if (this.details_pr?.branch_id == branch?.id) {
          this.createPrForm.patchValue({
            location: branch?.branch_name,
            state: branch?.states_name,
            delivery_address: branch?.branch_address,
          })
        }
      })
    })
  }

  generateImageUrl(uploadDoc: any): string {
    const servralUrl = environment.servralUrl;
    return `${servralUrl}/${uploadDoc}`;
  }
}

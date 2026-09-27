import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import 'ag-grid-enterprise';
import { ToastrService } from 'ngx-toastr';
import { GridApi, GridReadyEvent, CellValueChangedEvent, ICellRendererParams, } from 'ag-grid-community';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { ActionsComponent } from '../countrymaster/actions/actions.component';
import { ActionComponent } from './action/action.component';

@Component({
  selector: 'app-pricemapping',
  templateUrl: './pricemapping.component.html',
  styleUrls: ['./pricemapping.component.scss']
})
export class PricemappingComponent {

  checked = false;
  indeterminate = false;
  labelPosition: 'cert' | 'non-cert' = 'cert';
  disabled = false;

  certForm: FormGroup;
  nonCertForm: FormGroup;
  gridApi: any;
  rowClass: any;
  showTickets: boolean = false;
  addContact: boolean = false;
  rowDataBookTiket: any;
  rowDataNew: any;
  priceData: any = [];
  allCertificateTypeData: any;
  allCustomerType: any;
  allProductType: any;
  allLevelSlab: any;
  segmentList: any;
  certificateList: any;
  product_m_id: any;
  priceSlabList: any;
  priceValue: any[] = [];
  showProduct_master: boolean = false;
  show_training_name: boolean = false;
  certificate_name: any;
  allTrainingList: any;
  showCustomerType: boolean = false;
  non_cert_list: { type: any; }[];
  seg_name: any;
  segment_certificate: any;
  certificate_filter: any;
  certificateNames: any;
  cer_name: any;
  cer_id: any;
  certificateData: any;
  segment_ids: any;
  segmentName: any;
  getCertificate: any;
  product_list: any;
  productName: any;
  MSA_Cert_List: any;
  show: any;
  columnDefs1: any[];
  id: any;
  filterData: any;
  non_: boolean;
  getPricing: any;
  edit: boolean=false;
  create: boolean=true;
  typs: string="Add";
  msaCertListShow:boolean= true;
  medRowData:any;
  MED_Cert_List: any;
  columnDefs3: any[];


  constructor(private fb: FormBuilder,
    private _configurationalmasterService: ConfigurationalmasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private toast: ToastrService,
    private _configurationalMasterService: ConfigurationalmasterService,

  ) {
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      console.log(this.id, "id");
      if(this.id){
        this.edit=true
        this.create=false
        this.typs='Edit'

      }
      this.findElement(this.rowDataNew, this.id);
      this.findElement(this.medRowData, this.id)

    });
    this.certForm = this.fb.group({
      product_master_id: new FormControl(null),
      PerMandayPricing: new FormControl(null),
      segmentType: new FormControl(null),
      certificate_type: new FormControl(null),
      product_master_name: new FormControl(null),
      price: new FormControl(null),
      type: new FormControl(null),
    })
    this.rowClass = 'rowClass'
  }
  addPrice(){
    this.route.navigate(['master/itticket/configurational-master/price-master'])
    this.edit=false
    this.create=true
    this.certForm.reset();
  }
  findElement(arr: any, id: any) {
    console.log(arr);
    console.log(id);
    this._configurationalmasterService.getById_priceMaping(id).subscribe((res: any) => {
      console.log(res.data, "price table");
      this.getPricing = res.data
      if ("cert_price_mapping_id" in this.getPricing) {
        this.getPricing.types = 1;
      }
      else {
        this.getPricing.types = 2
      }

      this.certForm.patchValue({
        price: this.getPricing.PerMandayPricing || this.getPricing.price,
        type: this.getPricing?.type,
        types: this.getPricing?.types,

      })

    },
      (err: any) => {
        // this.toast.error("somthing wents wrong")
      })
  }
  updateFinalForm(form:any){
    console.log(form.value,"form");
    let data:any={}
    if(this.getPricing.types==1){
      data={
        PerMandayPricing:form.value.price,
      }
    }
    else{
    data={
        price:form.value.price,
        type:form?.value.type
      }
    }
   

    this._configurationalMasterService.editCertPrice( this.id,data).subscribe((res:any)=>{
      this.toast.success("update successfully..")
      window.location.reload();
      
    },(err:any)=>{
      this.toast.error("somthing wents wrong")
    })

    

  }

  ngOnInit() {
    this.columnDefs1 = [...this.columnDefs]
    this.columnDefs3 = [...this.columnDefs2]


    let A = this.columnDefs.filter((item: any) => !item.is);
    this.columnDefs = A
    this.non_cert();
    this.getAllCustomerType();
    // this.getAllProductType();
    this.getAllLevel();
    this.getAllSegment();
    this.getAllTrainingName();
    // this.getPriceLevelSlab();
    this._configurationalMasterService.getAllCertificate().subscribe((res: any) => {
      this.certificateData = res.data
      const segmentMap: any = {}; // Object to store unique segments
      const output: any = [];
      this.certificateData.forEach((item: any) => {
        const { segment_id, segment_name } = item.segment;
        if (!segmentMap[segment_id]) {
          segmentMap[segment_id] = true;
          output.push({ segment_id, segment_name });
        }
      });
      console.log(output);
      this.segment_ids = output
      console.log(this.certificateData, "certificateData");
      const outputData = this.certificateData.map((item: any) => {
        return {
          cer_id: item.certificate_type_id,
          cer_name: item.certificate_type_name,
          segment_id: item.segment.segment_id,
          segmentName: item.segment.segment_name
        };
      });
      console.log(outputData, "outputData");
      this.segment_certificate = outputData
      this.segmentName = this.segment_certificate.segmentName

})
    this._configurationalMasterService.getAllCertificate().subscribe((res: any) => {
      this.getCertificate = res.data
      console.log(this.getCertificate, "getCertificate");
    })
    this.msa_certList();
    this.getMedCertList();
  }
  msa_certList() {
    this._configurationalMasterService.MSA_Cert().subscribe((res: any) => {
      this.MSA_Cert_List = res.data
      this.rowDataNew = this.MSA_Cert_List
      console.log(this.MSA_Cert_List, "msalist");
    }, (err: any) => {
      this.toast.error("Somthing wents wrong")
    })

  }
  msa_Non_certList() {
    this._configurationalMasterService.MSA_Non_Cert().subscribe((res: any) => {
      this.MSA_Cert_List = res.data
      const updatedData = this.MSA_Cert_List.map((item: any) => {
        const { price, ...rest } = item; 
        return { ...rest, PerMandayPricing: price };
      });
      this.rowDataNew = updatedData
      console.log(this.MSA_Cert_List, "msalist");
    }, (err: any) => {
      this.toast.error("Somthing wents wrong")
    })
  }

  getMedCertList(){
    this._configurationalMasterService.MED_Cert().subscribe((res: any) => {
      this.MED_Cert_List = res.data;
            const updatedData = this.MED_Cert_List.map((item: any) => {
        const { PerMandayPricing, ...rest } = item; 
        return { ...rest, price: PerMandayPricing };
      });
      this.medRowData = updatedData
    }, (err: any) => {
      this.toast.error("Somthing wents wrong")
    })
  }

  getMedNonCertList(){
    this._configurationalMasterService.MED_Non_Cert().subscribe((res: any) => {
      this.MED_Cert_List = res.data
      // const updatedData = this.MED_Cert_List.map((item: any) => {
      //   const { PerMandayPricing, ...rest } = item; 
      //   return { ...rest, price: PerMandayPricing };
      // });
      this.medRowData = this.MED_Cert_List
      console.log(this.MED_Cert_List, "msalist");
    }, (err: any) => {
      this.toast.error("Somthing wents wrong")
    })
  }

  public columnDefs: any = [
    {
      headerName: 'Price Index',
      field: 'cert_price_mapping_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      cellRenderer: (params:any) => {
        return `<p>${params.data.cert_price_mapping_id || params.data.noncert_price_mapping_id }</p>`;
      }
  

    },
    
    {
      headerName: 'Product Name',
      field: 'product_master_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      //editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: this.priceData,
      },
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Type',
      field: 'type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      //editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: this.priceData,
      },
      flex: 1,
      minWidth: 150,
      is: true
    },
    {
      headerName: 'Price',
      field: 'PerMandayPricing',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Action',
      field: 'lead_genration_id',
      minWidth: 150,
      cellRenderer: ActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: "grid-cell-centered"
    }


  ];


  public columnDefs2: any = [
    {
      headerName: 'Price Index',
      field: 'cert_price_mapping_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
      cellRenderer: (params:any) => {
        return `<p>${params.data.cert_price_mapping_id || params.data.noncert_price_mapping_id }</p>`;
      }
  

    },
    
    {
      headerName: 'Product Name',
      field: 'product_master_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      //editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: this.priceData,
      },
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Product Master Name',
      field: 'product_master_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      //editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: this.priceData,
      },
      flex: 1,
      minWidth: 150,
      is: true
    },
    {
      headerName: 'Price',
      field: 'price',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150
    },
    {
      headerName: 'Action',
      field: 'lead_genration_id',
      minWidth: 150,
      cellRenderer: ActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: "grid-cell-centered"
    }


  ];

  onCellValueChanged(event: CellValueChangedEvent) {
  }

  addBtn() {
    this.addContact = !this.addContact;
  }

  yesTickets() {
    this.showTickets = true;
  }
  noTickets() {
    this.showTickets = false;
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;


  }
  onCellClicked(e: any) {

  }

  getAllCustomerType() {
    this._configurationalmasterService.getCustomerType().subscribe((response) => {
      this.allCustomerType = response.data;
      console.log('customer type---', this.allCustomerType)
    })
  }

  getAllLevel() {
    this._configurationalmasterService.getLevelSlab().subscribe((response) => {
      this.allLevelSlab = response.data;

    })
  }
  selectProduct(event: any) {
    this.priceValue = [];
    const product_master_id = event.value;
    this.product_m_id = product_master_id
    if (this.product_m_id) {
      this.showProduct_master = true;
    }
    else {
      this.showProduct_master = false;
    }
    const productFilter = this.product_list.filter((res: any) => res.product_master_id == event.value)
    console.log(productFilter, "orontion");

    this.productName = productFilter[0].product_master_name
    this._configurationalmasterService.getPriceListByID(this.product_m_id).subscribe((res: any) => {
      this.priceSlabList = res?.data;
    });

  }

  getAllSegment() {
    this._configurationalmasterService.getAllSegment().subscribe((res: any) => {
      this.segmentList = res.data;

    });
  }
  selectSegment(e: any) {
    const segment_id = e.value;
    this._configurationalmasterService.getCertificateByID(segment_id).subscribe((res: any) => {
      this.certificateList = res.data.new_types;

    });
  }

  selectCertficate() {

    // if(this.certificate_name == 'cert'){
    this.show_training_name = true;
    this.showCustomerType = false;
    this._configurationalmasterService.getProductMaSterById(1).subscribe((res: any) => {
      this.allProductType = res.data[0].newitemlist;
      console.log(this.allTrainingList, "product");


    });
    // }
    if (this.certificate_name == 'non-cert') {
      this.showCustomerType = true;
      this.show_training_name = false;
      this._configurationalmasterService.getProductMaSterById(1).subscribe((res: any) => {
        this.allProductType = res.data[0].newitemlist;
      });
    }


  }

  getAllTrainingName() {
    this._configurationalmasterService.getTrainingName().subscribe((res: any) => {
      this.allTrainingList = res.data;


    })
  }

  submitPriceDetail() {
    let val = this.certForm.value;
  }


  type(e: any) {
    console.log(e.target.value, "eee");
    this.certificate_name = e.target.value
    this.selectCertficate()
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  submitFinalForm(formData: any) {
    console.log(formData, 'formData');
    console.log(this.cer_name, 'formData');

    if (this.cer_name == "Cert") {
      console.log(this.certForm.value);
      const data = {
        segment_id: formData.value.segmentType,
        segment_name: this.seg_name,
        PerMandayPricing: formData.value.price,
        product_master_id: formData.value.product_master_id,
        product_master_name: this.productName,
      }
      this._configurationalmasterService.createCertPrice(data).subscribe((res: any) => {
        this.toast.success("Successfully Added");
        this.reloadCurrentRoute();
      }
        ,
        (err: any) => {
          this.toast.error(err.error.message);
        })
    }
    else if (this.cer_name == "Non-Cert") {
      const data = {
        segment_id: formData.value.segmentType,
        segment_name: this.seg_name,
        price: formData.value.price,
        product_master_id: formData.value.product_master_id,
        product_master_name: this.productName,
        type: formData.value.type,
      }
      this._configurationalmasterService.createNonCertPrice(data).subscribe((res: any) => {
        this.toast.success("Successfully Added");
        this.reloadCurrentRoute();

      }
        ,
        (err: any) => {
          this.toast.error(err.error.message);
        })
    }


  }
  non_cert() {
    this.non_cert_list = [
      { type: "Internal Auditor Training" },
      { type: "Awareness" },
      { type: "Gap Assessment" },
      { type: "Special Assessment" },
      { type: "Open House - Internal Auditor Training" },
      { type: "Open House - Awareness" },

    ]
  }
  segmentType(e: any) {
    console.log(e.value);
    console.log(this.segment_certificate);
    const certificate_filter = this.segment_certificate.filter((res: any) => Number(res.segment_id) == e.value)
    console.log(certificate_filter, "check")
    this.certificate_filter = certificate_filter
    this.seg_name = certificate_filter[0].segmentName
  }
  certificateType(e: any) {
    console.log(this.allProductType);
    const certificateNameFilter = this.certificate_filter.filter((res: any) => Number(res.cer_id) == e.value)
    this.certificateNames = certificateNameFilter
    this.cer_name = this.certificateNames[0].cer_name
    this.cer_id = this.certificateNames[0].cer_id
    console.log(this.cer_name, this.cer_id);
    this.selectCertficate()
    this._configurationalMasterService.getProducts_withouprice(e.value).subscribe((res: any) => {
      this.product_list = res.data
      console.log(this.product_list);
      if(this.product_list.length==0){
        this.toast.warning("Product not found for price maping")

      }
    },
      (err: any) => {
        this.toast.error("Product list not fount")
      })


  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  filter(e: any) {
    this.show = e.target.value
    console.log(this.show);
    if (this.show == "Cert") {
      this.certForm.reset();
      let A = this.columnDefs.filter((item: any) => !item.is);
      this.columnDefs = A
      this.msa_certList()
      this.non_ = false
    }
    else {
      this.certForm.reset();
      this.non_ = true
      this.columnDefs = this.columnDefs1
      this.msa_Non_certList()

    }
  }

  filter_MED_by_Segment(e: any) {
    this.show = e.target.value
    console.log(this.show);
    if (this.show == "Cert") {
      this.certForm.reset();
      let A = this.columnDefs2.filter((item: any) => !item.is);
      this.columnDefs2 = A
      this.getMedCertList()
      this.non_ = false
    }
    else {
      this.certForm.reset();
      this.non_ = true
      this.columnDefs2 = this.columnDefs3
      this.getMedNonCertList();

    }
  }
 
}

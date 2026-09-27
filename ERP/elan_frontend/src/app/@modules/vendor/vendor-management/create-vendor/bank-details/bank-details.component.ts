import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { HrServiceService } from 'src/app/@shared/services/hr-service.service';
import { BankActionComponent } from './bank-action/bank-action.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ToastrService } from 'ngx-toastr';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CommonService } from 'src/app/@shared/services/common.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss']
})
export class BankDetailsComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  bankForm: FormGroup;
  countryList: any;
  stateList: any;
  cityList: any;
  acountType = [
    { value: 'Current' },
    { value: 'Saving' },
  ]
  bankData: any;
  id: any;
  vendor_id: any;
  pachdata: any;
  bank_id: any;
  editBankData: any;
  vendorName: any;
  branch_City_Id: any;
  status: any;
  shows: any;
  rowDatas: any;
  arrayData: any= [];
  bankDataAll: any;
  allFilterData: any;
  reporting: any = [];
  allCopyCountry: any = [];
  reporting_manager_name: any;
  otherCountryData: any = [];
  type: any;
  indexDetail:any=null;
  entity_id: any;
  accountHolderNameExists: any;
  banks: any;
  bankDataAll2: any;
  statesList: any;
  statesList2: any;
  states: any;
  stateList2: any;
  cities: any;
  cityList2: any;
  constructor(
    private route: Router,
    private _empRegistration: EmpRegistrationService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private activeroute: ActivatedRoute,
    private vendorService: VendorManagementService,
    private _configurationalMasterService: ConfigurationalmasterService,
    private _commonService : CommonService,
    private _financeService : FinaceService
  ) {
    this.rowClass = 'rowClass';

    this.bankForm = this.fb.group({
      // vendor_management_id: new FormControl(null),
      bank_name: new FormControl(null),
      branch: new FormControl(null),
      account_holder_name: new FormControl(null),
      bank_address: new FormControl(null),
      country_id: new FormControl(null),
      state_id: new FormControl(null),
      city_id: new FormControl(null),
      // city_name:  new FormControl(null),
      branch_city: new FormControl(null),
      // contact_number: new FormControl(null, Validators.required),
      // account_type: new FormControl(null, Validators.required),
      bank_account_number: new FormControl(null, [


      ]),
      // ifsc_number: new FormControl(null, [Validators.pattern('^[A-Z]{4}0[A-Z0-9]{6}$')]),
      // micr_code: new FormControl(null),
      // fax: new FormControl(null),
      swift_code: new FormControl(null),
      // search: new FormControl(null),
      // number_code: new FormControl(null),
      unique_bank_no: new FormControl(null),
      iban_code: new FormControl(null)
    })

  }

  ngOnInit(): void {
    this.entity_id = Number(localStorage.getItem('selectedEntityId'));

    this.getAllCountry();
    this.getAllBank();
    // this.getAllVendorName();
    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params;
      this.vendor_id = params.id;
      this.type = params.type;
      if (this.status) {
        this.vendorService.setval(this.status);

      } else {
        this.vendorService.setval('');
      }

      if (this.status) {
        // this.bankForm.controls['vendor_management_id'].disable();
        this.bankForm.controls['bank_name'].disable();
        this.bankForm.controls['branch'].disable();
        this.bankForm.controls['account_holder_name'].disable();
        this.bankForm.controls['bank_address'].disable();
        this.bankForm.controls['country_id'].disable();
        this.bankForm.controls['state_id'].disable();
        this.bankForm.controls['branch_id'].disable();
        this.bankForm.controls['branch_city'].disable();
        this.bankForm.controls['contact_number'].disable();
        this.bankForm.controls['account_type'].disable();
        this.bankForm.controls['bank_account_number'].disable();
        this.bankForm.controls['ifsc_number'].disable();
        this.bankForm.controls['micr_code'].disable();
        this.bankForm.controls['fax'].disable();
        this.bankForm.controls['swift_code'].disable();
      }
    });
    this.vendorService.getByVendor(this.vendor_id).subscribe((res: any) => {
      this.editBankData = res.data;
      this.arrayData = res.data?.bank_details;
      this.getStateByCountry(Number(this.editBankData?.country_id));
      this.getCityByState((Number(this.editBankData?.state_id)));

      // this.bankForm.patchValue({
      //   bank_name:this.editBankData?.bank_id ,
      //   branch:this.editBankData?.branch_name ,
      //   account_holder_name:this.editBankData?.account_holder_name ,
      //   bank_address: this.editBankData?.bank_address,
      //   country_id: Number(this.editBankData?.bank_country_id),
      //   state_id: this.editBankData?.state_id,
      //   city_id:this.editBankData?.bank_city_id,
      //   branch_city:this.editBankData?.branch_city,
      //   contact_number:this.editBankData?.contact_number,
      //   account_type: this.editBankData?.account_type,
      //   bank_account_number: this.editBankData?.bank_account_number,
      //   ifsc_number:this.editBankData?.ifsc_number ,
      //   micr_code:this.editBankData?.micr_code ,
      //   fax:this.editBankData?.fax,
      //   swift_code:this.editBankData?.swift_code,
      //   unique_bank_no:this.editBankData?.unique_number_bank,
      //   iban_code:this.editBankData?.iban_code
      // })
    })
    if (this.editBankData) {
      this.bankForm.controls['country_id'].patchValue(Number(this.editBankData?.country_id));
      // }/
    }
    // this._configurationalMasterService.listBank().subscribe((res: any) => {
    //   this.bankData = res.data;

    // });
  }
  get f() { return this.bankForm.controls; }
  public rowData: any;
  nameSearch: any = '';


  public columnDefs = [
    {
      headerName: 'Sr No.',
      field: 'bank_details_id',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Bank Name',
      field: 'bank_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Account Type',
      field: 'account_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'IFSC CODE',
      field: 'ifsc_number',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Account Holder Name ',
      field: 'account_holder_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      valueFormatter: 'JSON.parse(value)',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: 'Actions',
      field: 'vendor_id', sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex: 1,
      minWidth: 150,
      cellRenderer: BankActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
      },
      cellClass: "grid-cell-centered",

    },

  ];


  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;

  }


  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  getAllCountry() {
    this._commonService?.showLoader()
    this._empRegistration.getAllActivecountry().subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        this.countryList = res.data;
        this.reporting = this.countryList.map((res: any) => res.countryss_name);
        this.allCopyCountry = this.countryList;
        this.otherCountryData = this.countryList
      },(err:any) => {
        this._commonService?.hideLoader()
      })
  };

  countryChange(e: any) {
    console.log(e, 'eee');

    this.getStateByCountry(e.value);
  };

  getStateByCountry(id: any) {
    this._commonService?.showLoader()
    this._empRegistration.getStateByCountry(id).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        this.stateList = res.data;
        this.stateList2 = res.data;
        this.states = this.stateList.map((value:any) => value.states_name)
        // if(this.editBankData || this.pachdata){
        //   this.bankForm.controls['state_id'].patchValue(Number(this.editBankData?.state_id || this.pachdata.state_id))
        //   this.getCityByState(this.editBankData?.state_id ||this.pachdata.state_id)
        // }
      },(err:any) => {
        this._commonService?.hideLoader()
      }
    )
  };

  stateChange(e: any) {
    this.getCityByState(e.value)
  }

  cityOnChange(e: any) {
    this.branch_City_Id = e.value;
  }

  getCityByState(id: any) {
    this._commonService?.showLoader()
    this._empRegistration.getCityByState(id).subscribe(
      (res: any) => {
        this._commonService?.hideLoader()
        this.cityList = res.data;
        this.cityList2 = res.data;
        this.cities = this.cityList.map((value:any) => value.city_name)
        // if(this.editBankData || this.pachdata){
        //   this.bankForm.controls['branch_id'].patchValue(Number(this.editBankData?.branch_id || this.pachdata.branch_id))
        // }
      },(err : any) => {
        this._commonService?.hideLoader()
      }
    )
  };

  currentRout() {
    let currentUrl = this.route.url;
    let newVal = currentUrl.split("?")
    let prm = newVal[1].split('=')
    // let val = newVal[1].slice(8)
    console.log(prm)
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([newVal[0]], { queryParams: { [prm[0]]: prm[1] } });
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true, }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  crateBankDetail() {
    if (this.bankForm.invalid) {
      this.toast.error('Required fields should not be empty', 'Fields Error');

      return;
    }

    let barnchCitydata = this.cityList.find((e: any) => e.branch_id === this.branch_City_Id)


    const val = this.bankForm.value;
    console.log(val, 'val');

    let data = {
      // vendor_management_id: val.vendor_management_id,
      bank_name: val.bank_name,
      branch: val.branch,
      account_holder_name: val.account_holder_name,
      bank_address: val.bank_address,
      country_id: val?.country_id,
      state_id: val.state_id,
      city_id: val.city_id,
      city_name: barnchCitydata?.city_name || this.pachdata.city_name,
      branch_city: val.branch_city,
      contact_number: val.contact_number,
      account_type: val.account_type,
      bank_account_number: val.bank_account_number,
      ifsc_number: val.ifsc_number,
      micr_code: val.micr_code,
      fax: val.fax,
      swift_code: val.swift_code,
    }

    console.log(data, 'dataaa');




    // this.vendorService.crateBankDetail(data).subscribe((res: any) => {
    //   this.bankData = res.dsta;
    //   if (res.code == 200) {
    //     this.toast.success(res.message);
    //     this.reloadCurrentRoute();
    //   }
    // }, (err) => {
    //   if (err.status === 404) {
    //     this.toast.error(err.error.message);
    //   }
    //   else if (err.status == 500) {
    //     this.toast.error(err.message)
    //   }
    //   else {
    //     this.toast.error('Something Went Wrong!!')
    //   }
    // })
  }

  getAllBank() {
    this._commonService?.showLoader()
    this._financeService.getBankList(this.entity_id).subscribe((res: any) => {
      this._commonService?.hideLoader()
      this.bankDataAll = res.data?.filter((bank:any)=>bank?.status ==="ACTIVE" );
      console.log(this.bankDataAll, 'this.bankDataAll');
      this.bankDataAll2 = this.bankDataAll
      this.banks = this.bankDataAll.map((value:any) => value.bank_name)
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  deletData(data: any) {
    console.log(data, 'data');

    if(data?.id){
      this._commonService?.showLoader()
      this.vendorService.deleteBankVendor(data?.id).subscribe((res:any)=>{
        this._commonService?.hideLoader()
        console.log(res,'resssss');
        data.isDeleted = true;
        const newArrayData = this.arrayData.filter((data:any) => !data.isDeleted);

        console.log(newArrayData, 'newArrayData');
        this.arrayData = newArrayData
        // this.id=res.data;
      },(err:any) => {
        this._commonService?.hideLoader()
      })
    }else{

      data.isDeleted = true;
      const newArrayData = this.arrayData.filter((data:any) => !data.isDeleted);

      console.log(newArrayData, 'newArrayData');
      this.arrayData = newArrayData
    }


  }

  editData(data: any,i:any) {
    console.log(i,'iii');
    this.indexDetail=i
    console.log(data, 'dataaa');
    this.bankForm.patchValue({
      bank_name: data?.bank_id,
      branch: data?.branch_name,
      account_holder_name: data?.account_holder_name,
      bank_address: data?.bank_address,
      country_id: data?.bank_country_id,
      state_id: data?.bank_state_id,
      city_id: data?.bank_city_id,
      branch_city: data?.branch_city,
      contact_number: data?.contact_number,
      account_type: data?.account_type,
      bank_account_number: data?.bank_account_number,
      micr_code: data?.micr_code,
      fax: data?.fax,
      swift_code: data?.swift_code,
      search: data?.search,
      number_code: data?.number_code,
      unique_bank_no: data?.unique_number_bank,
      iban_code: data?.iban_code,
    })
    this.getStateByCountry(Number(data?.bank_country_id));
      this.getCityByState((Number(data?.bank_state_id)));
  }


  checkAcc(acc:any){
console.log(acc.value);
const accountHolderNameExists = this.arrayData.some((item: { bank_account_number: any; }) =>
      item.bank_account_number === acc.value
    );
this.accountHolderNameExists=accountHolderNameExists
    console.log(accountHolderNameExists,'accountHolderNameExists');
    if (this.accountHolderNameExists) {
      this.toast.error('Bank Account Holder already exists!');
      return;
    }
  }

  addBankDetails() {

    console.log(this.countryList, 'this.countryList');

    const val = this.bankForm.value;
    console.log(val,'val<<<<<<<<');

    if (!val?.bank_name && !val?.branch) {
      this.toast.warning('Please Add Bank Details');
      return;
    }
    if (!val?.branch) {
      this.toast.warning('Please Add Bank Details');
      return;
    }
    if (!val?.account_holder_name) {
      this.toast.warning('Please Add Bank Details');
      return;
    }
    if (!val?.bank_account_number) {
      this.toast.warning('Please Add Bank Details');
      return;
    }
    // const accountHolderNameExists = this.arrayData.some((item: { bank_account_number: any; }) =>
    //   item.bank_account_number === val?.bank_account_number
    // );

    if (this.accountHolderNameExists) {
      this.toast.error('Bank Account Holder already exists!');
      return;
    }
    //country
    let countryName: any;
    const foundCountry = this.countryList.find((country: any) => country?.countryss_id === val?.country_id);
    console.log(foundCountry, 'foundCountry');

    countryName = foundCountry?.countryss_name;

    // state
    console.log(this.stateList, 'this.stateList');
    let stateName: any;
    const foundstate = this.stateList.find((state: any) => state?.states_id === val?.state_id);
    console.log(foundstate, 'foundstate');

    stateName = foundstate?.states_name;

    //city
    console.log(this.stateList, 'this.stateList');
    let cityName: any;
    const foundCity = this.cityList.find((state: any) => state?.city_id === val?.city_id);
    console.log(foundCity, 'foundstate');

    cityName = foundCity?.city_name;
    // let barnchCitydata = this.cityList.find((e: any) => e.branch_id === this.branch_City_Id)
    let bankName: any;
    let bankNameGet = this.bankDataAll.find((bank: any) => bank?.id == val?.bank_name);
    bankName = bankNameGet?.bank_name
    console.log(val, 'val');

    let data: any = {
      // vendor_management_id: val.vendor_management_id,

      bank_id: val?.bank_name,
      bank_name: bankName,
      branch_name: val?.branch,
      account_holder_name: val?.account_holder_name,
      bank_address: val?.bank_address,
      bank_account_number: val?.bank_account_number,
      unique_number_bank: val?.unique_bank_no,
      swift_code: val?.swift_code,

      iban_code: val?.iban_code,
      bank_country_id: val?.country_id,
      countryName: countryName,

      bank_state_id: val?.state_id,
      stateName: stateName,
      bank_city_id: val?.city_id,
      cityName: cityName


    }

    if (!data) {
      if (data.invalid) {
        this.toast.error('Required fields should not be empty', 'Fields Error');

        return;
      }
    }

    console.log(data, 'dataaa');
    console.log(this.indexDetail,'this.indexDetail');

if(this.indexDetail !== null){
  this.arrayData[this.indexDetail]=data
  // alert("updated")

}else{
// alert("create")

  this.arrayData.push(data)

}
this.indexDetail = null;
console.log(this.arrayData,'this.arrayData');

    this.clearInput()
  }

  clearInput() {
    this.bankForm.get('bank_name')?.reset();
    this.bankForm.get('branch')?.reset();
    this.bankForm.get('account_holder_name')?.reset();
    this.bankForm.get('bank_address')?.reset();
    this.bankForm.get('bank_account_number')?.reset();
    this.bankForm.get('unique_bank_no')?.reset();
    this.bankForm.get('swift_code')?.reset();
    this.bankForm.get('iban_code')?.reset();
    this.bankForm.get('country_id')?.reset();
    this.bankForm.get('state_id')?.reset();
    this.bankForm.get('city_id')?.reset();
    // this.bankForm.get('state_id')?.reset();
    // this.bankForm.get('state_id')?.reset();



  }

  editBankById() {
    // if (this.bankForm.invalid) {
    //   this.toast.error('Required fields should not be empty', 'Fields Error');

    //   return;
    // }


    const val = this.bankForm.value;


    console.log(val, 'val');

    let data = {

      id: this.vendor_id,
      tab_type: "Bank_Details",
      bank_item: this.arrayData


    }
    console.log(data, 'dataaa');

    // this.arrayData.push(data)
    this._commonService?.showLoader()
    this.vendorService.createVendorNew(data).subscribe((res: any) => {
      this._commonService?.hideLoader()
      this.bankData = res.data;
      if (this.type == "Edit") {
        this.route.navigate(
          ['master/vendor/vendor-list/create-vendor/address'],
          { queryParams: { id: this.vendor_id ,type:"Edit"} }
        );
        this.toast.success(res.message);
      }else{
        this.route.navigate(
          ['master/vendor/vendor-list/create-vendor/address'],
          { queryParams: { id: this.vendor_id} }
        );
        this.toast.success(res.message);
      }
    }
  )
  }

  bankFilter(e: any) {
    const aa = e
    let filteredVariable = this.bankDataAll2.filter((item: any) => aa.includes(item.bank_name));
    this.bankDataAll = filteredVariable
  }

  stateFilter(e: any) {
    const aa = e
    let filteredVariable = this.stateList2.filter((item: any) => aa.includes(item.states_name));
    this.stateList = filteredVariable
  }

  cityFilter(e: any) {
    const aa = e
    let filteredVariable = this.cityList2.filter((item: any) => aa.includes(item.city_name));
    this.cityList = filteredVariable
  }

  cellClicked(e: any) {
    this.getAllCountry();
    this.bank_id = e.data.bank_details_id;
    this.pachdata = e.data;
    this.getStateByCountry(Number(this.pachdata?.country_id));
    this.getCityByState((Number(this.pachdata?.state_id)));

    this.bankForm.patchValue({
      bank_name: this.pachdata.bank_name,
      branch: this.pachdata.branch,
      account_holder_name: this.pachdata.account_holder_name,
      bank_address: this.pachdata.bank_address,
      country_id: Number(this.editBankData?.country_id),
      contact_number: this.pachdata.contact_number,
      account_type: this.pachdata.account_type,
      bank_account_number: this.pachdata.bank_account_number,
      ifsc_number: this.pachdata.ifsc_number,
      micr_code: this.pachdata.micr_code,
      fax: this.pachdata.fax,
      swift_code: this.pachdata.swift_code,
    })
    this.bankForm.controls['country_id'].patchValue(Number(this.pachdata?.country_id));
  }

  updateBank() {
    let barnchCitydata = this.cityList.find((e: any) => e.branch_id === this.branch_City_Id)
    console.log("statedata", barnchCitydata);
    const val = this.bankForm.value;
    let data = {
      // vendor_management_id: this.pachdata.vendor_management_id,
      bank_name: val.bank_name,
      branch: val.branch,
      account_holder_name: val.account_holder_name,
      bank_address: val.bank_address,
      country_id: val?.country_id,
      state_id: val.state_id,
      // city_id:val.city_id ,
      // city_name: barnchCitydata?.city_name || this.pachdata?.city_name,
      branch_city: val.branch_city,
      contact_number: val.contact_number,
      account_type: val.account_type,
      bank_account_number: val.bank_account_number,
      ifsc_number: val.ifsc_number,
      micr_code: val.micr_code,
      fax: val.fax,
      swift_code: val.swift_code,
    }
    this._commonService?.showLoader()
    this.vendorService.editVendorBank(this.bank_id, data).subscribe((res: any) => {
      this._commonService?.hideLoader()
      this.bankData = res.data;
      if (this.bankData) {
        this.toast.success(res.message);
        if (this.vendor_id) {
          this.currentRout();
        } else {
          this.reloadCurrentRoute();
        }
      }
    },(err : any) => {
     this._commonService?.hideLoader()
     })
  }


  getAllVendorName() {
    this._commonService?.showLoader()
    this.vendorService.getAllVendorName().subscribe((res: any) => {
      this._commonService?.hideLoader()
      this.vendorName = res.data;
    },(err:any) => {
     this._commonService?.hideLoader()
  })
}

  nextButton() {
    let barnchCitydata = this.cityList.find((e: any) => e.branch_id === this.branch_City_Id)
    console.log("statedata", barnchCitydata);

    const val = this.bankForm.value;
    let data = {
      // vendor_management_id: val.vendor_management_id,
      bank_name: val.bank_name,
      branch: val.branch,
      account_holder_name: val.account_holder_name,
      bank_address: val.bank_address,
      country_id: val?.country_id,
      state_id: val.state_id,
      // city_id:val.city_id ,
      // city_name: barnchCitydata?.city_name || this.pachdata?.city_name,
      branch_city: val.branch_city,
      contact_number: val.contact_number,
      account_type: val.account_type,
      bank_account_number: val.bank_account_number,
      ifsc_number: val.ifsc_number,
      micr_code: val.micr_code,
      fax: val.fax,
      swift_code: val.swift_code,
    }
    this._commonService?.showLoader()
    this.vendorService.editBank(this.vendor_id, data).subscribe((res: any) => {
      this._commonService?.hideLoader()
      this.bankData = res.data;
      if (this.bankData) {
        this.route.navigate(
          ['/master/vendor/vendor-management/vendor-list/create-vendor/documents'],
          { queryParams: { id: this.vendor_id, status: this.status } }
        );
        this.toast.success('Bank Details verified');
      }
    },(err : any ) => {
      this._commonService?.hideLoader()
    })
  }
  onCancel(path: any) {
    this.route.navigate([path])
  }
  reportingManagerSearch(e: any) {
    console.log(e, 'eeeeee');
    console.log(this.countryList, 'this.countryList');

    const aa = e
    let filteredVariable = this.otherCountryData.filter((item: any) => aa.includes(item.countryss_name));
    this.allCopyCountry = filteredVariable
  }
  getReportingData(data: any) {
    return this.reporting_manager_name = data.countryss_name
  }
}



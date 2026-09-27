import { Location } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { cl } from '@fullcalendar/core/internal-common';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { MiscellaneousService } from 'src/app/@shared/services/service/miscellaneous.service';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-create-schedule-trip',
  templateUrl: './create-schedule-trip.component.html',
  styleUrls: ['./create-schedule-trip.component.scss']
})
export class CreateScheduleTripComponent {
@Input() tripId!: string;
@Input() liveStatus!: string;
  entity_id: string | null;
  financial_year_id: string | null;
  employee_id: string | null;
  driverList: any;
  vehicleList: any;
  scheduleTripForm: FormGroup;
  vendorList: any;
  vehicleTypeList: any;
  vehicle_category_id: any;
  vehicleData: any;
  driverData: any;
  vehicleDatas: any = [];
  loginUser: any;
  vendorData: any;
  vehicles: any;
  action_type: any;
  id: any;
  vendorVehicleCategoryList: any;
  minDate = new Date();
  viewDetails: any;
  ItemDetails: any;
  itemType: any;
  assetData: any;
  getItemById: any;
  varientList: any;
  productList: any;
  typeStatus: any;
  categoryList: any;
  productItems: any;
  data: any;
  getAllActiveProduct: any;
  mode: any;
  get tripDocumentsControls(): FormGroup[] {
    return (this.scheduleTripForm.get('tripDocuments') as FormArray).controls as FormGroup[];
  }
  constructor(
    private fb: FormBuilder,
    private location: Location,
    private _transport_service: TransportManagementService,
    private toasService: ToastrService,
    private _active: ActivatedRoute,
    private _router: Router,
    private common: CommonService,
        private $miscellaneousService: MiscellaneousService,
  ) {
    this.scheduleTripForm = this.fb.group({
      distance: [''],
      trip_type: [''],
      dispatch_date: [''],
      delivery_date: [''],
      modeOfTransport: [''],
      vehicle_type: [''],
      own_vehicle_number: [''],
      own_vehicle_regno: [''],
      max_load_capacity: [''],
      own_driver: [''],
      isProduct: [''],
      isItem: [''],
      own_driver_contact: [''],
      own_driver_license_no: [''],
      odometerReading: [''],
      advance_amount: [''],
      vendor_name: [''],
      vendor_vehicle_type: [''],
      vendor_vehicle_number: [''],
      vendor_vehicle_reg: [''],
      vendor_driver_name: [''],
      vendor_driver_contact: [''],
      vendor_payment_term: [''],
      vendor_amount: [''],
      lr_number: [''],
      lr_date: [''],
      lr_issued_by: [''],
      total_packages: [''],
      total_weight: [''],
      freight_type: [''],
      document_name: [''],
      upload_document: [''],
      entity_id: [''],
      financial_year_id: [''],
      trip_id: [''],
      lr_copy: ['']
    })
  }


status_type :any;
  request_id: any;
  trip_id: any
  queryData: any
  hideButton: boolean = true
  schedule:any
  trip_request_id:any
  ngOnInit(): void {
    console.warn(this.tripId,'tripId');
    if(this.liveStatus){
      this.getLiveTripData(this.tripId,this.liveStatus)
    }
    this._active.queryParamMap.subscribe((params: any) => {
      console.log(params.params, 'param')
       this.status_type = params.params.status
       this.schedule=params.params?.schedule
       this.trip_request_id=params.params?.request_id
      this.trip_id = +params.get('trip_id');
      console.log("==================id  js", this.trip_id)
      if (params.params?.mode) {
        this.hideButton = false
      } else {
        this.hideButton = true
      }
    })
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');
    console.log(this.financial_year_id, "ff")
    this.employee_id = localStorage.getItem('EmpMainId');
    let lg: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(lg);
    this._active.queryParamMap.subscribe((res: any) => {
      console.warn(res, 'dd');
      let id = res.params?.id
      this.queryData = res.params?.mode
      this.request_id = id
      
    })

    this.get_vehical_category_Active()
    this.getAll_vehical_Driver()
    this.getAllVehicleVendor()
 if(this.status_type==='CLOSED'){
  this.getCompletedTripsById(this.trip_id)
 }
    
    let statusData2 =  this.status_type==='APPROVED'?this.status_type:'SCHEDULED';
    this.getApprovedProductItemData(this.request_id, statusData2)
   let statusData =  this.status_type==='CLOSED'?'CLOSED':this.status_type==='APPROVED'?this.status_type:'SCHEDULED';
    if(!this.liveStatus){
      this.getScheduledTripById(this.trip_id,statusData)
    }
     

  }
  isProductChecked: any;
  isItemChecked: any;
  getAllData: any = []
  productDetails: any = []
  requestData: any = []



  toggleForm: string = '';
  getValue(event: any) {
    console.warn(event.value, 'getValue');
    if (event.value == 'self') {
      this.toggleForm = 'self';
      this.scheduleTripForm.get('vendor_name')?.reset()
      this.scheduleTripForm.get('vendor_vehicle_type')?.reset()
      this.scheduleTripForm.get('vendor_vehicle_number')?.reset()
      this.scheduleTripForm.get('max_load_capacity')?.reset()
      this.scheduleTripForm.get('own_vehicle_number')?.reset()
      this.scheduleTripForm.get('own_vehicle_regno')?.reset()
      this.scheduleTripForm.get('vehicle_type')?.reset()
    } else {
      this.toggleForm = 'vendor';
      this.scheduleTripForm.get('vendor_name')?.reset()
      this.scheduleTripForm.get('vendor_vehicle_type')?.reset()
      this.scheduleTripForm.get('vendor_vehicle_number')?.reset()
      this.scheduleTripForm.get('max_load_capacity')?.reset()
      this.scheduleTripForm.get('own_vehicle_regno')?.reset()
    }
  }

  getCompletedTripsById(trip_id:any){
    this._transport_service.getCompletedTripsById(trip_id).subscribe((res:any)=>{
      console.log(res,'getCompletedTripsById')
    })
  }
  goBack() {
    this.location.back()
  }
  filterVichlelist: any;
  get_vehical_category_Active() {
    this._transport_service.get_vehical_category_Active(this.entity_id, this.financial_year_id
      // this.loginUser?.role,
    ).subscribe(
      (res: any) => {
        //  console.log('Vehicle Type Response:', res);
        if (res && res.data) {
          this.vehicleTypeList = res.data;
          this.filterVichlelist = [...this.vehicleTypeList]
          //  console.log('Dropdown List:', this.vehicleTypeList);
          console.log(Array.isArray(this.vehicleTypeList));

        }
      },
      (err: any) => {
        console.error('Error fetching vehicle types:', err);
      }
    );
  }



  filtervehicleList: any;
  get_vehicles_by_vehcle_catId(id: any) {
    this._transport_service.get_vehicles_by_vehcle_catId(id, this.entity_id)
      .subscribe(
        (res: any) => {
          console.log('Vehicle Response:', res);
          if (res && res.data) {
            this.vehicleList = res.data;
            this.filtervehicleList = [...this.vehicleList]
            console.log('Dropdown List:', this.vehicleList);
            console.log(Array.isArray(this.vehicleList));
            if (!this.vehicleList.length) {
              //this.toasService.warning('Vehicle Number not found on this vehicle category')
            }
          }
        },
        (err: any) => {
          console.error('Error fetching vehicle types:', err);
        }
      );
  }

  get_vehicle_master_byId(data: any) {
    this._transport_service.get_vehicle_master_byId(data)
      .subscribe(
        (res: any) => {
          console.log('Vehicle Vendor Response:', res.data);
          if (res && res.data) {
            this.vehicleDatas = res.data;
            if (this.vehicleDatas.length) {
              this.scheduleTripForm.patchValue({
                own_vehicle_regno: this.vehicleDatas[0]?.id || this.vehicleDatas[0]?.rc_number,
                vendor_vehicle_reg: this.vehicleDatas[0]?.rc_number,
                max_load_capacity: this.vehicleDatas[0]?.max_load_capacity,

              })
            }


          }
        },
        (err: any) => {
          console.error('Error fetching vehicle vendor:', err);
        }
      );
  }
  filterDriverList: any;
  getAll_vehical_Driver() {
    this._transport_service.getAll_Vehicle_driver(this.entity_id, this.financial_year_id, this.loginUser?.role, this.loginUser?.employee_id).subscribe((res: any) => {
      if (res) {
        this.driverList = res.data;
        this.filterDriverList = [...this.driverList]
        console.log("-------thala", this.driverList)
      }
    }, (err: any) => {

    })
  }

  get_vehicle_driver_by_id(driver_id: any) {
    this._transport_service.get_vehicle_driver_by_id(driver_id).subscribe((res: any) => {
      if (res) {
        this.driverData = res.data;
        console.warn(this.driverData, 'driverData');


        this.scheduleTripForm.patchValue({
          own_driver_contact: this.driverData?.mobile_number,
          own_driver_license_no: this.driverData?.driving_license_number || 'navneet'

        })

      }
    }, (err: any) => {
      console.error('Error fetching vehicle vendor:', err);
    }
    )

  }

  filterVendorList: any;
  getAllVehicleVendor() {
    this._transport_service.getAllVehicleVendor(this.entity_id, this.financial_year_id, this.employee_id).subscribe((res: any) => {
      if (res) {
        this.vendorList = res.data;
        this.filterVendorList = [...this.vendorList]
        console.log('Dropdown List:', this.vendorList);
        console.log(Array.isArray(this.vendorList));
      }
    }, (err: any) => {
      console.error('Error fetching vehicle vendor:', err);
    }
    );
  }


  vendor_id: any;
  onVendorSelect(event: any) {
    this.vendor_id = event
    // this.get_vehical_category_Active()
    this.get_vendor_vehicleCategory(this.vendor_id)
    this.scheduleTripForm.get('vendor_vehicle_type')?.reset()
    this.scheduleTripForm.get('vendor_vehicle_number')?.reset()
    this.scheduleTripForm.get('vendor_vehicle_reg')?.reset()
    this.scheduleTripForm.get('own_vehicle_regno')?.reset()

  }

  onDriverSelect(data: any) {
    this.get_vehicle_driver_by_id(data.driver_id)
  }

  onVehicleTypeSelect(item: any) {
    this.get_vehicles_by_vehcle_catId(item);
    this.scheduleTripForm.get('vendor_vehicle_reg')?.reset()
    this.scheduleTripForm.get('own_vehicle_regno')?.reset()
    this.scheduleTripForm.get('max_load_capacity')?.reset()
  }

  onVehicleSelect(item: any) {
    this.get_vehicle_master_byId(item);
  }

  onVendorVehicleSelect(data: any) {

    this.scheduleTripForm.patchValue({
      vendor_vehicle_reg: data.rc_number
    })
  }

  getVendorVehicle(data: any) {
    this.getAllvendorVehicles(data.id, this.vendor_id)
    this.scheduleTripForm.get('vendor_vehicle_reg')?.reset()
    this.scheduleTripForm.get('own_vehicle_regno')?.reset()
  }

  filtervendorVehiclesNumber: any;
  vendorVehiclesNumber: any = []
  getAllvendorVehicles(id: any, vendor: any) {
    this._transport_service.get_vehicles_by_vehcle_catIdAndVendorId(id, vendor, this.entity_id)
      .subscribe({
        next: (res: any) => {
          if (res && res.data) {
            this.vendorVehiclesNumber = res.data;
            this.filtervendorVehiclesNumber = [...this.vendorVehiclesNumber]
            console.log("---------------vechivle number", this.vendorVehiclesNumber);
            if (!res.data.length) {
              //this.toasService.warning('No vehicles found for the selected category and vendor.');
            } else {
              // this.toasService.success('Vehicles loaded successfully.');
            }

          } else {
            this.toasService.warning('No vehicles found.');
          }
        },
        error: (err) => {
          console.error(err);
          this.toasService.error('Failed to load vehicles. Please try again.');
        }
      });
  }
 
  getApprovedProductItemData(id: any,status:any) {
    this._transport_service.getApprovedProductItemData(id,status).subscribe((res: any) => {
      if (res.code === 200 && res.transportRequestData) {
        this.getAllData = res;

        console.log("--------------data",)

        console.log("-----------------", this.requestData)


        this.isProductChecked = this.getAllData?.transportRequestData?.isProduct == 1 ? true : false
        this.isItemChecked = this.getAllData?.transportRequestData?.isItem == 1 ? true : false
        if (this.queryData !== "view") {
          this.requestData = res.transportRequestData;
          this.toggleForm = this.requestData.transported_by;
          this.get_vendor_vehicleCategory(this.requestData.vendor_id)
          this.get_vehicles_by_vehcle_catId(this.requestData.vehicle_category_id)
          this.getAllvendorVehicles(this.requestData.vehicle_category_id, this.requestData.vendor_id)
          this.scheduleTripForm.patchValue({
            delivery_date: this.requestData.requested_delivery_datetime,
            vehicle_type: this.requestData.vehicle_category_id,
            own_vehicle_number: this.requestData.vehicle_master_id,
            vendor_name: this.requestData.vendor_id,
            vendor_vehicle_type: this.requestData.vehicle_category_id,
            vendor_vehicle_number: this.requestData.vehicle_master_id,
            modeOfTransport: this.requestData.transported_by,
            vendor_vehicle_reg: this.requestData?.rc_number ? this.requestData?.rc_number : null,
          })
          this.get_vehicle_master_byId(this.requestData.vehicle_master_id)

        }

        // this.onVendorVehicleSelect(this.requestData.vehicle_master_id)
      }
    })
  }
  filtervendorVehicleCategoryList: any;
  get_vendor_vehicleCategory(vendor_id: any) {
    this._transport_service.get_vendor_vehicleCategory(vendor_id).subscribe((res: any) => {
      this.vendorVehicleCategoryList = res.data
      this.filtervendorVehicleCategoryList = [...this.vendorVehicleCategoryList]
      console.log(this.vendorVehicleCategoryList, "res")
    })
  }


  FilterVehicleCategory(event: any) {
    const searchValue = event?.target?.value?.toLowerCase() || '';
    if (!searchValue) {
      this.filterVichlelist = [...this.vehicleTypeList];
      return;
    }
    this.filterVichlelist = this.vehicleTypeList.filter((item: any) =>
      item.vehical_category_name?.toLowerCase().includes(searchValue)
    );

  }



  previewUrl: string | null = null;
lr_copy:any;
  onFileSelect(event: any) {
    try {
      let isValidExtension = this.common.checkForValidFile(event);
      if (!isValidExtension) {
        this.scheduleTripForm.patchValue({ employee_photo: null });
        return this.previewUrl = ""
      }
      const formData = new FormData();
      if (event.target.files && event.target.files[0]) {
        formData.append('file', event.target.files[0]);
      }
      this.$miscellaneousService.documents(formData).subscribe((response: any) => {
        if (response) {
          this.lr_copy=response.url;
          this.previewUrl = `${environment.servralUrl}/uploaded_files/${response?.url}`;
          console.warn(this.previewUrl,'this.previewUrl');

        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

  // viewFile(): void {
  //   console.log(this.previewUrl,"thala")
  //   if (this.previewUrl) {
  //     const newWindow = window.open();
  //     if (newWindow) {
  //       newWindow.document.write(
  //         `<iframe src="${this.previewUrl}" width="100%" height="100%" style="border:none;"></iframe>`
  //       );
  //       newWindow.document.title = "File Preview";
  //     }
  //   }
  // }


viewFile(): void {
  if (this.previewUrl) {
   window.open(this.previewUrl,'_blank')
  }
}






  arrayDataPush: any[] = [];

  selectedFile: File | null = null;

  onChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  addDocument(): void {
    if (
      this.scheduleTripForm.value.document_name &&
      this.selectedFile
    ) {
      const file = this.selectedFile;
      const documentName = this.scheduleTripForm.value.document_name;

      const reader = new FileReader();
      reader.onload = () => {
        const documentObject = {
          document_name: documentName,
          upload_document: reader.result,
          file_name: file.name,
          mime_type: file.type
        };
  
        this.arrayDataPush.push(documentObject);

 
        this.scheduleTripForm.patchValue({ document_name: '', upload_document: '' });
        this.selectedFile = null;
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select both document name and a file.');
    }
  }


  viewDocument(doc: any): void {
      
    if (!doc.trip_id) {
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head><title>${doc.file_name}</title></head>
            <body style="margin:0">
              <iframe src="${doc.upload_document}" width="100%" height="100%" style="border:none;"></iframe>
            </body>
          </html>
        `);
      } else {
        alert("Popup blocked! Please allow popups for this site.");
      }
    }
    else if(doc.trip_id){
      window.open(environment?.servralUrl+'/uploaded_files/'+doc.upload_document,'_blank')
    }
  }

  deletData(doc: any, index: number): void {
    this.arrayDataPush.splice(index, 1);
  }




  addItem2() { }
  removeItem(data: any) { }
  viewItem(data: any) { }





  generateImageUrl() {
    throw new Error('Method not implemented.');
  }



  onSubmitForm() {
    if (this.scheduleTripForm.invalid) {
      console.log(this.scheduleTripForm.value);
      alert('Form is Invalid');
    } else {
      this.scheduleTripForm.get('entity_id')?.setValue(this.entity_id)
      this.scheduleTripForm.get('financial_year_id')?.setValue(this.financial_year_id)
      let req = this.scheduleTripForm.value;
      req.request_id = this.request_id
      req.status_type = "SCHEDULED"
      Object.keys(req).forEach(key => {
        if (req[key] === '') {
          req[key] = null;
        }
      });
    req.lr_copy=this.lr_copy,
    req.document_name=this.arrayDataPush
      req.vehicle_category_id = req.vendor_vehicle_type || req.vehicle_type;
      req.vehicle_master_id = req.vendor_vehicle_number || req.own_vehicle_number;
      req.vehicle_driver_id = req.own_driver;

      if (req.modeOfTransport === 'vendor') {
        req.vendor_id = req.vendor_name;
        delete req.own_driver;
        delete req.vehicle_driver_id;
      }

      if (req.modeOfTransport === 'self') {
        delete req.vendor_vehicle_number;
      }


      delete req.own_vehicle_number;
      delete req.own_driver;
      delete req.vehicle_type;


      console.warn(req, 'Cleaned Form Data');

      this._transport_service.createScheduleTrip(req).subscribe((res: any) => {
        this.toasService.success("Trip Scheduled Successfully");
        this._router.navigate(['master/transport-management/all-trip/schedule-trip-list']);
      });
    }
  }
   request_ids:any;
  dummyTRIP: any;
  getScheduledTripById(id: any,statusData:string) {

    this._transport_service.getScheduledTripById(this.trip_id, statusData).subscribe((res: any) => {

      this.data = res.data[0];
      this.request_ids=this.data?.TRANSPORT_REQUEST?.id
      if(this.trip_id){
        this.previewUrl= environment.servralUrl+'/uploaded_files/'+ this.data?.lr_copy
        this.arrayDataPush = this.data?.SCHEDULE_TRIP_DOCUMENTs

      }
    if(this.trip_request_id){
      this.getApprovedProductItemData(this.trip_request_id,this.status_type)
this.scheduleTripForm.patchValue({ trip_id: this.data?.trip_id });
    }
     else if(this.request_ids){
      this.getApprovedProductItemData(this.schedule=='2'?this.request_ids:this.request_id,this.status_type) 
    }

      const tripTypeFromData = res.data[0]?.trip_type; // "One-Way"
      if (tripTypeFromData === 'One-Way') {
        this.scheduleTripForm.patchValue({ trip_type: 'One-way' }); // match mat-option value exactly
      } else if (tripTypeFromData === 'Round-Trip') {
        this.scheduleTripForm.patchValue({ trip_type: 'Round-Trip' });
      }
    
      const trip_id = res.data[0]?.trip_id;
      if (tripTypeFromData == trip_id) {
        this.scheduleTripForm.patchValue({ trip_id: trip_id }); // match mat-option value exactly
      }
      // this.scheduleTripForm.patchValue(this.data);
      if (this.queryData === "view") {

        //  this.requestData = res.transportRequestData;
        this.get_vendor_vehicleCategory(this.data.vendor_id)
        this.get_vehicles_by_vehcle_catId(this.data.vehicle_category_id)
        this.getAllvendorVehicles(this.data.vehicle_category_id, this.data.vendor_id)
        this.toggleForm = this.data?.modeOfTransport
        this.scheduleTripForm.patchValue({
          trip_id: this.data?.trip_id,
          delivery_date: this.data?.delivery_date,
          dispatch_date: this.data?.dispatch_date,
          //trip_type: this.dummyTRIP,
          vehicle_type: this.data?.vehicle_category_id,
          own_vehicle_number: this?.data.vehicle_master_id,
          vendor_name: this.data?.vendor_id,
          vendor_vehicle_type: this.data?.vehicle_category_id,
          vendor_vehicle_number: this.data?.vehicle_master_id,
          modeOfTransport: this.data?.modeOfTransport,
          vendor_vehicle_reg: this.data?.rc_number ? this.data?.rc_number : null,
          distance: this.data?.distance,
          own_driver: this.data?.vehicle_driver_id,
          vendor_driver_name: this.data?.vendor_driver_name,
          vendor_driver_contact: this.data?.vendor_driver_contact,
          vendor_payment_term: this.data?.vendor_payment_term,
          vendor_amount: this.data?.vendor_amount,
          lr_number: this.data?.lr_number,
          lr_date: this.data?.lr_date,
          lr_issued_by: this.data?.lr_issued_by,
          total_packages: this.data?.total_packages,
          total_weight: this.data?.total_weight,
          freight_type: this.data?.freight_type,
          odometerReading: this.data?.odometerReading,
          advance_amount: this.data?.advance_amount,


        })

        this.get_vehicle_master_byId(this.data.vehicle_master_id)
        this.get_vehicle_driver_by_id(this.data?.vehicle_driver_id)
      }
    });
  }

  getLiveTripData(trip_id: any,status:any) {

    this._transport_service.getLiveTripData(trip_id,status).subscribe((res: any) => {
      this.data = res.data;
      console.warn(this.data,'data');
      
       this.previewUrl= environment.servralUrl+'/uploaded_files/'+ this.data?.lr_copy
      
       
             this.arrayDataPush = this.data?.SCHEDULE_TRIP_DOCUMENTs
      const tripTypeFromData = res.data?.trip_type; // "One-Way"
      if (tripTypeFromData === 'One-Way') {
        this.scheduleTripForm.patchValue({ trip_type: 'One-way' }); // match mat-option value exactly
      } else if (tripTypeFromData === 'Round-Trip') {
        this.scheduleTripForm.patchValue({ trip_type: 'Round-Trip' });
      }

      const trip_id = res.data?.trip_id;
      this.trip_id = res.data?.trip_id;
      if (tripTypeFromData == trip_id) {
        this.scheduleTripForm.patchValue({ trip_id: trip_id }); // match mat-option value exactly
      }
      // this.scheduleTripForm.patchValue(this.data);
     
this.isProductChecked = this.data?.TRANSPORT_REQUEST?.isProduct == true ? true : false
        this.isItemChecked = this.data?.TRANSPORT_REQUEST?.isItem == true ? true : false
        //  this.requestData = res.transportRequestData;
        this.get_vendor_vehicleCategory(this.data.vendor_id)
        this.get_vehicles_by_vehcle_catId(this.data.vehicle_category_id)
        this.getAllvendorVehicles(this.data.vehicle_category_id, this.data.vendor_id)
        this.toggleForm = this.data?.modeOfTransport
        this.scheduleTripForm.patchValue({
          trip_id: this.data?.trip_id,
          delivery_date: this.data?.delivery_date,
          dispatch_date: this.data?.dispatch_date,
          //trip_type: this.dummyTRIP,
          vehicle_type: this.data?.vehicle_category_id,
          own_vehicle_number: this?.data.vehicle_master_id,
          vendor_name: this.data?.vendor_id,
          vendor_vehicle_type: this.data?.vehicle_category_id,
          vendor_vehicle_number: this.data?.vehicle_master_id,
          modeOfTransport: this.data?.modeOfTransport,
          vendor_vehicle_reg: this.data?.rc_number ? this.data?.rc_number : null,
          distance: this.data?.distance,
          own_driver: this.data?.vehicle_driver_id,
          vendor_driver_name: this.data?.vendor_driver_name,
          vendor_driver_contact: this.data?.vendor_driver_contact,
          vendor_payment_term: this.data?.vendor_payment_term,
          vendor_amount: this.data?.vendor_amount,
          lr_number: this.data?.lr_number,
          lr_date: this.data?.lr_date,
          lr_issued_by: this.data?.lr_issued_by,
          total_packages: this.data?.total_packages,
          total_weight: this.data?.total_weight,
          freight_type: this.data?.freight_type,
          odometerReading: this.data?.odometerReading,
          advance_amount: this.data?.advance_amount,


        })

        this.get_vehicle_master_byId(this.data.vehicle_master_id)
        this.get_vehicle_driver_by_id(this.data?.vehicle_driver_id)
      
    });
  }








}

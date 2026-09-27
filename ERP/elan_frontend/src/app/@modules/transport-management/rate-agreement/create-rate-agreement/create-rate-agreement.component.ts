import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { environment } from 'src/app/environments/environment';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import Swal from 'sweetalert2';

/* ================= DATE RANGE VALIDATOR ================= */
export const dateRangeValidator: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {

  const from = group.get('valid_from')?.value;
  const to = group.get('valid_to')?.value;

  if (!from || !to) return null;

  const fromDate = new Date(from);
  const toDate = new Date(to);

  return toDate < fromDate ? { invalidDateRange: true } : null;
};

@Component({
  selector: 'app-create-rate-agreement',
  templateUrl: './create-rate-agreement.component.html',
  styleUrls: ['./create-rate-agreement.component.scss']
})
export class CreateRateAgreementComponent implements OnInit {

  createForm: FormGroup;

  formFields = [
    { label: 'Agreement Number Generation Type', name: 'agrno_type', type: 'select', required: true },
    { label: 'Agreement Number', name: 'agreement_no', type: 'text', required: true },
    { label: 'Transporter', name: 'transporter_id', type: 'select', required: true },
    { label: 'Agreement Type', name: 'agreement_type', type: 'select', required: true },
    { label: 'Valid From', name: 'valid_from', type: 'date', required: true },
    { label: 'Valid To', name: 'valid_to', type: 'date', required: true },
    { label: 'Agreement Copy Upload', name: 'agreement_copy', type: 'file', required: true },
  ];

  agrno_typeOptions = [
    { label: 'Manual', value: 'Manual' },
    { label: 'Auto', value: 'Auto' }
  ];

  agreementTypeOptions = [
    { label: 'PER KM', value: 'PER KM' },
    { label: 'PER TRIP', value: 'PER TRIP' },
    { label: 'PER TON', value: 'PER TON' }
  ];

  financial_year_id: number | null;
  entity_id: number | null;
  id:any;
  status:any;
  transporterList: any =[];
  filePath:any;
  folderName:string='rate_agreement_documents';
  isEditMode = false;
  vehicleTypeList: any =[];
  stateList: any =[];
  filteredFromCities: any[] = [];
  filteredToCities: any[] = [];
  dataSource: AbstractControl[] = [];
  detailsData: any[] = [];
  dataFormArray!: FormGroup;

  get rowsFormArray(): FormArray {
    return this.dataFormArray.get('rows') as FormArray;
  }

  constructor(private fb: FormBuilder,private transport_service:TransportManagementService,private toast:ToastrService,
    private activeroute:ActivatedRoute,private route:Router, private accessData: AccessControlService,private location: Location,
    private travelRequest: TravelRequestService,
  ) {
    this.createForm = this.fb.group(
      this.formFields.reduce((acc:any, field:any) => {
        acc[field.name] = field.required ? new FormControl(null, Validators.required) : new FormControl(null);
        return acc;
      }, {}),
      { validators: dateRangeValidator } // DATE VALIDATION
    );
  }
  
  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId(); 
    this.financial_year_id = this.accessData.getFinancialId();

    this.activeroute.queryParams.subscribe((params:any) => {
       this.id=params?.id;
       this.status=params.actionType;
      if(this.id){
        this.getDatabyId(this.id);
        this.getVehicleTypeList();
        this.getAllstates();
        this.getDetailsDatabyId(this.id);
      }
    });
    this.getTransporter();

    /* ============ VALID FROM CHANGE ============ */
    this.createForm.get('valid_from')?.valueChanges.subscribe(from => {
      const toCtrl = this.createForm.get('valid_to');

      if (toCtrl?.value && new Date(toCtrl.value) < new Date(from)) {
        toCtrl.setValue(null);
      }
    });

    this.dataFormArray = this.fb.group({
      rows: this.fb.array([])
    });

    if(this.status=='CreateUpdate'){
      this.addRow();
    }
  }

  getTransporter(){
    this.transport_service.getTransporterMasterListByTransporterTypeId(1).subscribe((res:any)=>{
      if(res){
        this.transporterList = res.data.map((item:any) => ({
          label: `${item?.tm_name} [${item?.tm_code}]`,
          value: item?.id
        }));
      }
    },(err:any)=>{
      this.transporterList = [];
    })
  }

  getOptions(fieldName: string) {
    if (fieldName === 'agrno_type') return this.agrno_typeOptions;
    if (fieldName === 'agreement_type') return this.agreementTypeOptions;
    if (fieldName === 'transporter_id') return this.transporterList;
    return [];
  }

  showHodeField(fieldName: any) {
    if (fieldName === 'agrno_type') {
      let agrnoType = this.createForm.get('agrno_type')?.value;        
      const agreementNoCtrl = this.createForm.get('agreement_no');

      if (agrnoType === 'Manual') {
        agreementNoCtrl?.setValidators([Validators.required]);
        agreementNoCtrl?.enable();
      }

      if (agrnoType === 'Auto') {
        agreementNoCtrl?.clearValidators();
        agreementNoCtrl?.setValue(null);
        agreementNoCtrl?.disable();
      }
      agreementNoCtrl?.updateValueAndValidity();
    }
  }

  onChangefile(event: any, field: any) {
    const file = event.target.files[0];
    if (file) {
      const actualFileName = file.name;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        let imagePath =
          file.type === 'application/pdf'
            ? '/assets/icons/pdfimg.png'
            : e.target.result;
            this.filePath=imagePath;
      };

      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('file', file);

      this.transport_service.uploaddocuments(formData,this.folderName,true).subscribe(
        (res: any) => {
          this.toast.success('Your file has been uploaded successfully. Please submit to continue.')
          const uploadedUrl = res?.url[0];
          this.createForm.controls[field.name].setValue(uploadedUrl);
          field.value = uploadedUrl;
        },
        (err: any) => {
          this.toast.error(`${err?.error?.message}`);
        }
      );
    }
  }

  sevralUrl() {
    return environment.servralUrl + '/uploaded_files/'+this.folderName+'/' ;
  }

  openFileInNewTab(url: string) {
    window.open(this.sevralUrl() + url, '_blank');
  }

  submitForm(){
    this.createForm.markAllAsTouched();
    if (this.createForm.invalid) {
      this.toast.error('All required fields must be filled!');
      return;
    }
    let val=this.createForm.value;
    val.entity_id=this.entity_id;
    val.financial_year_id=this.financial_year_id;
    val.id=this.id;
    
    this.transport_service.createUpdate_rateAgreementMaster(val).subscribe((res:any)=>{
     if(res){
        this.toast.success(res.message);
        setTimeout(() => {
          this.route.navigate(['/master/transport-management/create-rate-agreement'],{ queryParams: { id: res.data.id, actionType: 'CreateUpdate' } });
          //this.goBack();
        }, 2000); // time in milliseconds
      }
    },(err:any)=>{
      this.toast.error(err.error.message);
    })
  }

  getDatabyId(id:any){
    this.transport_service.getRateAgreementById(id).subscribe((res:any)=>{
      if(res){
        let data=res?.data;
        this.isEditMode = true;
        data.agrno_type='Manual';
        this.createForm.patchValue(data);
        this.createForm.get('agreement_no')?.disable();
      }
    },(err:any)=>{

    })
  }

  goBack() {
    this.location.back();
  }

  getVehicleTypeList(){
    this.transport_service.getAll_vehicleType(this.entity_id,'ACTIVE').subscribe((res:any)=>{
      if(res){
        this.vehicleTypeList = res.data;
      }
    },(err:any)=>{
      this.vehicleTypeList = [];
    })
  }

  getAllstates() {
    this.travelRequest.getAllstates().subscribe((res: any) => {
      this.stateList = res.data;
    });
  }

  getDetailsDatabyId(id:any){
    this.transport_service.getRateAgreementDetailsById(id).subscribe((res:any)=>{
      if(res){
        this.detailsData=res?.data;
        if (this.detailsData?.length) {
          this.loadDetailsData(this.detailsData);
        }
      }
    },(err:any)=>{
      this.detailsData=[];
    })
  }

  createRow(): FormGroup {
    return this.fb.group({
      id: [null],
      vehicle_type_id: [null, Validators.required],
      from_state_id: [null, Validators.required],
      from_city_id: [null, Validators.required],
      to_state_id: [null, Validators.required],
      to_city_id: [null, Validators.required],
      rate: [null, Validators.required],
      extra_charge: [null, Validators.required],
      remark: ['', Validators.required]
    },{
      validators: this.fromToLocationValidator // row-level validator
    });
  }

  fromToLocationValidator(control: AbstractControl): ValidationErrors | null {
    const fromState = control.get('from_state_id')?.value;
    const fromCity  = control.get('from_city_id')?.value;
    const toState   = control.get('to_state_id')?.value;
    const toCity    = control.get('to_city_id')?.value;

    if (fromState && toState && fromCity && toCity) {
      if (fromState === toState && fromCity === toCity) {
        return { sameLocation: true };
      }
    }
    return null;
  }

  addRow() {
    const fg = this.createRow();
    const index = this.rowsFormArray.length;

    this.rowsFormArray.push(fg);

    // update table
    this.dataSource = [...this.rowsFormArray.controls];

    this.filteredFromCities[index] = [];
    this.filteredToCities[index] = [];

    this.attachStateListeners(fg, index);
  }

  removeRow(index: number) {
    const rowGroup = this.rowsFormArray.at(index) as FormGroup;
    const rowId = rowGroup.get('id')?.value;

    // Case 1: New row (no DB id) → direct remove
    if (!rowId) {
      this.removeRowFromUI(index);
      return;
    }

    // Case 2: Existing DB row → confirmation required
    Swal.fire({
      title: 'Are you sure?',
      text: 'This record will be deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: () => {
        return new Promise((resolve, reject) => {
          this.transport_service.deleteRateAgreementDetails(rowId).subscribe(
            (res: any) => {
              this.toast.success(res.message);
              this.removeRowFromUI(index);
              this.redirect();
              resolve(res); // ✅ popup close
            },
            (err: any) => {
              this.toast.error(err.error?.message || 'Delete failed');
              Swal.showValidationMessage(
                err.error?.message || 'Something went wrong'
              );
              reject(); // ❌ popup stays open
            }
          );
        });
      }
    });
  }

  private removeRowFromUI(index: number) {
    this.rowsFormArray.removeAt(index);

    this.filteredFromCities.splice(index, 1);
    this.filteredToCities.splice(index, 1);

    this.rowsFormArray.updateValueAndValidity();
    this.dataFormArray.updateValueAndValidity();

    // update table
    this.dataSource = [...this.rowsFormArray.controls];
  }

  attachStateListeners(group: FormGroup, index: number) {
    group.get('from_state_id')?.valueChanges.subscribe(stateId => {
      group.get('from_city_id')?.reset();
      this.filteredFromCities[index] = [];

      if (!stateId) return;

      this.travelRequest.getcitybystateid(stateId).subscribe(res => {
        this.filteredFromCities[index] = res.data || [];
      });
    });

    group.get('to_state_id')?.valueChanges.subscribe(stateId => {
      group.get('to_city_id')?.reset();
      this.filteredToCities[index] = [];

      if (!stateId) return;

      this.travelRequest.getcitybystateid(stateId).subscribe(res => {
        this.filteredToCities[index] = res.data || [];
      });
    });
  }

  onStateChange(stateId: any, index: number, type: 'from' | 'to') {
    if (!stateId) return;

    this.travelRequest.getcitybystateid(stateId).subscribe(res => {
      const cityList = res.data || [];

      if (type === 'from') {
        this.filteredFromCities[index] = cityList;
        this.rowsFormArray.at(index).get('from_city_id')?.reset();
      } else {
        this.filteredToCities[index] = cityList;
        this.rowsFormArray.at(index).get('to_city_id')?.reset();
      }
    });
  }

  loadDetailsData(rows: any[]) {
    this.rowsFormArray.clear();
    this.filteredFromCities = [];
    this.filteredToCities = [];

    rows.forEach((row, i) => {
      const fg = this.createRow();

      this.rowsFormArray.push(fg);
      this.filteredFromCities.push([]);
      this.filteredToCities.push([]);

      this.attachStateListeners(fg, i);

      // PATCH AFTER listeners
      fg.patchValue({
        id: row.id,
        vehicle_type_id: row.vehicle_type_id,
        from_state_id: row.from_state_id,
        from_city_id: row.from_city_id,
        to_state_id: row.to_state_id,
        to_city_id: row.to_city_id,
        rate: this.removeTrailingZero(row.rate),
        extra_charge: this.removeTrailingZero(row.extra_charge),
        remark: row.remark
      });
    });
    // update table
    this.dataSource = [...this.rowsFormArray.controls];
  }

  removeTrailingZero(value: any): any {
    if (value === null || value === undefined) return value;

    const str = value.toString();

    // only remove exact .00
    if (str.endsWith('.00')) {
      return str.slice(0, -3);
    }

    return str;
  }

  onSubmit() {
    if (this.dataFormArray.invalid) {
      this.dataFormArray.markAllAsTouched();
      return;
    }
    const payload = {rateArray:this.dataFormArray.value.rows,rate_agreement_id:this.id}
    
    this.transport_service.createUpdate_rateAgreementdetails(payload).subscribe((res:any)=>{
     if(res){
        this.toast.success(res.message);
        setTimeout(() => {
          this.redirect();
        }, 2000); // time in milliseconds
      }
    },(err:any)=>{
      this.toast.error(err.error.message);
    })
  }

  redirect(){
    this.route.navigate(['/master/transport-management/rate-agreement']);
  }

}
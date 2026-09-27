import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TransportManagementService } from 'src/app/@shared/services/transport-management/transport-management.service';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-create-transporter',
  templateUrl: './create-transporter.component.html',
  styleUrls: ['./create-transporter.component.scss']
})
export class CreateTransporterComponent implements OnInit {

  createForm: FormGroup;

  formFields = [
    { label: 'Transpoter Type', name: 'transporter_type_id', type: 'select', required: true },
    { label: 'Transpoter Name', name: 'tm_name', type: 'text', required: true },
    { label: 'Contact Person Name', name: 'tm_contact_person_name', type: 'text', required: true },
    { label: 'Mobile No.', name: 'tm_contact_number', type: 'number', required: true },
    { label: 'Email ID', name: 'tm_email', type: 'text', required: true },
    { label: 'GSTIN', name: 'tm_gst_number', type: 'text', required: true },
    { label: 'Address', name: 'tm_address', type: 'textarea', required: true },
    { label: 'GST Rate %', name: 'gst_rate', type: 'text' },
    { label: 'Apply RCM', name: 'rcm_check', type: 'checkbox' },
  ];




  financial_year_id: number | null;
  entity_id: number | null;
  id: any;
  status: any;
  transporterTypeList: any = [];
  clientId: number | null;

  constructor(private fb: FormBuilder, private transport_service: TransportManagementService, private toast: ToastrService,
    private activeroute: ActivatedRoute, private router: Router, private accessData: AccessControlService,
        private _configurationalMasterService: ConfigurationalmasterService,

  ) {
   const controls = this.formFields.reduce((acc:any, field:any)=>{

  if(field.type === 'checkbox'){

    acc[field.name] = new FormControl(false);

  }
  else{

    acc[field.name] = field.required
      ? new FormControl(null, Validators.required)
      : new FormControl(null);

  }

  return acc;

},{});


  this.createForm = this.fb.group({

    ...controls,

    tdsList: this.fb.array([
      this.createItemsField()
    ])

  });

  }

  ngOnInit(): void {
    this.entity_id = this.accessData.getEntityId();
    this.financial_year_id = this.accessData.getFinancialId();
    this.clientId = this.accessData.getUser()?.organization_id!;

    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params?.id;
      this.status = params.actionType;
      if (this.id) {
        this.getDatabyId(this.id);
      }
    });
    this.getTransporterType();
    this.getAllTdsData();
  }

  getOptions(fieldName: string) {
    if (fieldName === 'transporter_type_id') return this.transporterTypeList;
    return [];
  }

  get tdsList(): FormArray {

  return this.createForm.get('tdsList') as FormArray;

}
  getTransporterType() {
    this.transport_service.getAll_transporterType(this.entity_id, 'ACTIVE').
      subscribe((res: any) => {
        if (res?.data) {

          let filteredData = res.data;
          if (this.clientId) {
            // 🔹 clientId present → only 3PL
            filteredData = res.data.filter(
              (item: any) => item?.typeCode === '3PL'
            );
          } else {
            // 🔹 clientId not present → exclude 3PL
            filteredData = res.data.filter(
              (item: any) => item?.typeCode !== '3PL'
            );
          }

          this.transporterTypeList = filteredData.map((item: any) => ({
            label: item?.typeName,
            value: item?.id
          }));
        }
      }, (err: any) => {

      })
  }


createItemsField(): FormGroup {
    return this.fb.group({
      tds_id: ['', Validators.required],
      nature: [''],
      nature_id: ['', Validators.required],
      threshold_limit: ['', Validators.required],
      tds_rate: ['', Validators.required],
      maximum_amount: ['',Validators.required]
    });
  }

  addItem() {
    for (let control of this.tdsList.controls) {
      if (control.invalid) {
        control.markAllAsTouched();
        this.toast.warning('Please fill all required fields before adding a new item.')
        return;
      }
    }
    this.tdsList.push(this.createItemsField());
  }

  removeItem(index: number) {
    this.tdsList.removeAt(index);
  }



  tdsData:any=[]
  getAllTdsData = () => {

    this._configurationalMasterService.getAllTdsData(this.entity_id).subscribe((res: any) => {
      this.tdsData = res.data;
    },(err: any) => {
      this.tdsData = []
    });
  }

natureData:any=[]
  getTdsById(data:any,i:any){
    this._configurationalMasterService.getTdsDataByIdVendor(data.id).subscribe((res:any)=>{
    this.natureData[i] = res.data;
    })

     this.tdsList.controls[i]?.get('nature')?.setValue(data.nature)

  }

  getNatureData(data:any,i:any){
    this.createForm.patchValue({
      threshold_limit:data.threshold_limit,
      tds_rate:data.rate,
      maximum_amount:data.maximum_amount
    })
    this.tdsList.controls[i]?.get('threshold_limit')?.setValue(data.threshold_limit)
    this.tdsList.controls[i]?.get('maximum_amount')?.setValue(data.maximum_amount)
    this.tdsList.controls[i]?.get('tds_rate')?.setValue(data.rate)
  }


  submitForm() {
    this.createForm.markAllAsTouched();
    if (this.createForm.invalid) {
      this.toast.error('All required fields must be filled!');
      return;
    }
    let val = this.createForm.value;
    val.entity_id = this.entity_id;
    val.financial_year_id = this.financial_year_id;
    val.id = this.id;

    this.transport_service.createUpdate_transporterMaster(val).subscribe((res: any) => {
      if (res) {
        this.toast.success(res.message);
        setTimeout(() => {
          this.goBack();
        }, 2000); // time in milliseconds
      }
    }, (err: any) => {
      this.toast.error(err.error.message);
    })
  }

  getDatabyId(id: any) {
    this.transport_service.getTransporterMasterById(id).subscribe((data: any) => {
      if (data) {
        let finaldata = data?.data;
        this.createForm.patchValue(finaldata);


     let tdsArray = this.createForm.get('tdsList') as FormArray;

if(finaldata.tdsList.length === 0){

   tdsArray.push(this.createItemsField());

}else{
  this.tdsList.removeAt(0)
}



finaldata.tdsList.forEach((item:any,i:any) => {

  this._configurationalMasterService.getTdsDataByIdVendor(item.tds_id).subscribe((response:any)=>{
          this.natureData[i] = response.data;
          })

  tdsArray.push(
    this.fb.group({

      tds_id: [item.tds_id],
      tds_rate: [item.current_rate],
      nature_id: [item.nature_id],
      nature: [item.nature],
      maximum_amount: [item.maximum_amount],
      threshold_limit: [item.threshold_limit],

    })
  );

});

      }
    }, (err: any) => {

    })
  }

  goBack() {
    this.router.navigate(['master/transport-management/transporter-master']);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ToastrService } from 'ngx-toastr';
import moment from 'moment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-grievance-create',
  templateUrl: './grievance-create.component.html',
  styleUrls: ['./grievance-create.component.scss']
})
export class GrievanceCreateComponent implements OnInit {
  grievanceForm: any;
  id: any;
  personalIdData: any;
  reportingManager: any;
  employeId: any;
  getData: any;
  parm: any;
  firstLastName: any;
  propertyManager: any = [];
  mainId: string | null;
  empId: string | null;
  loginUser: any;
  
  constructor(private fb: FormBuilder, private emp_master: EmpMasterService,
    private _empRegistration: EmpRegistrationService,
    private activetedRoute: ActivatedRoute,
    private route: Router,
    private toast: ToastrService,
    private location: Location) {

    this.grievanceForm = this.fb.group({
      action_manager: new FormControl(null,[Validators.required]),
      subject: new FormControl(null,[Validators.required]),
      reporting_manager: new FormControl(null,[Validators.required]),
      grievance_date: new FormControl(null,[Validators.required]),
      note: new FormControl(null,[Validators.required]),
      comment: new FormControl(null,[Validators.required]),
      grievance_type: new FormControl(null,[Validators.required]),
      record_added_on: new FormControl(null,[Validators.required]),
      employee_id: new FormControl(localStorage.getItem('EmpMainId')),
    })
  }

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);

    this.activetedRoute.queryParams.subscribe(params => {
      this.parm = params;
      this.employeId = this.parm.employee_grievance_id;
      
    })

    this.id = localStorage.getItem('MyEmpId');
    let entity_id = localStorage.getItem("selectedEntityId");
    this._empRegistration.grtEmployeeList(entity_id, this.loginUser?.role).subscribe((res: any) => {
      this.personalIdData = res.data;
      // this.reportingManager = JSON.parse(res.data.reporting_manager);
      this.propertyManager = Array.from(this.personalIdData, (a: any) => `${a.title} ${a.first_name} ${a.last_name}`);
      this.firstLastName = Array.from(this.personalIdData, (a: any) => `${a.first_name} ${a.last_name}`);
      
    })
    if(this.employeId){
      this.getByIdUse();
    }
    this.mainId = localStorage.getItem("EmpMainId");
    
    
    this.emp_master.grievanceAddById(this.mainId).subscribe((res: any) => {
      this.getData = res.data;
      
      this.grievanceForm.patchValue({
        action_manager: this.getData?.action_manager,
      }) 
    })   
  }
  back(){
    history.back();
  }
  goBack() {
    this.location.back();
  }

  getByIdUse() {
    this.emp_master.grievanceAddById(this.employeId).subscribe((res: any) => {
      this.getData = res.data;
      
      this.basicFormPatch(this.getData)
    })
  }

  basicFormPatch(getData: any) {
    this.grievanceForm.patchValue({
      action_manager: getData?.action_manager,
      subject: getData?.subject,
      reporting_manager: getData?.reporting_manager,
      grievance_date: getData?.grievance_date,
      note: getData?.note,
      comment: getData?.comment,
      grievance_type: getData?.grievance_type,
      record_added_on: getData?.record_added_on,

    })
    
  }

  onSubmitForm() {
    
    if (this.grievanceForm.invalid) {
      this.toast.error("Required fields should not be empty", "Fields Error")
      
      return;
    }

    this.empId=localStorage.getItem('EmpMainId');
    
    
    let val = this.grievanceForm.value;
    const data = {
      action_manager: val.action_manager,
      subject: val.subject,
      reporting_manager: val.reporting_manager,
      grievance_date: moment(val.grievance_date).format('YYYY-MM-DD'),
      note: val.note,
      comment: val.comment,
      grievance_type: val.grievance_type,
      record_added_on: moment(val.record_added_on).format('YYYY-MM-DD'),
      employee_id:this.empId
    }
    
    
    // 
    this.emp_master.grievanceCreate(data).subscribe((res: any) => {
      
      if (res.code == 200) {
        this.toast.success(res.message);
        this.route.navigate(['master/ess/grievance']);
      }

    }, (err) => {

      if (err.status === 403) {
        
        this.toast.error('Grievance Failed!');
      }
      else if (err.status == 500) {
        this.toast.error('bad request ')
      }
      else {
        this.toast.error('Grievance failed')
      }
    }
    )
  }

  updateForm() {
    if (this.grievanceForm.invalid) {
      this.toast.error("Required fields should not be empty", "Fields Error")
      
      return;
    }
    // e.stopPropagation();
    this.emp_master.grievanceUpdateById(this.employeId, this.grievanceForm.value).subscribe((res: any) => {
      // this.update=res
      this.toast.success("Grievance Details Updated successfully..")
      // const latlang = { id: this.employeId };
      this.route.navigate(['master/ess/grievance']);
    })
  }
  reLoad() {
    history.back();
  }
}

import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { NgxMatTimepicker24HoursFaceComponent } from 'ngx-mat-timepicker/lib/components/ngx-mat-timepicker-24-hours-face/ngx-mat-timepicker-24-hours-face.component';
import { NgxMatTimepickerClockFace } from 'ngx-mat-timepicker/lib/models/ngx-mat-timepicker-clock-face.interface';
import { NotificationServiceService } from 'src/app/@shared/services/notification/notification-service.service';
import * as moment from 'moment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-timesheet-create',
  templateUrl: './timesheet-create.component.html',
  styleUrls: ['./timesheet-create.component.scss']
})
export class TimesheetCreateComponent implements OnInit {
  timeSheet: FormGroup;
  Others: any;
  empId: any;
  localTime: any;
  wordCount: any;
  words: any;
  @ViewChild("text") text: ElementRef;
  
  @ViewChild('pickerB') pickerB: any;

  @Input() mode: '12h' | '24h' = '24h';

  mainEmployeeData: any;
  extraWords: boolean = false;
  Emp_id_noti: any;
  Emp_name_noti: any;
  Emp_mail_noti: any;
  Emp_role_noti: any;
  Emp_roleID_noti: any;
  employAllData: any;
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  // day = this.now.getDay();
  dates = this.now.getDate();
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.dates }).format('YYYY-MM-DD');
  minDate = moment({ year: this.year - 0, month: this.month, date: this.dates }).format('YYYY-MM-DD');
  constructor(private fb: FormBuilder,
    private empMaster: EmpMasterService,
    private router: Router,
    private toast: ToastrService,
    private _lmsNotification: NotificationServiceService,
    private _empRegistration: EmpRegistrationService,
    private location: Location) {

    this.timeSheet = this.fb.group({
      employee_id: new FormControl(this.mainEmployeeData, [Validators.required]),
      employee_name: new FormControl(null, [Validators.required]),
      manager_name: new FormControl(null, [Validators.required]),
      // contact_no: new FormControl(null, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
      // email: new FormControl(null, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      date_off_request: new FormControl(null, [Validators.required]),
      time_off_request: new FormControl(null, [Validators.required]),
      time_off_taken: new FormControl(null, [Validators.required]),
      time_off_request_reason: new FormControl(null, [Validators.required]),
      // timeRequestReasonOther: new FormControl(null),
      remark: new FormControl(null),
    })
  }
  ngOnInit(): void {
    this._empRegistration.getByUserId(localStorage.getItem("EmpMainId")).subscribe((res) => {
      console.log(res, );
      
      this.timeSheet = this.fb.group({
        employee_id: new FormControl(res.data.employee_id, [Validators.required]),
        employee_name: new FormControl(res.data.first_name, [Validators.required]),
        manager_name: new FormControl(res.data.reporting_manager, [Validators.required]),
        // manager_name: new FormControl(JSON.parse(res.data.reporting_manager),[Validators.required]),
        // contact_no: new FormControl(res.data.mobile_number, [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
        email: new FormControl(res.data.employee_official_email, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
        date_off_request: new FormControl(null, [Validators.required]),
        time_off_request: new FormControl(null, [Validators.required]),
        time_off_taken: new FormControl(null, [Validators.required]),
        time_off_request_reason: new FormControl(null, [Validators.required]),
        // timeRequestReasonOther: new FormControl(null),
        remark: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      })
      
    })
    this.empId = localStorage.getItem("EmpMainId");
    this.getEmployee_information()
  }
  wordCounter() {
    //alert(this.text.nativeElement.value)
    this.wordCount = this.text ? this.text.nativeElement.value.split(/\s+/) : 0;
    this.words = this.wordCount ? this.wordCount.length : 0;
  }

  changedText() {
    if (this.words >= 50) {
      this.extraWords = true;
      this.toast.warning('Please enter within the text limit..', 'Warning Message');
      return
    } else if (this.words < 50)  {
      this.extraWords = false;
    }
  }
  
  back(){
    history.back();
  }
  goBack() {
    this.location.back();
  }
  time:any = [
    '30M','1H','2H',
  ]

  opentime() {
    

    this.pickerB.open()
  }
  closeTimePicker(el: any) {
    
    this.pickerB.close();
    this.timeSheet.controls[this.pickerB.defaultTime].patchValue('565');
  }

  onChangeEvent(e: any) {

    // 
    // 
    
    // var date = new Date();
    // var hour = date.getHours();
    // var min = date.getMinutes();
    // 
    // 
    //  
    // this.timeSheet.controls['time_off_request'].patchValue(hour);
  }

  countryChanged($event: any) {
    this.Others = $event.value;
  }
  // this.localTime = new Date(this.singleEmpData.time_off_request).toLocaleTimeString();
  // timeChangeHandler(e:any){
  //   
  //   // 
  //   this.localTime = new Date(e).getHours();
  //   this.timeSheet.controls['time_off_request'].setValue(this.localTime);
  // }
  reLoad(){
    history.back();
  }
  onSubmit() {
    
    console.log(this.timeSheet.value);
    
    if (this.timeSheet.invalid) {
      this.toast.error("Required fields should not be empty", "Fields Error")
      
      return;
    }
    console.log('Pun eet');
    
    this.empMaster.timeSheetCreate(this.timeSheet.value).subscribe((res: any) => {
      this.create_notification();
      this.toast.success("Time Sheet Created !!");
      this.router.navigate(['master/ess/timesheet-list']);
    },(err) => {
      if (err.status === 403) {
        
        this.toast.error(err.error.message);
      }
      else if (err.status == 500) {
        this.toast.error('bad request ')
      }
      else {
        this.toast.error('Timesheet failed')
      }
    })
  }
  getEmployee_information() {
    this._lmsNotification.get_EmployeeDetails(this.empId).subscribe((res: any) => {
      console.log(res, "information emp");
      this.employAllData=res.data;
      this.Emp_id_noti = res.data.reporting_manager_id
      this.Emp_name_noti = res.data.reporting_manager
      this.Emp_mail_noti = res.data.employee_official_email
      this.Emp_role_noti = res.data.user_role
      this.Emp_roleID_noti = res.data.role_master_id
      
    })
  }
  create_notification(){
    let data=
  [{
    employee_id:this.Emp_id_noti,
    emp_name:this.Emp_name_noti,
    employee_official_email:this.Emp_mail_noti,
    role:this.Emp_role_noti,
    role_id:this.Emp_roleID_noti,
    type:"Time Sheet Request",
    remark: "You has been Reuested By " + this.employAllData?.first_name,
    subject:"subject testing",
    textData:`
    Dear ${this.Emp_name_noti}, <br>
        hello friends.
          <br>   Regards,`,

}]

    this._lmsNotification.create_notification(data).subscribe((responsive:any)=>{
      console.log(responsive);
      // this.toast.success("noti")
      // this.res1=responsive
      console.log(responsive,'responsive');
      
    },
    // (error)=>{
    //   this.toast.error("Somthing went wrong","ERROR")

    // }
    )
    }
}

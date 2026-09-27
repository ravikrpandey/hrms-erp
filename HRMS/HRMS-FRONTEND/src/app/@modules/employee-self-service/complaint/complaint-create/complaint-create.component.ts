import { DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import * as moment from 'moment';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { EmpMasterService } from 'src/app/@shared/services/emp-master.service';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { environment } from 'src/app/environments/environment';
@Component({
  selector: 'app-complaint-create',
  templateUrl: './complaint-create.component.html',
  styleUrls: ['./complaint-create.component.scss'],
  providers: [DatePipe],
})
export class ComplaintCreateComponent {
  createComplaint: FormGroup;
  complaintId: any;
  id: any;
  mainId: any;
  allComplaint: any;
  reportingManager: any;
  employeId: any;
  getData: any;
  parm: any;
  firstLastName: any;
  propertyManager: any = [];
  personalIdData: any;
  nameAchieve: any;
  reportingManagerList: any = [];
  loginUser: any;
  allComplaint2: any;
  propertyManager1: string[];
  propertyManager2: string[];
  reportingManager12: string[];
  propertyManager22: string[];
  complantAgainsts: any[];
  recordBys: any[];
  propertyManager12: any;
  allComplaints: any[];
  complaintAgainsts: any[];
  reportings: any;
  reportingManagerList2: any;
  htmlEditorValue2 = ``;
   @ViewChild('editer') editer: any;
  getAllDepartment: any;
  getAllDepartment2: any;
  departments: any;
  areaList2: any;
  areas: any;
  rowData: any;
  user: any;
  entity_id: string | null;
  financial_year_id: string | null;
  getAllSuperviserData: any;
  fileArray: any[] = [];
  fileArray1: any[] = [];
  fileGetCheck: any;
  constructor(
    private emp_master: EmpMasterService,
    private _empRegistration: EmpRegistrationService,
    private recruitService: RecruitService,
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private route: Router,
    private activeroute: ActivatedRoute,
    private location: Location,
    private _commonService : CommonService,
    private _configurationalMasterService:ConfigurationalmasterService
  ) {
    this.createComplaint = this.fb.group({
      employee_id: new FormControl(null),
      area_id: new FormControl(null),
      dept_id: new FormControl(null),
      allocate_dept_id: new FormControl(null),
      allocate_emp_id: new FormControl(null),
      hr_remark: new FormControl(null),
      assign_to: new FormControl(null),
      comment_Evaluator: new FormControl(null),
      status: new FormControl(null),
      reply_remark: new FormControl(null),
      action_status: new FormControl(null),
      hr_status: new FormControl(null),
      dept_name: new FormControl(null, Validators.required),
      emp_code: new FormControl(null, Validators.required),
      type: new FormControl('DEPARTMENT', Validators.required),
      complaint_description: new FormControl(null, Validators.required),
      created_by: new FormControl(null),
      complaint_type_id: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),

    });
    this.fileArray.push({ imagePath: null, url: null });
    this.fileArray1.push({ imagePath: null, url: null });
  }
  loginUserDetails:any
  status:any;
  isChecked:boolean=false;
  ngOnInit() {
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');;
    this.mainId = localStorage.getItem('EmpMainId');
    this.createComplaint.controls['employee_id']?.setValue(localStorage.getItem('EmpMainId'));
    this.getAchievementList();
    this.getcomplientuser();
    this.getAllIssueType();
    this.getAllSuperviser()
    this.activeroute.queryParams.subscribe((params) => {
      this.id = params;
      this.complaintId = this.id?.complaintId;
      this.status = this.id?.status;
    });
    if(this.complaintId){
      this.getByIdUse();
    }

 this.getAllDepartment_dropDown();
 this.loginUserDetails = localStorage.getItem("loginUserDetails");
 this.loginUserDetails = JSON.parse(this.loginUserDetails)
  
  }
  goBack() {
    this.location.back();
  }

  getcomplientuser = () => {
    this.id = localStorage.getItem('EmpMainId')
    this._commonService?.showLoader()
    this.recruitService
    .getcomplientuser(this.id)
    .subscribe((params: any) => {
      this._commonService?.hideLoader()
      this.user = params.data;  
      console.log("agsfagsf",this.user);
      this.createComplaint.patchValue({
        dept_name:this.user?.employee?.MASTER_DEPARTMENT?.
        department_name,
        emp_code:this.user?.employee?.employee_code,
        name:this.user?.employee?.first_name+' '+this.user?.employee?.last_name
       })
    },(err : any) => {
      this.user = []
      this._commonService?.hideLoader()
    });
  }
  


  getAllManagerList() {
    this._empRegistration.getAllManagersList().subscribe((res: any) => {
      this.reportingManagerList = Array.from(res.data, (a: any) => `${a.first_name} ${a.last_name}`);
      this.reportingManagerList2 = this.reportingManagerList
      this.reportings = this.reportingManagerList.map((res: any) => res);
    })
  }

  complaintFromSearch(e: any) {
    const aa = e
    let filteredVariable = this.allComplaint2.filter((item: any) => aa.includes(item.first_name));
    this.allComplaint = filteredVariable
  }

  complaintAgainstSearch(e: any) {
    const aa = e
    let filteredVariable = this.propertyManager12.filter((item: any) => aa.includes(item));
    this.propertyManager1 = filteredVariable
  }

  recordBySearch(e: any) {
    const aa = e
    let filteredVariable = this.propertyManager22.filter((item: any) => aa.includes(item));
    this.propertyManager2 = filteredVariable
  }

  reportingManagerSearch(e: any) {
    const aa = e
    let filteredVariable = this.reportingManagerList2.filter((item: any) => aa.includes(item));
    this.reportingManagerList = filteredVariable
  }

  getByIdUse() {
    this._commonService?.showLoader()
    this.emp_master.complaintAddById(this.complaintId).subscribe((res: any) => {
      this.getData = res.data;
      this.fileArray = res?.docs?.map((res: any) => ({
        imagePath: '/assets/icons/pdfimg.png',
        url: res?.file_name
      }));
      let data=this.getData[0];
      this.fileArray1 = data?.upload_user_file
      ? [{
          imagePath: '/assets/icons/pdfimg.png',
          url: data?.upload_user_file
        }]
      : [{imagePath:null,url:null}];

      this._commonService?.hideLoader()
      this.basicFormPatch(this.getData[0]);
    },(err:any) => {
      this._commonService?.hideLoader()
    });
  }
  data:any;
  basicFormPatch(getData: any) {
    this.getAllArea(getData?.dept_id);
    this.getAllEmployee(getData?.allocate_dept_id);
     this.data=this.getData;
     console.log("shdfhsf",this.data);
    this.createComplaint.patchValue({
      employee_id: this.data?.employee_id,
      area_id: this.data?.area_id,
      dept_id: this.data?.dept_id,
      type: this.data?.type,
      complaint_description:  this.data?.complaint_description,
      complaint_type_id: this.data?.complaint_type_id,
      hr_remark: this.data?.hr_remark,
      allocate_dept_id: this.data?.allocate_dept_id,
      allocate_emp_id: this.data?.allocate_emp_id,
      assign_to: this.data?.assign_to,
      status: this.data?.complain_status,
      comment_Evaluator: this.data?.comment_Evaluator,
      reply_remark: this.data?.reply_remark,

    });
    if(this.data?.assign_to){
      this.isChecked=true;
    }else{
      this.isChecked=false;
    }

  }
  getAchievementList() {
    this.recruitService.getAllAchivement().subscribe(
      (res: any) => {
        this.allComplaint = res.data;
        this.allComplaint2 = res.data;
        this.allComplaints = this.allComplaint.map((res: any) => res.first_name);
      },
      (err) => {
      }
    );
  }

  onSubmitForm() {
    debugger
    this.createComplaint.markAllAsTouched();
    if (this.createComplaint.invalid) {
      this.toast.error('All required fields must be filled!');
      return;
    }
    if (this.fileArray.some(file => file.url === null)) {
      this.toast.error('Atleast One file Upload!');
      return
    }
    if(this.fileArray){

    }
    let val = this.createComplaint.value;

    const data = {
      created_by:this.loginUserDetails?.employee_id,
      dept_id:val?.dept_id,
       area_id:val?.area_id,
      complaint_description:val?.complaint_description,
     employee_id:val?.employee_id,
     type:val?.type,
     upload_files:this.fileArray,
     complaint_type_id :val?.complaint_type_id,
     entity_id:this.entity_id,
     financial_year_id:this.financial_year_id
    };
    this._commonService?.showLoader()
    this.recruitService.createComplaint(data).subscribe(
      (res: any) => {

        this.toast.success(res.message);
        this.router.navigate(['master/ess/complaint-list']);
        this._commonService?.hideLoader()
      },
      (err) => {
        this._commonService?.hideLoader()
        if (err.status == 400) {
          this.toast.error('Something went Wrong!');
        } else {
          this.toast.error('Error in submission!');
        }
      }
    );

  }
  updateForm(e: any) {
    e.stopPropagation();

    this._commonService?.showLoader()
    let val=this.createComplaint.value;
    let data = {
      hr_remark:val?.hr_remark,
       allocate_emp_id:val?.allocate_emp_id,
       allocate_dept_id:val?.allocate_dept_id,
       type :val?.type,
       comment_Evaluator:val?.comment_Evaluator,
        assign_to:val?.assign_to,
        upload_files:this.fileArray1,
        reply_remark:val?.reply_remark,
        status:val?.status
    };
    if(val?.type=='DEPARTMENT' && this.status=='HR'){
      data.status='ASSIGNED'
    }else if(val?.type=='USER'){
     data.status='REPLIED'
     if (this.fileArray1.some(file => file.url === null)) {
      this.toast.error('file Upload is Required!');
      return
    }
    }
    this.emp_master
      .complaintUpdateById(this.complaintId,data)
      .subscribe((res: any) => {
        this._commonService?.hideLoader()
        this.toast.success('Complaint Details Updated successfully..');
        this.route.navigate(['master/ess/complaint-list']);
      },(err:any) => {
        this._commonService?.hideLoader()
      });
  }
  onUpdateForm() {
    let val = this.createComplaint.value;

    const data = {
      achieved_by: val.complaint_from,
      employee_id: val.employee_id,
      complaint_name: val.complaint_name,
      complaint_against: val.complaint_against,
      reporting_manager: val.reporting_manager,
      complaint_date: val.complaint_date,
      recognized_by: val.recognized_by,
      complaint_description: val.complaint_description,
      badges: val.badges,
      course_employee: val.course_employee,
      status: 'Active',
      recognized_date: val.updatedAt,
      achieve_date: val.achieve_date,
    };
  }

  reLoad() {
    // window.location.reload();
    history.back();
  }
 filterDept:any =[]
  getAllDepartment_dropDown() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._empRegistration.getAllDepartment_dropDown(entity_id).subscribe(
      (res) => {
        this.getAllDepartment = res.data.filter((res: any) => res.status === "ACTIVE");
        this.getAllDepartment2 = this.getAllDepartment;
        this.departments = this.getAllDepartment.map((res: any) => res.department_name);
        this.filterDept = [...this.getAllDepartment2] 
      }
    );
  };
  areaList: any = [];
  getAllArea(evemt: any) {
    this.areaList = [];
    let req = {
      dep_id: evemt?.value??evemt,
    }
    this._configurationalMasterService.getAllArea_active(req).subscribe((res: any) => {
      this.areaList = res.data
      this.areaList2 = res.data
      this.areas = res.data.map((item: any) => item.area_name)
      this.areaList = [...this.areaList2]
    })
  }




  departmentSearch(e: any) {
    const aa = e
    let filteredVariable = this.getAllDepartment2.filter((item: any) => aa.includes(item.department_name));
    this.getAllDepartment = filteredVariable
  }
  areaSearch(e: any) {
    const aa = e
    let filteredVariable = this.areaList2.filter((item: any) => aa.includes(item.area_name));
    this.areaList = filteredVariable
  }
  getAllIssueType(){
    this._configurationalMasterService.get_all_complaint_typeActive(this.entity_id,this.financial_year_id).subscribe((res:any)=>{
       if(res){
        this.rowData=res.data;
       }
    },(err:any)=>{

    })
  }
  getAllSuperviser() {
    let entity_id = localStorage.getItem("selectedEntityId");
    this._empRegistration.grtEmployeeList(entity_id, this.loginUser?.role).subscribe((res: any) => {

      this.getAllSuperviserData = res.data;


    });
  }
   onChangefile(event: any, index: number) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imagePath =
            file.type === 'application/pdf'
              ? '/assets/icons/pdfimg.png'
              : e.target.result;
          this.fileArray[index].imagePath = imagePath;
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        this.fileGetCheck = formData;
        formData.append('file', file);
        this.recruitService.uploaddocumentsUpdate(formData).subscribe(
          (res: any) => {
            this.toast.success('File Uploaded Successfully');
            this.fileArray[index].url = res?.url;
          },
          (err: any) => {
            this.toast.error(`${err?.error?.message}`);
          }
        );
      }
    }
   onChangefile1(event: any, index: number) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const imagePath =
            file.type === 'application/pdf'
              ? '/assets/icons/pdfimg.png'
              : e.target.result;
          this.fileArray1[index].imagePath = imagePath;
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        this.fileGetCheck = formData;
        formData.append('file', file);
        this.recruitService.uploaddocumentsUpdate(formData).subscribe(
          (res: any) => {
            this.toast.success('File Uploaded Successfully');
            this.fileArray1[index].url = res?.url;
          },
          (err: any) => {
            this.toast.error(`${err?.error?.message}`);
          }
        );
      }
    }
    addFileInput(index: number) {
      if (this.fileGetCheck !== undefined) {
        this.fileArray.splice(index + 1, 0, { imagePath: null, url: null });
        this.fileGetCheck = undefined;
      } else {
        this.toast.warning('First Upload The File.');
      }
    }

    removeFileInput(index: number) {
      if (this.fileArray.length > 1) {
        this.fileArray.splice(index, 1);
      } else {
        this.toast.warning('At least one file input must be present.');
      }
    }
    sevralUrl() {
      return environment.serverUrl + '/uploaded_files/';
    }
    openFileInNewTab(url: string) {
      window.open(this.sevralUrl() + url, '_blank');
    }
    dep_Employee:any=[];
    getAllEmployee(event:any){
      this._configurationalMasterService.getall_employeeby_dept_id(event?.value??event).subscribe((res:any)=>{
        if(res){
           this.dep_Employee=res.data
        }
      },(err:any)=>{

      })
    }

}

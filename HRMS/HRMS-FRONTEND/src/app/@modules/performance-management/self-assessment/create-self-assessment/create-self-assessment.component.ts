import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { environment } from 'src/app/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewAssessmentComponent } from '../view-assessment/view-assessment.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SelfAssessmentService } from 'src/app/@shared/services/performance-management/self-assessment.service';
import { saveAs } from 'file-saver';
import { CommonService } from 'src/app/@shared/services/common.service';
@Component({
  selector: 'app-create-self-assessment',
  templateUrl: './create-self-assessment.component.html',
  styleUrls: ['./create-self-assessment.component.scss']
})
export class CreateSelfAssessmentComponent {
  employeeDetail:FormGroup;
  technicalAssement:FormGroup;
  behaviorAssessment:FormGroup;
  skillDevelopmentForm:FormGroup;
  suggestSkillDevelopmentForm:FormGroup;
  endDate:any;
  startDate:any;
  sdpEndDate:any;
  sdpStartDate:any;
  entity_id: any;
  financial_id: any;
  techAssessment: any = [];
  selfAssessmentRating: any = [];
  selfEmployee: any = [];
  EmpMainId: string | null;
  currentDate:any;
  Competence: string[] = ['Leadership','Innovation','Ethic','Excellence','Accountability']
  baseUrl = environment.serverUrl;
  skill_document: any;
  loginUser: any;
  Rating_status: any = "Pending For Manager Review";
  yearly_assessment_id: any;
  endpoints: { id:any,financial_id: any; entity_id: any; employee_id: any; };
  getAllBehavior: any= [];
  getSkillDevelopment: any = [];
  getKpaMaster: any = [];
  paramsType: any;
  financial_year_id: any;
  paramsEndpoints: { entity_id: any; financial_id: any; employee_id: string | null;behavioural_average_rating:any;technical_average_rating:any };
  assessmentName: any;
  kpa_assessment: any = [];
  isDisabled: boolean = false;
  isDisabledSkill: boolean = false;
  emp_id: any;
  endpoints2: { financial_id: number; entity_id: number; employee_id: number; };
  minStartDate:any = null;
  minEndDate:any = null; 
  id: any;
  minEndDate2:any = [];
  mode: any;
  submitted_assessment_id:any = null;
  Months: string[];
  finalRatings2: any = [];
  finalRatings1: any = [];
  primary_key_id: any;
  behaviorAssessmentValue: any;
  technicalAssementValue: any;
  isButtonDisabled: boolean = false;
  ini_date: any = [];
  end_date: any = [];
  s_date: string;
  e_date: string;
  technicalAvgRating: number = 0;
  behaviorAvgRating: number = 0;
  suggestSkillDevelopment: any;
  isDisabledSkill2: boolean = false;

  constructor(private fb: FormBuilder, private selfAssessmentService:SelfAssessmentService,
    private _commonService: CommonService, 
    private toaster: ToastrService, private route: Router, private activeroute:ActivatedRoute, public dialog: MatDialog,){
    this.employeeDetail = this.fb.group({
      emp_name:[''],
      emp_number:[''],
      department_name:[''],
      area_name:[''],
      hierarchical_superio:[''],
      start_date:[''],
      end_date:[''],
      assessment_name:[''],
      manag:['']
    });

    this.technicalAssement = this.fb.group({
      technicalItems:this.fb.array([])
    });

    this.behaviorAssessment = this.fb.group({
      behaviorItems:this.fb.array([])
    });

    for(let data of this.Competence){
      this.behaviorItems.push(
        this.fb.group({
          self_rating_id:[null,[Validators.required]],
          manager_rating_id:[null,[Validators.required]],
          Competence: [data],
          final_rating: [null,[]]
        })
      )
    }

    this.suggestSkillDevelopmentForm = this.fb.group({
      manager_remark: [''],
      remark_by_employee:[''],
      current_date:[''],
      suggestDevelopment:this.fb.array([
        this.fb.group({
          development:['',[Validators.required]],
        })
      ])
    });

    this.skillDevelopmentForm = this.fb.group({
      remark: [''],
      items:this.fb.array([
        
      ])
    });

    this.activeroute.queryParams.subscribe((params: any) => {
      this.id = params.id;
      this.paramsType = params.type;
      this.mode = params.mode;
      this.yearly_assessment_id = Number(params?.id);
      this.financial_year_id = params.financial_year_id;
      this.assessmentName = params?.assessment_name;
      this.emp_id = params?.employee_id;
      this.primary_key_id = params?.primary_key_id
    });
  }

  send(){
    console.log("hi i am calling")
  }

  get items(){
    return this.skillDevelopmentForm.get('items') as FormArray;
  }

  get behaviorItems(){
    return this.behaviorAssessment.get('behaviorItems') as FormArray;
  }

  get suggestDevelopment(){
    return this.suggestSkillDevelopmentForm.get('suggestDevelopment') as FormArray;
  }
  
  get technicalItems(){
    return this.technicalAssement.get('technicalItems') as FormArray;
  }

  getMonth(){
    this.Months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  }


  CurrentDate:any =[]
  ngOnInit(){
    this.localStorage();
    this.getMonth() 
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    this.CurrentDate = formattedDate
    console.log("Formatted Date:", formattedDate);
    this.suggestSkillDevelopmentForm.controls['current_date'].setValue(formattedDate)
    if ( this.mode != "innitiate"  ) {
      this.SelfAssessentRating();
    }
    if ( this.mode == "innitiate" ) {
      this.getKpi()
      this.SelfAssessentRating();
      this.getEmployee();
    }
    if( this.mode != "innitiate" && ( this.paramsType == "view" || this.mode == "view" || this.mode == "edit" ) ){
      this.getCompleteSelfAssessment();
    }
    else{
      this.addRow();
    }
  }

  convert(dateString: string): string {
    if (!dateString) {
      return '';
    }
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); 
    const dayFormatted = ('0' + date.getDate()).slice(-2);
    const monthFormatted = ('0' + (date.getMonth() + 1)).slice(-2);
    const yearFormatted = date.getFullYear();
    return `${dayFormatted}-${monthFormatted}-${yearFormatted}`;
  }

  employeeRemark:any =[]
  ManagerRemark:any =[]
  async getCompleteSelfAssessment() {
    let paramsEndpoints = {
      entity_id: this.entity_id,
      financial_id: this.financial_year_id,
      employee_id: this.emp_id,
      yearly_assessment_id: this.yearly_assessment_id,
    }
    
    this._commonService?.showLoader();
    
    try {
      const res = await this.selfAssessmentService.getCompleteSelfAssessment(
        paramsEndpoints.entity_id,
        paramsEndpoints.financial_id,
        paramsEndpoints.employee_id,
        paramsEndpoints.yearly_assessment_id,
        this.EmpMainId
      ).toPromise();
      
      this._commonService?.hideLoader();
      
      if (res.code === 200) {
        this.getAllBehavior = res.data.behavioral_assessments;
        this.submitted_assessment_id = res.data.submitted_assessment_id;
        
        this.s_date = this.convert(res.data.start_date);
        this.e_date = this.convert(res.data.end_date);
        
        this.employeeDetail.patchValue({
          emp_name: res.data.first_name,
          emp_number: res.data.employee_code,
          department_name: res.data.department_name,
          area_name: res.data.area_name,
          hierarchical_superio: res.data.reporting_manager,
          start_date: res.data.start_date,
          end_date: res.data.end_date,
          assessment_name: res.data.assessment_name 
        });
        this.isDisabled = true;
        if (this.getAllBehavior.length > 0) {
          for (let i = 0; i < this.getAllBehavior.length; i++) {
            const element = this.getAllBehavior[i];
            let findIndex = this.Competence.findIndex(value => value === element.competence);
            if (findIndex !== -1) {
              const formGroup = this.behaviorItems.at(findIndex) as FormGroup;
              formGroup.patchValue({
                self_rating_id: element.self_rating_id || null,
                final_rating: element.final_rating || null,
                manager_rating_id: element.manager_self_rating || null,
              });
              this.behaviorItems.controls[findIndex]?.get('self_rating_id')?.disable();
              if (this.mode === "view" ) {
                this.behaviorItems.controls[findIndex]?.get('self_rating_id')?.disable();
              }
              if ( this.mode === "view") {
                this.behaviorItems.controls[findIndex]?.get('manager_rating_id')?.disable()
                
              }
            }
          }
        }
        
        this.getSkillDevelopment = res.data.skill_development_plans;
        this.getKpaMaster = res.data.getKpaMaster;
        this.techAssessment = res.data.technical_assessments;
        this.suggestSkillDevelopment = res.data.suggest_skill_development_plans;
        this.kpa_assessment = this.techAssessment;
        this.createTecnicalField();
        if (this.kpa_assessment?.length > 0) {
          for (let i = 0; i < this.kpa_assessment.length; i++) {
            const element = this.kpa_assessment[i];
            const formGroup = this.technicalItems.at(i) as FormGroup;
            formGroup.patchValue({
              self_rating_id: element.kpa_self_rating_id,
              manager_rating_id: element.kpa_manager_rating_id,
              final_rating: element.kpa_final_rating
            });
            this.technicalItems.controls[i]?.get('self_rating_id')?.disable();
            if (this.mode === "view") {
              this.technicalItems.controls[i]?.get('self_rating_id')?.disable();
              
            }
            
            if (this.mode === "view" ) {
              this.technicalItems.controls[i]?.get('manager_rating_id')?.disable()
            

            }
          }
        }
        
        // Skill Development Plans
        if (this.getSkillDevelopment.length > 0) {
          for (let i = 0; i < this.getSkillDevelopment.length; i++) {
            const element = this.getSkillDevelopment[i];
            this.items.push(this.fb.group({
              development: [''],
              action_plan: [''],
              initiate_date: [null],
              end_date: [null],
              files: ['']
            }));
            const formGroup = this.items.at(i) as FormGroup;
            this.ini_date[i] = this.convert(element.initiate_date);
            this.end_date[i] = this.convert(element.end_date);
            formGroup.patchValue({
              development: element.need_for_development || "",
              action_plan: element.action_plan || "",
              initiate_date: element.initiate_date || null,
              end_date: element.end_date || null,
              files: element.file_document
            });
            
            if (this.mode === 'view') {
              this.isDisabledSkill = true;
            }
            if (this.mode === 'edit') {
              this.isDisabledSkill2 = true;
            }
          }
        }
        // Suggest Skill Development Loop
        if (this.suggestSkillDevelopment.length > 0) {
          for (let i = 0; i < this.suggestSkillDevelopment.length; i++) {
            if (i > 0) {
              this.suggestDevelopment.push(this.fb.group({
                development: ['']
              }));
            }
            const formGroup = this.suggestDevelopment.at(i) as FormGroup;
            formGroup.patchValue({
              development: this.suggestSkillDevelopment[i].need_for_development || ""
            });
          }
        }
        // Suggest Skill Development Form
        this.suggestSkillDevelopmentForm.patchValue({
          remark_by_employee: res.data.remark,
          manager_remark: res.data.manager_remark
        });
        this.employeeRemark = res.data.remark,
        this.ManagerRemark = res.data.manager_remark
        if (this.mode === "view") {
          this.suggestSkillDevelopmentForm.get('remark_by_employee')?.disable();
        }
        if (this.mode === "view") {
          this.suggestSkillDevelopmentForm.get('remark')?.disable();
        }
        
      }
    } catch (err) {
      this._commonService?.hideLoader();
      console.error(err);
    }

  }
  
  getSelfAssessment(){
    let paramsEndpoints = {
      entity_id: this.entity_id,
      financial_id: this.financial_year_id,
      employee_id: this.emp_id,
      submit_assessment_id: this.yearly_assessment_id,
    }
    this._commonService?.showLoader()
    this.selfAssessmentService.getSelfAssessment(paramsEndpoints).subscribe((res:any)=>{
      this._commonService?.hideLoader()
      if(res.code == 200){
        this.getAllBehavior = res.data.getAllBehavior;
        this.getSkillDevelopment = res.data.getSkillDevelopment;
        this.getKpaMaster = res.data.getKpaMaster;
        if(this.getKpaMaster.length >0){
          this.kpa_assessment = [];
          this.getKpaMaster?.forEach(async (element:any,index:any) => {
            const formGroup = await this.technicalItems.at(index) as FormGroup;
            formGroup.patchValue({
              self_rating_id: element.self_rating_id
            });
            this.technicalItems.controls[index]?.get('self_rating_id')?.disable();
          });
          this.techAssessment.forEach((kpadata:any) => {
            this.getKpaMaster.forEach((technical_assessment:any) => {
              if(kpadata.id === technical_assessment.kpa_id){
                this.kpa_assessment.push(kpadata);
              }
            });
          });
        }
        if(this.getAllBehavior.length>0){
          this.getAllBehavior.forEach(async (element:any,index:any) => {
            const formGroup = await this.behaviorItems.at(index) as FormGroup;
            formGroup.patchValue({
              self_rating_id: element.self_rating || null
            });
            this.behaviorItems.controls[index]?.get('self_rating_id')?.disable();
          });
        }
        if(this.getSkillDevelopment.length>0){
          this.getSkillDevelopment.forEach(async (element:any,index:any) => {
            this.items.push(
              this.fb.group({
                development:[''],
                action_plan:[''],
                initiate_date:[null],
                end_date: [null],
                files:['']
              })
            )
            const formGroup = await this.items.at(index) as FormGroup;
            formGroup.patchValue({
              development: element.need_for_development || "",
              action_plan:element.action_plan || "",
              initiate_date:element.initiate_date || null,
              end_date:element.end_date || null,
              files:element.file_document
            });
            // this.getFileName(index);
            this.skillDevelopmentForm.patchValue({
              remark:element.remarks
            });
            if (this.mode == 'view'){
              this.isDisabledSkill = true;
            }
            if (this.mode == 'edit'){
              this.isDisabledSkill2 = true;
            }
          });
          this.skillDevelopmentForm.get('remark')?.disable();
        }
      }
    },(err:any) => {
      this._commonService?.hideLoader()
    })
  }

  getFileName(index: number): string {
    const file:any = this.items.at(index).get('files')?.value as File;
    return file
  }

  getFileExtension(index: number): string {
    const file:any = this.items.at(index).get('files')?.value as File;
    const parts = file.split('.');
    return parts.length > 1 ? `.${parts.pop()}` : '';
  }

  download(url: string, index:number): void {
    let name = this.getFileName(index)
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
        if (xhr.status === 200) {
            const blob = xhr.response;
            const reader = new FileReader();
            reader.onload = function () {
                // Create a link element to trigger download
                const link = document.createElement('a');
                link.href = reader.result as string;
                link.download = name;
                link.click();
            };
            reader.readAsDataURL(blob);
        } else {
            console.error('Download failed:', xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Request failed');
    };

    xhr.send();
  }

  download2(url: string, index:number): void {
    
    let name = this.getFileName(index)
    window.open(url, '_blank');
  };

  downloadFileUsingXHR(url: string, fileName: string): void {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
        if (xhr.status === 200) {
            const blob = xhr.response;
            const reader = new FileReader();
            reader.onload = function () {
                // Create a link element to trigger download
                const link = document.createElement('a');
                link.href = reader.result as string;
                link.download = fileName;
                link.click();
            };
            reader.readAsDataURL(blob);
        } else {
            console.error('Download failed:', xhr.statusText);
        }
    };

    xhr.onerror = function () {
        console.error('Request failed');
    };

    xhr.send();
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  createTecnicalField(){
    if ( this.mode != "innitiate") {
      for(let data of this.kpa_assessment){
        this.technicalItems.push(
          this.fb.group({
            self_rating_id:[null,[Validators.required]],
            kpa_id:[data.kpa_master_id],
            final_rating:[null],
            manager_rating_id:[null,[Validators.required]]
          })
        )
      }
    }else {
      for(let data of this.kpa_assessment){
        this.technicalItems.push(
          this.fb.group({
            self_rating_id:[null,[Validators.required]],
            kpa_id:[data.id],
            final_rating:[null]
          })
        )
      }
    }
  }

  startDateValidator(index: number, items: AbstractControl[]): ValidatorFn {
    return (group: AbstractControl): { [key: string]: any } | null => {
      const initiateDate = items[index]?.get('initiate_date')?.value;
      const endDate = items[index]?.get('end_date')?.value;
      const previousEndDate = items[index - 1]?.get('end_date')?.value;
      if(endDate && endDate <= initiateDate){
        return { 'currentendDateInvalid': true };
      }
      return initiateDate && initiateDate < previousEndDate
        ? { 'startDateInvalid': true }
        : null;
    };
  }

  endDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const parentGroup = control.parent as FormGroup | null;
    if (!parentGroup) {
      return null;
    }
  
    const startDate = parentGroup.controls['initiate_date'].value;
    const endDate = control.value;
  
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return { 'endDateInvalid': true };
    }
    if (startDate && endDate && new Date(startDate) < new Date(endDate)) {
      parentGroup.controls['initiate_date'].setErrors(null);
      parentGroup.controls['initiate_date'].updateValueAndValidity();
    }
    return null;
  }
  

  addRow(){
    const newRowIndex = this.items.length;
    this.items.push(
      this.fb.group({
        development:['',[Validators.required]],
        action_plan:['',[Validators.required]],
        initiate_date:[null,[Validators.required,this.startDateValidator(newRowIndex,this.items.controls)]],
        end_date: [null,[Validators.required,this.endDateValidator]],
        files:['']
      })
    )
  }

  romoveRow(index:any){
    this.items.removeAt(index);
  }

  SuggestAddRow(){
    this.suggestDevelopment.push(
      this.fb.group({
        development:['',[Validators.required]],
      })
    )
  }

  romoveSuggestRow(index:any){
    this.suggestDevelopment.removeAt(index);
  }

  getKpi(){
    this.selfAssessmentService.getSelfAssessentKpi(this.endpoints2).subscribe((res:any)=>{
      if(res.code == 200){
        this.techAssessment = res.data;
        this.kpa_assessment = this.techAssessment;
        this.createTecnicalField();
      }  
    });
  }

  back(){
    this.route.navigate([`/master/performance/team-performance-assessment`], { queryParams: { type: this.paramsType }})
  }

  SelfAssessentRating(){
    this._commonService?.showLoader()
    this.selfAssessmentService.getSelfAssessentRating().subscribe((res:any)=>{
      this._commonService?.hideLoader()
      this.selfAssessmentRating = res.data;
    },(err:any) => {
      this._commonService?.hideLoader()
    });
  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    this.loginUser = JSON.parse(a);
    this.EmpMainId = this.loginUser.employee_id;
    this.financial_year_id = localStorage.getItem('financial_id');
    this.entity_id = JSON.parse(entity);
    this.setEndPoint();
    this.paramsEndpoints ={
      entity_id: this.entity_id,
      financial_id: this.financial_year_id,
      employee_id: this.EmpMainId,
      behavioural_average_rating: null,
      technical_average_rating: null
    }
  }

  setEndPoint(){
    this.endpoints = {
      id: Number(this.id),
      financial_id :Number(this.financial_year_id),
      entity_id : Number(this.entity_id),
      employee_id : Number(this.emp_id),
    }
    this.endpoints2 = {
      financial_id :Number(this.financial_year_id),
      entity_id : Number(this.entity_id),
      employee_id : Number(this.EmpMainId),
    }
  }

  
  getEmployee(){
    this.selfAssessmentService.getSelfAssessentemployee(this.endpoints).subscribe((res:any)=>{
      if(res.code ==200){
        this.selfEmployee = res.data[0];
        this.employeeDetail.patchValue({
          emp_name:this.selfEmployee.first_name,
          emp_number:this.selfEmployee.employee_code,
          department_name:this.selfEmployee.department_name,
          area_name:this.selfEmployee.area_name,
          hierarchical_superio:this.selfEmployee.reporting_manager,
          start_date:this.selfEmployee.start_date,
          end_date:this.selfEmployee.end_date,
        });

        this.isDisabled = true;
    
      }
    });
  }

  onManagerRatingChange2(e:any,i:any){
    let ManagerRatingIndex = 0;
    let userRatingIndex = 0;
    let finalIndex = 0;

    let id = this.behaviorItems?.controls[i]?.get('self_rating_id')?.value;
    this.selfAssessmentRating.forEach((value:any,ind:any) => {
      if ( value.id  == id ) {
        userRatingIndex = ind;
      }
    })
    this.selfAssessmentRating.forEach((value:any,ind:any) => {
      if ( value.id  == e.target.value ) {
        ManagerRatingIndex = ind;
      }
    })
    let avgRating = (Number(this.selfAssessmentRating[ManagerRatingIndex].self_rating_value) + Number(this.selfAssessmentRating[userRatingIndex].self_rating_value))/2;
    avgRating =  Math.round(avgRating);
    if ( avgRating == 1.00 ) {
      avgRating = 0.00
    }
    this.selfAssessmentRating.forEach((value:any,ind:any) => {
      if ( Number(value.self_rating_value)  == Number(avgRating) ) {
        this.finalRatings2[i] = ind;
      }
    })
  }

  onManagerRatingChange1(e:any,i:any){
    let ManagerRatingIndex = 0;
    let userRatingIndex = 0;
    let finalIndex = 0;
    let id = this.technicalItems?.controls[i]?.get('self_rating_id')?.value;
    this.selfAssessmentRating.forEach((value:any,ind:any) => {
      if ( value.id  == id ) {
        userRatingIndex = ind;
      }
    })
    this.selfAssessmentRating.forEach((value:any,ind:any) => {
      if ( value.id  == e.target.value ) {
        ManagerRatingIndex = ind;
      }
    })
    let avgRating = (Number(this.selfAssessmentRating[ManagerRatingIndex].self_rating_value) + Number(this.selfAssessmentRating[userRatingIndex].self_rating_value))/2;
    avgRating =  Math.round(avgRating);
    if ( avgRating == 1.00 ) {
      avgRating = 0.00
    }
    this.selfAssessmentRating.forEach((value:any,ind:any) => {
      if ( Number(value.self_rating_value)  == Number(avgRating) ) {
        this.finalRatings1[i] = ind;
      }
    })

   
  }

  uploadDoc(index:any,evemt: any) {
    try {
      const formData = new FormData();
      if (evemt.target.files && evemt.target.files[0]) {
        formData.append('file', evemt.target.files[0]);
      }
      this.selfAssessmentService.documents(formData).subscribe((response: any) => {
        if (response) {
          this.skill_document = response?.url;
          this.patchFilesValue(index, this.skill_document);
        }
      }, err => {
        console.log(err);
      })
    } catch (error) {
      console.log(error);
    }
  }

patchFilesValue(formGroupIndex: number, filesValue: any) {
  const formGroup = this.items.at(formGroupIndex) as FormGroup;
  formGroup.get('files')?.patchValue('/uploaded_files/'+filesValue);
}

onStartDateChange(event: MatDatepickerInputEvent<Date>,i:any) {
  const startDate = event.value ? new Date(event.value) : null;
  const nextDay = startDate ? new Date(startDate) : null;
  nextDay && startDate ? nextDay.setDate(startDate.getDate() + 1) : null;
  this.minEndDate2[i] = nextDay;
  (this.skillDevelopmentForm.get('items') as FormArray).at(i).get('end_date')?.setValue(null);
}

onEndDateChange(event: MatDatepickerInputEvent<Date>,i:any) {
  const endDate : any = event.value ? new Date(event.value) : null;
  const formattedDate = this.formatDate(endDate);
  (this.skillDevelopmentForm.get('items') as FormArray).at(i).get('end_date')?.setValue(formattedDate);
}

formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
  const day = date.getDate().toString().padStart(2, '0'); 
  return `${day}-${month}-${year}`;
}

view(kpiData:any) {
  const dialogRef = this.dialog.open(ViewAssessmentComponent, {
    data: { data:kpiData, action: "view" },
    width: '500px',
  });

  dialogRef.afterClosed().subscribe((result) => {
    // this.reloadCurrentRoute();
  });
}

  // onSubmit() {
  //   debugger
  //   this.paramsEndpoints.employee_id = this.emp_id;
  //   if (this.skillDevelopmentForm.invalid || this.technicalAssement.invalid || this.behaviorAssessment.invalid || this.suggestSkillDevelopmentForm.invalid || this.suggestDevelopment.invalid) {
  //     this.items.controls.forEach(control => {
  //       control.markAllAsTouched();
  //     });

  //     this.behaviorItems.controls.forEach(control => {
  //       control.markAllAsTouched();
  //     });
  
  //     this.technicalItems.controls.forEach(control => {
  //       control.markAllAsTouched();
  //     });
  
  //     this.suggestDevelopment.controls.forEach(control => {
  //       control.markAllAsTouched();
  //     });
  
  //     this.suggestSkillDevelopmentForm.controls['remark'].markAllAsTouched();
  //     return;
  //   }

  //   this.behaviorAssessment.value.behaviorItems = this.behaviorAssessment.value.behaviorItems.map((item: any, i: any) => {
  //     item.self_rating_id = this.behaviorItems?.controls[i]?.get('self_rating_id')?.value;
  //     return item;
  //   });
  
  //   this.technicalAssement.value.technicalItems = this.technicalAssement.value.technicalItems.map((item: any, i: any) => {
  //     item.self_rating_id = this.technicalItems?.controls[i]?.get('self_rating_id')?.value;
  //     return item;
  //   });
  //   this.technicalAvgRating = 0;
  //   let ratingStatus = "Manager Review Completed"; 
  //   if (ratingStatus === "Manager Review Completed") {
  //     ratingStatus = "Pending For Approval";
  //   }
  //   const textareaValue = (document.getElementById("manager_remark") as HTMLTextAreaElement)?.value;
  //   let payload = {
  //     skillDevelopmentForm: this.skillDevelopmentForm.value,
  //     behaviorAssessment: this.behaviorAssessment.value,
  //     technicalAssement: this.technicalAssement.value,
  //     yearly_assessment_id: this.yearly_assessment_id,
  //     manager_remark:textareaValue,
  //     remark: this.suggestSkillDevelopmentForm.controls['remark_by_employee'].value,
  //     suggestSkillDevelopmentForm: this.suggestSkillDevelopmentForm.value,
  //     date: this.suggestSkillDevelopmentForm.value.current_date,
  //     rating_status: ratingStatus,  
  //     submitted_assessment_id: this.primary_key_id,
  //   };
    
  //   this.paramsEndpoints.behavioural_average_rating = this.behaviorAvgRating;
  //   this.paramsEndpoints.technical_average_rating = this.technicalAvgRating;
  //   this.isButtonDisabled = true;
  //   this._commonService?.showLoader();
  //   this.selfAssessmentService.updateAssessment(this.paramsEndpoints, payload).subscribe((res: any) => {
  //    console.log("hi i am ravindra yadav",res, payload)
  //     this._commonService?.hideLoader();
  //     if (res.code == 200) {
  //       this.toaster.success(res.message);
  //       setTimeout(() => {
  //         this.route.navigate(['/master/performance/team-performance-assessment'], { queryParams: { type: this.paramsType } });
  //       }, 500);
  //     } else {
  //       this.toaster.error(res.message);
  //     }
  //   }, err => {
  //     this._commonService?.hideLoader();
  //     this.toaster.error(err.error.message);
  //     this.isButtonDisabled = false;
  //   });
    
  // }
  
  






  onSubmit(){
    this.paramsEndpoints.employee_id = this.emp_id
    if(this.skillDevelopmentForm.invalid || this.technicalAssement.invalid || this.behaviorAssessment.invalid || this.suggestSkillDevelopmentForm.invalid || this.suggestDevelopment.invalid ){
      this.items.controls.forEach(control => {
        control.markAllAsTouched(); 
      });
      
      this.behaviorItems.controls.forEach(control => {
        control.markAllAsTouched(); 
      });
      
      this.technicalItems.controls.forEach(control => {
        control.markAllAsTouched(); 
      });

      this.suggestDevelopment.controls.forEach(control => {
        control.markAllAsTouched();
      })

      this.suggestSkillDevelopmentForm.controls['remark'].markAllAsTouched();
      return
    }
    
    this.behaviorAssessment.value.behaviorItems = this.behaviorAssessment.value.behaviorItems.map((item:any, i : any) => {
      item.self_rating_id = this.behaviorItems?.controls[i]?.get('self_rating_id')?.value
      return item;
    })
    this.technicalAssement.value.technicalItems = this.technicalAssement.value.technicalItems.map((item:any, i : any) => {
      item.self_rating_id = this.technicalItems?.controls[i]?.get('self_rating_id')?.value
      return item;
    })
    // this.technicalAvgRating += parseInt(this.selfAssessmentRating[this.finalRatings1[0]]?.self_rating_value)
    
    this.technicalAssement.value.technicalItems.map((item:any, i : any) => {
      this.technicalAvgRating += parseInt(this.selfAssessmentRating[this.finalRatings1[i]]?.self_rating_value)
    })

    this.technicalAvgRating = this.technicalAvgRating/(this.technicalAssement.value.technicalItems.length);
    
    this.behaviorAssessment.value.behaviorItems.map((item:any, i : any) => {
      this.behaviorAvgRating += parseInt(this.selfAssessmentRating[this.finalRatings2[i]]?.self_rating_value)
    })

    this.behaviorAvgRating = this.behaviorAvgRating/(this.behaviorAssessment.value.behaviorItems.length);
    
    let payload = {
      skillDevelopmentForm: this.skillDevelopmentForm.value,
      behaviorAssessment: this.behaviorAssessment.value,
      technicalAssement: this.technicalAssement.value,
      yearly_assessment_id: this.yearly_assessment_id,
      manager_remark: this.suggestSkillDevelopmentForm.value.remark,
      remark: this.suggestSkillDevelopmentForm.controls['remark_by_employee'].value,
      suggestSkillDevelopmentForm: this.suggestSkillDevelopmentForm.value,
      date:this.suggestSkillDevelopmentForm.value.current_date,
      rating_status:"Manager Review Completed ",
      submitted_assessment_id: this.primary_key_id,
      
    }



    this.paramsEndpoints.behavioural_average_rating=this.behaviorAvgRating,
    this.paramsEndpoints.technical_average_rating=this.technicalAvgRating
    this.isButtonDisabled = true;
    this._commonService?.showLoader()
    this.selfAssessmentService.updateAssessment(this.paramsEndpoints,payload).subscribe((res:any)=>{
      this._commonService?.hideLoader()
      if(res.code ==200){
        this.toaster.success(res.message);
        setTimeout(() => {
          this.route.navigate(['/master/performance/team-performance-assessment'], { queryParams: { type: this.paramsType }});
        }, 500);
      }
      else{
        this.toaster.error(res.message);
      }
    }, err => {
      this._commonService?.hideLoader()
      this.toaster.error(err.error.message)
      this.isButtonDisabled = false;
    });
  }

}

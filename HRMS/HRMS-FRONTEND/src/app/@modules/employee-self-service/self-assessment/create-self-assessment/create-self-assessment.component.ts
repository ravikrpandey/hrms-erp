import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { SelfAssessmentService } from '../self-assessment.service';
import { environment } from 'src/app/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewAssessmentComponent } from '../view-assessment/view-assessment.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { CommonService } from 'src/app/@shared/services/common.service';
@Component({
  selector: 'app-create-self-assessment',
  templateUrl: './create-self-assessment.component.html',
  styleUrls: ['./create-self-assessment.component.scss']
})
export class CreateSelfAssessmentComponent {
  server:any;
  employeeDetail:FormGroup;
  technicalAssement:FormGroup;
  behaviorAssessment:FormGroup;
  skillDevelopmentForm:FormGroup;
  // selfAssessmentForm:FormGroup;
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
  paramsEndpoints: { entity_id: any; financial_id: any; employee_id: string | null;behavioural_average_rating:number;technical_average_rating:number  };
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
  todayDate:any = null;
  errorMessages: any = [];
  ini_date: any = [];
  end_date: any = [];
  constructor(private fb: FormBuilder,
    private _commonService : CommonService, 
    private selfAssessmentService:SelfAssessmentService, private toaster: ToastrService, private route: Router, private activeroute:ActivatedRoute, public dialog: MatDialog,){
    this.employeeDetail = this.fb.group({
      emp_name:[''],
      emp_number:[''],
      department_name:[''],
      area_name:[''],
      hierarchical_superio:[''],
      start_date:[''],
      end_date:['']
    });

    // this.technicalAssement = this.fb.group({
    //   self_rating_id:[null],
    //   kpa_id:[this.techAssessment[0]?.id]
    // });

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
          Competence: [data]
        })
      )
    }
    
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
      this.emp_id = params?.employee_id
    });
  }

  get items(){
    return this.skillDevelopmentForm.get('items') as FormArray;
  }

  get behaviorItems(){
    return this.behaviorAssessment.get('behaviorItems') as FormArray;
  }

  
  get technicalItems(){
    return this.technicalAssement.get('technicalItems') as FormArray;
  }

  ngOnInit(){
    this.localStorage();
    this.todayDate = new Date();
    if ( this.mode != "innitiate"  ) {
      // this.getKpi();
      this.SelfAssessentRating();
      // this.getEmployee();
    }
    if ( this.mode == "innitiate" ) {
      this.getKpi()
      this.SelfAssessentRating();
      this.getEmployee();
    }
    if( this.mode != "Innitiate" && ( this.paramsType == "view" || this.mode == "view" || this.mode == "edit" ) ){
      //  this.getSelfAssessment();
      this.getCompleteSelfAssessment();
    }
    else{
      this.addRow();
    }
 
  }




  getCompleteSelfAssessment(){
    this._commonService?.showLoader()
    let paramsEndpoints = {
      entity_id: this.entity_id,
      financial_id: this.financial_year_id,
      employee_id: this.emp_id,
      yearly_assessment_id: this.yearly_assessment_id,
    }
    this.selfAssessmentService.getCompleteSelfAssessment(paramsEndpoints.entity_id,paramsEndpoints.financial_id,paramsEndpoints.employee_id,paramsEndpoints.yearly_assessment_id,this.EmpMainId).subscribe((res:any)=>{
      this._commonService?.hideLoader()
      if(res.code == 200){
        this.getAllBehavior = res.data.behavioral_assessments;
        this.submitted_assessment_id = res.data.submitted_assessment_id
        let s_date = this.convert(res.data.start_date)
        let e_date = this.convert(res.data.end_date)
        let name = res.data.first_name + " " + res.data.last_name

        
        this.employeeDetail.patchValue({
          emp_name: name,
          emp_number:res.data.employee_code,
          department_name:res.data.department_name,
          area_name:res.data.area_name,
          hierarchical_superio:res.data.reporting_manager,
          start_date:s_date,
          end_date:e_date,
        });
        this.isDisabled = true;
        if( this.getAllBehavior.length > 0 ){
          this.getAllBehavior.forEach(async ( element:any, index:any) => {
            let findIndex = -1;
            this.Competence.forEach((value:any,index:any) => {
              if (value == element.competence) findIndex = index;
            })
            const formGroup = await this.behaviorItems.at(findIndex) as FormGroup;
            formGroup.patchValue({
              self_rating_id: element.self_rating_id || null
            });
            this.mode == "view" ? this.behaviorItems.controls[findIndex]?.get('self_rating_id')?.disable() : null;
          });
        }

        this.getSkillDevelopment = res.data.skill_development_plans;
        this.getKpaMaster = res.data.getKpaMaster;
        this.techAssessment = res.data.technical_assessments;
        this.kpa_assessment = this.techAssessment;
        console.log("hi i am Development Plan", this.techAssessment)
        this.createTecnicalField();
        if(this.kpa_assessment?.length > 0){
          // this.kpa_assessment = [];
          this.kpa_assessment?.forEach(async (element:any,index:any) => {
            const formGroup = await this.technicalItems.at(index) as FormGroup;
            formGroup.patchValue({
              self_rating_id: element.kpa_self_rating_id
            });
            this.mode == "view" ? this.technicalItems.controls[index]?.get('self_rating_id')?.disable() : null;
          });
        }

        if(this.getSkillDevelopment.length > 0 ){
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
            const startDateTemp:any = element.initiate_date ? new Date(element.initiate_date) : null;
            
            const nextDayTemp = startDateTemp ? new Date(startDateTemp) : null;
            nextDayTemp && startDateTemp ? nextDayTemp.setDate(startDateTemp.getDate() + 1) : null;
            this.minEndDate2[index] = nextDayTemp;
            this.ini_date[index] = this.convert(element.initiate_date)
            this.end_date[index] = this.convert(element.end_date)
            formGroup.patchValue({
              development: element.need_for_development || "",
              action_plan:element.action_plan || "",
              initiate_date:element.initiate_date || null,
              end_date:element.end_date || null,
              files:element.file_document
            });
            this.getFileName(index);
            if (this.mode != 'edit'){
              this.isDisabledSkill = true;
            }
            // this.items.controls[index].get('development')?.disable();
            // this.items.controls[index].get('action_plan')?.disable();
            // this.items.controls[index].get('initiate_date')?.disable();
            // this.items.controls[index].get('end_date')?.disable();
          });

          this.skillDevelopmentForm.patchValue({  remark: res.data.remark  });
          this.mode == "view" ? this.skillDevelopmentForm.get('remark')?.disable() : null;
        }
      }
    },(err:any) => {
      this._commonService.hideLoader()
    })
  }

  getSelfAssessment(){
    let paramsEndpoints = {
      entity_id: this.entity_id,
      financial_id: this.financial_year_id,
      employee_id: this.emp_id,
      submit_assessment_id: this.yearly_assessment_id,
    }

    this.selfAssessmentService.getSelfAssessment(paramsEndpoints).subscribe((res:any)=>{
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
            const startDateTemp:any = element.Initiate_date ? new Date(element.initiate_date) : null;
            
            const nextDayTemp = startDateTemp ? new Date(startDateTemp) : null;
            nextDayTemp && startDateTemp ? nextDayTemp.setDate(startDateTemp.getDate() + 1) : null;
            this.minEndDate2[index] = nextDayTemp;
            formGroup.patchValue({
              development: element.need_for_development || "",
              action_plan:element.action_plan || "",
              initiate_date:element.initiate_date || null,
              end_date:element.end_date || null,
              files:element.file_document
            });
            this.getFileName(index);
            this.skillDevelopmentForm.patchValue({
              remark:element.remarks
            });
            if (this.mode != 'edit'){
              this.isDisabledSkill = true;
            }
            // this.isDisabledSkill = true;
            // this.items.controls[index].get('development')?.disable();
            // this.items.controls[index].get('action_plan')?.disable();
            // this.items.controls[index].get('initiate_date')?.disable();
            // this.items.controls[index].get('end_date')?.disable();
          });
          this.skillDevelopmentForm.get('remark')?.disable();
        }
      }
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
            kpa_id:[data.kpa_master_id]
          })
        )
      }
    }else {
      for(let data of this.kpa_assessment){
        this.technicalItems.push(
          this.fb.group({
            self_rating_id:[null,[Validators.required]],
            kpa_id:[data.id]
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
        initiate_date:[null,[Validators.required]],
        end_date: [null,[Validators.required]],
        files:['']
      })
    )
  }

  romoveRow(index:any){
    this.items.removeAt(index);
  }

  getKpi(){
    this._commonService?.showLoader()
    this.selfAssessmentService.getSelfAssessentKpi(this.endpoints2).subscribe((res:any)=>{
      this._commonService?.hideLoader()
      if(res.code == 200){
        this.techAssessment = res.data;
        // bellow line use for backup the data please do not remove this code
        this.kpa_assessment = this.techAssessment;
        this.createTecnicalField();
      }  
    },(err:any) => {
      this._commonService?.hideLoader()
    });
  }

  SelfAssessentRating(){
    this._commonService?.showLoader()
    this.selfAssessmentService.getSelfAssessentRating().subscribe((res:any)=>{
      this.selfAssessmentRating = res.data;
      this._commonService?.hideLoader()
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
    // when save initiate then save current financial year id not that main financial id
    this.paramsEndpoints ={
      entity_id: this.entity_id,
      financial_id: this.financial_year_id,
      employee_id: this.EmpMainId,
      behavioural_average_rating:0,
      technical_average_rating:0
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
    this._commonService?.showLoader()
    this.selfAssessmentService.getSelfAssessentemployee(this.endpoints).subscribe((res:any)=>{
      if(res.code ==200){
        this.selfEmployee = res.data[0];
        let s_date = this.convert(res.data[0].start_date)
        let e_date = this.convert(res.data[0].end_date)
        this.employeeDetail.patchValue({
          emp_name:this.selfEmployee.first_name + " " + this.selfEmployee.last_name,
          emp_number:this.selfEmployee.employee_code,
          department_name:this.selfEmployee.department_name,
          area_name:this.selfEmployee.area_name,
          hierarchical_superio:this.selfEmployee.reporting_manager,
          start_date:s_date,
          end_date:e_date,
        });

        this.isDisabled = true;
        // this.employeeDetail.get('emp_name')?.disable();
        // this.employeeDetail.get('emp_number')?.disable();
        // this.employeeDetail.get('department_name')?.disable();
        // this.employeeDetail.get('area_name')?.disable();
        // this.employeeDetail.get('hierarchical_superio')?.disable();
        // this.employeeDetail.get('start_date')?.disable();
        // this.employeeDetail.get('end_date')?.disable();
        // if(this.paramsType == "view"){
        //   this.getSelfAssessment();
        // }
      }
      this._commonService?.hideLoader()
    },(err:any) => {
      this._commonService?.hideLoader()
    });
  }

  uploadDoc(index:any,evemt: any) {
    try {
      const formData = new FormData();
      if (evemt.target.files && evemt.target.files[0]) {
        formData.append('file', evemt.target.files[0]);
      }
      
      const fileType = evemt.target.files[0].name.split('.').pop();
      if (!(fileType == 'pdf' || fileType == 'xlsx' || fileType == 'jpeg' || fileType == 'jpg' || fileType == 'png')) {
        // Set error message if file is not a PDF
        this.toaster.error("Please upload a file with valid extension")
        this.errorMessages[index] = 'Please upload a PDF file.';
        return;
      } else {
        this.errorMessages[index] = '';
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
  const startDate:any = event.value ? new Date(event.value) : null;
  const nextDay = startDate ? new Date(startDate) : null;
  nextDay && startDate ? nextDay.setDate(startDate.getDate() + 1) : null;
  this.minEndDate2[i] = nextDay;
  const formattedDate = this.formatDate(startDate);
  
  (this.skillDevelopmentForm.get('items') as FormArray).at(i).get('initiate_date')?.setValue(formattedDate);
  (this.skillDevelopmentForm.get('items') as FormArray).at(i).get('end_date')?.setValue(null);
}

onEndDateChange(event: MatDatepickerInputEvent<Date>,i:any) {
   const endDate : any = event.value ? new Date(event.value) : null;
   const formattedDate = this.formatDate(endDate);
  //  
  (this.skillDevelopmentForm.get('items') as FormArray).at(i).get('end_date')?.setValue(formattedDate);
}

formatDate(date: Date): string {
  let x = new Date(new Date(date).getTime() + 5 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString().slice(0, 10);
  return x
}

convert(dateString: string): string {
  if (!dateString) {
    return '';
  }
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day); // Months are 0-based in JavaScript
  const dayFormatted = ('0' + date.getDate()).slice(-2);
  const monthFormatted = ('0' + (date.getMonth() + 1)).slice(-2);
  const yearFormatted = date.getFullYear();
  return `${dayFormatted}-${monthFormatted}-${yearFormatted}`;
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

 calculateRating = (id:any,i:any) => {
  let committeeRatingIndex:any= 0;
  this.selfAssessmentRating.forEach((value:any,ind:any) => {
    if ( value.id  == id ) {
      committeeRatingIndex = ind;
    }
  })
   
    let value = Number(this.selfAssessmentRating[committeeRatingIndex].self_rating_value)
    return value;
  }

  onSubmit(){
    this._commonService?.showLoader()
    if(this.skillDevelopmentForm.invalid || this.technicalAssement.invalid || this.behaviorAssessment.invalid){
      this.items.controls.forEach(control => {
        control.markAllAsTouched(); 
      });
      
      this.behaviorItems.controls.forEach(control => {
        control.markAllAsTouched(); 
      });
      
      this.technicalItems.controls.forEach(control => {
        control.markAllAsTouched(); 
      });
      return
    }

    let behavioural_average_rating:number = 0;
    this.behaviorAssessment.value.behaviorItems.map((value:any,i:any) => { 
      behavioural_average_rating += this.calculateRating(value.self_rating_id,i)
    })
    behavioural_average_rating = behavioural_average_rating/this.behaviorAssessment.value.behaviorItems.length;
    
    let technical_average_rating:number = 0;
    this.technicalAssement.value.technicalItems.map((value:any,i:any) => { 
      technical_average_rating += this.calculateRating(value.self_rating_id,i)
    })
    technical_average_rating = technical_average_rating/this.technicalAssement.value.technicalItems.length;

    let payload = {
      skillDevelopmentForm: this.skillDevelopmentForm.value,
      behaviorAssessment: this.behaviorAssessment.value,
      technicalAssement: this.technicalAssement.value,
      rating_status:this.Rating_status,
      yearly_assessment_id: this.yearly_assessment_id,
      assessment_name : this.assessmentName,
      remark: this.skillDevelopmentForm.value.remark,
    }

    this.paramsEndpoints.behavioural_average_rating = behavioural_average_rating;
    this.paramsEndpoints.technical_average_rating = technical_average_rating;
    
  
    this.selfAssessmentService.postSelfAssessment(this.paramsEndpoints,payload).subscribe((res:any)=>{
      this._commonService?.hideLoader()
      if(res.code ==200){
        this.toaster.success(res.message);
        setTimeout(() => {
          this.route.navigate(['/master/ess/self-assessment']);
        }, 500);
      }
      else{
        this.toaster.error(res.message);
      }
    }, err => {
      this._commonService?.hideLoader()
      this.toaster.error(err.error.message)
    });
  }

  onUpdate(){
    debugger
    this._commonService?.showLoader()
    if(this.skillDevelopmentForm.invalid || this.technicalAssement.invalid || this.behaviorAssessment.invalid){
      this.items.controls.forEach(control => {
        control.markAllAsTouched(); 
      });
      
      this.behaviorItems.controls.forEach(control => {
        control.markAllAsTouched(); 
      });
      
      this.technicalItems.controls.forEach(control => {
        control.markAllAsTouched(); 
      });
      return
    }
    
    let behavioural_average_rating:number = 0;
    this.behaviorAssessment.value.behaviorItems.map((value:any,i:any) => { 
      behavioural_average_rating += this.calculateRating(value.self_rating_id,i)
    })
    behavioural_average_rating = behavioural_average_rating/this.behaviorAssessment.value.behaviorItems.length;
    
    let technical_average_rating:number = 0;
    this.technicalAssement.value.technicalItems.map((value:any,i:any) => { 
      technical_average_rating += this.calculateRating(value.self_rating_id,i)
    })
    technical_average_rating = technical_average_rating/this.technicalAssement.value.technicalItems.length; 
    let payload = {
      skillDevelopmentForm: this.skillDevelopmentForm.value,
      behaviorAssessment: this.behaviorAssessment.value,
      technicalAssement: this.technicalAssement.value,
      rating_status:this.Rating_status,
      yearly_assessment_id: this.yearly_assessment_id,
      assessment_name : this.assessmentName,
      remark: this.skillDevelopmentForm.value.remark,
      submitted_assessment_id: this.submitted_assessment_id,
    }
    this.paramsEndpoints.behavioural_average_rating = behavioural_average_rating;
    this.paramsEndpoints.technical_average_rating = technical_average_rating;
    this.selfAssessmentService.updateAssessment(this.paramsEndpoints,payload).subscribe((res:any)=>{
      this._commonService?.hideLoader()
      if(res.code ==200){
        this.toaster.success(res.message);
        setTimeout(() => {
          this.route.navigate(['/master/ess/self-assessment']);
        }, 500);
      }
      else{
        this.toaster.error(res.message);
      }
    }, err => {
      this._commonService?.hideLoader()
      this.toaster.error(err.error.message)
    });
  }


}

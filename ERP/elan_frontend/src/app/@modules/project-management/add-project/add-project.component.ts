import { Component, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProjectManagementService } from '../services/project-management.service';
import { MatSelectChange } from '@angular/material/select';
import { environment } from 'src/app/environments/environment';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
const databaseKey: any = environment.servralUrl;

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss']
})
export class AddProjectComponent {
  addProjectForm: FormGroup;
  addMilestoneTable: FormGroup;
  fileUpload: any;
  projectCode:any;
  projectData:any;
  teamMemberDataForm:FormGroup;
  type:any;
  view: any;
  mile_id:any;
  uploadedDocuments:any = [];
  @ViewChild('editer') editer: any;
  arrayData: any = [];
  teamMembers : any = [];
  selectedEmployee: { id: number;employee_id:any; first_name: string;last_name:string, employee_code: string } | null = null;
  project_id:any
employees: any[] = [];
  selectedEmployeeCode: any;
  mainEmpId: string | null;
  milestoneData:any
  employeeData: any;
  documentData:any
  submitted : boolean;
  filteredEmployees: any[];
  rawEmp: any;
  employeesList: any;
  constructor(
    private fb: FormBuilder,
    private renderer:Renderer2,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _projectService : ProjectManagementService,
    private recruitService:RecruitService
  ){
    this.addProjectForm =  this.fb.group({
    
      project_code: new FormControl(null, [Validators.required]),
      project_name: new FormControl(null, [Validators.required]),
      client_name: new FormControl(null, [Validators.required]),
      start_date: new FormControl(null, [Validators.required]),
      end_date : new FormControl(null, [Validators.required]),
      description : new FormControl(null, [Validators.required]),
      project_head: new FormControl(null, [Validators.required]),
      project_manager: new FormControl(null, [Validators.required]),
      file: new FormControl(null),
    });
    this.addMilestoneTable =  this.fb.group({
    
      milestone_name: new FormControl(null),
      end_date: new FormControl(null, [
        Validators.required,
        this.milestoneEndDateValidator(this.addProjectForm.value.end_date),
      ]),
    
    });
    this.teamMemberDataForm = this.fb.group({
      employee_name :new FormControl(null),
      employee_code : new FormControl(null),
    })
    this.fileArray.push({ url: null });
  }
  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((res: any) => {
      this.type = res.view;
      this.project_id = res.id;
    })

    this.mainEmpId = localStorage.getItem('EmpMainId')
    this.getProjectCode();
    this.getEmployees();
    if(this.project_id){
      this.getProjectById()
    }
    this.addProjectForm.get('end_date')?.valueChanges.subscribe((projectEndDate) => {
      const endDateControl = this.addMilestoneTable.get('end_date');
      endDateControl?.setValidators([
        Validators.required,
        this.milestoneEndDateValidator(projectEndDate),
      ]);
      endDateControl?.updateValueAndValidity();
    });
  }
  milestoneEndDateValidator(projectEndDate: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const milestoneEndDate = control.value;
      if (!milestoneEndDate || !projectEndDate) {
        return null; 
      }
  
      const projectEnd = new Date(projectEndDate);
      const milestoneEnd = new Date(milestoneEndDate);
  
      
      return milestoneEnd > projectEnd
        ? { milestoneEndDateInvalid: true } 
        : null; 
    };
  }
  
  getProjectById(){
    this._projectService.getProjectById(this.project_id).subscribe((res:any)=>{
      this.projectData = res.data.allProjectData;
      this.milestoneData = res.data.milestonesData;
      this.employeeData = res.data.employeeData;
      this.documentData = res.data.docsData;
      this.addProjectForm.patchValue({
        project_code: this.projectData?.project_code,
      client_name: this.projectData?.client_name,
      project_name: this.projectData?.project_name,
      start_date: this.projectData?.start_date,
      end_date: this.projectData?.end_date,
      description: this.projectData?.project_description,
      project_head: this.projectData?.project_head_id,
      project_manager: this.projectData?.project_manager_id,
      })
      this.arrayData = this.milestoneData.map((milestone: any) => ({
        id: milestone.id,
        milestone: milestone.milestone_name,
        end_date: milestone.milestoneEnd_date,
      }));

      this.teamMembers = this.employeeData.map((employee: any) => ({
        e_id : employee.id,
        id: employee.employee_id,
        name: employee.employee_name,
        code: employee.employee_code,
      }));
      this.uploadedDocuments = this.documentData.map((doc:any)=>({
        id:doc.id,
        file: doc.attachments
      }))
    },
      (err: any) => {
        console.error('Something went wrong! ');
      }
    );
    
  }
  backBtn(){
    this.route.navigate(['master/project-management/project-list'])
  }
  getProjectCode() {
    this._projectService.getProjectCode().subscribe(
      (res: any) => {
        if (res?.data) {
          this.projectCode = res.data; 
          this.addProjectForm.get('project_code')?.setValue(this.projectCode); 
        }
      },
      (error) => {
        console.error('Error fetching project code:', error);
      }
    );
  }

  getEmployees() {
    this._projectService.getEmployees().subscribe(
      (response: any) => {
        if (response?.data?.length) {
          this.rawEmp = response.data;
          this.employeesList = response.data;
          // this.employees = response.data.map((employee: any) => ({
          //   id: employee.employee_id,
          //   name: employee.full_name ? String(employee.full_name) : '',
          //   code: employee.employee_code
          // }));
          this.employees = response.data.map((res: any) => res.title + res.first_name + res.last_name);
          console.log('employess',this.employees);
        }
      },
      (error) => {
        console.error('Error fetching employees:', error);
      }
    );
  }
employeeSearch(e : any) {
  const aa = e
  let filteredVariable = this.rawEmp.filter((item: any) => aa.includes(item.title + item.first_name + item.last_name));
  this.employeesList = filteredVariable
}
onEmployeeSelect(event: MatSelectChange) {

  const selectedEmpId = event.value;
  this.selectedEmployee = this.rawEmp.find((emp:any) => emp.employee_id === selectedEmpId);
  
  if (this.selectedEmployee) {
    this.addMilestoneTable.patchValue({
      employee_code: this.selectedEmployee.employee_code,
    });
  }
}
  deleteRow(index: number) {
    let team_member_id = this.teamMembers[index].e_id;
    if(!this.project_id || !team_member_id){
      this.teamMembers.splice(index, 1);
    } else if(this.project_id){
      this._projectService.deleteEmployee(this.project_id,team_member_id).subscribe((res:any)=>{
        if(res){
          this.teamMembers.splice(index, 1);
          this.toast.success('Team Member Deleted Successfully', 'Success');
        }
      })
    }
    
  }
  
  addTeamMemberRow() {
    if (!this.selectedEmployee || !this.selectedEmployee.employee_id  || !this.selectedEmployee.employee_code) {
      this.toast.error('Please select a valid employee before adding to the team.', 'Error');
      return;
    }
    const employeeExists = this.teamMembers.some((member:any) => member.id === this.selectedEmployee?.employee_id);
    if (employeeExists) {
      this.toast.error('This employee is already in the team.', 'Error');
      return;
    }
    if(this.project_id){
      const newRow = {
        employee_id: this.selectedEmployee.employee_id,
        name: this.selectedEmployee.first_name +" " + this.selectedEmployee.last_name,
        code: this.selectedEmployee.employee_code,
      };
      this.teamMembers.push(newRow);
      this.teamMemberDataForm.reset();
      this.selectedEmployee = null;
    } else{
      const newRow = {
        id: this.selectedEmployee.employee_id,
        name: this.selectedEmployee.first_name +" " + this.selectedEmployee.last_name,
        code: this.selectedEmployee.employee_code,
      };
      this.teamMembers.push(newRow);
      this.teamMemberDataForm.reset();
      this.selectedEmployee = null;
    }
  }
  
addRow(): void {
    const milestoneName = this.addMilestoneTable.value.milestone_name;
    const endDate = this.addMilestoneTable.value.end_date;
  
    if (!milestoneName || !endDate) {
      this.toast.error('Please fill out all fields before adding a milestone.', 'Error');
      return;
    }

  const projectEndDate = this.addProjectForm.value.end_date;
  const endDateError = this.milestoneEndDateValidator(projectEndDate)(this.addMilestoneTable.controls['end_date']);

  if (endDateError) {
    this.toast.error('Milestone end date cannot be after the project end date.', 'Invalid Date');
    return;
  }
  if(this.mile_id){
    const newRow = {
      id : this.mile_id,
      milestone: milestoneName,
      end_date: endDate,
    };
    this.arrayData.push(newRow);
  }else{
    const newRow = {
      milestone: milestoneName,
      end_date: endDate,
    };
    this.arrayData.push(newRow);
  }
   
    this.addMilestoneTable.reset();
    // this.toast.success('Milestone added successfully!', 'Success');
  }

deleteData(index: number) {

  let milestone_id = this.arrayData[index].id;
  if(!this.project_id || !milestone_id){
    this.arrayData.splice(index, 1);
  } else if(this.project_id){
    this._projectService.deleteMilestones(this.project_id,milestone_id).subscribe((res:any)=>{
      if(res){
        this.arrayData.splice(index, 1);
        this.toast.success('Milestone Deleted Successfully', 'Success');
      }
    })
  }
  
}
editData(item: any, index: number): void {
  this.mile_id = item.id;
  this.addMilestoneTable.patchValue({
    
    milestone_name: item.milestone,
    end_date: item.end_date
  });

  this.arrayData.splice(index, 1);
}

  uploadDoc(event: any, index: number) {

    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        this.uploadedDocuments.push({
          filename: files[i].name,
        });
      }
      const fileInput = event.target;
      const label = fileInput.nextElementSibling;
      const filenames = Array.from(files)
        .map((file:any) => file.name)
        .join(', ');
      this.renderer.setProperty(label, 'innerText', filenames);
    }
  }
  
  fileInputs: any[] = [{}];
  addFile() {
    this.fileInputs.push(this.fileInputs.length);
  }
  removeFile(index: number): void {
    this.fileInputs.splice(index, 1); 
  }
   onSubmit(): void {

    Object.keys(this.addProjectForm.controls).forEach(key => {
      this.addProjectForm.controls[key].markAsTouched();
    });
    if (this.addProjectForm.invalid) {
      this.toast.error('Please fill in all required fields!', 'Close');
      return;
    }
    if(this.arrayData.length < 1){
      this.toast.error('Please Enter Atleast One Milestone!', 'Close');
      return;
    }
    if(this.teamMembers.length < 1){
      this.toast.error('Please add atleast one team member!', 'Close');
      return;
    }
    const newArray: any = []
    this.fileArray?.map((doc: any) => {
      newArray.push(doc?.url)
    })
    const data = {
      createdBy: this.mainEmpId, 
      project_code: this.addProjectForm.value.project_code,
      client_name: this.addProjectForm.value.client_name,
      project_name: this.addProjectForm.value.project_name,
      start_date: this.addProjectForm.value.start_date,
      end_date: this.addProjectForm.value.end_date,
      project_description: this.addProjectForm.value.description,
      project_head_id: this.addProjectForm.value.project_head,
      project_manager_id: this.addProjectForm.value.project_manager || null,
      milestonesData: this.arrayData.map((milestone: {milestone: any; end_date: any; }) => ({

        milestone_name: milestone.milestone,
        milestoneEnd_date: milestone.end_date,
      })),
      employeeData: this.teamMembers.map((member: { id:any;name: any; code: any; }) => ({
        employee_id: member.id,
        employee_name: member.name,
        employee_code: member.code,
      })),
      documentData: newArray.map((doc: any) => ({
        filename: doc,
      })),
    };
  
    this._projectService.createProject(data).subscribe({
      next: (response) => {
        this.toast.success('Project submitted successfully!');
        this.route.navigate(['master/project-management/project-list'])
      },
      error: (error) => {
        this.toast.error('Failed to submit the project. Please try again.');
        console.error(error);
      },
    });
  }
  onUpdate(): void { 
    Object.keys(this.addProjectForm.controls).forEach(key => {
      this.addProjectForm.controls[key].markAsTouched();
    });

    if (this.addProjectForm.invalid) {
      this.toast.error('Please fill in all required fields!', 'Close');
      return;
    }
    const newArray: any[] = this.fileArray
    ?.filter((doc: any) => doc?.url)
    .map((doc: any) => doc.url);

  this.uploadedDocuments = [
    ...this.uploadedDocuments.filter((doc:any) => doc),
    ...newArray
  ];
  const documentData = this.uploadedDocuments.map((doc: any) => {
    if (Array.isArray(doc)) {
      return doc.map((file: { id: any; file: any }) => ({
        id: file.id,
        filename: file.file,
      }));
    } else if (typeof doc === 'object' && doc !== null) {
      return { id: doc.id, filename: doc.filename };
    } else if (typeof doc === 'string') {
      return { id: null, filename: doc };
    }
    return null; 
  }).filter((doc:any) => doc !== null);


    const data = {
      project_code: this.addProjectForm.value.project_code,
      client_name: this.addProjectForm.value.client_name,
      project_name: this.addProjectForm.value.project_name,
      start_date: this.addProjectForm.value.start_date,
      end_date: this.addProjectForm.value.end_date,
      project_description: this.addProjectForm.value.description,
      project_head_id: this.addProjectForm.value.project_head,
      project_manager_id: this.addProjectForm.value.project_manager || null,
      milestonesData: this.arrayData.map((milestone: { id:any;milestone: any; end_date: any; }) => ({
        id: milestone.id,
        milestone_name: milestone.milestone,
        milestoneEnd_date: milestone.end_date,
      })),
      employeeData: this.teamMembers.map((member: { id: any; employee_id: any; name: any; code: any; }) => {
        if (member.employee_id) {
          return {
            id: member.id,
            employee_id: member.employee_id,
            employee_name: member.name,
            employee_code: member.code,
          };
        } else {
          return {
            id: member.id,
            employee_name: member.name,
            employee_code: member.code,
          };
        }
      }),
      // documentData: this.uploadedDocuments.map((doc: { id: any; filename: any; }) => ({
      //   id:doc.id,
      //   filename: doc,
      // })),
      documentData: documentData,
    };
  
    this._projectService.updateProject(this.project_id, data).subscribe({
      next: (response) => {
        this.toast.success('Project updated successfully!');
        this.route.navigate(['master/project-management/project-list']);
      },
      error: (error) => {

        this.toast.error('Failed to update the project. Please try again.');
        console.error(error);
      },
    });
  }
  downloadFile(fileId: number): void {
    
    const document = this.uploadedDocuments.find((doc: any) => doc.id === fileId);
    
    if (document && document.file) {
      const fileUrl =`${databaseKey}/uploaded_files/${document.file}`; 
      window.open(fileUrl, '_blank');
    } else {
      this.toast.warning('File not found!');
    }
  }  
  downloadFiles(): void {
    
    this.uploadedDocuments.forEach((doc: any) => {
      this.downloadFile(doc.id);
    });
  }
  fileArray: any[] = [];
  fileGetCheck: any;
  onChange(event: any, index: number) {
  
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const imagePath = file.type === 'application/pdf' ? "/assets/icons/pdfimg.png" : e.target.result;
        this.fileArray[index].imagePath = imagePath;
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      console.log(file, 'file');
      this.fileGetCheck = formData;
      formData.append('file', file);

      this.recruitService.uploaddocumentsUpdate(formData).subscribe((res: any) => {
        this.toast.success("File Uploaded Successfully");
        this.fileArray[index].url = res?.url;
        // this.fileArray[index].url_name = file?.name;

      }, (err: any) => {
        this.toast.error(`${err?.error?.message}`);
      });
    }
  }
}

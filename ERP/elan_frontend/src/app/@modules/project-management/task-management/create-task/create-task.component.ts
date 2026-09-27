import { Component, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProjectManagementService } from '../../services/project-management.service';
import { environment } from 'src/app/environments/environment';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
const databaseKey: any = environment.servralUrl;

export function dateRangeValidator(
  start: string,
  end: string
): ValidatorFn {
  return (control: AbstractControl) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const selectedDate = new Date(control.value);

    if (selectedDate < startDate || selectedDate > endDate) {
      return { dateOutOfRange: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent {
  createTaskForm! : FormGroup;
  taskType = [
    { id: 1 , name : 'Parent Task' },
    { id: 2, name: 'Sub Task' }]
    dependenceType: string = 'Task or Subtask';
    priorityData = [
      { id: 1, name: 'Emergency',value:'EMERGENCY', icon: 'error', color: 'red' },
      { id: 2, name: 'Blocker', value:'BLOCKER',icon: 'block', color: 'red' },
      { id: 3, name: 'Highest',value:'HIGHEST', icon: 'priority_high', color: 'orange' },
      { id: 4, name: 'High',value:'HIGH', icon: 'arrow_upward', color: 'orange' },
      { id: 5, name: 'Normal',value:'NORMAL', icon: 'swap_horiz', color: 'black' },
      { id: 6, name: 'Low',value:'LOW', icon: 'arrow_downward', color: 'green' },
      { id: 7, name: 'Lowest',value:'LOWEST', icon: 'low_priority', color: 'green' },
    ];
    statuses = [
      { name: 'Not Started', value: 'NOT STARTED', color: 'cyan' }, 
      { name: 'In Progress', value: 'IN PROGRESS', color: 'limegreen' }, 
      { name: 'Review', value: 'REVIEW', color: 'orange' }, 
      { name: 'On Hold', value: 'ON HOLD', color: 'purple' }, 
      { name: 'Closed', value: 'CLOSED', color: 'lightgray' }, 
      { name: 'Canceled', value: 'CANCELLED', color: 'lightgray' } 
    ];
  fileInputs: any[] = [{}];
  showTaskField: boolean = false;
  addProjectForm: FormGroup;
  addMilestoneTable: FormGroup;
  fileUpload: any;
  projectData:any;
  type:any;
  view: any;
  uploadedDocuments:any = [];
  @ViewChild('editer') editer: any;
  arrayData: any = [];
  teamMembers : any = [];
  selectedEmployee: { id: number; name: string; code: string } | null = null;
  project_id:any
  employees: any[] = [];
  selectedEmployeeCode: any;
  mainEmpId: string | null;
  milestoneData:any[]= [];
  employeeData: any[]= [];
  documentData:any
  submitted : boolean;
  parentTasks: any;
  allTasks: any;
  task_id: any;
  taskData: any;
  projectStartDate: any;
  projectEndDate: any;
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
    this.createTaskForm = this.fb.group({
      project_id : new FormControl(null, [Validators.required]),
      task_type : new FormControl(null, [Validators.required]),
      parent_task_id : new FormControl(null),
      task_name : new FormControl(null,[Validators.required]),
      start_date: new FormControl(null, [Validators.required,this.startDateValidator.bind(this)]),
      end_date : new FormControl(null, [Validators.required,this.endDateValidator.bind(this)]),
      milestone_id : new FormControl(null, [Validators.required]),
      priority: new FormControl(null, [Validators.required]),
      assign_to : new FormControl(null, [Validators.required]),
      description : new FormControl(null, [Validators.required]),
      dependenceType: new FormControl('Task or Subtask', [Validators.required]),
      dependent_task_id: new FormControl(null),
      otherDetails: new FormControl(null),
      status : new FormControl(null, [Validators.required]),
      document_name : new FormControl(null),
      file: new FormControl(null),
    })
    this.fileArray.push({ url: null });
  }
  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((res: any) => {
      this.type = res.view;
      this.task_id = res.id;
      this.project_id = res.project_id;
    })

    this.mainEmpId = localStorage.getItem('EmpMainId');
    if(this.project_id){
    this.getAllParentTasks();
    this.getProjectById();
    this.getProjectTeamMemberList()
    this.getAllParentTasks();
    this.getAllTasks();
    // this.getTasksById();
    }
    if(this.task_id){
      this.getTasksById()
    }
    this.getProjectName();
    this.onDependenceTypeChange('Task or Subtask');
  }
  onTaskTypeChange(event: MatSelectChange): void {
    this.showTaskField = event.value === 'Sub Task';
    if (!this.showTaskField) {
      this.createTaskForm.get('parent_task_id')?.reset();
    }
  }
  onDependenceTypeChange(value: string) {
    this.dependenceType = value;
    if (value === 'Task or Subtask') {
      this.createTaskForm.get('taskName')?.setValidators(Validators.required);
      this.createTaskForm.get('otherDetails')?.clearValidators();
      this.createTaskForm.get('otherDetails')?.reset();
    } else if (value === 'Other') {
      this.createTaskForm.get('otherDetails')?.setValidators(Validators.required);
      this.createTaskForm.get('taskName')?.clearValidators();
      this.createTaskForm.get('taskName')?.reset();
    }

    this.createTaskForm.get('taskName')?.updateValueAndValidity();
    this.createTaskForm.get('otherDetails')?.updateValueAndValidity();
  }
  getProjectName(){
    this._projectService.getMyProjectsList(this.mainEmpId).subscribe((res:any)=>{
      this.projectData = res.data.myProjects;
    },
      (err: any) => {
        this.toast.warning('Something went wrong! ');
      }
    ); 
  }
  
  getProjectNameTeam(){
    this._projectService.getMyProjectsList(this.mainEmpId).subscribe((res:any)=>{
      this.projectData = res.data.assignedTasks;
    },
      (err: any) => {
        this.toast.warning('Something went wrong! ');
      }
    ); 
  }
  onProjectChange(projectId: number): void {
    this.project_id = projectId;
    this.getProjectById();
    this.getProjectTeamMemberList()
    this.getAllParentTasks();
    this.getAllTasks();
    
  }
  getTasksById(){
    this._projectService.getTasksById(this.task_id).subscribe((res:any)=>{
      this.taskData = res.data.assignedTasks;
      this.documentData = res.data.documents;
      this.createTaskForm.patchValue({
        project_id: this.taskData?.project_id,
        task_type: this.taskData?.task_type,
        parent_task_id: this.taskData?.parent_task_id,
        task_name: this.taskData?.task_name,
        start_date: this.taskData?.start_date,
        end_date: this.taskData?.end_date,
        milestone_id: this.taskData?.milestone_id,
        description:this.taskData?.task_description,
        priority: this.taskData?.priority,
        dependenceType : this.taskData?.dependency_type,
        dependent_task_id: this.taskData?.dependent_task_id,
        assign_to: this.taskData?.assigned_to,
        otherDetails : this.taskData?.update_info,
        status : this.taskData?.status,
        });
        this.onDependenceTypeChange(this.taskData?.dependency_type);
        this.onProjectChange(this.taskData?.project_id)

        this.uploadedDocuments = this.documentData.map((doc: any) => ({
          id: doc.id,
          document: [databaseKey + '/uploaded_files/' + doc.attachments || ''], 
          document_name: doc.document_name,
          fileUrl: doc.attachments, 
        }));
    })
    
  }
  
  getProjectById(){
    this._projectService.getMyProject(this.project_id).subscribe((res:any)=>{
      this.projectStartDate = new Date (res.data.allProjectData.start_date); 
      this.projectEndDate = new Date(res.data.allProjectData.end_date);
      this.milestoneData = res.data.milestonesData;
      
      this.createTaskForm.get('start_date')?.updateValueAndValidity();
      this.createTaskForm.get('end_date')?.updateValueAndValidity();
      
    })
  }

  getProjectTeamMemberList(){
    this._projectService.getProjectTeamMemberList(this.project_id).subscribe((res:any)=>{
      this.rawEmp = res.data.employeeData;
      this.employeesList = res.data.employeeData; 
      this.employeeData = res.data.employeeData.map((employee:any)=>employee.employee_name);
      
    })
  }
  employeeSearch(filteredNames: any) {
    this.employeesList = this.rawEmp.filter((item: any) =>
      filteredNames.includes(item.employee_name)
    );
  }
  startDateValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!this.projectStartDate) return null;
  
    const selectedDate = new Date(control.value);
    const normalizedSelectedDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    const normalizedProjectStartDate = new Date(
      this.projectStartDate.getFullYear(),
      this.projectStartDate.getMonth(),
      this.projectStartDate.getDate()
    );
  
    return normalizedSelectedDate >= normalizedProjectStartDate
      ? null
      : { invalidStartDate: `Start Date must be on or after ${this.projectStartDate.toDateString()}.` };
  }
  

  endDateValidator(control: AbstractControl): { [key: string]: any } | null {
    if (!this.projectEndDate) return null; 
    const selectedDate = new Date(control.value);
    return selectedDate <= this.projectEndDate
      ? null
      : { invalidEndDate: `End Date must be on or before ${this.projectEndDate.toDateString()}.` };
  } 

  getAllParentTasks(){
    this._projectService.getAllParentTasks(this.project_id).subscribe((res:any)=>{
      this.parentTasks = res.data;
    })
  }
  getAllTasks(){
    this._projectService.getAllTasks(this.project_id).subscribe((res:any)=>{
      this.allTasks = res.data;
    })
  }
  backBtn(){
    this.route.navigate(['master/project-management/task-management'])
  }
// uploadDoc(event: any, index: number) {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       for (let i = 0; i < files.length; i++) {
//         this.uploadedDocuments[index] = {
//           document_name: this.createTaskForm.value.document_name, 
//           filename: files[i].name,
//           file: files[i], 
//         };
//       }
//       const fileInput = event.target;
//       const label = fileInput.nextElementSibling;
//       const filenames = Array.from(files).map((file: any) => file.name).join(', ');
//       this.renderer.setProperty(label, 'innerText', filenames);
//     }
//   }
  downloadFile(fileId: number): void {
    const document = this.uploadedDocuments.find((doc: any) => doc.id === fileId);
    
    if (document) {
      const fileUrl =`${databaseKey}/uploaded_files/${document.fileUrl}`; 
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

  addFile() {
    if(this.type == 'edit'){
      this.fileInputs.push(this.fileInputs.length); 
    } else{
      this.fileInputs.push(this.fileInputs.length); 
    this.uploadedDocuments.push({ file: '', document_name: '' });
    } 
  }
  removeFile(index: number): void {
    this.fileInputs.splice(index, 1); 
    this.uploadedDocuments.splice(index, 1); 
  }
   onSubmit(): void {
    Object.keys(this.createTaskForm.controls).forEach(key => {
      this.createTaskForm.controls[key].markAsTouched();
    });
    if (this.createTaskForm.invalid) {
      this.toast.error('Please fill in all required fields!', 'Close');
      return;
    }
    const newArray: any = []
    this.fileArray?.map((doc: any) => {
      newArray.push(doc?.url)
    })
    const data = {
      createdBy: this.mainEmpId, 
      project_id: this.createTaskForm.value.project_id,
      task_type: this.createTaskForm.value.task_type,
      parent_task_id: this.createTaskForm.value.parent_task_id,
      task_name: this.createTaskForm.value.task_name,
      start_date: this.createTaskForm.value.start_date,
      end_date: this.createTaskForm.value.end_date,
      milestone_id: this.createTaskForm.value.milestone_id,
      task_description: this.createTaskForm.value.description,
      priority: this.createTaskForm.value.priority,
      dependency_type : this.createTaskForm.value.dependenceType,
      dependent_task_id: this.createTaskForm.value.dependent_task_id,
      assigned_to: this.createTaskForm.value.assign_to,
      update_info : this.createTaskForm.value.otherDetails,
      status : this.createTaskForm.value.status,
      documentData: newArray.map((doc: { filename: any; }) => ({
        document_name : this.createTaskForm.value.document_name,
        filename: doc,
      })),
    };
  
    this._projectService.createOrUpdateTasks(data).subscribe({
      next: (response) => {
        this.toast.success('Task Created Successfully!');
        this.route.navigate(['master/project-management/task-management'])
      },
      error: (error) => {
        this.toast.error('Failed to create the task. Please try again.');
        console.error(error);
      },
    });
  }

  onUpdate(): void {
    Object.keys(this.createTaskForm.controls).forEach(key => {
      this.createTaskForm.controls[key].markAsTouched();
    });

    if (this.createTaskForm.invalid) {
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
        return doc.map((file: any) => ({
          id: file.id,
          document_name : file.document_name,
          filename: file.fileUrl,
        }));
      } else if (typeof doc === 'object' && doc !== null) {
        return { id: doc.id, filename: doc.filename };
      } else if (typeof doc === 'string') {
        return { id: null, document_name : this.createTaskForm.value.document_name,filename: doc };
      }
      return null; 
    }).filter((doc:any) => doc !== null);

    const data = {
      id: this.task_id,
      createdBy: this.mainEmpId, 
      project_id: this.createTaskForm.value.project_id,
      task_type: this.createTaskForm.value.task_type,
      parent_task_id: this.createTaskForm.value.parent_task_id,
      task_name: this.createTaskForm.value.task_name,
      start_date: this.createTaskForm.value.start_date,
      end_date: this.createTaskForm.value.end_date,
      milestone_id: this.createTaskForm.value.milestone_id,
      task_description: this.createTaskForm.value.description,
      priority: this.createTaskForm.value.priority,
      dependency_type : this.createTaskForm.value.dependenceType,
      dependent_task_id: this.createTaskForm.value.dependent_task_id,
      assigned_to: this.createTaskForm.value.assign_to,
      update_info : this.createTaskForm.value.otherDetails,
      status : this.createTaskForm.value.status,
      // documentData: this.uploadedDocuments
      // .filter(
      //   (doc: { filename: any }) =>
      //     doc.filename && this.createTaskForm.value.document_name
      // )
      // .map((doc: { filename: any }) => ({
      //   document_name: this.createTaskForm.value.document_name,
      //   filename: doc.filename,
      // })),
      documentData : documentData
    };
  
    this._projectService.createOrUpdateTasks(data).subscribe({
      next: (response) => {
        this.toast.success('Task updated successfully!');
        this.route.navigate(['master/project-management/task-management']);
      },
      error: (error) => {

        this.toast.error('Failed to update the project. Please try again.');
        console.error(error);
      },
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

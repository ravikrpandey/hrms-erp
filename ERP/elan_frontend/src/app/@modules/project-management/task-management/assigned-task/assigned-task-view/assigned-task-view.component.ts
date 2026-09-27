import { Component, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProjectManagementService } from '../../../services/project-management.service';

@Component({
  selector: 'app-assigned-task-view',
  templateUrl: './assigned-task-view.component.html',
  styleUrls: ['./assigned-task-view.component.scss']
})
export class AssignedTaskViewComponent {
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
  constructor(
    private fb: FormBuilder,
    private renderer:Renderer2,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _projectService : ProjectManagementService
  ){
    this.createTaskForm = this.fb.group({
      project_id : new FormControl(null, [Validators.required]),
      project_name : new FormControl(null, [Validators.required]),
      task_type : new FormControl(null, [Validators.required]),
      parent_task_id : new FormControl(null),
      task_name : new FormControl(null,[Validators.required]),
      start_date: new FormControl(null, [Validators.required]),
      end_date : new FormControl(null, [Validators.required]),
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
  }
  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((res: any) => {
      this.type = res.view;
      this.task_id = res.id;
      this.project_id = res.project_id;
    })

    const signInUserData = localStorage.getItem('signInUser');
    this.mainEmpId = localStorage.getItem('EmpMainId');
    if(this.project_id){
    this.getAllParentTasks();
    this.getProjectById();
    this.getAllParentTasks();
    this.getAllTasks();
    }
    if(this.task_id){
      this.getTasksById()
    }
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
    this.getAllParentTasks();
    this.getAllTasks(); 
  }
  getTasksById(){
    this._projectService.getTasksById(this.task_id).subscribe((res:any)=>{
      this.taskData = res.data.assignedTasks;
      this.documentData = res.data.documents;
      this.createTaskForm.patchValue({
        project_name : this.taskData?.project_name,
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
          document_name: doc.document_name,
          fileUrl: doc.attachments, 
        }));
    })
    
  }
  
  getProjectById(){
    this._projectService.getMyProject(this.project_id).subscribe((res:any)=>{
      this.milestoneData = res.data.milestonesData;
      this.employeeData = res.data.employeeData;
    })
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

  downloadFile(fileUrl: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    link.click();
  }
  onUpdateStatus(): void {
    const data = {
      status : this.createTaskForm.value.status,
    };
  
    this._projectService.updateTaskStatus(this.project_id,this.task_id,data).subscribe({
      next: (response) => {
        this.toast.success('Task Status Updated Successfully!');
        this.route.navigate(['master/project-management/assigned-task']);
      },
      error: (error) => {

        this.toast.error('Failed to Update Task Status the project. Please try again.');
        console.error(error);
      },
    });
  }
}

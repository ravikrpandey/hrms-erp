import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProjectManagementService } from '../../services/project-management.service';
import { environment } from 'src/app/environments/environment';
const databaseKey: any = environment.servralUrl;
@Component({
  selector: 'app-view-project',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.scss']
})
export class ViewProjectComponent {
  addProjectForm: FormGroup;
  addMilestoneTable: FormGroup;
  fileUpload: any;
  projectCode:any;
  projectData:any;
  teamMemberDataForm:FormGroup;
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
  milestoneData:any
  employeeData: any;
  documentData:any
  submitted : boolean;
  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private _projectService : ProjectManagementService
  ){
    this.addProjectForm =  this.fb.group({
    
      project_code: new FormControl(null),
      project_name: new FormControl(null),
      client_name: new FormControl(null),
      start_date: new FormControl(null),
      end_date : new FormControl(null),
      description : new FormControl(null),
      project_head: new FormControl(null),
      project_manager: new FormControl(null),
      file: new FormControl(null),
    });
    this.addMilestoneTable =  this.fb.group({
    
      milestone_name: new FormControl(null),
      end_date: new FormControl(null),
    });
    this.teamMemberDataForm = this.fb.group({
      employee_name :new FormControl(null),
      employee_code : new FormControl(null),
    })
  }
  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((res: any) => {
      this.type = res.view;
      this.project_id = res.id;
    })

    const signInUserData = localStorage.getItem('signInUser');
    this.mainEmpId = localStorage.getItem('EmpMainId')
    if(this.project_id){
      this.getProjectById()
    }
    

  }

  getProjectById(){
    this._projectService.getMyProject(this.project_id).subscribe((res:any)=>{
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
      project_head: this.projectData?.project_head_name,
      project_manager: this.projectData?.project_manager_name,
      })
      this.arrayData = this.milestoneData.map((milestone: any) => ({
        id: milestone.id,
        milestone: milestone.milestone_name,
        end_date: milestone.milestoneEnd_date,
      }));

      this.teamMembers = this.employeeData.map((employee: any) => ({
        id: employee.id,
        name: employee.employee_name,
        code: employee.employee_code,
      }));
      this.uploadedDocuments = this.documentData.map((doc:any)=>({
        document: [databaseKey + '/uploaded_files/' + doc.attachments || ''], 
        id:doc.id,
        file: doc.attachments
      }))
    },
      (err: any) => {
        this.toast.warning('Something went wrong! ');
      }
    );
    
  }
  backBtn(){
    this.route.navigate(['master/project-management/my-projects'])
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
selectedFile: any=[];
onFileChange(event: any, index: any) {
    
  if (event.target.files.length > 0) {
    const files = event.target.files;
    
    if (!this.selectedFile[index]) {
      this.selectedFile[index] = []; 
    }

    for (let i = 0; i < files.length; i++) {
      this.selectedFile[index].push(files[i]);
    }
  }
}


onEditorReady(editor: any): void {
  editor.setReadOnly(true);
}
ngAfterViewInit(): void {
  if (this.editer) {
    this.editer.editor.setReadOnly(true); 
  }
}
  downloadFiles(): void {
    this.uploadedDocuments.forEach((doc: any) => {
      this.downloadFile(doc.id);
    });
  }
}

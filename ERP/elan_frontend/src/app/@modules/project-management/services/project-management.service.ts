import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ro } from 'date-fns/locale';

const databaseKey: any = environment.servralUrl;

const routes = {
  projectManagement: {
    generateProjectCode: () => `${databaseKey}/api/v1/generate_Project_code`,
    getEmployees: ()=> `${databaseKey}/api/v1/getAllEmployees`,
    createProject : ()=>`${databaseKey}/api/v1/createOrUpdateProject`,
    getProjectList : (id:any)=>`${databaseKey}/api/v1/getAllProjectData/${id}`,
    updateProject : (id:any)=>`${databaseKey}/api/v1/UpdateProject/${id}`,
    getProjectById : (id:any)=>`${databaseKey}/api/v1/getProjectDataById/${id}`,
    getMyProjectsList : (id:any)=>`${databaseKey}/api/v1/getMyProjectsForManagerOrHead/${id}`,
    getMyProject:(id:any)=>`${databaseKey}/api/v1/getMyProjectDataByIdForManager/${id}`,
    getProjectTeamMemberList:(id:any)=>`${databaseKey}/api/v1/getProjectTeamMemberList/${id}`,
    createOrUpdateTasks : ()=>`${databaseKey}/api/v1/createOrUpdateTasks`,
    getAllParentTasks : (id:any)=>`${databaseKey}/api/v1/getAllParentTasks/${id}`,
    getAllTasks : (id:any)=>`${databaseKey}/api/v1/getAllTasks/${id}`,
    getTotalTasks : (id:any)=>`${databaseKey}/api/v1/getTotalTasks/${id}`,
    getAssignedTasks : (id:any)=>`${databaseKey}/api/v1/getAssignedTasks/${id}`,
    getTasksById : (id:any)=>`${databaseKey}/api/v1/getTasksById/${id}`,
    createRemarks : ()=>`${databaseKey}/api/v1/createRemarks`,
    getAllRemarks : (project_id:any,task_id:any)=>`${databaseKey}/api/v1/getAllRemarks/${project_id}/${task_id}`,
    getTimesheetForManager: (id:any,status:any)=>`${databaseKey}/api/v1/getTimesheetForManager/${id}?status=${status}`,
    getTimesheetById : (id:any)=> `${databaseKey}/api/v1/getTimesheetById/${id}`,
    updateTimesheetStatus : (id:any)=> `${databaseKey}/api/v1/updateTimesheetStatus/${id}`,
    getAllTeamMembersByManagerId: (id:any)=> `${databaseKey}/api/v1/getAllTeamMembersByManagerId/${id}`,
    getTimesheetsByEmployeeIdAndMonth : (id:any,month_id:any)=> `${databaseKey}/api/v1/getTimesheetsByEmployeeIdAndMonth/${id}/${month_id}`,
    deleteEmployee : (project_id:any,id1: any)=> `${databaseKey}/api/v1/deleteEmployee/${project_id}/${id1}`,
    updateTaskStatus: (project_id:any,task_id: any)=>`${databaseKey}/api/v1/updateTaskStatus/${project_id}/${task_id}`,
    dashboardCount : (emp_id:any)=> `${databaseKey}/api/v1/dashboardCount/${emp_id}`,
    getProjectViewTable:(emp_id:any) => `${databaseKey}/api/v1/getProjectViewTable/${emp_id}`,
    getOverdueTasks:(emp_id:any) => `${databaseKey}/api/v1/getOverdueTasks/${emp_id}`,
    getUpcomingTasks:(emp_id:any) => `${databaseKey}/api/v1/getUpcomingTasks/${emp_id}`,
    deleteMilestones : (project_id:any,id1: any)=> `${databaseKey}/api/v1/deleteMilestones/${project_id}/${id1}`,

  },
}
@Injectable({
  providedIn: 'root'
})
export class ProjectManagementService {

  constructor(private http: HttpClient) { }
  getProjectCode() {
    return this.http.get(
      routes.projectManagement.generateProjectCode()
    );
  }
  getProjectList(id:any){
    return this.http.get(routes.projectManagement.getProjectList(id))
  }
  getProjectById(id:any){
    return this.http.get(routes.projectManagement.getProjectById(id))
  }
  getEmployees() {
    return this.http.get(
      routes.projectManagement.getEmployees()
    );
  }
  createProject(data:any){
    return this.http.post(routes.projectManagement.createProject(),data)
  }
  updateProject(id:any,data:any){
    return this.http.patch(routes.projectManagement.updateProject(id),data)
  }
  getMyProjectsList(id:any){
    return this.http.get(routes.projectManagement.getMyProjectsList(id))
  }
  getMyProject(id:any){
    return this.http.get(routes.projectManagement.getMyProject(id))
  }
  getProjectTeamMemberList(id:any){
    return this.http.get(routes.projectManagement.getProjectTeamMemberList(id))
  }
  createOrUpdateTasks(data:any){
    return this.http.post(routes.projectManagement.createOrUpdateTasks(),data)
  }
  getAllParentTasks(id:any){
    return this.http.get(routes.projectManagement.getAllParentTasks(id))
  }
  getAllTasks(id:any){
    return this.http.get(routes.projectManagement.getAllTasks(id))
  }
  getTotalTasks(id:any){
    return this.http.get(routes.projectManagement.getTotalTasks(id))
  }
  getAssignedTasks(id:any){
    return this.http.get(routes.projectManagement.getAssignedTasks(id))
  }
  getTasksById(id:any){
    return this.http.get(routes.projectManagement.getTasksById(id))
  }
  createRemarks(data:any){
    return this.http.post(routes.projectManagement.createRemarks(),data)
  }
  getAllRemarks(project_id:any,task_id:any){
    return this.http.get(routes.projectManagement.getAllRemarks(project_id,task_id))
  }
  getTimesheetForManager(id:any,status:any){
    return this.http.get(routes.projectManagement.getTimesheetForManager(id,status))
  }
  getTimesheetById(id:any){
    return this.http.get(routes.projectManagement.getTimesheetById(id))
  }
  updateTimesheetStatus(id:any,data:any){
    return this.http.post(routes.projectManagement.updateTimesheetStatus(id),data)
  }
  getAllTeamMembersByManagerId(id:any){
    return this.http.get(routes.projectManagement.getAllTeamMembersByManagerId(id))
  }
  getTimesheetsByEmployeeIdAndMonth(id:any,month_id:any){
    return this.http.get(routes.projectManagement.getTimesheetsByEmployeeIdAndMonth(id,month_id))
  }
  deleteEmployee(project_id:any,id:any){
    return this.http.delete(routes.projectManagement.deleteEmployee(project_id,id))
  }
  updateTaskStatus(project_id:any,task_id:any,data:any){
    return this.http.patch(routes.projectManagement.updateTaskStatus(project_id,task_id),data);
  }
  dashboardCount(emp_id:any){
    return this.http.get(routes.projectManagement.dashboardCount(emp_id))
  }
  getProjectViewTable(emp_id:any){
    return this.http.get(routes.projectManagement.getProjectViewTable(emp_id))
  }
  getOverdueTasks(emp_id:any){
    return this.http.get(routes.projectManagement.getOverdueTasks(emp_id))
  }
  getUpcomingTasks(emp_id:any){
    return this.http.get(routes.projectManagement.getUpcomingTasks(emp_id))
  }
  deleteMilestones(project_id:any,id:any){
    return this.http.delete(routes.projectManagement.deleteMilestones(project_id,id))
  }
}

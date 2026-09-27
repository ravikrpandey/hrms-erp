import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
const databaseKey: any = environment.servralUrl;

const routes = {
  timesheet: {
    getAllProjectsForUser : (id:any)=>`${databaseKey}/api/v1/getAllProjectsForUser/${id}`,
    getAllTasksForUser : (id:any,emp_id:any)=>`${databaseKey}/api/v1/getAllTasksForUser/${id}/${emp_id}`,
    createTimesheet : ()=>`${databaseKey}/api/v1/createTimeSheet`,
    getMonthList : ()=> `${databaseKey}/api/v1/getMonthList`,
    getTimesheetsById : (id:any)=> `${databaseKey}/api/v1/getTimesheetsByEmployeeId/${id}`,
    getTimesheetDataonMonth : (emp_id:any)=> `${databaseKey}/api/v1/getTimesheetDataonMonth/${emp_id}`,
    getAllTimesheetsOnDate : (emp_id:any,date:any)=> `${databaseKey}/api/v1/getAllTimesheetsOnDate/${emp_id}/${date}`,
  },
}
@Injectable({
  providedIn: 'root'
})
export class TimesheetService {
  constructor(private http: HttpClient) { }
  getProjectList(id:any){
    return this.http.get(routes.timesheet.getAllProjectsForUser(id))
  }
  getProjectTaskList(id:any,emp_id:any){
    return this.http.get(routes.timesheet.getAllTasksForUser(id,emp_id))
  }
  createTimesheet(data:any){
    return this.http.post(routes.timesheet.createTimesheet(),data)
  }
  getMonthList(){
    return this.http.get(routes.timesheet.getMonthList())
  }
  getTimesheetsById(id:any){
    return this.http.get(routes.timesheet.getTimesheetsById(id))
  }
  getTimesheetDataonMonth(emp_id:any,data:any ){
    return this.http.post(routes.timesheet.getTimesheetDataonMonth(emp_id),data)
  }
  getAllTimesheetsOnDate(emp_id:any,date:any){
    return this.http.get(routes.timesheet.getAllTimesheetsOnDate(emp_id,date))
  }
}

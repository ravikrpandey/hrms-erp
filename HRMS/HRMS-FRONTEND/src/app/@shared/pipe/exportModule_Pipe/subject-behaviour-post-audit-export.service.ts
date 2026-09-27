import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectBehaviourPostAuditExportService {

  constructor() { }
  public department:any = new Subject<any>;


  

  setDepartmentType(val:any){
    this.department.next(val)
    
  };
  getDepartmentType(){
    return this.department;
  }
}

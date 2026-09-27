import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataUpdateService {
  constructor() { }
  
  private tableDataSubject = new BehaviorSubject<any[]>([]);
  
  setTableData(data:any[]){
    this.tableDataSubject.next(data)
  }

  getTabledata():Observable<any[]>{
    return  this.tableDataSubject.asObservable();
  }
}

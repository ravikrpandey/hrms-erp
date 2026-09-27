import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { id } from 'date-fns/locale';

const databaseKey: any = environment.servralUrl;

@Injectable({
  providedIn: 'root',
})
export class CrmSubjectService {

  // Unused code
  // selectedLeadList: any = new BehaviorSubject([]);
  // setSelectedLeadList(list: any) {
  //   this.selectedLeadList.next(list);
  // }
  // getSelectedLeadList() {
  //   return this.selectedLeadList;
  // }


}

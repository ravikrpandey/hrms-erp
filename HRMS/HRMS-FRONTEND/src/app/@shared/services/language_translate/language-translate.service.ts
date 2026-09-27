import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageTranslateService {

  private Language_type = new BehaviorSubject<any>('en');
  data$ = this.Language_type.asObservable();

  setLanguage(data: any) {
    this.Language_type.next(data);
  }
  constructor() { }
}

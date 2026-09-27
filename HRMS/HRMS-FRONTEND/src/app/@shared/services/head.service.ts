import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeadService {
  plants = "https://api-uat1.varuna.net/api/Category/GetAll";
  public loginIn = new BehaviorSubject<boolean>(this.tokenAvailable());
  public clicked = new BehaviorSubject<boolean>(false);
  public nav = new BehaviorSubject<boolean>(false);
  public EmpReg = new BehaviorSubject<any>(this.token());
  public hide = new BehaviorSubject<boolean>(this.HideBtn());
  public personalDetail = new BehaviorSubject<boolean>(this.personal());
  public salaryDetail = new BehaviorSubject<boolean>(this.salary());
  public paymentDetail = new BehaviorSubject<boolean>(this.payment());
  public documentDetail = new BehaviorSubject<boolean>(this.document());



  token(): any {
    return !!localStorage.getItem('MyEmpId');
  }

  HideBtn(): boolean {
    return !!localStorage.getItem('hideBtnRow');
  }
  personal(): boolean {
    return !!localStorage.getItem('per');
  }
  salary(): boolean {
    return !!localStorage.getItem('sal');
  }
  payment(): boolean {
    return !!localStorage.getItem('pay');
  }

  tokenAvailable(): boolean {
    return !!localStorage.getItem('token');
  }
  document(): boolean {
    return !!localStorage.getItem('token');
  }

  get isLoggedIn() {
    return this.loginIn.asObservable();
  }
  constructor(private router: Router) { }

  logout() {
    this.loginIn.next(false);
    this.router.navigate(['/auth']);
  }

}

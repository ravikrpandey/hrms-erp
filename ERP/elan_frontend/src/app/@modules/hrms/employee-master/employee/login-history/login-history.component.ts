import { Component } from '@angular/core';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-history',
  templateUrl: './login-history.component.html',
  styleUrls: ['./login-history.component.scss']
})
export class LoginHistoryComponent {

  selectedTab = 0; // 0 = Daily, 1 = Monthly
  selectedDate: any = new Date();
  selectedMonth: any;
  userName: any;

  isPopupOpen = false;
  popupData: any = null;
  dailySessions: any[] = [];
  dailyPages: any[] = [];

  today = new Date(); // max date = today
  maxDate:any;
  minDate:any;
  maxMonth:any;
  minMonth:any;
  employee_id:any;

  constructor(private _empService: EmpRegistrationService, private _activeRoute: ActivatedRoute,) {
    this.setMinMaxDates();
  }

  ngOnInit() {
    this._activeRoute.queryParams.subscribe((params: any) => {
      this.employee_id = params.employee_id;
      if (this.employee_id) {
        this.dailyLoginHistory();
        this.filterMonthlyData();
      }
    })
  }

  // set max or min date or month
  setMinMaxDates() {
    // --- MAX DATE (TODAY) ---
    this.maxDate = this.selectedDate;

    // --- MIN DATE (TODAY - 6 MONTH) ---
    this.minDate = new Date();
    this.minDate.setMonth(this.minDate.getMonth() - 1);

    // --- For Month Picker ---
    const y = this.today.getFullYear();
    const m = this.today.getMonth(); // 0 = Jan

    // Max Month = current month (yyyy-mm)
    this.maxMonth = `${y}-${String(m + 1).padStart(2, '0')}`;
    this.selectedMonth = this.maxMonth;

    // Min Month = 6 months old (yyyy-mm)
    const min = new Date();
    min.setMonth(min.getMonth() - 12);
    this.minMonth = `${min.getFullYear()}-${String(min.getMonth() + 1).padStart(2, '0')}`;
  }

  // -------------------------- //
  // DAILY CODE
  // -------------------------- //

  dailyLoginHistory(event:any=null){
    const dateKey = new Date(this.selectedDate).toLocaleDateString("en-CA"); // YYYY-MM-DD
    const obj={
      employeeId:this.employee_id,
      selectedDate:dateKey,
      type:'Daily'
    };
    
    this._empService.getLoginHistory(obj).subscribe(
      (res: any) => {
        this.userName = res.data.userName.employee_name;
        this.dailySessions = res.data.sessionData;
        this.dailyPages =  res.data.pageData;

        for(let i of this.dailySessions){
          i['login_time'] = this.getTime(i.login_time);
          i['logout_time'] = this.getTime(i.logout_time);
          i['session_duration'] = this.convertSecondsToText(i.session_duration);
        }

        for(let i of this.dailyPages){
          i['time'] = this.getTime(i.time);
          i['page_name'] = this.formatPageName(i.page_name);
        }
    })
  }

  getTime(date:any){
    if (!date) return 'Logged In';

    const d = new Date(date);

    const hours = d.getHours() % 12 || 12;
    const minutes = ("0" + d.getMinutes()).slice(-2);
    const ampm = d.getHours() >= 12 ? "PM" : "AM";

    return `${hours}:${minutes} ${ampm}`;
  }

  convertSecondsToText(sec: any): string {
    if (!sec && sec !== 0) return "-";
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return `${hours} hr ${minutes} min`;
    // return `${hours} hr ${minutes} min ${seconds} sec`;
  }

  formatPageName(url: string) {
    // 1. Query string remove
    let clean = url.split('?')[0];

    // 2. First letter uppercase
    clean = clean.charAt(0).toUpperCase() + clean.slice(1);

    return clean;
  }


  // -------------------------- //
  // MONTHLY CODE
  // -------------------------- //

  monthlyData:any =[];
  filterMonthlyData() {
    const month = this.selectedMonth;

    const obj={
      employeeId:this.employee_id,
      selectedDate:month,
      type:'Month'
    };
    
    this._empService.getLoginHistory(obj).subscribe(
      (res: any) => {
        this.userName = res.data.userName.employee_name;
        this.monthlyData = res.data.sessionDataMonth;

        for(let i of this.monthlyData){
          i['totalDuration'] = this.convertSecondsToText(i.totalDuration);

          for(let s of i.sessions){
            s['login'] = this.getTime(s.login);
            s['logout'] = this.getTime(s.logout);
            s['duration'] = this.convertSecondsToText(s.duration);
          }

          for(let p of i.pages){
            p['time'] = this.getTime(p.time);
            p['page'] = this.formatPageName(p.page);
          }
        }
    })
  }

  // ------------------------------
  // Popup Functions
  // ------------------------------

  openPopup(data: any) {
    this.popupData = data;
    this.isPopupOpen = true;
    document.body.style.overflow = 'hidden'; 
  }

  closePopup() {
    this.isPopupOpen = false;
    this.popupData = null;
    document.body.style.overflow = 'auto';
  }
}

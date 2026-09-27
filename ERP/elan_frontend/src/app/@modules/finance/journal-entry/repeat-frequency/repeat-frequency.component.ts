import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { FinaceService } from 'src/app/@shared/services/finace.service';

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-repeat-frequency',
  templateUrl: './repeat-frequency.component.html',
  styleUrls: ['./repeat-frequency.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  
  ]
})


export class RepeatFrequencyComponent implements OnInit {
  fieldTypeList: any = [];
  filterControl = new FormControl();
  repeatFrequency: any;
  custonDropdown = new FormControl();
  candidate_id?: number;
  loading: boolean = false;
  nameSearch: any = '';
  config: any;
  loginUser: any;
  myDate = new Date();
  now = new Date();
  year = this.now.getFullYear();
  month = this.now.getMonth();
  date = this.now.getDate();
  maxDate = moment({ year: this.year + 100, month: this.month, date: this.date }).format('YYYY-MM-DD');
  minDate = moment({ year: this.year - 0, month: this.month, date: this.date }).format('YYYY-MM-DD');
  minEndDate: Date |any;
  getFrequencyList: any = [];
  journal_id: any;
  hideEndDate: boolean = true;
  startDate: any;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private toast: ToastrService,
    private _finaceService: FinaceService,
    public dialog: MatDialogRef<RepeatFrequencyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.journal_id = this.data.id.id;
    this.repeatFrequency = this.fb.group({
      frequency_type: new FormControl(null, [Validators.required]),
      start_date: new FormControl(null,Validators.required),
      end_date: new FormControl(null),
      journal_id: new FormControl(this.journal_id)
    });

    this.repeatFrequency.get('start_date').valueChanges.subscribe((value: any) => {
      if (value) {
        this.startDate = new Date(this.repeatFrequency.get('start_date').value);
        const days = this.getDaysInMonthFromDate(new Date(this.startDate));  
        const futureDate = this.getDateAfter30Days(days);
        this.repeatFrequency.get('end_date').enable();
        const date = new Date(futureDate);
        const isoString = date.toISOString();
        this.minEndDate = isoString;
        const endDate = this.repeatFrequency.get('end_date').value;
        this.repeatFrequency.get('end_date').setValue(this.minEndDate);
        // if (endDate < this.minEndDate) {
        //   this.repeatFrequency.get('end_date').setValue(null);
        // }
      }
    });
  }

  ngOnInit() {
    if(this.data.id.journal_status == 'APPROVED'){
      const date = new Date(this.data.id.posting_date);
      date.setDate(date.getDate() + 1);
      const year = date.getFullYear();
      const month = date.getMonth();
      const postingdate = date.getDate();
      const maxDate = moment({ year: year + 100, month: month, date: postingdate }).format('YYYY-MM-DD');
      const minDate = moment({ year: year - 0, month: month, date: postingdate }).format('YYYY-MM-DD');
      if(maxDate > this.maxDate && minDate >this.minDate){
        this.maxDate = maxDate;
        this.minDate = minDate;
      }
    } 
    let lg: any = localStorage.getItem('signInUser')
    this.loginUser = JSON.parse(lg);
    this.getFrequency();
  }

  getDaysInMonthFromDate(startDate: Date): any {
    let frequency = this.repeatFrequency.get('frequency_type').value;
    if(frequency == 'daily'){
      return 0;
     }
    else if(frequency == 'weekly'){
     return 6;
    }
    else if(frequency == 'monthly'){
      const year = startDate.getFullYear();
      const month = startDate.getMonth();
      if(month == 28){
        return new Date(year, month + 1, 0).getDate()+2;
      }
      if(month == 29){
        return new Date(year, month + 1, 0).getDate()+1;
      }
      return new Date(year, month + 1, 0).getDate()-1;
    }
    else if(frequency == 'quarterly'){
      // const year = startDate.getFullYear();
      // const month = startDate.getMonth();
      // return new Date(year, month + 1, 0).getDate()*3;
      return (30*3)+1
    }
    else if(frequency == 'half-yearly'){
      // const year = startDate.getFullYear();
      // const month = startDate.getMonth();
      // return new Date(year, month + 1, 0).getDate()*6;
      return (30*6)+1
    }
    else if(frequency == 'yearly'){
      // const year = startDate.getFullYear();
      // const month = startDate.getMonth();
      // return new Date(year, month + 1, 0).getDate()*12;
      return (30*12)+4
    }
    else{
      return 0
    }
  }

  getDateAfter30Days(days:any) {
    this.startDate.setDate(this.startDate.getDate() + days);
    const options:any = { timeZone: 'Asia/Kolkata', year: 'numeric', month: 'numeric', day: 'numeric' };
    const indiaDate = new Intl.DateTimeFormat('en-IN', options).format(this.startDate);
    const [day, month, year] = indiaDate.split('/').map(Number);
    const newDate:any = new Date(Date.UTC(year, month - 1, day, this.startDate.getUTCHours(), this.startDate.getUTCMinutes(), this.startDate.getUTCSeconds()));
    
    const newDateString = newDate.toISOString();
    return newDateString;
  }

  getFrequency() {
    this.getFrequencyList = [
      { "type": 'once', "value": "Once" },
      { "type": 'daily', "value": "Daily" },
      { "type": 'weekly', "value": "Weekly" },
      { "type": 'monthly', "value": "Monthly" },
      { "type": 'quarterly', "value": "Quarterly" },
      { "type": 'half-yearly', "value": "Half-Yearly" },
      { "type": 'yearly', "value": "Yearly" }
    ]
  
    // try {
    //   this.$projectListService.getProjectFieldType().subscribe((response: any) => {
    //     if (response) {
    //       this.fieldTypeList = response.data;
    //     }
    //   }, err => {
    //     console.log(err);
    //   })
    // } catch (error) {
    //   console.log(error);
    // }
  }

  onPanelClose() {
    this.filterControl.setValue('');
  }

  onFrequencyChange(event:any){
   if(event.value == 'once'){
    this.hideEndDate = true;
    this.repeatFrequency.get('end_date').setValue(null);
   }
   else{
    this.hideEndDate = false;
    this.repeatFrequency.get('start_date').setValue(null);
    this.repeatFrequency.get('end_date').setValue(null);
   }
  }

  saveDetails(form: FormGroup) {
    if(form.status == 'INVALID'){
      return
    }
    else{
      if(this.hideEndDate){
        this.repeatFrequency.get('end_date').setValue(null);
      }

      // this.repeatFrequency = this.fb.group({
      //   frequency_type: new FormControl(null, [Validators.required]),
      //   start_date: new FormControl(null,Validators.required),
      //   end_date: new FormControl(null),
      //   journal_id: new FormControl(this.journal_id)
      // });
      let startDate = this.repeatFrequency.get('start_date')?.value;
      let endDate = this.repeatFrequency.get('end_date')?.value;
      let start_date = new Date(startDate);
      start_date.setDate(start_date.getDate() + 1)

      let end_date = new Date(endDate);
      end_date.setDate(end_date.getDate() + 1)

      let data = {
        frequency_type: this.repeatFrequency.get('frequency_type')?.value,
        start_date: start_date,
        end_date: end_date,
        journal_id: this.repeatFrequency.get('journal_id')?.value,
      }
      this._finaceService.RepeatFrequencySetUp(data).subscribe((response: any) => {
        if (response) {
          this.toast.success('Frequency Setup successfully..');
          this.dialog.close();
          this.reloadCurrentRoute();
        }
      }, err => {
        this.toast.error(err?.error?.message);
       
      })
    }
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    })
  };
}



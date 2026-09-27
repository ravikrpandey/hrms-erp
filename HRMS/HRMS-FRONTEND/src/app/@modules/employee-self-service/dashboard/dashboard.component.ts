import { ChangeDetectorRef, Component, OnInit, ViewChild, Input, OnDestroy } from '@angular/core';
import {
  CalendarOptions,
  CustomRenderingStore,
  DateSelectArg,
  EventApi,
  EventClickArg,
} from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { Slick } from 'ngx-slickjs';
import { DashboardService } from './dashboard.service';
import { environment } from 'src/app/environments/environment';
import { format } from 'date-fns';
import { AttendanceService } from 'src/app/@shared/services/service/attendance/attendance.service';
import { DashTravelJourneyComponent } from 'src/app/@shared/components/dialog/dash-travel-journey/dash-travel-journey.component';
import { TravelPlanDialogComponent } from 'src/app/@shared/components/dialog/travel-plan-dialog/travel-plan-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { AnnoncementImageModelComponent } from '../../hrms/announcement/annoncement-image-model/annoncement-image-model.component';
import { AttendanceVerificationDialogComponent } from '../attendance-verification-dialog/attendance-verification-dialog.component';
// import { Subject } from 'rxjs';

// import { debounceTime } from 'rxjs/operators';

import { Subject, takeUntil } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';

const databaseKey: any = environment.serverUrl;

interface Employee {
  employee_photo: string;
  first_name: string;
  last_name: string;
  designation_name: string;
  date_of_birth: string;
  start_working_date?: string;
  event_type: string;
}

interface calendarEvent {
  id: string,
  title: string,
  date: Date,
  backgroundColor: string
}

interface widthDuratoion extends calendarEvent {
  duration: string
}
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  calendarVisible = true;
  eventName: any;
  eventTime: any;
  tavelCalendarVisible = true;
  currentEvents: EventApi[] = [];
  colorBox: any[] = ['#d50000', '#e67c73', '#f4511e', '#f6bf26', '#33b679', '#0b8043', '#039be5', '#3f51b5', '#7986cb', '#8e24aa']

  allEvent: calendarEvent[] = [];
  eventsPromise: any = [];
  allEventWidthDuration: widthDuratoion[] = [];

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  EmpListData: any;
  loginUser: any;
  screenOnOffData: any;
  selectedEmp: any;
  searchVal: any = '';
  assignAction: any;
  @ViewChild('calendar', { static: true }) calendar!: FullCalendarComponent
  AllEmployee: any;
  allatendance: any;
  attandData: any;
  data: any;
  parse: any;
  entity_id: any;
  mainId: any;
  corouseldata: any[] = [];
  images: Employee[] = [];
  baseUrl: string = environment.serverUrl;
  loginUserDetails: any;
  last_name: any;
  res: any;

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  config: Slick.Config = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000
  };
  employee_photo: any;
  travelData: any;
  financialId: any;
  // travelService: any;
  // Login_user_id: any = localStorage.getItem('signInUser');
  // loginUserId: any = JSON.parse(this.Login_user_id).employee_id
  // loginUserName: any = JSON.parse(this.Login_user_id).first_name
  constructor(
    private toaster: ToastrService,
    private changeDetector: ChangeDetectorRef,
    private dashboardService: DashboardService,
    private travelService : TravelRequestService,
    private $attendance: AttendanceService,
    private dialog: MatDialog,
    private http: HttpClient, private router: Router,
    private authService: AuthService
  ) {
    this.baseUrl = environment.serverUrl;
    this.data = localStorage.getItem('signInUser');
    this.parse = JSON.parse(this.data);
  }
  search$ = new Subject<string>();
  searchTerm: string = '';
searchResults: any[] = [];
showDropdown = false;

  allRoutes: any[] = [];
  filteredRoutes: any[] = [];

  ngOnInit() {
    this.loginUserDetails = JSON.parse(localStorage.getItem('loginUserDetails') || '{}');
    this.mainId = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem("selectedEntityId");
    this.SuperadmingetAllUserProfile();


    this.loginUserDetails = localStorage.getItem("loginUserDetails");
    
    this.loginUserDetails = JSON.parse(this.loginUserDetails)
     this.financialId = localStorage.getItem('financial_id')!;
    this.get_DAILY_attendance();
    this.getAll_AnnouncementBy_dept();
    this.getTravelRequests();
    if (!(this.loginUserDetails.last_name == null || this.loginUserDetails.last_name == undefined || this.loginUserDetails.last_name == 'undefined')) {
      this.last_name = this.loginUserDetails.last_name;
    }

  }




  ngAfterViewInit(): void {

  }
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    eventTimeFormat: { // like '14:30:00'
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [
      { title: 'event 1', date: '2023-02-11', color: 'purple' },
      { title: 'event 1', date: '2023-02-12', color: 'blue' },
      { title: 'event 2', date: '2023-02-12', color: 'purple' },
      { title: 'event 1', date: '2023-02-15', color: 'red' },
      { title: 'event 2', date: '2023-02-15', color: 'yellow', textColor: 'black' },
      { title: 'event 1', date: '2023-02-25', color: '#9E7BFF' },
      { title: 'event 2', date: '2023-02-25', color: 'red' },
      { title: 'event 3', date: '2023-02-25', color: 'purple' },
      { title: 'event 4', date: '2023-02-25', color: '#FFAE42' },
      { title: 'event 5', date: '2023-02-25', color: 'green' },
    ],
    // eventColor: 'red',

    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  };

  async handleDateSelect(selectInfo: DateSelectArg) {
    let newDate = moment(new Date()).format("MM/DD/YYYY");
    let date = new Date(selectInfo.startStr);
    let selDate = moment(date).format("MM/DD/YYYY");

    let today = new Date(newDate);
    let selectDate = new Date(selDate);

    if (today > selectDate) {
      this.toaster.warning(`You are not able to add event on ${moment(date).format("DD/MM/YYYY")} Date`, 'Select Valid Date');
      return
    }

    const { value: title } = await Swal.fire({
      title: 'Enter a new title for your event',
      showCancelButton: true,
      confirmButtonText: 'Create',
      confirmButtonColor: '#063178',
      cancelButtonColor: 'rgb(244, 67, 54)',
      html:
        '<input type="text" id="swal-input1" class="swalInput" style=" border: 1px solid #959595; padding-left: 10px; border-radius: 5px; outline: none; height: 40px;margin-right: 10px; width: 42%;" placeholder="Event name">' +
        '<input type="time" id="swal-input2" class="swalInput" style=" border: 1px solid #959595; padding-left: 10px; border-radius: 5px; outline: none; height: 40px;margin-right: 10px; width: 25%;" placeholder="Time">',

      focusConfirm: false,
      preConfirm: () => {
        if (this.eventName.value === '') {
          this.toaster.error('Event name should not be blank');
          return false;
        } else if (this.eventName.value.length > 10) {
          this.toaster.error('Event name should contain maximum 10 length');
          return false;
        } else {
          if (this.eventTime.value) {
            return `${this.eventName.value} /- ${this.eventTime.value}`
          } else {
            return `${this.eventName.value}`
          }
        }
      },
    })

    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection
    // 
    if (title) {
      calendarApi.addEvent({
        // id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
      const data = {
        title,
        date: selDate
      }


    }

  }

  openTravelPlanDialog() {
    const dialogRef = this.dialog.open(TravelPlanDialogComponent, {
      height: 'calc(100% - 200px)',
      width: 'calc(100% - 200px)',
      maxWidth: '100%',
      maxHeight: '100%',
      // width: '100%',
      // height: '600px',
      disableClose: true,
      data: {
        date: null,
        isOpenDialog: true,
      },
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result, 'dialog result');
      if (result) {
        this.getTravelRequests();
      }
    });
  }

  handleTravelDateClick(arg: DateClickArg): void {
    const dialogRef = this.dialog.open(DashTravelJourneyComponent, {
      height: 'calc(100% - 200px)',
      width: 'calc(100% - 200px)',
      maxWidth: '100%',
      maxHeight: '100%',
      // width: '100%',
      // height: '600px',
      disableClose: true,
      data: {
        date: arg.dateStr,
        isOpenDialog: true,
      },
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(result, 'dialog result');
      if (result) {
        this.getTravelRequests();
      }
    });
  }
  travelCalendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleTravelDateClick(arg),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    events: [],
    // dayCellClassNames: (arg) => {
    //   const date = arg.date;
    //   const dayOfWeek = date.getDay();
    //   if (dayOfWeek === 6) {
    //     return 'saturday';
    //   } else if (dayOfWeek === 0) {
    //     return 'sunday';
    //   }
    //   return '';
    // },
    eventDidMount: (info) => {
      info.el.style.cursor = 'pointer';
    },
  };

  handleEventClick(clickInfo: EventClickArg) {

    // 
    let isShow = false;
    let box: any = document.querySelector('.fc-more-popover');
    if (box) {
      box.style.display = 'none';
    };

    let val = clickInfo.event.title.split('/-');

    Swal.fire({
      title: `Are you sure to delete this event`,
      text: `Event name : ${val[0]} ${val[1] ? ', Time : ' + val[1] : ''}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#be0000',
      cancelButtonColor: '#063178',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        clickInfo.event.remove();
        this.toaster.success('Event deleted successfully')
      };
    })
  }

  getTravelRequests() {
    this.travelService
      .getTravelRequestOfEmp(this.entity_id, this.financialId,this.loginUserDetails.employee_id)
      .subscribe((res: any) => {
        this.travelData = res.data;

        const attendanceStatusMapping: {
          [key: string]: { label: string; color: string };
        } = {
          APPROVED: { label: 'APPROVED', color: 'green' },
          REJECTED: { label: 'REJECTED', color: '#8c0000' },
          PENDING: { label: 'PENDING', color: 'orange' },
          DRAFT: { label: 'DRAFT', color: 'blue' },
          DA: { label: 'Default Absent', color: 'gray' },
          DP: { label: 'Default Present', color: 'lightgreen' },
          HD: { label: 'Half Day', color: 'yellow' },
          PHL: { label: 'Paid Half-Day Leave', color: 'cyan' },
          UHL: { label: 'Unpaid Half-Day Leave', color: 'pink' },
        };

        const events = this.travelData.flatMap((entry: any) => {
          const status = attendanceStatusMapping[
            entry.travel_request_status
          ] || {
            label: 'Unknown',
            color: 'gray',
          };

          return entry.ESS_TRAVEL_REQUEST_DATA.flatMap((data: any) => {
            const startDate = moment(data.travel_from_date);
            const endDate = moment(data.travel_to_date);

            const days: any[] = [];
            let currentDate = startDate.clone();

            while (currentDate.isSameOrBefore(endDate, 'day')) {
              days.push({
                title: entry.travel_request_number,
                start: currentDate.format('YYYY-MM-DD'),
                textColor: 'white',
                backgroundColor: status.color,
              });
              currentDate.add(1, 'day'); // move to next day
            }

            return days;
          });
        });

        this.travelCalendarOptions.events = events;
      });
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  };
  SuperadmingetAllUserProfile(): void {
    this.dashboardService.SuperadmingetAllUserProfile(this.entity_id).subscribe((res: any) => {
      console.log('API Response:', res);
      if (res && res.data && Array.isArray(res.data)) {
        this.images = res.data.map((item: any) => {
          const eventMessages = this.calculateEventMessages(item.start_working_date, item.date_of_birth);

          return {
            employee_photo: item.employee_photo,
            first_name: item.first_name,
            last_name: item.last_name,
            designation_name: item.designation_name,
            date_of_birth: item.date_of_birth,
            start_working_date: item.start_working_date,
            event_type: eventMessages
          };
        });
        console.log('Mapped Images Array:', this.images);
      } else {
        console.error('Unexpected response format:', res);
      }
    });
  }

  calculateEventMessages(startDate: string, birthDate: string): string[] {
    const currentDate = new Date();
    const messages: string[] = [];

    // Check for Work Anniversary
    if (startDate) {
      const startWorkingDate = new Date(startDate);
      const yearsWorked = currentDate.getFullYear() - startWorkingDate.getFullYear();
      const isSameDay = startWorkingDate.getDate() === currentDate.getDate() && startWorkingDate.getMonth() === currentDate.getMonth();

      if (isSameDay && yearsWorked > 0) {
        const ordinal = this.getOrdinalSuffix(yearsWorked);
        messages.push(`Happy ${yearsWorked}${ordinal} Work Anniversary`);
      }
    }

    // Check for Birthday
    if (birthDate) {
      const birthDateObj = new Date(birthDate);
      const isBirthday = birthDateObj.getDate() === currentDate.getDate() && birthDateObj.getMonth() === currentDate.getMonth();

      if (isBirthday) {
        messages.push('Happy Birthday');
      }
    }

    return messages;
  }

  announcement:any=[];
getAll_AnnouncementBy_dept(){
  this.dashboardService.getAll_AnnouncementBy_dept(this.loginUserDetails.department_id,this.loginUserDetails.roles).subscribe((res:any)=>{
             if(res){
               this.announcement=res.data;
             }
  },(err:any)=>{

  })
}

openAnnouncementDialog(announcement: any): void {
  this.dialog.open(AnnoncementImageModelComponent, {
    maxWidth: '95vw',
    maxHeight: '90vh',
    width: '70%',
    data: {
      image: this.baseUrl + '/uploaded_files/' + announcement?.file_Name,
      title: announcement?.notice_title,
      description: announcement?.description
    }
  });
}
  getOrdinalSuffix(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return (s[(v - 20) % 10] || s[v] || s[0]);
  }

  currentFullDate: any;
  currentDate: any;
  checkInTime: any;
  checkOutTime: any;
  isCheckIn: boolean = false;
  isDisabled: boolean = true;
  prev_in_time: any;
  prev_out_time: any;
  previousDate: any;

  // Check-in and check-out flow start

  // get current time start
  extractTime(fullDate: any) {
    let hours = fullDate.getHours();
    const minutes = fullDate.getMinutes();
    const seconds = fullDate.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12;

    let timeString = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)} ${ampm}`;
    return timeString;
  }

  pad(value: number): string {
    return value < 10 ? '0' + value : '' + value;
  }

  create_DAILY_attendance(actionType: any): void {
    try {
      const dialogRef = this.dialog.open(AttendanceVerificationDialogComponent, {
        width: '540px',
        maxWidth: '95vw',
        disableClose: true,
        data: {
          entry_type: actionType,
          employee_id: this.mainId,
          employee_name: `${this.parse?.first_name || ''} ${this.parse?.last_name || ''}`.trim(),
          employee_code: this.parse?.employee_code || this.loginUserDetails?.employee_code || ''
        },
        panelClass: 'attendance-verification-dialog-panel'
      });

      dialogRef.afterClosed().subscribe((result: any) => {
        if (result && result.success) {
          this.toaster.success(result.message || `Attendance ${actionType} recorded successfully!`);
          this.get_DAILY_attendance();
        }
      });
    } catch (err) {
      console.error('Attendance dialog error:', err);
    }
  }

  get_DAILY_attendance(): void {
    try {

      let currentDate = new Date();
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let att_day: any = currentDate.getDay();
      att_day = daysOfWeek[att_day];
      let att_month = currentDate.getMonth() + 1;
      let att_year = currentDate.getFullYear();
      let entity_id = localStorage.getItem("selectedEntityId");

      let query = {
        att_day: att_day,
        att_month: att_month,
        att_year: att_year,
        att_date: format(currentDate, 'yyyy-MM-dd'),
        entity_id: entity_id,
        employee_id: this.mainId,
      }
      this.$attendance.get_DAILY_attendance(query).subscribe((res: any) => {
        if (res) {
          if (res?.IN_time) {
            this.checkInTime = res?.IN_time;
            this.currentDate = format(new Date(), 'dd-MM-yyyy');
          }
          if (res?.out_time) this.checkOutTime = res?.out_time;
          if (res?.checktime == 'IN') this.isCheckIn = true;
          if (res?.checktime == 'OUT') this.isCheckIn = false;
          this.prev_in_time = res?.prev_in_time;
          this.prev_out_time = res?.prev_out_time;
          this.previousDate = res?.previousDate;
        }
      });
    } catch (err) {
      console.log(err);
    }
  }


}

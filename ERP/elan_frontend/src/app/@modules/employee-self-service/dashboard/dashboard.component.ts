import {
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  CalendarOptions,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Slick } from 'ngx-slickjs';
import { DashboardService } from './dashboard.service';
import { environment } from 'src/app/environments/environment';
import { format } from 'date-fns';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
import { MatDialog } from '@angular/material/dialog';
import { TravelRequestService } from 'src/app/@shared/services/travelrequest/travel-request.service';
import { DashTravelJourneyComponent } from 'src/app/@shared/components/widgets/dialog/dash-travel-journey/dash-travel-journey.component';
import { TravelPlanDialogComponent } from 'src/app/@shared/components/widgets/dialog/travel-plan-dialog/travel-plan-dialog.component';
import { AccessControlService } from 'src/app/@shared/services/access-control.service';
import { UserData } from 'src/app/@shared/interface/core.interface';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';

interface Employee {
  employee_photo: string;
  first_name: string;
  last_name: string;
  designation_name: string;
  date_of_birth: string;
  start_working_date?: string;
  event_type: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  tavelCalendarVisible = true;
  assignAction: any;
  userData: UserData;
  entity_id: any;
  financialId: any;
  mainId: any;
  corouseldata: any[] = [];
  images: Employee[] = [];
  baseUrl: string = environment.servralUrl;
  loginUserDetails: any;
  last_name: any;
  travelData: any;
  config: Slick.Config = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2000,
  };
  currentDate: string = format(new Date(), 'dd-MM-yyyy');
  holidays: any[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private toaster: ToastrService,
    private dashboardService: DashboardService,
    private hrms: HrmServiceService,
    public travelService: TravelRequestService,
    private dialog: MatDialog,
    private accessCtrl: AccessControlService,
    private authService: AuthService
  ) {
    this.baseUrl = environment.servralUrl;
    this.userData = this.accessCtrl.getUser()!;
  }

  ngOnInit() {
    this.mainId = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financialId = localStorage.getItem('financial_id')!;
    this.SuperadmingetAllUserProfile();
    this.getAllUpcomingHolidays();

    this.loginUserDetails = localStorage.getItem('signInUser');
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    if (
      !(
        this.loginUserDetails.last_name == null ||
        this.loginUserDetails.last_name == undefined ||
        this.loginUserDetails.last_name == 'undefined'
      )
    ) {
      this.last_name = this.loginUserDetails.last_name;
    }

    this.getTravelRequests();
  }

  getAllUpcomingHolidays() {
    this.hrms
      .getAllUpcomingHolidays(this.entity_id, this.financialId)
      .subscribe((res: any) => {
        this.holidays = res.data || [];
      });
  }

  SuperadmingetAllUserProfile(): void {
    this.dashboardService
      .SuperadmingetAllUserProfile(this.entity_id)
      .subscribe((res: any) => {
        if (res && res.data && Array.isArray(res.data)) {
          this.images = res.data.map((item: any) => {
            const eventMessages = this.calculateEventMessages(
              item.start_working_date,
              item.date_of_birth
            );

            return {
              employee_photo: item.employee_photo,
              first_name: item.first_name,
              last_name: item.last_name,
              designation_name: item.designation_name,
              date_of_birth: item.date_of_birth,
              start_working_date: item.start_working_date,
              event_type: eventMessages,
            };
          });
        }
      });
  }

  calculateEventMessages(startDate: string, birthDate: string): string[] {
    const currentDate = new Date();
    const messages: string[] = [];

    if (startDate) {
      const startWorkingDate = new Date(startDate);
      const yearsWorked =
        currentDate.getFullYear() - startWorkingDate.getFullYear();
      const isSameDay =
        startWorkingDate.getDate() === currentDate.getDate() &&
        startWorkingDate.getMonth() === currentDate.getMonth();

      if (isSameDay && yearsWorked > 0) {
        const ordinal = this.getOrdinalSuffix(yearsWorked);
        messages.push(`Happy ${yearsWorked}${ordinal} Work Anniversary`);
      }
    }

    if (birthDate) {
      const birthDateObj = new Date(birthDate);
      const isBirthday =
        birthDateObj.getDate() === currentDate.getDate() &&
        birthDateObj.getMonth() === currentDate.getMonth();

      if (isBirthday) {
        messages.push('Happy Birthday');
      }
    }

    return messages;
  }

  getOrdinalSuffix(n: number): string {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
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
    eventDidMount: (info) => {
      info.el.style.cursor = 'pointer';
    },
  };

  handleTravelDateClick(arg: DateClickArg): void {
    const dialogRef = this.dialog.open(DashTravelJourneyComponent, {
      height: 'calc(100% - 0px)',
      width: 'calc(100% - 0px)',
      maxWidth: '100%',
      maxHeight: '100%',
      disableClose: true,
      data: {
        arg: arg,
        date: arg.dateStr,
        isOpenDialog: true,
      },
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getTravelRequests();
      }
    });
  }

  getTravelRequests() {
    this.travelService
      .getTravelRequestOfEmp(this.entity_id, this.financialId)
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
              currentDate.add(1, 'day');
            }

            return days;
          });
        });

        this.travelCalendarOptions.events = events;
      });
  }

  openTravelPlanDialog() {
    const dialogRef = this.dialog.open(TravelPlanDialogComponent, {
      height: 'calc(100% - 0px)',
      width: 'calc(100% - 0px)',
      maxWidth: '100%',
      maxHeight: '100%',
      disableClose: true,
      data: {
        date: null,
        isOpenDialog: true,
      },
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.getTravelRequests();
      }
    });
  }

  switchToHrms() {
    let empId = localStorage.getItem('EmpMainId');
    let email: any = '';

    const userRaw =
      localStorage.getItem('loginUserDetails') ||
      localStorage.getItem('signInUser');
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        empId = user?.employee_id || empId;
        email = user?.employee_official_email || user?.email || '';
      } catch (e) {
        console.error('Error parsing user details:', e);
      }
    }

    if (!empId) {
      this.toaster.error('User session not found.');
      return;
    }

    this.authService
      .generateSsoToken({ employee_id: empId, email })
      .subscribe({
        next: (res: any) => {
          if (res.success && res.ssoToken) {
            let hrmsUrl = (environment as any).hrmsUrl;
            if (!hrmsUrl) {
              hrmsUrl = window.location.pathname.startsWith('/hrms-erp')
                ? `${window.location.origin}/hrms-erp`
                : 'http://localhost:4201';
            }
            window.open(`${hrmsUrl.replace(/\/$/, '')}/auth/sso?token=${res.ssoToken}`, '_blank');
          } else {
            this.toaster.error(
              res?.message || 'Failed to generate HRMS session token'
            );
          }
        },
        error: (err: any) => {
          console.error('SSO token generation error:', err);
          this.toaster.error('Failed to connect to SSO service');
        },
      });
  }
}

import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TimesheetService } from '../../employee-self-service/timesheet/timesheet.service';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

interface MonthlyHiresResponse {
  data: { totalRecruitments: number };
}
interface RecruitmentDashboardResponse {
  data: {
    totalJobRequisitions: number;
    totalActiveJobRequisitions: number;
    totalPipelineCandidates: number;
  };
}
interface AverageTimeResponse {
  data : {
    totalAverageToFill: number;
  }
}
@Component({
  selector: 'app-recruitment-dashboard',
  templateUrl: './recruitment-dashboard.component.html',
  styleUrls: ['./recruitment-dashboard.component.scss']
})
export class RecruitmentDashboardComponent {
  mainEmpId: any;
  entityId:any;
  rowClass: any;
  public rowData:any;
  metrics: any = [];
  months: any[]=[];
  fromMonth: number = 1;
  toMonth: number = 12;
  financialYear_id: string | null;
  totalRecruitments: any;
  recruiters: any[] = []; 
  selectedRecruiter: any;
  recruiterMetrics: any; 
  constructor(
    private dashboardService : RecruitService,
    private toaster :ToastrService,
    private _timesheetService : TimesheetService,
    private router: Router
  ){}

  ngOnInit():void{
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financialYear_id = localStorage.getItem('financial_id');
    this.getMonthList();
    this.getRecruitmentData();
    this.getRecruiters();
  }
  getMonthList(){
    this._timesheetService.getMonthList().subscribe((res:any)=>{
      this.months = res.data;
    })
  }
  onToMonthChange(newValue: number): void {
    this.toMonth = newValue;
    this.applyFilters();
  }
  applyFilters() {
    this.getRecruitmentData();
    this.getRecruiterData();
  }

  getRecruiters() {
    this.dashboardService.getRecruiters(this.entityId).subscribe((res: any) => {
      this.recruiters = res.data;
      if (this.recruiters.length > 0) {
        const recruiter = this.recruiters.find(r => r.employee_id === Number(this.mainEmpId));
        if (recruiter) {
          this.selectedRecruiter = recruiter.employee_id;
        } else {
          this.selectedRecruiter = this.recruiters[0].employee_id;
        }
        this.getRecruiterData();
      }
    });
  }  

  getRecruiterData() {
    if (this.selectedRecruiter) {
      const data = {
        fromMonth: this.fromMonth,
        toMonth: this.toMonth,
        financial_id: this.financialYear_id,
        recruiter_id : this.selectedRecruiter
      }
      this.dashboardService.getRecruiterData(this.mainEmpId,this.entityId,data).subscribe((res:any) => {
        this.recruiterMetrics = res.data;
      });
    }
  }
    getMetricClass(title: string): string {
      switch (title) {
        case 'Total Job Requisitions':
          return 'total-orders';
        case 'Active Openings':
          return 'total-sale';
        case 'Pipeline Candidates':
          return 'avg-deal-size';
          case 'Time-to-Fill (Avg)':
          return 'open-po-amount';
          case 'Hires this Month':
          return 'conversion-rate';
        default:
          return '';
      }
    }
    
    getMetricLink(title: string): string {
      switch (title) {
        case 'Total Job Requisitions':
          return '/master/recruitment/job-discription-main';
        case 'Active Openings':
          return '/master/recruitment/job-discription-main';
        case 'Pipeline Candidates':
          return '/master/recruitment/job-discription-main';
          case 'Time-to-Fill (Avg)':
          return '/master/recruitment/job-discription-main';
          case 'Hires this Month':
          return '/master/recruitment/job-discription-main';
        default:
          return '/master/recruitment/dashboard';
      }
    }
    navigateToMetric(metric: any): void {
        const route = this.getMetricLink(metric.title);
        this.router.navigate([route]);
    }

    getRecruitmentData() {
      if (this.fromMonth > this.toMonth) {
        this.toaster.error('Invalid month range. From Month cannot be greater than To Month.');
        return;
      }
  
      const recruitmentDashboardData = {
        fromMonth: this.fromMonth,
        toMonth: this.toMonth,
        financial_id: this.financialYear_id
      };
      forkJoin({
        monthlyHires: this.dashboardService.getRecruitmentsForCurrentMonth(this.mainEmpId, this.entityId).pipe(
          catchError((error: any) => {
            this.handleError('Hires this Month', error);
            return of({ data: { totalRecruitments: 0 } });
          })
        ),
        recruitmentDashboard: this.dashboardService.getRecruitmentDashboard(this.mainEmpId, this.entityId, recruitmentDashboardData).pipe(
          catchError((error: any) => {
            this.handleError('Recruitment Dashboard', error);
            return of({
              data: {
                totalJobRequisitions: 0,
                totalActiveJobRequisitions: 0,
                totalPipelineCandidates: 0,
              }
            });
          })
        ),
        averageTime : this.dashboardService.getRecruitmentAverageTime(this.mainEmpId,this.entityId,recruitmentDashboardData).pipe(
          catchError((error:any)=>{
            this.handleError('Average Time',error);
            return of({
              data : {
                totalAverageToFill: 0
              }
            })
          })
        )
      }).subscribe(({ monthlyHires, recruitmentDashboard,averageTime }) => {
        const hiresData = (monthlyHires as MonthlyHiresResponse).data;
        const dashboardData = (recruitmentDashboard as RecruitmentDashboardResponse).data;
        const avergaeTimeData = (averageTime as AverageTimeResponse).data;
      
        this.metrics = [
          { title: 'Total Job Requisitions', value: dashboardData.totalJobRequisitions || 0, link: '/master/recruitment/job-discription-main' },
          { title: 'Active Openings', value: dashboardData.totalActiveJobRequisitions || 0, link: '/master/recruitment/job-discription-main' },
          { title: 'Pipeline Candidates', value: dashboardData.totalPipelineCandidates || 0, link: '/master/recruitment/job-discription-main' },
          { 
            title: 'Time-to-Fill (Avg)', 
            value: `${avergaeTimeData.totalAverageToFill || 0} ${avergaeTimeData.totalAverageToFill === 1 ? 'Day' : 'Days'}`, 
            link: '/master/recruitment/job-discription-main' 
          },
          { title: 'Hires this Month', value: hiresData.totalRecruitments || 0, link: '/master/recruitment/job-discription-main' },
        ];
      });      
    }
  
    handleError(metricTitle: string, error: any): void {
      if (error.status === 404) {
        this.toaster.error(`No Data Found for ${metricTitle}`, 'Error');
      } else {
        console.error(`An error occurred for ${metricTitle}:`, error.message);
      }
    }
}

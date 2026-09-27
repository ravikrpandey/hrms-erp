import { Component } from '@angular/core';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { SalesService } from '../sales.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crm-dashboard',
  templateUrl: './crm-dashboard.component.html',
  styleUrls: ['./crm-dashboard.component.scss']
})
export class CrmDashboardComponent {

  mainEmpId: any;
  entityId:any;
  private gridApi!: GridApi<any>;
  rowClass: any;
  public rowData:any;
  metrics: any = [];

  constructor(
    private dashboardService : SalesService,
    private router: Router
  ){}

  ngOnInit():void{
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    this.getLeadDataCount();
    this.getDetailsForDashboard();
  }

  getMetricClass(title: string): string {
    switch (title) {
      case 'Total Leads':
        return 'total-leads';
      case 'Active Leads':
        return 'active-leads';
      case 'Converted Leads':
        return 'converted-leads';
      case 'Conversion Rate':
        return 'lead-conversion';
      case 'Today Follow Up':
        return 'today-followup';
      case 'Upcoming Follow Up':
        return 'upcoming-followup';
        case 'Lapsed Follow Up':
        return 'lapsed-followup';
      default:
        return '';
    }
  }
  navigateToMetric(metric: any): void {
    if (metric.title === 'Lapsed Follow Up') {
      this.missedup();
    } else if(metric.title ==='Upcoming Follow Up') {
      this.upcomingFollowUp();
    }
    else{
      const route = this.getMetricLink(metric.title);
      this.router.navigate([route]);
    }
  }
  
  getMetricLink(title: string): string {
    switch (title) {
      case 'Total Leads':
        return '/master/crm/lead-summary';
      case 'Active Leads':
        return '/master/crm/lead-summary';
      case 'Converted Leads':
        return '/master/crm/lead-summary';
      case 'Conversion Rate':
        return '/master/crm/lead-summary';
      case 'Today Follow Up':
        return '/master/crm/lead-status';
      case 'Lapsed Follow Up':
        return '/master/crm/lead-status';
        case 'Upcoming Follow Up':
          return '/master/crm/lead-status'
      default:
        return '/master/crm/dashboard';
    }
  }
  
  missedup() {
    this.router.navigate(['/master/crm/lead-status'], { queryParams: { followup: 'missed' } });
  }
  upcomingFollowUp(){
    this.router.navigate(['/master/crm/lead-status'], { queryParams: { followup: 'upcoming' } });
  }
  getLeadDataCount() {
    this.dashboardService.getCardDetails(this.entityId).subscribe((res: any) => {
      const data = res.data;
      this.metrics = [
        { title: 'Total Leads', value: data.TotalLeadsCount || 0, link: '/master/crm/lead-summary' },
        { title: 'Active Leads', value: data.InProgressLeadsCount || 0, link: '/master/crm/lead-summary' },
        { title: 'Converted Leads', value: data.contractCount || 0, link: '/master/crm/lead-summary' },
        { title: 'Conversion Rate', value: `${data.conversionRate || 0}%`, link: '/master/crm/lead-summary' },
        { title: 'Today Follow Up', value: data.todaysFollowUpCount || 0, link: '/master/crm/lead-status' },
        { title: 'Lapsed Follow Up', value: data.missedFollowUpCount || 0, link: '/master/crm/lead-status' },
        { title: 'Upcoming Follow Up', value: data.upcomingFollowUpCount || 0, link: '/master/crm/lead-status' },
      ];
    });
  }
  getDetailsForDashboard(){
    this.dashboardService.getDetailsForDashboard(this.entityId).subscribe((res:any)=>{
      this.rowData = res.data
    })
  }
   public columnDefs = [
    {
      headerName: 'Employee Name',
      field: 'employee_name',
      sortable: false, 
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 130,
      cellStyle: () => {
        return {fontWeight: 'bold' };
      },
    },
    {
      headerName: 'Total Leads',
      field: 'TotalLeadsCount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth: 75,
      cellStyle: (params:any) => {
        return params.value > 0 ? { color: '#035e92', fontWeight: 'bold' } : null;
      }
    },
    {
      headerName: 'Active Leads',
      field: 'ActiveLeadsCount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth: 75,
      cellStyle: (params:any) => {
        return params.value > 0 ? { color: 'blue', fontWeight: 'bold' } : null;
      }
    },
    {
      headerName: 'Converted Leads',
      field: 'contractCount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth: 95,
      cellStyle: (params:any) => {
        return params.value > 0 ? { color: 'green', fontWeight: 'bold' } : null;
      }
    },
    {
      headerName: 'Todays FollowUp',
      field: 'todaysFollowUpCount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth: 90,
      cellStyle: (params:any) => {
        return  { color: 'darkgreen', fontWeight: 'bold' };
      }
    },
    {
      headerName: 'Missed FollowUp',
      field: 'missedFollowUpCount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth: 90,
      cellStyle: (params:any) => {
        return params.value > 0 ? { color: 'red', fontWeight: 'bold' } : null;
      }
    },
    {
      headerName: 'Upcoming FollowUp',
      field: 'upcomingFollowUpCount',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth: 110,
      cellStyle: (params:any) => {
        return params.value > 0 ? { color: 'red', fontWeight: 'bold' } : null;
      }
    },
    {
      headerName: 'Conversion Rate',
      field: 'conversionRate',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth: 100,
      cellStyle: (params:any) => {
        const value = params.value;
        if (value < 50) {
          return { color: 'red', fontWeight: 'bold' }; 
        } else if (value < 75) {
          return { color: 'orange', fontWeight: 'bold' }; 
        } else if (value >= 90) {
          return { color: 'green', fontWeight: 'bold' }; 
        } else {
          return { color: 'blue', fontWeight: 'bold' }; 
        }
      },
      valueFormatter: (params:any) => {
        return params.value ? `${params.value}%` : '0%';
      },
    },
    
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api; 
  }
}

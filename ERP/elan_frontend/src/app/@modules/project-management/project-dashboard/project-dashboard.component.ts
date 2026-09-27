import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import Chart from 'chart.js/auto';
import { ProjectManagementService } from '../services/project-management.service';
import { PriorityRendererComponent } from '../task-management/priority-renderer/priority-renderer.component';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss']
})
export class ProjectDashboardComponent {
  rowClass: any;
  totalTasks : any;
  private gridApi!: GridApi<any>;
  entity_id: string | null;
  mainEmpId: string | null;
  progressData :any[]=[];
  public rowData:any;
  public rowData1:any;
  public rowData2:any;
  priorityData = [
    { id: 1, name: 'Emergency',value:'EMERGENCY', icon: 'error', color: 'red' },
    { id: 2, name: 'Blocker', value:'BLOCKER',icon: 'block', color: 'red' },
    { id: 3, name: 'Highest',value:'HIGHEST', icon: 'priority_high', color: 'orange' },
    { id: 4, name: 'High',value:'HIGH', icon: 'arrow_upward', color: 'orange' },
    { id: 5, name: 'Normal',value:'NORMAL', icon: 'swap_horiz', color: 'black' },
    { id: 6, name: 'Low',value:'LOW', icon: 'arrow_downward', color: 'green' },
    { id: 7, name: 'Lowest',value:'LOWEST', icon: 'low_priority', color: 'green' },
  ];
  statuses = [
    { name: 'Not Started', value: 'NOT STARTED', color: 'blue' }, 
    { name: 'In Progress', value: 'IN PROGRESS', color: 'orange' }, 
    { name: 'Review', value: 'REVIEW', color: 'deepskyblue' }, 
    { name: 'On Hold', value: 'ON HOLD', color: 'cadetblue' }, 
    { name: 'Closed', value: 'CLOSED', color: 'darkgreen' }, 
    { name: 'Canceled', value: 'CANCELLED', color: 'red' } 
  ];
 
  constructor(
   private route: Router,
   private datePipe: DatePipe,
   private _projectService : ProjectManagementService

   ) {
   this.rowClass = 'rowClass'
 }

 ngOnInit(): void {
  this.entity_id = localStorage.getItem('selectedEntityId');
  this.mainEmpId = localStorage.getItem('EmpMainId')
  this.getDashboardPecentageCount();
  this.getProjectViewTable();
  this.getOverdueTasks();
  this.getUpcomingTasks();
 }


  ngAfterViewInit(): void {
    this.progressData.forEach((data, index) => {
      this.createChart(data, index);
    });
  }
  getDashboardPecentageCount(): void {
    this._projectService.dashboardCount(this.mainEmpId).subscribe(
      (res: any) => {
        const data = res.data;

        this.totalTasks = data.totalTasks;

        this.progressData = [
          { label: 'Completed', percentage: parseFloat(data.closed), color: '#4caf50' },
          { label: 'In Progress', percentage: parseFloat(data.inProgress), color: '#ff9800' },
          { label: 'Not Started', percentage: parseFloat(data.notStarted), color: '#3f51b5' },
          { label: 'Accomplished(B4 time)', percentage: parseFloat(data.accomplishedTasksPercentage), color: '#00644d' },
          { label: 'Active (Remaining)', percentage: parseFloat(data.activeTasksPercentage) , color: '#2196f3' },
          { label: 'Cancelled', percentage: parseFloat(data.cancelled), color: '#f44336' },
        ];
  
        setTimeout(() => {
          this.progressData.forEach((data, index) => {
            this.createChart(data, index);
          });
        });
      },
      (error) => {
        console.error('Error fetching dashboard percentage count:', error);
      }
    );
  }
  getProjectViewTable(){
    this._projectService.getProjectViewTable(this.mainEmpId).subscribe((res:any)=>{
      this.rowData = res.data;
    })
  }
  getOverdueTasks(){
    this._projectService.getOverdueTasks(this.mainEmpId).subscribe((res:any)=>{
      this.rowData1 = res.data;
    })
  }
  getUpcomingTasks(){
    this._projectService.getUpcomingTasks(this.mainEmpId).subscribe((res:any)=>{
      this.rowData2 = res.data;
    })
  }
  createChart(data: { label: string; percentage: number; color: string }, index: number): void {
    const canvasId = `chart-${index}`;
    const ctx = (document.getElementById(canvasId) as HTMLCanvasElement).getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: [data.label, ''],
          datasets: [{
            data: [data.percentage, 100 - data.percentage],
            backgroundColor: [data.color, '#e0e0e0'],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          cutout: '70%',
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
        }
      });
    }
  }


  public columnDefs = [
    {
      headerName: 'S No',
      field: 'node.rowIndex+1',
      sortable: false, 
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 20,
      valueGetter: (params:any) => params.node.rowIndex + 1
    },
    {
      headerName: 'Project',
      field: 'project_name',
      sortable: false, 
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 100,
      cellStyle: () => {
        return {fontWeight: 'bold' };
      },
    },
    {
      headerName: 'Task',
      field: 'task_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth: 100,
    },
    {
      headerName: 'Start Date',
      field: 'start_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth: 100,
      valueGetter: (params:any) => {
        return this.datePipe.transform(params.data.start_date, 'yyyy-MM-dd');
      }
    },
    {
      headerName: 'End Date',
      field: 'end_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth: 100,
      valueGetter: (params:any) => {
        return this.datePipe.transform(params.data.end_date, 'yyyy-MM-dd');
      }
    },
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth: 80,
      cellRenderer: (params: any) => {
        const status = params.value;
        const statusItem = this.statuses.find((statusObj) => statusObj.value === status);
        return `<span style="color:${statusItem?.color || 'transparent'};">${status}</span>`;
      },
    },
    {
      headerName: 'Progress',
      field: 'task_progress',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      flex:1,
      minWidth: 50,
      cellRenderer: (params: any) => {
        const progress = params.value;
        const progressColor = progress === 100 ? 'green' : 'red';
        return `<span style="color: ${progressColor};">${progress}%</span>`;
      },
      cellClass: "grid-cell-centered",
     
    },
    
  ];

  public columnDefs1 = [
    {
      headerName: 'Overdue',
      field: 'overdue_days',
      sortable: false, 
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 60,
      valueGetter: (params: any) => {
        const days = params.data.overdue_days;
        return days === 1 ? '1 Day' : `${days} Days`;
      },
      cellStyle: (params: any) => {
        return { color: 'red', fontWeight: 'bold' };
      },
    },
    {
      headerName: 'Task',
      field: 'task_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth: 80,
    },
    {
      headerName: 'Deadline',
      field: 'end_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth: 80,
      valueGetter: (params:any) => {
        return this.datePipe.transform(params.data.end_date, 'yyyy-MM-dd');
      },
      cellStyle: (params: any) => {
        return {fontWeight: 'bold' };
      },
    },
    {
      headerName: 'Employee',
      field: 'employee_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth: 80,
    },
    
  ];
  public columnDefs2 = [
    {
      headerName: 'Employee',
      field: 'employee_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth: 80,
    },
    {
      headerName: 'Task',
      field: 'task_name',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth: 100,
    },
    {
      headerName: 'Deadline',
      field: 'end_date',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: "grid-cell-centered",
      flex:1,
      minWidth: 80,
      valueGetter: (params:any) => {
        return this.datePipe.transform(params.data.end_date, 'yyyy-MM-dd');
      },
      cellStyle: (params: any) => {
        return {fontWeight: 'bold' };
      },
    },
    {
      headerName: 'Priority',
      field: 'priority',
      sortable: false,
      resizable: true,
      wrapHeaderText: true,
      autoHeight: true,
      cellClass: "grid-cell-centered",
      flex: 1,
      minWidth: 120,
      cellRendererFramework: PriorityRendererComponent,
          cellRendererParams: {
            getPriorityData: (priorityValue: string) =>
              this.priorityData.find(p => p.value === priorityValue),
          },
    },
    
  ];
  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api; 
  }

}

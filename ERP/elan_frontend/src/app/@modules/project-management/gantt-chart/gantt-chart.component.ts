import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TimesheetService } from '../../employee-self-service/timesheet/timesheet.service';
import { ProjectManagementService } from '../services/project-management.service';
import { GoogleChartComponent } from 'ng2-google-charts';
import * as XLSX from 'xlsx';


declare let gantt: any;
@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss']
})

export class GanttChartComponent {
  @ViewChild('chart') chart: GoogleChartComponent | undefined;
  filterForm: FormGroup;
  mainEmpId: string | null;
  projects: any = [];
  project_id: any;
  chartData: any[] = [];

  public ganttChartData: any = {
    chartType: 'Gantt',
    options: {
      title: 'Gantt Chart',
      gantt: {
        criticalPathEnabled: false,
        innerGridHorizLine: {
          stroke: '#ffe0b2',
          strokeWidth: 2
        },
        innerGridTrack: {fill: '#F0F7EE'},
        innerGridDarkTrack: {fill: '#FFEFD3'}
      },
      height: 400,
      colors: ['#3366CC'],
    },
    dataTable: [
      [
        { type: 'string', label: 'Task ID' },
        { type: 'string', label: 'Task Name' },
        { type: 'string', label: 'Resource' },
        { id: 'Start', label: 'Start Date', type: 'date' },
        { id: 'End', label: 'End Date', type: 'date' },
        { type: 'number', label: 'Duration' },
        { type: 'number', label: 'Percent Complete' },
        { type: 'string', label: 'Dependencies' },
        { role: 'style' },
      ],
    ],
  };
  subtasks: any;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private _projectService: ProjectManagementService
  ) {
    this.filterForm = this.fb.group({
      project_id: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.getProjects();

    this.filterForm.get('project_id')?.valueChanges.subscribe((id) => {
      if (id) {
        this.project_id = id;
        this.loadProjectTasks(this.project_id);
      }
    });
  }

  getProjects(): void {
    this._projectService.getProjectList(this.mainEmpId).subscribe(
      (response: any) => {
        if (response && response.data && response.data.allProjectData) {
          this.projects = response.data.allProjectData;
        }
      },
      (error) => {
        console.error('Error fetching projects:', error);
        this.toastr.error('Failed to fetch projects.');
      }
    );
  }

  loadProjectTasks(projectId: string): void {
    this._projectService.getAllTasks(projectId).subscribe(
      (response: any) => {
        if (response && response.data && response.data.length > 0) {
          this.subtasks = response.data.filter((task: any) => task.task_type === 'Sub Task');
          this.chartData = response.data.map((task: any) => ({
            id: task.id,
            name: task.task_name,
            dependentTask: task.dependent_task_name,
            start: task.start_date,
            end: task.end_date,
            percentComplete: this.calculatePercentComplete(
              this.subtasks.filter((subtask: any) => subtask.parent_task_id === task.id),
              task.status
            ),
            // dependencies:  task.dependent_task_id ? task.dependent_task_id.toString() : null,
            dependencies:   null,
            priority: task.priority,
            status : task.status,
            task_type : task.task_type
            
          }));
          this.ganttChartData.dataTable = [
            [
              { type: 'string', label: 'Task ID' },
              { type: 'string', label: 'Task Name' },
              { type: 'string', label: 'Resource' },
              { id: 'Start', label: 'Start Date', type: 'date' },
              { id: 'End', label: 'End Date', type: 'date' },
              { type: 'number', label: 'Duration' },
              { type: 'number', label: 'Percent Complete' },
              { type: 'string', label: 'Dependencies' },
              { role: 'style' },
            ],
          ];
  
          this.chartData.forEach((task) => {
            const entry = [
              task.id.toString(),
              task.name,
              task.dependentTask, 
              
              new Date(task.start),
              new Date(task.end),
              null, 
              task.percentComplete,
              task.dependencies, 
              this.getTaskColor(task.status), 
            ];
            this.ganttChartData.dataTable.push(entry);
          });
  
          if (this.chart) {
            this.chart.draw();
          }
        } else {
          this.toastr.info('No tasks available for the selected project.');
          this.filterForm.controls['project_id'].setValue(null);
          this.ganttChartData.dataTable = [];
          if (this.chart) {
            this.chart.draw();
          }
        }
      },
      (error) => {
        console.error('Error fetching project tasks:', error);
        this.toastr.error('Failed to load tasks.');
      }
    );
  }

  calculatePercentComplete(subtasks: { status: string }[], status: string): number {
    if (status === 'CLOSED') {
      return 100;
    }
    if (!subtasks || subtasks.length === 0) {
      return 0;
    }
    const totalSubtasks = subtasks.length;
    const completedSubtasks = subtasks.filter(
      subtask => subtask.status === 'CLOSED'
    ).length;
  
    return Math.round((completedSubtasks / totalSubtasks) * 100);
  }
  
  getTaskColor(status: string): string {
    switch (status) {
      case 'CLOSED':
        return '#228B22'; 
      case 'IN PROGRESS':
        return '#32CD32'; 
      case 'HOLD':
        return '#FFA500'; 
      case 'REVIEW':
        return '#800080'; 
      case 'CANCELLED':
        return '#FF0000';
      default:
        return '#808080';
    }
  }
  
  public onChartReady(event: any): void {
    console.log('Chart is ready!', event);
  }

  exportToExcel(): void {
    const ganttData = this.chartData.map((task: any,index: number) => ({
      'Sr. No.': index + 1, 
      'Task ID': task.id,
      'Task Name': task.name,
      'Task Type': task.task_type,
      'Dependent Task': task.dependentTask || 'None',
      'Start Date': new Date(task.start).toLocaleDateString(),
      'End Date': new Date(task.end).toLocaleDateString(),
      'Percent Complete': `${task.percentComplete}%`,
      'Priority': task.priority,
      'Status': task.status,
    }));
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(ganttData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Gantt Chart');

    XLSX.writeFile(wb, `PRJ00${this.project_id}_gantt_chart.xlsx`);
  }
}

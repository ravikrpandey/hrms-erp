import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TableviewComponent } from '../../@shared/tableview/tableview.component';
import { ButtonComponent } from '../../@shared/button/button.component';
import { PageheadingComponent } from '../../@shared/pageheading/pageheading.component';
import { TableactionbuttonComponent } from '../../@shared/tableactionbutton/tableactionbutton.component';
import { MatInputModule } from "@angular/material/input";
import { SelfAssessmentSurveyService } from './self-assessment-survey.service';
import { FormsModule } from '@angular/forms';
import { DynamicSearchComponent } from '../../@shared/dynamic-search/dynamic-search.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-self-assesment-survey',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableviewComponent,
    ButtonComponent,
    PageheadingComponent,
    MatInputModule,
    FormsModule,
    DynamicSearchComponent,
    MatTooltipModule
  ],
  templateUrl: './self-assesment-survey.component.html',
  styleUrls: ['./self-assesment-survey.component.css'],
})
export class SelfAssesmentSurveyComponent {
  rowData: any[] = [];
  surveyData: any;
  private gridApi: any;
  searchTerm: string = '';
  originalSurveyData: any[] = [];

  constructor(private router: Router, private selfassessment: SelfAssessmentSurveyService) { }

  columnDefs = [
    { headerName: 'Survey Title', field: 's_surveyTitle' },
    { headerName: 'Skill Area', field: 's_skillArea' },
    { headerName: 'Department', field: 's_department' },
    {
      headerName: 'Start Date',
      field: 'startDate',
      valueFormatter: (params: any) => this.formatDate(params.value),
    },
    {
      headerName: 'End Date',
      field: 'endDate',
      valueFormatter: (params: any) => this.formatDate(params.value),
    },
    {
      headerName: 'Status',
      field: 'IsActive',
      cellRenderer: TableactionbuttonComponent,
      width: 150,
      cellRendererParams: {
        onUpdateStatus: this.updateStatus.bind(this),
        activeStatusBtn: true
      },
    },
    {
      headerName: 'Action',
      cellRenderer: TableactionbuttonComponent,
      cellRendererParams: {
        onView: this.onView.bind(this),
        onEdit: this.onEdit.bind(this),
        viewshow: true,
        editshow: true,
      },
    },
    {
      headerName: 'Feedback Analysis',
      cellRenderer: TableactionbuttonComponent,
      cellRendererParams: (params: any) => ({
        onInitiate: () => this.onInitiate(params.data),
        initiateshow: true,
        tooltip: 'Click to view Feedback Analysis After Submit Employee rating and Manager rating ' 
      }),
    }
  ];

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  ngOnInit() {
    this.getsurvey();
  }

  updateStatus(row: any) {
    this.selfassessment.updateSurveyStatus(row.s_id, { isActive: !row.isActive }).subscribe((res: any) => {
      const updatedData = this.rowData.map((item: any) =>
        item.s_id === row.s_id ? { ...item, isActive: !row.isActive } : item
      );
      this.getsurvey();
    });
  }

  getsurvey(): void {
    this.selfassessment.getsurveyList().subscribe(res => {
      this.originalSurveyData = res.data;
      this.surveyData = res.data;
      this.rowData = (res.data || []).map((item: any) => ({
        s_id: item.s_id,
        s_surveyTitle: item.s_surveyTitle,
        s_skillArea: item.s_skillArea,
        s_department: item.s_department,
        s_jobRole: item.s_jobRole,
        s_questions: item.s_questions,
        s_remark: item.s_remark,
        s_isDeleted: item.s_isDeleted,
        s_createdAt: item.s_createdAt,
        s_updatedAt: item.s_updatedAt,
        s_createdBy: item.s_createdBy,
        startDate: item.startDate,
        endDate: item.endDate,
        isActive: item.s_isActive,
        IsActive: item.s_isActive,
      }));

    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase();
    this.rowData = this.originalSurveyData.filter(item =>
      item.s_surveyTitle?.toLowerCase().includes(term)

    );
  }

  onView(row: any) {
    this.router.navigate([`listing-assesment-servey/view/${row.s_id}`]);
  }

  onEdit(row: any) {
    this.router.navigate([`listing-assesment-servey/edit/${row.s_id}`]);
  }


  onInitiate(row: any) {
    this.router.navigate(['/listing-assesment-servey/view/feedback-analysis', row.s_id]);
  }

  goToCreateSurvey() {
    this.router.navigate(['/listing-assesment-servey/create']);
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  onFilterTextBoxChanged(event: any) {
    const filterValue = event;
    if (this.gridApi) {
      this.gridApi.setGridOption('quickFilterText', filterValue);
    }
  }
}

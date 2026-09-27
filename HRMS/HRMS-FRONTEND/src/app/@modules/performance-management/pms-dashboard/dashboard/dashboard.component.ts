import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { CanvasJS } from '@canvasjs/angular-charts';
import { IgxDoughnutChartComponent } from 'igniteui-angular-charts';
import { YearlyAssessmentService } from 'src/app/@shared/services/performance-management/yearly-assessment.service';
import { ChartOptions, ChartData, Chart } from 'chart.js';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  private _options: any;
  public data: any;
  entity_id: any;
  kpiType: any = [];
  @ViewChild('chart', { static: false })
  public chart: IgxDoughnutChartComponent;
  assessmentData: any = [];
  selfRatingData: any = [];
  showSelecteduser: any[] = [];
  selectemployeeid: any = [];
  selfRating: any;
  selfRatingChart: any;
  managerRatingChart: any;
  managerRating: any = [];
  behivourDataratingdata: any;
  data1: any[] = [];
  behivourData: any = [];
  competence: any = [];
  data2: any = [];
  doughnutChartColors: string[] = [];
  data3: any[] = [];
  doughnutChartdata = [];
  constructor(
    private assessmentService: YearlyAssessmentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.allAssessmentgetShowDashboard();
    this.getSelfRatingValue();
    this.getManagerOrApprovalManagerData();
    this.getBehaviourRatingChart();
    this.getAlldoughnutchartDatashowdashboard();
  }

  allAssessmentgetShowDashboard() {
    const entity = localStorage.getItem('selectedEntityId');
    if (entity && entity.length > 0) {
      this.entity_id = entity;
      console.log('Fetched entity_id:', this.entity_id);
      this.assessmentService
        .getAssessmentShowonDashboard(this.entity_id)

        .subscribe(
          (res: any) => {
            this.assessmentData = res.data;
            console.log('hi ', this.assessmentData);
            console.log('Hi, I have received the data', this.assessmentData);
          },
          (error) => {
            console.error('Error fetching assessment data:', error);
          }
        );
    } else {
      console.log('Entity List is empty or not found in localStorage.');
    }
  }

  getCardClass(status: string): string {
    switch (status) {
      case 'Pending For Manager Review':
        return 'card-users';
      case 'Pending Committee Review':
        return 'card-sessions';
      case 'Pending For Approval':
        return 'card-messages';
      case 'Self Assessment Completed':
        return 'card-orders';
      default:
        return '';
    }
  }

  getSelfRatingValue() {
    const entity = localStorage.getItem('selectedEntityId');
    if (entity && entity.length > 0) {
      this.entity_id = entity;
      console.log('Fetched entity_id:', this.entity_id);
      this.assessmentService
        .getSelfRatingShowDashboard(this.entity_id)
        .subscribe(
          (res: any) => {
            this.showSelecteduser = res.data.filter(
              (value: any, index: any, self: any) =>
                index ===
                self.findIndex(
                  (t: any) =>
                    t.employee_id === value.employee_id &&
                    t.yearly_assessment_id === value.yearly_assessment_id
                )
            );
            this.selfRatingData = res.data;
            this.kpiType = res.data.map((item: any) => item.activity);
          },
          (error) => {
            console.error('Error fetching self-rating data:', error);
          }
        );
      console.log('data find>>>>>>>>>>>', this.showSelecteduser);
    } else {
      console.log('Entity List is empty or not found in localStorage.');
    }
  }

  onUserSelect(event: any) {
    const selectedEmployeeId = event.value;
    const selectemp_id = selectedEmployeeId.employee_id;
    const yearly_assessment_id = selectedEmployeeId.yearly_assessment_id;
    const selectedUserData = this.selfRatingData.filter(
      (user: any) =>
        user.employee_id === selectemp_id &&
        user.yearly_assessment_id === yearly_assessment_id
    );
    const updatedDataPoints = selectedUserData.map((item: any) => ({
      label: item.activity,
      y: item.self_rating_value ? parseFloat(item.self_rating_value) : 0,
    }));
    this.updateSelfRatingChart(updatedDataPoints);
    this.updateManagerRatingChart(selectemp_id, yearly_assessment_id);
    this.updatebehviourRatingChart(selectemp_id, yearly_assessment_id);
    this.updateThedoughnutChart(selectemp_id, yearly_assessment_id);
  }

  ngAfterViewInit(): void {
    if (this.selfRatingData && this.selfRatingData.length === 0) {
      const chartContainer = document.getElementById('chartContainer');
      if (chartContainer) {
        chartContainer.innerHTML = 'No data available for Self Rating';
      }
      this.selfRatingChart = new CanvasJS.Chart('chartContainer', {
        animationEnabled: true,
        title: {
          text: 'Self Rating',
        },
        data: [
          {
            type: 'spline',
            showInLegend: true,
            dataPoints: [{ label: 'No Data', y: 100 }],
          },
        ],
      });
    } else {
      this.selfRatingChart = new CanvasJS.Chart('chartContainer', {
        animationEnabled: true,
        title: {
          text: 'Self Rating',
        },
        axisX: {
          title: 'Self Rating Value',
          interval: 1,
        },
        axisY: {
          title: 'Data Value',
        },
        toolTip: {
          shared: true,
        },
        legend: {
          cursor: 'pointer',
          itemclick: function (e: any) {
            if (
              typeof e.dataSeries.visible === 'undefined' ||
              e.dataSeries.visible
            ) {
              e.dataSeries.visible = false;
            } else {
              e.dataSeries.visible = true;
            }
            e.chart.render();
          },
        },
        data: [
          {
            type: 'spline',
            showInLegend: true,
            dataPoints: this.selfRatingData,
          },
        ],
      });
    }
    this.selfRatingChart.render();
    if (this.managerRating && this.managerRating.length === 0) {
      const managerRatingContainer = document.getElementById(
        'managerRatingChartContainer'
      );
      if (managerRatingContainer) {
        managerRatingContainer.innerHTML =
          'No data available for Technical Rating';
      }
      this.managerRatingChart = new CanvasJS.Chart(
        'managerRatingChartContainer',
        {
          animationEnabled: true,
          title: {
            text: 'Technical Rating',
          },
          data: [
            {
              type: 'spline',
              showInLegend: true,
              dataPoints: [{ label: 'No Data', y: 100 }],
            },
          ],
        }
      );
    } else {
      this.managerRatingChart = new CanvasJS.Chart(
        'managerRatingChartContainer',
        {
          animationEnabled: true,
          title: {
            text: 'Technical Rating',
          },
          axisX: {
            title: 'Manager Rating Value',
            interval: 1,
          },
          axisY: {
            title: 'Data Value',
          },
          toolTip: {
            shared: true,
          },
          legend: {
            cursor: 'pointer',
            itemclick: function (e: any) {
              if (
                typeof e.dataSeries.visible === 'undefined' ||
                e.dataSeries.visible
              ) {
                e.dataSeries.visible = false;
              } else {
                e.dataSeries.visible = true;
              }
              e.chart.render();
            },
          },
          data: [
            {
              type: 'spline',
              showInLegend: true,
              dataPoints: this.managerRating,
            },
          ],
        }
      );
    }
    this.managerRatingChart.render();
    if (this.behivourData && this.behivourData.length === 0) {
      const behaviourRatingContainer = document.getElementById(
        'BehaviourRatingChartContainer'
      );
      if (behaviourRatingContainer) {
        behaviourRatingContainer.innerHTML =
          'No data available for Behaviour Rating';
      }
      this.behivourDataratingdata = new CanvasJS.Chart(
        'BehaviourRatingChartContainer',
        {
          animationEnabled: true,
          title: {
            text: 'Behaviour Rating',
          },
          data: [
            {
              type: 'spline',
              showInLegend: true,
              dataPoints: [{ label: 'No Data', y: 100 }],
            },
          ],
        }
      );
    } else {
      this.behivourDataratingdata = new CanvasJS.Chart(
        'BehaviourRatingChartContainer',
        {
          animationEnabled: true,
          title: {
            text: 'Behaviour Rating',
          },
          axisX: {
            title: 'Manager Rating Value',
            interval: 1,
          },
          axisY: {
            title: 'Data Value',
          },
          toolTip: {
            shared: true,
          },
          legend: {
            cursor: 'pointer',
            itemclick: function (e: any) {
              if (
                typeof e.dataSeries.visible === 'undefined' ||
                e.dataSeries.visible
              ) {
                e.dataSeries.visible = false;
              } else {
                e.dataSeries.visible = true;
              }
              e.chart.render();
            },
          },
          data: [
            {
              type: 'spline',
              showInLegend: true,
              dataPoints: this.behivourData,
            },
          ],
        }
      );
    }
    this.behivourDataratingdata.render();
    this.createDoughnutChart();
  }

  getManagerOrApprovalManagerData() {
    const entity = localStorage.getItem('selectedEntityId');
    if (entity && entity.length > 0) {
      this.entity_id = entity;
      console.log('Fetched entity_id:', this.entity_id);
      this.assessmentService
        .getDataReportingOrApprovalManager(this.entity_id)
        .subscribe(
          (res: any) => {
            this.managerRating = res.data;
            console.log('hi i am self rating manager', this.managerRating);
            this.kpiType = res.data.map((item: any) => item.activity);
          },
          (error) => {
            console.error('Error fetching self-rating data:', error);
          }
        );
    } else {
      console.log('Entity List is empty or not found in localStorage.');
    }
  }

  updateSelfRatingChart(datapoints: any[]) {
    const dataPoint = datapoints || [];
    this.selfRatingChart.options.data[0].dataPoints = dataPoint;
    this.selfRatingChart.render();
  }

  updateManagerRatingChart(selectemp_id: any, yearly_assessment_id: any) {
    this.data1 = this.managerRating.filter(
      (user: any) =>
        user.hrms_employee_id === selectemp_id &&
        user.yearly_assessment_id === yearly_assessment_id
    );
    if (this.data1 && this.data1.length > 0) {
      const managerRatingDataPoints = this.data1.map((item: any) => ({
        label: item.activity,
        y: item.Manager_Rating_Value
          ? parseFloat(item.Manager_Rating_Value)
          : 0,
      }));

      const approvalManagerRatingDataPoints = this.data1.map((item: any) => ({
        label: item.activity,
        y: item.approval_manager_self_rating_value
          ? parseFloat(item.approval_manager_self_rating_value)
          : 0,
      }));

      this.managerRatingChart.options.data[0] = {
        name: 'Manager Rating',
        type: 'spline',
        showInLegend: true,
        dataPoints: managerRatingDataPoints,
      };

      this.managerRatingChart.options.data[1] = {
        name: 'Approval Manager Rating',
        type: 'spline',
        showInLegend: true,
        dataPoints: approvalManagerRatingDataPoints,
      };
      this.managerRatingChart.render();
    }
  }

  getBehaviourRatingChart() {
    const entity = localStorage.getItem('selectedEntityId');
    if (entity && entity.length > 0) {
      this.entity_id = entity;
      console.log('Fetched entity_id:', this.entity_id);
      this.assessmentService
        .getBehaviourDataReportingOrApprovalManager(this.entity_id)
        .subscribe(
          (res: any) => {
            this.behivourData = res.data;
            this.competence = res.data.map((item: any) => item.competence);
          },
          (error) => {}
        );
    } else {
    }
  }

  updatebehviourRatingChart(selectemp_id: any, yearly_assessment_id: any) {
    this.data2 = this.behivourData.filter(
      (user: any) =>
        user.hrms_employee_id === selectemp_id &&
        user.yearly_assessment_id === yearly_assessment_id
    );
    if (this.data2 && this.data2.length > 0) {
      const managerRatingDataPoints = this.data2.map((item: any) => ({
        label: item.competence,
        y: item.manager_rating_value
          ? parseFloat(item.manager_rating_value)
          : 0,
      }));
      const approvalManagerRatingDataPoints = this.data2.map((item: any) => ({
        label: item.competence,
        y: item.approval_manager_rating_value_value
          ? parseFloat(item.approval_manager_rating_value_value)
          : 0,
      }));

      this.behivourDataratingdata.options.data[0] = {
        name: 'Manager Rating',
        type: 'spline',
        showInLegend: true,
        dataPoints: managerRatingDataPoints,
      };

      this.behivourDataratingdata.options.data[1] = {
        name: 'Approval Manager Rating',
        type: 'spline',
        showInLegend: true,
        dataPoints: approvalManagerRatingDataPoints,
      };
      this.behivourDataratingdata.render();
    }
  }

  getAlldoughnutchartDatashowdashboard() {
    const entity = localStorage.getItem('selectedEntityId');
    if (entity && entity.length > 0) {
      this.entity_id = entity;
      console.log('Fetched entity_id:', this.entity_id);
      this.assessmentService.getAllDoughnutchartdata(this.entity_id).subscribe(
        (res: any) => {
          this.doughnutChartdata = res.data;
        },
        (error) => {
          console.error('Error fetching self-rating data:', error);
        }
      );
    } else {
      console.log('Entity List is empty or not found in localStorage.');
    }
  }

  exaple: any;
  @ViewChild('doughnutCanvas', { static: false }) doughnutCanvas!: ElementRef;

  createDoughnutChart() {
    if (this.doughnutCanvas?.nativeElement) {
      this.exaple = new Chart(this.doughnutCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              label: 'Initial Data',
              data: [16.6, 16.6, 16.6, 16.6, 16.6, 16.6],
              backgroundColor: [
                '#2874A6',
                '#F1C40F',
                '#239B56',
                '#2874A6',
                '#CB4335',
                '#7D3C98',
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    }
  }

  updateThedoughnutChart(selectemp_id: any, yearly_assessment_id: any): void {
    debugger;
    const filteredData = this.doughnutChartdata.filter(
      (item: any) =>
        item.user_id === selectemp_id &&
        item.yearly_assessment_id === yearly_assessment_id
    );

    const colors = filteredData.map((statusObj: any) => {
      switch (statusObj.status) {
        case 'Pending For Manager Review':
          return '#2874A6';
        case 'Manager Review Completed':
          return '#F1C40F';
        case 'Pending For Approval':
          return '#239B56';
        case 'Approval Review Completed':
          return '#2874A6';
        case 'Pending Committee Review':
          return '#CB4335';
        case 'Committee Review Completed':
          return '#7D3C98';
        default:
          return '#E0E0E0';
      }
    });

    const updatedDataPoints = filteredData.map(
      (statusObj: any, index: any) => ({
        name: statusObj.status,
        y: statusObj.count,
        color: colors[index],
      })
    );
    this.exaple.data.labels = updatedDataPoints.map((dp: any) => dp.name);
    this.exaple.data.datasets[0].backgroundColor = colors;
    this.exaple.update();
  }
}

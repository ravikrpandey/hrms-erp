import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-job-trend-chart',
  templateUrl: './job-trend-chart.component.html',
  styleUrls: ['./job-trend-chart.component.scss']
})
export class JobTrendChartComponent implements OnInit,AfterViewInit,OnDestroy {
  @ViewChild('lineChartCanvas') lineChartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  entityId: string | null;
  financialYear_id: string | null;
  mainEmpId: string | null;
  revenueData: any;

  constructor(private dashboardService : RecruitService,) {}

  ngOnInit(): void {
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financialYear_id = localStorage.getItem('financial_id');
    this.getRecruitmentsTrends();
  }

  ngAfterViewInit(): void {
    const labels: string[] = [];
    const data: number[] = [];
    this.createChart(labels, data);
  }

  getRecruitmentsTrends(): void {
    this.dashboardService.getRecruitmentsTrends(this.mainEmpId,this.entityId, this.financialYear_id).subscribe((res: any) => {
      this.revenueData = res.data;
      const labels = this.revenueData.map((item: any) => this.getMonthName(item.month));
      const data = this.revenueData.map((item: any) => parseFloat(item.total_positions));

      this.createChart(labels, data);
    });
  }

  createChart(labels: string[], data: number[]): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const canvas = this.lineChartCanvas.nativeElement.getContext('2d');
    if (!canvas) {
      console.error('Failed to get canvas context');
      return;
    }

    const gradient = canvas.createLinearGradient(0, 0, -75, 250);
    gradient.addColorStop(0, 'rgb(57, 134, 248)');
    gradient.addColorStop(1, 'rgb(233, 86, 184)');

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Job Requisitions',
            data: data,
            borderColor: gradient,
            backgroundColor: 'rgba(161, 135, 135, 0)',
            tension: 0.2,
            borderWidth: 4,
            pointRadius: 5,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels : {
              font: { 
                      family: 'Arial',
                      size: 12,      
                      style: 'normal',
                      weight: 'bold',  
                      lineHeight: 1.2,
                    }
            },
            display: false,
            position: 'bottom',
            
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.raw} Positions`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Job Requisitions',
              font: { 
                family: 'Arial',
                size: 12,      
                style: 'normal',
                weight: 'bold',  
              }
            },
            grid: {
              display: false,
              drawTicks: false,
            },
          },
          x: {
            title: {
              display: true,
              text: 'Months',
              font: { 
                family: 'Arial',
                size: 12,      
                style: 'normal',
                weight: 'bold',  
              }
            },
            grid: {
              display: true,
              drawTicks: false,
            },
          },
        },
      },
    });
  }

  getMonthName(monthId: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
      'September', 'October', 'November', 'December'
    ];
    return monthNames[monthId - 1];
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Input, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { SalesService } from '../../service/sales.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-team-performence',
  templateUrl: './team-performence.component.html',
  styleUrls: ['./team-performence.component.scss']
})
export class TeamPerformenceComponent implements AfterViewInit, OnDestroy {
  @Input() fromMonth!: number;
  @Input() toMonth!: number;
  @ViewChild('barChartCanvas') barChartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  mainEmpId: string | null;
  entityId: string | null;
  financialYear_id: string | null;
  salesTeamData: any;

  constructor(private dashboardService: SalesService) {}

  ngOnInit(): void {
    this.mainEmpId = localStorage.getItem('EmpMainId');
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financialYear_id = localStorage.getItem('financial_id');

    this.getTotalSalesEmployeeWise();
  }

  ngAfterViewInit(): void {
    this.createChart([], []);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fromMonth'] || changes['toMonth']) {
      this.getTotalSalesEmployeeWise();
    }
  }

  getTotalSalesEmployeeWise(): void {
    const data = {
      fromMonth: this.fromMonth,
      toMonth: this.toMonth,
      financial_id: this.financialYear_id
    };
  
    this.dashboardService.getTotalSalesEmployeeWise(this.entityId, data).pipe(
      catchError((error) => {
        if (error.status === 404) {
          console.error('Data not found: 404');
          this.updateChart([], []);
          return of([]);
        } else {
          console.error('An error occurred:', error);
          return of([]);
        }
      })
    ).subscribe((res: any) => {
      if (res && res.data) {
        this.salesTeamData = res.data;
        const sortedData = this.salesTeamData.sort((a: any, b: any) => b.totalGrant - a.totalGrant);
  
        const labels = sortedData.map((item: any) => item.first_name);
        const data = sortedData.map((item: any) => item.totalGrant);
  
        this.updateChart(labels, data);
      } else {
        this.updateChart([], []); 
      }
    });
  }

  createChart(labels: string[], data: number[]): void {
    const canvas = this.barChartCanvas.nativeElement.getContext('2d');
    if (!canvas) {
      console.error('Failed to get canvas context');
      return;
    }

    const gradient = canvas.createLinearGradient(0, 0, canvas.canvas.width, 0);
    gradient.addColorStop(0, 'rgba(255, 99, 132, 1)');
    gradient.addColorStop(1, 'rgba(54, 162, 235, 1)');

    this.chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Total Grant (in ₹)',
            data: data,
            backgroundColor: gradient,
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 2,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => `₹${context.raw}`,
            },
          },
        },
        scales: {
          x: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total Grant (in ₹)',
              font: { size: 12, weight: 'bold' },
            },
            grid: {
              display: false,
              drawTicks: false,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Employees',
              font: { size: 12, weight: 'bold' },
            },
            grid: {
              display: false,
              drawTicks: false,
            },
          },
        },
      },
    });
  }

  updateChart(labels: string[], data: number[]): void {
    if (this.chart) {
      this.chart.destroy(); 
    }
    this.createChart(labels, data); 
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

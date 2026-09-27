import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { SalesService } from '../../service/sales.service';

@Component({
  selector: 'app-revenue-forcast',
  templateUrl: './revenue-forcast.component.html',
  styleUrls: ['./revenue-forcast.component.scss']
})
export class RevenueForcastComponent implements AfterViewInit, OnDestroy {
  @ViewChild('lineChartCanvas') lineChartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  entityId: string | null;
  currentYearSalesData: any;
  forecastedData: any;
  financialYear_id:any
  // previousYearSalesData: any;

  constructor(private dashboardService: SalesService) {}

  ngOnInit() {
    this.entityId = localStorage.getItem('selectedEntityId');
    this.financialYear_id = localStorage.getItem('financial_id');

    this.getSalesForecasting();
  }

  getSalesForecasting() {
    
    const data= {
      financial_id:this.financialYear_id
    }
    this.dashboardService.getSalesForecasting(this.entityId,data).subscribe((res: any) => {
      // this.previousYearSalesData = res.data.previousYearSales;
      this.currentYearSalesData = res.data.currentYearSales;
      this.forecastedData = res.data.forecastedData
      this.updateChartData();
    });
  }

  ngAfterViewInit(): void {
    const labels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.createChart(labels, [], []);
  }

  updateChartData() {
    // const prevMonthData: number[] = this.previousYearSalesData.map((item: any) => parseFloat(item.grant_total));
    const currentMonthData: number[] = this.currentYearSalesData.map((item: any) => parseFloat(item.grant_total));

    const forecastData: number[] = this.forecastedData.map((item:any)=> parseFloat(item.forecasted_grant_total)); 

    const labels: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.createChart(labels, currentMonthData, forecastData);
  }

  createChart(labels: string[],  currentMonthData: number[], forecastData: number[]): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const canvas = this.lineChartCanvas.nativeElement.getContext('2d');
    if (!canvas) {
      console.error('Failed to get canvas context');
      return;
    }

    // const gradientPrev = canvas.createLinearGradient(0, 0, 0, 250);
    // gradientPrev.addColorStop(0, 'rgb(255, 99, 132)');
    // gradientPrev.addColorStop(1, 'rgb(255, 159, 64)');

    const gradientCurrent = canvas.createLinearGradient(0, 0, 0, 250);
    gradientCurrent.addColorStop(0, 'rgb(75, 192, 192)');
    gradientCurrent.addColorStop(1, 'rgb(54, 162, 235)');

    const gradientForecast = canvas.createLinearGradient(0, 0, 0, 250);
    gradientForecast.addColorStop(0, 'rgb(198, 47, 218)');
    gradientForecast.addColorStop(1, 'rgb(255, 159, 64)');

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          // {
          //   label: 'Previous Year Revenue',
          //   data: prevMonthData,
          //   borderColor: gradientPrev,
          //   backgroundColor: 'rgba(255, 99, 132, 0.2)',
          //   tension: 0.2,
          //   borderWidth: 3,
          //   pointRadius: 5,
          //   pointBackgroundColor: 'rgba(75, 192, 192, 1)',
          //   pointBorderColor: '#fff',
          // },
          {
            label: 'Current Year Revenue',
            data: currentMonthData,
            borderColor: gradientCurrent,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            tension: 0.2,
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: 'rgba(75, 192, 192, 1)',
            pointBorderColor: '#fff',
          },
          {
            label: 'Revenue Forecast (Current Year)',
            data: forecastData,
            borderColor: gradientForecast,
            borderDash: [12, 4],
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            tension: 0.2,
            borderWidth: 3,
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
            labels: {
              font: {
                family: 'Arial',
                size: 12,
                style: 'normal',
                weight: 'bold',
                lineHeight: 1.2,
              },
            },
            display: true,
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: (context) => `₹${context.raw}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Amount (in ₹)',
              font: {
                family: 'Arial',
                size: 12,
                style: 'normal',
                weight: 'bold',
              },
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
              },
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

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}

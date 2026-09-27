import { Component, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js/auto'; 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('pieChart') private pieChartRef: any;
  public barChart: any;
  public pieChart:any;

  constructor() { }

  ngOnInit() {
  }
  
  ngAfterViewInit() {
    this.createPieChart()
  }

  // Chart start

  createPieChart(){
    const ctx = this.pieChartRef.nativeElement.getContext('2d');
    this.pieChart = new Chart(ctx, {
      type: 'line',
      data: {

        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September'
        ],
        datasets: [{
          label: 'Monthly Growth',
          data: [65, 59, 80, 81, 56, 55, 40,30,10],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
      
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'category',
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
}

}

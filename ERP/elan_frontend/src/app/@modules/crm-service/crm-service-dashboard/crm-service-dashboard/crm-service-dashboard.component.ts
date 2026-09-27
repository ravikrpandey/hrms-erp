import { Component } from '@angular/core';
import { CanvasJS } from '@canvasjs/angular-charts';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';

@Component({
  selector: 'app-crm-service-dashboard',
  templateUrl: './crm-service-dashboard.component.html',
  styleUrls: ['./crm-service-dashboard.component.scss']
})
export class CrmServiceDashboardComponent {
  todaysLog: any = [];
  dataCards: any = [];

  constructor(private _configurationalMasterService: ConfigurationalmasterService) {}
  ngOnInit(): void {
    this.renderStateWiseChart()
    this.renderEngineerWiseChart()
    this.todaysLogs()
    this.getDataCardData()
  }
  todaysLogs() {
    this._configurationalMasterService.getTodaysLog().subscribe((res: any) => {
      this.todaysLog = res.data
      console.log(this.todaysLog);
    })
  }
  getDataCardData(){
    this._configurationalMasterService.getDataCardData().subscribe((res: any) => {
      this.dataCards = res.dataCards
      console.log(this.dataCards);
    })
  }
  renderStateWiseChart() {
    const chart = new CanvasJS.Chart('stateWiseChart', {
      animationEnabled: true,
      theme: 'light2',
      title: {
        text: ''
      },
      data: [
        {
          type: 'column',
          dataPoints: [
            { label: 'Western UP', y: 150 },
            { label: 'Eastern UP', y: 120 },
            { label: 'Central UP', y: 100 },
            { label: 'Punjab', y: 80 },
            { label: 'Jharkhand', y: 40 }
          ]
        }
      ]
    });
    chart.render();
  }

  renderEngineerWiseChart() {
    const chart = new CanvasJS.Chart('engineerWiseChart', {
      animationEnabled: true,
      theme: 'light2',
      title: {
        text: ''
      },
      data: [
        {
          type: 'column',
          dataPoints: [
            { label: 'Y (Freelancer)', y: 50 },
            { label: 'Vikas Vishvakarma', y: 40 },
            { label: 'Sandeep', y: 30 },
            { label: 'Chand Jat', y: 20 }
          ]
        }
      ]
    });
    chart.render();
  }
}

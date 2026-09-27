import { Component } from '@angular/core';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { SessionManagmentComponent } from "./session-managment/session-managment.component";
import { AttendenceComponent } from "./attendence/attendence.component";
import { RecordingComponent } from "./recording/recording.component";

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-webinar-session',
  standalone:true,
  imports: [CommonModule,DashboardComponent, SessionManagmentComponent, AttendenceComponent  ],
  templateUrl: './webinar-session.component.html',
  styleUrls: ['./webinar-session.component.css']
})
export class WebinarSessionComponent {
 activeTab: string = 'dashboard'; 
  setTab(tab: string) {
    this.activeTab = tab;
    console.log("  this.activeTab",   this.activeTab)
  }
}

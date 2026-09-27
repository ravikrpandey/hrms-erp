import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from "@angular/router";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { WebinarSessionService } from '../webinar-session.service';
import { TableviewComponent } from 'src/app/@shared/tableview/tableview.component';
import { InputfieldComponent } from 'src/app/@shared/inputfield/inputfield.component';

@Component({
  selector: 'app-attendence',
  standalone:true,
  imports: [RouterModule, TableviewComponent, MatInputModule, MatSelectModule, InputfieldComponent],
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.css']
})
export class AttendenceComponent implements OnInit {

  sessions: any[] = [];
  filteredSessions: any[] = [];
  selectedSessionId: string = '';
  rowData: any[] = [];
  loading = true;

  columnDefs = [
    { headerName: 'Learner Name', field: 'learnerName' },
    { headerName: 'Email', field: 'email' },
    // { headerName: ' Join Time', field: 'start_time' },
    // { headerName: 'Exit Time', field: 'end_time' },
    { headerName: 'Duration', field: 'duration' },
    { headerName: 'Platform', field: 'platform' },
    { headerName: 'Type', field: 'type' },
  ];
  entity_id: string | null;

  constructor(
    private router: Router,
    private webinarService: WebinarSessionService
  ) { }

  ngOnInit() {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.loadSessions();
  }

  loadSessions() {
    this.webinarService.getSessions(this.entity_id).subscribe({
      next: (res: any) => {
        this.sessions = res.data;
        this.filteredSessions = res.data.map((s: any) => ({
          id: s.id,
          text: s.session_title
        }));
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onSessionChange(event: any) {
  const sessionId = event.target?.value || event; 
  this.selectedSessionId = sessionId;
  
  if (!sessionId) {
    this.rowData = [];
    return;
  }

  this.webinarService.getSessionLearners(sessionId).subscribe({
    next: (res: any) => {
      this.rowData = res.data.map((learner: any) => ({
        learnerName: learner.learnerName,
        email: learner.email,
        start_time: learner.start_time,
        end_time: learner.end_time,
        duration: this.calculateDuration(learner.start_time, learner.end_time),
        platform: learner.platform,
        type: learner.type
      }));
    },
    error: () => { this.rowData = []; }
  });
}


  calculateDuration(start: string, end: string) {
    if (!start || !end) return '';
    const startTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);
    const diff = (endTime.getTime() - startTime.getTime()) / 60000;
    return diff + ' mins';
  }
}

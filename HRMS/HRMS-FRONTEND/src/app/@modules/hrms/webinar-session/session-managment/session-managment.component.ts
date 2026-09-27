import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from "../../../../@shared/button/button.component";
import { MatInputModule } from "@angular/material/input";
import { WebinarSessionService } from '../webinar-session.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-session-managment',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FormsModule, MatInputModule],
  templateUrl: './session-managment.component.html',
  styleUrls: ['./session-managment.component.css']
})
export class SessionManagmentComponent {
  sessions: any[] = [];
  filteredSessions: any[] = [];
  loading = true;
  searchText: string = '';
  entity_id: string | null;

  constructor(
    private router: Router,
    private webinarService: WebinarSessionService
  ) {}

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.loadSessions();
  }

  loadSessions() {
    this.webinarService.getSessions(this.entity_id).subscribe({
      next: (res: any) => {
        this.sessions = res.data;
        this.filteredSessions = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch() {
    const text = this.searchText.toLowerCase();
    if (!text) {
      this.filteredSessions = this.sessions;
    } else {
      this.filteredSessions = this.sessions.filter(s =>
        s.session_title?.toLowerCase().includes(text)
      );
    }
  }

  getDuration(start: string, end: string): string {
    if (!start || !end) return '';
    const startTime = new Date(start);
    const endTime = new Date(end);
    const diffMs = endTime.getTime() - startTime.getTime();
    const diffMins = Math.round(diffMs / 60000);
    return `${diffMins} Min`;
  }

  goToCreateSession() {
  console.log("hhh")
    this.router.navigate(['master/hrms/webnar-session/create/session-managment']);
  }

  viewSession(session: any) {
    console.log('huhuhuhu')
    this.router.navigate([`master/hrms/webnar-session/view/session-managment/${session.id}`]);
  }

  editSession(session: any) {
     console.log('asdasdas')
    this.router.navigate([`master/hrms/webnar-session/edit/session-managment/${session.id}`]);
  }


  isPastSession(dateStr: string): boolean {
  if (!dateStr) return false;
  const sessionDate = new Date(dateStr);
  const today = new Date();
  // Only compare dates, ignore time
  return sessionDate.setHours(0,0,0,0) < today.setHours(0,0,0,0);
}

}

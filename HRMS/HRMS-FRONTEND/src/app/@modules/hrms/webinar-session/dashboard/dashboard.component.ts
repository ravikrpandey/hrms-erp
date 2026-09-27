import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatCardModule } from '@angular/material/card';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Router } from '@angular/router';
import { WebinarSessionService } from '../webinar-session.service';
import { ButtonComponent } from 'src/app/@shared/button/button.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ButtonComponent, FullCalendarModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  sessions: any[] = [];
  completedSessions: any[] = [];
  filteredSessions: any[] = [];
  loading = true;
  calendarVisible = true;

  stats = {
    total: 0,
    today: 0,
    upcoming: 0,
  };

  calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    events: [],
    editable: false,
    buttonText: {
      today: 'Today'
    },
    selectable: true,
    eventClick: (info: any) => {

      if (info.event.extendedProps.isPast) {
        info.jsEvent.preventDefault();
        return;
      }

      if (info.event.url) {
        window.open(info.event.url, '_blank'); 
        info.jsEvent.preventDefault();
      }
    }
  };
  entity_id: string | null;

  constructor(

    private router: Router,
    private webinarService: WebinarSessionService
  ) { }

  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.loadSessions();
  }

  loadSessions() {
  this.webinarService.getSessions(this.entity_id).subscribe({
    next: (res: any) => {
      const allSessions = res.data || [];
      const now = new Date();

      // 🔹 Total sessions
      this.stats.total = allSessions.length;

      // 🔹 Today’s date in yyyy-mm-dd format
      const todayDate = new Date().toISOString().split("T")[0];

      // 🔹 Filter for today's sessions
      const todaySessions = allSessions.filter((s: any) => s.date === todayDate);

      // 🔹 Count how many are today
      this.stats.today = todaySessions.length;

      // 🔹 Filter upcoming sessions (future date)
      const upcomingSessions = allSessions.filter((s: any) => new Date(s.date) > now);
      this.stats.upcoming = upcomingSessions.length;

      // 🔹 Completed sessions — where end_time + date < now
      this.completedSessions = todaySessions.filter((s: any) => {
        const sessionDate = new Date(s.date);
        const [endH, endM] = s.end_time.split(":").map((x: string) => +x);
        sessionDate.setHours(endH, endM, 0, 0);
        return sessionDate < now;
      });

      // 🔹 Ongoing/upcoming sessions for today
      this.sessions = todaySessions.filter((s: any) => {
        const sessionDate = new Date(s.date);
        const [endH, endM] = s.end_time.split(":").map((x: string) => +x);
        sessionDate.setHours(endH, endM, 0, 0);
        return sessionDate >= now;
      });

      this.filteredSessions = [...this.sessions];

      // 🔹 Calendar coloring logic
      const allEvents = allSessions.map((s: any) => {
        const date = s.date;
        const sessionDate = new Date(date);
        const [endH, endM] = s.end_time.split(":").map((x: string) => +x);
        sessionDate.setHours(endH, endM, 0, 0);

        let bgColor = '#d3783bff';
        let clickable = true;

        if (sessionDate < now) {
          bgColor = '#ca3030ff'; // completed red
          clickable = false;
        } else if (todaySessions.some((t: any) => t.id === s.id)) {
          bgColor = '#65b36cff'; // today's green
        }

        return {
          id: s.id,
          title: s.session_title,
          date: date,
          url: clickable ? s.meetingUrl || '' : '',
          backgroundColor: bgColor,
          borderColor: '#000',
          textColor: '#000',
          extendedProps: {
            clickable: clickable
          }
        };
      });

      this.calendarOptions = {
        ...this.calendarOptions,
        events: allEvents
      };

      this.loading = false;
    },
    error: () => {
      this.loading = false;
    }
  });
}



  joinSession(session: any) {
    if (session.meetingUrl) {
      window.open(session.meetingUrl, '_blank');
    } else {
      this.router.navigate(['/session', session.id]);
    }
  }



}

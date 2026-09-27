import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegistrationService } from './registration.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-webinar-registration',
  standalone:true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './webinar-registration.component.html',
  styleUrls: ['./webinar-registration.component.css']
})
export class WebinarRegistrationComponent implements OnInit {
  sessionId: string = '';  
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private regService: RegistrationService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // URL se sessionId read kar rahe hain
    this.route.queryParamMap.subscribe(params => {
      this.sessionId = params.get('sessionId') || '';
      if (!this.sessionId) {
        this.toastr.error('Session ID not found in URL!');
      }
    });
  }

  onSubmit(): void {
    if (!this.sessionId) {
      this.toastr.error('Session ID not provided!');
      return;
    }

    this.loading = true;
  
    const payload = {
      ...this.formData,
      domain: 'elite_lms'
    };

    this.regService.register(this.sessionId, payload).subscribe({
      next: (res) => {
        this.toastr.success('Registration successful! Redirecting to session...');

    
        const meetingUrl = res.data?.session?.meetingUrl;
        if (meetingUrl) {
          setTimeout(() => {
            window.location.href = meetingUrl;
          }, 1500);   
        }

        this.onReset();
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Registration failed. Check your email.');
        this.loading = false;
      }
    });
  }

  onReset(): void {
    this.formData = { firstName: '', lastName: '', email: '', phone: '' };
  }
}

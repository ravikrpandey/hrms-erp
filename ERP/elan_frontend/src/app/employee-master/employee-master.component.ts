import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.scss'],
})
export class EmployeeMasterComponent {
  constructor(private route: Router, private _authServie: AuthService) {}

  filterMenuNames = ['Grievance', 'Pay', 'Leave Apply', 'Attendance Calendar'];

  img() {
    this.route.navigate(['master/hrms/employee-master/employ']);
  }

  img1() {
    this.route.navigate(['master/hrms/employee-master/announcement-list']);
  }
}

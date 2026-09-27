import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-work-flow',
  templateUrl: './work-flow.component.html',
  styleUrls: ['./work-flow.component.scss'],
})
export class WorkFlowComponent {
  clicked: boolean = false;

  constructor(
    private router: Router,
    private lead: LeadService,
    private _authservice: AuthService
  ) {}

  ngOnInit(): void {}

  goInToPage(m: any) {
    let loginUser: any = localStorage.getItem('signInUser');
    let role_id: any = JSON.parse(loginUser).role_id;
    this._authservice.getModuleActions(role_id, m).subscribe(
      (res) => {
        console.log(res.data.options, ' < --module assign action');
      },
      (err) => {
        console.log(err);
      }
    );
  }
}

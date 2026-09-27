import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeadService } from 'src/app/@shared/services/head.service';
import { NavigationEnd, Router } from '@angular/router';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-project-management',
  templateUrl: './project-management.component.html',
  styleUrls: ['./project-management.component.scss']
})
export class ProjectManagementComponent implements OnInit, OnDestroy {
  clicked: boolean = false;
  suSupModule: any;

  constructor(
    private head: HeadService,
    private router: Router,
    private lead: LeadService,
    private _authservice: AuthService
  ) {}

  ngOnInit(): void {
    this.head.clicked.subscribe(data => {
      this.clicked = data;
    });

    let lg: any = localStorage.getItem('signInUser') || localStorage.getItem('loginUserDetails');
    let loginUser = lg ? JSON.parse(lg) : null;

    let role_master_id = localStorage.getItem('role_master_id');
    let entity_id = localStorage.getItem('selectedEntityId');
    let req = {
      employee_id: loginUser?.employee_id,
      role_master_id: role_master_id,
      entity_id: entity_id,
    };

    let sub = this._authservice.getAllAccess_Modules(req).subscribe((res) => {
      this.suSupModule = this._authservice.getSubSuperModules().subscribe((modRes: any) => {
        if (this.router?.url) {
          this.lead.setModule(modRes);
        }

        if (this.router.url === '/master/project-management') {
          this.router.navigate(['/master/project-management/projects']);
        }

        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
          if (this.router.url === '/master/project-management') {
            this.router.navigate(['/master/project-management/projects']);
          }
        });
      });
      sub?.unsubscribe();
    });
  }

  ngOnDestroy(): void {
    this.suSupModule?.unsubscribe();
  }
}

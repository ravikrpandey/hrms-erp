import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';
import { HeadService } from 'src/app/@shared/services/head.service';
import { LeadService } from 'src/app/@shared/services/lead.service';

@Component({
  selector: 'app-payroll',
  templateUrl: './payroll.component.html',
  styleUrls: ['./payroll.component.scss']
})
export class PayrollComponent {
    clicked: boolean = false;
    suSupModule: any;
  
    constructor(
      private head: HeadService,
      private router: Router,
      private lead: LeadService,
      private _authservice: AuthService
    ) {}
  
    ngOnInit(): void {
      this.head.clicked.subscribe((data) => {
        this.clicked = data;
      });
  
      this.head.clicked.subscribe((data) => {
        this.clicked = data;
      });
  
      let lg: any = localStorage.getItem('signInUser');
      let loginUser = JSON.parse(lg);
  
      let role_master_id = localStorage.getItem('role_master_id');
      let entity_id = localStorage.getItem('selectedEntityId');
      let req = {
        employee_id: loginUser?.employee_id,
        role_master_id: role_master_id,
        entity_id: entity_id,
      };
      let sub = this._authservice.getAllAccess_Modules(req).subscribe((res) => {
        //
  
        this.suSupModule = this._authservice
          .getSubSuperModules()
          .subscribe((res: any) => {
            if (this.router?.url) {
              this.lead.setModule(res);
            }
  
            if (this.router.url === '/master/payroll') {
              if (res) {
                this.router.navigate([`master/payroll/${res[0]?.menuLink}`]);
              }
            }
  
            this.router.events
              .pipe(filter((event) => event instanceof NavigationEnd))
              .subscribe((event: any) => {
                if (this.router.url === '/master/payroll') {
                  if (res) {
                    this.router.navigate([`/master/payroll/${res[0]?.menuLink}`]);
                  }
                }
              });
          });
        sub.unsubscribe();
      });
    }
  
    ngOnDestroy(): void {
      this.suSupModule?.unsubscribe();
    }
}

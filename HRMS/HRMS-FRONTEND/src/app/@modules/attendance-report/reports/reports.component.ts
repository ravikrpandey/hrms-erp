import { Component } from '@angular/core';

import { HeadService } from 'src/app/@shared/services/head.service';
import { NavigationEnd, Router } from '@angular/router';
import { LeadService } from 'src/app/@shared/services/lead.service';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
  clicked: boolean = false;
  suSupModule: any;

  constructor(
    private head: HeadService,
    private router: Router,
    private lead: LeadService,
    private _authservice: AuthService
  ) {}
  leftMenuData: any = [
    {
      id: 1,
      module: 'HR Management',
      menuName: 'Account Receivable',
      menuLink: 'account-receivable',
      menuIcon: 'account_balance_wallet',
    },
    {
      id: 2,
      module: 'HR Management',
      menuName: 'Account Payable',
      menuLink: 'account-payable',
      menuIcon: 'account_balance_wallet',
    },
  ];

  ngOnInit(): void {
    this.head.clicked.subscribe((data) => {
      this.clicked = data;
    });

    this.head.clicked.subscribe((data) => {
      this.clicked = data;
    });
    // if(this.router.url){
    //   this.lead.setModule(this.leftMenuData)
    // }

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

          if (this.router.url === '/master/performance') {
            if (res) {
              this.router.navigate([`master/performance/${res[0]?.menuLink}`]);
            }
          }

          this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe((event: any) => {
              if (this.router.url === '/master/performance') {
                if (res) {
                  this.router.navigate([
                    `master/performance/${res[0]?.menuLink}`,
                  ]);
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

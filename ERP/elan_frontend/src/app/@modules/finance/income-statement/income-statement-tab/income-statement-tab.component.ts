import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
@Component({
  selector: 'app-income-statement-tab',
  templateUrl: './income-statement-tab.component.html',
  styleUrls: ['./income-statement-tab.component.scss']
})
export class IncomeStatementTabComponent {
  queryParamss: any;
  loginUser: any;
  assignAction: any;


  constructor(
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private route: Router,
    private activeroute: ActivatedRoute,
    private shortcutService: ShortcutService,
  ) {
  }
  ngOnInit(): void {
    this.activeroute.queryParams.subscribe((params) => {
      let x = params['page']
      if (!x) x  = 'list'
      this.setActiveButton(x)
    });
    // this._configurationalMasterService.messageSubject.subscribe((id: any) => {
    //   this.collegeIdCopy = id;
    // });
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.assignAction = this._rbackService.accessAssignAction();
    this.shortcutService.registerShortcut('a', () => {
      this.redirect()
    });
  }

  redirect() {
    this.route.navigate(['/master/finance/income-statement/generate-income-statement'])
  }

  setActiveButton(page: string) {
    // Remove active state from all buttons initially
    const buttons = document.querySelectorAll('.tab-item button');
    buttons.forEach(button => button.classList.remove('active_button'));
    // Set active state to the corresponding button
    switch (page) {
     
      case 'list':
        document?.querySelector('.one')?.classList.add('active_button');
        break;
      case 'pending-for-approval':
        document?.querySelector('button[routerLink="pending-for-approval"]')?.classList.add('active_button');
        break;
      case 'approved-by-me':
        document?.querySelector('button[routerLink="approved-by-me"]')?.classList.add('active_button');
        break;
      case 'rejected':
        document?.querySelector('button[routerLink="rejected"]')?.classList.add('active_button');
        break;
      default:
        break;
    }
  }
  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }
}

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-fnf-action',
  templateUrl: './fnf-action.component.html',
  styleUrls: ['./fnf-action.component.scss']
})
export class FnfActionComponent {
  mode: string = '';
  public cellValue: any;
  assignAction: any;
  id: any;
  employeeId: any
  constructor(private route: Router,
    public dialog: MatDialog,
    private employService: EmpRegistrationService,
    private toster: ToastrService,
    private _rbackService: RbacMasterService,
    private router: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
    this.router.queryParams.subscribe(params => {
      this.employeeId = params['employee_id'];
      this.mode = params['mode'];
      if (this.mode === 'edit') {
      } else if (this.mode === 'view') {
      }
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }


  agInit(params: ICellRendererParams): void {
    this.id = params.data.employee_id;
  }

  editItem() {
    this.route.navigate(['/master/ess/fnf-settlement/common/basic-details'], {
      queryParams: { employee_id: this.id, mode: 'edit', },
    });
  }
  viewItem() {
    this.route.navigate(['/master/ess/fnf-settlement/common/basic-details'], {
      queryParams: { employee_id: this.id, mode: 'view', },
    });
  }

}

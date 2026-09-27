import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-earnings-action',
  templateUrl: './variable-earnings-action.component.html',
  styleUrls: ['./variable-earnings-action.component.scss']
})
export class VariableEarningsActionComponent {

  constructor(
    private route: Router,
    private payrollService: PayrollService,
    private toaster: ToastrService,
  ) {

  }

  ngOnInit(): void {
  }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    console.log(this.cellValue);

  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.data;
  }

  public toggleBind() {
    if (this.cellValue.is_active == 1) {
      return true
    } else {
      return false
    }
  };

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  view(e: any) {
    this.route.navigate(['master/payroll/salary-components/variable-earnings/create-variable-earnings'], { queryParams: { earning_id: this.cellValue.id, type: "View" } })
  }

  editForm(E: any) {
    E.stopPropagation();
    this.route.navigate(['master/payroll/salary-components/variable-earnings/create-variable-earnings'], { queryParams: { earning_id: this.cellValue.id, type: "Edit" } })

  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  };

  toggle(event: any) {
    const val = event.checked ? true : false
    const sta = event.checked ? "Activated" : "In_Activated"

    let data = {
      status: val
    }

    this.payrollService.updateVariableEarningStatus(this.cellValue.id, data).subscribe((res: any) => {
      if (res && res.status) {
        this.toaster.success(`The Earning is ${sta} successfully.`);
        this.reloadCurrentRoute();
      }
    }, err => {
      this.toaster.error(err.error.message);
      this.reloadCurrentRoute();
    })
  };


}

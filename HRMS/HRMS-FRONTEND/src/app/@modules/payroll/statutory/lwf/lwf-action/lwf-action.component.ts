import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { PayrollService } from 'src/app/@shared/services/payroll.service';

@Component({
  selector: 'app-lwf-action',
  templateUrl: './lwf-action.component.html',
  styleUrls: ['./lwf-action.component.scss'],
})
export class LwfActionComponent {
  constructor(
    private route: Router,
    private payrollService: PayrollService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {}
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    console.log(this.cellValue);
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.data;
  }
  public toggleBind() {
    if (this.cellValue.status == 'ACTIVE') {
      return true;
    } else {
      return false;
    }
  }
  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  view(e: any) {
    this.route.navigate(
      ['master/payroll/statutory-components/lwf/lwf-create'],
      { queryParams: { lwf_id: this.cellValue.id } }
    );
  }

  toggle(event: any) {
    const val = event.checked ? 'ACTIVE' : 'INACTIVE';

    let data = {
      status: val,
    };

    this.payrollService.updateLwfStatusById(this.cellValue.id, data).subscribe(
      (res: any) => {
        if (res && res.status) {
          this.toaster.success(res.message);
          this.reloadCurrentRoute();
        }
      },
      (err) => {
        this.toaster.error(err.error.message);
        this.reloadCurrentRoute();
      }
    );
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
}

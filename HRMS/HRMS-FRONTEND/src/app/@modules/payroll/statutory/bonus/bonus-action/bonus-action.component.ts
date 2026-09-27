import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';

@Component({
  selector: 'app-bonus-action',
  templateUrl: './bonus-action.component.html',
  styleUrls: ['./bonus-action.component.scss']
})
export class BonusActionComponent {

  constructor(
    private route: Router,
    private recruitService: RecruitService,
    private toast: ToastrService,
  ) {
      // this.data = localStorage.getItem("jobId");
      // 
      
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

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  view(e:any) {
    this.route.navigate(['master/payroll/statutory-components/bonus/statutory-bonus-create'], { queryParams: { bonus_id: this.cellValue.id } })
  }
}

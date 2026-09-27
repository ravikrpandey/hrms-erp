import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cost-center-hierarchy-action',
  templateUrl: './cost-center-hierarchy-action.component.html',
  styleUrls: ['./cost-center-hierarchy-action.component.scss']
})
export class CostCenterHierarchyActionComponent {
cellValue: any;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private financeService: FinaceService,
    private toasterService: ToastrService
  ) {}

  ngOnInit(): void {}

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  navigateToEdit(){
this.router.navigate(['master/finance/cost-center/create-cost'],{queryParams:{id:this.cellValue.id}})
  }
  navigateToView(){
this.router.navigate(['master/finance/cost-center/create-cost'],{queryParams:{id:this.cellValue.id,mode:'view'}})
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
 
}

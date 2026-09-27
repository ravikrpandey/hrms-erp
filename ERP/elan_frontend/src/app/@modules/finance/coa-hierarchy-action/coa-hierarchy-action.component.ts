import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import Swal from 'sweetalert2';
import { ViewChartComponent } from '../view-chart/view-chart.component';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-coa-hierarchy-action',
  templateUrl: './coa-hierarchy-action.component.html',
  styleUrls: ['./coa-hierarchy-action.component.scss'],
})
export class CoaHierarchyActionComponent {
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

  editChart(event: any) {
    
    // this.router.navigate(
    //   ['master/finance/add-chart-account'],
    //   {
    //     queryParams: { id: this.cellValue.id },
    //     skipLocationChange: true,
    //   }
    // );
    // switch (this.cellValue.type) {
    //   case 'accounType':
    //     break;
    //   case 'accounGroup':
    //     event.stopPropagation();
    //     this.router.navigate(
    //       ['master/finance/account-subtype/list-acc-subtypes/add-subtype'],
    //       {
    //         queryParams: { id: this.cellValue.id },
    //         skipLocationChange: true,
    //       }
    //     );

    //     break;
    //   case 'chartOfAccountType':
    //     event.stopPropagation();
    //     this.router.navigate(
    //       ['master/finance/add-chart-account'],
    //       {
    //         queryParams: { id: this.cellValue.id },
    //         skipLocationChange: true,
    //       }
    //     );
    //     break;

    //   default:
    //     break;
    // }

    // this.router.navigate(['master/finance/account-subtype/account-charts/add-chart'], {
    //   queryParams: { id: this.cellValue },skipLocationChange:true
    // });
  }

  deleteChart(event: any) {
    Swal.fire({
      title: 'Are you sure want to Remove?',
      // text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#063178',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Delete!',
      cancelButtonText: 'Skip',
    }).then((result) => {
      if (result.value) {
        this.financeService
          .deleteChartOfAccount(this.cellValue)
          .subscribe((data: any) => {
            if (data) {
              this.toasterService.success(
                'Chart of Account deleted successfully'
              );
              this.reloadCurrentRoute();
            }
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });

    // this.leadService.deleteMandays(e)
  }

  // viewChart(event: any) {
  //   this.router.navigate(
  //     ['master/finance/view-chart'],
  //     {
  //       queryParams: { id: this.cellValue.id },
  //       skipLocationChange: true,
  //     }
  //   );
  // }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  openDialog() {
    const dialogRef = this.dialog.open(ViewChartComponent, {
      data: { id: this.cellValue },

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }



viewChart(event:any){
   event.stopPropagation();
    this.router.navigate(['master/finance/view-chart'], {
      queryParams: { id: this.cellValue.id },skipLocationChange:true
    });
}
editCHartAccount(event:any){
   event.stopPropagation();
    this.router.navigate(['master/finance/add-chart-account'], {
      queryParams: { id: this.cellValue.id },skipLocationChange:true
    });
}



}

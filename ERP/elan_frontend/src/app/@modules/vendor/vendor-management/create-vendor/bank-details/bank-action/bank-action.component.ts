import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { VendorManagementService } from 'src/app/@shared/services/vendor-management.service';
import Swal from 'sweetalert2';
import { BankDailogComponent } from '../bank-dailog/bank-dailog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonService } from 'src/app/@shared/services/common.service';

@Component({
  selector: 'app-bank-action',
  templateUrl: './bank-action.component.html',
  styleUrls: ['./bank-action.component.scss'],
})
export class BankActionComponent {
  cellValue: any;
  bankData: any;
  shows: any;
  rowData: any;
  id: any;
  constructor(
    private route: Router,
    private vendorService: VendorManagementService,
    private toast: ToastrService,
    public dialog: MatDialog,
    private location: Location,
    private activeroute: ActivatedRoute,
    private _commonService : CommonService
  ) {}
  ngOnInit(): void {
    this._commonService?.showLoader()
    this.activeroute.queryParams.subscribe((params: any) => {
      this._commonService?.hideLoader()
      this.id = params.id;
      console.log('hh',this.id);
      
    })

    this.vendorService.getval().subscribe((res: any) => {
      console.log('res', res);
      this.shows = res;
    });
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data;
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  currentRout(){
    let currentUrl = this.route.url;
    let newVal = currentUrl.split("?")
    let prm = newVal[1].split('=')
    // let val = newVal[1].slice(8)
    console.log('PR,M',prm)
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([newVal[0]],{queryParams:{[prm[0]]:prm[1]}});
    });
  }

  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure to delete this Bank Detail ?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: '#f44336',
      confirmButtonColor: '#3f51b5',
      confirmButtonText: 'Yes',
      cancelButtonText: 'Not Now',
    }).then((result) => {
      if (result.isConfirmed) {
        this._commonService?.showLoader()
        this.vendorService.deleteBank(this.cellValue.bank_details_id).subscribe(
          (res: any) => {
            this._commonService?.hideLoader()
            this.toast.success(res.message);
            if(this.id){
              this.currentRout();
            }else{
              this.reloadCurrentRoute();
            }
          },
          (err) => {
            this._commonService?.hideLoader()
            this.toast.error(
              'Something went wrong please try again',
              'Error Message'
            );
          }
        );
      }
    });
  }

  viewDailog(e: any) {
    e.stopPropagation();
    const dialogRef = this.dialog.open(BankDailogComponent, {
      width: '450px',
      data: this.cellValue,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
}

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { FinaceService } from 'src/app/@shared/services/finace.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';
import { RepeatFrequencyComponent } from '../../../journal-entry/repeat-frequency/repeat-frequency.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-adjustment-voucher-action',
  templateUrl: './adjustment-voucher-action.component.html',
  styleUrls: ['./adjustment-voucher-action.component.scss']
})
export class AdjustmentVoucherActionComponent {
  assignAction: any;
  singleData: any = {};
  environment = environment
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _rbackService: RbacMasterService,
    private _finaceService: FinaceService,
    private toaster:ToastrService,
    private http:HttpClient,
  ) {
  }

  ngOnInit(): void {
    this.assignAction = this._rbackService?.accessAssignAction();
  }

  // Ag grid start
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params.data;

  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.id;
  }

  refresh(params: ICellRendererParams): boolean {
    // set value into cell again
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  // Ag grid end

  journalDelete(event:any){
    event.stopPropagation();
      Swal.fire({
        title: 'Are you sure want to Remove?',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: '#063178',
        confirmButtonColor: '#f44336',
        confirmButtonText: 'Delete!',
        cancelButtonText: 'Skip',
      }).then((result) => {
        if (result.value) {
          this._finaceService.journalDelete(this.cellValue).subscribe(
            (res:any) => {
              if(res){
                this.toaster.success(res.message)
                this.reloadCurrentRoute()
              }
              else if(result.dismiss === Swal.DismissReason.cancel){

              }
            },
            (err:any) => {
              this.toaster.error(err.error.message)
            })
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      });
  }

  editjournal() {
    console.log("singleDatasingleData",this.singleData);

    this.route.navigate(["/master/finance/journal/journal-ledger/journal-entry"], { queryParams: { journalid: this.singleData?.id, actionType: 'edit', tabType: this.singleData.journal_status } })
    // if(this.singleData.journal_book_status == "quick_entry"){
    //   this.route.navigate(["/master/finance/journal-ledger/quick-entry"], { queryParams: { journalid: this.singleData?.id, actionType: 'edit' } })
    // }
    // else{
    //   this.route.navigate(["/master/finance/journal-ledger/journal-entry"], { queryParams: { journalid: this.singleData?.id, actionType: 'edit' } })
    // }
  }

  viewJournal() {
    this.route.navigate(["/master/finance/transactions/adjustment-voucher/add-adjustment-voucher"], { queryParams: { journalid: this.singleData?.id, actionType: 'view',tabType: this.singleData.journal_status } })
    // if(this.singleData.journal_book_status == "quick_entry"){
    //   this.route.navigate(["/master/finance/journal-ledger/quick-entry"], { queryParams: { journalid: this.singleData?.id, actionType: 'view' } })
    // }
    // else{
    //   this.route.navigate(["/master/finance/journal-ledger/journal-entry"], { queryParams: { journalid: this.singleData?.id, actionType: 'view' } })
    // }
  }

  schedule(e: any) {
    console.log(this.singleData);
    const dialogRef = this.dialog.open(RepeatFrequencyComponent, {
      width: '600px',
      data: { id: this.singleData },
    });
    dialogRef.afterClosed().subscribe((result) => {

    });
  }

downloadPdf() {
  // const token = localStorage.getItem('token') || '';

  // const headers = new HttpHeaders({
  //   'Authorization': `Bearer ${token}`,
  //   'Content-Type': 'application/json'
  // });

  // this.http.post(`${environment.servralUrl}/api/v1/adjustment-voucher/generate`, {}, {
  //   headers: headers,
  //   responseType: 'blob'
  // }).subscribe((res:any)=>{
  //   console.log(res.data.fileUrl)
  //   window.open(res.data.fileUrl,'_blank')
  // },(err:any)=>{

  // })

  this._finaceService.adjustmentVoucherPDF(this.cellValue,'').subscribe((res:any)=>{
      if(res.data){
        window.open(res.data.fileUrl,'_blank')
      }
  })


}



}

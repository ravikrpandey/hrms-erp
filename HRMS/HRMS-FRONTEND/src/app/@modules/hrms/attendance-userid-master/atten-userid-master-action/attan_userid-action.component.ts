import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ICellRendererParams, Logger } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { AttendanceUserIDService } from 'src/app/@shared/services/service/attendance/attand_userid.services';
import Swal from 'sweetalert2';
import { AttUseridMasterDialogComponent } from '../atten-userid-master-dialog/attuserid-master-dialog.component';


@Component({
  selector: 'app-currency-master-action',
  templateUrl: './attan_userid-action.component.html',
  styleUrls: ['./attan_userid-action.component.scss']
})
export class AttUseridMasterActionComponent {
  attend_userID: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private AttendanceUserIDService: AttendanceUserIDService,
    private toaster: ToastrService,
  ) {

  }

  ngOnInit(): void {
    // this.getCurrency();
  }
  public cellValue: any;
  allCurrencyData: any;

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  singleData: any;
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    this.singleData = params?.data;
    this.attend_userID = params.data.id
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted ? params.valueFormatted : params.data.id
  }
  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  edit(e: any) {
    const dialogRef = this.dialog.open(AttUseridMasterDialogComponent, {
      data: { id: this.singleData.id },
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Are you sure you want to Remove it?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.AttendanceUserIDService.delete_userId_detail(this.cellValue).subscribe(
          (res) => {
            this.toaster.success('UserID Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")

          }
        )
      }
  });
  } 

}

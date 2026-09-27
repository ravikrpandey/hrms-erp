import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// import { ContentDialogComponent } from './content-dialog/content-dialog.component';
import { ItticketingService } from 'src/app/@shared/services/itticketing.service';
import { MydialogComponent } from './mydialog/mydialog.component';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-it-ticketing',
  templateUrl: './it-ticketing.component.html',
  styleUrls: ['./it-ticketing.component.scss']
})
export class ItTicketingComponent {
  rowData: any;
  showLoader: boolean = false;
  disabledSearchBox:boolean = true;
  searchVal:any= '';

  constructor(private _itticketing: ItticketingService,
    public dialog: MatDialog,
    private route: Router,
    private toastr:ToastrService
    ) {
  }

  ngOnInit(): void {
    localStorage.setItem("employee_id:", "undefined");
    this.showLoader = true;
    this._itticketing.getittIcketing().subscribe((res: any) => {
      this.showLoader = false;
      this.rowData = res.data;
      
    }, (err) => {
      
      this.showLoader = false;
    }
    );
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  delete(e: any) {
    e.stopPropagation();
    Swal.fire({
      title: 'Do You Want to Delete Ticket of this Raised By ?',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        // const data = {
        //   fixed_interview_status: "INACTIVE"
        // };
        this._itticketing.getittIcketing().subscribe(
          (res) => {
            
            this.toastr.success('Delete successfully ');
            // this.reloadCurrentRoute();
          },
          (err) => {
            this.toastr.error("Somthing went wrong.. Please try agin", "Error Message")
            
          }
        )
      }
    });
  }
  getCellValue(rowData: any) {
    // 
    const dialogRef = this.dialog.open(MydialogComponent, {
      width: '400px',
      data:rowData
    });
    dialogRef.afterClosed().subscribe((result) => {
      
    });
  }

  showSearchBox(searchBox:any){
    searchBox.classList.toggle('showSearchBox')
    // 
    
    this.disabledSearchBox = !this.disabledSearchBox
    if(this.disabledSearchBox){
      this.searchVal = '';
    };
  }
}

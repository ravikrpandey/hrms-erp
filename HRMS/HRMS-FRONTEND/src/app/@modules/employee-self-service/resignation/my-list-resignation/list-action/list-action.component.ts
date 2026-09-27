import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { EmployeSelfService } from 'src/app/@shared/services/employe-self.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ListFormComponent } from '../../pending-for-approval/list-form/list-form.component';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
@Component({
  selector: 'app-list-action',
  templateUrl: './list-action.component.html',
  styleUrls: ['./list-action.component.scss']
})
export class ListActionComponent {

  paramsVal: any;
  id: any;
  tobeApproved: boolean = false;
  allJObData: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private toster: ToastrService,
    private _configurationalmasterService: ConfigurationalmasterService,
    private toaster: ToastrService,
    private emp_self_service: EmployeSelfService,
    private recruitService: RecruitService,
  ) {
    // this.data = localStorage.getItem("jobId");
    // 
  }
  ngOnInit(): void { }
  public cellValue: any;
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.paramsVal = params.data.id;
    
    this.cellValue = this.getValueToDisplay(params);
    this.allJObData = params.data;
    this.id = params.data.id

    if (params?.data?.progressStatus == 'OPEN') {
      this.tobeApproved = true;
    }
    
  }
  getValueToDisplay(params: ICellRendererParams) {


    return params.valueFormatted
      ? params.valueFormatted
      : params.data.type_of_vendor_id;
  }
  refresh(params: ICellRendererParams): boolean {

    // write code to modify cell

    //EDIT DATA FROM API
    if (params) {
      const data: any = {
        type_of_vendor_name: params.data.type_of_vendor_name,
        type_of_vendor_status: params.data.type_of_vendor_status,
      };
      if (params.data.color === null && params.data.color !== '') {
        this.createVendor(data);
      } else {
        const type_of_vendor_id: number = Number(params.data.type_of_vendor_id);
        this.updateBraanch(type_of_vendor_id, data);
        //  this.reloadCurrentRoute();
      }
    } else {
      this.toaster.error(
        'Something went wrong please try again',
        'Error Message'
      );
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  createVendor(data: any) {


    this._configurationalmasterService.addVendorType(data).subscribe(
      (res: any) => {

        this.toaster.success('Branch Created Successfully!');
        this.reloadCurrentRoute();
      },
      (err: any) => {

        this.toaster.error(
          'Something went wrong please try again!',
          'Error Message'
        );
      }
    );
  }

  updateBraanch(type_of_vendor_id: any, data: any) {


    this._configurationalmasterService.updatevendor(type_of_vendor_id, data).subscribe(
      (res: any) => {

        this.toaster.success('Updated Successfully');
      },
      (err: any) => {
        this.toaster.error(
          'Something went wrong please try again',
          'Error Message'
        );

      }
    );
  }

  edit(e: any) {
    this.route.navigate(['master/ess/resignation/new-request-create'], { queryParams: { id: this.id },skipLocationChange: true })
  }
  openDialog(e: any) {
    e.stopPropagation()
    // const dialogRef = this.dialog.open(MyRequestDialogComponent, {
    //   data: { allData:this.allJObData },

    //   width: '39%',
    // });

    // dialogRef.afterClosed().subscribe((result) => {

    // });
    this.route.navigate(['master/ess/resignation/new-request-create'], { queryParams: { id: this.paramsVal, type: 'view' },skipLocationChange: true })

  }
  updated(e: any) {
    this.route.navigate(['master/ess/resignation/pending-for-approval/update-request'], { queryParams: { id: this.paramsVal },skipLocationChange: true })
  }

  openComponent(): void {
    const dialogRef = this.dialog.open(ListFormComponent, {
      width: '60%', height: '600px', // Customize the dialog size
      data: { id: this.paramsVal } // Pass data to the dialog (paramsVal here)
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog was closed', result);
    });
  }

  delete(e: any) {
    e.stopPropagation();
  
    Swal.fire({
      title: 'Are you sure to delete',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      cancelButtonColor: "#f44336",
      confirmButtonColor: "#3f51b5",
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        // You need to pass the second argument 'data' to deleteResignation
        const data = {}; // Add whatever data is needed, or leave it empty
        this.recruitService.deleteResignation(this.id, data).subscribe(
          (res: any) => {
            if (res) {
              this.toster.success('Deleted Successfully');
              this.reloadCurrentRoute();
            }
          }, (err) => {
            this.toster.success('Something went wrong please try again', 'Error Message');
          }
        );
      };
    });
  }
  
createExit(){
  this.route.navigate(['master/ess/exit-form/create'], { queryParams: { resignation_id: this.id }})
}


}

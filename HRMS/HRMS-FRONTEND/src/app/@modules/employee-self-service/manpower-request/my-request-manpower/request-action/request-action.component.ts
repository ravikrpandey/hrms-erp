import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { MyRequestDialogComponent } from '../my-request-dialog/my-request-dialog.component';

@Component({
  selector: 'app-request-action',
  templateUrl: './request-action.component.html',
  styleUrls: ['./request-action.component.scss']
})
export class RequestActionComponent {
paramsVal: any;
  idJob: any;
  tobeApproved: boolean = false;
  allJObData: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private toaster: ToastrService
  ) {
    // this.data = localStorage.getItem("jobId");
    // 
  }
  ngOnInit(): void {}
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
    this.idJob=params.data.id

    if(params?.data?.progressStatus == 'OPEN'){
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

  edit(e:any){
this.route.navigate(['master/workflow/work-flow-job/work-flow-create'],{ queryParams: { id: this.idJob } })
  }
  openDialog(e:any) {
    e.stopPropagation()
    // const dialogRef = this.dialog.open(MyRequestDialogComponent, {
    //   data: { allData:this.allJObData },

    //   width: '39%',
    // });

    // dialogRef.afterClosed().subscribe((result) => {
      
    // });
this.route.navigate(['master/ess/manpower-request/new-request-create'],{ queryParams: { id: this.paramsVal, type:'view'} })
    
  }
  updated(e:any){
// this.route.navigate(['master/ess/manpower-request/pending-for-approval/update-request'],{ queryParams: { id: this.paramsVal} })
this.route.navigate(['master/ess/manpower-request/new-request-create'],{ queryParams: { id: this.paramsVal, type:'approval'} })
  }
}

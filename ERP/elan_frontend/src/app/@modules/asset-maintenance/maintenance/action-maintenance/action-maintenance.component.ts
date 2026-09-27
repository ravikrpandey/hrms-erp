import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';

@Component({
  selector: 'app-action-maintenance',
  templateUrl: './action-maintenance.component.html',
  styleUrls: ['./action-maintenance.component.scss']
})
export class ActionMaintenanceComponent {
  paramsVal: any;
  id: any;
  fid:any;
  params:any;
  assignAction: any;
  scannedData: any;
  qrCodeImageUrl: string | null = null;
  constructor(
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private toaster: ToastrService,
    private _rbackService : RbacMasterService,
    private _commonService : CommonService,
  ) {
    // this.data = localStorage.getItem("jobId");
    // 
  }
  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }
  public cellValue: any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    this.paramsVal = params.data.id;
    this.cellValue = this.getValueToDisplay(params);
 
  }
  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted
      ? params.valueFormatted
      : params.data.id;
  }

  
  view(e:any,mode:any){
    this.router.navigate(['/master/asset-management/maintenance/create-maintenance'], {
      queryParams: {
        id: this.cellValue,
        mode:mode
      }
    })
  }
  
  edit(e:any,mode:any){
    this.router.navigate(['/master/asset-management/maintenance/create-maintenance'], {
      queryParams: {
        id: this.cellValue,
        mode:mode
      }
    })
  }
  
  openDialog(e:any) {  
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  delete(e: any) {
   
  } 
  
  
  

  
}



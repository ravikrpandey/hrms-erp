import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-voucher-master-action',
  templateUrl: './voucher-master-action.component.html',
  styleUrls: ['./voucher-master-action.component.scss']
})
export class VoucherMasterActionComponent {
  cellValue: any;
  assignAction: any;
  constructor(private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private toster: ToastrService) { }
  ngOnInit(): void {
    this.assignAction = this._rbackService.accessAssignAction();
  }

  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);

  }
  getValueToDisplay(params: ICellRendererParams) {

    return params.data.id;
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  DeleteData(e: any) {
    e.stopPropagation();
    console.log(this.cellValue,'DeleteData')
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
        
        this._configurationalmasterService.deleteVoucherById(this.cellValue).subscribe(
          (res: any) => {
            this.toster.success(res.message)
            this.reloadCurrentRoute();
          }, (err) => {
            this.toster.error('Something went wrong please try again', 'Error Message')
          }
        )
      };
    });
  }

  openDialog() {
    
      this.route.navigate(['/master/configurational-master/master-voucher-type/add-master-voucher'],{queryParams:{
        id:this.cellValue,view:'view'
      }})
   

  }
  editData(event: any) {
    this.route.navigate(['/master/configurational-master/master-voucher-type/add-master-voucher'],{queryParams:{
      id:this.cellValue
    }})
  }
}

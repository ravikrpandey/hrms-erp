import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { BranchDialogComponent } from '../branch-dialog/branch-dialog.component';

@Component({
  selector: 'app-branch-action',
  templateUrl: './branch-action.component.html',
  styleUrls: ['./branch-action.component.scss'],
})
export class BranchActionComponent {
  paramsVal: any;
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
    this.paramsVal = params.data.branch_id;
    this.cellValue = this.getValueToDisplay(params);
    
  }
  getValueToDisplay(params: ICellRendererParams) {
    

    return params.valueFormatted
      ? params.valueFormatted
      : params.data.countryss_id;
  }
  refresh(params: ICellRendererParams): boolean {
    
    // write code to modify cell

    //EDIT DATA FROM API
    if (params) {
      const data: any = {
        branch_name: params.data.branch_name.trim(),
        status: params.data.status,
      };
      debugger
      if (params.data.color === null && params.data.color !== '') {
        this.createBraanch(data);
      } else {
        const branch_id: number = Number(params.data.branch_id);
        // this.updateBraanch(branch_id, data);
        // this.reloadCurrentRoute();
      }
    } else {
      this.toaster.error(
        "branch_name is All Ready Exits!",
        'Error Message'
      );
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  createBraanch(data: any) {
    debugger
    this._configurationalmasterService.createBranch(data).subscribe(
      (res: any) => {
        
        this.toaster.success('Branch Created Successfully!');
        this.reloadCurrentRoute();
      },
      (err: any) => {
        
        this.toaster.error(
          "branch_name is All Ready Exits!",
          'Error Message'
        );
      }
    );
  }

  // updateBraanch(branch_id: any, data: any) {
  //   this._configurationalmasterService.editBranch(branch_id, data).subscribe(
  //     (res: any) => {
  //       
  //       this.toaster.success('Updated Successfully');
  //     },
  //     (err: any) => {
  //       this.toaster.error(
  //         'Something went wrong please try again',
  //         'Error Message'
  //       );
  //       
  //     }
  //   );
  // }
  openDialog() {
    const dialogRef = this.dialog.open(BranchDialogComponent, {
      data: { id: this.paramsVal },

      width: '25%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      
    });
    
  }
}

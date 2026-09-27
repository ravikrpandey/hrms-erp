import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { IsmDialogComponent } from '../ism-dialog/ism-dialog.component';
@Component({
  selector: 'app-ism-action',
  templateUrl: './ism-action.component.html',
  styleUrls: ['./ism-action.component.scss']
})
export class IsmActionComponent {
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
    this.paramsVal = params.data.industry_sector_id;
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
        industry_sector_name: params.data.industry_sector_name,
        status: params.data.status,
      };
      if (params.data.color === null && params.data.color !== '') {
        this.createSectorMaster(data);
      } else {
        const industry_sector_id: number = Number(params.data.industry_sector_id);
        // this.updateSectorMaster(industry_sector_id, data);
      }
    } else {
      this.toaster.error(
        "industry_sector_name is All Ready Exits!",
        'Error Message'
      );
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  createSectorMaster(data: any) {
    this._configurationalmasterService.createIndustry(data).subscribe(
      (res: any) => {
        
        this.toaster.success('Created Succesfully!');
        this.reloadCurrentRoute();
      },
      (err: any) => {
        
        this.toaster.error(
          "industry_sector_name is All Ready Exits!",
          'Error Message'
        );
      }
    );
  }

  // updateSectorMaster(industry_sector_id: any, data: any) {
  //   this._configurationalmasterService
  //     .editIndustry(industry_sector_id, data)
  //     .subscribe(
  //       (res: any) => {
  //         
  //         this.toaster.success('Updated Successfully');
  //       },
  //       (err: any) => {
  //         this.toaster.error(
  //           'Something went wrong please try again',
  //           'Error Message'
  //         );
  //         
  //       }
  //     );
  // }
  openDialog() {
    const dialogRef = this.dialog.open(IsmDialogComponent, {
      data: { id: this.paramsVal },

      width: '25%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      
    });
    
  }
}

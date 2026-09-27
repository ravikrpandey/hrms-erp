import { Component } from '@angular/core';
import {
   ICellRendererParams,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TrainingDialogComponent } from '../training-dialog/training-dialog.component';


@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})

export class ActionComponent {
  isChecked = false;
  achieveId: any;
  checkedActive: any;
  checkedInActive: any;
  traning_name: any;
  checkBox: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private toaster: ToastrService
  ) {
  
  }

  ngOnInit(): void {
    this.getCustomerType();
  }
  public cellValue: any;
  allCustomerTypeData: any;

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    
  }
  getValueToDisplay(params: ICellRendererParams) {
    this.checkBox = params.data.isChecked;
    
    if (this.checkBox === true) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
    

    return params.valueFormatted
      ? params.valueFormatted
      : params.data.traning_name_id;
  }
  refresh(params: ICellRendererParams): boolean {
    
    // wrirte code to modify cell

    if (params) {
              const data: any = {
                traning_name: params.data.traning_name.trim(),
            }
            if (params.data.color === null && params.data.color !== "") {
              
              
              this.createTrainingName(data);
            } else {
              const traning_name_id: number = Number(params.data.traning_name_id);
              this.updateSingleTraining(traning_name_id, data);
              
            }
          } else {
            this.toaster.error('Something went wrong please try again', 'Error Message');
          }
      
          this.cellValue = this.getValueToDisplay(params);
          return true;
        }

   createTrainingName(data: any) {
      this._configurationalmasterService.CreateTrainingName(data).subscribe(
      (res: any) => {
        
        this.toaster.success('Customer Type Created Successfully');
        this.reloadCurrentRoute();
      },
      (err: any) => {
        
        this.toaster.error(
          'Something went wrong please try again',
          'Error Message'
        );
      }
    );
  }

  updateSingleTraining(id: any, data: any) {
    this._configurationalmasterService.updateSingleTrainingName(id, data).subscribe(
      (res: any) => {
        
        this.toaster.success('Training Name Updated Successfully')
      }, (err: any) => {
        this.toaster.error('Something went wrong please try again', 'Error Message');
        
      });
  };

  toggle(e: any, isChecked: boolean) {
    e.stopPropagation();
    
    // let checked =isChecked;
    

    if (isChecked) {
      this.checkedActive = 'ACTIVE';

      
      // 
    } else {
      this.checkedActive = 'INACTIVE';
      
      // 
    }

    let body = {
      status: this.checkedActive,
      isChecked: isChecked,
    }
    
    if (this.checkBox === true) {   
        this._configurationalmasterService.editTrainingName(this.cellValue, body).subscribe((res: any) => {
        this.traning_name = res;
        this.toaster.success("Training Name successfully Inactivate")
        

      })
      this.reloadCurrentRoute();
    } else {
        this._configurationalmasterService.editTrainingName(this.cellValue, body).subscribe((res: any) => {
        this.traning_name = res;
        this.toaster.success("Training Name successfully activate")
        
      })
      this.reloadCurrentRoute();
    }

  }
  openDialog() {
    

    const dialogRef = this.dialog.open(TrainingDialogComponent, {
      width: '35%',     
      data: { id: this.cellValue },
    });

    dialogRef.afterClosed().subscribe((result) => {
      
    });
    
  }


  getCustomerType() {
    this._configurationalmasterService.getCustomerType().subscribe((res: any) => {
      this.allCustomerTypeData = res.data;
      
    });
  }
}

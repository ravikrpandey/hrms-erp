import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ICellRendererParams, Logger } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import Swal from 'sweetalert2';
import { StatemasterdialogComponent } from '../statemasterdialog/statemasterdialog.component';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent {
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

  ngOnInit(): void {
    this.getCountry();
  }
  public cellValue: any;
  allCountryData: any;

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
    

    return params.valueFormatted
      ? params.valueFormatted
      : params.data.states_id;
  }
  refresh(params: ICellRendererParams): boolean {
    
    // wrirte code to modify cell

    if (params) {
      const country = this.allCountryData.find(
        (e: any) => e.countryss_name === params.data.countryss_name
      );
      

      const data: any = {
        countryss_id: country.countryss_id,
        states_name: params.data.states_name,
      };

      
      if (params.data.color === null && params.data.color !== '') {
        this.createState(data);
      } else {
        const state_id: number = Number(params.data.states_id);
        const countryss_id: number = Number(params.data.countryss_id);

        this.updateSingleState(state_id, data);
        // this.updateSingleCountry(countryss_id,data)
        
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

  createState(data: any) {
    // alert("Hellow");
    this._configurationalmasterService.createState(data).subscribe(
      (res: any) => {
        
        this.toaster.success('State Created Successfully');
        this.reloadCurrentRoute();
      },
      (err: any) => {
        
        this.toaster.error(
          "states_name is All Ready Exits!",
          'Error Message'
        );
      }
    );
  }

  updateSingleState(id: any, data: any) {
    this._configurationalmasterService.updateSingleState(id, data).subscribe(
      (res: any) => {
        
        this.toaster.success('State Updated Successfully');
      },
      (err: any) => {
        this.toaster.error(
          "states_name is All Ready Exits!",
          'Error Message'
        );
        
      }
    );
  }

  openDialog(mode:any) {
    

    const dialogRef = this.dialog.open(StatemasterdialogComponent, {
      width: '32%',
      data: { id: this.cellValue, mode: mode },
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
    
  }

  getCountry() {
    this._configurationalmasterService.getAllActivecountry().subscribe((res: any) => {
      this.allCountryData = res.data;
      
    });
  }
}

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { CountrymasterdialogComponent } from '../countrymasterdialog/countrymasterdialog.component';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent {
  allStateData: any;
  languageFlag: 'en' | 'pt' = 'en';
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  language$ = this.languageSubject.asObservable();
  translations = {
    en: {
      tooltip: 'view',
    },
    pt: {
      tooltip: 'visualizar',
    }
  };
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private _configurationalmasterService: ConfigurationalmasterService,
    private toaster: ToastrService,
  ) {
    // this.data = localStorage.getItem("jobId");
    // 

  }

  ngOnInit(): void {
  }

  public cellValue: any;
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


    return params.valueFormatted ? params.valueFormatted : params.data.countryss_id
  }
  refresh(params: ICellRendererParams): boolean {

    // wrirte code to modify cell 

    if (params) {
      // const country = this.allStateData.find((e: any) => e.countryss_name.toUpperCase() === params.data.countryss_name.trim().toUpperCase())
      // 
      const data: any = {
        country_code: params.data.country_code,
        countryss_name: params.data.countryss_name.trim(),
      }
      if (params.data.color === null && params.data.color !== "") {


        this.createCountry(data);
      } else {
        const country_id: number = Number(params.data.countryss_id);
        // this.updateSingleCountry(country_id, data);

      }
    } else {
      this.toaster.error('Something went wrong please try again', 'Error Message');
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  // edit(){
  //   this.router.navigate(["master/hrms/rbacmaster/Rbac-role-create"],{queryParams:{role_master_id:this.cellValue}})
  // }

  createCountry(data: any) {
    this._configurationalmasterService.createCountry(data).subscribe(
      (res: any) => {

        this.toaster.success('Country Created Successfully');
        this.reloadCurrentRoute();
      }, (err: any) => {

        this.toaster.error("countryss_name is All Ready Exits!");
      }
    )
  };

  updateSingleCountry(id: any, data: any) {
    this._configurationalmasterService.updateSingleCountry(id, data).subscribe(
      (res: any) => {

        this.toaster.success('Country Updated Successfully')
      }, (err: any) => {
        this.toaster.error("Name is All Ready Exits!", 'Error Message');

      });
  };

  openDialog() {

    const dialogRef
      = this.dialog.open(CountrymasterdialogComponent, {
        width: '30%',
        // maxWidth: '100vw',
        // maxHeight: '100vh',
        // height: '100%',
        // panelClass: 'full-screen-modal',
        data: { id: this.cellValue }

      });

    dialogRef.afterClosed().subscribe(result => {

    });


  }

  getState() {
    this._configurationalmasterService.getState().subscribe((res: any) => {
      this.allStateData = res.data


    })
  }
  translate(key: keyof typeof ActionsComponent.prototype.translations['en']): string {
    const language = this.languageSubject.getValue();
    return this.translations[language][key] || key.toString();
  }
}

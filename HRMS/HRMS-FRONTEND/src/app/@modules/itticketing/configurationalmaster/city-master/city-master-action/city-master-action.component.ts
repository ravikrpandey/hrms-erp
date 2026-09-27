import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ICellRendererParams, Logger } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RecruitService } from 'src/app/@shared/services/recruitment.service';
import Swal from 'sweetalert2';
import { LanguageTranslateService } from 'src/app/@shared/services/language_translate/language-translate.service';
import { BehaviorSubject } from 'rxjs';
import { CityMasterDialogComponent } from '../city-master-dialog/city-master-dialog.component';

@Component({
  selector: 'app-city-master-action',
  templateUrl: './city-master-action.component.html',
  styleUrls: ['./city-master-action.component.scss']
})
export class CityMasterActionComponent {
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
    private router: Router,
    private _configurationalmasterService: ConfigurationalmasterService,
    private language_service:LanguageTranslateService,
    private toaster: ToastrService,
  ) {
    // this.data = localStorage.getItem("jobId");
    // 

  }

  ngOnInit(): void {
    this.languageTranslate()
   }

   languageTranslate(){
    this.language_service.data$.subscribe((languagetype:any)=>{
      this.languageFlag = languagetype || 'pt';
      this.languageSubject.next(this.languageFlag);
    })
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
    

    return params.valueFormatted ? params.valueFormatted : params.data.city_id
  }
  refresh(params: ICellRendererParams): boolean {
    
    // wrirte code to modify cell 

    if (params) {
      // const country = this.allStateData.find((e: any) => e.countryss_name.toUpperCase() === params.data.countryss_name.trim().toUpperCase())
      // 
      const data: any = {
        city_id:params.data.city_id,
        city_name: params.data.city_name.trim(),
      }
      if (params.data.color === null && params.data.color !== "") {
        
        
        this.createCountry(data);
      } else {
        const city_id: number = Number(params.data.city_id);
        // this.updateSingleCountry(country_id, data);
        
      }
    } else {
      this.toaster.error('Something went wrong please try again', 'Error Message');
    }

    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  edit(e: any) {

    const dialogRef = this.dialog.open(CityMasterDialogComponent, {
      data: { id: this.cellValue},

      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

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
      = this.dialog.open(CityMasterDialogComponent, {
        width: '30%',
        // maxWidth: '100vw',
        // maxHeight: '100vh',
        // height: '100%',
        // panelClass: 'full-screen-modal',
        data: { id: this.cellValue,view:'view'}

      });

    dialogRef.afterClosed().subscribe(result => {
      
    });
    

  }

  getState() {
    this._configurationalmasterService.getState().subscribe((res: any) => {
      this.allStateData = res.data
      

    })
  }
  // translate(key: keyof typeof ActionsComponent.prototype.translations['en']): string {
  //   const language = this.languageSubject.getValue();
  //   return this.translations[language][key] || key.toString();
  // }
  delete(e: any) {
    e.stopPropagation();
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
        this._configurationalmasterService.deleteSingleCity(this.cellValue).subscribe(
          (res) => {
            
            this.toaster.success('Deleted successfully ');
            this.reloadCurrentRoute();
          },
          (err) => {
            this.toaster.error("Somthing went wrong Please try agin", "Error Message")
            
          }
        )
      }
    });
  } 
}

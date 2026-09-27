import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Color, ICellRendererParams, Logger } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import Swal from 'sweetalert2';
import { NewPriceMasterDialogComponent } from '../new-price-master-dialog/new-price-master-dialog.component';


@Component({
  selector: 'app-new-price-master-action',
  templateUrl: './new-price-master-action.component.html',
  styleUrls: ['./new-price-master-action.component.scss']
})
export class NewPriceMasterActionComponent {
  Currency_Convert_id: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router:Router,
    private _configurationalmasterService:ConfigurationalmasterService,
    private toaster:ToastrService,
  ) {
    
  }

  ngOnInit(): void {
    // this.getCurrency();
  }
  public cellValue: any;
  allCurrencyData:any;

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.cellValue = this.getValueToDisplay(params);
    
    this.Currency_Convert_id = params.data.Currency_Convert_id
  }
  getValueToDisplay(params: ICellRendererParams) {
    

    return params.valueFormatted ? params.valueFormatted : params.data.Currency_Convert_id
  }
  refresh(params: ICellRendererParams): boolean {
    
    // wrirte code to modify cell 
    
  //  if(params){
  //   const new-price = this.allCurrencyData.find((e:any)=>e.Currency_Type.toUpperCase() === params.data.Currency_Type.trim().toUpperCase())
  //   

  //    const data:any = {
  //     Currency_Type:new-price.Currency_Type,
  //     rate:params.data.rate,
  //    };

  //    
  //   if(params.data.color === null && params.data.color !== ""){
  //     this.createCurrency(data);
  //   }else{
  //     const Currency_Convert_id:number = Number(params.data.Currency_Convert_id);
  //     
      
  //     this.updateSingleCurency(Currency_Convert_id, data);
  //   }
  //  }else{
  //   this.toaster.error('Something went wrong please try again','Error Message');
  //  }
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }
  
  // createCurrency(data:any){
  //   this._configurationalmasterService.CurrencyCreate(data).subscribe(
  //     (res:any)=>{
  //       
  //       this.toaster.success('City Created Successfully');
  //       this.reloadCurrentRoute();
  //     },(err:any)=>{
  //       
  //       this.toaster.error("city_name is All Ready Exits!");
  //     }
  //   )
  // };

  // updateSingleCurency(id:any, data:any){
  //   this._configurationalmasterService.CurrencyUpdate(id, data).subscribe(
  //     (res:any)=>{
  //       
  //       this.toaster.success('City Updated Successfully')
  //     },(err:any)=>{
  //       this.toaster.error("city_name is All Ready Exits!");
  //       
  //     });
  // };
  
  openDialog() {

    const dialogRef
      = this.dialog.open(NewPriceMasterDialogComponent, {
        width: '30%',
        // maxWidth: '100vw',
        // maxHeight: '100vh',
        // height: '100%',
        // panelClass: 'full-screen-modal',
        data: { id: this.Currency_Convert_id }
        
      });
      
    dialogRef.afterClosed().subscribe(result => {
      
    });
    
    
  }

  // getCurrency() {
  //   this._configurationalmasterService.CurrencyList().subscribe((res: any) => {
  //     this.allCurrencyData = res.data;
  //   })
  // }
}

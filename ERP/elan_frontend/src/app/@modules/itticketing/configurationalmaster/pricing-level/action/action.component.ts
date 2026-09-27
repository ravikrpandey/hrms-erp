import { Component } from '@angular/core';
import {
  ICellRendererParams,
} from 'ag-grid-community';
import 'ag-grid-enterprise';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { PricinglevelDialogComponent } from '../pricinglevel-dialog/pricinglevel-dialog.component';


@Component({
  selector: 'app-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {
  isChecked = false;
  paramsVal: any;
  achieveId: any;
  checkedActive: any;
  checkedInActive: any;
  levelSlab: any;
  checkBox: any;
  paramsData: any; 
  new_spa_id: any;
  traning_name_id: any;
  existingPriceData: any[] = [];
  id: any;
  priceMap: any;
  priceMappingData: any = [];
  price_mapping_id: any;
  levelSlabData: any = [];
  level_slab_id: any;
  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _configurationalMasterService: ConfigurationalmasterService,
    private toaster: ToastrService
  ) {

  }

  ngOnInit(): void {
   this.getAllPrice();
   this.getAllLevelSlab();
  }
  public cellValue: any;
  allCustomerTypeData: any;
  allCertificateTypeData: any = [];

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
      : params.data.pricing_level_id;
  }
  refresh(params: ICellRendererParams): boolean {
    //EDIT DATA FROM API    
    if (params) {
      this.paramsData = params;
      this.id = params.data.pricing_level_id;
      if (params.data.pricing_level_id === undefined) {
        this.createPriceLevel();
        
      } else {
        
        const pricing_level_id: number = Number(params.data.pricing_level_id);
        this.updatePriceLevel(pricing_level_id);
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

  createPriceLevel() {
     if (this.paramsData.data.price_mapping_name != null) {
        const pricem = this.priceMappingData.filter(
        (e: any) => {
          if (e.price_mapping_name === this.paramsData.data.price_mapping_name) {
            return e.price_mapping_id
          }
        }
      );
      this.price_mapping_id = pricem[0].price_mapping_id;      
    }
    if (this.paramsData.data.level_slab_name != null) {
       const levelS = this.levelSlabData.filter(
        (e: any) => {
          if (e.level_slab_name === this.paramsData.data.level_slab_name) {
            return e.level_slab_id
          }
        }
      );
      this.level_slab_id = levelS[0].level_slab_id;     
    }
 
   
    const data: any = {
      price_mapping_id: this.price_mapping_id,
      level_slab_id: this.level_slab_id,
      min_value: this.paramsData.data.min_value,
      max_value: this.paramsData.data.max_value 

    };   
    if ((this.paramsData.data.price_mapping_name != null) && (this.paramsData.data.level_slab_name != null)) {
      this._configurationalMasterService.create_price_level(data).subscribe(
        (res: any) => {
          this.toaster.success('Pricing level Created Succesfully!');
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

  }
  updatePriceLevel(id: any) {   
    if (this.paramsData.data.price_mapping_name != null) {
      const pricem = this.priceMappingData.filter(
      (e: any) => {
        if (e.price_mapping_name === this.paramsData.data.price_mapping_name) {
          return e.price_mapping_id
        }
      }
    );
    this.price_mapping_id = pricem[0].price_mapping_id;
    }
  if (this.paramsData.data.level_slab_name != null) {
     const levelS = this.levelSlabData.filter(
      (e: any) => {
        if (e.level_slab_name === this.paramsData.data.level_slab_name) {
          return e.level_slab_id
        }
      }
    );
    this.level_slab_id = levelS[0].level_slab_id;   
  }

  const data: any = {
    price_mapping_id: this.price_mapping_id,
    level_slab_id: this.level_slab_id,
    min_value: this.paramsData.data.min_value,
    max_value: this.paramsData.data.max_value 
  };
 
  if ((this.paramsData.data.price_mapping_name != null) && (this.paramsData.data.level_slab_name != null)) {
    this._configurationalMasterService.updatePriceLevel(id,data).subscribe(
      (res: any) => {
        this.toaster.success('Pricing level Updated Succesfully!');
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
  };

  toggle(e: any, isChecked: boolean) {
    e.stopPropagation();
    if (isChecked) {
      this.checkedActive = 'ACTIVE';
    } else {
      this.checkedActive = 'INACTIVE';
    }

    let body = {
      status: this.checkedActive,
      isChecked: isChecked,
    }
    if (this.checkBox === true) {
      this._configurationalMasterService.editPriceLevel(this.cellValue, body).subscribe((res: any) => {
        this.priceMap = res;
        this.toaster.success("Price Level successfully Inactivate")
      })
      this.reloadCurrentRoute();
    } else {
      this._configurationalMasterService.editPriceLevel(this.cellValue, body).subscribe((res: any) => {
        this.priceMap = res;
        this.toaster.success("Price Level successfully Activate")
      })
      this.reloadCurrentRoute();
    }

  }
  openDialog() {
    const dialogRef = this.dialog.open(PricinglevelDialogComponent, {
      width: '35%',
      data: { id: this.cellValue },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // 
    });
    // 
  }

  
  getAllPrice() {
    this._configurationalMasterService.getPriceMap().subscribe((response) => {
      this.priceMappingData = response.data;
      
    })
  }

  getAllLevelSlab() {
    this._configurationalMasterService.getLevelSlab().subscribe((response) => {
      this.levelSlabData = response.data;
      
    })
  } 

 
 


}


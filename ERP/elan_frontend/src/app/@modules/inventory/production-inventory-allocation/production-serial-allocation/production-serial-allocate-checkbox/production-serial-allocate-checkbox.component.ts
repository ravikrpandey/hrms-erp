import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-production-serial-allocate-checkbox',
  templateUrl: './production-serial-allocate-checkbox.component.html',
  styleUrls: ['./production-serial-allocate-checkbox.component.scss']
})
export class ProductionSerialAllocateCheckbox {

  assignAction:any;
  params: any;
  disabled : boolean;
  textValue : any;
  singleData: any;
      
    constructor(private route: Router,
      private activeRoute: ActivatedRoute,
    ) {
      this.activeRoute.queryParamMap.subscribe((param: any) => {
        if (param && param.params && param.params.rowInputData) {
          console.log(JSON.parse(param.params.rowInputData))
        }
      })
    }
  
    ngOnInit(): void {
      this.disabled = false;
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
      this.singleData = params.data;
      this.params = params;
    }
    getValueToDisplay(params: ICellRendererParams) {
      return 
    }
    getValueToDisplay2(params: ICellRendererParams) {
      return
    }
  
    refresh(params: ICellRendererParams): boolean {
      // set value into cell again
      
      this.cellValue = this.getValueToDisplay(params);
      return true;
    }
  
    edit(e: any) {
      e.stopPropagation();
    }

    checkboxClicked(event:any) {
      // this.params.onActionPerform(this.singleData)
    }
    set(event:any){

    }
}



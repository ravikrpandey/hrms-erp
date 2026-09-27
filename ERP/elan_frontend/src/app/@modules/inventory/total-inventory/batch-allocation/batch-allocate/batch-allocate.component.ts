import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { TotalInventoryService } from 'src/app/@shared/services/inventory/total-inventory.service';

@Component({
  selector: 'app-batch-allocate',
  templateUrl: './batch-allocate.component.html',
  styleUrls: ['./batch-allocate.component.scss']
})
export class BatchAllocateComponent {

  assignAction: any;
  params: any;
  disabled: boolean;
  textValue: any;
  singleData: any;
  inputValue: any;
  isLastField: boolean = false;
  selectionItem: any;

  constructor(private route: Router,
    private activeRoute: ActivatedRoute,
    private inventory_Service: TotalInventoryService,

  ) {
    // this.activeRoute.queryParamMap.subscribe((param: any) => {
    //   if (param && param.params && param.params.rowInputData) {
    //     console.log(JSON.parse(param.params.rowInputData))
    //   }
    // })
  }

  ngOnInit(): void {
    this.disabled = false;
    // 
    const lastSelectedBatch = this.inventory_Service.getLastSelectedBatch();
    this.isLastField = this.singleData === lastSelectedBatch;
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
    this.params = params;
    this.singleData = params.data;
    // 
    this.selectionItem = this.singleData.selection_item
    console.log(this.params, "these are the parms")
    this.params.onActionPerform(this.singleData, this.selectionItem)
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

  onTextChange(event: any) {
    // console.log(event.target.value,"this is the emitted event value");
    this.inputValue = event.target.value
    this.params.onActionPerform(this.singleData, this.inputValue)
  }

  keyPress(event: Event | any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}



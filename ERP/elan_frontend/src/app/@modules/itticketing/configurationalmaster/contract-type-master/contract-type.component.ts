import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CellValueChangedEvent, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { RbacMasterService } from 'src/app/@shared/services/rbac-master.service';
import { ContractTypeActionStatusComponent } from './contract-type-action/contract-type-action-status/contract-type-action-status.component';
import { ContractTypeActionComponent } from './contract-type-action/contract-type-action.component';
import { ContarctTypeDialogComponent } from './contract-type-dialog/contract-type-dialog.component';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ShortcutService } from 'src/app/@shared/services/shortcut.service';
import { FinaceService } from 'src/app/@shared/services/finace.service';

@Component({
  selector: 'app-contract-type',
  templateUrl: './contract-type.component.html',
  styleUrls: ['./contract-type.component.scss'],
})
export class ContractTypeComponent {
  errorMessage: any;
  id: any;
  countryss_id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  rowData: any;
  count: any = 0;
  assignAction: any;
  entity_id: any;
  financial_id:any;

  constructor(
    private _configurationalMasterService: ConfigurationalmasterService,
    private _rbackService: RbacMasterService,
    private _commonService : CommonService,
    public dialog: MatDialog, private route: Router, private activetRoute: ActivatedRoute,
    private toaster: ToastrService,
    private _finaceservice: FinaceService,
    private shortcutService: ShortcutService,
  ) {
    this.rowClass = 'rowClass';
  }

  ngOnInit(): void {
    let entity_id = localStorage.getItem('selectedEntityId');
    this.entity_id=Number(entity_id)
    console.log(this.entity_id,'this.entity_id');
    
   let financial_id = localStorage.getItem('financial_id');
   this.financial_id=Number(financial_id)
    this.assignAction = this._rbackService.accessAssignAction();
    this.getDepartment();

    this.activetRoute.queryParams.subscribe((params: any) => {
      this.id = params;
      

      this.countryss_id = this.id.countryss_id;
      
    });
    this.shortcutService.registerShortcut('a', () => {
      this.openDialog()
    });
    this.shortcutService.registerShortcut('c', () => {
      this.downloadCSV()
    });
  }

  public columnDefs = [
    {
      headerName: 'S.No.',
      valueGetter: "node.rowIndex + 1",
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      maxWidth:85,
    },
    {
      headerName: 'Contract Name',
      field: 'contract_type',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth:150,
    },

    {
      headerName: 'Status',
      field: 'status',
      cellRenderer: ContractTypeActionStatusComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false,
        someProperty: 'value',
      },
      cellClass: "grid-cell-centered",
      minWidth:150,
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 1,
      minWidth: 150,
      cellRenderer: ContractTypeActionComponent,
      cellRendererParams: {
        className: 'mat-blue',
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false, // Hide attachment icon
      },
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }


  getDepartment() {
    // let idEmp: any = localStorage.getItem('EmpMainId');
   
  
      // let lg: any = localStorage.getItem('signInUser');
      // let loginUser = JSON.parse(lg);
      // var empData: any = localStorage.getItem('signInUser');
      // const singleEmpData = JSON.parse(empData);
      // this.userDetails = JSON.parse(empData);
      // const data = {
      //   // user_id:idEmp,
      //   entity_id:Number(this.entity_id),
      //   financial_id: Number(this.financial_id)
      // }
    this._commonService?.showLoader()
    this._configurationalMasterService.get_Contract(this.entity_id,this.financial_id).subscribe((res: any) => {
      this.rowData = res.data;
      this._commonService?.hideLoader() 
    },
    ((err:any)=>{
      this._commonService?.hideLoader()
      this.rowData=[]
      // this.toaster.error(`${err.error?.message}`)
    })
    )
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }

  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }
  openDialog() {

    
this._finaceservice.getFinancialYearActiveMonthByEntityId(this.entity_id, this.financial_id).subscribe({
  next: (res: any) => {

    let newMonth = this._finaceservice.getCurrentMonth();
    let isExistData = res.data.some((x: any) => x.month === newMonth);
    if (!isExistData && res.code===200) {
      this.toaster.warning(res.message);
      return
    }
    if (!isExistData && res.code===201) {
      this.toaster.warning(res.message);
      return
    } 
    

    const dialogRef = this.dialog.open(ContarctTypeDialogComponent, {
      width: '35%',
      data: { mode: 'add' },
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }, error:(err)=> {
    console.log(err)
    this.toaster.warning(err.error.message);
      return
  },
})



    // const dialogRef = this.dialog.open(ContarctTypeDialogComponent, {
    //   // data: { id: this.queryParamss },

    //   width: '500px',
    // });

    // dialogRef.afterClosed().subscribe((result) => {});
  }

  downloadCSV() {
    this._commonService?.downloadCSV(this.rowData);
  }
  isShortcutVisible() {
    return this.shortcutService.isShortcutVisible();
  }
}
let rowIdSequence = 100;

function createDataItem(color: string) {
  const obj = {
    id: rowIdSequence++,
    color: color,
    value1: Math.floor(Math.random() * 100),
    value2: Math.floor(Math.random() * 100),
  };

  return obj;
}

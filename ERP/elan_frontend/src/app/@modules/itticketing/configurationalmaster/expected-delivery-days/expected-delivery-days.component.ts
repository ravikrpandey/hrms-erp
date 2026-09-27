import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from 'src/app/@shared/services/common.service';
import { ExpectedDeliveryDaysDialogComponent } from './expected-delivery-days-dialog/expected-delivery-days-dialog.component';
import { ConfigurationalmasterService } from 'src/app/@shared/services/configurationalmaster.service';
import { ExpectedDayStatusComponent } from './expected-day-status/expected-day-status.component';

@Component({
  selector: 'app-expected-delivery-days',
  templateUrl: './expected-delivery-days.component.html',
  styleUrls: ['./expected-delivery-days.component.scss']
})
export class ExpectedDeliveryDaysComponent {
  rowClass: any;
  private gridApi!: GridApi<any>;
  public gridOptions: any = { rowSelection: 'multiple', };
  // columnDefs: any;
  rowData:any;
  languageFlag: 'en' | 'pt' = 'en';
  entity_id: any;
  private languageSubject = new BehaviorSubject<'en' | 'pt'>('en');
  language$ = this.languageSubject.asObservable();
  translations = {
    en: {
      pageTitle: 'Financial Year Master',
      master: 'Financial',
      masterTable: 'Financial Year List',
      placeholder: 'Search',
      addButton: 'Add'
    },
    pt: {
      pageTitle: 'Mestre do exercício financeiro',
      master: 'Financeiro',
      masterTable: 'Lista do exercício financeiro',
      placeholder: 'Procurar',
      addButton: 'Adicionar',
    }
  };
  // entity_id: any;
  assignAction: any;
  id: any;
  countryss_id: any;
  xcount: any;
  
  financial_year_id:any;
  
  
  constructor(   
    private activetRoute: ActivatedRoute,
    public dialog: MatDialog, 
    private route: Router,        
    private toaster:ToastrService,
    private config:ConfigurationalmasterService
  ){
  }
  
  ngOnInit(): void {
    this.entity_id = localStorage.getItem('selectedEntityId');
    this.financial_year_id = localStorage.getItem('financial_id');;
    this.getExpectedDeliveryDayList();
  }

  getExpectedDeliveryDayList(){
    this.config.getExpectedDay().subscribe({
      next:(res)=> {
        this.rowData = res.data
      },error:(err)=> {
        this.toaster.error(err.error.message);
      },
    })
  }
  onFilterTextBoxChanged() {
    this.gridApi.setQuickFilter(
      (document.getElementById('filter-text-box') as HTMLInputElement).value
    );
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  onPageSizeChanged() {
    var value = (document.getElementById('page-size') as HTMLInputElement)
      .value;
    this.gridApi.paginationSetPageSize(Number(value));
  }

  

  openDialog() {
    const dialogRef = this.dialog.open(ExpectedDeliveryDaysDialogComponent, {

    
      width: '35%',
      data: { mode: 'add' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.getExpectedDeliveryDayList();
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
      minWidth: 150
    },
    {
      headerName: 'Expected Delivery Days',
      field: 'days',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      //editable: true,
    },
    
    {
      headerName: 'Status',
      field: 'status',
      sortable: true,
      resizable: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      cellClass: 'grid-cell-centered',
      flex: 1,
      minWidth: 150,
      cellRenderer: ExpectedDayStatusComponent
      
    },
    
  ];

  
}

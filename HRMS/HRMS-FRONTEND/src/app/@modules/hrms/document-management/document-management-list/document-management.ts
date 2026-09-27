import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { DocumentManagement as DocumentService } from 'src/app/@shared/services/document-management';
import { DocumentComponent } from '../document-action/document-action.component';

@Component({
  selector: 'app-document-management',
  standalone: false,
  templateUrl: './document-management.html',
  styleUrls: ['./document-management.scss'] 
})

export class DocumentManagement implements OnInit {

  templates: any[] = [];
  isLoading: boolean = false;
  errorMessage: any;
    id: any;
    rowClass: any;
    private gridApi!: GridApi<any>;
    rowData: any;
    add_Emp: any = 'Add_Emp'
    entity_id: any;
    financial_id: string | null;
  

  constructor(private docService: DocumentService, 
     private route: Router,) {this.rowClass = 'rowClass';}

  ngOnInit(): void {
    this.loadTemplates();
  }

  loadTemplates() {
    this.isLoading = true;
    this.docService.listDocumentManagement().subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          this.templates = res;
          this.rowData = res;
        } else if (res && Array.isArray(res.data)) {
          this.templates = res.data;
          this.rowData = res.data;
        } else {
          this.templates = [];
          this.rowData = []
        }
      },
      error: (err: any) => {
        console.error('Failed to load templates', err);
        this.templates = [];
      },
      complete: () => { this.isLoading = false; }
    });
  }


    public columnDefs = [
      {
        headerName: 'S.NO',
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
        headerName: 'Template Name',
        field: 'template_name',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: 'Created Timestamp',
        field: 'createdAt',
        sortable: true,
        resizable: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        cellClass: 'grid-cell-centered',
        flex: 1,
        minWidth: 150,
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
      },
      // {
      //   headerName: 'Status',
      //   field: 'status',
      //   cellRenderer: KpaStatusComponent,
      //   sortable: true,
      //   resizable: true,
      //   wrapHeaderText: true,
      //   autoHeaderHeight: true,
      //   cellClass: 'grid-cell-centered',
      //   flex: 1,
      //   minWidth: 150,
      //   // editable:true
      // },
      {
        headerName: 'Action',
        field: 'id',
        flex: 1,
        minWidth: 150,
        cellRenderer: DocumentComponent,
        cellRendererParams: {
          className: 'mat-blue',
          hideRequestButton: true,
          hideDetailsButton: false,
          hideDownloadIcon: false,
          showCustomIcon: false, // Hide attachment icon
        },
      },
    ];
    
    downloadCSV() {
      const cleanedData = this.rowData.map((item: any) => {
        const { id, status, ...cleanedItem } = item;
  
        const stripHtmlTags = (str: string) => str.replace(/<\/?[^>]+(>|$)/g, "");
  
        Object.keys(cleanedItem).forEach((key) => {
          if (typeof cleanedItem[key] === "string") {
            cleanedItem[key] = stripHtmlTags(cleanedItem[key]);
          }
        });
        return cleanedItem;
      });
      console.log("Cleaned Data with Financial Year and Entity Name:", cleanedData);
    }
  
  
  
  
    onGridReady(params: GridReadyEvent) {
      this.gridApi = params.api;
    }
  
    onPageSizeChanged() {
      var value = (document.getElementById('page-size') as HTMLInputElement)
        .value;
      this.gridApi.paginationSetPageSize(Number(value));
    }
    onFilterTextBoxChanged() {
      this.gridApi.setQuickFilter(
        (document.getElementById('filter-text-box') as HTMLInputElement).value
      );
    }
  
    // reloadCurrentRoute() {
    //   let currentUrl = this.route.url;
    //   this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //     this.route.navigate([currentUrl]);
    //   });
    // }
  
    openDialog() {
      this.route.navigate(['/master/hrms/document-management/add-template'])
    }


}

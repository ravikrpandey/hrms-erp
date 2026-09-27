import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { DocumentManagement as DocumentService } from 'src/app/@shared/services/document-management';
import { DocumentComponent } from '../../hrms/document-management/document-action/document-action.component';

@Component({
  selector: 'app-my-documents',
  templateUrl: './my-documents.html',
  styleUrls: ['./my-documents.scss']
})
export class MyDocuments {
  templates: any[] = [];
  isLoading: boolean = false;
  errorMessage: any;
  id: any;
  rowClass: any;
  private gridApi!: GridApi<any>;
  rowData: any;
  add_Emp: any = 'Add_Emp'
  employee_id: string | null = localStorage.getItem('EmpMainId');
  entity_id = localStorage.getItem('selectedEntityId');
  financial_id = localStorage.getItem('financial_id');
  gridOptions: any;

  constructor(private docService: DocumentService,
    private route: Router,) {
    this.rowClass = 'rowClass';
    this.gridOptions = {
      context: { componentParent: this },
      defaultColDef: {
        flex: 1,
        resizable: true,
        sortable: true,
        filter: true
      }
    };

  }

  ngOnInit(): void {
    this.loadUsersAssignedTemplates();
  }

  loadUsersAssignedTemplates() {
    this.isLoading = true;
    this.docService.getTemplatesAssignedRecord(this.employee_id, this.entity_id, this.financial_id).subscribe({
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
    {
      headerName: 'Action',
      field: 'id',
      minWidth: 200,
      cellRenderer: (params: any) => `
          <button class="btn btn-sm btn-outline-info" data-action="preview">Preview</button>
          <button class="btn btn-sm btn-outline-success mx-1" data-action="download">Download</button>
        `,
      onCellClicked: (params: any) => {
        const action = params.event?.target?.getAttribute('data-action');
        const parent = params.context?.componentParent;

        if (!parent) {
          console.error('componentParent missing in grid context');
          return;
        }

        if (action === 'preview') parent.previewTemplate(params.data);
        else if (action === 'download') parent.downloadTemplate(params.data);
      }
    }
  ];

  downloadTemplate(data: any) {
    if (!data?.filled_html) return;
    try {
      const parsed = typeof data.filled_html === 'string'
        ? JSON.parse(data.filled_html)
        : data.filled_html;
      const htmlContent = parsed?.html || '';
      const decoded = this.decodeHtml(htmlContent);
      const fullHtml = decoded.includes('<html') ? decoded : `<!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document Template</title>
      </head>
      <body>
      ${decoded}
      </body>
      </html>`;
      const element = document.createElement('a');
      const file = new Blob([fullHtml], { type: 'text/html' });
      element.href = URL.createObjectURL(file);
      element.download = `${(data?.employee_name + '_' + data?.template_name) || 'document'}.html`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

    } catch (error) {
      console.error('Invalid JSON in filled_html:', error);
    }
  }



  decodeHtml(html: string): string {
    if (!html) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    let decoded = txt.value;

    decoded = decoded
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ');

    decoded = decoded
      .replace(/<p>\s*<\/p>/g, '')
      .replace(/<br\s*\/?>/g, '')
      .replace(/\n\s*\n/g, '\n');

    decoded = decoded.trim();

    return decoded;
  }


  previewTemplate(row: any) {
    if (!row?.filled_html) return;
    try {
      const parsed = typeof row.filled_html === 'string'
        ? JSON.parse(row.filled_html)
        : row.filled_html;

      const htmlContent = parsed?.html || '';
      const decoded = this.decodeHtml(htmlContent);
      const fullHtml = decoded.includes('<html') ? decoded : `<!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document Template</title>
      </head>
      <body>
      ${decoded}
      </body>
      </html>`;

      const newWindow = window.open('', `${row?.template_name || 'Template Preview'}`);
      if (!newWindow) return;
      newWindow.document.open();
      newWindow.document.write(fullHtml);
      newWindow.document.close();
    } catch (error) {
      console.error('Invalid JSON in filled_html:', error);
    }
  }


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


  openDialog() {
    this.route.navigate(['/master/hrms/document-management/add-template'])
  }

}

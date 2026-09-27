import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GridApi, GridReadyEvent } from 'ag-grid-community';
import { DocumentManagement as DocumentService } from 'src/app/@shared/services/document-management';
import { DocumentComponent } from '../document-action/document-action.component';
import { ToastrService } from 'ngx-toastr';

interface PreviewUser {
  user_id: number;
  user_name: string;
  email: string;
  checked?: boolean;
  filled_html?: string;
  template_name?: string;
}

@Component({
  selector: 'app-send-download-document',
  templateUrl: './send-download-document.html',
  styleUrls: ['./send-download-document.scss'],
})
export class SendDownloadDocument implements OnInit {
  templates: any[] = [];
  templateList: any[] = [];
  userList: any[] = [];
  previewList: any[] = [];
  missingUsers: any[] = [];
  placeholders: string[] = [];
  selectedTemplate: any = '';
  selectedTemplateName: string = '';
  selectedTemplateHtml: string = '';
  selectedUsers: any[] = [];
  manualUsers: any[] = [];
  headerInputs: { [key: string]: any } = {};
  decodedHtml: string = '';
  entity_id = localStorage.getItem('selectedEntityId');
  financial_id = localStorage.getItem('financial_id');
  isLoading = false;
  errorMessage = '';
  rowData: any[] = [];
  isExistignUser = true;

  previewData: { templateName: string; previewList?: PreviewUser[];[key: string]: any } | null = null;

  private gridApi!: GridApi<any>;



  constructor(
    private docService: DocumentService,
    private router: Router,
    private toaster: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loadTemplates();
    this.loadUsers();
  }

  loadTemplates() {
    this.isLoading = true;
    this.docService.listDocumentManagement().subscribe({
      next: (res: any) => {
        const data = Array.isArray(res) ? res : res?.data || [];
        this.templateList = data;
        this.rowData = data;
        this.manualUsers = [
          this.placeholders.reduce((acc, key) => ({ ...acc, [key]: '' }), {})
        ];
      },
      error: (err: any) => {
        console.error('Failed to load templates', err);
        this.templateList = [];
      },
      complete: () => { this.isLoading = false; }
    });
  }

  loadUsers() {
    this.docService.listAllUsers().subscribe({
      next: (res: any) => {
        this.userList = res?.data || res || [];
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.userList = [];
      }
    });
  }

  public columnDefs = [
    {
      headerName: 'S.NO',
      valueGetter: 'node.rowIndex + 1',
      flex: 1,
      minWidth: 100,
      cellClass: 'grid-cell-centered'
    },
    {
      headerName: 'Template Name',
      field: 'template_name',
      flex: 2,
      minWidth: 200,
      cellClass: 'grid-cell-centered'
    },
    {
      headerName: 'Created Timestamp',
      field: 'createdAt',
      flex: 2,
      minWidth: 180,
      cellClass: 'grid-cell-centered'
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 1,
      minWidth: 150,
      cellClass: 'grid-cell-centered'
    },
    {
      headerName: 'Action',
      field: 'id',
      flex: 2,
      minWidth: 200,
      cellRenderer: DocumentComponent,
      cellRendererParams: {
        hideRequestButton: true,
        hideDetailsButton: false,
        hideDownloadIcon: false,
        showCustomIcon: false
      },
    },
  ];

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  openDialog() {
    this.router.navigate(['/master/hrms/document-management/add-template']);
  }

  onTemplateChange() {
    const tpl = this.templateList.find(t => t.id === this.selectedTemplate);
    this.selectedTemplateName = tpl?.template_name || '';
    this.selectedTemplateHtml = tpl?.template_html || '';
    this.placeholders = [];
    this.previewList = [];
    this.missingUsers = [];
  }

  generatePreview() {
    if (this.isExistignUser) {
      if (!this.selectedTemplate || !this.selectedUsers?.length) {
        this.toaster.info('Please select a template and at least one user.');
        return;
      }
    } else if (this.isExistignUser == false && !this.selectedTemplate) {
      this.toaster.info('Please select a template');
      return;
    }

    if (this.isExistignUser == false) {
      this.extractPlaceHolders(this.selectedTemplateHtml);
      this.previewList = this.manualUsers || [];

      if (this.selectedUsers?.length) {
        this.manualUsers = this.selectedUsers.map(u => ({
          user_id: u,
          name: u.name,
          email: u.email,
          missingFields: {}
        }));
      }

      return;
    }

    const payload = {
      templateId: this.selectedTemplate,
      userIds: this.selectedUsers,
      manualUsers: this.missingUsers,
      entity_id: this.entity_id
    };

    this.isLoading = true;
    this.docService.generateTemplatePreview(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.previewData = res?.data || {};
        this.previewList = this.previewData?.previewList || [];
        this.placeholders = this.previewData?.['placeholders'] || [];
        if (this.placeholders.length && !this.missingUsers.length) {
          // this.missingUsers.push({});
          if (this.selectedUsers?.length) {
            this.manualUsers = this.selectedUsers.map(u => ({
              user_id: u,
              name: u.name,
              email: u.email,
              missingFields: {}
            }));
          }

        }
      },
      error: (err) => {
        console.error('Error generating preview', err);
        this.isLoading = false;
        this.previewList = [];
      }
    });
  }

  extractPlaceHolders(template: any) {
    let decodedHtml = template
    let placeholderMatches =
      decodedHtml.match(/\$\{(.*?)\}|{{(.*?)}}|{(.*?)}/g) || [];
    const placeholders = placeholderMatches.map((ph: any) =>
      ph.replace(/\$\{|\{|}+/g, '').trim());
    this.placeholders = placeholders;
    return placeholders;
  }

  hasSelectedPreview(): boolean {
    return Array.isArray(this.previewList) && this.previewList.some(row => row.checked);
  }

  addManualUserRow() {
    this.missingUsers.push({});
  }

  previewTemplate(row: any, index: number) {
    const filledResults = this.generateTemplatesForAll(this.selectedTemplateHtml);
    if (filledResults && filledResults.length) {
      const firstFilled = filledResults[index].filled_html;
      const decoded = this.decodeHtml(firstFilled);

      const newWindow = window.open('', `${this.selectedTemplateName} Preview`);
      if (newWindow) {
        newWindow.document.open();
        newWindow.document.write(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${this.selectedTemplateName} Preview</title>
    <style>
      body {
        background: #f4f6f8;
        margin: 0;
        padding: 30px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #2c3e50;
      }
      .container {
        max-width: 850px;
        margin: auto;
        background: #ffffff;
        padding: 40px 35px;
        border-radius: 12px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        line-height: 1.6;
      }
      h1, h2, h3, h4, h5 {
        color: #2c3e50;
        margin-top: 18px;
        margin-bottom: 10px;
      }
      p {
        margin: 10px 0;
      }
      ul, ol {
        padding-left: 22px;
        margin: 10px 0;
      }
      strong {
        color: #2c3e50;
      }
      hr {
        border: none;
        border-top: 1px solid #e5e8ec;
        margin: 24px 0;
      }
      .footer-note {
        font-size: 12px;
        color: #6c757d;
        margin-top: 25px;
        text-align: left;
      }
    </style>
  </head>
  <body>
    <div class="container">
      ${decoded}
    </div>
  </body>
  </html>
        `);
        newWindow.document.close();
      }
    } else {
      console.warn('No filled results available for preview');
    }
  }

  get isSendDisabled(): boolean {
    return !this.previewList.length || !this.previewList.some(u => u.checked);
  }

  get isAllSelected(): boolean {
    return this.previewList.length > 0 && this.previewList.every(u => u.checked);
  }

  loadPreviewList(users: PreviewUser[], templateName: string) {
    this.previewList = users.map(u => ({ ...u, checked: false }));
    this.previewData = { templateName };
  }

  toggleAllSelection(event: Event) {
    const input = event.target as HTMLInputElement;
    const checked = input?.checked ?? false;
    this.previewList.forEach(u => u.checked = checked);
  }


  sendMailToSelected(action: 'mail' | 'assign') {
    const selectedUsers = this.previewList.filter(u => u.checked);
    if (!selectedUsers.length) return;
    const usersWithHtml = selectedUsers.map((u, index) => {
      const filledResults = this.generateTemplatesForAll(u?.filled_html || this.selectedTemplateHtml);
      const firstFilled = filledResults[index].filled_html;
      const decoded = this.decodeHtml(firstFilled || '');
      const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${this.selectedTemplateName} - ${u.user_name}</title>
        <style>
          body {
            background: #f4f6f8;
            margin: 0;
            padding: 30px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #2c3e50;
          }
          .container {
            max-width: 850px;
            margin: auto;
            background: #ffffff;
            padding: 40px 35px;
            border-radius: 12px;
            box-shadow: 0 6px 18px rgba(0,0,0,0.08);
            line-height: 1.6;
          }
          h1, h2, h3, h4, h5 {
            color: #2c3e50;
            margin-top: 18px;
            margin-bottom: 10px;
          }
          p {
            margin: 10px 0;
          }
          ul, ol {
            padding-left: 22px;
            margin: 10px 0;
          }
          strong {
            color: #2c3e50;
          }
          hr {
            border: none;
            border-top: 1px solid #e5e8ec;
            margin: 24px 0;
          }
          .footer-note {
            font-size: 12px;
            color: #6c757d;
            margin-top: 25px;
            text-align: left;
          }
        </style>
      </head>
      <body>
        <div class="container">
          ${decoded}
        </div>
      </body>
      </html>
    `;
      return {
        ...u,
        entity_id: this.entity_id,
        financial_id: this.financial_id,
        action,
        subject: `${this.selectedTemplateName} - ${u?.name || u?.user_name || ''}`,
        template_id: this.selectedTemplate,
        fullHtml
      };
    });

    this.docService.sendTemplateMail(usersWithHtml).subscribe({
      next: () => {
        if (action === 'mail') {
          this.toaster.success(
            `Mail sent to ${selectedUsers.map(u => u.email).join(', ')}`
          );
        } else {
          this.toaster.success(
            `Document assigned to ${selectedUsers.map(u => u.email).join(', ')}`
          );
        }
      },
      error: (err) => {
        console.error('Mail send failed', err);
        this.toaster.error('Failed to send mail. Please try again.');
      }
    });

  }


  generateTemplatesForAll(htmlContent: string) {
    if (!htmlContent) {
      console.error('Template HTML missing');
      return [];
    }

    const filledResults = this.manualUsers.map(u => {
      let filledHtml = htmlContent;

      this.placeholders.forEach(field => {
        const regex = new RegExp(`(\\$\\{${field}\\}|{{${field}}}|{${field}})`, 'g');
        const value =
          (u.missingFields && u.missingFields[field]) ||
          u[field] || // fallback to user's own data like name/email
          '';

        filledHtml = filledHtml.replace(regex, value);
      });

      return {
        user_id: u.user_id,
        name: u?.name || u.user_name,
        email: u.email,
        filled_html: filledHtml,
      };
    });

    console.log('Generated Templates:', filledResults);
    return filledResults;
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

  downloadTemplate(user: PreviewUser, index: number) {
    if (!user?.filled_html && !this.selectedTemplateHtml) return;
    const filledResults = this.generateTemplatesForAll(this.selectedTemplateHtml);
    const decoded = this.decodeHtml(filledResults[index].filled_html || '');
    const fullHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${this.selectedTemplateName} - ${user?.user_name}</title>
    <style>
      body {
        background: #f4f6f8;
        margin: 0;
        padding: 30px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        color: #2c3e50;
      }
      .container {
        max-width: 850px;
        margin: auto;
        background: #ffffff;
        padding: 40px 35px;
        border-radius: 12px;
        box-shadow: 0 6px 18px rgba(0,0,0,0.08);
        line-height: 1.6;
      }
      h1, h2, h3, h4, h5 {
        color: #2c3e50;
        margin-top: 18px;
        margin-bottom: 10px;
      }
      p {
        margin: 10px 0;
      }
      ul, ol {
        padding-left: 22px;
        margin: 10px 0;
      }
      strong {
        color: #2c3e50;
      }
      hr {
        border: none;
        border-top: 1px solid #e5e8ec;
        margin: 24px 0;
      }
      .footer-note {
        font-size: 12px;
        color: #6c757d;
        margin-top: 25px;
        text-align: left;
      }
    </style>
  </head>
  <body>
    <div class="container">
      ${decoded}
    </div>
  </body>
  </html>
  `;
    const element = document.createElement('a');
    const file = new Blob([fullHtml], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${user.user_name}_offer_letter.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }


  onHeaderInputChange(field: string, value: string): void {
    if (!this.headerInputs) {
      this.headerInputs = {};
    }
    this.headerInputs[field] = value;
  }

  extractPlaceholders(decodedHtml: string, users: any[]) {
    this.decodedHtml = decodedHtml;
    const regex = /\$\{(.*?)\}|{{(.*?)}}|{(.*?)}/g;
    const matches = decodedHtml.match(regex) || [];
    this.placeholders = matches.map(ph => ph.replace(/\$\{|\{|}+/g, '').trim());

    this.selectedUsers = users;
    this.manualUsers = this.selectedUsers.map(u => ({
      user_id: u.id,
      name: u.name,
      email: u.email,
      missingFields: this.placeholders.reduce(
        (acc, key) => ({ ...acc, [key]: u[key] || '' }),
        {}
      ),
    }));
  }

  updateMissingField(user: any, field: string, value: any) {
    if (!user.missingFields) {
      user.missingFields = {};
    }
    user.missingFields[field] = value;
  }

  addManualUser() {
    this.manualUsers.push({
      name: '',
      email: '',
      missingFields: this.placeholders.reduce((acc, key) => ({ ...acc, [key]: '' }), {})
    });
  }

  removeManualUser(index: number) {
    this.manualUsers.splice(index, 1);
  }

}

import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';
import { ICellRendererParams } from 'ag-grid-community';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { DocumentManagement as DocumentService } from 'src/app/@shared/services/document-management';

@Component({
  selector: 'app-document-action',
  templateUrl: './document-action.component.html',
  styleUrls: ['./document-action.component.scss'],
})
export class DocumentComponent {
  paramsVal: any;
  assignAction: any;
  editDataParams: any = 'edit'
  viewDataParams: any = 'view'
  deleteDataParams: any = 'delete'
  public cellValue: any;
  rowData: any;
  actionType: any;

  constructor(
    private route: Router,
    public dialog: MatDialog,
    private router: Router,
    private _hrmMasterService: HrmServiceService,
    private docService: DocumentService
  ) {
  }
  ngOnInit(): void {
    this.assignAction = this._hrmMasterService.accessAssignAction();
    console.log("assignAction", this.assignAction);
    // this.assignAction = { Read: true, Write: true }; 
  }

  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  agInit(params: ICellRendererParams): void {
    this.paramsVal = params.data.id;
    this.cellValue = this.getValueToDisplay(params);
  }

  getValueToDisplay(params: ICellRendererParams) {
    return params.valueFormatted
      ? params.valueFormatted
      : params.data.emptype_id;
  }

  refresh(params: ICellRendererParams): boolean {
    this.cellValue = this.getValueToDisplay(params);
    return true;
  }

  openDialog() {
    this.router.navigate(['/master/hrms/document-management/add-template'], { queryParams: { id: this.paramsVal, type: this.viewDataParams } });
  }

  editData() {
    this.router.navigate(['/master/hrms/document-management/add-template'], { queryParams: { id: this.paramsVal, type: this.editDataParams } });
  }

  deleteData() {
    this.router.navigate(['/master/hrms/document-management/add-template'], { queryParams: { id: this.paramsVal, type: this.deleteDataParams } });
  }








  //  refresh(params: ICellRendererParams): boolean {
  //   this.cellValue = params.data.template_name || '';
  //   return true;
  // }

  /** Preview template in modal */
  previewTemplate() {
    Swal.fire({
      title: 'Template Preview',
      html: this.rowData?.filled_html || '<p>No data</p>',
      width: '800px',
      showCloseButton: true
    });
  }

  /** Download template as PDF */
  async downloadTemplate() {
    if (!this.rowData?.filled_html) return;

    const container = document.createElement('div');
    container.innerHTML = this.rowData.filled_html;
    document.body.appendChild(container);

    const canvas = await html2canvas(container, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${this.cellValue}_Template.pdf`);

    document.body.removeChild(container);
  }

  /** Send filled template via email */
  sendMail() {
    if (!this.rowData?.filled_html || !this.rowData?.email) {
      Swal.fire('Error', 'No filled HTML or email found', 'error');
      return;
    }

    this.docService.sendTemplateMail({
      userId: this.rowData.userId,
      email: this.rowData.email,
      templateName: this.cellValue,
      filled_html: this.rowData.filled_html
    }).subscribe({
      next: () => Swal.fire('Success', 'Email sent successfully', 'success'),
      error: (err) => Swal.fire('Error', `Failed to send email: ${err.message}`, 'error')
    });
  }

}

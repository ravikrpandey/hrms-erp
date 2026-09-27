import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { DocumentManagement } from 'src/app/@shared/services/document-management';

@Component({
  selector: 'app-add-template',
  templateUrl: './add-template.html',
  styleUrls: ['./add-template.scss']
})
export class AddTemplate {
  openDialog() {
    throw new Error('Method not implemented.');
  }

  public Editor = ClassicEditor;
  htmlContent: string = '';
  templateName: string = '';
  showPreview: boolean = false;
  private originalHtmlContent: string = '';
  isSubmitting: boolean = false;
  entity_id = localStorage.getItem('selectedEntityId');
  financial_id = localStorage.getItem('financial_id');
  templateNameTouched: boolean = false;
  editMode: boolean = false;
  editTemplateId: number | null = null;
  actionType: any;
  disableField: boolean = false;

  constructor(
    private hrmsDocumentService: DocumentManagement,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    debugger;
    this.route.queryParams.subscribe((params: any) => {
      this.actionType = params?.type;
      if (this.actionType =='delete') {
        this.editTemplateId = params['id'];
        this.deleteTemplate();
        return;
      }
      if (this.actionType == 'edit') {
        this.editTemplateId = params['id'];
        this.hrmsDocumentService.getDocumentManagementById(this.editTemplateId).subscribe(data => {
          this.templateName = data.template_name;
          this.htmlContent = data.template_html;
          this.originalHtmlContent = data.template_html;
        });
        this.disableField = false;
        this.editMode = true;
      } else if (this.actionType == 'view') {
        this.editMode = false;
        this.editTemplateId = params['id'];
        this.hrmsDocumentService.getDocumentManagementById(this.editTemplateId).subscribe(data => {
          this.templateName = data.template_name;
          this.htmlContent = data.template_html;
          this.originalHtmlContent = data.template_html;

          this.disableField = true;
          this.disableForm();
          this.previewHtml()
        });

      } else {
        this.disableField = false;
        this.editMode = false;
        this.editTemplateId = null;
      }
    });

  }

  disableForm = () => {
    this.templateNameTouched = true;
    this.templateName = this.templateName; this.htmlContent = this.htmlContent;
  };

  previewHtml() {
    this.originalHtmlContent = this.htmlContent;
    const div = document.createElement('div');
     div.innerHTML = this.htmlContent; this.htmlContent = div.textContent || div.innerText || ''; this.showPreview = true;
  }

  editAgain() {
    this.htmlContent = this.originalHtmlContent; this.showPreview = false;
  }

  saveTemplate() {
    if (!this.templateName || this.templateName.trim().length === 0) {
      this.toaster.error('Please enter a template name.');
      return;
    }
    if (!this.htmlContent || this.htmlContent.trim().length === 0) {
      this.toaster.error('Template content cannot be empty.');
      return;
    }
    this.isSubmitting = true;
    const payload = {
      template_name: this.templateName.trim(),
      template_html: this.htmlContent,
      entity_id: this.entity_id,
      financial_year_id: this.financial_id,
      editTemplateId: this.editTemplateId
    };

    if (this.editMode && this.editTemplateId) {
      this.hrmsDocumentService.createOrUpdateDocumentManagement(payload).subscribe({
        next: (response: any) => {
          this.toaster.success(response.message || 'Template updated successfully!');
          this.templateName = '';
          this.htmlContent = '';
          this.originalHtmlContent = '';
          this.showPreview = false;
          this.editMode = false;
          this.editTemplateId = null;
          this.router.navigate(['/master/hrms/document-management']);
        },
        error: (error: any) => {
          this.toaster.error(error?.error?.message || 'Something went wrong!');
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.hrmsDocumentService.createOrUpdateDocumentManagement(payload).subscribe({
        next: (response: any) => {
          this.toaster.success(response.message || 'Template saved successfully!');
          this.templateName = '';
          this.htmlContent = '';
          this.originalHtmlContent = '';
          this.showPreview = false;
          this.router.navigate(['/master/hrms/document-management']);
        },
        error: (error: any) => {
          this.toaster.error(error?.error?.message || 'Something went wrong!');
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  deleteTemplate() {
      if (confirm('Are you sure you want to delete this template?')) {
        this.hrmsDocumentService.deleteDocumentManagementById(this.editTemplateId).subscribe({
          next: (response: any) => {
            this.toaster.success(response.message || 'Template deleted successfully!');
            this.templateName = '';
            this.htmlContent = '';
            this.originalHtmlContent = '';
            this.showPreview = false;
            this.editMode = false;
            this.editTemplateId = null;
            this.router.navigate(['/master/hrms/document-management']);
          },
          error: (error: any) => {
            this.toaster.error(error?.error?.message || 'Something went wrong!');
          },
          complete: () => {
            this.isSubmitting = false;
          }
        });
    }
  }

}

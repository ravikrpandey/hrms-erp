import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DocumentManagementDialog } from './document-management-dialog/document-management-dialog';
import { DocManagSystemServices } from '../doc-manag-system-services';
import { EmpRegistrationService } from 'src/app/@shared/services/emp-registration.service';
import { HrmServiceService } from 'src/app/@shared/services/service/hrmServices/hrm-service.service';

interface FileItem {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
  type: string;
  uploadedAt: string;
  path?: string;
}

// ✅ Update interface to include employee object
interface DocumentItem {
  id: string;
  title: string;
  fileType: string;
  uploadedDate: string;
  uploaded_by: string;
  employee_id?: string | null;
  employee?: any; // ✅ Add this
  expires?: string | null;
  tags: string[];
  size: string;
  fileIcon?: string;
  files?: FileItem[];
  document_category?: string;
  version?: string;
}

@Component({
  selector: 'app-document-management',
  templateUrl: './document-management.html',
  styleUrls: ['./document-management.scss'],
})
export class DocumentManagement implements OnInit {
  employeeList: any[] = [];
  allRoleMaster: any[] = [];
  selectedSummaryTitle: string = 'All Documents';
  mainId: string | null = null;
  loginUser: any = null;
  assignDesignationArr1: any[] = [];
  assignDesignationArr2: any[] = [];
  summary: any[] = [];
  entity_id: string | null = null;
  searchControl = new FormControl('');
  categoryControl = new FormControl('All Categories');
  statusControl = new FormControl('All Status');

  categories = ['All Categories', 'Employee-related', 'Company Policies', 'Compliance Documents', 'Training & Performance'];
  statuses = ['All Status', 'active', 'expired', 'expiring'];

  documents: DocumentItem[] = [];
  filteredDocuments: DocumentItem[] = [];
  moduleTitle: any;
  id: any;

  // Properties for employee/designation filtering
  showDetails: boolean = false;
  selectedEmployee: any = null;
  selectedDesignation: any = null;
  employeeDocuments: DocumentItem[] = [];
  designationDocuments: DocumentItem[] = [];

  constructor(
    public dialog: MatDialog,
    private route: Router,
    private activetRoute: ActivatedRoute,
    private _empRegistration: EmpRegistrationService,
    private _hrmkpaService: HrmServiceService,
    private _docmanagsystemservices: DocManagSystemServices,
    private toaster: ToastrService,
  ) { }

  ngOnInit(): void {
    this.mainId = localStorage.getItem('EmpMainId');
    this.entity_id = localStorage.getItem('selectedEntityId');
    let a: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(a);
    this.id = this.loginUser?.employee_id;

    this.fetchSummaryData();
    this.loadDocuments();
    this.getAllRoleMaster();
    this.getAllEmployees();

    this.searchControl.valueChanges.subscribe(() => this.applyFilters());
    this.categoryControl.valueChanges.subscribe(() => this.applyFilters());
    this.statusControl.valueChanges.subscribe(() => this.applyFilters());
  }

  fetchSummaryData() {
    if (!this.entity_id || this.entity_id === 'null' || this.entity_id === 'undefined') {
      this.entity_id = null;
    }

    this._docmanagsystemservices.getAlldocuments(this.entity_id).subscribe((res: any) => {
      if (res.code === 200) {
        const docs = res.data;

        const totalDocuments = docs.length;
        const employeeDocs = docs.filter((d: any) => d.document_category?.toLowerCase().includes('employee')).length;
        const policies = docs.filter((d: any) => d.document_category?.toLowerCase().includes('policies')).length;
        const compliance = docs.filter((d: any) => d.document_category?.toLowerCase().includes('compliance')).length;
        const training = docs.filter((d: any) => d.document_category?.toLowerCase().includes('training')).length;
        const expiringSoon = docs.filter((d: any) => {
          if (!d.uploaded_date) return false;
          const uploadDate = new Date(d.uploaded_date);
          const today = new Date();
          const diffInDays = (today.getTime() - uploadDate.getTime()) / (1000 * 3600 * 24);
          return diffInDays <= 30;
        }).length;

        this.summary = [
          { title: 'Total Documents', count: totalDocuments, icon: 'insert_drive_file' },
          { title: 'Employee Docs', count: employeeDocs, icon: 'people' },
          { title: 'Policies', count: policies, icon: 'shield' },
          { title: 'Compliance', count: compliance, icon: 'gavel' },
          { title: 'Training', count: training, icon: 'menu_book' },
          { title: 'Expiring Soon', count: expiringSoon, icon: 'schedule' },
        ];
      }
    });
  }

  applyFilters() {
    const q = (this.searchControl.value || '').toLowerCase().trim();
    const category = this.categoryControl.value;
    const status = this.statusControl.value;

    this.filteredDocuments = this.documents.filter(doc => {
      const matchesSearch = q
        ? (doc.title + ' ' + doc.fileType + ' ' + doc.tags.join(' ')).toLowerCase().includes(q)
        : true;

      const matchesCategory =
        !category || category === 'All Categories'
          ? true
          : doc.document_category === category;

      const matchesStatus =
        !status || status === 'All Status'
          ? true
          : (doc.tags || []).some(t => t.toLowerCase() === status.toLowerCase());

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }


  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  getCategoryTag(category: string): string {
    const categoryMap: { [key: string]: string } = {
      'Employee-related': 'employee',
      'Company Policies': 'policy',
      'Compliance Documents': 'compliance',
      'Training & Performance': 'training'
    };
    return categoryMap[category] || category?.toLowerCase() || '';
  }

  getDocumentStatus(uploadedDate: string): string {
    if (!uploadedDate) return 'active';
    const uploadDate = new Date(uploadedDate);
    const today = new Date();
    const diffInDays = (today.getTime() - uploadDate.getTime()) / (1000 * 3600 * 24);

    if (diffInDays > 365) return 'expired';
    if (diffInDays > 335) return 'expiring';
    return 'active';
  }

  getExpiryDate(uploadedDate: string, category: string): string | null {
    if (category === 'Compliance Documents' || category === 'Training & Performance') {
      const uploadDate = new Date(uploadedDate);
      uploadDate.setFullYear(uploadDate.getFullYear() + 1);
      return uploadDate.toISOString().split('T')[0];
    }
    return null;
  }

  onView(doc: DocumentItem) {
    if (!doc.files || doc.files.length === 0) {
      this.toaster.error('No file available to view');
      return;
    }

    const firstFile = doc.files[0];
    const fileExtension = firstFile.filename.split('.').pop()?.toLowerCase() || '';

    this.toaster.info('Loading document...');

    this._docmanagsystemservices.getDocumentById(doc.id, firstFile.filename).subscribe({
      next: (response: Blob) => {
        try {
          let mimeType = firstFile.mimetype || this.getMimeType(fileExtension);
          const blob = new Blob([response], { type: mimeType });
          const url = window.URL.createObjectURL(blob);

          if (this.canViewInBrowser(fileExtension)) {
            const viewWindow = window.open(url, '_blank');
            if (!viewWindow) {
              this.toaster.error('Please allow pop-ups to view documents');
              window.URL.revokeObjectURL(url);
              return;
            }
            setTimeout(() => window.URL.revokeObjectURL(url), 20000);
            this.toaster.success('Document opened successfully!');
          } else {
            this.toaster.warning('This file type cannot be previewed in browser. Downloading instead...', 'Download Started');
            const link = document.createElement('a');
            link.href = url;
            link.download = firstFile.originalname || firstFile.filename;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }, 100);
          }
        } catch (error) {
          console.error('Error viewing document:', error);
          this.toaster.error('Failed to open document');
        }
      },
      error: (err) => {
        console.error('View error:', err);
        if (err.status === 404) {
          this.toaster.error('Document not found on server');
        } else if (err.status === 500) {
          this.toaster.error('Server error while loading document');
        } else {
          this.toaster.error('Failed to load document. Please try again.');
        }
      }
    });
  }

  private canViewInBrowser(extension: string): boolean {
    const viewableExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'];
    return viewableExtensions.includes(extension);
  }

  private getMimeType(extension: string): string {
    const mimeTypes: { [key: string]: string } = {
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'svg': 'image/svg+xml'
    };
    return mimeTypes[extension] || 'application/octet-stream';
  }

  onDownload(doc: DocumentItem) {
    if (!doc.files || doc.files.length === 0) {
      this.toaster.error('No file available to download');
      return;
    }

    const firstFile = doc.files[0];
    this.toaster.info('Preparing download...');

    this._docmanagsystemservices.downloadDocument(doc.id, firstFile.filename).subscribe({
      next: (response: Blob) => {
        try {
          const blob = new Blob([response], { type: firstFile.type || 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = firstFile.originalname || firstFile.filename;
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }, 100);
          this.toaster.success('Download started successfully!');
        } catch (error) {
          console.error('Error creating download link:', error);
          this.toaster.error('Failed to initiate download');
        }
      },
      error: (err) => {
        console.error('Download error:', err);
        if (err.status === 404) {
          this.toaster.error('File not found on server');
        } else if (err.status === 500) {
          this.toaster.error('Server error while downloading file');
        } else if (err.status === 0) {
          this.toaster.error('Network error. Please check your connection.');
        } else {
          this.toaster.error('Failed to download file. Please try again.');
        }
      }
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DocumentManagementDialog, {
      width: '600px',
      panelClass: 'custom-dialog',
      data: {
        selectedEmployee: this.selectedEmployee,
        employeeList: this.employeeList // Pass the full employee list
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Reload employees first, then documents
        this.getAllEmployees(); // This will call loadDocuments()
        this.fetchSummaryData();
      }
    });
  }
  loadDocuments() {
    this._docmanagsystemservices.getAlldocuments(this.entity_id).subscribe({
      next: (res: any) => {
        if (res.code === 200 && Array.isArray(res.data)) {
          if (res.data[0]?.role_module_master_name) {
            this.moduleTitle = res.data[0].role_module_master_name;
          }

          this.documents = res.data.map((doc: any) => {
            const firstFile = doc.files?.[0];
            const displayName = firstFile?.originalname || firstFile?.filename || 'Untitled';
            const ext = displayName.split('.').pop()?.toLowerCase() || '';

            let icon = 'insert_drive_file';
            if (ext === 'pdf') icon = 'picture_as_pdf';
            else if (ext === 'doc' || ext === 'docx') icon = 'description';
            else if (ext === 'xls' || ext === 'xlsx') icon = 'grid_on';
            else if (['jpg', 'jpeg', 'png'].includes(ext)) icon = 'image';

            const size = firstFile?.size
              ? (firstFile.size / (1024 * 1024)) > 1
                ? (firstFile.size / (1024 * 1024)).toFixed(1) + ' MB'
                : (firstFile.size / 1024).toFixed(1) + ' KB'
              : '';

            const status = this.getDocumentStatus(doc.uploaded_date);

            // ✅ Get the employee THIS DOCUMENT belongs to
            let employeeName = 'Unknown';
            let docEmployeeId = null;
            let employeeData = null;

            // Priority 1: Check if document has employee object
            if (doc.employee && doc.employee.employee_id) {
              docEmployeeId = doc.employee.employee_id;
              employeeData = doc.employee;
              const firstName = doc.employee.first_name || '';
              const middleName = doc.employee.middle_name || '';
              const lastName = doc.employee.last_name || '';
              employeeName = `${firstName} ${middleName} ${lastName}`.trim();
            }
            // Priority 2: Check if document has employee_id
            else if (doc.employee_id) {
              docEmployeeId = doc.employee_id;
              // Find this employee in the master employeeList
              const employee = this.employeeList.find(emp => emp.employee_id === doc.employee_id);
              if (employee) {
                employeeData = employee;
                const firstName = employee.first_name || '';
                const middleName = employee.middle_name || '';
                const lastName = employee.last_name || '';
                employeeName = `${firstName} ${middleName} ${lastName}`.trim();
              }
            }

            return {
              id: doc.id,
              title: displayName,
              fileType: ext.toUpperCase(),
              uploadedDate: this.formatDate(doc.uploaded_date),
              uploaded_by: `${this.loginUser.first_name} ${this.loginUser?.last_name ?? ''}`.trim(),
              employee_id: docEmployeeId,
              employee: employeeData, // ✅ Store full employee object
              expires: this.getExpiryDate(doc.uploaded_date, doc.document_category),
              tags: [
                this.getCategoryTag(doc.document_category),
                status,
                doc.version || 'v1.0'
              ].filter(Boolean),
              size,
              fileIcon: icon,
              files: doc.files || [],
              document_category: doc.document_category,
              version: doc.version
            };
          });

          this.filteredDocuments = [...this.documents];

          // ✅ Build unique employee list from documents only
          this.buildEmployeeListFromDocuments();

          console.log('Loaded documents:', this.documents);
          console.log('Unique employees in documents:', this.employeeList);
        }
      },
      error: (err) => {
        console.error('Error fetching documents:', err);
        this.toaster.error('Failed to load documents');
      }
    });
  }

  // ✅ NEW METHOD: Build employee list from documents only (not all employees)
  buildEmployeeListFromDocuments() {
    const uniqueEmployeesMap = new Map();

    this.documents.forEach(doc => {
      if (doc.employee_id && !uniqueEmployeesMap.has(doc.employee_id)) {
        // Store the full employee object
        uniqueEmployeesMap.set(doc.employee_id, doc.employee || {
          employee_id: doc.employee_id,
          first_name: doc.uploaded_by.split(' ')[0] || '',
          middle_name: doc.uploaded_by.split(' ')[1] || '',
          last_name: doc.uploaded_by.split(' ')[2] || '',
        });
      }
    });

    // ✅ Only employees who have documents will be in this list
    this.employeeList = Array.from(uniqueEmployeesMap.values());
    console.log('Employees with documents:', this.employeeList);
  }

  // ✅ Fetch ALL employees first (for lookup), then load documents
  getAllEmployees() {
    this._empRegistration.getemployeeListData(this.entity_id).subscribe(
      (res: any) => {
        if (res.code === 200 && Array.isArray(res.data)) {
          // Store all employees temporarily for lookup
          const allEmployees = res.data;
          this.employeeList = allEmployees; // Store temporarily
          console.log("All Employees Loaded for lookup:", allEmployees.length);

          // ✅ Load documents (will rebuild employeeList from documents)
          this.loadDocuments();
        } else {
          console.log("No employees found, loading documents anyway");
          this.employeeList = [];
          this.loadDocuments();
        }
      },
      (err) => {
        console.error("Error loading employees:", err);
        this.employeeList = [];
        this.loadDocuments();
      }
    );
  }
  getByUserId(id: any) {
    this._empRegistration.getByUserId(id).subscribe(
      (res: any) => {
        console.log("Employee Data:", res);
        if (res.code === 200 && res.data) {
          this.employeeList = [res.data];
        } else {
          this.employeeList = [];
        }
        console.log("Employee Final Data:", this.employeeList);
      },
      (err) => {
        this.toaster.error(err?.error?.message || 'Error fetching employees');
      }
    );
  }

  getAllRoleMaster() {
    this._empRegistration.getAllRoleMaster(this.loginUser).subscribe(
      (res: any) => {
        this.allRoleMaster = res.data || [];
        this.assignDesignationArr1 = this.allRoleMaster.map((r: any) => r.role_master_name);
        this.assignDesignationArr2 = [...this.allRoleMaster];
        console.log("All Role Master:", this.allRoleMaster);
      },
      (err) => {
        this.toaster.error(err?.error?.message || 'Error fetching roles');
      }
    );
  }

  onSummaryClick() {
    if (['Employee Docs', 'Training', 'Policies', 'Compliance'].includes(this.selectedSummaryTitle)) {
      this.showDetails = !this.showDetails;

      // Reset selections when closing
      if (!this.showDetails) {
        this.selectedEmployee = null;
        this.selectedDesignation = null;
        this.employeeDocuments = [];
        this.designationDocuments = [];
      }
    } else {
      this.showDetails = false;
    }
  }

  filterByEmployee(emp: any) {
    console.log('=== Filter By Employee ===');
    console.log('Clicked employee:', emp);

    if (this.selectedEmployee?.employee_id === emp.employee_id) {
      // Toggle off
      this.selectedEmployee = null;
      this.employeeDocuments = [];
    } else {
      // ✅ Select employee and filter only their documents
      this.selectedEmployee = emp;
      this.employeeDocuments = this.filteredDocuments.filter((doc: any) =>
        doc.employee_id === emp.employee_id
      );

      console.log(`Documents for ${emp.first_name}:`, this.employeeDocuments);
    }
  }

  filterByDesignation(role: any) {
    console.log('=== Filter By Designation ===');
    console.log('Clicked designation:', role);
    console.log('Current filteredDocuments:', this.filteredDocuments);

    if (this.selectedDesignation?.role_master_id === role.role_master_id) {
      // Toggle off
      this.selectedDesignation = null;
      this.designationDocuments = [];
      console.log('Toggled off - cleared selection');
    } else {
      // Select designation and show all documents in current filtered list
      this.selectedDesignation = role;
      this.designationDocuments = [...this.filteredDocuments];

      console.log('Selected designation:', role.role_master_name);
      console.log('Showing documents:', this.designationDocuments.length);
      console.log('Documents:', this.designationDocuments);
    }
  }

  // ✅ When filtering by summary, rebuild employee list from filtered docs
  filterBySummary(title: string) {
    this.selectedSummaryTitle = title;

    // Reset employee/designation selections
    this.selectedEmployee = null;
    this.selectedDesignation = null;
    this.employeeDocuments = [];
    this.designationDocuments = [];
    this.showDetails = false;

    this.searchControl.setValue('', { emitEvent: false });
    this.categoryControl.setValue('All Categories', { emitEvent: false });
    this.statusControl.setValue('All Status', { emitEvent: false });

    if (title === 'Total Documents') {
      this.filteredDocuments = [...this.documents];
    } else if (title === 'Employee Docs') {
      this.filteredDocuments = this.documents.filter(d =>
        d.document_category === 'Employee-related'
      );
    } else if (title === 'Policies') {
      this.filteredDocuments = this.documents.filter(d =>
        d.document_category === 'Company Policies'
      );
    } else if (title === 'Compliance') {
      this.filteredDocuments = this.documents.filter(d =>
        d.document_category === 'Compliance Documents'
      );
    } else if (title === 'Training') {
      this.filteredDocuments = this.documents.filter(d =>
        d.document_category === 'Training & Performance'
      );
    } else if (title === 'Expiring Soon') {
      this.filteredDocuments = this.documents.filter(d => {
        if (!d.expires) return false;
        const expiryDate = new Date(d.expires);
        const today = new Date();
        const diffInDays = (expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
        return diffInDays >= 0 && diffInDays <= 30;
      });
    }

    // ✅ Rebuild employee list based on filtered documents
    this.buildEmployeeListFromFilteredDocuments();
  }

  // ✅ NEW: Build employee list from currently filtered documents
  buildEmployeeListFromFilteredDocuments() {
    const uniqueEmployeesMap = new Map();

    this.filteredDocuments.forEach(doc => {
      if (doc.employee_id && !uniqueEmployeesMap.has(doc.employee_id)) {
        uniqueEmployeesMap.set(doc.employee_id, doc.employee || {
          employee_id: doc.employee_id,
          first_name: doc.uploaded_by.split(' ')[0] || '',
          middle_name: doc.uploaded_by.split(' ')[1] || '',
          last_name: doc.uploaded_by.split(' ')[2] || '',
        });
      }
    });

    // Update employeeList to show only employees in current filter
    this.employeeList = Array.from(uniqueEmployeesMap.values());
    console.log('Employees in current filter:', this.employeeList);
  }
}
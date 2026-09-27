import { Component, OnInit } from '@angular/core';
import { AccessControlService, ModuleAccess } from '../services/access-control.service';

/**
 * Example component demonstrating access control usage
 * This is for reference only - not meant to be used in production
 */
@Component({
  selector: 'app-access-control-example',
  template: `
    <div class="container mt-4">
      <h2>Access Control Example</h2>

      <!-- Example 1: Show content based on module access -->
      <div class="card mb-3">
        <div class="card-header">Example 1: Basic Access Check</div>
        <div class="card-body">
          <div *hasAccess="4">
            <p>✅ You have access to Employee List module (ID: 4)</p>
          </div>
          <div *hasAccess="999">
            <p>❌ This won't show - module 999 doesn't exist</p>
          </div>
        </div>
      </div>

      <!-- Example 2: Permission-based buttons -->
      <div class="card mb-3">
        <div class="card-header">Example 2: Permission-Based Actions</div>
        <div class="card-body">
          <button 
            *hasAccess="{ moduleId: 4, permission: 'read' }" 
            class="btn btn-info me-2">
            <i class="bi bi-eye"></i> View
          </button>
          <button 
            *hasAccess="{ moduleId: 4, permission: 'write' }" 
            class="btn btn-warning me-2">
            <i class="bi bi-pencil"></i> Edit
          </button>
          <button 
            *hasAccess="{ moduleId: 4, permission: 'delete' }" 
            class="btn btn-danger">
            <i class="bi bi-trash"></i> Delete
          </button>
        </div>
      </div>

      <!-- Example 3: TypeScript-based checks -->
      <div class="card mb-3">
        <div class="card-header">Example 3: Component Logic Checks</div>
        <div class="card-body">
          <p>Can Edit: {{ canEdit ? '✅ Yes' : '❌ No' }}</p>
          <p>Can Delete: {{ canDelete ? '✅ Yes' : '❌ No' }}</p>
          <button 
            class="btn btn-primary" 
            [disabled]="!canEdit"
            (click)="handleEdit()">
            Edit Employee
          </button>
        </div>
      </div>

      <!-- Example 4: Access Summary -->
      <div class="card mb-3">
        <div class="card-header">Example 4: Access Summary</div>
        <div class="card-body">
          <div *ngIf="accessSummary">
            <p><strong>Total Modules:</strong> {{ accessSummary.totalModules }}</p>
            <p><strong>Accessible:</strong> {{ accessSummary.accessibleCount }}</p>
            <p><strong>User Overrides:</strong> {{ accessSummary.userOverrides }}</p>
          </div>
        </div>
      </div>

      <!-- Example 5: Accessible Modules List -->
      <div class="card mb-3">
        <div class="card-header">Example 5: Your Accessible Modules</div>
        <div class="card-body">
          <ul class="list-group">
            <li 
              *ngFor="let module of accessibleModules" 
              class="list-group-item d-flex justify-content-between align-items-center">
              <span>
                <strong>{{ module.moduleName }}</strong>
                <span *ngIf="module.isUserOverride" class="badge bg-info ms-2">Custom</span>
              </span>
              <div>
                <span *ngIf="module.read" class="badge bg-success me-1">Read</span>
                <span *ngIf="module.write" class="badge bg-warning me-1">Write</span>
                <span *ngIf="module.delete" class="badge bg-danger">Delete</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Example 6: Real-time API Check -->
      <div class="card mb-3">
        <div class="card-header">Example 6: Real-time API Verification</div>
        <div class="card-body">
          <button 
            class="btn btn-primary" 
            (click)="checkAccessViaAPI()">
            Check Delete Access via API
          </button>
          <p *ngIf="apiCheckResult !== null" class="mt-2">
            API Result: {{ apiCheckResult ? '✅ Has Access' : '❌ No Access' }}
          </p>
        </div>
      </div>
    </div>
  `,
})
export class AccessControlExampleComponent implements OnInit {
  canEdit = false;
  canDelete = false;
  accessSummary: any = null;
  accessibleModules: ModuleAccess[] = [];
  apiCheckResult: boolean | null = null;

  constructor(private accessControl: AccessControlService) {}

  ngOnInit() {
    // Check permissions in TypeScript
    this.canEdit = this.accessControl.hasPermission(4, 'write');
    this.canDelete = this.accessControl.hasPermission(4, 'delete');

    // Get access summary
    this.accessSummary = this.accessControl.getAccessSummary();

    // Get accessible modules
    this.accessibleModules = this.accessControl.getAccessibleModules();

    // Subscribe to access data changes
    this.accessControl.accessData$.subscribe((data) => {
      if (data) {
        this.accessSummary = data.summary;
        this.accessibleModules = data.accessibleModules;
      }
    });
  }

  handleEdit() {
    if (!this.canEdit) {
      alert('You do not have permission to edit');
      return;
    }
    console.log('Editing employee...');
  }

  checkAccessViaAPI() {
    this.accessControl.checkModuleAccessAPI(4, 'delete').subscribe({
      next: (hasAccess) => {
        this.apiCheckResult = hasAccess;
        console.log('API Check Result:', hasAccess);
      },
      error: (err) => {
        console.error('API Check Error:', err);
        this.apiCheckResult = false;
      },
    });
  }
}

# Access Control System - Usage Guide

## Overview
This access control system provides a comprehensive way to manage user permissions based on roles and user-specific overrides.

## Backend API Endpoints

### 1. Get Module Access
**Endpoint:** `GET /api/v1/rbac/getModuleAccess/:employeeId/:roleId/:entityId`

**Response:**
```json
{
  "success": true,
  "employeeId": "107",
  "roleId": "1",
  "entityId": "1",
  "modules": [
    {
      "id": 1,
      "name": "HRMS",
      "path": "/hrms",
      "read": true,
      "write": true,
      "remove": false,
      "selected": true,
      "isUser": false,
      "children": [
        {
          "id": 3,
          "name": "Employee Master",
          "path": "/hrms/employees",
          "read": true,
          "write": true,
          "remove": false,
          "selected": true,
          "isUser": false,
          "children": []
        }
      ]
    }
  ],
  "data": {
    "accessMap": {
      "1": {
        "moduleId": 1,
        "moduleName": "HRMS",
        "modulePath": "/hrms",
        "read": true,
        "write": true,
        "delete": false,
        "hasAccess": true,
        "isUserOverride": false
      }
    },
    "accessibleModules": [...],
    "accessiblePaths": ["/hrms", "/hrms/employees"],
    "summary": {
      "totalModules": 10,
      "accessibleCount": 7,
      "userOverrides": 2
    }
  }
}
```

**Note:** The `modules` array contains only modules the user has access to, in a hierarchical tree structure. Parent modules are included if they have accessible children, even if the parent itself has no direct permissions.

### 2. Check Module Access
**Endpoint:** `POST /api/v1/rbac/checkModuleAccess`

**Request Body:**
```json
{
  "employeeId": "107",
  "roleId": "1",
  "entityId": "1",
  "moduleId": 4,
  "requiredPermission": "write"
}
```

**Response:**
```json
{
  "success": true,
  "hasAccess": true,
  "moduleId": 4,
  "moduleName": "Employee List",
  "modulePath": "/hrms/employees",
  "permissions": {
    "read": true,
    "write": true,
    "delete": false
  },
  "requiredPermission": "write"
}
```

## Frontend Usage

### 1. Initialize Access Control (in App Component or Auth Service)

```typescript
import { AccessControlService } from '@shared/services/access-control.service';

export class AppComponent implements OnInit {
  constructor(private accessControl: AccessControlService) {}

  ngOnInit() {
    // After login, initialize access control
    const employeeId = localStorage.getItem('employee_id');
    const roleId = localStorage.getItem('role_id');
    const entityId = localStorage.getItem('selectedEntityId');

    this.accessControl.initializeAccess(employeeId, roleId, entityId)
      .subscribe({
        next: (data) => {
          console.log('Access control initialized', data.summary);
        },
        error: (err) => {
          console.error('Failed to initialize access control', err);
        }
      });
  }
}
```

### 2. Use in Components (TypeScript)

```typescript
import { AccessControlService } from '@shared/services/access-control.service';

export class EmployeeListComponent {
  canEdit = false;
  canDelete = false;

  constructor(private accessControl: AccessControlService) {}

  ngOnInit() {
    // Check if user has write permission on Employee module (moduleId: 4)
    this.canEdit = this.accessControl.hasPermission(4, 'write');
    this.canDelete = this.accessControl.hasPermission(4, 'delete');

    // Or check if user has any access
    const hasAccess = this.accessControl.hasModuleAccess(4);
  }

  onEditClick() {
    if (!this.canEdit) {
      alert('You do not have permission to edit');
      return;
    }
    // Proceed with edit
  }
}
```

### 3. Use in Templates (HTML) with Directive

```html
<!-- Show element only if user has access to module -->
<div *hasAccess="4">
  <h2>Employee List</h2>
</div>

<!-- Show button only if user has write permission -->
<button *hasAccess="{ moduleId: 4, permission: 'write' }" 
        (click)="editEmployee()">
  Edit Employee
</button>

<!-- Show delete button only if user has delete permission -->
<button *hasAccess="{ moduleId: 4, permission: 'delete' }" 
        class="btn btn-danger"
        (click)="deleteEmployee()">
  Delete
</button>

<!-- Multiple permission checks -->
<div class="action-buttons">
  <button *hasAccess="{ moduleId: 4, permission: 'read' }">View</button>
  <button *hasAccess="{ moduleId: 4, permission: 'write' }">Edit</button>
  <button *hasAccess="{ moduleId: 4, permission: 'delete' }">Delete</button>
</div>
```

### 4. Protect Routes with Guard

```typescript
// In your routing module
import { ModuleAccessGuard } from '@shared/guards/module-access.guard';

const routes: Routes = [
  {
    path: 'employees',
    component: EmployeeListComponent,
    canActivate: [ModuleAccessGuard],
    data: { moduleId: 4 } // Employee List module ID
  },
  {
    path: 'employees/create',
    component: EmployeeCreateComponent,
    canActivate: [ModuleAccessGuard],
    data: { 
      moduleId: 4,
      requiredPermission: 'write' // Requires write permission
    }
  },
  {
    path: 'settings',
    component: SettingsComponent,
    canActivate: [ModuleAccessGuard],
    data: { modulePath: '/hrms/settings' } // Or use path
  }
];
```

### 5. Get Accessible Modules for Navigation

```typescript
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];

  constructor(private accessControl: AccessControlService) {}

  ngOnInit() {
    // Method 1: Get from cached data (after initialization)
    this.menuItems = this.accessControl.getModuleTree();

    // Method 2: Fetch directly from API
    const employeeId = localStorage.getItem('employee_id');
    const roleId = localStorage.getItem('role_id');
    const entityId = localStorage.getItem('selectedEntityId');
    
    this.accessControl.getAccessibleModuleTree(employeeId, roleId, entityId)
      .subscribe(tree => {
        this.menuItems = tree;
        console.log('Accessible menu tree:', tree);
      });

    // Get flat list of accessible modules
    const accessibleModules = this.accessControl.getAccessibleModules();
    
    // Get summary
    const summary = this.accessControl.getAccessSummary();
    console.log(`User has access to ${summary.accessibleCount} modules`);
  }
}
```

**Template for Navigation Menu:**
```html
<ul class="nav-menu">
  <li *ngFor="let module of menuItems">
    <a [routerLink]="module.path">
      {{ module.name }}
      <span *ngIf="module.isUser" class="badge">Custom</span>
    </a>
    
    <!-- Nested children -->
    <ul *ngIf="module.children && module.children.length > 0">
      <li *ngFor="let child of module.children">
        <a [routerLink]="child.path">{{ child.name }}</a>
        
        <!-- Level 3 children -->
        <ul *ngIf="child.children && child.children.length > 0">
          <li *ngFor="let subChild of child.children">
            <a [routerLink]="subChild.path">{{ subChild.name }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```

### 6. Refresh Access After Permission Changes

```typescript
export class UserPermissionComponent {
  constructor(private accessControl: AccessControlService) {}

  savePermissions() {
    this.menuApi.bulkSaveUserPermissions(data).subscribe({
      next: (res) => {
        this.toast.success('Permissions saved');
        
        // Refresh access control data
        this.accessControl.refreshAccess().subscribe();
      }
    });
  }
}
```

### 7. Real-time API Check (for critical operations)

```typescript
export class CriticalOperationComponent {
  constructor(private accessControl: AccessControlService) {}

  performCriticalAction() {
    // Verify access via API before critical operation
    this.accessControl.checkModuleAccessAPI(4, 'delete')
      .subscribe(hasAccess => {
        if (hasAccess) {
          // Proceed with operation
          this.deleteRecord();
        } else {
          this.toast.error('Access denied');
        }
      });
  }
}
```

### 8. Clear Access on Logout

```typescript
export class AuthService {
  constructor(private accessControl: AccessControlService) {}

  logout() {
    // Clear access control data
    this.accessControl.clearAccess();
    
    // Clear other auth data
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
```

## Module IDs Reference

Based on your system, here are common module IDs:
- 1: HRMS (Main Module)
- 2: HRMS Dashboard
- 3: Employee Master
- 4: Employee List
- 5: RBAC
- 6: Role Master
- 7: User Permission

## Best Practices

1. **Initialize Early**: Initialize access control right after login
2. **Use Directive for UI**: Use `*hasAccess` directive for showing/hiding UI elements
3. **Use Guard for Routes**: Protect routes with `ModuleAccessGuard`
4. **Double Check Critical**: Use API check for critical operations (delete, financial transactions)
5. **Refresh After Changes**: Refresh access data after permission changes
6. **Clear on Logout**: Always clear access data on logout

## Performance Tips

1. Access checks are done in-memory (very fast)
2. Data is cached in BehaviorSubject
3. Only refresh when permissions change
4. Use trackBy in ngFor for module lists

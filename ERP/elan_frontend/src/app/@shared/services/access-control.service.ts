import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { MenuManagementService } from './menu-management.service';
import {
  AccessData,
  ModuleAccess,
  RbacModule,
  UserContext,
  UserData,
} from '../interface/core.interface';

@Injectable({
  providedIn: 'root',
})
export class AccessControlService {
  private accessDataSubject = new BehaviorSubject<AccessData | null>(null);

  private readonly KEYS = {
    USER: 'signInUser',
    FINANCIAL_ID: 'financial_id',
    EMPLOYEE_ID: 'EmpMainId',
    ROLE_ID: 'role_master_id',
    ENTITY_ID: 'selectedEntityId',
    ROLE_NAME: 'role_name',
    ROLE_CODE: 'role_code',
  };

  accessData$() {
    return this.accessDataSubject.asObservable();
  }

  private employeeId: any = null;
  private roleId: any = null;
  private entityId: any = null;

  constructor(private menuService: MenuManagementService) {}

  /**
   * Initialize access control with user credentials
   * Call this after login or when switching entities
   */
  initializeAccess(
    employeeId: any,
    roleId: any,
    entityId: any,
  ): Observable<AccessData> {
    this.employeeId = employeeId;
    this.roleId = roleId;
    this.entityId = entityId;

    return this.menuService.getModuleAccess(employeeId, roleId, entityId).pipe(
      map((response: any) => {
        if (response.success && response.data) {
          // Store the accessible module tree separately if needed
          const accessData = {
            ...response.data,
            moduleTree: response.modules || response.data.modules || [],
          };
          this.accessDataSubject.next(accessData);
          return accessData;
        }
        throw new Error('Failed to load access data');
      }),
      catchError((error) => {
        console.error('Error initializing access control:', error);
        this.accessDataSubject.next(null);
        throw error;
      }),
    );
  }

  /**
   * Refresh access data (call after permission changes)
   */
  refreshAccess(): Observable<AccessData> {
    if (!this.employeeId || !this.roleId || !this.entityId) {
      console.warn('Access control not initialized');
      return of(null as any);
    }
    return this.initializeAccess(this.employeeId, this.roleId, this.entityId);
  }

  /**
   * Check if user has access to a module by ID
   */
  hasModuleAccess(moduleId: number): boolean {
    const accessData = this.accessDataSubject.value;
    if (!accessData || !accessData.accessMap) return false;

    const module = accessData.accessMap[moduleId];
    return module ? module.hasAccess : false;
  }

  hasReadWriteRemoveAccess(moduleId: number): ModuleAccess | null {
    const accessData = this.accessDataSubject.value;
    if (!accessData || !accessData.accessMap) return null;

    const module = accessData.accessMap[moduleId];
    return module;
  }

  /**
   * Check if user has specific permission on a module
   */
  hasPermission(
    moduleId: number,
    permission: 'read' | 'write' | 'remove',
  ): boolean {
    const accessData = this.accessDataSubject.value;
    if (!accessData || !accessData.accessMap) return false;

    const module = accessData.accessMap[moduleId];
    return module ? module[permission] : false;
  }

  /**
   * Get accessible module tree directly from API
   * Useful for building navigation menus
   */
  getAccessibleModuleTree(
    employeeId: any,
    roleId: any,
    entityId: any,
  ): Observable<any[]> {
    return this.menuService.getModuleAccess(employeeId, roleId, entityId).pipe(
      map((response: any) => {
        if (response.success && response.modules) {
          return response.modules;
        }
        return [];
      }),
      catchError((error) => {
        console.error('Error fetching accessible module tree:', error);
        return of([]);
      }),
    );
  }

  /**
   * Check module access via API (for real-time verification)
   */
  checkModuleAccessAPI(
    moduleId: number,
    requiredPermission?: 'read' | 'write' | 'delete',
  ): Observable<boolean> {
    if (!this.employeeId || !this.roleId || !this.entityId) {
      return of(false);
    }

    return this.menuService
      .checkModuleAccess({
        employeeId: this.employeeId,
        roleId: this.roleId,
        entityId: this.entityId,
        moduleId,
        requiredPermission,
      })
      .pipe(
        map((response: any) => response.success && response.hasAccess),
        catchError(() => of(false)),
      );
  }

  /**
   * Clear access data (call on logout)
   */
  clearAccess() {
    this.accessDataSubject.next(null);
    this.employeeId = null;
    this.roleId = null;
    this.entityId = null;
  }

  /**
   * Get current access data snapshot
   */
  getCurrentAccessData(): AccessData | null {
    return this.accessDataSubject.value;
  }

  // =======================================================
  // PERMISSION CHECKING HELPERS
  // =======================================================

  // Finds module matching URL path
  private findModuleByPath(
    modules: RbacModule[],
    fullPath: string,
  ): RbacModule | null {
    const segments = fullPath.split('/').filter(Boolean);

    function search(items: RbacModule[], segIndex: number): RbacModule | null {
      for (const item of items) {
        if (item.path === segments[segIndex]) {
          // If no more children → this is the module
          if (!item.children || item.children.length === 0) {
            return item;
          }

          // If next segment exists, try going deeper
          if (segments[segIndex + 1]) {
            const found = search(item.children, segIndex + 1);
            if (found) return found;
          }

          // Child not matching → return parent module itself
          return null;
        }
      }
      return null;
    }

    return search(modules, 0);
  }

  // ------------------------------------------
  // READ PERMISSION
  // ------------------------------------------
  canRead(path: string): boolean {
    if (path === 'ess/dashboard') return true;
    const modules = this.accessDataSubject.value?.modules!;
    const mod = this.findModuleByPath(modules, path);
    return !!mod?.read;
  }

  // ------------------------------------------
  // WRITE PERMISSION
  // ------------------------------------------
  canWrite(path: string): boolean {
    const modules = this.accessDataSubject.value?.modules;
    const mod = this.findModuleByPath(modules!, path);
    // if (path === 'configurational-master/state-master') {
    // console.log(mod);
    // }
    return !!mod?.write;
  }

  // ------------------------------------------
  // DELETE PERMISSION
  // ------------------------------------------
  canDelete(path: string): boolean {
    const modules = this.accessDataSubject.value?.modules;
    const mod = this.findModuleByPath(modules!, path);
    return !!mod?.remove;
  }

  /** Generic getter for JSON values */
  private getJSON<T>(key: string, fallback: T | null = null): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  /** Generic getter for number values */
  private getNumber(key: string, fallback: number = -1): number {
    const value = localStorage.getItem(key);
    const parsed = value ? Number(value) : NaN;
    return isNaN(parsed) ? fallback : parsed;
  }

  // ===========================
  //     PUBLIC GETTERS
  // ===========================

  getUser(): UserData | null {
    // console.log(this.KEYS.USER,'this.KEYS.USER')
    return this.getJSON<UserData>(this.KEYS.USER, null);
  }

  getFinancialId(): number {
    return this.getNumber(this.KEYS.FINANCIAL_ID);
  }

  getEmployeeId(): number {
    return this.getNumber(this.KEYS.EMPLOYEE_ID);
  }

  getRoleId(): number {
    return this.getNumber(this.KEYS.ROLE_ID);
  }

  getEntityId(): number {
    return this.getNumber(this.KEYS.ENTITY_ID);
  }

  getRoleName(): string {
    return localStorage.getItem(this.KEYS.ROLE_NAME) || '';
  }

  getRoleCode(): string {
    return localStorage.getItem(this.KEYS.ROLE_CODE) || '';
  }

  getUserContext(): UserContext {
    return {
      financialId: this.getFinancialId(),
      employeeId: this.getEmployeeId(),
      roleId: this.getRoleId(),
      entityId: this.getEntityId(),
    };
  }
}

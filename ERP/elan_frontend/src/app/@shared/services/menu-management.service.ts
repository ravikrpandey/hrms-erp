import { Injectable } from '@angular/core';
import { environment } from 'src/app/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';

const databaseKey: string = environment.servralUrl;
const baseUrl = (path: string) => `${databaseKey}/api/v1/${path}`;

const routes = {
  menuActions: {
    allMenuList: () => baseUrl(`getAllMenuList`),
    getRBACMenuTree: () => baseUrl(`rbac/getRBACMenuTree`),
    createUpdateMenu: () => baseUrl(`rbac/createModule`),
    bulkSaveRolePermissions: () => baseUrl(`rbac/bulkSaveRolePermissions`),
    bulkSaveUserPermissions: () => baseUrl(`rbac/bulkSaveUserPermissions`),
    getRolePermissions: (roleId: any) =>
      baseUrl(`rbac/getRolePermissions/${roleId}`),
    getRoleAndUserPermissions: (
      roleId: any,
      entity_id: any,
      employee_id: number
    ) =>
      baseUrl(
        `rbac/getRoleAndUserPermissions/${roleId}/${employee_id}/${entity_id}`
      ),
    getModuleAccess: (employeeId: any, roleId: any, entityId: any) =>
      baseUrl(`rbac/getModuleAccess/${employeeId}/${roleId}/${entityId}`),
    checkModuleAccess: () => baseUrl(`rbac/checkModuleAccess`),
    updateStatus: (id: number) => baseUrl(`rbac/toggleStatus/${id}`),
  },
};

@Injectable({
  providedIn: 'root',
})
export class MenuManagementService {
  constructor(private http: HttpClient) {}

  allMenuList(): Observable<any> {
    return this.http.get(routes.menuActions.getRBACMenuTree());
  }

  createUpdateMenu(data: any): Observable<any> {
    return this.http.post<any>(routes.menuActions.createUpdateMenu(), data);
  }

  bulkSaveRolePermissions(data: any) {
    return this.http.post<any>(
      routes.menuActions.bulkSaveRolePermissions(),
      data
    );
  }

  getRolePermissions(roleId: any) {
    return this.http.get(routes.menuActions.getRolePermissions(roleId));
  }

  getRoleAndUserPermissions(entity_id: any, employee_id: number, roleId: any) {
    return this.http.get(
      routes.menuActions.getRoleAndUserPermissions(
        roleId,
        entity_id,
        employee_id
      )
    );
  }

  bulkSaveUserPermissions(data: any) {
    return this.http.post<any>(
      routes.menuActions.bulkSaveUserPermissions(),
      data
    );
  }

  getModuleAccess(employeeId: any, roleId: any, entityId: any) {
    return this.http.get(
      routes.menuActions.getModuleAccess(employeeId, roleId, entityId)
    );
  }

  checkModuleAccess(data: {
    employeeId: any;
    roleId: any;
    entityId: any;
    moduleId: number;
    requiredPermission?: 'read' | 'write' | 'delete';
  }) {
    return this.http.post<any>(routes.menuActions.checkModuleAccess(), data);
  }

  updateStatus(id: number, status: boolean) {
    return this.http.put(routes.menuActions.updateStatus(id), { id, status });
  }
}

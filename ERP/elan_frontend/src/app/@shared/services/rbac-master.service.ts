import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { ModuleAction } from '../interface/core.interface';
import { AccessControlService } from './access-control.service';

const databaseKey: any = environment.servralUrl;

const routes = {
  roles: {
    roleCreate: () => `${databaseKey}/api/v1/createRoleMaster`,
    roleGet: (role: any) => `${databaseKey}/api/v1/getAllRoleMaster/${role}`,
    roleGetById: (role_id: any) =>
      `${databaseKey}/api/v1/getByIdRoleMaster/${role_id}`,
    roleUpdate: (role_id: any) =>
      `${databaseKey}/api/v1/editRoleMaster/${role_id}`,
    roleDelete: (id: any) => `${databaseKey}/api/v1/deleteRoleMaster/${id}`,
    // assignAction: (data: any) => `${databaseKey}/api/v1/assignaction?role_master_id=${data?.role_master_id}&employee_id=${data?.employee_id}&entity_id=${data?.entity_id}`,

    assignAction: (data: any) =>
      `${databaseKey}/api/v1/assignaction?role_master_id=${
        data?.role_master_id
      }&employee_ids=${data?.employee_ids?.join(',')}&entity_id=${
        data?.entity_id
      }`,

    getAssignAction: (id: any) =>
      `${databaseKey}/api/v1/getassignactionfucntion/${id}`,
  },
  roleAssign: {
    menuGet: () => `${databaseKey}/api/v1/getAllMenuMaster`,
    subMenu: () => `${databaseKey}/api/v1/getAllSubmenuMaster`,
    allMenuGte: () => `${databaseKey}/api/v1/getAllMenuMasterChild`,
    roleAssignGet: () => `${databaseKey}/api/v1/getAllRoleMaster`,
    createRole: () => `${databaseKey}/api/v1/createroleMenuAccess`,
    // roleGetById:(role_id:any)=>`${databaseKey}/api/v1/getByIdroleMenuAccess/${role_id}`
    roleGetById: (data: any) =>
      `${databaseKey}/api/v1/getByIdroleMenuAccess?role_master_id=${data?.role_master_id}&employee_id=${data?.employee_id}&entity_id=${data?.entity_id}&roleType=${data?.roleType}`,
    // updateRole: (query: any) => `${databaseKey}/api/v1/editroleMenuAccess?role_master_id=${query?.role_master_id}&employee_id=${query?.employee_id}&entity_id=${query?.entity_id}`,
    updateRole: (query: any) =>
      `${databaseKey}/api/v1/editroleMenuAccess?role_master_id=${
        query?.role_master_id
      }&employee_ids=${query?.employee_ids?.join(',')}&entity_id=${
        query?.entity_id
      }`,

    employeGetById: (role_id: any, entity_id?: any) =>
      `${databaseKey}/api/v1/get_all_employeeBy_User_role/${role_id}?entity_id=${entity_id}`,
    getAllEmployeeByEntityId: (entity_id?: any) =>
      `${databaseKey}/api/v1/getAllEmployeeByEntityId/${entity_id}`,
  },
};

@Injectable({
  providedIn: 'root',
})
export class RbacMasterService {
  constructor(
    private http: HttpClient,
    private accessService: AccessControlService
  ) {}

  createRole(data: any): Observable<any> {
    return this.http.post(routes.roles.roleCreate(), data);
  }
  getRole(role: any): Observable<any> {
    return this.http.get(routes.roles.roleGet(role));
  }

  getByIdRole(role_id: any): Observable<any> {
    return this.http.get(routes.roles.roleGetById(role_id));
  }

  updateRole(role_id: any, data: any): Observable<any> {
    return this.http.put(routes.roles.roleUpdate(role_id), data);
  }

  getMenu(): Observable<any> {
    return this.http.get(routes.roleAssign.menuGet());
  }

  getSubmenu(): Observable<any> {
    return this.http.get(routes.roleAssign.menuGet());
  }

  getAllMenu(): Observable<any> {
    return this.http.get(routes.roleAssign.allMenuGte());
  }

  getRoleAssign(): Observable<any> {
    return this.http.get(routes.roleAssign.roleAssignGet());
  }

  createRoleAssign(data: any): Observable<any> {
    return this.http.get(routes.roleAssign.createRole(), data);
  }

  roleGetById(data: any): Observable<any> {
    return this.http.get(routes.roleAssign.roleGetById(data));
  }

  employeGetByroleId(role_id: any, entity_id?: any): Observable<any> {
    return this.http.post(
      routes.roleAssign.employeGetById(role_id, entity_id),
      {}
    );
  }

  getAllEmployeeByEntityId(entity_id?: any): Observable<any> {
    return this.http.get(routes.roleAssign.getAllEmployeeByEntityId(entity_id));
  }

  updateRoleAssign(query: any, data: any): Observable<any> {
    return this.http.put(routes.roleAssign.updateRole(query), data);
  }

  deleteRoleAssign(id: any): Observable<any> {
    return this.http.delete(routes.roles.roleDelete(id));
  }

  moduleAssignAction(id: any, data: any): Observable<any> {
    return this.http.post<any>(routes.roles.assignAction(data), data);
  }

  getAssignAction(id: any, data: any): Observable<any> {
    return this.http.post<any>(routes.roles.getAssignAction(id), data);
  }

  accessAssignAction(): ModuleAction {
    let activeMenuId: any = localStorage?.getItem('activeMenuId');
    let action: ModuleAction = {
      Read: false,
      Write: false,
      Delete: false,
    };
    if (!activeMenuId) {
      return action;
    }

    const access = this.accessService.hasReadWriteRemoveAccess(activeMenuId);
    if (access == null) {
      return action;
    }
    action.Read = access.read;
    action.Write = access.write;
    action.Delete = access.remove;
    return action;
  }
}

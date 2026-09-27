import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Login } from './login-modal/loginModal';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import {
  ModuleAction,
  RbacModule,
} from 'src/app/@shared/interface/core.interface';

const databaseKey: any = environment.servralUrl;

const routes = {
  auth: {
    login: () => `${databaseKey}/api/auth/signin`,
    vendorlogin: () => `${databaseKey}/api/auth/Vendorsignin`,
    getAllAccess_menu: (res: any) =>
      `${databaseKey}/api/v1/getroleMenuAccessdetails?employee_id=${res?.employee_id}&role_master_id=${res?.role_master_id}&entity_id=${res?.entity_id}`,
    create_Attendance: () => `${databaseKey}/api/v1/create_Attendance`,
    screenMode: () => `${databaseKey}/api/v1/create_Screen_On_Off`,
    getAssignAction: (id: any) =>
      `${databaseKey}/api/v1/getassignactionfucntion`,
    getAll_vendorMenu: (id: any) =>
      `${databaseKey}/api/v1/getAll_vendorMenu?id=${id}`,
    getAll_vendor_SubMenu: (menu_id: any) =>
      `${databaseKey}/api/v1/getAll_vendor_SubMenu?menu_id=${menu_id}`,
    changePassword: () => `${databaseKey}/api/auth/changepassword`,
    sendOTP: () => `${databaseKey}/api/auth/sendOTP`,
    forgotPassword: () => `${databaseKey}/api/auth/forgotpassword`,
    logoutAPI: () => `${databaseKey}/api/auth/logout`,
    timeoutlogout: () => `${databaseKey}/api/auth/timeoutlogout`,
    checkSession: () => `${databaseKey}/api/auth/checkSession`,
    getModuleAccess: (res: any) =>
      `${databaseKey}/api/v1/rbac/getModuleAccess/${res.employee_id}/${res.role_master_id}/${res.entity_id}`,
    customerVendorSendOTP: () => `${databaseKey}/api/auth/customerVendorSendOTP`,
    customerVendorLogin: () => `${databaseKey}/api/auth/customerVendorLogin`,
    ssoLogin: () => `${databaseKey}/api/auth/sso-login`,
    generateSsoToken: () => `${databaseKey}/api/auth/generate-sso-token`,
  },
};
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  idleStart$ = new Subject<void>();

  loginUserDetails: any;
  constructor(
    private http: HttpClient,
    private route: Router,
    private toster: ToastrService
  ) {}

  userS: any = new BehaviorSubject(null);

  private accessModules$ = new BehaviorSubject<RbacModule[]>([]);
  public allModules: RbacModule[] = [];

  entityDetail: any = new BehaviorSubject(null);

  signIn(data: any): Observable<any> {
    return this.http.post<any>(routes.auth.login(), data).pipe(
      tap((res) => {
        if (!res.hasAccess || !res.employee_id) {
          this.toster.warning(
            'Sorry, You do not have access of any modules in ERP',
            'Access Denied'
          );
          return;
        }

        this.authenticationUser(res);
      })
    );
  }

  ssoLogin(data: { token: string }): Observable<any> {
    return this.http.post<any>(routes.auth.ssoLogin(), data).pipe(
      tap((res) => {
        if (res && res.employee_id) {
          this.authenticationUser(res);
        }
      })
    );
  }

  logout() {
    this.route.navigate(['/master/ess/dashboard']);
    this.loginUserDetails = localStorage.getItem('signInUser');
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    sessionStorage.clear();
    if (this.loginUserDetails.type == 'TRIAL') {
      this.route.navigate(['/auth/trial-login']);
      localStorage.clear();
      localStorage.removeItem('signInUser');
    } else {
      this.route.navigate(['/auth/login']);
      localStorage.clear();
      localStorage.removeItem('signInUser');
    }
  }
  vendorlogout() {
    this.route.navigate(['/auth/vendor-login']);
    localStorage.removeItem('signInUser');
    localStorage.clear();
  }

  changePassword(data: any): Observable<any> {
    return this.http.put(routes.auth.changePassword(), data);
  }

  sendOTP(data: any): Observable<any> {
    return this.http.put(routes.auth.sendOTP(), data);
  }

  forgotPassword(data: any): Observable<any> {
    return this.http.put(routes.auth.forgotPassword(), data);
  }

  customerVendorSendOTP(data: any): Observable<any> {
    return this.http.put(routes.auth.customerVendorSendOTP(), data);
  }

  customerVendorLogin(data: any): Observable<any> {
    return this.http.put(routes.auth.customerVendorLogin(), data);
  }

  // -----------------------------
  // 1. Fetch Modules from API
  // -----------------------------
  // getAllAccess_Modules(req: any) {
  //   // Fix missing entity_id
  //   req.entity_id = req.entity_id || 1;

  //   return this.http.get<any>(routes.auth.getModuleAccess(req)).pipe(
  //     tap((response) => {
  //       const modules = response?.data ?? [];

  //       this.allModules = modules;

  //       // Push cleaned module list globally
  //       this.setAccessModules(modules);

  //       // Also store entity detail if needed
  //       this.setEntity_detail(response?.entity_details);
  //     })
  //   );
  // }

  // -----------------------------
  // 2. Write modules into BehaviorSubject
  // -----------------------------
  private setAccessModules(modules: RbacModule[]) {
    this.accessModules$.next(JSON.parse(JSON.stringify(modules))); // deep copy
  }

  // -----------------------------
  // 3. Expose modules as Observable
  // -----------------------------
  getAccessModules(): Observable<RbacModule[]> {
    return this.accessModules$.asObservable();
  }

  // -----------------------------
  // 4. To access current value instantly
  // -----------------------------
  getAccessModulesSnapshot(): RbacModule[] {
    return this.accessModules$.getValue();
  }

  // set and get entity detail
  setEntity_detail(modules: any) {
    this.entityDetail.next(modules);
  }

  getEntityDetail() {
    return this.entityDetail;
  }

  employeeAttendance(data: any) {
    return this.http.post<any>(routes.auth.create_Attendance(), data);
  }

  logoutAPI() {
    return this.http.get<any>(routes.auth.logoutAPI());
  }

  timeoutLogout() {
    return this.http.get<any>(routes.auth.timeoutlogout());
  }

  checkSession() {
    return this.http.get<any>(routes.auth.checkSession());
  }

  screenMode(data: any) {
    return this.http.post<any>(routes.auth.screenMode(), data);
  }

  getModuleActions(id: any, module: RbacModule) {
    const action: ModuleAction = { Read: false, Write: false, Delete: false };
    // console.log(module, 'module');
    const entity_id_raw = localStorage.getItem('selectedEntityId');
    const role_master_id_raw = localStorage.getItem('role_master_id');
    const loginData: any = localStorage.getItem('signInUser'); // if you store it
    const employee_details = JSON.parse(loginData);
    // console.log(employee_details?.employee_id);

    const parseMaybeNumber = (v: string | null) => {
      if (v === null) return null;
      const n = Number(v);
      return Number.isNaN(n) ? v : n;
    };

    const body = {
      role_module_master_id: module?.id ?? undefined,
      menu_master_id: module?.id ?? undefined,
      submenu_master_id: module?.id ?? undefined,
      employee_id: parseMaybeNumber(employee_details?.employee_id),
      role_master_id: parseMaybeNumber(role_master_id_raw),
      entity_id: parseMaybeNumber(entity_id_raw),
    };

    // console.log('getModuleActions -> body', body);

    return this.http.post<any>(routes.auth.getAssignAction(id), body).pipe(
      tap(
        (res) => {
          if (res?.data?.options) {
            localStorage.setItem(
              'local',
              window.btoa(JSON.stringify(res.data.options))
            );
          } else {
            localStorage.setItem('local', window.btoa(JSON.stringify(action)));
          }
        },
        (err) => {
          // console.error('getModuleActions error', err);
          localStorage.setItem('local', window.btoa(JSON.stringify(action)));
        }
      )
    );
  }

  //...........................................//

  authenticationUser(loginRes: any) {
    // const user = new Login(
    //   employee_official_email,
    //   token,
    //   img,
    //   name,
    //   employee_id,
    //   role,
    //   role_id
    // );
    this.userS.next(loginRes);
    localStorage.setItem('signInUser', JSON.stringify(loginRes));
    return loginRes;
  }

  vendorlogin(data: any): Observable<any> {
    return this.http
      .post<any>(routes.auth.vendorlogin(), data)
      .pipe(tap((res) => {}));
  }

  getAll_vendorMenu(id: any): Observable<any> {
    return this.http.get<any>(routes.auth.getAll_vendorMenu(id));
  }

  getAll_vendor_SubMenu(menu_id: any): Observable<any> {
    return this.http.get<any>(routes.auth.getAll_vendor_SubMenu(menu_id));
  }

  generateSsoToken(data: any): Observable<any> {
    return this.http.post<any>(routes.auth.generateSsoToken(), data);
  }
}

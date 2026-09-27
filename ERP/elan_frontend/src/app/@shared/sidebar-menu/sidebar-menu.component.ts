import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AccessData, RbacModule } from '../interface/core.interface';
import { AccessControlService } from '../services/access-control.service';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/environments/environment';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
})
export class SidebarMenuComponent implements OnInit, OnDestroy {
  moduleList: RbacModule[] = [];
  fullModuleList: RbacModule[] = [];
  dashboardActive: boolean = false;
  menuActive = false;
  activeModuleIndex: number | null = null;
  activeSubModuleIndex: number | null = null;
  menuSubscription: Subscription;
  searchTerm: string = '';

  constructor(
    private router: Router,
    private accessControl: AccessControlService,
    private authService: AuthService,
    private toast: ToastrService
  ) { }

  config: any;
  loginId: any;
  role_master_id: any;

  ngOnInit() {
    const loginUser = JSON.parse(localStorage.getItem('signInUser') || '{}');

    this.loginId = loginUser?.employee_id ?? null;
    this.role_master_id = localStorage.getItem('role_master_id');

    // First load modules
    this.getModule();

    // Dashboard active check
    this.dashboardActive = window.location.href.includes(
      'master/ess/dashboard'
    );
    this.menuActive = window.location.href.includes(
      'master/menu-management/menu-listing'
    );
  }

  getModule() {
    this.menuSubscription = this.accessControl
      .accessData$()
      .subscribe((res: AccessData | null) => {
        if (!res || !Array.isArray(res.modules)) {
          this.moduleList = [];
          return;
        }

        // Deep copy for safe modification
        this.fullModuleList = JSON.parse(JSON.stringify(res.modules));

        // Ensure safe active state
        const hasActive = res.modules.some((m) => m.isActive);

        if (!hasActive) {
          this.resetActiveStates(res.modules);
        }

        this.moduleList = res.modules;
        // console.log('Sidebar Modules Loaded:', this.moduleList);
        
        // If there's an active search term, re-apply it
        if (this.searchTerm) {
          this.onSearch(this.searchTerm);
        }
      });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    if (!term || term.trim() === '') {
      this.moduleList = JSON.parse(JSON.stringify(this.fullModuleList));
      return;
    }

    const lowerTerm = term.toLowerCase().trim();
    const filtered = JSON.parse(JSON.stringify(this.fullModuleList)) as RbacModule[];

    this.moduleList = filtered.filter(module => {
      const moduleMatches = module.name.toLowerCase().includes(lowerTerm);
      
      let childMatches = false;
      if (module.children) {
        module.children = module.children.filter(menu => {
          const menuMatches = menu.name.toLowerCase().includes(lowerTerm);
          
          let subChildMatches = false;
          if (menu.children) {
            menu.children = menu.children.filter(subMenu => {
              return subMenu.name.toLowerCase().includes(lowerTerm);
            });
            subChildMatches = menu.children.length > 0;
          }

          if (menuMatches || subChildMatches) {
            if (subChildMatches) menu.isActive = true; // Expand menu if submenu matches
            return true;
          }
          return false;
        });
        childMatches = module.children.length > 0;
      }

      if (moduleMatches || childMatches) {
        if (childMatches) module.isActive = true; // Expand module if child matches
        return true;
      }
      return false;
    });
  }

  private resetActiveStates(modules: RbacModule[]) {
    modules.forEach((m) => {
      m.isActive = false;

      m.children?.forEach((sub) => {
        sub.isActive = false;

        sub.children?.forEach((child) => {
          child.isActive = false;
        });
      });
    });
  }

  navToggle(moduleIndex: number, subModuleIndex: number | null): void {
    if (
      this.activeModuleIndex === moduleIndex &&
      this.activeSubModuleIndex === subModuleIndex
    ) {
      // Clicking the same module or submodule again, so close it
      this.activeModuleIndex = null;
      this.activeSubModuleIndex = null;
    } else {
      // Clicking a different module or submodule, so open it
      this.activeModuleIndex = moduleIndex;
      this.activeSubModuleIndex = subModuleIndex;
    }
  }

  navigateTo(url: string, nav: any) {
    this.router.navigate([url]);
  }

  ngOnDestroy(): void {
    this.menuSubscription.unsubscribe();
  }

  navBarToggle() {
    const selectedsidebar = document.querySelector('.left_sidebar');
    const selectedMainDiv = document.querySelector('.right-content-wrapper');

    if (selectedsidebar?.classList.contains('hide_click')) {
      selectedsidebar?.classList.remove('hide_click');
      selectedMainDiv?.classList.remove('full_width');
      return;
    }
    selectedsidebar?.classList.add('hide_click');
    selectedMainDiv?.classList.add('full_width');
  }

  // -------------------------------------------
  // 1. OPEN MAIN MODULE
  // -------------------------------------------
  openModule(module: RbacModule) {
    this.dashboardActive = false;

    this.moduleList?.forEach((m) => {
      m.isActive = m.id === module.id ? !m.isActive : false;
    });

    localStorage.setItem('activeMenuId', String(module?.id ?? ''));
  }

  // -------------------------------------------
  // 2. OPEN MENU → (Inside a Module)
  // -------------------------------------------
  openMenu(menu: RbacModule, module: RbacModule) {
    module?.children?.forEach((sub) => {
      sub.isActive = sub.id === menu.id ? !sub.isActive : false;
    });

    // 👉 If menu has NO children → handled by routerLink in HTML
    if (!menu?.children?.length) {
      // Navigation is now handled by [routerLink]
    }

    localStorage.setItem('activeMenuId', String(menu?.id ?? ''));
  }

  // -------------------------------------------
  // 3. OPEN SUB-MENU → (Inside a Menu)
  // -------------------------------------------
  openSubMenu(subMenu: RbacModule, menu: RbacModule, module: RbacModule) {
    // Reset & activate correct sub-sub menu
    module?.children?.forEach((main) => {
      main?.children?.forEach((child) => {
        child.isActive = child.id === subMenu.id;
      });
    });

    // Navigation is now handled by [routerLink]
    // this.router.navigateByUrl(`master/${url}`);

    localStorage.setItem('activeMenuId', String(subMenu?.id ?? ''));
  }

  // -------------------------------------------
  // 4. URL BUILDER (Reusable)
  // -------------------------------------------
  public buildUrl(...segments: (string | undefined | null)[]): string {
    return segments.filter(Boolean).join('/');
  }

  public getFullUrl(module: RbacModule, menu?: RbacModule, subMenu?: RbacModule): string {
    const segments = [module.path, menu?.path, subMenu?.path];
    return `/master/${this.buildUrl(...segments)}`;
  }

  switchToHrms() {
    let empId = localStorage.getItem('EmpMainId');
    let email: any = '';

    const userRaw = localStorage.getItem('loginUserDetails') || localStorage.getItem('signInUser');
    if (userRaw) {
      try {
        const user = JSON.parse(userRaw);
        empId = user?.employee_id || empId;
        email = user?.employee_official_email || user?.email || '';
      } catch (e) {
        console.error('Error parsing user details:', e);
      }
    }

    if (!empId) {
      this.toast.error('User session not found.');
      return;
    }

    this.authService.generateSsoToken({ employee_id: empId, email }).subscribe({
      next: (res: any) => {
        if (res.success && res.ssoToken) {
          const hrmsUrl = (environment as any).hrmsUrl || 'http://localhost:4201';
          window.open(`${hrmsUrl}/auth/sso?token=${res.ssoToken}`, '_blank');
        } else {
          this.toast.error(res?.message || 'Failed to generate HRMS session token');
        }
      },
      error: (err: any) => {
        console.error('SSO token generation error:', err);
        this.toast.error('Failed to connect to SSO service');
      },
    });
  }
}

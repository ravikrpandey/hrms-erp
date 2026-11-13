import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  Input,
} from '@angular/core';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { HeadService } from '../services/head.service';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';
import { LeadService } from '../services/lead.service';
import { NotificationPendingTaskService } from '../services/notification-pending-task.service';
import moment from 'moment';
import { NotificationServiceService } from '../services/notification/notification-service.service';
import { CommunicationNotificationService } from '../services/notification/communication-notification.service';
import { EntityMasterService } from '../services/entity-master/entity-master.service';
import { LanguageTranslateService } from '../services/language_translate/language-translate.service';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { MiscellaneousService } from '../services/service/miscellaneous.service';
import { ToastrService } from 'ngx-toastr';


import { Subject, takeUntil, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';

const databaseKey: any = environment.serverUrl;

// import { MyPendingTaskComponent } from '../@modules/hrms/my-pending-task/my-pending-task.component';
interface Attendance {
  employee_id: string;
  punching_date: string;
  punching_time: string;
  punching_status: 'OUT';

}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements AfterViewInit, OnDestroy, OnInit {
  //notification
  @ViewChild('box', { static: true }) box: ElementRef<any>;
  // box:any  = document.getElementById('box');
  leftNavToggle = false;
  down: boolean = true;
  boxHeight: any = '170%';
  boxWidth: any = '600px';
  boxOpacity: number = 1;
  @Input() show: boolean = false;
  condition = this.show;
  check: boolean = true;
  @ViewChild('HRMS') HRMS: ElementRef;
  clicked: boolean = false;
  data: any;
  parse: any;
  name: any;
  image: any;
  imagePath: any = 'assets//icons/icon_kiran/employee.png';
  notExist: any;
  superM: any;
  role_id: any;
  iconBell: any;
  Login_user_id: any = localStorage.getItem('loginUserDetails');
  loginUserId: any = JSON.parse(this.Login_user_id).employee_id;
  loginUserName: any = JSON.parse(this.Login_user_id).first_name;

  showNotifications = false;
  badges_count = 0;
  rowDataNotifications: any = [];
  rowDataOther: any = [];
  selectedYearId: number | null = null;

  // superModule:any=[
  //   {menuName:'HRMS',superModule_link:'hrms',first_Icon:'fas fa-user-tie',last_Icon:'fa fa-chevron-down',superModule_id:1},
  //   {menuName:'Sales & Marketing',superModule_link:'lead',first_Icon:'fa fa-funnel-dollar',last_Icon:'fa fa-chevron-down',superModule_id:2},
  //   {menuName:'LMS',superModule_link:'lms',first_Icon:'fa fa-edit',last_Icon:'fa fa-chevron-down',superModule_id:3},
  //   {menuName:'Administration',superModule_link:'itticket',first_Icon:'fa fa-user-shield',last_Icon:'fa fa-chevron-down',superModule_id:4},
  //   {menuName:'Finance & Accounting',superModule_link:null,first_Icon:'fas fa-calculator',last_Icon:'fa fa-chevron-down',superModule_id:5},
  //   ]
  superModule: any;

  public isScrolled = false;
  public farward1: boolean = true;
  notificationData: any;
  bellNotification: boolean;
  notification_counts: any;
  // badges_count: any;
  hidden: string = 'none';
  menuTrigger: any;
  rowData: any;
  lengths: any;
  // rowDataNotifications: any;
  // rowDataOther: any;
  formData: any = {};
  loading = false;
  selectedEntity: any;
  financial_id: any;
  entityDetail: any;
  baseUrl: any;
  menuSubscription: Subscription;
  loginUserDetails: any;
  offset = 0;
  currentLanguage: string = 'en';
  entity_Id: any;
  notificarray: any = 0;
  financialYearList: any[] = [];

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private head: HeadService,
    private _authservice: AuthService,
    private _location: Location,
    public dialog: MatDialog,
    private leade: LeadService,
    private renderer: Renderer2,
    private route: Router,
    private leadService: LeadService,
    private notification: NotificationPendingTaskService,
    private _notification: NotificationServiceService,
    private communition: CommunicationNotificationService,
    private entityService: EntityMasterService,
    private language_service: LanguageTranslateService,
    private router: Router,
    private lead: LeadService,
    private $miscellaneous: MiscellaneousService,
    private toast: ToastrService,
    private http: HttpClient,
  ) {
    this.baseUrl = environment.serverUrl;
    this.data = localStorage.getItem('loginUserDetails');
    this.parse = JSON.parse(this.data);

    if (this.parse?.employee_photo) {
      if (this.parse?.employee_photo !== null) {
        let url = this.parse.employee_photo.split('/');
        this.notExist = url[url.length - 1];
      }
    } else {
      this.notExist = 'undefined';
    }
  }

  search$ = new Subject<string>();
  searchTerm: string = '';
  searchResults: any[] = [];
  showDropdown = false;

  allRoutes: any[] = [];
  filteredRoutes: any[] = [];
  entity_id: any;

  notification_count() {
    this._notification
      .notification_count(this.loginUserId)
      .subscribe((res: any) => {
        console.log(res, 'header notification');

        this.notification_counts = res;
        this.badges_count = res.data;
        if (this.badges_count == 0) {
          this.hidden = 'hidden';
        }
      });
  }

  toggleNotificationDropdown() {
    this.showNotifications = !this.showNotifications;
  }

  get_all_user_notification() {
    const payload = {
      employee_id: this.loginUserId,
      entity_id: this.entity_Id,
      limit: '10',
      offset: this.offset.toString(),
      is_read: 'unread',
    };
    this.loading = true;
    this._notification.get_all_user_notification(payload).subscribe(
      (res: any) => {
        this.rowDataNotifications = res.data;
        this.notificarray = this.rowDataNotifications.length;
        this.lengths = res.count;
        this.loading = false;
      },
      (error: any) => {
        this.rowDataNotifications = [];
        this.notificarray = this.rowDataNotifications.length;
        this.lengths = 0;
        this.loading = false;
      }
    );
  }

  ngOnInit(): void {
    this.localStorage();
    this.get_all_user_notification();

    this.getAllAccess_Modules(null);
    this.notificationData = this.notification.dummayForCheck;
    this.getEntityList();

    this.getEntityDetail();
    this.getFinancialYear();

    this.loginUserDetails = localStorage.getItem('loginUserDetails');
    this.loginUserDetails = JSON.parse(this.loginUserDetails);
    this.entity_id = localStorage.getItem("selectedEntityId");



    const { employee_id, role_master_id } = this.loginUserDetails;
    const apiUrl = `${databaseKey}/api/v1/getroleMenuAccessdetails?employee_id=${employee_id}&role_master_id=${role_master_id}&entity_id=${this?.entity_id}&domain=${'kiran_automation_tenant'}`;

    this.http.get(apiUrl).subscribe((res: any) => {
      if (res.code === 200) {
        this.allRoutes = this.prepareGlobalRoutes(res.data);
        console.log('🔹 All routes ready for search:', this.allRoutes);
      }
    });
  
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((term: string) => {
        this.performSearch(term);
      });

  }



  prepareGlobalRoutes(data: any[]) {
    const searchList: any[] = [];
    data.forEach((module: any) => {
      const modulePath = `/${module.module_master_link}`;

      let moduleDefaultPath = modulePath;
      if (module.HRMS_RBAC_MENU_MASTER && module.HRMS_RBAC_MENU_MASTER.length > 0) {
        const firstMenu = module.HRMS_RBAC_MENU_MASTER[0];
        if (firstMenu.HRMS_RBAC_SUBMENU_MASTER && firstMenu.HRMS_RBAC_SUBMENU_MASTER.length > 0) {
          moduleDefaultPath = `${modulePath}/${firstMenu.menu_master_link}/${firstMenu.HRMS_RBAC_SUBMENU_MASTER[0].submenu_masters_link}`;
        } else if (firstMenu.menu_master_link) {
          moduleDefaultPath = `${modulePath}/${firstMenu.menu_master_link}`;
        }
      }

      // Push module-level route
      searchList.push({
        name: module.role_module_master_name,
        type: 'Module',
        path: moduleDefaultPath
      });

      // Loop over menus
      module.HRMS_RBAC_MENU_MASTER?.forEach((menu: any) => {
        const menuPath = `${modulePath}/${menu.menu_master_link}`;

        searchList.push({
          name: menu.menu_master_name,
          type: 'Menu',
          path: menuPath
        });

        // Loop over submenus
        menu.HRMS_RBAC_SUBMENU_MASTER?.forEach((submenu: any) => {
          const submenuPath = `${menuPath}/${submenu.submenu_masters_link}`;

          searchList.push({
            name: submenu.submenu_master_name,
            type: 'Submenu',
            path: submenuPath
          });
        });
      });
    });

    // Add Project Management and Tasks to global search
    searchList.push(
      { name: 'Project Management', type: 'Module', path: '/project-management/projects' },
      { name: 'Projects', type: 'Menu', path: '/project-management/projects' },
      { name: 'Tasks', type: 'Menu', path: '/project-management/tasks' },
      { name: 'Timesheets', type: 'Menu', path: '/project-management/timesheet' },
      { name: 'Project Expense Report', type: 'Menu', path: '/project-management/expense-report' }
    );

    return searchList;
  }

  _ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm.trim());
  }
  performSearch(term: string): void {
    if (!term || term.length < 2) {
      this.showDropdown = false;
      this.searchResults = [];
      return;
    }

    const lowerTerm = term.toLowerCase();
    this.searchResults = this.allRoutes
      .filter((r: any) => r.name) 
      .filter((r: any) => r.name.toLowerCase().includes(lowerTerm));

    this.showDropdown = this.searchResults.length > 0;
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
    this.showDropdown = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target && !target.closest('.search-box')) {
      this.showDropdown = false;
    }
  }


  filterRoutes() {
    const term = this.searchTerm.toLowerCase();
    if (term.length > 1) {
      this.filteredRoutes = this.allRoutes.filter((r: any) =>
        r.name.toLowerCase().includes(term)
      );
      this.showDropdown = true;
    } else {
      this.showDropdown = false;
    }
  }

  navigateTo(path: string, item: any) {
    if (!path) return;

    let targetPath = path.trim();
    if (!targetPath.startsWith('/')) {
      targetPath = '/' + targetPath;
    }
    if (!targetPath.startsWith('/master')) {
      targetPath = '/master' + targetPath;
    }

    this.router.navigateByUrl(targetPath);
    this.showDropdown = false;
    this.searchTerm = '';
  }




  localStorage() {
    let entity: any = localStorage.getItem('selectedEntityId');
    this.entity_Id = JSON.parse(entity);
  }

  getEntityDetail() {
    this.menuSubscription = this._authservice
      .getEntityDetail()
      .subscribe((res: any) => {
        this.entityDetail = res;
      });
  }

  getAllAccess_Modules(entity_id: any) {
    let lg: any = localStorage.getItem('loginUserDetails');
    let loginUser = JSON.parse(lg);
    // console.log(loginUser, "localstoragedata")
    this.role_id = loginUser.role_id;

    let role_master_id = localStorage.getItem('role_master_id');
    let selectedEntityId = localStorage.getItem('selectedEntityId');
    let req = {
      employee_id: loginUser?.employee_id,
      role_master_id: role_master_id,
      entity_id: entity_id ? entity_id : selectedEntityId,
    };
    let sub = this._authservice.getAllAccess_Modules(req).subscribe((res) => {
      this.superM = this._authservice
        .getSuper_Modules()
        .subscribe((res: any) => {
          this.superModule = res;
          this._authservice.setSuperModulesForMaster(this.superModule);
        });
      sub?.unsubscribe();
      if (entity_id) {
        this.route.navigate(['master/ess/dashboard']);
        setTimeout(() => {
          location.reload();
        }, 200);
      }
    });
  }

  getFinancialYear() {
    this.$miscellaneous.getAllActivefinancial_year().subscribe((res) => {
      if (res) {
        this.financialYearList = res?.data;

        const today = new Date();

        // Check if financial_id is already stored
        const financial_id = localStorage.getItem('financial_id');
        if (financial_id) {
          this.selectedYearId = Number(financial_id);
        } else {
          // Find the financial year based on today's date
          const currentFY = this.financialYearList.find((fy: any) => {
            const [startYear, endYear] = fy.financial_year.split('-').map(Number);
            const startDate = new Date(startYear, 3, 1); // 1 April of startYear (Month is 0-indexed)
            const endDate = new Date(endYear, 2, 31, 23, 59, 59); // 31 March of endYear
            return today >= startDate && today <= endDate;
          });

          if (currentFY) {
            this.selectedYearId = currentFY.id;
            localStorage.setItem('financial_id', String(currentFY.id));
          } else {
            // fallback → pick first financial year in the list
            this.selectedYearId = null;
            this.toast.error("This financial year is not available!");
          }
        }
      }
    });
  }


  getFinancialId(event: any) {
    localStorage.setItem('financial_id', event?.value);
    location.reload();
  }

  setLanguage(lang: string) {
    this.currentLanguage = lang;
    // Implement logic to change language settings or trigger translation
    console.log('Selected language:', lang);
    this.language_service.setLanguage(lang);
    // Example: You can implement language switching logic here
  }

  toggleNotifi() {
    // this.down = false;
    // this.show = !this.show
    const boxElement: HTMLElement = this.box?.nativeElement;
    console.log(boxElement, 'boxElement');
  }
  onHoverOut() {
    // this.show = !this.show
  }
  notification_read() { }

  ngAfterViewInit(): void {
    // For language converter start
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.text = `function googleTranslateElementInit() {
      new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
    }`;
    this.renderer.appendChild(document.body, script);

    const googleTranslateScript = this.renderer.createElement('script');
    googleTranslateScript.src =
      '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    this.renderer.appendChild(document.body, googleTranslateScript);
    // For language converter end

    this.onimageLoadOrNot(this.parse?.employee_photo);
    this.getAllAccessModule();
  }

  getAllAccessModule() {
    let lg: any = localStorage.getItem('loginUserDetails');
    let loginUser = JSON.parse(lg);

    let role_master_id = localStorage.getItem('role_master_id');
    let entity_id = localStorage.getItem('selectedEntityId');
    let req = {
      employee_id: loginUser?.employee_id,
      role_master_id: role_master_id,
      entity_id: entity_id,
    };
    let sub = this._authservice.getAllAccess_Modules(req).subscribe((res) => {
      //
      this.superM = this._authservice
        .getSuper_Modules()
        .subscribe((res: any) => {
          //
          this.superModule = res;
          let btn: any = document.querySelectorAll('.btn');
          btn.forEach(async (e: any) => {
            let isExist = await e.classList;
            if (isExist) {
              if (isExist.contains('active')) {
                //
                this._authservice.setSubSuperModules(Number(e.id));
              }
            }
          });
          this._authservice.setSuperModulesForMaster(this.superModule);
        });
      sub?.unsubscribe();
    });
  }

  toggleLeftNav(val: any) {
    if (val) {
      document.getElementById('sidebar')?.classList.add('collapsed');
      document.getElementById('sidebar')?.classList.add('manage-sidebar');
      document
        .getElementsByClassName('router-page')[0]
        ?.classList.add('router-page-remove');
      document.getElementsByClassName('footer')[0]?.classList.add('footer_e');
    } else {
      document.getElementById('sidebar')?.classList.remove('collapsed');
      document.getElementById('sidebar')?.classList.remove('manage-sidebar');
      document
        .getElementsByClassName('router-page')[0]
        ?.classList.remove('router-page-remove');
      document
        .getElementsByClassName('footer')[0]
        ?.classList.remove('footer_e');
    }
  }

  sidebar() { }

  onLogout() {
    Swal.fire({
      title: 'Are you sure want to Logout?',
      icon: 'warning',
      showCancelButton: true,

      cancelButtonColor: '#5d6c7c',
      confirmButtonColor: '#f44336',
      confirmButtonText: 'Log out',
      cancelButtonText: 'Not Now',
    }).then((result) => {
      if (result.value) {
        this._authservice.logout();
        this.handleEmployee_Attendance(this.parse.employee_id);
        this.head.loginIn.next(false);
        localStorage.removeItem('token');
        localStorage.removeItem('EmpMainId');
      } else if (result.dismiss === Swal.DismissReason.cancel as any) {
      }
    });
  }
  openSlide() { }

  handleEmployee_Attendance(empId: any) {
    let date = new Date();
    let outDate = moment(date).format('YYYY-MM-DD');
    let outTime = moment(date).format('HH:mm');

    let body: Attendance = {
      employee_id: empId,
      punching_date: outDate,
      punching_time: outTime,
      punching_status: 'OUT',
    };
    this._authservice.employeeAttendance(body).subscribe(
      (res) => { },
      (err) => { }
    );
  }

  backBtn() {
    this._location.back();
  }

  seeProfile(path: any) {
    if (
      this.notExist === 'undefined' ||
      this.loginUserDetails?.employee_photo === null
    ) {
      Swal.fire({
        imageUrl: this.loginUserDetails?.employee_photo
          ? this.baseUrl + '/' + this.loginUserDetails?.employee_photo
          : this.imagePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonColor: '#5d6c7c',
        confirmButtonText: 'Ok',
      });
    } else {
      Swal.fire({
        imageUrl: this.loginUserDetails?.employee_photo
          ? this.baseUrl + '/' + this.loginUserDetails?.employee_photo
          : this.imagePath,
        imageHeight: 250,
        imageAlt: 'Profile Image',
        confirmButtonColor: '#5d6c7c',
        confirmButtonText: 'Ok',
      });
    }
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: any) {
    const element: any = document.querySelector('.header');
    let position = element?.offsetTop;
    if (position > 50) {
      this.isScrolled = true;
      this.leade.setColor(this.isScrolled);
    } else {
      this.isScrolled = false;
      this.leade.setColor(this.isScrolled);
    }
  }
  ConfigureMaster(className: string) {
    //
    this.renderer.removeClass(this.HRMS.nativeElement, className);
    // this.head.loginIn.next(false);
    this.head.nav.subscribe((data) => {
      this.farward1 = data;
      this.head.loginIn.next(true);
    });
  }
  hrmsActive(className: any) {
    this.renderer.addClass(this.HRMS.nativeElement, className);
  }
  onimageLoadOrNot(image: any) {
    let img: any = document.querySelector('.profileImg');
    if (img.complete) {
    } else {
      // img.addEventListener('load', ()=>{
      //
      // })
      img.addEventListener('error', () => {
        this.parse.employee_photo = this.imagePath;
      });
    }
  }
  clickOnNavIcon() { }
  getSuperModuleId(menuId: any) {
    this._authservice.setSubSuperModules(Number(menuId));
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  ngOnDestroy(): void {
    this.superM?.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }
  myPendingTask(e: any) {
    this.notification.notifications = true;
    this.bellNotification = true;
  }
  triggerFunction1() {
    this.show = false;
    // const dialogRef = this.dialog.open(AllNotificationComponent, {
    //   });
    // dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
    // this.communition.triggerFunction();
    // const data={
    //   status:'INACTIVE'
    // }
    // this._notification.edit_notification(this.loginUserId,data).subscribe((res)=>{
    //   console.log(res,"res check");
    // })
    // setTimeout(() => {
    // this.notification_count();
    // }, 100);
    // this.toggleNotifi()
  }

  clearAllNotifications() {
    this._notification
      .update_all_notif_read_status(this.loginUserId, this.entity_Id)
      .subscribe((res: any) => {
        console.log(res);

        this.get_all_user_notification();
      });
  }

  notificationnav() {
    this.show = false;
  }

  handleNotificationClick(notification: any) {
    if (notification.is_read == false) {
      this._notification
        .update_notif_read_status(notification.hrms_notification_id)
        .subscribe((res: any) => {
          this.get_all_user_notification();
          this.show = false;
        });
    }
    switch (notification.notification_type) {
      case 'SHORTLIST_CAND':
        this.router.navigate(['/master/recruitment/shortlisted-candidate']);
        break;
      case 'MANPOWER':
        this.router.navigate([
          '/master/ess/manpower-request/my-request-manpower',
        ]);
        break;
      case 'INTERVIEW':
        this.router.navigate(['/master/recruitment/scheduled-interview']);
        break;
      case 'TRAVEL_APPROVAL':
        this.router.navigate([
          '/master/ess/approve-travel-request/travel-request-approval-list',
        ]);
        break;
      case 'TRAVEL_REQ':
        this.router.navigate([
          '/master/ess/travel-request/travel-request-list',
        ]);
        break;
      case 'EXP_REQ':
        this.router.navigate([
          '/master/expense-management/travel-expense/travel-expense-list',
        ]);
        break;
      case 'CANDIDATE_PROF':
        this.router.navigate(['/master/recruitment/candidate-profile']);
        break;
      case 'LEAVE_APPROVE':
        this.router.navigate(['/master/ess/leave-approval/unapproved-leave']);
        break;
      case 'LEAVE_APPLY':
        this.router.navigate(['/master/ess/leave-apply']);
        break;
      case 'LEAD_SUMMARY':
        this.router.navigate(['/master/crm/lead-system/lead-summary']);
        break;
      case 'INTERNAL_CC_ACTION':
      case 'INTERNAL_COMPILANCE_ACTION':
      case 'INTERNAL_CONTACTFOR_ACTION':
      case 'DELEGATE LEADS':
        this.router.navigate(['/master/crm/lead-system/lead-summary'], {
          queryParams: { tab: 3 },
        });
        break;
      case 'LIBRARY APPROVAL':
        this.router.navigate(['/master/crm/itinerary/libraries/content'],)
        break;
      case 'SUPPLIER APPROVAL':
        this.router.navigate(['/master/crm/itinerary/supplier/supplier-list'],)
        break;
      case 'COMPOFF_EMPLOYEE':
        this.router.navigate(['/master/ess/assign-comp-off-list'])
        break;
      default:
        console.log('Unknown notification type');
        break;
    }
  }

  nav(e: any) {
    e.stopPropagation();
  }
  triggerFunction(e: any) {
    e.stopPropagation();
    this.show = !this.show;
  }

  scrollLeft() {
    let container = document.querySelector('.right-side-image');
    container?.scrollBy(-350, 0);
  }
  scrollRight() {
    let container = document.querySelector('.right-side-image');
    container?.scrollBy(350, 0);
  }

  //notificaiton
  get_notification(id: any) {
    this._notification.get_notification(id).subscribe((res: any) => {
      const notifications: any = [];
      const otherData: any = [];

      res.data.forEach((item: any) => {
        if (Array.isArray(item)) {
          // If the item is an array, it's a notification group
          notifications.push(...item);
        } else {
          // Otherwise, it's other data
          otherData.push(item);
        }
      });

      this.rowDataNotifications = notifications.reverse();
      this.rowDataOther = otherData;
      this.lengths =
        this.rowDataNotifications.length + this.rowDataOther.length;
    });
  }

  // Entity list start
  entityList: any = [];
  originalEntityList: any = [];
  filterEntityList: any;
  getEntityList = () => {
    let entityList: any = localStorage.getItem('entityList');
    this.entityList = JSON.parse(entityList);
    this.filterEntityList = [...this.entityList]
    this.originalEntityList = this.entityList
    let entity_id = localStorage.getItem('selectedEntityId');
    this.selectedEntity = Number(entity_id);
  };

  selectEntity(e: any) {
    localStorage.setItem('selectedEntityId', e?.value);
    this.getAllAccess_Modules(e?.value);
  }

  onFinancialYearChange(event: any) {
    const selectedId = event.value;
    if (selectedId) {
      localStorage.setItem('financial_id', selectedId);
      this.selectedYearId = selectedId;

      // 🔄 reload page with updated year id
      location.reload();
    }
  }

  entityfilter(event: any) {
    const searchValue = event?.target?.value?.toLowerCase().trim() || '';
    if (!searchValue) {
      this.entityList = [...this.originalEntityList];
    } else {
      this.entityList = this.originalEntityList.filter((item: any) =>
        item?.company_branch?.toLowerCase().includes(searchValue)
      );
    }
  }

  switchToErp() {
    const user = this.loginUserDetails || JSON.parse(localStorage.getItem('loginUserDetails') || '{}');
    const empId = user?.employee_id || localStorage.getItem('EmpMainId');
    const email = user?.employee_official_email || user?.user_email;
    if (!empId) {
      this.toast.error('User session not found.');
      return;
    }
    this._authservice.generateSsoToken({ employee_id: empId, email }).subscribe({
      next: (res: any) => {
        if (res.success && res.ssoToken) {
          let erpUrl = (environment as any).erpUrl;
          if (!erpUrl) {
            erpUrl = window.location.pathname.startsWith('/hrms-erp')
              ? `${window.location.origin}/hrms-erp/erp`
              : `${window.location.origin}/erp`;
          }
          window.open(`${erpUrl.replace(/\/$/, '')}/auth/sso?token=${res.ssoToken}`, '_blank');
        } else {
          this.toast.error(res.message || 'Failed to generate ERP session token');
        }
      },
      error: (err: any) => {
        console.error('SSO token generation error:', err);
        this.toast.error('Failed to connect to SSO service');
      }
    });
  }

}

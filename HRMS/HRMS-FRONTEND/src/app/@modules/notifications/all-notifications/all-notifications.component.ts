import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ContractNotificationService } from 'src/app/@shared/services/legal-management/contract-notification.service';
import { NotificationServiceService } from 'src/app/@shared/services/notification/notification-service.service';

@Component({
  selector: 'app-all-notifications',
  templateUrl: './all-notifications.component.html',
  styleUrls: ['./all-notifications.component.scss']
})
export class AllNotificationsComponent {
  unreadCount: number = 0;
  selectedTab: number = 0;
  loginUser: any;
  entity_Id: any;
  financial_id: any;
  offset: any = 0;
  loading: boolean;
  rowDataNotifications: any;
  notificarray: any;
  lengths: any;
  is_read_value: any;

  constructor(
    private _notification: NotificationServiceService, private router: Router,
    private _contractNotificationServ: ContractNotificationService
  ) {

  }

  ngOnInit() {
    this.localStorage()
    this.onTabChange(this.selectedTab)

  }

  localStorage() {
    let a: any = localStorage.getItem('signInUser');
    let entity: any = localStorage.getItem('selectedEntityId');
    let financialid: any = localStorage.getItem('financial_id');
    this.loginUser = JSON.parse(a);
    this.entity_Id = JSON.parse(entity);
    this.financial_id = JSON.parse(financialid);
  }

  get_all_user_notification(is_read: any) {
    const payload = {
      "employee_id": this.loginUser.employee_id,
      "entity_id": this.entity_Id,
      "limit": "10",
      "offset": this.offset.toString(),
      "is_read": is_read
    }
    this.loading = true;
    this._notification.get_all_user_notification(payload).subscribe((res: any) => {
      this.rowDataNotifications = res.data;
      this.notificarray = this.rowDataNotifications.length;
      this.unreadCount = res.total_notif;
      this.loading = false;

    }, () => {
      this.rowDataNotifications = [];
      this.unreadCount = 0;
      this.notificarray = 0
      this.loading = false;
    })

  }

  handleNotificationClick(notification: any) {
    if (notification.is_read == false) {
      this._notification.update_notif_read_status(notification.hrms_notification_id).subscribe((res: any) => {

      })
    }
    switch (notification.notification_type) {
      case 'SHORTLIST_CAND':
        this.router.navigate(['/master/recruitment/shortlisted-candidate']);
        break;
      case 'MANPOWER':
        this.router.navigate(['/master/ess/manpower-request/my-request-manpower']);
        break;
      case 'INTERVIEW':
        this.router.navigate(['/master/recruitment/scheduled-interview']);
        break;
      case 'TRAVEL_APPROVAL':
        this.router.navigate(['/master/ess/approve-travel-request/travel-request-approval-list']);
        break;
      case 'TRAVEL_REQ':
        this.router.navigate(['/master/ess/travel-request/travel-request-list']);
        break;
      case 'EXP_REQ':
        this.router.navigate(['/master/expense-management/travel-expense/travel-expense-list']);
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
      case 'LEAVE_APPLY':
        this.router.navigate(['/master/ess/leave-apply']);
        break;
      case 'INTERNAL_CC_ACTION':
      case 'INTERNAL_COMPILANCE_ACTION':
      case 'INTERNAL_CONTACTFOR_ACTION':
      case 'LEGAL_ACTION':
      case 'LEGAL_ASSIGNED':
        this._contractNotificationServ.contractsNotificationActions(notification);
        break;
      case 'DELEGATE LEADS':
        this.router.navigate(['/master/crm/lead-system/lead-summary'], { queryParams: { tab: 3 } })
        break;
      case 'LIBRARY APPROVAL':
        this.router.navigate(['/master/crm/itinerary/libraries/content'],)
        break;
      case 'SUPPLIER APPROVAL':
        this.router.navigate(['/master/crm/itinerary/supplier/supplier-list'],)
        break;
      case 'COMPOFF_EMPLOYEE':
        this.router.navigate(['/master/ess/assign-comp-off-list'],)
        break;
      default:
        console.log('Unknown notification type');
        break;
    }
  }

  markAllAsRead() {
    this._notification.update_all_notif_read_status(this.loginUser.employee_id, this.entity_Id).subscribe((res: any) => {
      this.get_all_user_notification(this.is_read_value)
    })
  }

  onTabChange(event: any) {
    this.selectedTab = event;
    this.is_read_value = '';

    if (this.selectedTab === 0) {
      this.is_read_value = 'all';
    } else if (this.selectedTab === 1) {
      this.is_read_value = 'read';
    } else if (this.selectedTab === 2) {
      this.is_read_value = 'unread';
    }

    this.get_all_user_notification(this.is_read_value);
  }
}

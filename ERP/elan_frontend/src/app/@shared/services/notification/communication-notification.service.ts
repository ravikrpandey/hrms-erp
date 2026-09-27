import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationNotificationService {
  constructor(private route:Router) { }
  private triggerSource = new BehaviorSubject<boolean>(false);
  trigger$ = this.triggerSource?.asObservable();

  triggerFunction() {
    console.log("trigger header")
    // this.route.navigate(['master/header-menu/notification/all-notification'])
    this.triggerSource?.next(true);
  }
}

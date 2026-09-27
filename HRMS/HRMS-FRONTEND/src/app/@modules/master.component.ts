import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { filter, from } from 'rxjs';
import { HeadService } from 'src/app/@shared/services/head.service';
import { LoaderDirective } from '../@shared/directives/loader.directive';
import { LeadService } from '../@shared/services/lead.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from '../@auth/auth-material/auth.service';
import Swal from 'sweetalert2';
import moment from 'moment';
import { HeaderComponent } from '../@shared/header/header.component';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss'],
})
export class MasterComponent implements OnInit, OnDestroy {
  clicked: boolean = false;
  isTop: boolean;
  superModule: any;

  mouduleData: any;
  loginUser: any;

  @ViewChild(LoaderDirective) Loader: LoaderDirective;

  constructor(
    private head: HeadService,
    private router: Router,
    private leade: LeadService,
    private _authService: AuthService
  ) {}
  url: any;
  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(lg);

    this.sleepMode();
    this.head.clicked.subscribe((data) => {
      this.clicked = data;
    });

    this.leade.getColor().subscribe((res: any) => {
      this.isTop = res;
    });
    this.superModule = this._authService
      .getSuperModulesForMaster()
      .subscribe(async (res: any) => {
        this.mouduleData = res;
        console.log(this.mouduleData, 'this.mouduleData');

        if (this.router.url === '/master') {
          if (res && res.length !== 0) {
            this.router.navigate([`master/${res[0]?.superModule_link}`]);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.superModule.unsubscribe();
  }

  sleepMode() {
    let lastTime = new Date().getTime();
    let tiemIn = setInterval(() => {
      let currentTime = new Date().getTime();
      if (currentTime > lastTime + 2000 * 2) {
        this.screenMode(lastTime, currentTime);
      }
      lastTime = currentTime;
    }, 2000);
  }

  screenMode(lastTime: any, currentTime: any) {
    let screenOf = new Date(lastTime);
    let screenOn = new Date(currentTime);

    let data: any = {
      employee_id: this.loginUser.employee_id,
      screen_on_time: moment(screenOn).format('hh:mm A'),
      screen_on_date: moment(screenOn).format('YYYY-MM-DD'),
      screen_off_time: moment(screenOf).format('hh:mm A'),
      screen_off_date: moment(screenOf).format('YYYY-MM-DD'),
    };
    if (data.screen_on_time !== data.screen_off_time) {
      let ontime = moment(screenOn).format('mm');
      let offtime = moment(screenOf).format('mm');
      if (Number(ontime) !== Number(offtime) + 1) {
        if (offtime == '59' && ontime == '00') {
          return;
        }
        setTimeout(() => {
          this._authService.screenMode(data).subscribe(
            (res) => {},
            (err) => {}
          );
        }, 2000);
      }
    }
  }

  @HostListener('window:click', ['$event'])
  onWindowClick(event: Event): void {
    this.onClick(event);
  }
  @ViewChild('header', { static: true }) header: HeaderComponent;

  onClick(e: any) {
    this.header.triggerFunction1();
  }
}

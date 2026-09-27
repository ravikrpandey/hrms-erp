import {
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LoaderDirective } from '../@shared/directives/loader.directive';
import { LeadService } from '../@shared/services/lead.service';
import { AuthService } from '../@auth/auth-material/auth.service';
import * as moment from 'moment';
import { CommonService } from '../@shared/services/common.service';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss'],
})
export class MasterComponent implements OnInit {
  clicked: boolean = false;
  isTop: boolean;
  loginUser: any;
  url: any;

  @ViewChild(LoaderDirective) Loader: LoaderDirective;

  constructor(
    private leade: LeadService,
    private _authService: AuthService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    let lg: any = localStorage.getItem('signInUser');
    this.loginUser = JSON.parse(lg);

    this.sleepMode();

    this.leade.getColor().subscribe((res: any) => {
      this.isTop = res;
    });
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
      employee_id: this.loginUser?.employee_id,
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
            (res) => {
              this.commonService.hideLoader();
            },
            (err) => {
              this.commonService.hideLoader();
            }
          );
        }, 2000);
      }
    }
  }
}

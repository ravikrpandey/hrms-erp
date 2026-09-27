import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fnf-settlement',
  templateUrl: './fnf-settlement.component.html',
  styleUrls: ['./fnf-settlement.component.scss']
})
export class FnfSettlementComponent {

  currentRoute: string = '';
  employee_id: any;
  mode: any
  constructor(private router: Router, private activeroute: ActivatedRoute,) {
    this.currentRoute = this.router.url;
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  ngOnInit() {
    this.activeroute.queryParamMap.subscribe(params => {
      this.employee_id = params.get('employee_id') || '';
      this.mode = params.get('mode') || '';
      if (this.mode === 'edit') {
      } else if (this.mode === 'view') {
      }
    });
  }


  navigateTo(path: string) {
    this.router.navigate(
      [`/master/ess/fnf-settlement/common/${path}`],
      { queryParams: { employee_id: this.employee_id, mode: this.mode } }
    );
  }

  isActive(path: string): boolean {
    return this.currentRoute.includes(path);
  }
}

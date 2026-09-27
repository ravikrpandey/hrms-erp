import { AfterViewInit, Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/@auth/auth-material/auth.service';
import { RbacMasterService } from '../services/rbac-master.service';

@Directive({
  selector: '[appAllowAction]'
})
export class AllowActionDirective implements OnInit, AfterViewInit {
  @Input('appAllowAction') reciveAction: any;

  constructor(private el: ElementRef, private renderer: Renderer2, private _authService: AuthService, private _rbacService: RbacMasterService) {

  };

  ngOnInit(): void {
    let loginUser: any = localStorage.getItem('signInUser');
    let role_id: any = JSON.parse(loginUser).role_id;

    // console.log(this.reciveAction);
  };

  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.getModuleActins();
    },500)
  }

  getModuleActins() {
    let data: any = localStorage.getItem('local');
    let moduleAction: any = JSON.parse(data);

    if (moduleAction) {
      if (this.reciveAction.toUpperCase() === 'read'.toUpperCase()) {
        if (moduleAction.Read) {
          this.renderer.setStyle(this.el.nativeElement, 'display', 'block')
        } else {
          this.renderer.setStyle(this.el.nativeElement, 'display', 'none')
        };
      };

      if (this.reciveAction.toUpperCase() === 'write'.toUpperCase()) {
        if (moduleAction.Write) {
          this.renderer.setStyle(this.el.nativeElement, 'display', 'block')
        } else {
          this.renderer.setStyle(this.el.nativeElement, 'display', 'none')
        };
      };

      if (this.reciveAction.toUpperCase() === 'delete'.toUpperCase()) {
        if (moduleAction.Delete) {
          this.renderer.setStyle(this.el.nativeElement, 'display', 'block')
        } else {
          this.renderer.setStyle(this.el.nativeElement, 'display', 'none')
        };
      };

    };
  }

}

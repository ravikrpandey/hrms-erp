import { Component, OnInit } from "@angular/core";
import { ReCaptchaV3Service } from "ngx-captcha";

@Component({
  selector: 'app-download-functioning',
  templateUrl: './download-functioning.component.html',
  styleUrls: ['./download-functioning.component.scss']
})
export class DownloadFunctioningComponent  implements OnInit {
  readonly SITE_KEY = "6Lc2X5YaAAAAAMAQ-VejWrgCTZMq9XhrPfTPvmI_";
  action = "register";
  copy:any
  token: any = undefined;

  constructor(private reCaptchaV3Service: ReCaptchaV3Service) {}

  ngOnInit() {}

  generateToken() {
    console.warn("Token");

    this.reCaptchaV3Service.execute(
      this.SITE_KEY,
      this.action,
      token => {
        
        this.token = token;
      },
      {
        useGlobalDomain: false // optional
      }
    );
  }
}

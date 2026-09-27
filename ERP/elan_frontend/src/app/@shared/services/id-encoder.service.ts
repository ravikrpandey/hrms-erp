import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class IdEncoderService {

  private secretKey = '##MindzZyno@123####';

  constructor(private router: Router) {}

  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }

  decrypt(text: string): string {
    const bytes = CryptoJS.AES.decrypt(text, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  encodeId(id: number): string {
    return encodeURIComponent(this.encrypt(id.toString()));
  }

  decodeId(id: string): string {
    return this.decrypt(decodeURIComponent(id));
  }

  // navigateWithEncryptedId(route: string, id: number) {
  //   const encrypted = this.encodeId(id);
  //   this.router.navigate([route, encrypted]);
  // }
  navigateWithEncryptedQueryParams(
    route: string,
    params: any,
    plainKeys: string[] = []
  ) {
    const encryptedParams: any = {};

    Object.keys(params).forEach((key) => {
      const value = params[key];
      if (value !== null && value !== undefined) {
        encryptedParams[key] = plainKeys.includes(key)
          ? value
          : encodeURIComponent(this.encrypt(value.toString()));
      }
    });

    this.router.navigate([route], { queryParams: encryptedParams });
  }
}

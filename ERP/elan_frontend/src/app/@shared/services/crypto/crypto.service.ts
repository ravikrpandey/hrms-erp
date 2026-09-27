import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private secretKey = 'elanpro-elitemindz';

  constructor() { }

  encrypt(value: any): string {

    return CryptoJS.AES.encrypt(
      String(value),
      this.secretKey
    ).toString();

  }

  decrypt(value: string): string {

    try {

      const bytes = CryptoJS.AES.decrypt(
        value,
        this.secretKey
      );

      return bytes.toString(CryptoJS.enc.Utf8);

    } catch (error) {

      return '';

    }

  }

}
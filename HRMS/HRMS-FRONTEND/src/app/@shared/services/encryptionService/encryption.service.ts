import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
const SECRET_KEY = 'W@r3X!oN9Yh^pLp7Qz*k%J1mG&V8oZdC#t$uF6aKbE2@xYrP';




@Injectable({
  providedIn: 'root'
})


export class EncryptionService {

  constructor() {

   }


// Function to encrypt a value
  encryptFunction(value: string): string {
  try {
    return CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
  } catch (error) {
    console.error('Encryption error:', error);
    return '';
  }
}

// Function to decrypt a value
  decryptFunction(encryptedValue: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

}
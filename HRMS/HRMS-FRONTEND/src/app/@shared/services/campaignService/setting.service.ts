import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;

const routes = {
  setting: {
    getSetting: () => `${databaseKey}/api/v1/getTestingEmail`,
    getSettingById: () => `${databaseKey}/api/v1/getTestingEmailById`,
    createSetting: () => `${databaseKey}/api/v1/createTestingEmail`,
    updateSetting: () => `${databaseKey}/api/v1/updateTestingEmail`,
    deleteSetting: () => `${databaseKey}/api/v1/deleteTestingEmail`,
  },
  sender: {
    getSenderById: (id: any) => `${databaseKey}/api/v1/getSendersMailById/${id}`,
    createSender: () => `${databaseKey}/api/v1/addSendersMail`,
    updateSender: () => `${databaseKey}/api/v1/updateSendersMail`,
    deleteSender: (id: any) => `${databaseKey}/api/v1/deleteSendersMail/${id}`,
  }
}

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  constructor(private http: HttpClient) { }

  // Getter to retrieve the current value of the BehaviorSubject

  getSettingList() {
    return this.http.get(routes.setting.getSetting(),
    );
  }
  getSetting(data: any) {
    return this.http.post(routes.setting.getSettingById(), data);
  }
  getSender(id: any) {
    return this.http.get(routes.sender.getSenderById(id));
  }
  createSetting(data: any) {
    return this.http.post(routes.setting.createSetting(), data);
  }
  createSender(data: any) {
    return this.http.post(routes.sender.createSender(), data);
  }
  updateSetting(data: any) {
    return this.http.put(routes.setting.updateSetting(), data);
  }
  updateSender(data: any) {
    return this.http.post(routes.sender.updateSender(), data);
  }
  deleteSetting(data: any) {
    return this.http.put(routes.setting.deleteSetting(), data);
  }
  deleteSender(id: any) {
    return this.http.get(routes.sender.deleteSender(id));
  }
 }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;

const routes = {
  campaign: {
    getCampaign: () => `${databaseKey}/api/v1/getAllEmailCampaign`,
    getTemplateCampaign: () => `${databaseKey}/api/v1/getTemplates`,
    getSmsCampaign: () => `${databaseKey}/api/v1/getAllSmsCampaign`,
    getWhatsAppCampaign: () => `${databaseKey}/api/v1/getAllWhatsappCampaign`,
    getAllEmailCampaignByFolderID: (id: any) => `${databaseKey}/api/v1/getAllEmailCampaignByFolderID/${id}`,
    getAllSmsCampaignByFolderID: (id: any) => `${databaseKey}/api/v1/getAllEmailCampaignByFolderID/${id}`,
    createCampaign: () => `${databaseKey}/api/v1/createEmailCampaign`,
    createTemplate: () => `${databaseKey}/api/v1/createTemplateDetails`,
    createSmsCampaign: () => `${databaseKey}/api/v1/createSMSCampaign`,
    createWhatsAppCampaign: () => `${databaseKey}/api/v1/createWhatsappCampaign`,
    updateCampaign: (id: any) => `${databaseKey}/api/v1/updateEmailCampaignName/${id}`,
    updateEmailTemplateById: (id: any) => `${databaseKey}/api/v1/updateTemplateDetails/${id}`,
    getByIdEmailTemplate: (id: any) => `${databaseKey}/api/v1/getTemplateMasterDataById/${id}`,
    updateSmsCampaign: (id: any) => `${databaseKey}/api/v1/updateSmsCampaign/${id}`,
    updateWhatsAppCampaign: (id: any) => `${databaseKey}/api/v1/updateWhatsappCampaign/${id}`,
    deleteCampaign: (id: any) => `${databaseKey}/api/v1/deleteCampaign/${id}`,
    deleteSmsCampaign: (id: any) => `${databaseKey}/api/v1/deleteSmsCampaign/${id}`,
    deleteWhatsAppCampaign: (id: any) => `${databaseKey}/api/v1/deleteSmsCampaign/${id}`,
  },
  emailTemplate:{
    sendEmail: ()=> `${databaseKey}/api/v1/sendEmail`,
    scheduleEmail: ()=> `${databaseKey}/api/v1/scheduleEmail`,
    sendPandTEmail: ()=> `${databaseKey}/api/v1/sendTestingEmail`,
    addSubject: ()=> `${databaseKey}/api/v1/saveEmailSubject`,
    saveEmailSenderDetails: ()=> `${databaseKey}/api/v1/saveEmailSenderDetails`,
    saveSmsSenderDetails: ()=> `${databaseKey}/api/v1/createSmsCampaignSender`,
    updateSmsSenderDetails: (id: any)=> `${databaseKey}/api/v1/updateSmsCampaignSender/${id}`,
    getSenderDetailsById: (id:any)=> `${databaseKey}/api/v1/getSenderDetailsById/${id}`,
    getSmsSenderDetailsById: (id:any)=> `${databaseKey}/api/v1/getSmsCampaignSenderById/${id}`,
    updateSubject: ()=> `${databaseKey}/api/v1/updateEmailSubject`,
    getSubject: ()=> `${databaseKey}/api/v1/getEmailSubjectById`,
    addRecipients: ()=> `${databaseKey}/api/v1/saveRecipientsForEmail`,
    addSmsRecipients: ()=> `${databaseKey}/api/v1/createSmsCampaignRecipients`,
    updateRecipients: ()=> `${databaseKey}/api/v1/updateRecipientsForEmail`,
    updateSmsRecipients: (id: any)=> `${databaseKey}/api/v1/updateRecipientsForSms/${id}`,
    getRecipients: ()=> `${databaseKey}/api/v1/getRecepientsById`,
    getSmsRecipients: (id: any)=> `${databaseKey}/api/v1/getSmsCampaignRecipientById/${id}`,
    addDesign: ()=> `${databaseKey}/api/v1/saveTemplateDesign`,
    updateDesign: ()=> `${databaseKey}/api/v1/updateTemplateDesign`,
    getDesignCampaignId: ()=> `${databaseKey}/api/v1/getDesignFileByCampaignId`,
    getSendersList: ()=> `${databaseKey}/api/v1/getSendersList`,
    getCampaignTemplatesList: ()=> `${databaseKey}/api/v1/getAllDesignFileEmailCampaign`,
    getTemplatesDesignList: ()=> `${databaseKey}/api/v1/getAllDesignFileEmailTemplate`,
    getPreviewSendersList: ()=> `${databaseKey}/api/v1/getTestingEmail`,
  },
  messageSms:{
    saveSmsMessageDetails: ()=> `${databaseKey}/api/v1/createSmsCampaignMessage`,
    updateSmsMessage: (id: any)=> `${databaseKey}/api/v1/updateSmsCampaignMessage/${id}`,
    getMessage: (id: any)=> `${databaseKey}/api/v1/getSmsCampaignMessageById/${id}`,
  },
  folder: {
    getFolderCampaign: () => `${databaseKey}/api/v1/getAllFolders`,
    getEmailCampaignById: (campaign_id:any) => `${databaseKey}/api/v1/getEmailCampaignById/${campaign_id}`,
    getSmsCampaignById: (campaign_id:any) => `${databaseKey}/api/v1/getSmsCampaignById/${campaign_id}`,
    getAllFolderWithChild: () => `${databaseKey}/api/v1/getAllFolderWithChild`,
    getcontactCount: () => `${databaseKey}/api/v1/getcontactCount`,
    getAllFoldersForCampaign: () => `${databaseKey}/api/v1/getAllFoldersForCampaign`,
    moveToFolder: () => `${databaseKey}/api/v1/moveToFolder`,
    moveCampaignToFolder: () => `${databaseKey}/api/v1/moveCampaignToFolder`,
    moveAllCampaignsToFolder: () => `${databaseKey}/api/v1/moveAllCampaignsToFolder`,
    getFolderCampaignByFolderId: (id: any) => `${databaseKey}/api/v1/getAllFoldersByFolderId/${id}`,
    getFolderCampaignById: (id: any) => `${databaseKey}/api/v1/getFolderById/${id}`,
    createFolderCampaign: () => `${databaseKey}/api/v1/createFolder`,
    moveToMainList: (id:any) => `${databaseKey}/api/v1/moveToMainList/${id}`,
    updateFolderCampaign: (id: any) => `${databaseKey}/api/v1/updateFolder/${id}`,
    deleteFolderCampaign: (id: any) => `${databaseKey}/api/v1/deleteFolder/${id}`,
  },
  dashboard:{
    getGraphEmail: ()=> `${databaseKey}/api/v1/zeptomail/get-eventsData`,
  },
  sended:{
    getSendedDataList: ()=> `${databaseKey}/api/v1/getHistoryOfSentMails`,
  }
}

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  private folderSubject = new BehaviorSubject<any>(null);
  folder$ = this.folderSubject.asObservable();

  private childSubject = new BehaviorSubject<any>(null);
  child$ = this.childSubject.asObservable();

  private parentSubject = new BehaviorSubject<any>(null);
  parent$ = this.parentSubject.asObservable();

  // information which page we are right now   -----[folder, parent, child]-----
  private folderInfoSubject = new BehaviorSubject<any>('folder');
  folderInfo$ = this.folderInfoSubject.asObservable();



  constructor(private http: HttpClient) { }

  // Method to update the information which page we are right now [folder, parent, child]
  updateFolderInfo(folder: any) {
    this.folderInfoSubject.next(folder);
  }

  getFolderInfo(): any {
    return this.folderInfoSubject.getValue();
  }


  // Method to update the folder details
  updateChild(folder: any) {
    this.childSubject.next(folder);
  }

  // Getter to retrieve the current value of the BehaviorSubject
  getChildValue(): any {
    return this.childSubject.getValue();
  }

  // Method to update the parent details
  updateParent(folder: any) {
    this.parentSubject.next(folder);
  }

  // Getter to retrieve the current value of the BehaviorSubject
  getParentValue(): any {
    return this.parentSubject.getValue();
  }

  // Method to update the folder details
  updateFolder(folder: any) {
    this.folderSubject.next(folder);
  }

  // Getter to retrieve the current value of the BehaviorSubject
  getFolderValue(): any {
    return this.folderSubject.getValue();
  }

  //////////////// start campaign folder ///////////////////
  getFolderCampaignList() {
    return this.http.get(routes.folder.getFolderCampaign(),
    );
  }  
  getcontactCount(ids:any) {
    const payload = { "listId": ids }
    return this.http.post(routes.folder.getcontactCount(),payload);
  }  
  getEmailCampaignById(id:any) {
    return this.http.get(routes.folder.getEmailCampaignById(id));
  }  
  getSmsCampaignById(id:any) {
    return this.http.get(routes.folder.getSmsCampaignById(id));
  }  
  getAllFolderWithChild(payload:any) {
    return this.http.post(routes.folder.getAllFolderWithChild(),payload);
  }
  getAllFoldersForCampaign(payload:any) {
    return this.http.post(routes.folder.getAllFolderWithChild(),payload);
  }  
  moveToFolder(payload:any) {
    return this.http.post(routes.folder.moveToFolder(),payload);
  }
  moveCampaignToFolder(payload:any) {
    return this.http.post(routes.folder.moveCampaignToFolder(),payload);
  }
  moveAllCampaignsToFolder(payload:any) {
    return this.http.post(routes.folder.moveAllCampaignsToFolder(),payload);
  }
  getFolderCampaignListByFolderId(id: any) {
    return this.http.get(routes.folder.getFolderCampaignByFolderId(id),
    );
  }
  getFolderCampaignById(id: any) {
    return this.http.get(routes.folder.getFolderCampaignById(id),
    );
  }
  createFolderCampaign(data: any) {
    return this.http.post(routes.folder.createFolderCampaign(), data);
  }  
  moveToMainList(data: any) {
    return this.http.put(routes.folder.moveToMainList(data), {});
  }
  updateFolderCampaign(id: any, data: any) {
    return this.http.put(routes.folder.updateFolderCampaign(id), data);
  }
  deleteFolderCampaign(id: any, data:any) {
    return this.http.put(routes.folder.deleteFolderCampaign(id), data);
  }
  
  //////////////// end campaign folder ///////////////////
  getEmailCampaignList() {
    return this.http.get(routes.campaign.getCampaign(),
    );
  }
  getTemplateCampaignList() {
    return this.http.get(routes.campaign.getTemplateCampaign(),
    );
  }
  getSmsCampaignList() {
    return this.http.get(routes.campaign.getSmsCampaign(),
    );
  }
  getWhatsAppCampaignList() {
    return this.http.get(routes.campaign.getWhatsAppCampaign(),
    );
  }
  getAllEmailCampaignByFolderID(id: any) {
    return this.http.get(routes.campaign.getAllEmailCampaignByFolderID(id),
    );
  }
  getAllSmsCampaignByFolderID(id: any) {
    return this.http.get(routes.campaign.getAllSmsCampaignByFolderID(id),
    );
  }
  createEmailCampaign(data: any) {
    return this.http.post(routes.campaign.createCampaign(), data);
  }
  createEmailTemplate(data: any) {
    return this.http.post(routes.campaign.createTemplate(), data);
  }
  createSmsCampaign(data: any) {
    return this.http.post(routes.campaign.createSmsCampaign(), data);
  }
  createWhatsAppCampaign(data: any) {
    return this.http.post(routes.campaign.createWhatsAppCampaign(), data);
  }
  getEmailByIdTemplate(id: any) {
    return this.http.get(routes.campaign.getByIdEmailTemplate(id));
  }
  updateCampaign(id: any, data: any) {
    return this.http.put(routes.campaign.updateCampaign(id), data);
  }
  updateEmailTemplate(id: any, data: any) {
    return this.http.put(routes.campaign.updateEmailTemplateById(id), data);
  }
  updateSmsCampaign(id: any, data: any) {
    return this.http.put(routes.campaign.updateSmsCampaign(id), data);
  }
  updateWhatsAppCampaign(id: any, data: any) {
    return this.http.put(routes.campaign.updateWhatsAppCampaign(id), data);
  }
  deleteCampaign(id: any) {
    return this.http.put(routes.campaign.deleteCampaign(id),{});
  }
  deleteSmsCampaign(id: any) {
    return this.http.put(routes.campaign.deleteSmsCampaign(id),{});
  }
  deleteWhatsAppCampaign(id: any) {
    return this.http.put(routes.campaign.deleteWhatsAppCampaign(id),{});
  }
  sendEmail(data: any): Observable<any> {
    return this.http.post(routes.emailTemplate.sendEmail(),data);
  }
  scheduleEmail(data: any): Observable<any> {
    return this.http.post(routes.emailTemplate.scheduleEmail(),data);
  }
  sendPreviewTestEmail(data: any): Observable<any> {
    // Email data to be sent
    return this.http.post(routes.emailTemplate.sendPandTEmail(),data);
  }
  ////////// Recipient Campaign Start /////////////////////
  addRecipientsEmailCampaign(data: any) {
    return this.http.post(routes.emailTemplate.addRecipients(), data);
  }
  addRecipientsSmsCampaign(data: any) {
    return this.http.post(routes.emailTemplate.addSmsRecipients(), data);
  }
  updateRecipientsEmailCampaign(data: any) {
    return this.http.put(routes.emailTemplate.updateRecipients(), data);
  }
  updateRecipientsSmsCampaign(id: any, data: any) {
    return this.http.put(routes.emailTemplate.updateSmsRecipients(id), data);
  }
  getRecipientsEmailCampaign(data: any) {
    return this.http.post(routes.emailTemplate.getRecipients(), data);
  }
  getRecipientsSmsCampaign(id: any) {
    return this.http.get(routes.emailTemplate.getSmsRecipients(id));
  }
  ////////// Recipient Campaign end /////////////////////
  ////////// Subject Campaign Start /////////////////////
  addSubjectEmailCampaign(data: any) {
    return this.http.post(routes.emailTemplate.addSubject(), data);
  }
  updateSubjectEmailCampaign(data: any) {
    return this.http.put(routes.emailTemplate.updateSubject(), data);
  }
  getSubjectEmailCampaign(data: any) {
    return this.http.post(routes.emailTemplate.getSubject(), data);
  }
  ////////// Subject Campaign end /////////////////////
  ////////// Design Campaign Start /////////////////////
  addDesignEmailCampaign(data: any) {
    return this.http.post(routes.emailTemplate.addDesign(), data);
  }
  updateDesignEmailCampaign(data: any) {
    return this.http.put(routes.emailTemplate.updateDesign(), data);
  }
  getDesignEmailCampaignById(data: any) {
    return this.http.post(routes.emailTemplate.getDesignCampaignId(), data);
  }
  getSendersList() {
    return this.http.get(routes.emailTemplate.getSendersList());
  }
  getCampaignTemplateList() {
    return this.http.get(routes.emailTemplate.getCampaignTemplatesList());
  }
  getTemplateDesignList() {
    return this.http.get(routes.emailTemplate.getTemplatesDesignList());
  }
  getPreviewSendersList() {
    return this.http.get(routes.emailTemplate.getPreviewSendersList());
  }
  
  saveEmailSenderDetails(data: any) {
  return this.http.post(routes.emailTemplate.saveEmailSenderDetails(), data);
  }
  saveSmsSenderDetails(data: any) {
  return this.http.post(routes.emailTemplate.saveSmsSenderDetails(), data);
  }
  updateSmsSenderDetails(id: any, data: any) {
  return this.http.post(routes.emailTemplate.updateSmsSenderDetails(id), data);
  }
  getSenderDetailsById(data: any) {
  return this.http.get(routes.emailTemplate.getSenderDetailsById(data), data);
  }
  getSmsSenderDetailsById(id: any) {
  return this.http.get(routes.emailTemplate.getSmsSenderDetailsById(id));
  }
  ////////// Design Campaign End /////////////////////
  /////////// Message Content ///////////////////////
  addSmsMessageCampaign(data: any) {
    const formData = new FormData();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }

    return this.http.post(routes.messageSms.saveSmsMessageDetails(), formData);
  }
  updateSmsMessageCampaign(id: any, data: any) {
    const formData = new FormData();

    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    return this.http.post(routes.messageSms.updateSmsMessage(id), formData);
  }
  getSmsMessageCampaign(id: any) {
    return this.http.get(routes.messageSms.getMessage(id));
  }
  /////////// Message Content End ///////////////////////

  /////////// Dashboard Start ///////////////////////
  getDashboardEmailCampaign() {
    return this.http.get(routes.dashboard.getGraphEmail());
  }
  /////////// Dashboard End ///////////////////////
  /////////// Dashboard Start ///////////////////////
  getSendedList() {
    return this.http.get(routes.sended.getSendedDataList());
  }
  /////////// Dashboard End ///////////////////////
}

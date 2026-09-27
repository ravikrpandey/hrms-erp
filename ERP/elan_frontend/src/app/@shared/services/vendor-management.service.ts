import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, map} from 'rxjs';
import {environment} from 'src/app/environments/environment';
import {id} from 'date-fns/locale';

const databaseKey: any = environment.servralUrl;

const routes = {
    vendor: {
        subType: () => `${databaseKey}/api/v1/get_All_Sub_Type`,
        vendorType: () => `${databaseKey}/api/v1/get_All_Type_Of_Vendor`,
        getUnAppVendor: () => `${databaseKey}/api/v1/get_All_Inactive_Vendor_Management`,
        getAppVendor: () => `${databaseKey}/api/v1/get_All_Active_Vendor_Management`,
        createVander: () => `${databaseKey}/api/v1/create_Vendor_Management`,
        editStatusById: (id: any) => `${databaseKey}/api/v1/edit_Status_Vendor_Management/${id}`,
        editDocById: (id: any) => `${databaseKey}/api/v1/edit_Document_Vendor_Management/${id}`,
        createBank: () => `${databaseKey}/api/v1/create_Bank_Details_Vendor_Management`,
        getAllBank: () => `${databaseKey}/api/v1/get_All_Bank_Details_Vendor_Management`,
        getVendorById: (id: any) => `${databaseKey}/api/v1/get_ById_Vendor_Management/${id}`,
        editBank: (id: any) => `${databaseKey}/api/v1/edit_BankDetail_Vendor_Management/${id}`,
        getAllDoc: () => `${databaseKey}/api/v1/get_All_Document_Vendor_Management`,
        createDoc: () => `${databaseKey}/api/v1/create_Document_Vendor_Management`,
        deleteBank: (id: any) => `${databaseKey}/api/v1/delete_Bank_Details/${id}`,
        getBankById: (id: any) => `${databaseKey}/api/v1/get_ById_Bank_Details_Vendor_Management/${id}`,
        editVendor: (id: any) => `${databaseKey}/api/v1/edit_Basic_Details_Vendor_Management/${id}`,
        editVendorBank: (id: any) => `${databaseKey}/api/v1/edit_Bank_Details_Vendor_Management/${id}`,
        getAllVendorName: (id?: any) => `${databaseKey}/api/v1/get_All_Vendor_Management?entity_id=${id}`,
        verifyVendors: () => `${databaseKey}/api/v1/get_All_Verfiy_Vendor_Management`,
        getAllAccountApproved: () => `${databaseKey}/api/v1/get_All_Account_Approved_Vendor_Management`,
        rejected_list: () => `${databaseKey}/api/v1/get_All_Reject_Vendor_Management`,
        getRfpNumber: () => `${databaseKey}/api/v1/create_rfp_number`,
        getCodeAccPayble: (id: any) => `${databaseKey}/api/v1/Code_create_pg/${id}`,
        getAllVendorList: (entity_id: any) => `${databaseKey}/api/v1/get_all_vendor?entity_id=${entity_id}`,
        getAllVendorListName: (entity_id: any) => `${databaseKey}/api/v1/get_all_vendor_name?entity_id=${entity_id}`,
        getCCCode: (id: any) => `${databaseKey}/api/v1/Code_create_cc/${id}`,
        getSnsCode: (id: any) => `${databaseKey}/api/v1/Code_create_sns/${id}`,
        getByVendor: (id: any) => `${databaseKey}/api/v1/get_by_vendorID/${id}`,
        advanceVendorPaymentById: (id: any) => `${databaseKey}/api/v1/advanceVendorPaymentById?id=${id}`,
        createVendorAdvanceAmount: () => `${databaseKey}/api/v1/createVendorAdvanceAmount`,
        getvendorCode: () => `${databaseKey}/api/v1/vendor_auto_code`,
        deleteDocVendor: (id: any) => `${databaseKey}/api/v1/delete_vendor_doc/${id}`,
        deleteBasicVendor: (id: any) => `${databaseKey}/api/v1/delete_vendor_basic/${id}`,
        deleteBankVendor: (id: any) => `${databaseKey}/api/v1/delete_vendor_bank/${id}`,
        getAllVendorEntity: () => `${databaseKey}/api/v1/get_all_vendor_name`,
        getAll_Vendor_type: () => `${databaseKey}/api/v1/getAll_Vendor_type`,
        getAccountChart: (id: any) => `${databaseKey}/api/v1/get_Chart_Of_Account_List_vendor/${id}`,
        getVendorAddressInfoById: (id: any) => `${databaseKey}/api/v1/getVendorAddressInfoById/${id}`,
        createVendorAddressInfo: () => `${databaseKey}/api/v1/createVendorAddressInfo`,
    }
}

@Injectable({
    providedIn: 'root'
})
export class VendorManagementService {
    vendor_Id: any = new BehaviorSubject(null);
    vendorTitle: any = new BehaviorSubject(null);
    status_val: any = new BehaviorSubject(null);
    databaseKey;

    constructor(private http: HttpClient) {
        this.databaseKey = environment.servralUrl;
    }

    setval(val: any) {
        this.status_val.next(val);
    }

    getval() {
        return this.status_val;
    }

    getSubType() {
        return this.http.get(routes.vendor.subType());
    }

    getVendorType() {
        return this.http.get(routes.vendor.vendorType());
    }

    getUnAppVendor() {
        return this.http.get(routes.vendor.getUnAppVendor());
    }

    getAppVendor() {
        return this.http.get(routes.vendor.getAppVendor());
    }

    createVandor(data: any) {
        return this.http.post(routes.vendor.createVander(), data);
    }

    updateStatus(id: any, data: any): Observable<any> {
        return this.http.put(routes.vendor.editStatusById(id), data);
    }

    updateDocument(id: any, data: any): Observable<any> {
        return this.http.put(routes.vendor.editDocById(id), data);
    }

    crateBankDetail(data: any) {
        return this.http.post(routes.vendor.createBank(), data)
    }

    getAllBank() {
        return this.http.get(routes.vendor.getAllBank())
    }

    getVendorById(id: any) {
        return this.http.get(routes.vendor.getVendorById(id));
    }

    editBank(id: any, data: any): Observable<any> {
        return this.http.put(routes.vendor.editBank(id), data);
    }

    getAllDocs() {
        return this.http.get(routes.vendor.getAllDoc())
    }

    addDocument(data: any) {
        return this.http.post(routes.vendor.createDoc(), data)
    }

    deleteBank(id: any) {
        return this.http.delete(routes.vendor.deleteBank(id))
    }

    getBankById(id: any) {
        return this.http.get(routes.vendor.getBankById(id))
    }

    editVendor(id: any, data: any): Observable<any> {
        return this.http.put(routes.vendor.editVendor(id), data);
    }

    editVendorBank(id: any, data: any): Observable<any> {
        return this.http.put(routes.vendor.editVendorBank(id), data);
    }

    setVendorId(id: any) {
        this.vendor_Id.next(id);
    }


    getVendorId() {
        return this.vendor_Id;
    }

    setVendorTitle(title: string) {
        this.vendorTitle.next(title);
    };

    getVendorTitle() {
        return this.vendorTitle;
    }

    getAllVendorName() {
        return this.http.get(routes.vendor.getAllVendorName());
    }

    getAllVerifyVendor(id?: any) {
        if (id) {
            return this.http.get(routes.vendor.getAllVendorName(id))
        } else {
            return this.http.get(routes.vendor.getAllVendorName())
        }
        ;
    }

    getAllAccountApproved() {
        return this.http.get(routes.vendor.getAllAccountApproved())
    }

    getAllReject() {
        return this.http.get(routes.vendor.rejected_list())
    }

    getRfpNumber() {
        return this.http.get(routes.vendor.getRfpNumber())
    }

//new vendor api start

    createVendorNew(body: any) {
        return this.http.post<any>(`${this.databaseKey}/api/v1/createVendor_Details`, body).pipe(
            map((response: any) => {
                return response
            })
        );
    }

    getCodeAccPayble(id: any) {
        return this.http.get(routes.vendor.getCodeAccPayble(id))
    }

    getAllVendorList(entity_id: any) {
        return this.http.get(routes.vendor.getAllVendorList(entity_id))
    }

    getAllVendorListName(entity_id: any) {
        return this.http.get(routes.vendor.getAllVendorListName(entity_id))
    }

    getCCCode(id: any) {
        return this.http.get(routes.vendor.getCCCode(id))
    }

    getSnsCode(id: any) {
        return this.http.get(routes.vendor.getSnsCode(id))
    }

    getByVendor(id: any) {
        return this.http.get(routes.vendor.getByVendor(id))
    } 
    advanceVendorPaymentById(id: any) {
        return this.http.get(routes.vendor.advanceVendorPaymentById(id))
    }

    createVendorAdvanceAmount(data: any) {
    return this.http.post(routes.vendor.createVendorAdvanceAmount(),data)
    }


    getvendorCode() {
        return this.http.get(routes.vendor.getvendorCode())
    }

    deleteDocVendor(id: any) {
        return this.http.delete(routes.vendor.deleteDocVendor(id))
    }

    deleteBankVendor(id: any) {
        return this.http.delete(routes.vendor.deleteBankVendor(id))
    }

    deleteBasicVendor(id: any) {
        return this.http.delete(routes.vendor.deleteBasicVendor(id))
    }

    getAll_Vendor_type() {
        return this.http.get(routes.vendor.getAll_Vendor_type())
    }

    getAccountChart(id: any) {
        return this.http.get(routes.vendor.getAccountChart(id))
    }
    getVendorAddressInfoById(id: any) {
        return this.http.get(routes.vendor.getVendorAddressInfoById(id))
    }
    createVendorAddressInfo(formData:any) {
        return this.http.post(routes.vendor.createVendorAddressInfo(),formData)
    }
}

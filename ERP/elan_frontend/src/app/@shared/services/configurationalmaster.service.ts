import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { data } from 'jquery';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { ItemResponseInterface } from '../interface/item.interface';

const databaseKey: any = environment.servralUrl;

const routes = {
  priceTable: {
    createCertPrice: () =>
      `${databaseKey}/api/v1/create_product_mastermappingcert`,
    getProductByid: (id: any) =>
      `${databaseKey}/api/v1/get_ById_product_master/${id}`,
    update_product_master: (id: any) =>
      `${databaseKey}/api/v1/update_product_master/${id}`,

    //
    createNonCertPrice: () =>
      `${databaseKey}/api/v1/create_product_mastermappingnoncert`,
    getProductscert: () => `${databaseKey}/api/v1/getAll_product_masterforcert`,
    getProductsnoncer: () =>
      `${databaseKey}/api/v1/getAll_product_masterfornoncert`,
    getProducts_withouprice: (id: any) =>
      `${databaseKey}/api/v1/getbycertificateId/${id}`,
    editCertPrice: (id: any) =>
      `${databaseKey}/api/v1/editpricewithpricetype/${id}`,
    deletePrice: (id: any) =>
      `${databaseKey}/api/v1/delete_product_master_details/${id}`,

    //
    MSA_Cert: () => `${databaseKey}/api/v1/getAll_product_masterforcert`,
    MSA_Non_Cert: () => `${databaseKey}/api/v1/getAll_product_masterfornoncert`,
    getById_priceMaping: (id: any) =>
      `${databaseKey}/api/v1/get_productpricewithpricetype/${id}`,

    MED_Cert: () => `${databaseKey}/api/v1/medgetAllProductpriceMapping`,
    MED_Non_Cert: () =>
      `${databaseKey}/api/v1/medallproductnonCertPriceMapping`,

    //
    // signatureById: (signature_id: any) =>
    //   `${databaseKey}/api/v1/get_ById_signature/${signature_id}`,
    // countryGetById: (countryss_id: any) =>
    //   `${databaseKey}/api/v1/getByIdcountry/${countryss_id}`,
    // countryUpdate: (countryss_id: any) =>
    //   `${databaseKey}/api/v1/editcountry/${countryss_id}`,
  },
  Country: {
    countryCreate: () => `${databaseKey}/api/v1/createcountry`,
    countryCreateByID: () => `${databaseKey}/api/v1/createstatescontroller`,
    countryGet: () => `${databaseKey}/api/WL/getAllcountry`,
    signatureById: (signature_id: any) =>
      `${databaseKey}/api/v1/get_ById_signature/${signature_id}`,
    countryGetById: (countryss_id: any) =>
      `${databaseKey}/api/v1/getByIdcountry/${countryss_id}`,
    countryUpdate: (countryss_id: any) =>
      `${databaseKey}/api/v1/editcountry/${countryss_id}`,
    updateCountryStatus: (countryss_id: any) =>
      `${databaseKey}/api/v1/updateCountryStatus/${countryss_id}`,
    getAllActivecountry: () => `${databaseKey}/api/v1/getAllActivecountry`,
  },
  State: {
    stateCreate: () => `${databaseKey}/api/v1/createstatescontroller`,
    stateGet: () => `${databaseKey}/api/v1/getallstatescontroller`,
    getAll_Country_codes: () => `${databaseKey}/api/WL/getAll_Country_codes`,
    stateGetById: (states_id: any) =>
      `${databaseKey}/api/v1/getidstatescontroller/${states_id}`,
    stateUpdate: (states_id: any) =>
      `${databaseKey}/api/v1/editstatescontroller/${states_id}`,
    stateUpdateStatus: (states_id: any) =>
      `${databaseKey}/api/v1/updateStateStatus/${states_id}`,
  },
  City: {
    cityCreate: () => `${databaseKey}/api/v1/createcitycontroller`,
    cityGet: () => `${databaseKey}/api/v1/getallcitycontroller`,
    cityGetById: (city_id: any) =>
      `${databaseKey}/api/v1/getidcitycontroller/${city_id}`,
    cityUpdate: (city_id: any) =>
      `${databaseKey}/api/v1/editcitycontroller/${city_id}`,
    cityDelete: (city_id: any) =>
      `${databaseKey}/api/v1/deletecitycontroller/${city_id}`,
  },
  PriceLevelSlap: {
    createPricingLevel: () => `${databaseKey}/api/v1/create_pricing_level`,
    create_pricing_level_slab: () =>
      `${databaseKey}/api/v1/create_price_slab_level`,
    getPriceLevelSlab: () => `${databaseKey}/api/v1/getAll_price_slab_level`,
    getPriceLevelById: (product_master_id: any) =>
      `${databaseKey}/api/v1/get_ById_product_price_slab_level/${product_master_id}`,
  },
  //Global-Managing Director APi's
  GMD: {
    gmdCreate: () => `${databaseKey}/api/v1/create_director`,
    gmdGet: () => `${databaseKey}/api/v1/getAll_director`,
    gmdPut: (director_id: any) =>
      `${databaseKey}/api/v1/edit_director/${director_id}`,
    gmdGetById: (director_id: any) =>
      `${databaseKey}/api/v1/get_ById_director/${director_id}`,
  },
  //Job-Type API's
  JobType: {
    jobTypeCreate: () => `${databaseKey}/api/v1/job/typecreate`,
    JobList: () => `${databaseKey}/api/v1/jobtype/getall`,
    editJob: (job_Id: any) => `${databaseKey}/api/v1/job/editJobType/${job_Id}`,
    getById: (job_Id: any) =>
      `${databaseKey}/api/v1/job/getByIdJobType/${job_Id}`,
  },

  //sub-type
  SubType: {
    createSubType: () => `${databaseKey}/api/v1/create_Sub_Type`,
    listSubType: () => `${databaseKey}/api/v1/get_All_Sub_Type`,
    editSubType: (sub_type_id: any) =>
      `${databaseKey}/api/v1/edit_Sub_Type/${sub_type_id}`,
    getById: (sub_type_id: any) =>
      `${databaseKey}/api/v1/get_ById_Sub_Type/${sub_type_id}`,
  },

  //Brand API's
  Brand: {
    brandCreate: () => `${databaseKey}/api/v1/createBrand`,
    brandList: () => `${databaseKey}/api/v1/getAllBrand`,
    brandEdit: (brand_id: any) => `${databaseKey}/api/v1/editBrand/${brand_id}`,
    getById: (brand_id: any) =>
      `${databaseKey}/api/v1/getBrandById/${brand_id}`,
  },

  // Target Master
  TargetMaster: {
    targetCreate: () => `${databaseKey}/api/v1/create_target`,
    targetList: () => `${databaseKey}/api/v1/getAll_target`,
    targetEdit: (target_id: any) =>
      `${databaseKey}/api/v1/edit_target/${target_id}`,
    getById: (target_id: any) =>
      `${databaseKey}/api/v1/get_ById_target/${target_id}`,
  },

  // Unit Master API's
  UnitMaster: {
    unitCreate: () => `${databaseKey}/api/v1/create_unit`,
    unitList: () => `${databaseKey}/api/v1/getAll_unit`,
    unitEdit: (unit_id: any) => `${databaseKey}/api/v1/edit_unit/${unit_id}`,
    getByID: (unit_id: any) => `${databaseKey}/api/v1/get_ById_unit/${unit_id}`,
  },

  // currency master API's
  Currency: {
    currencyCreate: () => `${databaseKey}/api/v1/Create_Currency`,
    listCurrency: () => `${databaseKey}/api/v1/getAll_Currency`,
    editCurrency: (id: any) => `${databaseKey}/api/v1/update_Currency/${id}`,
    getByIdCurrency: (Currency_Convert_id: any) =>
      `${databaseKey}/api/v1/getbyAll_Currency/${Currency_Convert_id}`,
  },

  //Category API's
  Category: {
    categoryCreate: () => `${databaseKey}/api/v1/create_new_category_master`,
    categoryList: () => `${databaseKey}/api/v1/getAll_new_category_master`,
    categoryEdit: (new_category_master_id: any) =>
      `${databaseKey}/api/v1/edit_new_category_master/${new_category_master_id}`,
    getById: (new_category_master_id: any) =>
      `${databaseKey}/api/v1/get_ById_new_category_master/${new_category_master_id}`,
  },

  //Certificate Status type API's
  Certificatetype: {
    createCertificate: () => `${databaseKey}/api/v1/createCertificateStatus`,
    getCertificate: () => `${databaseKey}/api/v1/getAllCertificateStatus`,
    getAllCertificate: () => `${databaseKey}/api/v1/getAll_certificate_type`,
    getById: (certificate_Status_id: any) =>
      `${databaseKey}/api/v1/getByIdCertificateStatus/${certificate_Status_id}`,
    certificateEdit: (certificate_Status_id: any) =>
      `${databaseKey}/api/v1/editCertificateStatus/${certificate_Status_id}`,
  },

  usesMaster: {
    createUses: () => `${databaseKey}/api/v1/createUses`,
    getAllUses: () => `${databaseKey}/api/v1/getAllUses`,
    getAllActiveUsageData: () => `${databaseKey}/api/v1/getAllActiveUsageData`,
    deleteUses: (id: any) => `${databaseKey}/api/v1/deleteUses/${id}`,
    getUsestByIdDD: (id: any) => `${databaseKey}/api/v1/getAllUsesById/${id}`,
    updateUsesByid: (id: any) => `${databaseKey}/api/v1/updateUses/${id}`,
    updateUsesStatus: (id: any) =>
      `${databaseKey}/api/v1/update_usesStatus/${id}`,
  },

  //Standard Programe Assesment
  StandardProgAsses: {
    assesCreate: () => `${databaseKey}/api/v1/create_new_spa`,
    assesList: () => `${databaseKey}/api/v1/getAll_new_spa`,
    getAuditorName: () => `${databaseKey}/api/v1/get_auditor_Data`,
    productList: () => `${databaseKey}/api/v1/getAll_product_master`,
    allProductList: () => `${databaseKey}/api/v1/getall_data_cert_and_noncert`,
    getAllActiveProd: () =>
      `${databaseKey}/api/v1/getall_data_cert_and_noncert?status=active`,

    //
    assesEdit: (new_spa_id: any) =>
      `${databaseKey}/api/v1/edit_new_spa/${new_spa_id}`,
    getById: (new_spa_id: any) =>
      `${databaseKey}/api/v1/get_ById_new_spa/${new_spa_id}`,
    getByCertId: (certificate_type_id: any) =>
      `${databaseKey}/api/v1/get_Bycertificate_typeId_new_spa/${certificate_type_id}`,
    getBySegmentId: (segment_id: any) =>
      `${databaseKey}/api/v1/get_BysegmentId_certificate_type/${segment_id}`,
  },

  //Branch API's
  Branch: {
    branchList: () => `${databaseKey}/api/v1/getAllbranch`,
    branchEdit: (branch_id: any) =>
      `${databaseKey}/api/v1/editbranch/${branch_id}`,
    getById: (branch_id: any) =>
      `${databaseKey}/api/v1/getByIdbranch/${branch_id}`,
    getAllEmployeeByBranchId: (branch_id: any) =>
      `${databaseKey}/api/v1/getAllEmployeeByBranchId/${branch_id}`,
  },

  // expense-Category API's
  ExpenseCategory: {
    expenseCreate: () => `${databaseKey}/api/v1/create_expenseforCopy`,
    listExpense: () => `${databaseKey}/api/v1/getAll_expenseforCopy`,
    editExpense: (expenseforCopy_id: any) =>
      `${databaseKey}/api/v1/edit_expenseforCopy/${expenseforCopy_id}`,
    ExpenseStatusUpdate: (expenseforCopy_id: any) =>
      `${databaseKey}/api/v1/update_expenseforCopy_status/${expenseforCopy_id}`,
    getByIdExpense: (expenseforCopy_id: any) =>
      `${databaseKey}/api/v1/get_ById_expenseforCopy/${expenseforCopy_id}`,
    ExpenseDelete: (expenseforCopy_id: any) =>
      `${databaseKey}/api/v1/delete_expenseforCopy/${expenseforCopy_id}`,
  },

  // Duration Master API's
  DurationMaster: {
    durationCreate: () => `${databaseKey}/api/v1/create_duration_type`,
    durationList: () => `${databaseKey}/api/v1/getAll_duration_type`,
    durationEdit: (duration_type_id: any) =>
      `${databaseKey}/api/v1/edit_duration_type/${duration_type_id}`,
    getByIdDuration: (duration_type_id: any) =>
      `${databaseKey}/api/v1/get_ById_duration_type/${duration_type_id}`,
  },

  //Sector-Master API's
  SectorMaster: {
    sectorCreate: () => `${databaseKey}/api/v1/createSector`,
    sectorList: () => `${databaseKey}/api/v1/GetAllSector`,
    sectorEdit: (sector_id: any) =>
      `${databaseKey}/api/v1/editSector/${sector_id}`,
    getById: (sector_id: any) =>
      `${databaseKey}/api/v1/getbyISector/${sector_id}`,
  },

  //Rating API's
  Rating: {
    ratingCreate: () => `${databaseKey}/api/v1/create_rating`,
    ratingList: () => `${databaseKey}/api/v1/getAll_rating`,
    ratingEdit: (rating_id: any) =>
      `${databaseKey}/api/v1/edit_rating/${rating_id}`,
    getById: (rating_id: any) =>
      `${databaseKey}/api/v1/get_ById_rating/${rating_id}`,
  },

  //Bank Master API'S
  Bank: {
    bankCreate: () => `${databaseKey}/api/v1/create_Bank`,
    bankList: () => `${databaseKey}/api/v1/bankdetails/getall`,
    bankEdit: (bank_id: any) => `${databaseKey}/api/v1/editBank/${bank_id}`,
    getById: (bank_id: any) => `${databaseKey}/api/v1/getByIdBank/${bank_id}`,
  },

  //Contact Source API's
  ContactSource: {
    contactCreat: () => `${databaseKey}/api/v1/createcontactSource`,
    contactList: () => `${databaseKey}/api/v1/getAllcontactSource`,
    contactEdit: (contact_source_id: any) =>
      `${databaseKey}/api/v1/editContactSource/${contact_source_id}`,
    getById: (contact_source_id: any) =>
      `${databaseKey}/api/v1/getByIdcontactSource/${contact_source_id}`,
  },

  //Customer Category API's
  CustomerCategory: {
    customerCreate: () => `${databaseKey}/api/v1/createCustomerCategory`,
    customerList: () => `${databaseKey}/api/v1/getAllCustomerCategory`,
    customerEdit: (customer_category_id: any) =>
      `${databaseKey}/api/v1/editCustomerCategory/${customer_category_id}`,
    getById: (customer_category_id: any) =>
      `${databaseKey}/api/v1/getByIdCustomerCategory/${customer_category_id}`,
  },

  //Leave Type API's
  LeaveType: {
    leaveTypeCreate: () => `${databaseKey}/api/v1/createLeaveTypes`,
    leaveTypeList: () => `${databaseKey}/api/v1/getAllLeaveTypes`,
    leaveTypeEdit: (leave_id: any) =>
      `${databaseKey}/api/v1/editLeaveTypes/${leave_id}`,
    leaveTypeUpdateStatus: (leave_id: any) =>
      `${databaseKey}/api/v1/updateLeaveTypesStatus/${leave_id}`,
    getById: (leave_id: any) =>
      `${databaseKey}/api/v1/getByIdLeaveTypes/${leave_id}`,
    deleteLeaveTypes: (leave_id: any) =>
      `${databaseKey}/api/v1/deleteLeaveTypes/${leave_id}`,
  },
  //Location API's
  Location: {
    locationCreate: () => `${databaseKey}/api/v1/createlocation`,
    locationList: () => `${databaseKey}/api/v1/getAlllocation`,
    locationEdit: (location_id: any) =>
      `${databaseKey}/api/v1/editlocation/${location_id}`,
    getById: (location_id: any) =>
      `${databaseKey}/api/v1/getByIdlocation/${location_id}`,
  },

  //Industry Sector Master API's
  IndustrySectorMaster: {
    industryCreate: () => `${databaseKey}/api/v1/createIndustrySector`,
    IndustryList: () => `${databaseKey}/api/v1/getAllIndustrySector`,
    industryEdit: (industry_sector_id: any) =>
      `${databaseKey}/api/v1/editIndustrySector/${industry_sector_id}`,
    getById: (industry_sector_id: any) =>
      `${databaseKey}/api/v1/getByIdIndustrySector/${industry_sector_id}`,
  },

  //Grade API's
  Grade: {
    gradeCreate: () => `${databaseKey}/api/v1/grade`,
    gradeList: () => `${databaseKey}/api/v1/gradelist`,
    gradeEdit: (id: any) => `${databaseKey}/api/v1/gradeupdate/${id}`,
    updateStatusgrade: (id: any) =>
      `${databaseKey}/api/v1/gradeupdateStatus/${id}`,
    getById: (id: any) => `${databaseKey}/api/v1/gradedetails/${id}`,
    deleteGrade: (id: any) => `${databaseKey}/api/v1/gradedelete/${id}`,
  },

  Approver: {
    createApprover: () => `${databaseKey}/api/v1/create_approval`,
    listApprover: () => `${databaseKey}/api/v1/getAll_approval`,
    updateApprover: (approval_id: any) =>
      `${databaseKey}/api/v1/updateby_approval/${approval_id}`,
    getByIdApprover: (approval_id: any) =>
      `${databaseKey}/api/v1/getById_approval/${approval_id},`,
  },

  GSTMapping: {
    get_GST_Type: () => `${databaseKey}/api/v1/get_GST_Type`,
    addGSTGlMapping: () => `${databaseKey}/api/v1/addGSTGlMapping`,
    get_GST_GL_Mapping_List: (id: any) =>
      `${databaseKey}/api/v1/get_GST_GL_Mapping_List/${id}`,
    get_GST_GL_Mapping_By_Id: (id: any) =>
      `${databaseKey}/api/v1/get_GST_GL_Mapping_By_Id/${id}`,
    updateGstGlMapping: (id: any) =>
      `${databaseKey}/api/v1/updateGstGlMapping/${id}`,
    deleteGstGlMappingById: (id: any) =>
      `${databaseKey}/api/v1/deleteGstGlMappingById/${id}`,
    get_mapped_sales_gl: (id: any) =>
      `${databaseKey}/api/v1/get_mapped_sales_gl/${id}`,
  },
  //Source-Stage API's
  SourceStage: {
    SourceStageCreate: () => `${databaseKey}/api/v1/createStage`,
    SourceStageList: () => `${databaseKey}/api/v1/getAllStage`,
    SourceStageEdit: (stage_Id: any) =>
      `${databaseKey}/api/v1/editStage/${stage_Id}`,
    getById: (stage_Id: any) =>
      `${databaseKey}/api/v1/getStageById/${stage_Id}`,
  },

  //Employement-Type API's
  EmployementType: {
    employementCreate: () => `${databaseKey}/api/v1/employment`,
    employementList: () => `${databaseKey}/api/v1/employmentlist`,
    getactive_employmentTypeList: () =>
      `${databaseKey}/api/v1/getactive_employmentTypeList`,
    employeeEdit: (emptype_id: any) =>
      `${databaseKey}/api/v1/employmentupdate/${emptype_id}`,
    employeeUpdateStatus: (emptype_id: any) =>
      `${databaseKey}/api/v1/employmentupdatestatus/${emptype_id}`,
    getById: (emptype_id: any) =>
      `${databaseKey}/api/v1/employmentdetails/${emptype_id}`,
    employementDelete: (emptype_id: any) =>
      `${databaseKey}/api/v1/employmentdelete/${emptype_id}`,
  },

  department: {
    list: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllDepartment?entity_id=${entity_id}`,
    getCostProfitType: (entity_id: any) =>
      `${databaseKey}/api/v1/getCostProfitType?entity_id=${entity_id}`,
    listActive: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllDepartment_active?entity_id=${entity_id}`,
    get_all_workflow_department: (employee_id: any) =>
      `${databaseKey}/api/v1/get_all_workflow_department?employee_id=${employee_id}`,
    levelTypeList: (entity_id: any) =>
      `${databaseKey}/api/v1/levelType?entity_id=${entity_id}`,
    getAllArea_active: () => `${databaseKey}/api/v1/getAllArea_active`,
    branch_get_active: () => `${databaseKey}/api/v1/branch_get_active`,
    getContractTypes_active: (entityId: any, finacId: any) =>
      `${databaseKey}/api/v1/getContractTypes_active/${entityId}/${finacId}`,
    getAllReason_active: (entityId: any) =>
      `${databaseKey}/api/v1/getAllReason_active/${entityId}`,
    getAllDesignation_active: () =>
      `${databaseKey}/api/v1/getAllDesignation_active`,
    getAllRole: (role: any) => `${databaseKey}/api/v1/getAllRoleMaster/${role}`,
    get_all_employeeBy_User_role: (role_id: any, entity_id: any) =>
      `${databaseKey}/api/v1/get_all_employeeBy_User_role/${role_id}?entity_id=${entity_id}`,
    getAllDepartment_all_active: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllDepartment_all_active?entity_id=${entity_id}`,
    getAllDepartment_all: (entity_id: any, employee_id: any) =>
      `${databaseKey}/api/v1/getAllDepartment_all?entity_id=${entity_id}&employee_id=${employee_id}`,

    listAll: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllDepartment_all?entity_id=${entity_id}`,
    create: (entity_id: any) =>
      `${databaseKey}/api/v1/createDepartment?entity_id=${entity_id}`,
    createCostProfitType: () => `${databaseKey}/api/v1/createCostProfitType`,
    // countryGetById: (countryss_id: any) => `${databaseKey}/api/v1/getByIdcountry/${countryss_id}`,
    updateDept: (dept_id: any, entity_id: any) =>
      `${databaseKey}/api/v1/editDepartment/${dept_id}`,
    byId: (dept_id: any) =>
      `${databaseKey}/api/v1/getByIdDepartment/${dept_id}`,
    delete: (dept_id: any) =>
      `${databaseKey}/api/v1/deleteDepartment/${dept_id}`,
    status: (dept_id: any) =>
      `${databaseKey}/api/v1/updateDepartmentStatus/${dept_id}`,
  },

  allowance: {
    createAllownce: () => `${databaseKey}/api/v1/createAllowance`,
    getAllAllownce: (req: any) =>
      `${databaseKey}/api/v1/getall_Allowance?entity_id=${req?.entity_id}&financial_id=${req?.fy_id}`,
    get_all_employe: (entity_id: any) =>
      `${databaseKey}/api/v1/get_all_employe/${entity_id}`,
    updateStatus: (id: any) =>
      `${databaseKey}/api/v1/Allowance_updateById/${id}`,
    deleteallowance: (id: any) =>
      `${databaseKey}/api/v1/Allowance_deleteById/${id}`,
    statusUpdate: (id: any) => `${databaseKey}/api/v1/Allowance_Status/${id}`,
    allowanceGetByID: (id: any) =>
      `${databaseKey}/api/v1/Allowance_getById/${id}`,
  },

  reason_master: {
    getall_reasons: (entity_id: any) =>
      `${databaseKey}/api/v1/getall_reasons/${entity_id}`,
    create_reason: () => `${databaseKey}/api/v1/create_reason`,
    update_reason_ById: (id: any) =>
      `${databaseKey}/api/v1/update_reason_ById/${id}`,
    get_reason_ById: (id: any) => `${databaseKey}/api/v1/get_reason_ById/${id}`,
    delete_reason_ById: (id: any) =>
      `${databaseKey}/api/v1/delete_reason_ById/${id}`,
    updatedStatusReason: (id: any) => `${databaseKey}/api/v1/resStatus/${id}`,
  },

  contract_type_master: {
    get_Contract: (entity: any, finacial_id: any) =>
      `${databaseKey}/api/v1/get_Contract/${entity}/${finacial_id}`,

    createContractType: () => `${databaseKey}/api/v1/createContractType`,

    update_ContractById: (id: any) =>
      `${databaseKey}/api/v1/update_ContractById/${id}`,

    get_ContractById: (id: any) =>
      `${databaseKey}/api/v1/get_ContractById/${id}`,

    delete_ContractById: (id: any) =>
      `${databaseKey}/api/v1/delete_ContractById/${id}`,

    updateContractType: (id: any) => `${databaseKey}/api/v1/CONStatus/${id}`,
  },

  municipality_master: {
    get_Municipality: (entity_id: any) =>
      `${databaseKey}/api/v1/get_Municipality/${entity_id}`,
    get_active_municipality: (entity_id: any) =>
      `${databaseKey}/api/v1/get_active_municipality/${entity_id}`,

    createMunicipality: () => `${databaseKey}/api/v1/createMunicipality`,

    update_MunicipalityById: (id: any) =>
      `${databaseKey}/api/v1/update_MunicipalityById/${id}`,

    get_MunicipalityById: (id: any) =>
      `${databaseKey}/api/v1/get_MunicipalityById/${id}`,
    deleteMunicipalityById: (id: any) =>
      `${databaseKey}/api/v1/deleteMunicipalityById/${id}`,
  },

  designation: {
    list: () => `${databaseKey}/api/v1/getAllDesignation`,
    create: () => `${databaseKey}/api/v1/createDesignation`,
    // countryGetById: (countryss_id: any) => `${databaseKey}/api/v1/getByIdcountry/${countryss_id}`,
    updateDesi: (designation_id: any) =>
      `${databaseKey}/api/v1/editDesignation/${designation_id}`,
    updateDesignationStatus: (designation_id: any) =>
      `${databaseKey}/api/v1/update_designation_status/${designation_id}`,
    byId: (designation_id: any) =>
      `${databaseKey}/api/v1/getByIdDesignation/${designation_id}`,
    designationDelete: (designation_id: any) =>
      `${databaseKey}/api/v1/deleteDesignation/${designation_id}`,
  },

  yearExperiance: {
    list: () => `${databaseKey}/api/v1/getAllYOE`,
    create: () => `${databaseKey}/api/v1/createYOE`,
    // countryGetById: (countryss_id: any) => `${databaseKey}/api/v1/getByIdcountry/${countryss_id}`,
    updateYearExperiance: (year_of_exp_id: any) =>
      `${databaseKey}/api/v1/editYearOfExprience/${year_of_exp_id}`,
    byId: (year_of_exp_id: any) =>
      `${databaseKey}/api/v1/getByIdYOE/${year_of_exp_id}`,
  },

  region: {
    regionCreate: () => `${databaseKey}/api/v1/create_new_region`,
    regionGet: () => `${databaseKey}/api/v1/getAll_new_region`,
    regionGetById: (id: any) =>
      `${databaseKey}/api/v1/get_ById_new_region/${id}`,
    regionUpdate: (id: any) => `${databaseKey}/api/v1/edit_new_region/${id}`,
  },

  auditor: {
    list: () => `${databaseKey}/api/v1/get_All_Auditor_Qualification`,
    upload: () => `${databaseKey}/api/v1/uploadCsv_Author_Qualification`,
    csvUploadpost: () =>
      `${databaseKey}/api/v1/createoneAccredition_logo_details`,
  },
  //pincode API//
  Pincode: {
    pincodeCreate: () => `${databaseKey}/api/v1/createpincodecontroller`,
    pincodeGet: () => `${databaseKey}/api/v1/getallpincodecontroller`,
    pincodeGetById: (city_id: any) =>
      `${databaseKey}/api/v1/getidpincodecontroller/${city_id}`,
    // pincodeGetById: (city_id: any) =>
    //   `${databaseKey}/api/v1/getpincodebycityid/${city_id}`,
    pincodeUpdate: (city_id: any) =>
      `${databaseKey}/api/v1/editpincodecontroller/${city_id}`,
    pincodestatusdelete: (city_id: any) =>
      `${databaseKey}/api/v1/deletepincodecontroller/${city_id}`,
  },
  //Quotation Currency//
  QuotationCurrency: {
    quotationcurrencyCreate: () =>
      `${databaseKey}/api/v1/createQuotation_currency`,
    quotationcurrencyGet: () =>
      `${databaseKey}/api/v1/getAllQuotation_currency`,
    quotationcurrencyGetById: (quotation_currency_id: any) =>
      `${databaseKey}/api/v1/getByIdQuotation_currency/${quotation_currency_id}`,
    statusUpdateQuotationcurrency: (quotation_currency_id: any) =>
      `${databaseKey}/api/v1/updateQuotation_currencyStatus/${quotation_currency_id}`,
    quotationcurrencyUpdate: (quotation_currency_id: any) =>
      `${databaseKey}/api/v1/editQuotation_currency/${quotation_currency_id}`,
    quotationCurrencyDelete: (quotation_currency_id: any) =>
      `${databaseKey}/api/v1/deleteQuotation_currency/${quotation_currency_id}`,
  },
  //Quotation Currency//
  //Accrediation  ID//
  AccrediationId: {
    accrediationidCreate: () => `${databaseKey}/api/v1/create_accreaditation`,
    accrediationidGet: () => `${databaseKey}/api/v1/getAll_accreaditation`,
    accrediationidGetById: (accreditationID: any) =>
      `${databaseKey}/api/v1/get_ById_accreaditation/${accreditationID}`,
    accrediationidUpdate: (accreditationID: any) =>
      `${databaseKey}/api/v1/edit_accreaditation/${accreditationID}`,
    accrediationDelete: (accredition_logo_details_id: any) =>
      `${databaseKey}/api/v1/delete_accreaditation/${accredition_logo_details_id}`,
    csvUploadposts: () =>
      `${databaseKey}/api/v1/upload_Csv_Accredition_details`,
  },
  //Accrediation Logo Details//
  AccrediationLogo: {
    accrediationlogoCreate: () =>
      `${databaseKey}/api/v1/createAccredition_logo_details`,
    accrediationlogoGet: () =>
      `${databaseKey}/api/v1/getAllAccredition_logo_details`,
    accrediationlogoGetById: (accredition_logo_details_id: any) =>
      `${databaseKey}/api/v1/getByIdAccredition_logo_details/${accredition_logo_details_id}`,
    accrediationlogoUpdate: (accredition_logo_details_id: any) =>
      `${databaseKey}/api/v1/editAccredition_logo_details/${accredition_logo_details_id}`,
  },
  //EA Code//
  EaCode: {
    eacodeCreate: () => `${databaseKey}/api/v1/create_ea_code`,
    eacodeGet: () => `${databaseKey}/api/v1/getAll_ea_code`,
    eacodeGetById: (ea_code_id: any) =>
      `${databaseKey}/api/v1/get_ById_ea_code/${ea_code_id}`,
    eacodeUpdate: (ea_code_id: any) =>
      `${databaseKey}/api/v1/edit_ea_code/${ea_code_id}`,
  },
  //segment//
  Segment: {
    segmentCreate: () => `${databaseKey}/api/v1/create_segment`,
    segmentGet: () => `${databaseKey}/api/v1/getAll_segment`,
    segmentGetById: (segment_id: any) =>
      `${databaseKey}/api/v1/get_ById_segment/${segment_id}`,
    segmentUpdate: (segment_id: any) =>
      `${databaseKey}/api/v1/edit_segment/${segment_id}`,
    getCertificateByID: (certificate_type_id: any) =>
      `${databaseKey}/api/v1/get_BysegmentId_certificate_type/${certificate_type_id}`,
  },
  // product-master
  Product: {
    productCreate: () => `${databaseKey}/api/v1/create_product_master`,
    productGet: () => `${databaseKey}/api/v1/getAll_product_master`,
    ProductGetbyId: (id: any) =>
      `${databaseKey}/api/v1/get_ById_product_master/${id}`,
    productUpdate: (id: any) =>
      `${databaseKey}/api/v1/edit_product_master/${id}`,
    ProductGetbyIdSPA: (id: any) =>
      `${databaseKey}/api/v1/get_Bycertificate_typeId_new_spa/${id}`,
  },
  CustomerType: {
    CustomerTypeCreate: () => `${databaseKey}/api/v1/create_customer_type`,
    CustomerGet: () => `${databaseKey}/api/v1/getAll_customer_type`,
    customertypeUpdate: (customer_type_id: any) =>
      `${databaseKey}/api/v1/edit_new_region/${customer_type_id}`,
    customerTypeEdit: (customer_type_id: any) =>
      `${databaseKey}/api/v1/edit_customer_type/${customer_type_id}`,
  },
  customerType: {
    createCustomer: () => `${databaseKey}/api/v1/createCustomerType`,
    getAllCustomer: () => `${databaseKey}/api/v1/getAllCustomerType`,
    getAllActiveCustomer: () => `${databaseKey}/api/v1/getAllActiveCustomer`,
    deleteCustomer: (id: any) =>
      `${databaseKey}/api/v1/deleteCustomerType/${id}`,
    getCustomertByIdDD: (id: any) =>
      `${databaseKey}/api/v1/getByIdCustomerType/${id}`,
    updateCustomerByid: (id: any) =>
      `${databaseKey}/api/v1/editCustomerType/${id}`,
    updateCustomerTypeStatus: (id: any) =>
      `${databaseKey}/api/v1/updateCustomerTypeStatus/${id}`,
    masterPriceList: (type: any, entity_id: any) =>
      `${databaseKey}/api/v1/getPriceList?customer_type=${type}&entity_id=${entity_id}`,
  },
  // Training name
  TrainingName: {
    TrainingNameCreate: () => `${databaseKey}/api/v1/create_traning_name`,
    TrainingGet: () => `${databaseKey}/api/v1/getAll_traning_name`,
    trainingNameUpdate: (traning_name_id: any) =>
      `${databaseKey}/api/v1/edit_traning_name/${traning_name_id}`,
    trainingNameEdit: (traning_name_id: any) =>
      `${databaseKey}/api/v1/edit_traning_name/${traning_name_id}`,
    trainingNameById: (id: any) =>
      `${databaseKey}/api/v1/get_ById_traning_name/${id}`,
  },

  // Level slab
  LevelSlab: {
    levelSlabById: (id: any) =>
      `${databaseKey}/api/v1/get_ById_level_slab/${id}`,
    LevelSlabGet: () => `${databaseKey}/api/v1/getAll_level_slab`,
    createlevelSlab: () => `${databaseKey}/api/v1/create_level_slab`,
    levelSlabUpdate: (level_slab_id: any) =>
      `${databaseKey}/api/v1/edit_level_slab/${level_slab_id}`,
    levelSlabUpdateStatus: (level_slab_id: any) =>
      `${databaseKey}/api/v1/update_level_slab_Status/${level_slab_id}`,
    levelSlabEdit: (traning_name_id: any) =>
      `${databaseKey}/api/v1/edit_level_slab/${traning_name_id}`,
    levelSlabDelete: (id: any) =>
      `${databaseKey}/api/v1/delete_level_slab/${id}`,
  },

  // Price map
  PriceMap: {
    priceById: (id: any) =>
      `${databaseKey}/api/v1/get_ById_price_mapping/${id}`,
    priceMapGet: () => `${databaseKey}/api/v1/getAll_price_mapping`,
    createpriceMap: () => `${databaseKey}/api/v1/create_price_mapping`,
    priceMapUpdate: (price_mapping_id: any) =>
      `${databaseKey}/api/v1/edit_price_mapping/${price_mapping_id}`,
    priceMapEdit: (price_mapping_id: any) =>
      `${databaseKey}/api/v1/edit_price_mapping/${price_mapping_id}`,
  },
  // price level
  PriceLevel: {
    priceLevelById: (id: any) =>
      `${databaseKey}/api/v1/get_ById_pricing_level/${id}`,
    createpriceLevel: () => `${databaseKey}/api/v1/create_pricing_level`,
    priceMapGet: () => `${databaseKey}/api/v1/getAll_pricing_level`,
    updatePriceLevel: (pricing_level_id: any) =>
      `${databaseKey}/api/v1/edit_pricing_level/${pricing_level_id}`,
    pricelevelEdit: (pricing_level_id: any) =>
      `${databaseKey}/api/v1/edit_pricing_level/${pricing_level_id}`,
  },

  //certificate Type//
  certiTypes: {
    certificateCreate: () => `${databaseKey}/api/v1/create_certificate_type`,
    certficateGet: () => `${databaseKey}/api/v1/getAll_certificate_type`,
    certificateGetById: (certificate_type_id: any) =>
      `${databaseKey}/api/v1/get_ById_certificate_type/${certificate_type_id}`,
    certificateUpdate: (certificate_type_id: any) =>
      `${databaseKey}/api/v1/edit_certificate_type/${certificate_type_id}`,
  },
  //Regional Bussiness Head //
  regionalbussinesshead: {
    regionalbussinessheadCreate: () =>
      `${databaseKey}/api/v1/create_new_regional_business_head`,
    regionalbussinessheadGet: () =>
      `${databaseKey}/api/v1/getAll_new_regional_business_head`,
    regionalbussinessheadGetById: (new_regional_business_head_id: any) =>
      `${databaseKey}/api/v1/get_ById_new_regional_business_head/${new_regional_business_head_id}`,
    regionalbussinessheadUpdate: (new_regional_business_head_id: any) =>
      `${databaseKey}/api/v1/edit_new_regional_business_head/${new_regional_business_head_id}`,
  },
  // GlobalsalesManager
  globalSalesManager: {
    globalSalesManagerCreate: () =>
      `${databaseKey}/api/v1/create_new_global_manager_sales`,
    globalSalesManagerList: () =>
      `${databaseKey}/api/v1/getAll_new_global_manager_sales`,
    globalSalesManagerUpdate: (new_global_manager_sales_id: any) =>
      `${databaseKey}/api/v1/edit_new_global_manager_sales/${new_global_manager_sales_id}`,
    getById: (new_global_manager_sales_id: any) =>
      `${databaseKey}/api/v1/get_ById_new_global_manager_sales/${new_global_manager_sales_id}`,
  },
  // Vendor
  vendor: {
    getVendorType: () => `${databaseKey}/api/v1/get_All_Type_Of_Vendor`,
    getVendorById: (id: any) =>
      `${databaseKey}/api/v1/get_ById_Type_Of_Vendor/${id}`,
    addVendorType: () => `${databaseKey}/api/v1/create_Type_Of_Vendor`,
    vendorUpdate: (id: any) =>
      `${databaseKey}/api/v1/edit_Type_Of_Vendor/${id}`,
  },
  // Completeness Check
  completenessCheck: {
    completeness_create: () => `${databaseKey}/api/v1/create_l1Review`,
    compltenessList: () => `${databaseKey}/api/v1/getAll_l1Review`,
    completenessUpdate: (l1_code: any) =>
      `${databaseKey}/api/v1/edit_l1Review/${l1_code}`,
  },
  // Conclusion of Completeness Check
  concompleteness: {
    concompleteness_create: () =>
      `${databaseKey}/api/v1/create_Completeness_Check_l1`,
    concompletenessList: () =>
      `${databaseKey}/api/v1/get_All_Completeness_Check_l1`,
    concompletenessUpdate: (completeness_Checkl1_id: any) =>
      `${databaseKey}/api/v1/edit_Completeness_Check_l1/${completeness_Checkl1_id}`,
  },
  // Technical Review
  technicalCheck: {
    techreview_create: () => `${databaseKey}/api/v1/create_technical_review`,
    techreviewList: () => `${databaseKey}/api/v1/getAll_technical_review`,
    techreviewUpdate: (technical_review_id: any) =>
      `${databaseKey}/api/v1/edit_technical_review/${technical_review_id}`,
  },
  // Conclusion of Technical Review
  contechnicalCheck: {
    contechreview_create: () =>
      `${databaseKey}/api/v1/create_completeness_Check_technical`,
    contechreviewList: () =>
      `${databaseKey}/api/v1/get_All_completeness_Check_technical`,
    contechreviewUpdate: (completeness_Check_tech_id: any) =>
      `${databaseKey}/api/v1/edit_completeness_Check_technical/${completeness_Check_tech_id}`,
  },

  courierService: {
    courier_create: () => `${databaseKey}/api/v1/create_Courier_Service_name`,
    courier_List: () => `${databaseKey}/api/v1/get_All_Courier_Service_name`,
    courierGetById: (id: any) =>
      `${databaseKey}/api/v1/get_ById_Courier_Service_name/${id}`,
    deleteCourier: (id: any) =>
      `${databaseKey}/api/v1/delete_Courier_Service_name/${id}`,
    courier_update: (id: any) =>
      `${databaseKey}/api/v1/edit_Courier_Service_name/${id}`,
    courier_update_status: (id: any) =>
      `${databaseKey}/api/v1/update_Courier_Service_status/${id}`,
  },

  courier_contains: {
    contains_create: () => `${databaseKey}/api/v1/create_Courier_Contains`,
    contains_List: () => `${databaseKey}/api/v1/get_All_Courier_Contains`,
    containsGetById: (id: any) =>
      `${databaseKey}/api/v1/get_ById_Courier_Contains/${id}`,
    containsDelete: (id: any) =>
      `${databaseKey}/api/v1/delete_Courier_Contains/${id}`,
    contains_update: (id: any) =>
      `${databaseKey}/api/v1/edit_Courier_Contains/${id}`,
    contains_update_status: (id: any) =>
      `${databaseKey}/api/v1/update_Courier_Contains_status/${id}`,
  },
  language: {
    getAllLanguage: () => `${databaseKey}/api/v1/get_all_languages`,
    getlangById: (id: any) => `${databaseKey}/api/v1/get_language_byid/${id}`,
    langDelete: (id: any) => `${databaseKey}/api/v1/delete_language/${id}`,
    createLanguage: () => `${databaseKey}/api/v1/create_new_language`,
    update_lang: (id: any) => `${databaseKey}/api/v1/update_language/${id}`,
    update_lang_status: (id: any) =>
      `${databaseKey}/api/v1/update_language_status/${id}`,
  },

  amc_des: {
    getAllAmcDes: () => `${databaseKey}/api/v1/get_all_amc_description`,
    getAmcDesById: (id: any) =>
      `${databaseKey}/api/v1/get_by_id_amc_description/${id}`,
    AmcDesDelete: (id: any) =>
      `${databaseKey}/api/v1/delete_amc_description/${id}`,
    createAmcDes: () => `${databaseKey}/api/v1/create_amc_description`,
    edit_amc_des: (id: any) =>
      `${databaseKey}/api/v1/update_amc_description/${id}`,
    edit_amc_des_status: (id: any) =>
      `${databaseKey}/api/v1/update_amc_description_status/${id}`,
  },

  empDocSign: {
    createEmpSign: (id: any) =>
      `${databaseKey}/api/v1/create_employee_sign/${id}`,
    getAllEmpSign: () => `${databaseKey}/api/v1/get_all_employee_sign`,
    getByEmpSign: (id: any) =>
      `${databaseKey}/api/v1/get_employee_sign_by_id/${id}`,
    updateEmplSign: (id: any) =>
      `${databaseKey}/api/v1/update_employee_sign/${id}`,
  },

  plantMasterService: {
    plantMaster_create: () => `${databaseKey}/api/v1/create_plant`,
    plantMaster_List: (id: any) => `${databaseKey}/api/v1/plant_getAll/${id}`,
    plantMasterGetById: (id: any, plant_id: any) =>
      `${databaseKey}/api/v1/plant_getAll/${id}/${plant_id}`,
    plantMasterDelete: (id: any) => `${databaseKey}/api/v1/delete_plant/${id}`,
    plantMasterStatusById: (id: any) =>
      `${databaseKey}/api/v1/plantStatus/${id}`,
    plantMaster_update: (id: any) => `${databaseKey}/api/v1/update_plant/${id}`,
  },

  branchSetup: {
    list: () => `${databaseKey}/api/v1/branchSetup_get`,
    activeList: () => `${databaseKey}/api/WL/branchSetup_get_active`,
    getAllArea: () => `${databaseKey}/api/v1/getAllArea`,
    create: () => `${databaseKey}/api/v1/create_branchSetup`,
    getById: (id: any) => `${databaseKey}/api/v1/branchSetup_get/${id}`,
    deleteData: (id: any) => `${databaseKey}/api/v1/delete_branchSetup/${id}`,
    update: (id: any) => `${databaseKey}/api/v1/update_branchSetup/${id}`,
    statusById: (id: any) => `${databaseKey}/api/v1/branchStatus/${id}`,
  },

  hsnSacMaster: {
    getGSTRate: () => `${databaseKey}/api/v1/getGSTRate`,
    create_hsn_sac: () => `${databaseKey}/api/v1/create_hsn_sac`,
    getHsnSacById: (id: any) => `${databaseKey}/api/v1/getHsnSacById/${id}`,
    getHsnSacList: () => `${databaseKey}/api/v1/getHsnSacList`,
    delete_HSN_SAC: (id: any) => `${databaseKey}/api/v1/delete_HSN_SAC/${id}`,
  },
  vatMaster: {
    create_vat_name: () => `${databaseKey}/api/v1/create_vat_name`,
    get_All_VAT: () => `${databaseKey}/api/v1/get_All_VAT`,
    get_VATById: (id: any) => `${databaseKey}/api/v1/get_VATById/${id}`,
    delete_VATById: (id: any) => `${databaseKey}/api/v1/delete_VATById/${id}`,
    VAT_Status: (id: any) => `${databaseKey}/api/v1/VAT_Status/${id}`,
    get_Active_VATS: () => `${databaseKey}/api/v1/get_Active_VATS`,
  },
  uomService: {
    uom_create: () => `${databaseKey}/api/v1/create_uom`,
    uom_List: () => `${databaseKey}/api/v1/getAllUOM`,
    active_uom_List: () => `${databaseKey}/api/v1/getAllActiveUOM`,
    uomGetById: (id: any) => `${databaseKey}/api/v1/getByIdUOM/${id}`,
    uomDelete: (id: any) => `${databaseKey}/api/v1/deleteUOM/${id}`,
    uomStatusById: (id: any) => `${databaseKey}/api/v1/UOMStatus/${id}`,
    uom_update: (id: any) => `${databaseKey}/api/v1/edituom/${id}`,
  },

  checklistService: {
    checklist_create: () => `${databaseKey}/api/v1/create_checklist`,
    checklist_List: () => `${databaseKey}/api/v1/getAllCHECKLIST`,
    active_checklist_List: () => `${databaseKey}/api/v1/getAllActiveCHECKLIST`,
    checklistGetById: (id: any) =>
      `${databaseKey}/api/v1/getByIdCHECKLIST/${id}`,
    checklistDelete: (id: any) => `${databaseKey}/api/v1/deleteCHECKLIST/${id}`,
    checklistStatusById: (id: any) =>
      `${databaseKey}/api/v1/CHECKLISTStatus/${id}`,
    checklist_update: (id: any) => `${databaseKey}/api/v1/editchecklist/${id}`,
  },

  shiftService: {
    shift_create: () => `${databaseKey}/api/v1/createShift`,
    shift_List: () => `${databaseKey}/api/v1/getAllShift`,
    shiftGetById: (id: any) => `${databaseKey}/api/v1/getAllShiftbyId/${id}`,
    shiftDelete: (id: any) => `${databaseKey}/api/v1/deleteShift/${id}`,
    shiftStatusById: (id: any) => `${databaseKey}/api/v1/shiftStatus/${id}`,
    shift_update: (id: any) => `${databaseKey}/api/v1/updateShift/${id}`,
    createProductSchedule: () => `${databaseKey}/api/v1/createProduction`,
  },

  itemService: {
    createItem: () => `${databaseKey}/api/v1/createItem`,
    itemList: () => `${databaseKey}/api/v1/getAllItem`,
    getAllItemMasterList: () => `${databaseKey}/api/v1/getAllItemMasterList`,
    getAllActiveItem: () => `${databaseKey}/api/v1/getAllActiveItem`,
    itemGetById: (id: any) => `${databaseKey}/api/v1/getItemById/${id}`,
    itemDelete: (id: any) => `${databaseKey}/api/v1/deleteItemMaster/${id}`,
    item_update: (id: any) => `${databaseKey}/api/v1/updateItemMaster/${id}`,
    item_StatusUpdate: (id: any) =>
      `${databaseKey}/api/v1/updateItemStatus/${id}`,
    itemtype: () => `${databaseKey}/api/v1/getItemType`,
    itemTypeCategory: (id: any) =>
      `${databaseKey}/api/v1/getAllItemCategory/${id}`,
    documenttype: () => `${databaseKey}/api/v1/getDocumentTypeMaster`,
    itemBySubCategory: (id: any) =>
      `${databaseKey}/api/v1/itemname/onbasisofsubcategoryid/${id}`,
    getItemPriceSubcategory: (
      customer_id: any,
      item_id: any,
      sub_category_id: any,
      asset_id: any,
      version_id: any,
    ) =>
      `${databaseKey}/api/v1/getItemsPriceBySubCategory?customer_id=${customer_id}&item_id=${item_id}&sub_category_id=${sub_category_id}&asset_id=${asset_id}&version_id=${version_id}`,
    warehouseList: (entity_id: any, financial_year_id: any) =>
      `${databaseKey}/api/v1/get_all_warehouse_list/${entity_id}/${financial_year_id}`,
    vendorList: (entity_id: any) =>
      `${databaseKey}/api/v1/get_all_vendor?entity_id=${entity_id}`,
    createItemSerialNumber: () =>
      `${databaseKey}/api/v1/createWarehouseManagement`,
    getItemName: (id1: any, id2: any) =>
      `${databaseKey}/api/v1/get_item_master/${id1}/${id2}`,
  },

  assetMasterService: {
    assetMaster_create: () => `${databaseKey}/api/v1/createAssets`,
    assetMaster_List: () => `${databaseKey}/api/v1/assets_get`,
    activeAssetMaster_List: () => `${databaseKey}/api/v1/active_assets_get`,
    assetMasterGetById: (id: any) =>
      `${databaseKey}/api/v1/assets_get_id/${id}`,
    assetMasterDelete: (id: any) => `${databaseKey}/api/v1/delete_asset/${id}`,
    assetMaster_update: (id: any) => `${databaseKey}/api/v1/update_asset/${id}`,
    assetMaster_update_status: (id: any) =>
      `${databaseKey}/api/v1/assetStatus/${id}`,
  },

  serviceMasterService: {
    serviceMaster_create: () => `${databaseKey}/api/v1/createServiceMaster`,
    createMateriaRequest: () => `${databaseKey}/api/v1/createMaterialRequest`,
    allocateMaterial: () => `${databaseKey}/api/v1/materialRequestAllocate`,
    serviceMaster_List: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllServices?entity_id=${entity_id}`,
    getMaterialRequestList: (id: any) =>
      `${databaseKey}/api/v1/getMaterialRequestbyComplainId/${id}`,
    getAllMaterialRequestList: () =>
      `${databaseKey}/api/v1/allMaterialRequestList`,
    serviceMasterGetById: (id: any) =>
      `${databaseKey}/api/v1/getServicesById/${id}`,
    serviceMasterDelete: (id: any) =>
      `${databaseKey}/api/v1/deleteServices/${id}`,
    serviceMaster_update: (id: any) =>
      `${databaseKey}/api/v1/update_services/${id}`,
    statusById: (id: any) => `${databaseKey}/api/v1/updateServiceStatus/${id}`,
    getSacCode: (id: any) => `${databaseKey}/api/v1/getSacCode/${id}`,
    getHSNCode: (id: any, code_type: string) =>
      `${databaseKey}/api/v1/getHSNCode/${id}?code_type=${code_type}`,
    createServiceChartOfAccount: () =>
      `${databaseKey}/api/v1/createServiceChartOfAccount`,
  },

  servicecategoryMasterService: {
    servicecategoryMaster_create: () => `${databaseKey}/api/v1/createServies`,
    servicecategoryMaster_List: () =>
      `${databaseKey}/api/v1/serviesgetallcategroy`,
    activeServicecategoryMaster_List: () =>
      `${databaseKey}/api/v1/activeserviesgetallcategroy`,
    servicecategoryMasterGetById: (id: any) =>
      `${databaseKey}/api/v1/serviesgetallcategroy_id/${id}`,
    servicecategoryMasterDelete: (id: any) =>
      `${databaseKey}/api/v1/delete_servies/${id}`,
    servicecategoryMaster_update: (id: any) =>
      `${databaseKey}/api/v1/update_servies/${id}`,
    servicecategoryMaster_Status: (id: any) =>
      `${databaseKey}/api/v1/serviesStatus/${id}`,
  },

  areaMasterService: {
    areaMaster_create: () => `${databaseKey}/api/v1/createArea`,
    areaMaster_list: () => `${databaseKey}/api/v1/getAllArea`,
    areaMaster_getById: (id: any) => `${databaseKey}/api/v1/getByIdArea/${id}`,
    areaMaster_getDepByArea: (id: any) =>
      `${databaseKey}/api/v1/getDepartmentWithArea/${id}`,
    areaMaster_update: (a_id: any) =>
      `${databaseKey}/api/v1/updateAreaById/${a_id}`,
    areaStatus: (a_id: any) => `${databaseKey}/api/v1/areaStatus/${a_id}`,
    areaMaster_delete: (id: any) => `${databaseKey}/api/v1/deleteArea/${id}`,
  },

  additionalCharge: {
    additionalCharge_create: () => `${databaseKey}/api/v1/createAdditional`,
    additionalCharge_list: (entity_id: any, financial_id: any) =>
      `${databaseKey}/api/v1/getall_additional?entity_id=${entity_id}&financial_id=${financial_id}`,
    additionalCharge_getById: (id: any) =>
      `${databaseKey}/api/v1/getby_additional/${id}`,
    additionalCharge_update: (id: any) =>
      `${databaseKey}/api/v1/updated_additional/${id}`,
    additionalCharge_status: (id: any) =>
      `${databaseKey}/api/v1/statusUpdatedAdditional/${id}`,
    additionalCharge_delete: (id: any) =>
      `${databaseKey}/api/v1/delete_additional/${id}`,
  },

  expense_master: {
    getAlltripExpenseMaster: () =>
      `${databaseKey}/api/v1/getAlltripExpenseMaster`,
    create_expense_category: () => `${databaseKey}/api/v1/tripExpenseMaster`,
    getTripExpenseCategoryById: (id: any) =>
      `${databaseKey}/api/v1/get_tripExpenseMaster_By_id/${id}`,
    updateTripExpenseCategory: (id: any) =>
      `${databaseKey}/api/v1/update_tripExpenseMaster_By_id/${id}`,
    deleteTripExpenseCategory: (id: any) =>
      `${databaseKey}/api/v1/delete_tripExpenseMaster_By_id/${id}`,
    TripstatusUpdate: (id: any) =>
      `${databaseKey}/api/v1/status_update_tripExpenseMaster/${id}`,
  },

  bankMasterService: {
    create_Bank: () => `${databaseKey}/api/v1/create_Bank`,
    getAllBANK: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllBANK/${entity_id}`,
    getByBankID: (id: any, entity: any) =>
      `${databaseKey}/api/v1/getByBankID/${id}?entity_id=${entity}`,
    updateBankById: (id: any) => `${databaseKey}/api/v1/updateBankById/${id}`,
    BankStatus: (b_id: any) => `${databaseKey}/api/v1/BankStatus/${b_id}`,
    delete_Bank: (id: any) => `${databaseKey}/api/v1/delete_Bank/${id}`,
  },

  workStationMasterService: {
    workStationMaster_create: () => `${databaseKey}/api/v1/create_workStation`,
    workStationMaster_List: (e_id: any, f_id: any) =>
      `${databaseKey}/api/v1/getAllWorkstation/${e_id}/${f_id}`,
    activeWorkStationMaster_List: () =>
      `${databaseKey}/api/v1/getAllActiveWorkstation`,
    workStationMasterGetById: (id: any) =>
      `${databaseKey}/api/v1/getWorkstationById/${id}`,
    workStationMasterDelete: (id: any) =>
      `${databaseKey}/api/v1/delete_workStation/${id}`,
    workStationMasterStatusById: (id: any) =>
      `${databaseKey}/api/v1/workStationStatus/${id}`,
    workStationMaster_update: (id: any) =>
      `${databaseKey}/api/v1/update_workStation/${id}`,
  },
  productMasterService: {
    productMaster_create: () => `${databaseKey}/api/v1/create_product`,
    productMaster_List: () => `${databaseKey}/api/v1/getAllproduct`,
    hsnCodeList: (entityId: any, code_type: string = 'HSN') =>
      `${databaseKey}/api/v1/getProductHsn/${entityId}?code_type=${code_type}`,
    productMasterById: (id: any) => `${databaseKey}/api/v1/getAllproduct/${id}`,
    getSfgType: (id: any) =>
      `${databaseKey}/api/v1/getItemCategoryByItemType/${id}`,
    getAllSfgType: (id: any) => `${databaseKey}/api/v1/getSFGItem/${id}`,
    duplicateProductMaster_List: () =>
      `${databaseKey}/api/v1/getAllRepeatProduct`,
    productMasterGetById: (id: any) =>
      `${databaseKey}/api/v1/getProductDetailsByVariantId/${id}`,
    getProductMasterById: (id: any) =>
      `${databaseKey}/api/v1/getProductById/${id}`,
    productMasterDelete: (id: any) =>
      `${databaseKey}/api/v1/delete_product/${id}`,
    productMaster_update: (id: any) =>
      `${databaseKey}/api/v1/update_product/${id}`,
    statusById: (id: any) => `${databaseKey}/api/v1/productStatus/${id}`,
    productVariantById: (id: any) =>
      `${databaseKey}/api/v1/get_variants_by_product_id/${id}`,
    ActiveProductVariantById: (id: any) =>
      `${databaseKey}/api/v1/get_active_variants_by_product_id/${id}`,
  },

  workflowService: {
    createWorkflow: () => `${databaseKey}/api/v1/create_workflow_approval`,
    getAllworkflow: () => `${databaseKey}/api/v1/getAll/workflow`,
    getWorkflowById: (id: any) =>
      `${databaseKey}/api/v1/view_workflow_byId/${id}`,
    viewWorkflowById: (id: any) =>
      `${databaseKey}/api/v1/view_workflow_byId/${id}`,
    updateWorkflowById: (id: any) =>
      `${databaseKey}/api/v1/update_workflow/${id}`,
  },

  workflowServiceRfp: {
    createWorkflowRfp: () => `${databaseKey}/api/v1/create_RFP_work_Flow`,
    getAllworkflowRfp: () => `${databaseKey}/api/v1/get_All_RFP_workflow`,
    getWorkflowRfpById: (id: any) =>
      `${databaseKey}/api/v1/view_RFP_workflow_byId/${id}`,
    updateWorkflowRfpById: (id: any) =>
      `${databaseKey}/api/v1/update_RFP_workflow_byId/${id}`,
  },

  // entityMaster: {
  //   createEntityMaster: () => `${databaseKey}/api/v1/create_entity`,
  //   updateEntityMaster: (id:any) => `${databaseKey}/api/v1/update_entity/${id}`,
  //   getEntityById: (id: any) => `${databaseKey}/api/v1/getById_entity/${id}`,
  //   entityList: () =>  `${databaseKey}/api/v1/getAll_Entity`,
  //   deleteEntity: (id:any) =>  `${databaseKey}/api/v1/delete_entity/${id}`,
  //   updateEntityStatus: (id:any) =>  `${databaseKey}/api/v1/status_entity/${id}`
  // },

  qualityService: {
    createQuality: () => `${databaseKey}/api/v1/createQuality`,
    getAllQuality: (id: any, f_id: any) =>
      `${databaseKey}/api/v1/getAllQuality/${id}/${f_id}`,
    getQualityId: (id: any) => `${databaseKey}/api/v1/getQualityById/${id}`,
    updateQualityById: (id: any) =>
      `${databaseKey}/api/v1/updateQualityMaster/${id}`,
    updateQualityStatus: (id: any) =>
      `${databaseKey}/api/v1/updateQualityStatus/${id}`,
    deleteQuality: (id: any) =>
      `${databaseKey}/api/v1/deleteQualityMaster/${id}`,
  },

  vehicleRegistration: {
    createVehicleRegistration: () =>
      `${databaseKey}/api/v1/create_vehicle_registration`,
    getAllVehicleRegistration: () =>
      `${databaseKey}/api/v1/get_all_vehicle_registration`,
    getByIdVehicleRegistration: (id: any) =>
      `${databaseKey}/api/v1/get_vehicle_by_Id/${id}`,
    updateVehicleRegistrationById: (id: any) =>
      `${databaseKey}/api/v1/edit_vehicle_registration/${id}`,
    vehicleRegistrationDelete: (id: any) =>
      `${databaseKey}/api/v1/delete_vehicle_by_Id/${id}`,
    toogleVehicleStatus: (id: any) =>
      `${databaseKey}/api/v1/vehicle_registration_status/${id}`,
  },
  RegionMaster: {
    regionCreate: (entity_id: any) =>
      `${databaseKey}/api/v1/create_region?entity_id=${entity_id}`,
    regionList: (entity_id: any) =>
      `${databaseKey}/api/v1/getAll_Region?entity_id=${entity_id}`,
    regionListActive: (entity_id: any) =>
      `${databaseKey}/api/v1/getAll_Active_Region?entity_id=${entity_id}`,
    regionEdit: (region_id: any, entity_id: any) =>
      `${databaseKey}/api/v1/update_region/${region_id}?entity_id=${entity_id}`,
    regionStatus: (region_id: any) =>
      `${databaseKey}/api/v1/update_region/${region_id}`,
    getRegionById: (region_id: any) =>
      `${databaseKey}/api/v1/getById_Region/${region_id}`,
    deleteRegion: (region_id: any) =>
      `${databaseKey}/api/v1/delete_Region/${region_id}`,
  },
  BudgetCategory: {
    budgetCategoryCreate: (entity_id: any) =>
      `${databaseKey}/api/v1/create_budget_category?entity_id=${entity_id}`,
    budgetCategoryList: (entity_id: any) =>
      `${databaseKey}/api/v1/getall_budget_category?entity_id=${entity_id}`,
    budgetCategoryListActive: (entity_id: any) =>
      `${databaseKey}/api/v1/getall_active_budget_category?entity_id=${entity_id}`,
    getBudgetCategoryById: (id: any) =>
      `${databaseKey}/api/v1/getbyId_budget_category/${id}`,
    updateBudgetCategory: (id: any, entity_id: any) =>
      `${databaseKey}/api/v1/update_budget_category/${id}?entity_id=${entity_id}`,
    deleteBudgetCategory: (id: any) =>
      `${databaseKey}/api/v1/delete_budget_category/${id}`,
  },
  TypeOfExpense: {
    typeOfExpenseCreate: () => `${databaseKey}/api/v1/create_expenseType`,
    typeOfExpenseList: () => `${databaseKey}/api/v1/getAll_expenseType`,
    typeOfExpenseListActive: () =>
      `${databaseKey}/api/v1/getAll_active_expenseType`,
    getTypeOfExpenseById: (id: any) =>
      `${databaseKey}/api/v1/getById_expenseType/${id}`,
    updateTypeOfExpense: (id: any) =>
      `${databaseKey}/api/v1/update_expenseType/${id}`,
    deleteTypeOfExpense: (id: any) =>
      `${databaseKey}/api/v1/delete_expenseType/${id}`,
  },
  TypeOfNeed: {
    typeOfNeedCreate: () => `${databaseKey}/api/v1/create_need`,
    typeOfNeedList: () => `${databaseKey}/api/v1/getAll_need`,
    typeOfNeedListActive: () => `${databaseKey}/api/v1/getAll_active_need`,
    getTypeOfNeedById: (id: any) => `${databaseKey}/api/v1/getById_need/${id}`,
    updateTypeOfNeed: (id: any) => `${databaseKey}/api/v1/update_need/${id}`,
    deleteTypeOfNeed: (id: any) => `${databaseKey}/api/v1/delete_need/${id}`,
  },

  // item group

  itemGroupService: {
    createitemgroup: () => `${databaseKey}/api/v1/createItemgroup`,
    updateitemGroup: (id: any) =>
      `${databaseKey}/api/v1/updateItemGroupCategory/${id}`,
    deleteitemGroup: (id: any) =>
      `${databaseKey}/api/v1/deleteItemMasterGroup/${id}`,
    allitemgroup: () => `${databaseKey}/api/v1/getAllItemgroup`,
    getitemgroupId: (id: any) =>
      `${databaseKey}/api/v1/getAllItemgroup_byId/${id}`,
    updateitemgroupStatus: (id: any) =>
      `${databaseKey}/api/v1/ItemGroupCategoryStatus/${id}`,
  },

  // workflow for job

  wrokFlowJob: {
    createWorkFlowJob: () => `${databaseKey}/api/v1/create_workflow_approval`,
    getAllWorkFlowJob: (entity_id: any) =>
      `${databaseKey}/api/v1/get_All_workflow?entity_id=${entity_id}`,
    getByWorkFlowJob: (id: any) =>
      `${databaseKey}/api/v1/view_workflow_byId/${id}`,
    updateWorkFlowJob: (id: any) =>
      `${databaseKey}/api/v1/update_workflow_byId/${id}`,
    getTypeRequest: () => `${databaseKey}/api/v1/get_All_workflow_type`,
  },
  SealType: {
    sealTypeCreate: () => `${databaseKey}/api/v1/create_sealType`,
    sealTypeList: () => `${databaseKey}/api/v1/getAll_sealType`,
    sealTypeListActive: () => `${databaseKey}/api/v1/getAll_active_sealType`,
    getSealTypeById: (id: any) =>
      `${databaseKey}/api/v1/getById_sealType/${id}`,
    updateSealType: (id: any) => `${databaseKey}/api/v1/update_sealType/${id}`,
    deleteSealType: (id: any) => `${databaseKey}/api/v1/delete_sealType/${id}`,
  },
  productCategory: {
    getAllActiveCategory: (id: any) =>
      `${databaseKey}/api/v1/getAllActiveCategory/${id}`,
    getAllActiveSubCategory: (id: any) =>
      `${databaseKey}/api/v1/getAllActiveSubCategory/${id}`,
    getProductBycat_Id: (id: any) =>
      `${databaseKey}/api/v1/getProductBycat_Id/${id}`,
    getProductVariantByproduct_id: (id: any) =>
      `${databaseKey}/api/v1/getProductVariantByproduct_id/${id}`,
    createProductSubCategory: () => `${databaseKey}/api/v1/createSubCategory`,
    createConplain: () => `${databaseKey}/api/v1/createregistercomplain`,
    editProductSubCategory: (id: any) =>
      `${databaseKey}/api/v1/editSubCategory/${id}`,
    allProductSubCategory: () => `${databaseKey}/api/v1/getAllSubCategory`,
    getByIdSubCategory: (id: any) =>
      `${databaseKey}/api/v1/getByIdSubCategory/${id}`,
    deleteSubCategory: (id: any) =>
      `${databaseKey}/api/v1/deleteSubCategory/${id}`,
    updateSubCategoryStatus: (id: any) =>
      `${databaseKey}/api/v1/updateSubCategoryStatus/${id}`,
    uploadDocuments: () => `${databaseKey}/api/EL/documents`,
    uploadDocument: () => `${databaseKey}/api/EL/complaintDocs`,
    // -------------------
    list: (id: any) => `${databaseKey}/api/v1/getAllCategory/${id}`,
    create: () => `${databaseKey}/api/v1/createCategory`,
    fetch: (product_id: number) =>
      `${databaseKey}/api/v1/getByIdCategory/${product_id}`,
    delete: (product_id: number) =>
      `${databaseKey}/api/v1/deleteCategory/${product_id}`,
    productUpdate: (product_id: number) =>
      `${databaseKey}/api/v1/editCategory/${product_id}`,
    Update: (product_id: number) =>
      `${databaseKey}/api/v1/updateCategoryStatus/${product_id}`,
    getAllProdutsData: () => `${databaseKey}/api/v1/getAllProducts`,
  },
  plant: {
    getAllActivePlant: (id: any) =>
      `${databaseKey}/api/v1/getAllActivePlant/${id}`,
    getEmployeeByLocationId: (entity_id: any, location_id: any) =>
      `${databaseKey}/api/v1/employeeDetail/${entity_id}/${location_id}`,
  },
  componentType: {
    list: () => `${databaseKey}/api/v1/get_all_component_type`,
    listActive: () => `${databaseKey}/api/v1/get_all_component_type_active`,
    // activeList: () => `${databaseKey}/api/v1/getAllActiveDepartment`,
    create: () => `${databaseKey}/api/v1/createComponentSetup`,
    // countryGetById: (countryss_id: any) => `${databaseKey}/api/v1/getByIdcountry/${countryss_id}`,
    // by params
    updateCom: (com_id: any) =>
      `${databaseKey}/api/v1/edit_component_type/${com_id}`,
    byId: (com_id: any) =>
      `${databaseKey}/api/v1/get_component_type_by_id/${com_id}`,
    delete: (com_id: any) =>
      `${databaseKey}/api/v1/delete_component_type/${com_id}`,
    //by params
    status: (com_id: any) =>
      `${databaseKey}/api/v1/status_component_type/${com_id}`,
  },
  dynamicForm: {
    list: (id: any) => `${databaseKey}/api/v1/getFormSetup/${id}`,
    allList: () => `${databaseKey}/api/v1/getFormSetup_all`,
    // listActive: () => `${databaseKey}/api/v1/get_all_component_type_active`,
    // activeList: () => `${databaseKey}/api/v1/getAllActiveDepartment`,
    create: () => `${databaseKey}/api/v1/createfromSetup`,
    // countryGetById: (countryss_id: any) => `${databaseKey}/api/v1/getByIdcountry/${countryss_id}`,
    // by params
    update: () => `${databaseKey}/api/v1/updateFormSetup`,
    dropDownList: (field_name_id: any) =>
      `${databaseKey}/api/v1/formDynamicFieldValue?field_name_id=${field_name_id}`,
    getDynamicFormFields: (id: any) =>
      `${databaseKey}/api/v1/getDynamicFormDetails/${id}`,
    getStatus: (id: any) =>
      `${databaseKey}/api/v1/getStatusOfDynamicField/${id}`,
  },
  lead: {
    getAllSource: (entity_id: any, finance_year_id: any) =>
      `${databaseKey}/api/v1/getAllSource/${entity_id}/${finance_year_id}`,
  },
  issue: {
    createIssue: () => `${databaseKey}/api/v1/create_issueType`,
    getIssuetype: (entity_id: any, financial_year_id: any) =>
      `${databaseKey}/api/v1/getAll_IssueType?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
    changeIssue_Status: () => `${databaseKey}/api/v1/Issue_changeStatus`,
    getIssueby_Id: (id: any) => `${databaseKey}/api/v1/getIssueby_Id?id=${id}`,
    update_Issue: (id: any) => `${databaseKey}/api/v1/update_Issue?id=${id}`,
  },
  maintenance: {
    createmaintenance_check: () =>
      `${databaseKey}/api/v1/create_maintenance_master`,
    getAll_Maintenance_check: (entity_id: any, financial_year_id: any) =>
      `${databaseKey}/api/v1/getAll_Maintenance_check?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
  },
  servicecenterMaster: {
    servicecenterMaster_create: () =>
      `${databaseKey}/api/v1/createservicecenter`,
    servicecentersMaster_List: (entity_id: any) =>
      `${databaseKey}/api/v1/getallactiveservicecenters?entity_id=${entity_id}`,
    getOpenComplainList: () => `${databaseKey}/api/v1/registercomplainlist`,
    resolve_complainList: () => `${databaseKey}/api/v1/resolve_complainList`,
    // servicecentersMaster_List: () => `${databaseKey}/api/v1/getallservicecenters`,
    // getOpenComplainList: () => `${databaseKey}/api/v1/open_complainList`,
    getOpenComplainList2: (entity_id: any) =>
      `${databaseKey}/api/v1/open_complainList?entity_id=${entity_id}`,
    getAssignComplainList: (entity_id: any) =>
      `${databaseKey}/api/v1/assignedcomplainlist?entity_id=${entity_id}`,
    getActiveCetegory: () => `${databaseKey}/api/v1/active_assets_get`,
    getComplainStatusList: () => `${databaseKey}/api/v1/complainstatuslist`,
    getItem: (id: any) => `${databaseKey}/api/v1/getAllItemByAsset/${id}`,
    servicecenterMasterGetById: (id: any) =>
      `${databaseKey}/api/v1/getservicecenterbyid/${id}`,
    complainlistbyservicecenter: (service_center_id: any) =>
      `${databaseKey}/api/v1/complainlistbyservicecenter/${service_center_id}`,
    servicecenterMasterDelete: (id: any) =>
      `${databaseKey}/api/v1/deleteservicecenter/${id}`,
    servicecenterMaster_update: (id: any) =>
      `${databaseKey}/api/v1/updateservicecenter/${id}`,
    assignServiceCenter: () => `${databaseKey}/api/v1/assignservicecenter`,
    statusById: (id: any) => `${databaseKey}/api/v1/updateservicestatus/${id}`,
    getregistercomplainbyid: (id: any) =>
      `${databaseKey}/api/v1/getregistercomplainbyid/${id}`,
    open_updatecomplaindetail: (id: any) =>
      `${databaseKey}/api/v1/updateComplainDetail/${id}`,
  },
  crmServiceDashboard: {
    getTodaysLog: () => `${databaseKey}/api/v1/todayLogDashboard`,
    getDataCardData: () => `${databaseKey}/api/v1/complaintStatus`,
  },
  complaint: {
    create_complaint_type: () => `${databaseKey}/api/v1/create_complaint_type`,
    update_complaint_type: () => `${databaseKey}/api/v1/update_complaint_type`,
    get_complaint_type_byId: (id: any) =>
      `${databaseKey}/api/v1/get_complaint_type_byId?id=${id}`,
    getall_employeeby_dept_id: (id: any) =>
      `${databaseKey}/api/v1/getall_employeeby_dept_id/${id}`,
    get_all_complaint_type: (entity_id: any, financial_year_id: any) =>
      `${databaseKey}/api/v1/get_all_complaint_type?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
    get_all_complaint_typeActive: (entity_id: any, financial_year_id: any) =>
      `${databaseKey}/api/v1/get_all_complaint_type?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
    changeIssue_Status: () => `${databaseKey}/api/v1/Issue_changeStatus`,
  },
  subCategoryService: {
    createSubCategory: (entity_id: any, financial_year_id: any) =>
      `${databaseKey}/api/v1/createSubCategory?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
    updateSubCategory: (entity_id: any, financial_year_id: any, id: any) =>
      `${databaseKey}/api/v1/updateSubCategory/${id}?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
    allSubCategory: (entity_id: any, financial_year_id: any) =>
      `${databaseKey}/api/v1/getAllSubCategory?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
    getSubCategoryById: (entity_id: any, financial_year_id: any, id: any) =>
      `${databaseKey}/api/v1/getAllSubCategory_id/${id}?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
    removeSubCategory: (entity_id: any, financial_year_id: any, id: any) =>
      `${databaseKey}/api/v1/deleteSubCategory/${id}?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
    updateStatusSubCategory: (
      entity_id: any,
      financial_year_id: any,
      id: any,
    ) =>
      `${databaseKey}/api/v1/SubCategoryStatus/${id}?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
    fetchSubcateogry: (
      entity_id: any,
      financial_year_id: any,
      id: any,
      obj: any,
    ) =>
      `${databaseKey}/api/v1/getAllItemCategory/${id}?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
    getSubCategoryByCustomerCategory: (
      entity_id: any,
      financial_year_id: any,
      id: any,
    ) =>
      `${databaseKey}/api/v1/getAllSubCategory/${id}?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
  },
  CustomersubCategoryService: {
    createCustomerSubCategory: () =>
      `${databaseKey}/api/v1/createCustomersubCategory`,
    updateCustomerSubCategory: (id: any) =>
      `${databaseKey}/api/v1/editCustomersubCategory/${id}`,
    allCustomerSubCategory: (entity_id: any, financial_year_id: any) =>
      `${databaseKey}/api/v1/getAllCustomersubcategory?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
    getCustomerSubCategoryById: (id: any) =>
      `${databaseKey}/api/v1/getByIdCustomersubCategory/${id}`,
    removeCustomerSubCategory: (id: any) =>
      `${databaseKey}/api/v1/deleteCustomerSubCategory/${id}`,
    updateStatusCustomerSubCategory: (id: any) =>
      `${databaseKey}/api/v1/customerSubCategoryStatus/${id}`,
    fetchCustomerSubcategory: (id: any, obj: any) =>
      `${databaseKey}/api/v1/getAllSubCategory/${id}`,
  },
  CustomerMicroCategoryService: {
    createCustomerMicroCategory: () =>
      `${databaseKey}/api/v1/createCustomermicroCategory`,
    updateCustomerMicroCategory: (id: any) =>
      `${databaseKey}/api/v1/editCustomermicroCategory/${id}`,
    allCustomerMicroCategory: () =>
      `${databaseKey}/api/v1/getAllmicroCategory/`,
    getCustomerMicroCategoryById: (id: any) =>
      `${databaseKey}/api/v1/getByIdCustomermicroCategory/${id}`,
    removeCustomerMicroCategory: (id: any) =>
      `${databaseKey}/api/v1/deleteCustomermicroCategory/${id}`,
    deleteCostProfitTypeById: (id: any) =>
      `${databaseKey}/api/v1/deleteCostProfitTypeById?id=${id}`,
    updateStatusCustomerMicroCategory: (id: any) =>
      `${databaseKey}/api/v1/customermicroCategoryStatus/${id}`,
    fetchCustomerMicrocategory: (id: any, obj: any) =>
      `${databaseKey}/api/v1/getAllSubCategory/${id}`,
    getAllCustomerMicroCategory: () =>
      `${databaseKey}/api/v1/getAllCustomermicroCategory`,
    getMicroCategoryBySubCategory: (id: any) =>
      `${databaseKey}/api/v1/getAllmicroCategory/${id}`,
  },
  customerCategoryService: {
    createCustomerCategory: () =>
      `${databaseKey}/api/v1/createCustomerCategory`,
    updateCustomerCategory: (id: any) =>
      `${databaseKey}/api/v1/editCustomerCategory/${id}`,
    allCustomerCategory: () => `${databaseKey}/api/v1/getAllCustomerCategory`,
    getCustomerCategoryById: (id: any) =>
      `${databaseKey}/api/v1/getByIdCustomerCategory/${id}`,
    removeCustomerCategory: (id: any) =>
      `${databaseKey}/api/v1/deleteCustomerCategory/${id}`,
    updateCustomerCategoryStatus: (id: any) =>
      `${databaseKey}/api/v1/customerCategoryStatus/${id}`,
    fetchCustomerCategory: (id: any, obj: any) =>
      `${databaseKey}/api/v1/getAllItemCategory/${id}`,
  },
  schemeMaster: {
    createScheme: () => `${databaseKey}/api/v1/create_scheme`,
    getAllScheme: () => `${databaseKey}/api/v1/getAll_scheme`,
    getById: (id: any) => `${databaseKey}/api/v1/getById_scheme/${id}`,
    updateScheme: (id: any) => `${databaseKey}/api/v1/update_scheme/${id}`,
    statusSchemeUpdate: (id: any) =>
      `${databaseKey}/api/v1/update_scheme_status/${id}`,
    deleteScheme: (id: any) => `${databaseKey}/api/v1/delete_scheme/${id}`,
  },
  priceMaster: {
    create: () => `${databaseKey}/api/v1/createPrice`,
    getListing: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllPrice?entity_id=${entity_id}`,
    getById: (id: any) => `${databaseKey}/api/v1/getByIdPrice/${id}`,
    updateStatus: (id: any) => `${databaseKey}/api/v1/priceStatus/${id}`,
    update: (id: any) => `${databaseKey}/api/v1/updatePriceById/${id}`,
    delete: (id: any) => `${databaseKey}/api/v1/deletePrice/${id}`,
    customerlistBycustomertype: (id: any) =>
      `${databaseKey}/api/v1/customerlistBycustomertype/${id}`,
  },
  voucherMaster: {
    getAllVoucher: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllVoucher?entity_id=${entity_id}`,
    generateSeries: (input: any) =>
      `${databaseKey}/api/v1/generateServies?input=${input}`,
    createVoucherData: () => `${databaseKey}/api/v1/createVoucherData`,
    getVoucherById: (id: any) => `${databaseKey}/api/v1/getVoucherById/${id}`,
    deleteVoucherById: (id: any) =>
      `${databaseKey}/api/v1/deleteVoucherById/${id}`,
    updateVoucherByID: (id: any) =>
      `${databaseKey}/api/v1/updateVoucherData/${id}`,
  },
  paymentAdviceVoucher: {
    getAllPaymentAdviceVoucher: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllpaymentVoucher?entity_id=${entity_id}`,
    generateSeriesPaymentAdvice: (input: any) =>
      `${databaseKey}/api/v1/generateServiesPaymentAdvice?input=${input}`,

    createPaymentVoucherData: () =>
      `${databaseKey}/api/v1/createPaymentAdviceData`,

    deletePaymentAdviceData: (id: any) =>
      `${databaseKey}/api/v1/deletePaymentAdviceData/${id}`,
    getPaymentVoucherData: (id: any) =>
      `${databaseKey}/api/v1/getPaymentAdviceVoucher/${id}`,
    updatePaymentVoucherData: (id: any) =>
      `${databaseKey}/api/v1/updatePaymentVoucherData/${id}`,
  },
  bankRecieptVoucher: {
    getAllBankRecieptVoucher: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllBankRecieptData?entity_id=${entity_id}`,
    getBankRecieptVoucherData: (id: any) =>
      `${databaseKey}/api/v1/getBankRecieptVoucher/${id}`,
    deleteBankRecieptVoucherById: (id: any) =>
      `${databaseKey}/api/v1/deletebankRecieptData/${id}`,
    downloadBankRecieptById: (id: any) =>
      `${databaseKey}/api/v1/downloadBankRecieptById/${id}`,
    updateBankRecieptVoucherData: (id: any) =>
      `${databaseKey}/api/v1/updateBankRecieptVoucherData/${id}`,
    createBankRecieptVoucherData: () =>
      `${databaseKey}/api/v1/createBankRecieptData`,
    generateSeriesBankRecieptVoucher: (input: any) =>
      `${databaseKey}/api/v1/generateServiesBankRecieptVoucher?input=${input}`,
  },

  bankPaymentVoucher: {
    getAllBankPaymentVoucher: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllBankPaymentVoucherData?entity_id=${entity_id}`,
    getBankPaymentVoucherDataById: (id: any) =>
      `${databaseKey}/api/v1/getBankPaymentVoucher/${id}`,
    deleteBankPaymentVoucherById: (id: any) =>
      `${databaseKey}/api/v1/deletebankPaymentData/${id}`,
    updateBankPaymentVoucherData: (id: any) =>
      `${databaseKey}/api/v1/updateBankPaymentVoucherData/${id}`,
    downloadBankPaymentById: (id: any) =>
      `${databaseKey}/api/v1/downloadBankPaymentById/${id}`, 
    downloadCashPaymentById: (id: any) =>
      `${databaseKey}/api/v1/downloadCashPaymentById/${id}`, 
    downloadPaymentAdviceById: (id: any) =>
      `${databaseKey}/api/v1/downloadPaymentAdviceById/${id}`,
    createBankPaymentVoucherData: () =>
      `${databaseKey}/api/v1/createBankPaymentVoucherData`,
    generateSeriesBankPaymentVoucher: (input: any) =>
      `${databaseKey}/api/v1/generateBankPaymentVoucher?input=${input}`,
  },
  // generateSeriesPaymentAdvice:(input:any)=>`${databaseKey}/api/v1/generateServiesPaymentAdvice?input=${input}`,
  // createPaymentVoucherData:()=>`${databaseKey}/api/v1/createPaymentAdviceData`,
  // deletePaymentAdviceData:(id:any)=>`${databaseKey}/api/v1/deletePaymentAdviceData/${id}`,
  // getPaymentVoucherData:(id:any)=>`${databaseKey}/api/v1/getPaymentAdviceVoucher/${id}`,
  // updatePaymentVoucherData:(id:any)=>`${databaseKey}/api/v1/updatePaymentVoucherData/${id}`,

  customerApproval: {
    saveCustomerApproval: () =>
      `${databaseKey}/api/v1/create_customer_approval`,
    getAllCustomerApproval: () =>
      `${databaseKey}/api/v1/get_all_customer_approvals`,
    get_customer_approvalById: (id: string) =>
      `${databaseKey}/api/v1/get_customer_approvalById/${id}`,
    updateCustomerApprovalById: (id: string) =>
      `${databaseKey}/api/v1/update_customer_approval/${id}`,
    deleteCustomerApprovalById: (id: string) =>
      `${databaseKey}/api/v1/delete_customer_approval/${id}`,
    employList: (approval_option: any) =>
      `${databaseKey}/api/v1/all_employee_list?approval_option=${approval_option}`,
  },

  empLevelMapping: {
    createLevelEmployee: () => `${databaseKey}/api/v1/create_levelmap_employee`,
    getAllEmpMappingLevel: () =>
      `${databaseKey}/api/v1/get_all_levelmap_employee`,
    get_EmpMappingLevelById: (id: string) =>
      `${databaseKey}/api/v1/get_levelmap_employeeById/${id}`,
    updateLevelEmployee: (id: string) =>
      `${databaseKey}/api/v1/update_levelmap_employee/${id}`,
    deleteEmpMapLevelById: (id: string) =>
      `${databaseKey}/api/v1/delete_levelmap_employee/${id}`,
    getEmployeeListForMapLevel: () =>
      `${databaseKey}/api/v1/all_employeeMap_list`,
  },

  quotationApproval: {
    saveQuotationApproval: () => `${databaseKey}/api/v1/saveQuotationApproval`,
    updateQuotationApprovalById: (id: string) =>
      `${databaseKey}/api/v1/update_quotationApprovalById/${id}`,
    getAllQuotationApproval: () =>
      `${databaseKey}/api/v1/get_all_quotatioApproval`,
    get_quotationApprovalById: (id: string) =>
      `${databaseKey}/api/v1/get_quotationApprovalById/${id}`,
    getAllSub_Category: () =>
      `${databaseKey}/api/v1/getAllSubCategory_forquotatioApproval`,
    deleteQuotationApprovalById: (id: string) =>
      `${databaseKey}/api/v1/delete_quotatioApproval/${id}`,
  },

  creditLimit: {
    createCreditLimit: () => `${databaseKey}/api/v1/createCreditLimit`,
    updateCreditLimit: () => `${databaseKey}/api/v1/update_credit_limit`,
    getAllCreditLimits: () => `${databaseKey}/api/v1/get_all_credit_limits`,
  },

  sanctionCreditLimit: {
    createSanctionCreditLimit: () =>
      `${databaseKey}/api/v1/createSanction_CreditLimit`,
    updateSanctionCreditLimit: () =>
      `${databaseKey}/api/v1/updateSanction_CreditLimit`,
    getAllSanctionCreditLimits: () =>
      `${databaseKey}/api/v1/getAllSanction_CreditLimits`,
  },

  proposalType: {
    getProposalType: () => `${databaseKey}/api/v1/getperposal_type`,
    createProposalType: () => `${databaseKey}/api/v1/create_perposal_type`,
    getProposalTypeById: (id: string) =>
      `${databaseKey}/api/v1/perposal_typeById/${id}`,
    updateProposalTypeById: (id: string) =>
      `${databaseKey}/api/v1/update_perposal_type/${id}`,
    deleteProposalTypeById: (id: string) =>
      `${databaseKey}/api/v1/delete_perposal_type/${id}`,
    getActiveProposalType: () => `${databaseKey}/api/v1/getperposal_typeActive`,
  },
  tdsMaster: {
    createTDSData: () => `${databaseKey}/api/v1/createTDS`,
    getAllTdsData: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllTDS?entity_id=${entity_id}`,
    getTdsDataById: (id: any) => `${databaseKey}/api/v1/getAllTDSById?id=${id}`,
    updateTdsData: () => `${databaseKey}/api/v1/updateTdsById`,
    getTdsDataByIdVendor: (id: any) =>
      `${databaseKey}/api/v1/getTDSById?id=${id}`,
    deleteTDSById: (id: any) => `${databaseKey}/api/v1/deleteTDSById?id=${id}`,
  },
  travelType: {
    createTravelType: () => `${databaseKey}/api/v1/addTravelType`,
    getAllTravelType: (type: string) =>
      `${databaseKey}/api/v1/getAllTravelType?type=${type}`,
    getTravelTypeById: (id: any) =>
      `${databaseKey}/api/v1/getTravelTypeById/${id}`,
    updateTravelTypeById: (id: any) =>
      `${databaseKey}/api/v1/update_travel_type/${id}`,
    deleteTravelType: (id: any) =>
      `${databaseKey}/api/v1/deleteTravelType/${id}`,
    addTravelBudget: () => `${databaseKey}/api/v1/addTravelBudget`,
    addReimbursementBudget: () =>
      `${databaseKey}/api/v1/addReimbursementBudget`,
    getAllTravelBudget: () => `${databaseKey}/api/v1/getAllTravelBudget`,
    getAllReimbursementBudget: () =>
      `${databaseKey}/api/v1/getAllReimbursementBudget`,
    getTravelBudgetById: (id: any) =>
      `${databaseKey}/api/v1/getTravelBudgetById/${id}`,
    deleteTravelBudget: (id: any) =>
      `${databaseKey}/api/v1/deleteTravelBudget/${id}`,
  },
  mainVoucherList: {
    getAllVoucherData: () => `${databaseKey}/api/v1/getAllVoucherMainData`,
    createVoucherList: () => `${databaseKey}/api/v1/createVoucherMainList`,
    getAllVoucherListData: (entity_id: any) =>
      `${databaseKey}/api/v1/voucherMainList?entity_id=${entity_id}`,
    getAllVoucherById: (id: any) =>
      `${databaseKey}/api/v1/voucherMainListById?id=${id}`,
    updateVoucherTypeData: () => `${databaseKey}/api/v1/updateVoucherMainById`,
    getVouchersByID: (id: any, entity_id: any) =>
      `${databaseKey}/api/v1/getBankVoucherById?id=${id}&entity_id=${entity_id}`,
  },

  accessoryMaster: {
    createAccessory: () => `${databaseKey}/api/v1/create_accessories_master`,
    getAllAccessory: (financial_year_id: any, entity_id: any) =>
      `${databaseKey}/api/v1/getAll_accessories_master?financial_year_id=${financial_year_id}&entity_id=${entity_id}`,
    getByAccessory: (id: any) =>
      `${databaseKey}/api/v1/getById_accessories_master/${id}`,
    deleteAccessory: (id: any) =>
      `${databaseKey}/api/v1/delete_accessories_master/${id}`,
    getActiveAccessory: (financial_year_id: any, entity_id: any) =>
      `${databaseKey}/api/v1/getAll_active_accessories?financial_year_id=${financial_year_id}&entity_id=${entity_id}`,
    updateAccessoryMaster: () =>
      `${databaseKey}/api/v1/update_accessories_master`,
  },

  brandingMaster: {
    createBrandingMaster: () => `${databaseKey}/api/v1/create_branding_master`,
    updateBrandingMaster: (id: any) =>
      `${databaseKey}/api/v1/update_branding_master/${id}`,
    getAllbranding: () => `${databaseKey}/api/v1/getAll_branding_master`,
    getBrandingWithCustomerItem: (client_id: any, data: any) =>
      `${databaseKey}/api/v1/getBrandingWithCustomerItem?item_id=${data.product_master_id}&customer_id=${client_id}`,
    getById_brandingMaster: (id: any) =>
      `${databaseKey}/api/v1/getById_branding_master/${id}`,

    deleteBranding: (id: any) =>
      `${databaseKey}/api/v1/delete_branding_master/${id}`,
  },

  zoneTypeMaster: {
    createZoneType: () => `${databaseKey}/api/v1/createZoneType`,
    getZoneTypeList: () => `${databaseKey}/api/v1/getAllZoneTypes`,
    getZoneTypeById: (id: any) => `${databaseKey}/api/v1/getZoneTypeById/${id}`,
    updateZoneType: (id: any) => `${databaseKey}/api/v1/updateZoneType/${id}`,
    deletezoneTypeById: (id: any) =>
      `${databaseKey}/api/v1/deleteZoneType/${id}`,
  },

  basketMaster: {
    createBasket: () => `${databaseKey}/api/v1/create_basket`,
    updateBasketMaster: (id: any) =>
      `${databaseKey}/api/v1/update_basket_ById/${id}`,
    getAllBasket: (entity_id: any) =>
      `${databaseKey}/api/v1/getall_basket/${entity_id}`,
    getById_basketMaster: (id: any) =>
      `${databaseKey}/api/v1/get_basket_ById/${id}`,

    deleteBasket: (id: any) => `${databaseKey}/api/v1/delete_basket_ById/${id}`,
  },
  financialTransactionIntegration: {
    getSubModulesData: (module_id: any) =>
      `${databaseKey}/api/v1/getSubModulesData?module_id=${module_id}`,
    item_cost_category: () => `${databaseKey}/api/v1/item_cost_category`,
    getAllItemcostCategory: () =>
      `${databaseKey}/api/v1/getAllItemcostCategory`,
    getfinancialTransactionsById: (module_id: any, module_master_id: any) =>
      `${databaseKey}/api/v1/getfinancialTransactionsById?module_id=${module_id}&module_master_id=${module_master_id}`,
    getFinacialTransactionIntegrationList: () =>
      `${databaseKey}/api/v1/getFinacialTransactionIntegrationList`,
  },
  getBillingShippingAddress: {
    getVendorBillingList: (entity_id: any) =>
      `${databaseKey}/api/v1/getVendorBillingList?entity_id=${entity_id}`,
  },
};
@Injectable({
  providedIn: 'root',
})
export class ConfigurationalmasterService {
  Allowance_updateById(
    id: any,
    data: {
      allowance_name: any;
      Domestic_Allowance: any;
      International_Allowance: any;
    },
    entity_id: any,
  ) {
    throw new Error('Method not implemented.');
  }
  messageSubject = new Subject<any>();
  private scrollSubject = new Subject<void>();

  accredionId(id: any) {
    this.messageSubject.next(id);
  }

  scrollToTop(): void {
    this.scrollSubject.next();
  }

  getScrollObservable() {
    return this.scrollSubject.asObservable();
  }

  showError(error: any) {
    throw new Error('Method not implemented.');
  }
  showSuccess(message: any) {
    throw new Error('Method not implemented.');
  }

  /** country master start  */
  constructor(private http: HttpClient) { }
  //
  createCertPrice(data: any): Observable<any> {
    return this.http.post(routes.priceTable.createCertPrice(), data);
  }
  getProductByid(id: any): Observable<any> {
    return this.http.get(routes.priceTable.getProductByid(id));
  }
  update_product_master(id: any, data: any): Observable<any> {
    return this.http.put(routes.priceTable.update_product_master(id), data);
  }
  editCertPrice(id: any, data: any): Observable<any> {
    return this.http.put(routes.priceTable.editCertPrice(id), data);
  }
  deletePrice(id: any): Observable<any> {
    return this.http.put(routes.priceTable.deletePrice(id), '');
  }

  //
  getProducts(id: any): Observable<any> {
    if (id === 1) {
      return this.http.get(routes.priceTable.getProductscert());
    } else {
      return this.http.get(routes.priceTable.getProductsnoncer());
    }
  }
  getProducts_withouprice(id: any): Observable<any> {
    return this.http.get(routes.priceTable.getProducts_withouprice(id));
  }
  createNonCertPrice(data: any): Observable<any> {
    return this.http.post(routes.priceTable.createNonCertPrice(), data);
  }

  MSA_Cert(): Observable<any> {
    return this.http.get(routes.priceTable.MSA_Cert());
  }

  MSA_Non_Cert(): Observable<any> {
    return this.http.get(routes.priceTable.MSA_Non_Cert());
  }
  getById_priceMaping(id: any): Observable<any> {
    return this.http.get(routes.priceTable.getById_priceMaping(id));
  }

  // item group

  createitemgroup(data: any) {
    return this.http.post(routes.itemGroupService.createitemgroup(), data);
  }

  updateitemGroup(id: any, data: any) {
    return this.http.put(routes.itemGroupService.updateitemGroup(id), data);
  }

  deleteitemGroup(id: any) {
    return this.http.delete(routes.itemGroupService.deleteitemGroup(id));
  }

  allitemgroup() {
    return this.http.get(routes.itemGroupService.allitemgroup());
  }

  getitemgroupId(id: any) {
    return this.http.get(routes.itemGroupService.getitemgroupId(id));
  }

  updateitemgroupStatus(id: any, body: any) {
    return this.http.put(
      routes.itemGroupService.updateitemgroupStatus(id),
      body,
    );
  }

  //
  createCountry(data: any): Observable<any> {
    return this.http.post(routes.Country.countryCreate(), data);
  }
  countryCreateBYNameId(data: any): Observable<any> {
    return this.http.post(routes.Country.countryCreateByID(), data);
  }
  getCountry(): Observable<any> {
    return this.http.get(routes.Country.countryGet());
  }
  getAllActivecountry(): Observable<any> {
    return this.http.get(routes.Country.getAllActivecountry());
  }
  getSignatureById(signature_id: any): Observable<any> {
    return this.http.get(routes.Country.signatureById(signature_id));
  }
  getAllSegment(): Observable<any> {
    return this.http.get(routes.Segment.segmentGet());
  }
  getCertificateByID(segment_id: any): Observable<any> {
    return this.http.get(routes.Segment.getCertificateByID(segment_id));
  }
  getProductMaSterById(certificateId: any): Observable<any> {
    return this.http.get(routes.Product.ProductGetbyIdSPA(certificateId));
  }
  getProductById(certificateId: any): Observable<any> {
    return this.http.get(
      routes.productMasterService.getProductMasterById(certificateId),
    );
  }
  getPriceListByID(product_master_id: any): Observable<any> {
    return this.http.get(
      routes.PriceLevelSlap.getPriceLevelById(product_master_id),
    );
  }
  getByIdCountry(countryss_id: any): Observable<any> {
    return this.http.get(routes.Country.countryGetById(countryss_id));
  }
  updateSingleCountry(countryss_id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.Country.countryUpdate(countryss_id), data);
  }
  updateCountryStatus(countryss_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.Country.updateCountryStatus(countryss_id),
      data,
    );
  }
  /** country master end  **/
  /** state master start  */
  createState(data: any): Observable<any> {
    return this.http.post(routes.State.stateCreate(), data);
  }
  getState(): Observable<any> {
    return this.http.get(routes.State.stateGet());
  }
  getAll_Country_codes(): Observable<any> {
    return this.http.get(routes.State.getAll_Country_codes());
  }
  getByIdState(states_id: any): Observable<any> {
    return this.http.get(routes.State.stateGetById(states_id));
  }
  updateSingleState(states_id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.State.stateUpdate(states_id), data);
  }
  updateStateStatus(states_id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.State.stateUpdateStatus(states_id), data);
  }
  /** state master end  */
  /** city master start  */
  createCity(data: any): Observable<any> {
    return this.http.post(routes.City.cityCreate(), data);
  }
  getCity(): Observable<any> {
    return this.http.get(routes.City.cityGet());
  }
  getByIdCity(city_id: any): Observable<any> {
    return this.http.get(routes.City.cityGetById(city_id));
  }
  updateSingleCity(city_id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.City.cityUpdate(city_id), data);
  }
  deleteSingleCity(city_id: any): Observable<any> {
    return this.http.delete<any>(routes.City.cityDelete(city_id));
  }
  /** city master end  */
  //Job-Type
  createJob(data: any): Observable<any> {
    return this.http.post(routes.JobType.jobTypeCreate(), data);
  }
  listJob(): Observable<any> {
    return this.http.get(routes.JobType.JobList());
  }
  editJob(job_Id: any, data: any): Observable<any> {
    return this.http.put(routes.JobType.editJob(job_Id), data);
  }
  getByIdJobType(job_Id: any): Observable<any> {
    return this.http.get(routes.JobType.getById(job_Id));
  }

  // sub-type
  subTypeCreate(data: any): Observable<any> {
    return this.http.post(routes.SubType.createSubType(), data);
  }
  subTypeList(): Observable<any> {
    return this.http.get(routes.SubType.listSubType());
  }
  subTypeEdit(sub_type_id: any, data: any): Observable<any> {
    return this.http.put(routes.SubType.editSubType(sub_type_id), data);
  }
  getByIdSubtype(sub_type_id: any): Observable<any> {
    return this.http.get(routes.SubType.getById(sub_type_id));
  }

  //Brand
  createBrand(data: any): Observable<any> {
    return this.http.post(routes.Brand.brandCreate(), data);
  }
  listBrand(): Observable<any> {
    return this.http.get(routes.Brand.brandList());
  }
  editBrand(brand_id: any, data: any): Observable<any> {
    return this.http.put(routes.Brand.brandEdit(brand_id), data);
  }
  getByIdBrand(brand_id: any): Observable<any> {
    return this.http.get(routes.Brand.getById(brand_id));
  }

  // Target
  createTarget(data: any): Observable<any> {
    return this.http.post(routes.TargetMaster.targetCreate(), data);
  }
  listTarget(): Observable<any> {
    return this.http.get(routes.TargetMaster.targetList());
  }
  editTarget(target_id: any, data: any): Observable<any> {
    return this.http.put(routes.TargetMaster.targetEdit(target_id), data);
  }
  getByIdTarget(target_id: any): Observable<any> {
    return this.http.get(routes.TargetMaster.getById(target_id));
  }

  // Unit Master
  createUnit(data: any): Observable<any> {
    return this.http.post(routes.UnitMaster.unitCreate(), data);
  }
  listUnit(): Observable<any> {
    return this.http.get(routes.UnitMaster.unitList());
  }
  editUnit(unit_id: any, data: any): Observable<any> {
    return this.http.put(routes.UnitMaster.unitEdit(unit_id), data);
  }
  getByIdUnit(unit_id: any): Observable<any> {
    return this.http.get(routes.UnitMaster.getByID(unit_id));
  }

  // uses master
  getAllUsesData() {
    return this.http.get(routes.usesMaster.getAllUses());
  }
  getAllActiveUsageData() {
    return this.http.get(routes.usesMaster.getAllActiveUsageData());
  }
  deleteUses(id: any) {
    return this.http.delete(routes.usesMaster.deleteUses(id));
  }

  updateUsesByid(id: any, data: any) {
    return this.http.put(routes.usesMaster.updateUsesByid(id), data);
  }

  createUses(data: any) {
    return this.http.post(routes.usesMaster.createUses(), data);
  }

  getUsestByIdDD(id: any) {
    return this.http.get(routes.usesMaster.getUsestByIdDD(id));
  }

  updateUsesStatus(id: any, data: any): Observable<any> {
    return this.http.put(routes.usesMaster.updateUsesStatus(id), data);
  }

  // Currency
  CurrencyCreate(data: any): Observable<any> {
    return this.http.post(routes.Currency.currencyCreate(), data);
  }
  CurrencyList(): Observable<any> {
    return this.http.get(routes.Currency.listCurrency());
  }
  CurrencyUpdate(id: any, data: any): Observable<any> {
    return this.http.put(routes.Currency.editCurrency(id), data);
  }
  CurrencyById(Currency_Convert_id: any): Observable<any> {
    return this.http.get(routes.Currency.getByIdCurrency(Currency_Convert_id));
  }
  //category
  createCategory(data: any): Observable<any> {
    return this.http.post(routes.Category.categoryCreate(), data);
  }
  listCategory(): Observable<any> {
    return this.http.get(routes.Category.categoryList());
  }
  editCategory(new_category_master_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.Category.categoryEdit(new_category_master_id),
      data,
    );
  }
  getByIdCategory(new_category_master_id: any): Observable<any> {
    return this.http.get(routes.Category.getById(new_category_master_id));
  }

  // certificate Status type

  createCerti(data: any): Observable<any> {
    return this.http.post(routes.Certificatetype.createCertificate(), data);
  }

  listCerti(): Observable<any> {
    return this.http.get(routes.Certificatetype.getCertificate());
  }
  getCertificateType(): Observable<any> {
    return this.http.get(routes.Certificatetype.getAllCertificate());
  }
  getByIdCerti(certificate_Status_id: any): Observable<any> {
    return this.http.get(routes.Certificatetype.getById(certificate_Status_id));
  }
  editCerti(certificate_Status_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.Certificatetype.certificateEdit(certificate_Status_id),
      data,
    );
  }

  //Standard Program Assesment
  createAsses(data: any): Observable<any> {
    return this.http.post(routes.StandardProgAsses.assesCreate(), data);
  }
  listAsses(): Observable<any> {
    return this.http.get(routes.StandardProgAsses.assesList());
  }
  productList(): Observable<any> {
    return this.http.get(routes.StandardProgAsses.productList());
  }
  allProductList(): Observable<any> {
    return this.http.get(routes.StandardProgAsses.allProductList());
  }

  allProductActiveList(): Observable<any> {
    return this.http.get(routes.StandardProgAsses.getAllActiveProd());
  }

  //
  getAuditorName(data: any): Observable<any> {
    return this.http.post(routes.StandardProgAsses.getAuditorName(), data);
  }

  //
  editAsses(new_spa_id: any, data: any): Observable<any> {
    return this.http.put(routes.StandardProgAsses.assesEdit(new_spa_id), data);
  }
  getByIdAsses(new_spa_id: any): Observable<any> {
    return this.http.get(routes.StandardProgAsses.getById(new_spa_id));
  }

  certById(certificate_type_id: any): Observable<any> {
    return this.http.get(
      routes.StandardProgAsses.getByCertId(certificate_type_id),
    );
  }

  SegmentIdgetBy(segment_id: any): Observable<any> {
    return this.http.get(routes.StandardProgAsses.getBySegmentId(segment_id));
  }
  listBranch(): Observable<any> {
    return this.http.get(routes.Branch.branchList());
  }
  getAllEmployeeByBranchId(branch_id: number): Observable<any> {
    return this.http.get(routes.Branch.getAllEmployeeByBranchId(branch_id));
  }
  editBranch(branch_id: any, data: any): Observable<any> {
    return this.http.put(routes.Branch.branchEdit(branch_id), data);
  }
  getByIdBranch(branch_id: any): Observable<any> {
    return this.http.get(routes.Branch.getById(branch_id));
  }
  // expense category

  ExpenseCreate(data: any): Observable<any> {
    return this.http.post(routes.ExpenseCategory.expenseCreate(), data);
  }
  agGridExpense(): Observable<any> {
    return this.http.get(routes.ExpenseCategory.listExpense());
  }

  updateExpense(expenseforCopy_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.ExpenseCategory.editExpense(expenseforCopy_id),
      data,
    );
  }
  updateExpenseStatus(expenseforCopy_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.ExpenseCategory.ExpenseStatusUpdate(expenseforCopy_id),
      data,
    );
  }
  getByIdExpense(expenseforCopy_id: any): Observable<any> {
    return this.http.get(
      routes.ExpenseCategory.getByIdExpense(expenseforCopy_id),
    );
  }
  deleteExpense(expenseforCopy_id: any): Observable<any> {
    return this.http.delete(
      routes.ExpenseCategory.ExpenseDelete(expenseforCopy_id),
    );
  }
  //// CustomerType Master//////
  getAllCustomer() {
    return this.http.get(routes.customerType.getAllCustomer());
  }
  getAllActiveCustomer() {
    return this.http.get(routes.customerType.getAllActiveCustomer());
  }
  deleteCustomer(id: any) {
    return this.http.delete(routes.customerType.deleteCustomer(id));
  }
  updateCustomerTypeStatus(id: any, data: any) {
    return this.http.put(
      routes.customerType.updateCustomerTypeStatus(id),
      data,
    );
  }
  customerType(data: any) {
    return this.http.post(routes.customerType.createCustomer(), data);
  }

  getPriceType(type: any, entity_id: any) {
    return this.http.get(routes.customerType.masterPriceList(type, entity_id));
  }

  getCustomertByIdDD(id: any) {
    return this.http.get(routes.customerType.getCustomertByIdDD(id));
  }
  updateCustomerByid(id: any, data: any) {
    return this.http.put(routes.customerType.updateCustomerByid(id), data);
  }
  // Duration

  createDuration(data: any): Observable<any> {
    return this.http.post(routes.DurationMaster.durationCreate(), data);
  }

  listDuration(): Observable<any> {
    return this.http.get(routes.DurationMaster.durationList());
  }

  updateDuration(duration_type_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.DurationMaster.durationEdit(duration_type_id),
      data,
    );
  }

  durationById(duration_type_id: any): Observable<any> {
    return this.http.get(
      routes.DurationMaster.getByIdDuration(duration_type_id),
    );
  }

  //Sector-Master
  createSector(data: any): Observable<any> {
    return this.http.post(routes.SectorMaster.sectorCreate(), data);
  }
  listSector(): Observable<any> {
    return this.http.get(routes.SectorMaster.sectorList());
  }
  editsector(sector_id: any, data: any): Observable<any> {
    return this.http.put(routes.SectorMaster.sectorEdit(sector_id), data);
  }
  getByIdSector(sector_id: any): Observable<any> {
    return this.http.get(routes.SectorMaster.getById(sector_id));
  }

  //Grade
  creategrade(data: any): Observable<any> {
    return this.http.post(routes.Grade.gradeCreate(), data);
  }
  listGrade(): Observable<any> {
    return this.http.get(routes.Grade.gradeList());
  }
  editGrade(id: any, data: any): Observable<any> {
    return this.http.put(routes.Grade.gradeEdit(id), data);
  }
  updateGradeStatus(id: any, data: any): Observable<any> {
    return this.http.put(routes.Grade.updateStatusgrade(id), data);
  }
  getByIdGrade(id: any): Observable<any> {
    return this.http.get(routes.Grade.getById(id));
  }
  GradeDelete(id: any): Observable<any> {
    return this.http.delete(routes.Grade.deleteGrade(id));
  }

  //Bank-Master
  createBank(data: any): Observable<any> {
    return this.http.post(routes.Bank.bankCreate(), data);
  }
  listBank(): Observable<any> {
    return this.http.get(routes.Bank.bankList());
  }
  editBank(bank_id: any, data: any): Observable<any> {
    return this.http.put(routes.Bank.bankEdit(bank_id), data);
  }
  getByIdBank(bank_id: any): Observable<any> {
    return this.http.get(routes.Bank.getById(bank_id));
  }

  //Contact-Source
  createContact(data: any): Observable<any> {
    return this.http.post(routes.ContactSource.contactCreat(), data);
  }
  listContact(): Observable<any> {
    return this.http.get(routes.ContactSource.contactList());
  }
  editContact(contact_source_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.ContactSource.contactEdit(contact_source_id),
      data,
    );
  }
  getByIdContact(contact_source_id: any): Observable<any> {
    return this.http.get(routes.ContactSource.getById(contact_source_id));
  }

  //Customer-Category
  createCustomer(data: any): Observable<any> {
    return this.http.post(routes.CustomerCategory.customerCreate(), data);
  }
  listCustomer(): Observable<any> {
    return this.http.get(routes.CustomerCategory.customerList());
  }
  editCustomer(customer_category_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.CustomerCategory.customerEdit(customer_category_id),
      data,
    );
  }
  getByIdCust(customer_category_id: any): Observable<any> {
    return this.http.get(routes.CustomerCategory.getById(customer_category_id));
  }

  //Leave-Type
  createLeave(data: any): Observable<any> {
    return this.http.post(routes.LeaveType.leaveTypeCreate(), data);
  }
  listLeave(): Observable<any> {
    return this.http.get(routes.LeaveType.leaveTypeList());
  }
  editLeave(leave_id: any, data: any): Observable<any> {
    return this.http.put(routes.LeaveType.leaveTypeEdit(leave_id), data);
  }
  updateLeaveStatus(leave_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.LeaveType.leaveTypeUpdateStatus(leave_id),
      data,
    );
  }
  getByIdLeave(leave_id: any): Observable<any> {
    return this.http.get(routes.LeaveType.getById(leave_id));
  }
  deleteLeaveTypes(leave_id: any): Observable<any> {
    return this.http.delete(routes.LeaveType.deleteLeaveTypes(leave_id));
  }

  //Location
  createLocation(data: any): Observable<any> {
    return this.http.post(routes.Location.locationCreate(), data);
  }
  listLocation(): Observable<any> {
    return this.http.get(routes.Location.locationList());
  }
  editLocation(location_id: any, data: any): Observable<any> {
    return this.http.put(routes.Location.locationEdit(location_id), data);
  }
  getByIdLocation(location_id: any): Observable<any> {
    return this.http.get(routes.Location.getById(location_id));
  }

  //Industry Sector Master
  createIndustry(data: any): Observable<any> {
    return this.http.post(routes.IndustrySectorMaster.industryCreate(), data);
  }
  listIndustry(): Observable<any> {
    return this.http.get(routes.IndustrySectorMaster.IndustryList());
  }
  editIndustry(industry_sector_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.IndustrySectorMaster.industryEdit(industry_sector_id),
      data,
    );
  }
  getByIdIndustry(industry_sector_id: any): Observable<any> {
    return this.http.get(
      routes.IndustrySectorMaster.getById(industry_sector_id),
    );
  }

  //Rating
  createRating(data: any): Observable<any> {
    return this.http.post(routes.Rating.ratingCreate(), data);
  }
  listRating(): Observable<any> {
    return this.http.get(routes.Rating.ratingList());
  }
  editRating(rating_id: any, data: any): Observable<any> {
    return this.http.put(routes.Rating.ratingEdit(rating_id), data);
  }
  getByIdRating(rating_id: any): Observable<any> {
    return this.http.get(routes.Rating.getById(rating_id));
  }
  //Source-stage
  createSourceStage(data: any): Observable<any> {
    return this.http.post(routes.SourceStage.SourceStageCreate(), data);
  }
  sourceStageList(): Observable<any> {
    return this.http.get(routes.SourceStage.SourceStageList());
  }
  editSourceStage(stage_Id: any, data: any): Observable<any> {
    return this.http.put(routes.SourceStage.SourceStageEdit(stage_Id), data);
  }
  getByIdStage(stage_Id: any): Observable<any> {
    return this.http.get(routes.SourceStage.getById(stage_Id));
  }

  //Employement-Type
  createEmployement(data: any): Observable<any> {
    return this.http.post(routes.EmployementType.employementCreate(), data);
  }
  listEmployement(): Observable<any> {
    return this.http.get(routes.EmployementType.employementList());
  }
  getactive_employmentTypeList(): Observable<any> {
    return this.http.get(routes.EmployementType.getactive_employmentTypeList());
  }
  editEmployement(emptype_id: any, data: any): Observable<any> {
    return this.http.put(routes.EmployementType.employeeEdit(emptype_id), data);
  }
  updateEmployementStatus(emptype_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.EmployementType.employeeUpdateStatus(emptype_id),
      data,
    );
  }
  getByIdEmployement(emptype_id: any): Observable<any> {
    return this.http.get(routes.EmployementType.getById(emptype_id));
  }
  DeleteEmployement(emptype_id: any): Observable<any> {
    return this.http.put(
      routes.EmployementType.employementDelete(emptype_id),
      {},
    );
  }

  //Municipality

  get_Municipality(entity_id: any): Observable<any> {
    return this.http.get(
      routes.municipality_master.get_Municipality(entity_id),
    );
  }
  get_active_municipality(entity_id: any): Observable<any> {
    return this.http.get(
      routes.municipality_master.get_active_municipality(entity_id),
    );
  }

  createMunicipality(data: any): Observable<any> {
    return this.http.post(
      routes.municipality_master.createMunicipality(),
      data,
    );
  }
  get_MunicipalityById(id: any): Observable<any> {
    return this.http.get(routes.municipality_master.get_MunicipalityById(id));
  }
  deleteMunicipalityById(id: any): Observable<any> {
    return this.http.delete(
      routes.municipality_master.deleteMunicipalityById(id),
    );
  }
  update_MunicipalityById(id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.municipality_master.update_MunicipalityById(id),
      data,
    );
  }

  //contract-type
  get_Contract(entity: any, finacial_id: any): Observable<any> {
    return this.http.get(
      routes.contract_type_master.get_Contract(entity, finacial_id),
    );
  }
  createContractType(data: any): Observable<any> {
    return this.http.post(
      routes.contract_type_master.createContractType(),
      data,
    );
  }
  updateContractType(id: any, data: any): Observable<any> {
    return this.http.put(
      routes.contract_type_master.updateContractType(id),
      data,
    );
  }
  update_ContractById(id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.contract_type_master.update_ContractById(id),
      data,
    );
  }
  get_ContractById(id: any): Observable<any> {
    return this.http.get(routes.contract_type_master.get_ContractById(id));
  }
  delete_ContractById(id: any): Observable<any> {
    return this.http.delete(
      routes.contract_type_master.delete_ContractById(id),
    );
  }

  //Department
  createDepartment(data: any, entity_id: any): Observable<any> {
    return this.http.post(routes.department.create(entity_id), data);
  }
  createCostProfitType(data: any): Observable<any> {
    return this.http.post(routes.department.createCostProfitType(), data);
  }

  getDepartment(entity_id: any): Observable<any> {
    return this.http.get(routes.department.list(entity_id));
  }
  getCostProfitType(entity_id: any): Observable<any> {
    return this.http.get(routes.department.getCostProfitType(entity_id));
  }

  getDepartmentActive(entity_id: any): Observable<any> {
    return this.http.get(routes.department.listActive(entity_id));
  }

  getLevelType(entity_id: any): Observable<any> {
    return this.http.get(routes.department.levelTypeList(entity_id));
  }

  get_all_workflow_department(employee_id: any): Observable<any> {
    return this.http.get(
      routes.department.get_all_workflow_department(employee_id),
    );
  }

  getAllArea_active(data: any): Observable<any> {
    console.log('datadatadata', data);

    return this.http.post(routes.department.getAllArea_active(), data);
  }
  branch_get_active(): Observable<any> {
    return this.http.get(routes.department.branch_get_active());
  }
  getContractTypes_active(entityId: any, finacId: any): Observable<any> {
    return this.http.get(
      routes.department.getContractTypes_active(entityId, finacId),
    );
  }
  getAllReason_active(entityId: any): Observable<any> {
    return this.http.get(routes.department.getAllReason_active(entityId));
  }
  getAllDesignation_active(): Observable<any> {
    return this.http.get(routes.department.getAllDesignation_active());
  }
  getAllDepartment_all_active(entity_id: any): Observable<any> {
    return this.http.get(
      routes.department.getAllDepartment_all_active(entity_id),
    );
  }

  getDepartmentAll(entity_id: any): Observable<any> {
    return this.http.get(routes.department.listAll(entity_id));
  }
  updateDepartment(dept_id: any, data: any, entity_id: any): Observable<any> {
    return this.http.put<any>(
      routes.department.updateDept(dept_id, entity_id),
      data,
    );
  }
  departmentById(dept_id: any): Observable<any> {
    return this.http.get(routes.department.byId(dept_id));
  }
  deleteDepartmentById(dept_id: any): Observable<any> {
    return this.http.delete(routes.department.delete(dept_id));
  }
  departmentStatusById(dept_id: any, data: any): Observable<any> {
    return this.http.put(routes.department.status(dept_id), data);
  }
  getAllRole(role: any): Observable<any> {
    return this.http.get(routes.department.getAllRole(role));
  }
  get_all_employeeBy_User_role(role_id: any, entity_id: any): Observable<any> {
    return this.http.post(
      routes.department.get_all_employeeBy_User_role(role_id, entity_id),
      null,
    );
  }
  getAllDepartment_all(entity_id: any, employee_id: any): Observable<any> {
    return this.http.get(
      routes.department.getAllDepartment_all(entity_id, employee_id),
    );
  }

  //reason
  create_reason(data: any): Observable<any> {
    return this.http.post(routes.reason_master.create_reason(), data);
  }

  getall_reasons(entity_id: any): Observable<any> {
    return this.http.get(routes.reason_master.getall_reasons(entity_id));
  }

  delete_reason_ById(id: any): Observable<any> {
    return this.http.delete(routes.reason_master.delete_reason_ById(id));
  }

  update_reason_ById(id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.reason_master.update_reason_ById(id),
      data,
    );
  }

  get_reason_ById(id: any): Observable<any> {
    return this.http.get(routes.reason_master.get_reason_ById(id));
  }

  updatedStatusReason(id: any, data: any) {
    return this.http.put<any>(
      routes.reason_master.updatedStatusReason(id),
      data,
    );
  }
  // departmentStatusById(dept_id: any, data: any): Observable<any> {
  //   return this.http.put(routes.department.status(dept_id), data);
  // }

  //Designation
  createDesignation(data: any): Observable<any> {
    return this.http.post(routes.designation.create(), data);
  }
  getDesignation(): Observable<any> {
    return this.http.get(routes.designation.list());
  }
  updateDesignation(designation_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.designation.updateDesi(designation_id),
      data,
    );
  }
  updateDesignationStatus(designation_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.designation.updateDesignationStatus(designation_id),
      data,
    );
  }
  designationById(designation_id: any): Observable<any> {
    return this.http.get(routes.designation.byId(designation_id));
  }
  deleteDesignation(designation_id: any): Observable<any> {
    return this.http.delete(
      routes.designation.designationDelete(designation_id),
    );
  }

  //Years of Experiance
  createYearExperiance(data: any): Observable<any> {
    return this.http.post(routes.yearExperiance.create(), data);
  }
  getYearExperiance(): Observable<any> {
    return this.http.get(routes.yearExperiance.list());
  }
  updateYearExperiance(year_of_exp_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.yearExperiance.updateYearExperiance(year_of_exp_id),
      data,
    );
  }
  yearExperianceById(year_of_exp_id: any): Observable<any> {
    return this.http.get(routes.yearExperiance.byId(year_of_exp_id));
  }

  //Region
  createRegion(data: any): Observable<any> {
    return this.http.post(routes.region.regionCreate(), data);
  }
  getRegion(): Observable<any> {
    return this.http.get(routes.region.regionGet());
  }
  updateRegion(id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.region.regionUpdate(id), data);
  }
  // deleteRegion(id: any, data: any): Observable<any> {
  //   return this.http.delete<any>(routes.region.regionDelete(id), data);
  // }
  getByIdRegion(id: any): Observable<any> {
    return this.http.get(routes.region.regionGetById(id));
  }
  csvUpload(data: any): Observable<any> {
    return this.http.post<any>(routes.auditor.csvUploadpost(), data);
  }
  // Auditor
  upload_File(data: any): Observable<any> {
    return this.http.post<any>(routes.auditor.upload(), data);
  }
  getAuditor(): Observable<any> {
    return this.http.get(routes.auditor.list());
  }
  /** Pincode start  */
  createPincode(data: any): Observable<any> {
    return this.http.post(routes.Pincode.pincodeCreate(), data);
  }
  getPincode(): Observable<any> {
    return this.http.get(routes.Pincode.pincodeGet());
  }
  getByIdPincode(city_id: any): Observable<any> {
    return this.http.get(routes.Pincode.pincodeGetById(city_id));
  }
  updateSinglePincode(city_id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.Pincode.pincodeUpdate(city_id), data);
  }
  deletePincodeStatus(city_id: any): Observable<any> {
    return this.http.delete(routes.Pincode.pincodestatusdelete(city_id));
  }
  /** Pincode end  */
  /** Quotation Currency start  */
  createQuotationcurrency(data: any): Observable<any> {
    return this.http.post(
      routes.QuotationCurrency.quotationcurrencyCreate(),
      data,
    );
  }
  getQuotationcurrency(): Observable<any> {
    return this.http.get(routes.QuotationCurrency.quotationcurrencyGet());
  }
  getByIdQuotationcurrency(quotation_currency_id: any): Observable<any> {
    return this.http.get(
      routes.QuotationCurrency.quotationcurrencyGetById(quotation_currency_id),
    );
  }
  updateQuotationcurrencyStatus(
    quotation_currency_id: any,
    data: any,
  ): Observable<any> {
    return this.http.put(
      routes.QuotationCurrency.statusUpdateQuotationcurrency(
        quotation_currency_id,
      ),
      data,
    );
  }
  updateSingleQuotationcurrency(
    quotation_currency_id: any,
    data: any,
  ): Observable<any> {
    return this.http.put<any>(
      routes.QuotationCurrency.quotationcurrencyUpdate(quotation_currency_id),
      data,
    );
  }
  deleteQuotationCurrency(quotation_currency_id: any): Observable<any> {
    return this.http.delete(
      routes.QuotationCurrency.quotationCurrencyDelete(quotation_currency_id),
    );
  }
  /** Quotation Currency end  */
  /** AccrediationID start  */
  createAccrediationid(data: any): Observable<any> {
    return this.http.post(routes.AccrediationId.accrediationidCreate(), data);
  }
  getAccrediationid(): Observable<any> {
    return this.http.get(routes.AccrediationId.accrediationidGet());
  }
  getByIdAccrediationid(accreditationID: any): Observable<any> {
    return this.http.get(
      routes.AccrediationId.accrediationidGetById(accreditationID),
    );
  }
  updateAccrediationid(accreditationID: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.AccrediationId.accrediationidUpdate(accreditationID),
      data,
    );
  }
  deleteAccrediation(
    accredition_logo_details_id: any,
    body: any,
  ): Observable<any> {
    return this.http.delete(
      routes.AccrediationId.accrediationDelete(accredition_logo_details_id),
      body,
    );
  }
  csvUploads(data: any): Observable<any> {
    return this.http.post<any>(routes.AccrediationId.csvUploadposts(), data);
  }
  /** AccrediationID end  */
  /** Accrediation Logo Details start  */
  createAccrediationlogo(data: any): Observable<any> {
    return this.http.post(
      routes.AccrediationLogo.accrediationlogoCreate(),
      data,
    );
  }
  getAccrediationlogo(): Observable<any> {
    return this.http.get(routes.AccrediationLogo.accrediationlogoGet());
  }
  getByIdAccrediationlogo(accredition_logo_details_id: any): Observable<any> {
    return this.http.get(
      routes.AccrediationLogo.accrediationlogoGetById(
        accredition_logo_details_id,
      ),
    );
  }
  updateSingleAccrediationlogo(
    accredition_logo_details_id: any,
    data: any,
  ): Observable<any> {
    return this.http.put<any>(
      routes.AccrediationLogo.accrediationlogoUpdate(
        accredition_logo_details_id,
      ),
      data,
    );
  }
  /** Accrediation Logo Details end  */
  /** Accrediation Logo Details start  */
  CreateEacode(data: any): Observable<any> {
    return this.http.post(routes.EaCode.eacodeCreate(), data);
  }
  getEacode(): Observable<any> {
    return this.http.get(routes.EaCode.eacodeGet());
  }
  getByIdEacode(ea_code_id: any): Observable<any> {
    return this.http.get(routes.EaCode.eacodeGetById(ea_code_id));
  }
  updateSingleEacode(ea_code_id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.EaCode.eacodeUpdate(ea_code_id), data);
  }
  /** Accrediation Logo Details end  */

  //Approver
  createApprover(data: any): Observable<any> {
    return this.http.post(routes.Approver.createApprover(), data);
  }
  listApprover(): Observable<any> {
    return this.http.get(routes.Approver.listApprover());
  }
  ApprovergetById(approval_id: any): Observable<any> {
    return this.http.get(routes.Approver.getByIdApprover(approval_id));
  }
  Approverupdate(approval_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.Approver.updateApprover(approval_id),
      data,
    );
  }
  /** segment start  */
  CreateSegment(data: any): Observable<any> {
    return this.http.post(routes.Segment.segmentCreate(), data);
  }
  getSegment(): Observable<any> {
    return this.http.get(routes.Segment.segmentGet());
  }
  getByIdSegment(segment_id: any): Observable<any> {
    return this.http.get(routes.Segment.segmentGetById(segment_id));
  }
  updateSingleSegment(segment_id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.Segment.segmentUpdate(segment_id), data);
  }

  //  product-master
  CreateProduct(data: any): Observable<any> {
    return this.http.post(routes.Product.productCreate(), data);
  }
  getProduct(): Observable<any> {
    return this.http.get(routes.Product.productGet());
  }
  getByIdProduct(product_master_id: any): Observable<any> {
    return this.http.get(routes.Product.ProductGetbyId(product_master_id));
  }
  updateProductMaster(product_master_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.Product.productUpdate(product_master_id),
      data,
    );
  }

  // vehicle registration master
  CreateVehicleRegistration(data: any): Observable<any> {
    return this.http.post(
      routes.vehicleRegistration.createVehicleRegistration(),
      data,
    );
  }
  getAllVehicleRegistration(): Observable<any> {
    return this.http.get(
      routes.vehicleRegistration.getAllVehicleRegistration(),
    );
  }
  getByIdVehicleRegistration(vehicle_registration_id: any): Observable<any> {
    return this.http.get(
      routes.vehicleRegistration.getByIdVehicleRegistration(
        vehicle_registration_id,
      ),
    );
  }
  updateVehicleRegistration(
    vehicle_registration_id: any,
    data: any,
  ): Observable<any> {
    return this.http.put<any>(
      routes.vehicleRegistration.updateVehicleRegistrationById(
        vehicle_registration_id,
      ),
      data,
    );
  }
  deleteVehicleRegistration(id: any): Observable<any> {
    return this.http.delete(
      routes.vehicleRegistration.vehicleRegistrationDelete(id),
    );
  }

  toogleVehicleStatus(id: any, data: any): Observable<any> {
    return this.http.put(
      routes.vehicleRegistration.toogleVehicleStatus(id),
      data,
    );
  }

  //  customer type starts
  CreateCustomerType(data: any): Observable<any> {
    return this.http.post(routes.CustomerType.CustomerTypeCreate(), data);
  }
  updateSingleCustomer(customer_type_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.CustomerType.customertypeUpdate(customer_type_id),
      data,
    );
  }
  getCustomerType(): Observable<any> {
    return this.http.get(routes.CustomerType.CustomerGet());
  }
  editCustomerType(customer_type_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.CustomerType.customerTypeEdit(customer_type_id),
      data,
    );
  }

  // customer type ends
  // Training Name starts
  getTrainingName(): Observable<any> {
    return this.http.get(routes.TrainingName.TrainingGet());
  }
  CreateTrainingName(data: any): Observable<any> {
    return this.http.post(routes.TrainingName.TrainingNameCreate(), data);
  }
  updateSingleTrainingName(traning_name_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.TrainingName.trainingNameUpdate(traning_name_id),
      data,
    );
  }
  editTrainingName(traning_name_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.TrainingName.trainingNameEdit(traning_name_id),
      data,
    );
  }
  getByIdTrainingName(id: any): Observable<any> {
    return this.http.get(routes.TrainingName.trainingNameById(id));
  }
  // Training Name ends
  // Level slab starts
  getLevelSlab(): Observable<any> {
    return this.http.get(routes.LevelSlab.LevelSlabGet());
  }
  CreateLevelSlab(data: any): Observable<any> {
    return this.http.post(routes.LevelSlab.createlevelSlab(), data);
  }
  updateSingleLevelSlab(level_slab_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.LevelSlab.levelSlabUpdate(level_slab_id),
      data,
    );
  }
  updateStatusLevelSlab(level_slab_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.LevelSlab.levelSlabUpdateStatus(level_slab_id),
      data,
    );
  }
  editLevelSlab(traning_name_id: any, data: any): Observable<any> {
    return this.http.put(routes.LevelSlab.levelSlabEdit(traning_name_id), data);
  }
  getByIdSlab(id: any): Observable<any> {
    return this.http.get(routes.LevelSlab.levelSlabById(id));
  }
  deleteSlab(id: any): Observable<any> {
    return this.http.delete(routes.LevelSlab.levelSlabDelete(id));
  }
  // Level slab ends
  // price map starts
  getPriceMap(): Observable<any> {
    return this.http.get(routes.PriceMap.priceMapGet());
  }
  CreatePriceMap(data: any): Observable<any> {
    return this.http.post(routes.PriceMap.createpriceMap(), data);
  }
  updateSinglePriceMap(price_mapping_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.PriceMap.priceMapUpdate(price_mapping_id),
      data,
    );
  }
  editPriceMap(price_mapping_id: any, data: any): Observable<any> {
    return this.http.put(routes.PriceMap.priceMapEdit(price_mapping_id), data);
  }
  getByIdPrice(id: any): Observable<any> {
    return this.http.get(routes.PriceMap.priceById(id));
  }
  // price map ends

  // price level starts
  getPriceLevel(): Observable<any> {
    return this.http.get(routes.PriceLevel.priceMapGet());
  }
  create_price_level(data: any): Observable<any> {
    return this.http.post(routes.PriceLevel.createpriceLevel(), data);
  }
  editPriceLevel(pricing_level_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.PriceLevel.pricelevelEdit(pricing_level_id),
      data,
    );
  }
  updatePriceLevel(pricing_level_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.PriceLevel.updatePriceLevel(pricing_level_id),
      data,
    );
  }
  getByIdPriceLevel(id: any): Observable<any> {
    return this.http.get(routes.PriceLevel.priceLevelById(id));
  }

  // price level ends

  /** segment end  */
  /* Certificate Type start */
  CreateCertificate(data: any): Observable<any> {
    return this.http.post(routes.certiTypes.certificateCreate(), data);
  }
  getAllCertificate(): Observable<any> {
    return this.http.get(routes.certiTypes.certficateGet());
  }
  getByIdCertificate(certificate_type_id: any): Observable<any> {
    return this.http.get(
      routes.certiTypes.certificateGetById(certificate_type_id),
    );
  }
  updateSingleCertificate(
    certificate_type_id: any,
    data: any,
  ): Observable<any> {
    return this.http.put<any>(
      routes.certiTypes.certificateUpdate(certificate_type_id),
      data,
    );
  }
  /* Certificate Type start */
  /*regional bussinesshead start */
  Createnewregionalbussinesshead(data: any): Observable<any> {
    return this.http.post(
      routes.regionalbussinesshead.regionalbussinessheadCreate(),
      data,
    );
  }
  getAllRegionalbussinesshead(): Observable<any> {
    return this.http.get(
      routes.regionalbussinesshead.regionalbussinessheadGet(),
    );
  }
  getByIdRegionalbussinesshead(
    new_regional_business_head_id: any,
  ): Observable<any> {
    return this.http.get(
      routes.regionalbussinesshead.regionalbussinessheadGetById(
        new_regional_business_head_id,
      ),
    );
  }
  updateSingleRegionalbussinesshead(
    new_regional_business_head_id: any,
    data: any,
  ): Observable<any> {
    return this.http.put<any>(
      routes.regionalbussinesshead.regionalbussinessheadUpdate(
        new_regional_business_head_id,
      ),
      data,
    );
  }
  /*regional bussinesshead end */

  //Global sales manager
  createGSM(data: any): Observable<any> {
    return this.http.post(
      routes.globalSalesManager.globalSalesManagerCreate(),
      data,
    );
  }
  getAllGSM(): Observable<any> {
    return this.http.get(routes.globalSalesManager.globalSalesManagerList());
  }
  updateGSM(new_global_manager_sales_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.globalSalesManager.globalSalesManagerUpdate(
        new_global_manager_sales_id,
      ),
      data,
    );
  }
  getByIdGSM(new_global_manager_sales_id: any): Observable<any> {
    return this.http.get(
      routes.globalSalesManager.getById(new_global_manager_sales_id),
    );
  }

  getVendorType() {
    return this.http.get(routes.vendor.getVendorType());
  }

  getVendor_ById(id: any) {
    return this.http.get(routes.vendor.getVendorById(id));
  }

  addVendorType(data: any) {
    return this.http.post(routes.vendor.addVendorType(), data);
  }

  updatevendor(id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.vendor.vendorUpdate(id), data);
  }
  create_price_slab_level(data: any): Observable<any> {
    return this.http.post(
      routes.PriceLevelSlap.create_pricing_level_slab(),
      data,
    );
  }
  create_pricing_level(data: any): Observable<any> {
    return this.http.post(routes.PriceLevelSlap.createPricingLevel(), data);
  }
  getPriceSlab() {
    return this.http.get(routes.PriceLevelSlap.getPriceLevelSlab());
  }

  // Global Manager
  CreateGmd(data: any): Observable<any> {
    return this.http.post(routes.GMD.gmdCreate(), data);
  }
  ListGmd(): Observable<any> {
    return this.http.get(routes.GMD.gmdGet());
  }
  editGmd(director_id: any, data: any): Observable<any> {
    return this.http.put(routes.GMD.gmdPut(director_id), data);
  }
  byIdGmd(director_id: any): Observable<any> {
    return this.http.get(routes.GMD.gmdGetById(director_id));
  }
  // complteness Check
  createCompleteness(data: any): Observable<any> {
    return this.http.post(routes.completenessCheck.completeness_create(), data);
  }
  getAllCompleteness(): Observable<any> {
    return this.http.get(routes.completenessCheck.compltenessList());
  }
  updateCompleteness(l1_code: any, data: any): Observable<any> {
    return this.http.put(
      routes.completenessCheck.completenessUpdate(l1_code),
      data,
    );
  }
  // conclusion of completeness Check
  createconcompleteness(data: any): Observable<any> {
    return this.http.post(
      routes.concompleteness.concompleteness_create(),
      data,
    );
  }
  getAllconcompleteness(): Observable<any> {
    return this.http.get(routes.concompleteness.concompletenessList());
  }
  updateconcompeteness(
    completeness_Checkl1_id: any,
    data: any,
  ): Observable<any> {
    return this.http.put(
      routes.concompleteness.concompletenessUpdate(completeness_Checkl1_id),
      data,
    );
  }

  // Technical Review Check
  createtechreview(data: any): Observable<any> {
    return this.http.post(routes.technicalCheck.techreview_create(), data);
  }

  getAlltechreview(): Observable<any> {
    return this.http.get(routes.technicalCheck.techreviewList());
  }

  updatetechreview(technical_review_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.technicalCheck.techreviewUpdate(technical_review_id),
      data,
    );
  }

  // conclusion of Technical Review Check
  createcontechreview(data: any): Observable<any> {
    return this.http.post(
      routes.contechnicalCheck.contechreview_create(),
      data,
    );
  }
  getAllcontechreview(): Observable<any> {
    return this.http.get(routes.contechnicalCheck.contechreviewList());
  }
  updatecontechreview(
    completeness_Check_tech_id: any,
    data: any,
  ): Observable<any> {
    return this.http.put(
      routes.contechnicalCheck.contechreviewUpdate(completeness_Check_tech_id),
      data,
    );
  }

  //courier service name

  getAllCourier() {
    return this.http.get(routes.courierService.courier_List());
  }

  createCourier(data: any) {
    return this.http.post(routes.courierService.courier_create(), data);
  }

  updateCourier(id: any, data: any) {
    return this.http.put(routes.courierService.courier_update(id), data);
  }
  updateCourierstatus(id: any, data: any) {
    return this.http.put(routes.courierService.courier_update_status(id), data);
  }

  getByIdCourier(id: any) {
    return this.http.get(routes.courierService.courierGetById(id));
  }

  CourierDelete(id: any) {
    return this.http.delete(routes.courierService.deleteCourier(id));
  }

  //contains master

  getAllContains() {
    return this.http.get(routes.courier_contains.contains_List());
  }

  createContains(data: any) {
    return this.http.post(routes.courier_contains.contains_create(), data);
  }

  updateContains(id: any, data: any) {
    return this.http.put(routes.courier_contains.contains_update(id), data);
  }

  updateContainsStatus(id: any, data: any) {
    return this.http.put(
      routes.courier_contains.contains_update_status(id),
      data,
    );
  }

  getByIdContains(id: any) {
    return this.http.get(routes.courier_contains.containsGetById(id));
  }

  deleteContains(id: any) {
    return this.http.delete(routes.courier_contains.containsDelete(id));
  }

  getAllLanguage() {
    return this.http.get(routes.language.getAllLanguage());
  }

  getlangById(id: any) {
    return this.http.get(routes.language.getlangById(id));
  }

  Deletelang(id: any) {
    return this.http.delete(routes.language.langDelete(id));
  }

  create_new_language(data: any) {
    return this.http.post(routes.language.createLanguage(), data);
  }

  updateLang(id: any, data: any) {
    return this.http.put(routes.language.update_lang(id), data);
  }

  updateLangStatus(id: any, data: any) {
    return this.http.put(routes.language.update_lang_status(id), data);
  }

  getAllAmcDes() {
    return this.http.get(routes.amc_des.getAllAmcDes());
  }

  createAmcDes(data: any) {
    return this.http.post(routes.amc_des.createAmcDes(), data);
  }

  updateAmcDes(id: any, data: any) {
    return this.http.patch(routes.amc_des.edit_amc_des(id), data);
  }

  updateAmcDesStatus(id: any, data: any) {
    return this.http.put(routes.amc_des.edit_amc_des_status(id), data);
  }

  getAmcDesById(id: any) {
    return this.http.get(routes.amc_des.getAmcDesById(id));
  }

  DeleteAmcDes(id: any) {
    return this.http.delete(routes.amc_des.AmcDesDelete(id));
  }
  createEmpSign(id: any, file: any) {
    const formData = new FormData();
    if (file) {
      formData.append('sign', file, file.name);
    } else {
      formData.append('sign', 'undefined');
    }
    // for (let key in data) {

    //   formData.append(`${key}`, data[key]);
    // }
    return this.http.post(routes.empDocSign.createEmpSign(id), formData);
  }
  getAllEmpSign() {
    return this.http.get(routes.empDocSign.getAllEmpSign());
  }
  getByEmpSign(id: any) {
    return this.http.get(routes.empDocSign.getByEmpSign(id));
  }

  setValue = new Subject<any>();

  idvalueSetDocu(id: any) {
    console.log(id, 'id service');

    this.setValue.next(id);
  }

  // messageSubject = new Subject<any>();
  // sayMessage(message: any) {
  //   this.messageSubject.next(message);
  // }

  updateEmplSign(id: any, file: any) {
    const formData = new FormData();
    if (file) {
      formData.append('sign', file, file.name);
    } else {
      formData.append('sign', 'undefined');
    }
    return this.http.patch(routes.empDocSign.updateEmplSign(id), formData);
  }

  MED_Cert(): Observable<any> {
    return this.http.get(routes.priceTable.MED_Cert());
  }

  MED_Non_Cert(): Observable<any> {
    return this.http.get(routes.priceTable.MED_Non_Cert());
  }

  // plant master start -->
  getPlantMasterList(id: any) {
    return this.http.get(routes.plantMasterService.plantMaster_List(id));
  }

  createPlantMaster(data: any) {
    return this.http.post(routes.plantMasterService.plantMaster_create(), data);
  }

  updatePlantMaster(id: any, data: any) {
    return this.http.put(
      routes.plantMasterService.plantMaster_update(id),
      data,
    );
  }

  getByIdPlantMaster(id: any, id1: any) {
    return this.http.get(routes.plantMasterService.plantMasterGetById(id, id1));
  }
  deletePlantMaster(id: any) {
    return this.http.delete(routes.plantMasterService.plantMasterDelete(id));
  }
  statusPlantMasterById(id: any, data: any) {
    return this.http.put(
      routes.plantMasterService.plantMasterStatusById(id),
      data,
    );
  }
  // plant master end -->
  // Branch-Setup
  getListBranchSetup() {
    return this.http.get(routes.branchSetup.list());
  }
  getListActiveBranchSetup() {
    return this.http.get(routes.branchSetup.activeList());
  }
  getAllArea() {
    return this.http.get(routes.branchSetup.getAllArea());
  }
  branchSetupCreate(data: any): Observable<any> {
    return this.http.post(routes.branchSetup.create(), data);
  }
  branchSetupGetById(id: any) {
    return this.http.get(routes.branchSetup.getById(id));
  }
  deleteBranchSetup(id: any) {
    return this.http.delete(routes.branchSetup.deleteData(id));
  }
  updateBranchSetup(id: any, formData: any) {
    return this.http.put(routes.branchSetup.update(id), formData);
  }
  statuseBranchSetupById(id: any, formData: any) {
    return this.http.put(routes.branchSetup.statusById(id), formData);
  }
  // uom start -->
  getUOMList() {
    return this.http.get(routes.uomService.uom_List());
  }

  getActiveUOMList() {
    return this.http.get(routes.uomService.active_uom_List());
  }

  createUOM(data: any) {
    return this.http.post(routes.uomService.uom_create(), data);
  }

  updateUOM(id: any, data: any) {
    return this.http.put(routes.uomService.uom_update(id), data);
  }

  getByIdUOM(id: any) {
    return this.http.get(routes.uomService.uomGetById(id));
  }
  deleteUOM(id: any) {
    return this.http.delete(routes.uomService.uomDelete(id));
  }
  statusUOMById(id: any, data: any) {
    return this.http.put(routes.uomService.uomStatusById(id), data);
  }
  // uom end -->

  // checklist start -->
  getCHECKLISTList() {
    return this.http.get(routes.checklistService.checklist_List());
  }

  getActiveCheckList() {
    return this.http.get(routes.checklistService.active_checklist_List());
  }

  createchecklist(data: any) {
    return this.http.post(routes.checklistService.checklist_create(), data);
  }

  updateCHECKLIST(id: any, data: any) {
    return this.http.put(routes.checklistService.checklist_update(id), data);
  }

  getByIdCHECKLIST(id: any) {
    return this.http.get(routes.checklistService.checklistGetById(id));
  }
  deleteCHECKLIST(id: any) {
    return this.http.delete(routes.checklistService.checklistDelete(id));
  }
  statusCHECKLISTById(id: any, data: any) {
    return this.http.put(routes.checklistService.checklistStatusById(id), data);
  }
  // checklist end -->

  // shift start -->
  getShiftList() {
    return this.http.get(routes.shiftService.shift_List());
  }

  createShift(data: any) {
    return this.http.post(routes.shiftService.shift_create(), data);
  }

  updateShift(id: any, data: any) {
    return this.http.put(routes.shiftService.shift_update(id), data);
  }

  getByIdShift(id: any) {
    return this.http.get(routes.shiftService.shiftGetById(id));
  }
  deleteShift(id: any) {
    return this.http.delete(routes.shiftService.shiftDelete(id));
  }
  statusShiftById(id: any, data: any) {
    return this.http.put(routes.shiftService.shiftStatusById(id), data);
  }
  // shift end -->

  // asset master start -->
  getAssetMasterList() {
    return this.http.get(routes.assetMasterService.assetMaster_List());
  }

  getActiveAssetMasterList() {
    return this.http.get(routes.assetMasterService.activeAssetMaster_List());
  }

  createAssetMaster(data: any) {
    return this.http.post(routes.assetMasterService.assetMaster_create(), data);
  }

  updateAssetMaster(id: any, data: any) {
    return this.http.put(
      routes.assetMasterService.assetMaster_update(id),
      data,
    );
  }
  updateAssetMasterStatus(id: any, data: any) {
    return this.http.put(
      routes.assetMasterService.assetMaster_update_status(id),
      data,
    );
  }

  getByIdAssetMaster(id: any) {
    return this.http.get(routes.assetMasterService.assetMasterGetById(id));
  }
  deleteAssetMaster(id: any) {
    return this.http.delete(routes.assetMasterService.assetMasterDelete(id));
  }
  // asset master end -->

  // service master start -->
  getServiceMasterList(entity_id: any) {
    return this.http.get(
      routes.serviceMasterService.serviceMaster_List(entity_id),
    );
  }

  createServiceMaster(data: any) {
    return this.http.post(
      routes.serviceMasterService.serviceMaster_create(),
      data,
    );
  }

  createServiceChartOfAccount(data: any) {
    return this.http.post(
      routes.serviceMasterService.createServiceChartOfAccount(),
      data,
    );
  }

  updateServiceMaster(id: any, data: any) {
    return this.http.put(
      routes.serviceMasterService.serviceMaster_update(id),
      data,
    );
  }

  getByIdServiceMaster(id: any) {
    return this.http.get(routes.serviceMasterService.serviceMasterGetById(id));
  }

  deleteServiceMaster(id: any) {
    return this.http.delete(
      routes.serviceMasterService.serviceMasterDelete(id),
    );
  }

  statuseServiceMasterById(id: any, formData: any) {
    return this.http.put(routes.serviceMasterService.statusById(id), formData);
  }
  createMateriaRequest(data: any) {
    return this.http.post(
      routes.serviceMasterService.createMateriaRequest(),
      data,
    );
  }
  allocateMaterial(data: any) {
    return this.http.post(routes.serviceMasterService.allocateMaterial(), data);
  }
  getMaterialRequestList(id: any) {
    return this.http.get(
      routes.serviceMasterService.getMaterialRequestList(id),
    );
  }
  getAllMaterialRequestList() {
    return this.http.get(
      routes.serviceMasterService.getAllMaterialRequestList(),
    );
  }
  // servicecategory master end -->

  getServiceCategoryMasterList() {
    return this.http.get(
      routes.servicecategoryMasterService.servicecategoryMaster_List(),
    );
  }

  getActiveServiceCategoryMasterList() {
    return this.http.get(
      routes.servicecategoryMasterService.activeServicecategoryMaster_List(),
    );
  }

  createServiceCategoryMaster(data: any) {
    return this.http.post(
      routes.servicecategoryMasterService.servicecategoryMaster_create(),
      data,
    );
  }

  updateServiceCategoryMaster(id: any, data: any) {
    return this.http.put(
      routes.servicecategoryMasterService.servicecategoryMaster_update(id),
      data,
    );
  }

  statusServiceCategoryMaster(id: any, data: any) {
    return this.http.put(
      routes.servicecategoryMasterService.servicecategoryMaster_Status(id),
      data,
    );
  }

  getByIdServiceCategoryMaster(id: any) {
    return this.http.get(
      routes.servicecategoryMasterService.servicecategoryMasterGetById(id),
    );
  }
  deleteServiceCategoryMaster(id: any) {
    return this.http.delete(
      routes.servicecategoryMasterService.servicecategoryMasterDelete(id),
    );
  }
  // servicecategory master end -->

  //bank master
  create_Bank(data: any) {
    return this.http.post(routes.bankMasterService.create_Bank(), data);
  }

  getAllBANK(entity_id: any) {
    return this.http.get(routes.bankMasterService.getAllBANK(entity_id));
  }

  BankStatus(b_id: any, data: any) {
    return this.http.put(routes.bankMasterService.BankStatus(b_id), data);
  }

  delete_Bank(b_id: any) {
    return this.http.delete(routes.bankMasterService.delete_Bank(b_id));
  }

  getByBankID(id: any, entity: any) {
    return this.http.get(routes.bankMasterService.getByBankID(id, entity));
  }

  updateBankById(a_id: any, data: any) {
    return this.http.put(routes.bankMasterService.updateBankById(a_id), data);
  }

  // Area Master Start

  createAreaMaster(data: any) {
    return this.http.post(routes.areaMasterService.areaMaster_create(), data);
  }

  getAreaMasterList() {
    return this.http.get(routes.areaMasterService.areaMaster_list());
  }

  getByIdAreaMaster(id: any) {
    return this.http.get(routes.areaMasterService.areaMaster_getById(id));
  }

  getDepartmentByAreaMaster(id: any) {
    return this.http.get(routes.areaMasterService.areaMaster_getDepByArea(id));
  }

  areaMasterUpdate(a_id: any, data: any) {
    return this.http.put(
      routes.areaMasterService.areaMaster_update(a_id),
      data,
    );
  }

  areaStatus(a_id: any, data: any) {
    return this.http.put(routes.areaMasterService.areaStatus(a_id), data);
  }

  areaMasterDelete(id: any) {
    return this.http.delete(routes.areaMasterService.areaMaster_delete(id));
  }
  // area master end
  // item start -->
  createItem(data: any) {
    return this.http.post(routes.itemService.createItem(), data);
  }
  updatItemMaster(id: any, data: any) {
    return this.http.put(routes.itemService.item_update(id), data);
  }

  getByIdItemMaster(id: any) {
    return this.http.get(routes.itemService.itemGetById(id));
  }
  deleteItemMaster(id: any) {
    return this.http.delete(routes.itemService.itemDelete(id));
  }
  statusItemMasterById(id: any, data: any) {
    return this.http.put(routes.itemService.item_StatusUpdate(id), data);
  }
  getAllItem(data: any = null) {
    const options = data ? data : {};
    return this.http.post(routes.itemService.itemList(), options);
  }
  getAllItemMasterList(data: any = null) {
    const options = data ? data : {};
    return this.http.post(routes.itemService.getAllItemMasterList(), options);
  }
  getAllActiveItem() {
    return this.http.get(routes.itemService.getAllActiveItem());
  }
  getItemType() {
    return this.http.get(routes.itemService.itemtype());
  }
  getSubCategory(id: any) {
    return this.http.get(routes.itemService.itemTypeCategory(id));
  }

  getDocumentType() {
    return this.http.get(routes.itemService.documenttype());
  }

  getItemBySubCategory(id: any) {
    return this.http.get(routes.itemService.itemBySubCategory(id));
  }

  getItemPriceSubcategory(
    customer_id: any,
    item_id: any,
    sub_category_id: any,
    asset_id: any,
    version_id: any,
  ) {
    return this.http.get(
      routes.itemService.getItemPriceSubcategory(
        customer_id,
        item_id,
        sub_category_id,
        asset_id,
        version_id,
      ),
    );
  }

  getWarehouseList(entity_id: any, financial_year_id: any) {
    return this.http.get(
      routes.itemService.warehouseList(entity_id, financial_year_id),
    );
  }

  getVendorList(entity_id: any) {
    return this.http.get(routes.itemService.vendorList(entity_id));
  }

  createItemSerialNumber(data: any) {
    return this.http.post(routes.itemService.createItemSerialNumber(), data);
  }
  // item end -->

  // subcategory start -->
  createSubCategory(entity_id: any, financial_year_id: any, data: any) {
    return this.http.post(
      routes.subCategoryService.createSubCategory(entity_id, financial_year_id),
      data,
    );
  }

  updateSubCategory(
    entity_id: any,
    financial_year_id: any,
    id: any,
    data: any,
  ) {
    return this.http.put(
      routes.subCategoryService.updateSubCategory(
        entity_id,
        financial_year_id,
        id,
      ),
      data,
    );
  }

  getSubCategoryList(entity_id: any, financial_year_id: any) {
    return this.http.get(
      routes.subCategoryService.allSubCategory(entity_id, financial_year_id),
    );
  }

  getSubCategoryById(entity_id: any, financial_year_id: any, id: any) {
    return this.http.get(
      routes.subCategoryService.getSubCategoryById(
        entity_id,
        financial_year_id,
        id,
      ),
    );
  }

  getSubCategoryByCustomerCategory(
    entity_id: any,
    financial_year_id: any,
    id: any,
  ) {
    return this.http.get(
      routes.subCategoryService.getSubCategoryByCustomerCategory(
        entity_id,
        financial_year_id,
        id,
      ),
    );
  }

  updateStatusSubCategory(
    entity_id: any,
    financial_year_id: any,
    id: any,
    data: any,
  ) {
    return this.http.put(
      routes.subCategoryService.updateStatusSubCategory(
        entity_id,
        financial_year_id,
        id,
      ),
      data,
    );
  }

  removeSubCategory(entity_id: any, financial_year_id: any, id: any) {
    return this.http.delete(
      routes.subCategoryService.removeSubCategory(
        entity_id,
        financial_year_id,
        id,
      ),
    );
  }

  fetchSubCategory(entity_id: any, financial_year_id: any, id: any, obj: any) {
    return this.http.get(
      routes.subCategoryService.fetchSubcateogry(
        entity_id,
        financial_year_id,
        id,
        obj,
      ),
    );
  }
  //create Sub Category
  //CustomersubCategoryService
  createCustomerSubCategory(data: any) {
    return this.http.post(
      routes.CustomersubCategoryService.createCustomerSubCategory(),
      data,
    );
  }

  updateCustomerSubCategory(id: any, data: any) {
    return this.http.put(
      routes.CustomersubCategoryService.updateCustomerSubCategory(id),
      data,
    );
  }

  getCustomerSubCategoryList(entity_id: any, financial_year_id: any) {
    return this.http.get(
      routes.CustomersubCategoryService.allCustomerSubCategory(
        entity_id,
        financial_year_id,
      ),
    );
  }

  getCustomerSubCategoryById(id: any) {
    return this.http.get(
      routes.CustomersubCategoryService.getCustomerSubCategoryById(id),
    );
  }

  updateCustomerStatusSubCategory(id: any, data: any) {
    return this.http.put(
      routes.CustomersubCategoryService.updateStatusCustomerSubCategory(id),
      data,
    );
  }

  removeCustomerSubCategory(id: any) {
    return this.http.delete(
      routes.CustomersubCategoryService.removeCustomerSubCategory(id),
    );
  }

  fetchCustomerSubCategory(id: any, obj: any) {
    return this.http.get(
      routes.CustomersubCategoryService.fetchCustomerSubcategory(id, obj),
    );
  }

  // customer Micro Category
  //CustomersubCategoryService
  createCustomerMicroCategory(data: any) {
    return this.http.post(
      routes.CustomerMicroCategoryService.createCustomerMicroCategory(),
      data,
    );
  }

  updateCustomerMicroCategory(id: any, data: any) {
    return this.http.put(
      routes.CustomerMicroCategoryService.updateCustomerMicroCategory(id),
      data,
    );
  }

  getCustomerMicroCategoryList() {
    return this.http.get(
      routes.CustomerMicroCategoryService.allCustomerMicroCategory(),
    );
  }

  getCustomerMicroCategoryById(id: any) {
    return this.http.get(
      routes.CustomerMicroCategoryService.getCustomerMicroCategoryById(id),
    );
  }

  updateCustomerMicroCategoryStatus(id: any, data: any) {
    return this.http.put(
      routes.CustomerMicroCategoryService.updateStatusCustomerMicroCategory(id),
      data,
    );
  }

  removeCustomerMicroCategory(id: any) {
    return this.http.delete(
      routes.CustomerMicroCategoryService.removeCustomerMicroCategory(id),
    );
  }
  deleteCostProfitTypeById(id: any) {
    return this.http.delete(
      routes.CustomerMicroCategoryService.deleteCostProfitTypeById(id),
    );
  }

  fetchCustomerMicroCategory(id: any, obj: any) {
    return this.http.get(
      routes.CustomerMicroCategoryService.fetchCustomerMicrocategory(id, obj),
    );
  }

  getAllCustomerMicroCategory() {
    return this.http.get(
      routes.CustomerMicroCategoryService.getAllCustomerMicroCategory(),
    );
  }

  getMicroCategoryBySubCategory(id: any) {
    return this.http.get(
      routes.CustomerMicroCategoryService.getMicroCategoryBySubCategory(id),
    );
  }
  // work station master start -->
  getWorkStationMasterList(id: any, f_id: any) {
    return this.http.get(
      routes.workStationMasterService.workStationMaster_List(id, f_id),
    );
  }

  getActiveWorkStationMasterList() {
    return this.http.get(
      routes.workStationMasterService.activeWorkStationMaster_List(),
    );
  }

  createWorkStationMaster(data: any) {
    return this.http.post(
      routes.workStationMasterService.workStationMaster_create(),
      data,
    );
  }

  updateWorkStationMaster(id: any, data: any) {
    return this.http.put(
      routes.workStationMasterService.workStationMaster_update(id),
      data,
    );
  }

  getByIdWorkStationMaster(id: any) {
    return this.http.get(
      routes.workStationMasterService.workStationMasterGetById(id),
    );
  }
  deleteWorkStationMaster(id: any) {
    return this.http.delete(
      routes.workStationMasterService.workStationMasterDelete(id),
    );
  }
  statusWorkStationMasterById(id: any, data: any) {
    return this.http.put(
      routes.workStationMasterService.workStationMasterStatusById(id),
      data,
    );
  }
  // work station master end -->
  // Product Master Start

  getProductMasterList() {
    return this.http.get(routes.productMasterService.productMaster_List());
  }
  getHsnCode(entityId: any, code_type: string = 'HSN') {
    return this.http.get(
      routes.productMasterService.hsnCodeList(entityId, code_type),
    );
  }

  getProductsMasterById(id: any) {
    return this.http.get(routes.productMasterService.productMasterById(id));
  }
  getDuplicateProductMasterList() {
    return this.http.get(
      routes.productMasterService.duplicateProductMaster_List(),
    );
  }

  createProductMaster(data: any) {
    return this.http.post(
      routes.productMasterService.productMaster_create(),
      data,
    );
  }

  updateProductMasterNew(id: any, data: any) {
    return this.http.put(
      routes.productMasterService.productMaster_update(id),
      data,
    );
  }

  getByIdProductMaster(id: any) {
    return this.http.get(routes.productMasterService.productMasterGetById(id));
  }

  deleteProductMaster(id: any) {
    return this.http.delete(
      routes.productMasterService.productMasterDelete(id),
    );
  }

  statuseProductMasterById(id: any, formData: any) {
    return this.http.put(routes.productMasterService.statusById(id), formData);
  }

  getVariantByProductId(id: any) {
    return this.http.get(routes.productMasterService.productVariantById(id));
  }

  getActiveVariantByProductId(id: any) {
    return this.http.get(
      routes.productMasterService.ActiveProductVariantById(id),
    );
  }

  // Product Master End

  // workflow start here
  createWorkflow(data: any) {
    return this.http.post(routes.workflowService.createWorkflow(), data);
  }
  getAllworkflowData() {
    return this.http.get(routes.workflowService.getAllworkflow());
  }
  getWorkflowById(id: any) {
    return this.http.get(routes.workflowService.getWorkflowById(id));
  }
  viewWorkflowById(id: any) {
    return this.http.get(routes.workflowService.viewWorkflowById(id));
  }
  updateWorkflowById(id: any, data: any) {
    return this.http.put(routes.workflowService.updateWorkflowById(id), data);
  }

  // entity master
  // createEntity(data: any) {
  //   return this.http.post(
  //     routes.entityMaster.createEntityMaster(),
  //     data
  //   );
  // }

  // updateEntity(data: any,id:any) {
  //   return this.http.put(
  //     routes.entityMaster.updateEntityMaster(id),
  //     data
  //   );
  // }

  // getEntity(id: any) {
  //   return this.http.get(
  //     routes.entityMaster.getEntityById(id),
  //   );
  // }

  // getEntityList(){
  //   return this.http.get(
  //     routes.entityMaster.entityList(),
  //   );
  // }

  // deleteEntity(id:any){
  //   return this.http.delete(
  //     routes.entityMaster.deleteEntity(id)
  //   )
  // }

  // updateEntityStatus(id:any,body:any){
  //   return this.http.post(
  //     routes.entityMaster.updateEntityStatus(id),
  //     body
  //   );
  // }

  // workflow for Rfp start ////
  createWorkflowRfp(data: any) {
    return this.http.post(routes.workflowServiceRfp.createWorkflowRfp(), data);
  }
  getAllworkflowRfpData() {
    return this.http.get(routes.workflowServiceRfp.getAllworkflowRfp());
  }
  getWorkflowRfpById(id: any) {
    return this.http.get(routes.workflowServiceRfp.getWorkflowRfpById(id));
  }
  updateWorkflowRfpById(id: any, data: any) {
    return this.http.put(
      routes.workflowServiceRfp.updateWorkflowRfpById(id),
      data,
    );
  }
  // Workflow for Rfp end ////

  // Quality Master
  createQuality(data: any) {
    return this.http.post(routes.qualityService.createQuality(), data);
  }
  getAllQualityData(id: any, f_id: any) {
    return this.http.get(routes.qualityService.getAllQuality(id, f_id));
  }
  getQualityById(id: any) {
    return this.http.get(routes.qualityService.getQualityId(id));
  }
  updateQualityById(id: any, data: any) {
    return this.http.put(routes.qualityService.updateQualityById(id), data);
  }
  updateStatusQuality(id: any, data: any) {
    return this.http.put(routes.qualityService.updateQualityStatus(id), data);
  }
  QualityDelete(id: any) {
    return this.http.delete(routes.qualityService.deleteQuality(id));
  }
  //Region
  createRegionMaster(data: any, entity_id: any): Observable<any> {
    return this.http.post(routes.RegionMaster.regionCreate(entity_id), data);
  }
  listRegion(entity_id: any): Observable<any> {
    return this.http.get(routes.RegionMaster.regionList(entity_id));
  }
  listRegionActive(entity_id: any): Observable<any> {
    return this.http.get(routes.RegionMaster.regionListActive(entity_id));
  }
  editRegion(region_id: any, data: any, entity_id: any): Observable<any> {
    return this.http.put(
      routes.RegionMaster.regionEdit(region_id, entity_id),
      data,
    );
  }
  updateRegionStatus(region_id: any, data: any): Observable<any> {
    return this.http.put(routes.RegionMaster.regionStatus(region_id), data);
  }
  getRegionById(region_id: any): Observable<any> {
    return this.http.get(routes.RegionMaster.getRegionById(region_id));
  }
  deleteRegion(region_id: any): Observable<any> {
    return this.http.delete(routes.RegionMaster.deleteRegion(region_id));
  }

  // Budget Category
  createBudgetCategoryMaster(data: any, entity_id: any): Observable<any> {
    return this.http.post(
      routes.BudgetCategory.budgetCategoryCreate(entity_id),
      data,
    );
  }
  listBudgetCategory(entity_id: any): Observable<any> {
    return this.http.get(routes.BudgetCategory.budgetCategoryList(entity_id));
  }
  listBudgetCategoryActive(entity_id: any): Observable<any> {
    return this.http.get(
      routes.BudgetCategory.budgetCategoryListActive(entity_id),
    );
  }
  updateBudgetCategory(id: any, data: any, entity_id: any): Observable<any> {
    return this.http.put(
      routes.BudgetCategory.updateBudgetCategory(id, entity_id),
      data,
    );
  }
  getBudgetCategoryById(id: any): Observable<any> {
    return this.http.get(routes.BudgetCategory.getBudgetCategoryById(id));
  }
  deleteBudgetCategory(id: any): Observable<any> {
    return this.http.delete(routes.BudgetCategory.deleteBudgetCategory(id));
  }

  // Type Of Expense
  createTypeOfExpenseMaster(data: any): Observable<any> {
    return this.http.post(routes.TypeOfExpense.typeOfExpenseCreate(), data);
  }
  listTypeOfExpenseCategory(): Observable<any> {
    return this.http.get(routes.TypeOfExpense.typeOfExpenseList());
  }
  listTypeOfExpenseCategoryActive(): Observable<any> {
    return this.http.get(routes.TypeOfExpense.typeOfExpenseListActive());
  }
  updateTypeOfExpenseCategory(id: any, data: any): Observable<any> {
    return this.http.put(routes.TypeOfExpense.updateTypeOfExpense(id), data);
  }
  getTypeOfExpenseById(id: any): Observable<any> {
    return this.http.get(routes.TypeOfExpense.getTypeOfExpenseById(id));
  }
  deleteTypeOfExpense(id: any): Observable<any> {
    return this.http.delete(routes.TypeOfExpense.deleteTypeOfExpense(id));
  }

  // Type Of Need
  createTypeOfNeedMaster(data: any): Observable<any> {
    return this.http.post(routes.TypeOfNeed.typeOfNeedCreate(), data);
  }
  listTypeOfNeed(): Observable<any> {
    return this.http.get(routes.TypeOfNeed.typeOfNeedList());
  }
  listTypeOfNeedActive(): Observable<any> {
    return this.http.get(routes.TypeOfNeed.typeOfNeedListActive());
  }
  updateTypeOfNeed(id: any, data: any): Observable<any> {
    return this.http.put(routes.TypeOfNeed.updateTypeOfNeed(id), data);
  }
  getTypeOfNeedById(id: any): Observable<any> {
    return this.http.get(routes.TypeOfNeed.getTypeOfNeedById(id));
  }
  deleteTypeOfNeed(id: any): Observable<any> {
    return this.http.delete(routes.TypeOfNeed.deleteTypeOfNeed(id));
  }
  //workflowJob//
  createWorkFlowJob(data: any) {
    return this.http.post(routes.wrokFlowJob.createWorkFlowJob(), data);
  }

  getAllWorkFlowJob(entity_id: any) {
    return this.http.get(routes.wrokFlowJob.getAllWorkFlowJob(entity_id));
  }
  getByWorkFlowJob(id: any) {
    return this.http.get(routes.wrokFlowJob.getByWorkFlowJob(id));
  }

  updateWorkFlowJob(id: any, data: any) {
    return this.http.put(routes.wrokFlowJob.updateWorkFlowJob(id), data);
  }

  getTypeRequest() {
    return this.http.get(routes.wrokFlowJob.getTypeRequest());
  }

  // allownce

  createAllownce(data: any) {
    return this.http.post(routes.allowance.createAllownce(), data);
  }

  getAllAllownce(req: any) {
    return this.http.get(routes.allowance.getAllAllownce(req));
  }

  get_all_employe(entity_id: any) {
    return this.http.get(routes.allowance.get_all_employe(entity_id));
  }

  updateStatus(id: any, data: any) {
    return this.http.put(routes.allowance.updateStatus(id), data);
  }
  deleteallowance(id: any): Observable<any> {
    return this.http.delete(routes.allowance.deleteallowance(id));
  }

  Allowance_Status(id: any, body: any) {
    return this.http
      .put<any>(`${databaseKey}/api/v1/Allowance_Status/${id}`, body)
      .pipe(
        map((response: any) => {
          return response;
        }),
      );
  }
  Allowance_Data_updateById(id: any, body: any) {
    return this.http
      .put<any>(`${databaseKey}/api/v1/Allowance_updateById/${id}`, body)
      .pipe(
        map((response: any) => {
          return response;
        }),
      );
  }
  allowanceGetByID(id: any): Observable<any> {
    return this.http.get(routes.allowance.allowanceGetByID(id));
  }

  // Seal Type
  // createSealTypeMaster(data: any): Observable<any> {
  //   return this.http.post(routes.SealType.sealTypeCreate(), data);
  // }
  // listSealType(): Observable<any> {
  //   return this.http.get(routes.SealType.sealTypeList());
  // }
  // listSealTypeActive(): Observable<any> {
  //   return this.http.get(routes.SealType.sealTypeListActive());
  // }
  // updateSealType(id: any, data: any): Observable<any> {
  //   return this.http.put(routes.SealType.updateSealType(id), data);
  // }
  // getSealTypeById(id: any): Observable<any> {
  //   return this.http.get(routes.SealType.getSealTypeById(id));
  // }
  // deleteSealType(id: any): Observable<any> {
  //   return this.http.delete(routes.SealType.deleteSealType(id));
  // }
  // uploadImg(file:any){
  // return this.http.post(databaseKey + '/uploadDoc',file)
  // }

  // Seal Type
  // customerCategoryService: {
  //   createCustomerCategory: () => `${databaseKey}/api/v1/createCustomerCategory'`,
  //   updateCustomerCategory: (id: any) => `${databaseKey}/api/v1/editCustomerCategory/${id}`,
  //   allCustomerCategory: () => `${databaseKey}/api/v1/getAllCustomerCategory`,
  //   getCustomerCategoryById: (id: any) => `${databaseKey}/api/v1/getByIdCustomerCategory/${id}`,
  //   removeCustomerCategory: (id: any) => `${databaseKey}/api/v1/deleteCustomerCategory/${id}`,
  //   updateCustomerCategoryStatus: (id: any) => `${databaseKey}/api/v1/updateStatusSubCategory/${id}`,
  //   fetchCustomerCategory: (id: any,obj:any) => `${databaseKey}/api/v1/getAllItemCategory/${id}`,
  //  }

  //Customer Category Master Start
  createCustomerCategory(data: any): Observable<any> {
    return this.http.post(
      routes.customerCategoryService.createCustomerCategory(),
      data,
    );
  }
  updateCustomerCategory(data: any, id: any): Observable<any> {
    return this.http.put(
      routes.customerCategoryService.updateCustomerCategory(id),
      data,
    );
  }
  allCustomerCategory(): Observable<any> {
    return this.http.get(routes.customerCategoryService.allCustomerCategory());
  }
  getCustomerCategoryById(id: any): Observable<any> {
    return this.http.get(
      routes.customerCategoryService.getCustomerCategoryById(id),
    );
  }
  removeCustomerCategory(id: any): Observable<any> {
    return this.http.delete(
      routes.customerCategoryService.removeCustomerCategory(id),
    );
  }

  updateCustomerCategoryStatus(id: any, body: any): Observable<any> {
    return this.http.put(
      routes.customerCategoryService.updateCustomerCategoryStatus(id),
      body,
    );
  }

  // Customer Category
  createSealTypeMaster(data: any): Observable<any> {
    return this.http.post(routes.SealType.sealTypeCreate(), data);
  }
  listSealType(): Observable<any> {
    return this.http.get(routes.SealType.sealTypeList());
  }
  listSealTypeActive(): Observable<any> {
    return this.http.get(routes.SealType.sealTypeListActive());
  }
  updateSealType(id: any, data: any): Observable<any> {
    return this.http.put(routes.SealType.updateSealType(id), data);
  }
  getSealTypeById(id: any): Observable<any> {
    return this.http.get(routes.SealType.getSealTypeById(id));
  }
  deleteSealType(id: any): Observable<any> {
    return this.http.delete(routes.SealType.deleteSealType(id));
  }
  uploadImg(file: any) {
    return this.http.post(databaseKey + '/uploadDoc', file);
  }
  ///product category

  //----------- product category-------------------
  getAllActiveCategory(id: any) {
    return this.http.get(routes.productCategory.getAllActiveCategory(id));
  }
  getAllActiveSubCategory(id: any) {
    return this.http.get(routes.productCategory.getAllActiveSubCategory(id));
  }
  getProductBycat_Id(id: any) {
    return this.http.get(routes.productCategory.getProductBycat_Id(id));
  }
  getProductVariantByproduct_id(id: any) {
    return this.http.get(
      routes.productCategory.getProductVariantByproduct_id(id),
    );
  }
  getByIdSubCategory(id: any) {
    return this.http.get(routes.productCategory.getByIdSubCategory(id));
  }
  deleteSubCategory(id: any) {
    return this.http.delete(routes.productCategory.deleteSubCategory(id));
  }
  createProductSubCategory(data: any) {
    return this.http.post(
      routes.productCategory.createProductSubCategory(),
      data,
    );
  }
  createConplain(data: any) {
    return this.http.post(routes.productCategory.createConplain(), data);
  }
  editProductSubCategory(id: any, data: any) {
    return this.http.put(
      routes.productCategory.editProductSubCategory(id),
      data,
    );
  }
  allProductSubCategory(): Observable<any> {
    return this.http.get(routes.productCategory.allProductSubCategory());
  }
  updateSubCategoryStatus(id: any, data: any) {
    return this.http.put(
      routes.productCategory.updateSubCategoryStatus(id),
      data,
    );
  }
  uploadDocuments(data: any) {
    return this.http.post(routes.productCategory.uploadDocuments(), data);
  }

  // ---------------
  createProductCategory(data: any): Observable<any> {
    return this.http.post(routes.productCategory.create(), data);
  }
  getAllCategory(id: any): Observable<any> {
    return this.http.get(routes.productCategory.list(id));
  }
  getCategoryById(product_id: number): Observable<any> {
    return this.http.get<any>(routes.productCategory.fetch(product_id));
  }
  deleteProduct(product_id: number): Observable<any> {
    return this.http.delete(routes.productCategory.delete(product_id));
  }
  editCategoryById(dept_id: number, data: string): Observable<any> {
    return this.http.put(routes.productCategory.productUpdate(dept_id), data);
  }
  statusUpdate(product_id: number, data: string): Observable<any> {
    return this.http.put(routes.productCategory.Update(product_id), data);
  }

  getAllSfgType(id: any) {
    return this.http.get(routes.productMasterService.getAllSfgType(id));
  }
  getSfgType(id: any) {
    return this.http.get(routes.productMasterService.getSfgType(id));
  }
  getAllActivePlant(id: any) {
    return this.http.get(routes.plant.getAllActivePlant(id));
  }

  createProductSchedule(data: any) {
    return this.http.post(routes.shiftService.createProductSchedule(), data);
  }
  getProductMasterListData() {
    return this.http.get(routes.productCategory.getAllProdutsData());
  }

  createComponentType(data: any): Observable<any> {
    return this.http.post(routes.componentType.create(), data);
  }
  getComponentType(): Observable<any> {
    return this.http.get(routes.componentType.list());
  }
  getComponentTypeActive(): Observable<any> {
    return this.http.get(routes.componentType.listActive());
  }
  updateComponentType(com_id: any, body: any): Observable<any> {
    return this.http.put<any>(routes.componentType.updateCom(com_id), body);
  }
  componenetTypeById(com_id: any): Observable<any> {
    return this.http.get(routes.componentType.byId(com_id));
  }
  deleteComponentTypeById(com_id: any): Observable<any> {
    return this.http.delete(routes.componentType.delete(com_id));
  }
  componentTypeStatusById(com_id: any, body: any): Observable<any> {
    return this.http.put(routes.componentType.status(com_id), body);
  }

  //Dynamic Form
  createDynamicFormField(data: any): Observable<any> {
    return this.http.post(routes.dynamicForm.create(), data);
  }
  getDynamicFormFieldList(id: any): Observable<any> {
    return this.http.get(routes.dynamicForm.list(id));
  }
  getAllDynamicFormFieldList(): Observable<any> {
    return this.http.get(routes.dynamicForm.allList());
  }
  updateDynamicFormField(body: any): Observable<any> {
    return this.http.put<any>(routes.dynamicForm.update(), body);
  }
  dropDownList(id: any, body: any): Observable<any> {
    return this.http.put(routes.dynamicForm.dropDownList(id), body);
  }
  getDynamicFormDetails(id: any): Observable<any> {
    return this.http.get(routes.dynamicForm.getDynamicFormFields(id));
  }
  getStatusName(id: any): Observable<any> {
    return this.http.get(routes.dynamicForm.getStatus(id));
  }

  //lead
  getAllSource(entity_id: any, finance_year_id: any): Observable<any> {
    return this.http.get(routes.lead.getAllSource(entity_id, finance_year_id));
  }

  ///issue master
  createIssue(data: any): Observable<any> {
    return this.http.post(routes.issue.createIssue(), data);
  }
  getallIssueType(entity_id: any, financial_year_id: any): Observable<any> {
    return this.http.get(
      routes.issue.getIssuetype(entity_id, financial_year_id),
    );
  }
  changeIssue_Status(data: any): Observable<any> {
    return this.http.put(routes.issue.changeIssue_Status(), data);
  }
  getIssueby_Id(id: any): Observable<any> {
    return this.http.get(routes.issue.getIssueby_Id(id));
  }
  update_Issue(id: any, data: any): Observable<any> {
    return this.http.put(routes.issue.update_Issue(id), data);
  }

  /// maintenace
  create_maintenance_master(data: any): Observable<any> {
    return this.http.post(routes.maintenance.createmaintenance_check(), data);
  }
  getAll_Maintenance_check(
    entity_id: any,
    financial_year_id: any,
  ): Observable<any> {
    return this.http.get(
      routes.maintenance.getAll_Maintenance_check(entity_id, financial_year_id),
    );
  }
  // servicecenter master start -->
  getServicecenterMasterList(entity_id: any) {
    return this.http.get(
      routes.servicecenterMaster.servicecentersMaster_List(entity_id),
    );
  }
  getOpenComplainList() {
    return this.http.get(routes.servicecenterMaster.getOpenComplainList());
  }
  resolve_complainList() {
    return this.http.get(routes.servicecenterMaster.resolve_complainList());
  }
  getOpenComplainList2(entity_id: any) {
    return this.http.get(
      routes.servicecenterMaster.getOpenComplainList2(entity_id),
    );
  }
  complainlistbyservicecenter(service_center_id: any) {
    return this.http.get(
      routes.servicecenterMaster.complainlistbyservicecenter(service_center_id),
    );
  }

  getAssignComplainList(entity_id: any) {
    return this.http.get(
      routes.servicecenterMaster.getAssignComplainList(entity_id),
    );
  }
  getActiveCetegory() {
    return this.http.get(routes.servicecenterMaster.getActiveCetegory());
  }
  getComplainStatusList() {
    return this.http.get(routes.servicecenterMaster.getComplainStatusList());
  }
  getItem(id: any) {
    return this.http.get(routes.servicecenterMaster.getItem(id));
  }
  createServicecenterMaster(data: any) {
    return this.http.post(
      routes.servicecenterMaster.servicecenterMaster_create(),
      data,
    );
  }

  updateServicecenterMaster(id: any, data: any) {
    return this.http.put(
      routes.servicecenterMaster.servicecenterMaster_update(id),
      data,
    );
  }
  assignServiceCenter(data: any) {
    return this.http.put(
      routes.servicecenterMaster.assignServiceCenter(),
      data,
    );
  }

  getByIdServicecenterMaster(id: any) {
    return this.http.get(
      routes.servicecenterMaster.servicecenterMasterGetById(id),
    );
  }
  getregistercomplainbyid(id: any) {
    return this.http.get(
      routes.servicecenterMaster.getregistercomplainbyid(id),
    );
  }

  deleteServicecenterMaster(id: any) {
    return this.http.delete(
      routes.servicecenterMaster.servicecenterMasterDelete(id),
    );
  }

  statuseServicecenterMasterById(id: any, formData: any) {
    return this.http.put(routes.servicecenterMaster.statusById(id), formData);
  }
  openupdatecomplaindetails(id: any, data: any) {
    return this.http.put(
      routes.servicecenterMaster.open_updatecomplaindetail(id),
      data,
    );
  }
  // servicecenter master end -->
  getTodaysLog() {
    return this.http.get(routes.crmServiceDashboard.getTodaysLog());
  }
  getDataCardData() {
    return this.http.get(routes.crmServiceDashboard.getDataCardData());
  }

  getGSTRate() {
    return this.http.get(routes.hsnSacMaster.getGSTRate());
  }

  create_hsn_sac(data: any) {
    return this.http.post(routes.hsnSacMaster.create_hsn_sac(), data);
  }

  getHsnSacList() {
    return this.http.get(routes.hsnSacMaster.getHsnSacList());
  }

  getHsnSacById(id: any) {
    return this.http.get(routes.hsnSacMaster.getHsnSacById(id));
  }
  delete_HSN_SAC(id: any) {
    return this.http.delete(routes.hsnSacMaster.delete_HSN_SAC(id));
  }
  getSacCode(id: any) {
    return this.http.get(routes.serviceMasterService.getSacCode(id));
  }

  getHSNCode(id: any, code_type: string = 'HSN') {
    return this.http.get(routes.serviceMasterService.getHSNCode(id, code_type));
  }
  ////complaint
  create_complaint_type(data: any): Observable<any> {
    return this.http.post(routes.complaint.create_complaint_type(), data);
  }

  get_all_complaint_type(
    entity_id: any,
    financial_year_id: any,
  ): Observable<any> {
    return this.http.get(
      routes.complaint.get_all_complaint_type(entity_id, financial_year_id),
    );
  }
  get_all_complaint_typeActive(
    entity_id: any,
    financial_year_id: any,
  ): Observable<any> {
    return this.http.get(
      routes.complaint.get_all_complaint_typeActive(
        entity_id,
        financial_year_id,
      ),
    );
  }
  get_complaint_type_byId(id: any): Observable<any> {
    return this.http.get(routes.complaint.get_complaint_type_byId(id));
  }
  getall_employeeby_dept_id(id: any): Observable<any> {
    return this.http.get(routes.complaint.getall_employeeby_dept_id(id));
  }
  update_complaint_type(data: any): Observable<any> {
    return this.http.put(routes.complaint.update_complaint_type(), data);
  }
  changecomplaint_Status(data: any): Observable<any> {
    return this.http.put(routes.complaint.changeIssue_Status(), data);
  }

  // Vat master start
  create_vat_name(body: any): Observable<any> {
    return this.http.post(routes.vatMaster.create_vat_name(), body);
  }
  get_All_VAT(): Observable<any> {
    return this.http.get(routes.vatMaster.get_All_VAT());
  }
  get_VATById(id: any): Observable<any> {
    return this.http.get(routes.vatMaster.get_VATById(id));
  }
  delete_VATById(id: any): Observable<any> {
    return this.http.delete(routes.vatMaster.delete_VATById(id));
  }
  VAT_Status(id: any, body: any): Observable<any> {
    return this.http.put(routes.vatMaster.VAT_Status(id), body);
  }
  get_Active_VATS(): Observable<any> {
    return this.http.get(routes.vatMaster.get_Active_VATS());
  }

  //scheme master

  createScheme(body: any): Observable<any> {
    return this.http.post(routes.schemeMaster.createScheme(), body);
  }
  getAllScheme(): Observable<any> {
    return this.http.get(routes.schemeMaster.getAllScheme());
  }
  getByIdScheme(id: any): Observable<any> {
    return this.http.get(routes.schemeMaster.getById(id));
  }
  updateScheme(id: any, body: any): Observable<any> {
    return this.http.put(routes.schemeMaster.updateScheme(id), body);
  }
  getItemName(
    categoryId: number,
    subCategoryId: number,
    item_type_id?: number,
  ) {
    let url = routes.itemService.getItemName(categoryId, subCategoryId);
    if (item_type_id) {
      url += `?item_type_id=${item_type_id}`;
    }
    return this.http.get<ItemResponseInterface>(url);
  }

  statusSchemeUpdate(id: any, data: any) {
    return this.http.put(routes.schemeMaster.statusSchemeUpdate(id), data);
  }

  deleteScheme(id: any): Observable<any> {
    return this.http.delete(routes.schemeMaster.deleteScheme(id));
  }
  getPriceMasterList(entity_id: any): Observable<any> {
    return this.http.get(routes.priceMaster.getListing(entity_id));
  }

  updatePriceStatus(id: any, body: any): Observable<any> {
    return this.http.put(routes.priceMaster.updateStatus(id), body);
  }

  deletePriceList(id: any): Observable<any> {
    return this.http.delete(routes.priceMaster.delete(id));
  }

  createPriceMaster(data: any): Observable<any> {
    return this.http.post(routes.priceMaster.create(), data);
  }

  updatePriceMaster(data: any, id: any): Observable<any> {
    return this.http.put(routes.priceMaster.update(id), data);
  }

  getPriceMasterById(id: any): Observable<any> {
    return this.http.get(routes.priceMaster.getById(id));
  }

  getEmployeeByLocationId(entity_id: any, location_id: any) {
    return this.http.get(
      routes.plant.getEmployeeByLocationId(entity_id, location_id),
    );
  }

  // additionalCharge _Master
  createAdditionalCharge(data: any): Observable<any> {
    return this.http.post(
      routes.additionalCharge.additionalCharge_create(),
      data,
    );
  }

  getAdditionalList(entity_id: any, financial_id: any): Observable<any> {
    return this.http.get(
      routes.additionalCharge.additionalCharge_list(entity_id, financial_id),
    );
  }
  additionalCharge_getById(id: any): Observable<any> {
    return this.http.get(routes.additionalCharge.additionalCharge_getById(id));
  }

  additionalCharge_update(id: any, data: any): Observable<any> {
    return this.http.put(
      routes.additionalCharge.additionalCharge_update(id),
      data,
    );
  }
  create_expense_category(data: any): Observable<any> {
    return this.http.post(
      routes.expense_master.create_expense_category(),
      data,
    );
  }
  getAlltripExpenseMaster(): Observable<any> {
    return this.http.get(routes.expense_master.getAlltripExpenseMaster());
  }
  getTripExpenseCategoryById(id: any): Observable<any> {
    return this.http.get(routes.expense_master.getTripExpenseCategoryById(id));
  }
  updateTripExpenseCategory(id: any, data: any): Observable<any> {
    return this.http.put(
      routes.expense_master.updateTripExpenseCategory(id),
      data,
    );
  }
  deleteTripExpenseCategory(id: any): Observable<any> {
    return this.http.delete(
      routes.expense_master.deleteTripExpenseCategory(id),
    );
  }
  TripstatusUpdate(id: any, body: any): Observable<any> {
    return this.http.put(routes.expense_master.TripstatusUpdate(id), body);
  }

  additionalCharge_delete(id: any): Observable<any> {
    return this.http.delete(
      routes.additionalCharge.additionalCharge_delete(id),
    );
  }
  additionalCharge_status(id: any, body: any): Observable<any> {
    return this.http.put(
      routes.additionalCharge.additionalCharge_status(id),
      body,
    );
  }

  exportExcel(jsonData: any[], fileName: string): void {
    if (!jsonData || jsonData.length === 0) return;

    // 1. Format headers
    const formattedData = jsonData.map((obj) => {
      const newObj: any = {};
      Object.keys(obj).forEach((key) => {
        const newKey = key
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        newObj[newKey] = obj[key];
      });
      return newObj;
    });

    // 2. Generate Excel
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    FileSaver.saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }

  getAllVoucherData(entity_id: any) {
    return this.http.get(routes.voucherMaster.getAllVoucher(entity_id));
  }

  generateSeries(input: any) {
    return this.http.get(routes.voucherMaster.generateSeries(input));
  }
  createVoucherData(data: any) {
    return this.http.post(routes.voucherMaster.createVoucherData(), data);
  }
  getVoucherById(id: any) {
    return this.http.get(routes.voucherMaster.getVoucherById(id));
  }
  deleteVoucherById(id: any) {
    return this.http.delete(routes.voucherMaster.deleteVoucherById(id));
  }
  deleteBankRecieptVoucherById(id: any) {
    return this.http.delete(
      routes.bankRecieptVoucher.deleteBankRecieptVoucherById(id),
    );
  }
  downloadBankRecieptById(id: any): Observable<ArrayBuffer> {
    return this.http.get(routes.bankRecieptVoucher.downloadBankRecieptById(id), {
      responseType: 'arraybuffer'
    });
  }
  downloadBankPaymentById(id: any): Observable<ArrayBuffer> {
    return this.http.get(routes.bankPaymentVoucher.downloadBankPaymentById(id), {
      responseType: 'arraybuffer'
    });
  }
  downloadCashPaymentById(id: any): Observable<ArrayBuffer> {
    return this.http.get(routes.bankPaymentVoucher.downloadCashPaymentById(id), {
      responseType: 'arraybuffer'
    });
  } 
  downloadPaymentAdviceById(id: any): Observable<ArrayBuffer> {
    return this.http.get(routes.bankPaymentVoucher.downloadPaymentAdviceById(id), {
      responseType: 'arraybuffer'
    });
  }
  updateVoucherByID(id: any, data: any) {
    return this.http.put(routes.voucherMaster.updateVoucherByID(id), data);
  }
  paymentAdviceVoucher(entity_id: any) {
    return this.http.get(
      routes.paymentAdviceVoucher.getAllPaymentAdviceVoucher(entity_id),
    );
  }
  generateSeriesPaymentAdvice(input: any) {
    return this.http.get(
      routes.paymentAdviceVoucher.generateSeriesPaymentAdvice(input),
    );
  }

  generateSeriesBankRecieptVoucher(input: any) {
    return this.http.get(
      routes.bankRecieptVoucher.generateSeriesBankRecieptVoucher(input),
    );
  }

  createPaymentVoucherData(data: any) {
    return this.http.post(
      routes.paymentAdviceVoucher.createPaymentVoucherData(),
      data,
    );
  }

  createBankRecieptVoucherData(data: any) {
    return this.http.post(
      routes.bankRecieptVoucher.createBankRecieptVoucherData(),
      data,
    );
  }
  deletePaymentAdviceData(id: any) {
    return this.http.delete(
      routes.paymentAdviceVoucher.deletePaymentAdviceData(id),
    );
  }

  getPaymentVoucherData(id: any) {
    return this.http.get(routes.paymentAdviceVoucher.getPaymentVoucherData(id));
  }
  getBankRecieptVoucherData(id: any) {
    return this.http.get(
      routes.bankRecieptVoucher.getBankRecieptVoucherData(id),
    );
  }

  updatePaymentVoucherData(id: any, data: any) {
    return this.http.put(
      routes.paymentAdviceVoucher.updatePaymentVoucherData(id),
      data,
    );
  }
  updateBankRecieptVoucherData(id: any, data: any) {
    return this.http.put(
      routes.bankRecieptVoucher.updateBankRecieptVoucherData(id),
      data,
    );
  }

  getAllBankRecieptVoucher(entity_id: any) {
    return this.http.get(
      routes.bankRecieptVoucher.getAllBankRecieptVoucher(entity_id),
    );
  }

  generateSeriesBankPaymentVoucher(input: any) {
    return this.http.get(
      routes.bankPaymentVoucher.generateSeriesBankPaymentVoucher(input),
    );
  }
  createBankPaymentVoucherData(data: any) {
    return this.http.post(
      routes.bankPaymentVoucher.createBankPaymentVoucherData(),
      data,
    );
  }
  getBankPaymentVoucherDataById(id: any) {
    return this.http.get(
      routes.bankPaymentVoucher.getBankPaymentVoucherDataById(id),
    );
  }
  getAllBankPaymentVoucher(entity_id: any) {
    return this.http.get(
      routes.bankPaymentVoucher.getAllBankPaymentVoucher(entity_id),
    );
  }
  deleteBankPaymentVoucherById(id: any) {
    return this.http.delete(
      routes.bankPaymentVoucher.deleteBankPaymentVoucherById(id),
    );
  }
  updateBankPaymentVoucherData(id: any, data: any) {
    return this.http.put(
      routes.bankPaymentVoucher.updateBankPaymentVoucherData(id),
      data,
    );
  }

  //Customer Approval
  saveCustomerApproval(data: any) {
    return this.http.post(routes.customerApproval.saveCustomerApproval(), data);
  }
  getAllCustomerApproval() {
    return this.http.get(routes.customerApproval.getAllCustomerApproval());
  }
  get_customer_approvalById(id: string) {
    return this.http.get(routes.customerApproval.get_customer_approvalById(id));
  }
  updateCustomerApprovalById(id: string, data: any) {
    return this.http.put(
      routes.customerApproval.updateCustomerApprovalById(id),
      data,
    );
  }

  deleteCustomerApprovalById(id: any) {
    return this.http.delete(
      routes.customerApproval.deleteCustomerApprovalById(id),
    );
  }

  getEmployeeListForAll(approval_option: any) {
    return this.http.get(routes.customerApproval.employList(approval_option));
  }

  //Employee Map with level
  createLevelEmployee(data: any) {
    return this.http.post(routes.empLevelMapping.createLevelEmployee(), data);
  }
  getAllEmpMappingLevel() {
    return this.http.get(routes.empLevelMapping.getAllEmpMappingLevel());
  }
  get_EmpMappingLevelById(id: string) {
    return this.http.get(routes.empLevelMapping.get_EmpMappingLevelById(id));
  }
  updateLevelEmployee(id: string, data: any) {
    return this.http.put(routes.empLevelMapping.updateLevelEmployee(id), data);
  }
  getEmployeeListForMapLevel() {
    return this.http.get(routes.empLevelMapping.getEmployeeListForMapLevel());
  }

  deleteEmpMapLevelById(id: any) {
    return this.http.delete(routes.empLevelMapping.deleteEmpMapLevelById(id));
  }

  //Quotation Approval apis
  saveQuotationApproval(data: any) {
    return this.http.post(
      routes.quotationApproval.saveQuotationApproval(),
      data,
    );
  }
  getAllQuotationApproval() {
    return this.http.get(routes.quotationApproval.getAllQuotationApproval());
  }
  get_quotationApprovalById(id: string) {
    return this.http.get(
      routes.quotationApproval.get_quotationApprovalById(id),
    );
  }
  updateQuotationApprovalById(id: string, data: any) {
    return this.http.put(
      routes.quotationApproval.updateQuotationApprovalById(id),
      data,
    );
  }
  getAllSub_Category() {
    return this.http.get(routes.quotationApproval.getAllSub_Category());
  }
  deleteQuotationApprovalById(id: any) {
    return this.http.delete(
      routes.quotationApproval.deleteQuotationApprovalById(id),
    );
  }

  //Credit limit apis
  createCreditLimit(payload: any): Observable<any> {
    return this.http.post(routes.creditLimit.createCreditLimit(), payload);
  }
  updateCreditLimit(payload: any): Observable<any> {
    return this.http.put(routes.creditLimit.updateCreditLimit(), payload);
  }
  getAllCreditLimits() {
    return this.http.get(routes.creditLimit.getAllCreditLimits());
  }

  //Saction Credit limit apis
  createSanctionCreditLimit(payload: any): Observable<any> {
    return this.http.post(
      routes.sanctionCreditLimit.createSanctionCreditLimit(),
      payload,
    );
  }
  updateSanctionCreditLimit(payload: any): Observable<any> {
    return this.http.put(
      routes.sanctionCreditLimit.updateSanctionCreditLimit(),
      payload,
    );
  }
  getAllSanctionCreditLimits() {
    return this.http.get(
      routes.sanctionCreditLimit.getAllSanctionCreditLimits(),
    );
  }

  // Update existing record
  // updateCreditLimit(id: number, payload: CreditLimit[]): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/${id}`, payload);
  // }

  // Propsal Type
  getProposalType() {
    return this.http.get(routes.proposalType.getProposalType());
  }
  createProposalType(data: any) {
    return this.http.post(routes.proposalType.createProposalType(), data);
  }
  updateProposalTypeById(id: string, data: any) {
    return this.http.put(routes.proposalType.updateProposalTypeById(id), data);
  }
  getProposalTypeById(id: string) {
    return this.http.get(routes.proposalType.getProposalTypeById(id));
  }
  deleteProposalTypeById(id: string) {
    return this.http.delete(routes.proposalType.deleteProposalTypeById(id));
  }
  getActiveProposalType() {
    return this.http.get(routes.proposalType.getActiveProposalType());
  }
  getExpectedDay() {
    return this.http.get<any>(`${databaseKey}/api/v1/getExpectedDay`).pipe(
      map((response: any) => {
        return response;
      }),
    );
  }
  createExpectedDays(body: any) {
    return this.http
      .post<any>(`${databaseKey}/api/v1/createExpectedDays`, body)
      .pipe(
        map((response: any) => {
          return response;
        }),
      );
  }
  updateExpectedDeliveryDays(id: any, body: any) {
    return this.http
      .patch<any>(
        `${databaseKey}/api/v1/updateExpectedDeliveryDays/${id}`,
        body,
      )
      .pipe(
        map((response: any) => {
          return response;
        }),
      );
  }
  createTDSData(data: any) {
    return this.http.post(routes.tdsMaster.createTDSData(), data);
  }
  getAllTdsData(entity_id: any) {
    return this.http.get(routes.tdsMaster.getAllTdsData(entity_id));
  }
  getTdsDataById(id: any) {
    return this.http.get(routes.tdsMaster.getTdsDataById(id));
  }
  updateTdsData(data: any) {
    return this.http.put(routes.tdsMaster.updateTdsData(), data);
  }
  deleteTDSById(id: any) {
    return this.http.put(routes.tdsMaster.deleteTDSById(id), data);
  }
  getTdsDataByIdVendor(id: any) {
    return this.http.get(routes.tdsMaster.getTdsDataByIdVendor(id));
  }

  // Travel Master
  addTravelType(data: any) {
    return this.http.post(routes.travelType.createTravelType(), data);
  }

  getAllTravelType(type: string) {
    return this.http.get(routes.travelType.getAllTravelType(type));
  }

  getTravelTypeById(id: any) {
    return this.http.get(routes.travelType.getTravelTypeById(id));
  }

  deleteTravelType(id: any) {
    return this.http.delete(routes.travelType.deleteTravelType(id));
  }

  addTravelBudget(data: any) {
    return this.http.post(routes.travelType.addTravelBudget(), data);
  }

  addReimbursementBudget(data: any) {
    return this.http.post(routes.travelType.addReimbursementBudget(), data);
  }

  getAllTravelBudget() {
    return this.http.get(routes.travelType.getAllTravelBudget());
  }

  getAllReimbursementBudget() {
    return this.http.get(routes.travelType.getAllReimbursementBudget());
  }

  getTravelBudgetById(id: any) {
    return this.http.get(routes.travelType.getTravelBudgetById(id));
  }

  deleteTravelBudget(id: any) {
    return this.http.delete(routes.travelType.deleteTravelBudget(id));
  }

  // getAllBankRecieptVoucher(entity_id:any){
  //   return this.http.get(routes.bankRecieptVoucher.getAllBankRecieptVoucher(entity_id))
  // }

  // generateSeriesBankPaymentVoucher(input:any){
  //   return this.http.get(routes.bankPaymentVoucher.generateSeriesBankPaymentVoucher(input))
  // }
  // createBankPaymentVoucherData(data:any){
  //   return this.http.post(routes.bankPaymentVoucher.createBankPaymentVoucherData(),data)
  // }
  // getBankPaymentVoucherDataById(id:any){
  //   return this.http.get(routes.bankPaymentVoucher.getBankPaymentVoucherDataById(id))
  // }
  // getAllBankPaymentVoucher(entity_id:any){
  //   return this.http.get(routes.bankPaymentVoucher.getAllBankPaymentVoucher(entity_id))
  // }
  // deleteBankPaymentVoucherById(id:any){
  //   return this.http.delete(routes.bankPaymentVoucher.deleteBankPaymentVoucherById(id))
  // }
  // updateBankPaymentVoucherData(id:any,data:any){
  //   return this.http.put(routes.bankPaymentVoucher.updateBankPaymentVoucherData(id),data)
  // }

  // Propsal Type
  // getProposalType() {
  //   return this.http.get(routes.proposalType.getProposalType());
  // }
  // createProposalType(data: any) {
  //   return this.http.post(routes.proposalType.createProposalType(), data);
  // }
  // updateProposalTypeById(id: string, data: any) {
  //   return this.http.put(routes.proposalType.updateProposalTypeById(id), data);
  // }
  // getProposalTypeById(id: string) {
  //   return this.http.get(routes.proposalType.getProposalTypeById(id));
  // }
  // deleteProposalTypeById(id: string) {
  //   return this.http.delete(routes.proposalType.deleteProposalTypeById(id));
  // }
  // getActiveProposalType() {
  //   return this.http.get(routes.proposalType.getActiveProposalType());
  // }
  // getExpectedDay() {
  //   return this.http.get<any>(`${databaseKey}/api/v1/getExpectedDay`).pipe(
  //     map((response: any) => { return response })
  //   );
  // }
  // createExpectedDays(body: any) {
  //   return this.http.post<any>(`${databaseKey}/api/v1/createExpectedDays`, body).pipe(
  //     map((response: any) => { return response })
  //   );
  // }
  // updateExpectedDeliveryDays(id:any,body: any) {
  //   return this.http.patch<any>(`${databaseKey}/api/v1/updateExpectedDeliveryDays/${id}`, body).pipe(
  //     map((response: any) => { return response })
  //   );
  // }
  // createTDSData(data:any){
  //   return this.http.post(routes.tdsMaster.createTDSData(),data)
  // }

  // getAllTdsData(entity_id:any){
  //   return this.http.get(routes.tdsMaster.getAllTdsData(entity_id))
  // }
  // getTdsDataById(id:any){
  //   return this.http.get(routes.tdsMaster.getTdsDataById(id))
  // }
  // updateTdsData(data:any){
  //   return this.http.put(routes.tdsMaster.updateTdsData(),data)
  // }

  // deleteTDSById(id:any){
  //   return this.http.put(routes.tdsMaster.deleteTDSById(id),data)
  // }
  // getTdsDataByIdVendor(id:any){
  //   return this.http.get(routes.tdsMaster.getTdsDataByIdVendor(id))
  // }
  getAllVoucherDataMain() {
    return this.http.get(routes.mainVoucherList.getAllVoucherData());
  }
  createVoucherList(data: any) {
    return this.http.post(routes.mainVoucherList.createVoucherList(), data);
  }
  getAllVoucherListData(id: any) {
    return this.http.get(routes.mainVoucherList.getAllVoucherListData(id));
  }
  getAllVoucherById(id: any) {
    return this.http.get(routes.mainVoucherList.getAllVoucherById(id));
  }
  updateVoucherTypeData(data: any) {
    return this.http.put(routes.mainVoucherList.updateVoucherTypeData(), data);
  }
  getVouchersByID(id: any, entity_id: any) {
    return this.http.get(routes.mainVoucherList.getVouchersByID(id, entity_id));
  }

  uploadDocument(data: any): Observable<HttpEvent<any>> {
    return this.http.post(routes.productCategory.uploadDocument(), data, {
      reportProgress: true,
      observe: 'events',
    });
  }

  createAccessory(data: any) {
    return this.http.post(routes.accessoryMaster.createAccessory(), data);
  }

  getAllAccessory(financial_year_id: any, entity_id: any) {
    return this.http.get(
      routes.accessoryMaster.getAllAccessory(financial_year_id, entity_id),
    );
  }

  getByAccessory(id: any, asset_id?: any, sub_category_id?: any) {
    let url = routes.accessoryMaster.getByAccessory(id);
    if (asset_id && sub_category_id) {
      url += `?asset_id=${asset_id}&sub_category_id=${sub_category_id}`;
    }
    return this.http.get(url);
  }
  deleteAccessory(id: any, asset_id?: any, sub_category_id?: any) {
    let url = routes.accessoryMaster.deleteAccessory(id);
    if (asset_id && sub_category_id) {
      url += `?asset_id=${asset_id}&sub_category_id=${sub_category_id}`;
    }
    return this.http.delete(url);
  }
  getActiveAccessory(financial_year_id: any, entity_id: any) {
    return this.http.get(
      routes.accessoryMaster.getActiveAccessory(financial_year_id, entity_id),
    );
  }

  updateAccessoryMaster(data: any) {
    return this.http.put(routes.accessoryMaster.updateAccessoryMaster(), data);
  }

  //For branding master
  createBrandingMaster(data: any) {
    return this.http.post(routes.brandingMaster.createBrandingMaster(), data);
  }

  getAllbranding() {
    return this.http.get(routes.brandingMaster.getAllbranding());
  }
  getBrandingWithCustomerItem(client_id: any, data: any) {
    return this.http.get(
      routes.brandingMaster.getBrandingWithCustomerItem(client_id, data),
    );
  }

  getById_brandingMaster(id: any) {
    return this.http.get(routes.brandingMaster.getById_brandingMaster(id));
  }

  updateBrandingMaster(id: any, data: any) {
    return this.http.put(routes.brandingMaster.updateBrandingMaster(id), data);
  }

  deleteBranding(id: any) {
    return this.http.delete(routes.brandingMaster.deleteBranding(id));
  }

  // basket master

  createBasket(data: any) {
    return this.http.post(routes.basketMaster.createBasket(), data);
  }

  getAllBasket(entity_id: any) {
    return this.http.get(routes.basketMaster.getAllBasket(entity_id));
  }

  getById_basketMaster(id: any) {
    return this.http.get(routes.basketMaster.getById_basketMaster(id));
  }

  updateBasketMaster(id: any, data: any) {
    return this.http.put(routes.basketMaster.updateBasketMaster(id), data);
  }

  deleteBasket(id: any) {
    return this.http.delete(routes.basketMaster.deleteBasket(id));
  }

  customerlistBycustomertype(id: any) {
    return this.http.get(routes.priceMaster.customerlistBycustomertype(id));
  }

  get_GST_Type() {
    return this.http.get(routes.GSTMapping.get_GST_Type());
  }

  addGSTGlMapping(data: any) {
    return this.http.post(routes.GSTMapping.addGSTGlMapping(), data);
  }

  get_GST_GL_Mapping_List(entity_id: any) {
    return this.http.get(routes.GSTMapping.get_GST_GL_Mapping_List(entity_id));
  }

  get_GST_GL_Mapping_By_Id(id: any) {
    return this.http.get(routes.GSTMapping.get_GST_GL_Mapping_By_Id(id));
  }

  updateGstGlMapping(id: any, data: any): Observable<any> {
    return this.http.put(routes.GSTMapping.updateGstGlMapping(id), data);
  }

  deleteGstGlMappingById(id: any): Observable<any> {
    return this.http.delete(routes.GSTMapping.deleteGstGlMappingById(id));
  }

  get_mapped_sales_gl(id: any): Observable<any> {
    return this.http.get(routes.GSTMapping.get_mapped_sales_gl(id));
  }
  financialTransactionIntegration(module_id: any) {
    return this.http.get(
      routes.financialTransactionIntegration.getSubModulesData(module_id),
    );
  }
  item_cost_category(data: any) {
    return this.http.post(
      routes.financialTransactionIntegration.item_cost_category(),
      data,
    );
  }
  getAllItemcostCategory() {
    return this.http.get(
      routes.financialTransactionIntegration.getAllItemcostCategory(),
    );
  }
  // getAllVoucherListData(id: any) {
  //   return this.http.get(routes.mainVoucherList.getAllVoucherListData(id));
  // }
  // getAllVoucherById(id: any) {
  //   return this.http.get(routes.mainVoucherList.getAllVoucherById(id));
  // }
  // updateVoucherTypeData(data: any) {
  //   return this.http.put(routes.mainVoucherList.updateVoucherTypeData(), data);
  // }
  // getVouchersByID(id: any, entity_id: any) {
  //   return this.http.get(routes.mainVoucherList.getVouchersByID(id, entity_id));
  // }

  createZoneType(data: any) {
    return this.http.post(routes.zoneTypeMaster.createZoneType(), data);
  }
  getFinacialTransactionIntegrationList() {
    return this.http.get(
      routes.financialTransactionIntegration.getFinacialTransactionIntegrationList(),
    );
  }

  zoneTypeList() {
    return this.http.get(routes.zoneTypeMaster.getZoneTypeList());
  }

  zoneTypeById(id: any) {
    return this.http.get(routes.zoneTypeMaster.getZoneTypeById(id));
  }
  getfinancialTransactionsById(module_id: any, module_master_id: any) {
    return this.http.get(
      routes.financialTransactionIntegration.getfinancialTransactionsById(
        module_id,
        module_master_id,
      ),
    );
  }
  getVendorBillingList(entity_id: any) {
    return this.http.get(
      routes.getBillingShippingAddress.getVendorBillingList(entity_id),
    );
  }

  updateZoneType(id: any, data: any): Observable<any> {
    return this.http.patch(routes.zoneTypeMaster.updateZoneType(id), data);
  }

  deletezoneTypeById(id: any): Observable<any> {
    return this.http.delete(routes.zoneTypeMaster.deletezoneTypeById(id));
  }

  getPaymentTermMasterList(entity_id: any, status: any) {
    let url = `${databaseKey}/api/v1/getPaymentTermMasterList?entity_id=${entity_id}&status=${status}`;
    return this.http.get<any>(url);
  }

  createPaymentTermMaster(data: any): Observable<any> {
    return this.http.post<any>(`${databaseKey}/api/v1/createPaymentTermMaster`, data);
  }

  updatePaymentTermMaster(id: any, data: any): Observable<any> {
    return this.http.put<any>(`${databaseKey}/api/v1/updatePaymentTermMaster/${id}`, data);
  }

  deletePaymentTermMaster(id: any): Observable<any> {
    return this.http.delete<any>(`${databaseKey}/api/v1/deletePaymentTermMaster/${id}`);
  }

  getPaymentTermMasterById(id: any): Observable<any> {
    return this.http.get<any>(`${databaseKey}/api/v1/getPaymentTermMasterById/${id}`);
  }

  createUpdate_customerCreditLimit(data: any): Observable<any> {
    return this.http.post<any>(
      `${databaseKey}/api/v1/createUpdate_customerCreditLimit`,
      data,
    );
  }

  getCreditLimitListByCustomerId(entity_id: any, customer_id: any) {
    let url = `${databaseKey}/api/v1/getCreditLimitListByCustomerId?entity_id=${entity_id}&customer_id=${customer_id}`;
    return this.http.get<any>(url);
  }

  getItemListForBOM(entity_id: any) {
    return this.http.get<any>(
      `${databaseKey}/api/v1/getItemListForBOM?entity_id=${entity_id}`,
    );
  }

  getBOMList(entity_id: any) {
    return this.http.get<any>(
      `${databaseKey}/api/v1/getBOMList?entity_id=${entity_id}`,
    );
  }

  createUpdateBOM(data: any): Observable<any> {
    return this.http.post<any>(`${databaseKey}/api/v1/createUpdateBOM`, data);
  }

  getBOMDataById(bomId: any) {
    return this.http.get<any>(
      `${databaseKey}/api/v1/getBOMDataById?bomId=${bomId}`,
    );
  }

  approveBOM(data: any): Observable<any> {
    return this.http.post<any>(`${databaseKey}/api/v1/approveBOM`, data);
  }

  getTransportChargeList(): Observable<any> {
    return this.http.get<any>(`${databaseKey}/api/v1/getTransportChargeList`);
  }
  getTransportChargeById(id:any): Observable<any> {
    return this.http.get<any>(`${databaseKey}/api/v1/getTransportChargeById/${id}`);
  }
  updateTransportCharge(id:any,data:any): Observable<any> {
    return this.http.put<any>(`${databaseKey}/api/v1/updateTransportCharge/${id}`,data);
  }
  createChargeMst(data: any): Observable<any> {
    return this.http.post<any>(`${databaseKey}/api/v1/create-transport-charge`, data);
  }

  private currencySource = new BehaviorSubject<any>(null);
  currencyData = new BehaviorSubject<any>(null);
  currency$ = this.currencySource.asObservable();

  changeCurrency(currency: any) {
    this.currencySource.next(currency);
  }
  private currencyDataSource = new BehaviorSubject<any[]>([]);

  setCurrencyData(data: any[]) {
    this.currencyDataSource.next(data);
  }

  getCurrencyData() {
    return this.currencyDataSource.value;
  }
  convertAmount(amount: number, fromCurrencyId: number, toCurrencyId: number): number {
    const currencyData = this.getCurrencyData();
    if (!amount) return 0;

    if (fromCurrencyId === toCurrencyId) {
      return Number(amount);
    }

    const fromCurrency = currencyData.find(x => x.Currency_Convert_id === fromCurrencyId);

    const toCurrency = currencyData.find(x => x.Currency_Convert_id === toCurrencyId);

    const fromRate = Number(fromCurrency?.rate || 1);
    const toRate = Number(toCurrency?.rate || 1);

    return Number(((amount / fromRate) * toRate).toFixed(2));
  }

  prepareRows(rows: any[], amountField: string, currencyField: string, selectedCurrencyId: number) {
    return rows.map(row => {
      const originalAmount = Number(row[`${amountField}_original`] ?? row[amountField] ?? 0);

      const originalCurrencyId = row[`${currencyField}_original`] ?? row[currencyField] ?? 1;

      return {
        ...row,
        [`${amountField}_original`]: originalAmount,
        [`${currencyField}_original`]: originalCurrencyId,
        [amountField]: this.convertAmount(originalAmount, originalCurrencyId, selectedCurrencyId)
      };
    });
  }

  convertCurrency(amount: number, fromCurrencyId: number, fromCurrencyRate: number, toCurrencyId: number, toCurrencyRate: number): number {

    if (!amount || !fromCurrencyId || !toCurrencyId || !fromCurrencyRate || !toCurrencyRate) {
      return 0;
    }
    if (fromCurrencyId === toCurrencyId) {
      return Number(amount.toFixed(2));
    }
    const baseAmount = amount * Number(fromCurrencyRate);
    const convertedAmount = baseAmount / Number(toCurrencyRate);
    return Number(convertedAmount.toFixed(2));
  }


getVendorAgingReport(params: any): Observable<any> {
  return this.http.get(`${databaseKey}/vendor-aging-report`, { params });
}

getVendorAgingDetails(vendorId: number, params: any): Observable<any> {
  return this.http.get(`${databaseKey}/vendor-aging-details/${vendorId}`, { params });
}

getPaymentTermsList(entityId: number): Observable<any> {
  return this.http.get(`${databaseKey}/payment-terms-list`, {
    params: { entity_id: entityId }
  });
}

exportVendorAgingReport(params: any): Observable<any> {
  return this.http.get(`${databaseKey}/export-vendor-aging-report`, {
    params,
    responseType: 'blob'
  });
}

exportVendorAgingPDF(params: any): Observable<any> {
  return this.http.get(`${databaseKey}/export-vendor-aging-pdf`, {
    params,
    responseType: 'blob'
  });
}

}

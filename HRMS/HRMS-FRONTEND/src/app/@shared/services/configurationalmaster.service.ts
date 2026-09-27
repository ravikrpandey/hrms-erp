import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, map } from 'rxjs';
import { environment } from 'src/app/environments/environment';

const databaseKey: any = environment.serverUrl;

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
    countryGet: () => `${databaseKey}/api/v1/getAllcountry`,
    signatureById: (signature_id: any) =>
      `${databaseKey}/api/v1/get_ById_signature/${signature_id}`,
    countryGetById: (countryss_id: any) =>
      `${databaseKey}/api/v1/getByIdcountry/${countryss_id}`,
    countryUpdate: (countryss_id: any) =>
      `${databaseKey}/api/v1/editcountry/${countryss_id}`,
    updateCountryStatus: (countryss_id: any) =>
      `${databaseKey}/api/v1/updateCountryStatus/${countryss_id}`,
    countryDelete: (countryss_id: any) =>
      `${databaseKey}/api/v1/deletecountry/${countryss_id}`,
  },
  State: {
    stateCreate: () => `${databaseKey}/api/v1/createstatescontroller`,
    stateGet: () => `${databaseKey}/api/v1/getallstatescontroller`,
    getAll_Country_codes: () => `${databaseKey}/api/v1/getAll_Country_codes`,
    stateGetById: (states_id: any) =>
      `${databaseKey}/api/v1/getidstatescontroller/${states_id}`,
    stateUpdate: (states_id: any) =>
      `${databaseKey}/api/v1/editstatescontroller/${states_id}`,
    stateUpdateStatus: (states_id: any) =>
      `${databaseKey}/api/v1/updateStateStatus/${states_id}`,
    stateDelete: (states_id: any) =>
      `${databaseKey}/api/v1/deletestatescontroller/${states_id}`,
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
    Create_Currency: () => `${databaseKey}/api/v1/Create_Currency`,
    delete_Currency: (id: any) => `${databaseKey}/api/v1/delete_Currency/${id}`,
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
    branchCreate: () => `${databaseKey}/api/v1/createbranch`,
    branchList: () => `${databaseKey}/api/v1/getAllbranch`,
    branchEdit: (branch_id: any) =>
      `${databaseKey}/api/v1/editbranch/${branch_id}`,
    getById: (branch_id: any) =>
      `${databaseKey}/api/v1/getByIdbranch/${branch_id}`,
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
    gradeList: (entity_id: any) =>
      `${databaseKey}/api/v1/gradelist?entity_id=${entity_id}`,
    gradeEdit: (id: any) => `${databaseKey}/api/v1/gradeupdate/${id}`,
    updateStatusgrade: (id: any) =>
      `${databaseKey}/api/v1/gradeupdateStatus/${id}`,
    getById: (id: any) => `${databaseKey}/api/v1/gradedetails/${id}`,
    deleteGrade: (id: any) => `${databaseKey}/api/v1/gradedelete/${id}`,
  },
  //Division API's
  Division: {
    division: () => `${databaseKey}/api/v1/division`,
    divisionlist: (entity_id: any) =>
      `${databaseKey}/api/v1/divisionlist?entity_id=${entity_id}`,
    divisionupdate: (id: any) => `${databaseKey}/api/v1/divisionupdate/${id}`,
    divisionupdateStatus: (id: any) =>
      `${databaseKey}/api/v1/divisionupdateStatus/${id}`,
    divisiondetails: (id: any) => `${databaseKey}/api/v1/divisiondetails/${id}`,
    divisiondelete: (id: any) => `${databaseKey}/api/v1/divisiondelete/${id}`,
  },

  Approver: {
    createApprover: () => `${databaseKey}/api/v1/create_approval`,
    listApprover: () => `${databaseKey}/api/v1/getAll_approval`,
    updateApprover: (approval_id: any) =>
      `${databaseKey}/api/v1/updateby_approval/${approval_id}`,
    getByIdApprover: (approval_id: any) =>
      `${databaseKey}/api/v1/getById_approval/${approval_id},`,
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
    getactive_employmentTypeList: () =>
      `${databaseKey}/api/v1/getactive_employmentTypeList`,
    employementCreate: () => `${databaseKey}/api/v1/employment`,
    employementList: () => `${databaseKey}/api/v1/employmentlist`,
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
    get_all_workflow_department: (entity_id: any) =>
      `${databaseKey}/api/v1/get_all_workflow_department?entity_id=${entity_id}`,

    getAllArea_active: () => `${databaseKey}/api/v1/getAllArea_active`,
    branch_get_active: () => `${databaseKey}/api/v1/branch_get_active`,
    getContractTypes_active: () =>
      `${databaseKey}/api/v1/getContractTypes_active`,
    getContractTypes_active_migration: (entityId: any, finacId: any) =>
      `${databaseKey}/api/v1/getContractTypes_active/${entityId}/${finacId}`,
    getAllReason_active: () => `${databaseKey}/api/v1/getAllReason_active`,
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
    // countryGetById: (countryss_id: any) => `${databaseKey}/api/v1/getByIdcountry/${countryss_id}`,
    updateDept: (dept_id: any, entity_id: any) =>
      `${databaseKey}/api/v1/editDepartment/${dept_id}`,
    byId: (dept_id: any) =>
      `${databaseKey}/api/v1/getByIdDepartment/${dept_id}`,
    delete: (dept_id: any) =>
      `${databaseKey}/api/v1/deleteDepartment/${dept_id}`,
    status: (dept_id: any) =>
      `${databaseKey}/api/v1/updateDepartmentStatus/${dept_id}`,

    createMasterDepartment: () =>
      `${databaseKey}/api/v1/createmasterDepartment`,
    updateDeptMatser: (department_name: any) =>
      `${databaseKey}/api/v1/editDepartmentmaster/${department_name}`,
    departmentmasterbyId: (department_name: any) =>
      `${databaseKey}/api/v1/getByIdDepartmentMaster/${department_name}`,
  },

  allowance: {
    createAllownce: () => `${databaseKey}/api/v1/createAllowance`,
    getAllAllownce: () => `${databaseKey}/api/v1/getall_Allowance`,
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
    getall_reasons_nw: () => `${databaseKey}/api/v1/getall_reasons`,
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
      `${databaseKey}/api/v1/get_Contract`,

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
    get_active_municipality: (entity_id: any) =>
      `${databaseKey}/api/v1/get_active_municipality/${entity_id}`,
    get_Municipality: (entity_id: any) =>
      `${databaseKey}/api/v1/get_Municipality/${entity_id}`,

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
    plantMaster_List: () => `${databaseKey}/api/v1/plant_getAll`,
    plantMasterGetById: (id: any) => `${databaseKey}/api/v1/plant_getAll/${id}`,
    plantMasterDelete: (id: any) => `${databaseKey}/api/v1/delete_plant/${id}`,
    plantMasterStatusById: (id: any) =>
      `${databaseKey}/api/v1/plantStatus/${id}`,
    plantMaster_update: (id: any) => `${databaseKey}/api/v1/update_plant/${id}`,
  },

  branchSetup: {
    list: (query: any) =>
      `${databaseKey}/api/v1/branchSetup_get?entity_id=${query.entity_id}`,
    list_migration: () => `${databaseKey}/api/v1/branchSetup_get`,
    activeList: () => `${databaseKey}/api/v1/branchSetup_get_active`,
    getAllArea: () => `${databaseKey}/api/v1/getAllArea`,
    create: () => `${databaseKey}/api/v1/create_branchSetup`,
    getById: (id: any) => `${databaseKey}/api/v1/branchSetup_get/${id}`,
    deleteData: (id: any) => `${databaseKey}/api/v1/delete_branchSetup/${id}`,
    update: (id: any) => `${databaseKey}/api/v1/update_branchSetup/${id}`,
    statusById: (id: any) => `${databaseKey}/api/v1/branchStatus/${id}`,
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

  itemService: {
    createItem: () => `${databaseKey}/api/v1/createItem`,
    itemList: () => `${databaseKey}/api/v1/getAllItem`,
    itemGetById: (id: any) => `${databaseKey}/api/v1/getItemById/${id}`,
    itemDelete: (id: any) => `${databaseKey}/api/v1/deleteItemMaster/${id}`,
    item_update: (id: any) => `${databaseKey}/api/v1/updateItemMaster/${id}`,
    item_StatusUpdate: (id: any) =>
      `${databaseKey}/api/v1/updateItemStatus/${id}`,
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
    serviceMaster_List: () => `${databaseKey}/api/v1/getAllServices`,
    serviceMasterGetById: (id: any) =>
      `${databaseKey}/api/v1/getServicesById/${id}`,
    serviceMasterDelete: (id: any) =>
      `${databaseKey}/api/v1/deleteServices/${id}`,
    serviceMaster_update: (id: any) =>
      `${databaseKey}/api/v1/update_services/${id}`,
    statusById: (id: any) => `${databaseKey}/api/v1/updateServiceStatus/${id}`,
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
    areaMaster_list: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllArea/${entity_id}`,
    areaMaster_getById: (id: any) => `${databaseKey}/api/v1/getByIdArea/${id}`,
    areaMaster_getByareaname: (area_name: any) =>
      `${databaseKey}/api/v1/getByarea_name/${area_name}`,
    areaMaster_getDepByArea: (id: any) =>
      `${databaseKey}/api/v1/getDepartmentWithArea/${id}`,
    areaMaster_update: (a_id: any) =>
      `${databaseKey}/api/v1/updateAreaById/${a_id}`,

    updaateDataareaName: (area_name: any) =>
      `${databaseKey}/api/v1/updatedate_area_name/${area_name}`,
    areaStatus: (a_id: any) => `${databaseKey}/api/v1/areaStatus/${a_id}`,
    areaMaster_delete: (id: any) => `${databaseKey}/api/v1/deleteArea/${id}`,
  },

  bankMasterService: {
    create_Bank: () => `${databaseKey}/api/v1/create_Bank`,
    getAllBANK: () => `${databaseKey}/api/v1/getAllBANK`,
    getByBankID: (id: any) => `${databaseKey}/api/v1/getByBankID/${id}`,
    updateBankById: (id: any) => `${databaseKey}/api/v1/updateBankById/${id}`,
    BankStatus: (b_id: any) => `${databaseKey}/api/v1/BankStatus/${b_id}`,
    delete_Bank: (id: any) => `${databaseKey}/api/v1/delete_Bank/${id}`,
  },

  workStationMasterService: {
    workStationMaster_create: () => `${databaseKey}/api/v1/create_workStation`,
    workStationMaster_List: () => `${databaseKey}/api/v1/getAllWorkstation`,
    activeWorkStationMaster_List: () =>
      `${databaseKey}/api/v1/getAllActiveWorkstation`,
    workStationMasterGetById: (id: any) =>
      `${databaseKey}/api/v1/getAllWorkstation/${id}`,
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
    productMasterById: (id: any) => `${databaseKey}/api/v1/getAllproduct/${id}`,
    duplicateProductMaster_List: () =>
      `${databaseKey}/api/v1/getAllRepeatProduct`,
    productMasterGetById: (id: any) =>
      `${databaseKey}/api/v1/getProductDetailsByVariantId/${id}`,
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
    getAllQuality: () => `${databaseKey}/api/v1/getAllQuality`,
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

  // complaint

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
  CustomerReview: {
    getAllCustomerReview: () => `${databaseKey}/api/v1/getAllReview`,
    getCustomerReviewById: (review_id: any) =>
      `${databaseKey}/api/v1/getByIdReview/${review_id}`,
    updateCustomerReview: (review_id: any) =>
      `${databaseKey}/api/v1/editReview/${review_id}`,
    updateCustomerReviewStatus: (review_id: any) =>
      `${databaseKey}/api/v1/update_review_status/${review_id}`,
    deleteCustomerReview: (review_id: any) =>
      `${databaseKey}/api/v1/deleteReview/${review_id}`,
    createCustomerReview: () => `${databaseKey}/api/v1/createReview`,
  },
  LmsCourseCategory: {
    getAllLmsCourseCAtegory: () => `${databaseKey}/api/v1/getAllCourseCategory`,
    getLmsCourseCategoryById: (category_id: any) =>
      `${databaseKey}/api/v1/getByIdCourseCategory/${category_id}`,
    updateLmsCourseCategory: (category_id: any) =>
      `${databaseKey}/api/v1/editCourseCategory/${category_id}`,
    deleteLmsCourseCategory: (category_id: any) =>
      `${databaseKey}/api/v1/deleteCourseCategory/${category_id}`,
    createLmsCourseCategory: () => `${databaseKey}/api/v1/createCourseCategory`,
  },
  ////////Reimbursement Master Starts Here//////////////////////
  bonus: {
    create_bonus: () => `${databaseKey}/api/v1/create_bonus`,
    getAll_Bonus: (entity_id: any, employee_id: any, role: any) =>
      `${databaseKey}/api/v1/getAll_Bonus?entity_id=${entity_id}&employee_id=${employee_id}&role=${role}`,
    getBonusById: (id: any) => `${databaseKey}/api/v1/getBonusById?bonus_id=${id}`,
    deleteBonusById: (bonus_id: any) => `${databaseKey}/api/v1/deleteBonusById/${bonus_id}`,
  },
  encashment: {
    create_Encashment: () => `${databaseKey}/api/v1/create_Encashment`,
    getAll_Encashment: (entity_id: any, employee_id: any, role: any) =>
      `${databaseKey}/api/v1/getAll_Encashment?entity_id=${entity_id}&employee_id=${employee_id}&role=${role}`,
    getEncashmentById: (id: any) => `${databaseKey}/api/v1/getEncashmentById?bonus_id=${id}`,
    getEncashLeave: (entity_id: any) => `${databaseKey}/api/v1/getIs_Encash?entity_id=${entity_id}`,
    deleteEncashmentById: (bonus_id: any) => `${databaseKey}/api/v1/deleteEncashmentById/${bonus_id}`,
  },
  advancepayment: {
    create_advancepayment: () => `${databaseKey}/api/v1/create_Advancepayment`,
    getAll_advancepayment: () => `${databaseKey}/api/v1/getAll_Advancepayment`,
    getadvancepaymentById: (id: any) => `${databaseKey}/api/v1/getAdvancepaymentById?id=${id}`,
    deleteadvancepaymentById: (id: any) => `${databaseKey}/api/v1/deleteAdvancepaymentById/${id}`,
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
  ////////Reimbursement Master Starts Here//////////////////////

  //Business Unit API's
  busssinessUnit: {
    businessunitCreate: () => `${databaseKey}/api/v1/createBusinessUnit`,
    businessunitList: (entity_id: any) =>
      `${databaseKey}/api/v1/businessUnitList?entity_id=${entity_id}`,
    businessUnitEdit: (id: any) => `${databaseKey}/api/v1/businessUnitUpdate/${id}`,
    updateStatusbusinessunit: (id: any) =>
      `${databaseKey}/api/v1/updateBusinessUnitStatus/${id}`,
    getbusinessUnitById: (id: any) => `${databaseKey}/api/v1/businessUnitById/${id}`,
    deleteBusinessUnit: (id: any) => `${databaseKey}/api/v1/deleteBusinessUnitById/${id}`,
    getActiveBusinessUnit: (entity_id: any) =>
      `${databaseKey}/api/v1/getActiveBusinessUnit?entity_id=${entity_id}`,
  },
  ktmaster: {
    createKtCategory: () => `${databaseKey}/api/v1/createKtCategory`,
    KtCategoryList: (entity_id: any) => `${databaseKey}/api/v1/KtCategoryList?entity_id=${entity_id}`,
    KtCategoryById: (id: any) => `${databaseKey}/api/v1/KtCategoryById/${id}`,
    KtCategoryUpdate: (id: any) => `${databaseKey}/api/v1/KtCategoryUpdate/${id}`,
    updateKtCategoryStatus: (id: any) => `${databaseKey}/api/v1/updateKtCategoryStatus/${id}`,
    deleteKtCategoryById: (id: any) => `${databaseKey}/api/v1/deleteKtCategoryById/${id}`,
  },
  //Assets API's
  //Asset Category Master
  assetCategory: {
    assetCategoryCreate: () => `${databaseKey}/api/v1/assetCategoryCreate`,
    getassetCategoryList: (entity_id: any) =>
      `${databaseKey}/api/v1/assetCategoryList?entity_id=${entity_id}`,
    getassetCategoryListActiveStatus: (entity_id: any) =>
      `${databaseKey}/api/v1/getassetCategoryListActiveStatus?entity_id=${entity_id}`,
    assetCategoryEdit: (id: any) => `${databaseKey}/api/v1/assetCategoryUpdate/${id}`,
    updateAssetCategoryStatus: (id: any) =>
      `${databaseKey}/api/v1/updateAssetCategoryStatus/${id}`,
    getassetCategoryById: (id: any) => `${databaseKey}/api/v1/assetCategoryById/${id}`,
    deleteAssetCategory: (id: any) => `${databaseKey}/api/v1/deleteAssetCategoryById/${id}`,
  },
  //Asset Subcategory Master
  assetSubcategory: {
    assetSubcategoryCreate: () => `${databaseKey}/api/v1/assetSubcategoryCreate`,
    assetSubcategoryList: (entity_id: any) =>
      `${databaseKey}/api/v1/assetSubcategoryList?entity_id=${entity_id}`,
    assetSubcategoryListActiveStatus: (entity_id: any) =>
      `${databaseKey}/api/v1/assetSubcategoryListActiveStatus?entity_id=${entity_id}`,
    assetSubcategoryEdit: (id: any) => `${databaseKey}/api/v1/assetSubcategoryUpdate/${id}`,
    updateAssetSubcategoryStatus: (id: any) =>
      `${databaseKey}/api/v1/updateAssetSubcategoryStatus/${id}`,
    getassetSubcategoryById: (id: any) => `${databaseKey}/api/v1/assetSubcategoryById/${id}`,
    deleteAssetSubcategory: (id: any) => `${databaseKey}/api/v1/deleteAssetSubcategoryById/${id}`,
  },
   //Asset Master
  assetMaster: {
    assetMasterCreate: () => `${databaseKey}/api/v1/assetMasterCreate`,
    getAllAssetMaster: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllAssetMaster?entity_id=${entity_id}`,
    getAllAssetMasterActiveStatus: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllAssetMasterActiveStatus?entity_id=${entity_id}`,
    assetMasterUpdate: (id: any) => `${databaseKey}/api/v1/assetMasterUpdate/${id}`,
    assetMasterStatusUpdate: (id: any) =>
      `${databaseKey}/api/v1/assetMasterStatusUpdate/${id}`,
    getAssetMasterById: (id: any) => `${databaseKey}/api/v1/getAssetMasterById/${id}`,
    deleteAsseMasterById: (id: any) => `${databaseKey}/api/v1/deleteAsseMasterById/${id}`,
  },
  //Notice Period Master
  noticePeriod: {
    noticePeriodCreate: () => `${databaseKey}/api/v1/noticePeriodCreate`,
    getAllNoticePeriod: (entity_id: any) =>
      `${databaseKey}/api/v1/getAllNoticePeriod?entity_id=${entity_id}`,
    noticePeriodUpdate: (id: any) => `${databaseKey}/api/v1/noticePeriodUpdate/${id}`,
    updateNoticePeriodStatus: (id: any) =>
      `${databaseKey}/api/v1/updateNoticePeriodStatus/${id}`,
    getNoticePeriodById: (id: any) => `${databaseKey}/api/v1/getNoticePeriodById/${id}`,
    deleteNoticePeriodById: (id: any) => `${databaseKey}/api/v1/deleteNoticePeriodById/${id}`,
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
    entity_id: any
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
  getPriceListByID(product_master_id: any): Observable<any> {
    return this.http.get(
      routes.PriceLevelSlap.getPriceLevelById(product_master_id)
    );
  }
  getByIdCountry(countryss_id: any): Observable<any> {
    return this.http.get(routes.Country.countryGetById(countryss_id));
  }
  updateSingleCountry(countryss_id: any, data: any): Observable<any> {
    return this.http.put<any>(routes.Country.countryUpdate(countryss_id), data);
  }
  deleteSingleCountry(countryss_id: any): Observable<any> {
    return this.http.delete<any>(routes.Country.countryDelete(countryss_id));
  }
  updateCountryStatus(countryss_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.Country.updateCountryStatus(countryss_id),
      data
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
  deleteState(states_id: any): Observable<any> {
    return this.http.delete<any>(routes.State.stateDelete(states_id));
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

  ////complaint
  create_complaint_type(data: any): Observable<any> {
    return this.http.post(routes.complaint.create_complaint_type(), data);
  }

  get_all_complaint_type(
    entity_id: any,
    financial_year_id: any
  ): Observable<any> {
    return this.http.get(
      routes.complaint.get_all_complaint_type(entity_id, financial_year_id)
    );
  }
  get_all_complaint_typeActive(
    entity_id: any,
    financial_year_id: any
  ): Observable<any> {
    return this.http.get(
      routes.complaint.get_all_complaint_typeActive(
        entity_id,
        financial_year_id
      )
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
  changeIssue_Status(data: any): Observable<any> {
    debugger;
    return this.http.put(routes.complaint.changeIssue_Status(), data);
  }

  /***********lms code start************/
  // Lms Course Category
  getLmsCourseCategory() {
    return this.http.get(routes.LmsCourseCategory.getAllLmsCourseCAtegory());
  }
  deleteLmsCourseCategory(category_id: any) {
    return this.http.delete(
      routes.LmsCourseCategory.deleteLmsCourseCategory(category_id)
    );
  }
  getByIdLmsCourseCategory(category_id: any) {
    return this.http.get(
      routes.LmsCourseCategory.getLmsCourseCategoryById(category_id)
    );
  }
  updateLmsCourseCategory(category_id: any, data: any) {
    return this.http.put(
      routes.LmsCourseCategory.updateLmsCourseCategory(category_id),
      data
    );
  }
  createLmsCourseCategory(data: any) {
    return this.http.post(
      routes.LmsCourseCategory.createLmsCourseCategory(),
      data
    );
  }
  // **********lms code end****************
  // customer-review-master

  getcustomerReview() {
    return this.http.get(routes.CustomerReview.getAllCustomerReview());
  }
  createReview(data: any) {
    return this.http.post(routes.CustomerReview.createCustomerReview(), data);
  }
  getCustomerReviewById(review_id: any) {
    return this.http.get(
      routes.CustomerReview.getCustomerReviewById(review_id)
    );
  }
  updateCustomerReview(review_id: any, data: any) {
    return this.http.put<any>(
      routes.CustomerReview.updateCustomerReview(review_id),
      data
    );
  }
  updateCustomerReviewStatus(review_id: any, data: any) {
    return this.http.put<any>(
      routes.CustomerReview.updateCustomerReviewStatus(review_id),
      data
    );
  }
  deleteCustomerReview(review_id: any) {
    return this.http.delete<any>(
      routes.CustomerReview.deleteCustomerReview(review_id)
    );
  }
  // getCustomerReviewById(){}

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

  // Currency
  CurrencyCreate(data: any): Observable<any> {
    return this.http.post(routes.Currency.currencyCreate(), data);
  }
  CurrencyList(): Observable<any> {
    return this.http.get(routes.Currency.listCurrency());
  }
  Create_Currency(body: any): Observable<any> {
    return this.http.post(routes.Currency.Create_Currency(), body);
  }
  delete_Currency(id: any): Observable<any> {
    return this.http.delete(routes.Currency.delete_Currency(id));
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
      data
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
      data
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
      routes.StandardProgAsses.getByCertId(certificate_type_id)
    );
  }

  SegmentIdgetBy(segment_id: any): Observable<any> {
    return this.http.get(routes.StandardProgAsses.getBySegmentId(segment_id));
  }
  //Branch
  createBranch(data: any): Observable<any> {
    return this.http.post(routes.Branch.branchCreate(), data);
  }
  listBranch(): Observable<any> {
    return this.http.get(routes.Branch.branchList());
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
      data
    );
  }
  updateExpenseStatus(expenseforCopy_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.ExpenseCategory.ExpenseStatusUpdate(expenseforCopy_id),
      data
    );
  }
  getByIdExpense(expenseforCopy_id: any): Observable<any> {
    return this.http.get(
      routes.ExpenseCategory.getByIdExpense(expenseforCopy_id)
    );
  }
  deleteExpense(expenseforCopy_id: any): Observable<any> {
    return this.http.delete(
      routes.ExpenseCategory.ExpenseDelete(expenseforCopy_id)
    );
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
      data
    );
  }

  durationById(duration_type_id: any): Observable<any> {
    return this.http.get(
      routes.DurationMaster.getByIdDuration(duration_type_id)
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
  listGrade(entity_id: any): Observable<any> {
    return this.http.get(routes.Grade.gradeList(entity_id));
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
  //Division
  division(data: any): Observable<any> {
    return this.http.post(routes.Division.division(), data);
  }
  divisionlist(entity_id: any): Observable<any> {
    return this.http.get(routes.Division.divisionlist(entity_id));
  }
  divisionupdate(id: any, data: any): Observable<any> {
    return this.http.put(routes.Division.divisionupdate(id), data);
  }
  divisionupdateStatus(id: any, data: any): Observable<any> {
    return this.http.put(routes.Division.divisionupdateStatus(id), data);
  }
  divisiondetails(id: any): Observable<any> {
    return this.http.get(routes.Division.divisiondetails(id));
  }
  divisiondelete(id: any): Observable<any> {
    return this.http.delete(routes.Division.divisiondelete(id));
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
      data
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
      data
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
      data
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
      data
    );
  }
  getByIdIndustry(industry_sector_id: any): Observable<any> {
    return this.http.get(
      routes.IndustrySectorMaster.getById(industry_sector_id)
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
  getactive_employmentTypeList(): Observable<any> {
    return this.http.get(routes.EmployementType.getactive_employmentTypeList());
  }
  listEmployement(): Observable<any> {
    return this.http.get(routes.EmployementType.employementList());
  }
  editEmployement(emptype_id: any, data: any): Observable<any> {
    return this.http.put(routes.EmployementType.employeeEdit(emptype_id), data);
  }
  updateEmployementStatus(emptype_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.EmployementType.employeeUpdateStatus(emptype_id),
      data
    );
  }
  getByIdEmployement(emptype_id: any): Observable<any> {
    return this.http.get(routes.EmployementType.getById(emptype_id));
  }
  DeleteEmployement(emptype_id: any): Observable<any> {
    return this.http.put(
      routes.EmployementType.employementDelete(emptype_id),
      {}
    );
  }

  //Municipality

  get_active_municipality(entity_id: any): Observable<any> {
    return this.http.get(
      routes.municipality_master.get_active_municipality(entity_id)
    );
  }

  get_Municipality(entity_id: any): Observable<any> {
    return this.http.get(
      routes.municipality_master.get_Municipality(entity_id)
    );
  }

  createMunicipality(data: any): Observable<any> {
    return this.http.post(
      routes.municipality_master.createMunicipality(),
      data
    );
  }
  get_MunicipalityById(id: any): Observable<any> {
    return this.http.get(routes.municipality_master.get_MunicipalityById(id));
  }
  deleteMunicipalityById(id: any): Observable<any> {
    return this.http.delete(
      routes.municipality_master.deleteMunicipalityById(id)
    );
  }
  update_MunicipalityById(id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.municipality_master.update_MunicipalityById(id),
      data
    );
  }

  //contract-type
  get_Contract(entity: any, finacial_id: any): Observable<any> {
    return this.http.get(
      routes.contract_type_master.get_Contract(entity, finacial_id)
    );
  }
  createContractType(data: any): Observable<any> {
    return this.http.post(
      routes.contract_type_master.createContractType(),
      data
    );
  }
  updateContractType(id: any, data: any): Observable<any> {
    return this.http.put(
      routes.contract_type_master.updateContractType(id),
      data
    );
  }
  update_ContractById(id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.contract_type_master.update_ContractById(id),
      data
    );
  }
  get_ContractById(id: any): Observable<any> {
    return this.http.get(routes.contract_type_master.get_ContractById(id));
  }
  delete_ContractById(id: any): Observable<any> {
    return this.http.delete(
      routes.contract_type_master.delete_ContractById(id)
    );
  }

  //Department
  createDepartment(data: any, entity_id: any): Observable<any> {
    return this.http.post(routes.department.create(entity_id), data);
  }

  getDepartment(entity_id: any): Observable<any> {
    return this.http.get(routes.department.list(entity_id));
  }

  get_all_workflow_department(entity_id: any): Observable<any> {
    return this.http.get(
      routes.department.get_all_workflow_department(entity_id)
    );
  }

  getAllArea_active(data: any): Observable<any> {
    console.log('datadatadata', data);

    return this.http.post(routes.department.getAllArea_active(), data);
  }
  branch_get_active(): Observable<any> {
    return this.http.get(routes.department.branch_get_active());
  }
  getContractTypes_active(): Observable<any> {
    return this.http.get(routes.department.getContractTypes_active());
  }
  getContractTypes_active_migration(
    entityId: any,
    finacId: any
  ): Observable<any> {
    return this.http.get(
      routes.department.getContractTypes_active_migration(entityId, finacId)
    );
  }
  getAllReason_active(): Observable<any> {
    return this.http.get(routes.department.getAllReason_active());
  }
  getAllDesignation_active(): Observable<any> {
    return this.http.get(routes.department.getAllDesignation_active());
  }
  getAllDepartment_all_active(entity_id: any): Observable<any> {
    return this.http.get(
      routes.department.getAllDepartment_all_active(entity_id)
    );
  }

  getDepartmentAll(entity_id: any): Observable<any> {
    return this.http.get(routes.department.listAll(entity_id));
  }
  updateDepartment(dept_id: any, data: any, entity_id: any): Observable<any> {
    return this.http.put<any>(
      routes.department.updateDept(dept_id, entity_id),
      data
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
      null
    );
  }
  getAllDepartment_all(entity_id: any, employee_id: any): Observable<any> {
    return this.http.get(
      routes.department.getAllDepartment_all(entity_id, employee_id)
    );
  }

  //

  createMaterDepartment(data: any) {
    return this.http.post(routes.department.createMasterDepartment(), data);
  }

  updateDepartmentMaster(department_name: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.department.updateDeptMatser(department_name),
      data
    );
  }

  departmentMasterById(department_name: any): Observable<any> {
    return this.http.get(
      routes.department.departmentmasterbyId(department_name)
    );
  }

  //reason
  create_reason(data: any): Observable<any> {
    return this.http.post(routes.reason_master.create_reason(), data);
  }

  getall_reasons(entity_id: any): Observable<any> {
    return this.http.get(routes.reason_master.getall_reasons(entity_id));
  }
  getall_reasons_nw(): Observable<any> {
    return this.http.get(routes.reason_master.getall_reasons_nw());
  }

  delete_reason_ById(id: any): Observable<any> {
    return this.http.delete(routes.reason_master.delete_reason_ById(id));
  }

  update_reason_ById(id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.reason_master.update_reason_ById(id),
      data
    );
  }

  get_reason_ById(id: any): Observable<any> {
    return this.http.get(routes.reason_master.get_reason_ById(id));
  }

  updatedStatusReason(id: any, data: any) {
    return this.http.put<any>(
      routes.reason_master.updatedStatusReason(id),
      data
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
      data
    );
  }
  updateDesignationStatus(designation_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.designation.updateDesignationStatus(designation_id),
      data
    );
  }
  designationById(designation_id: any): Observable<any> {
    return this.http.get(routes.designation.byId(designation_id));
  }
  deleteDesignation(designation_id: any): Observable<any> {
    return this.http.delete(
      routes.designation.designationDelete(designation_id)
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
      data
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
      data
    );
  }
  getQuotationcurrency(): Observable<any> {
    return this.http.get(routes.QuotationCurrency.quotationcurrencyGet());
  }
  getByIdQuotationcurrency(quotation_currency_id: any): Observable<any> {
    return this.http.get(
      routes.QuotationCurrency.quotationcurrencyGetById(quotation_currency_id)
    );
  }
  updateQuotationcurrencyStatus(
    quotation_currency_id: any,
    data: any
  ): Observable<any> {
    return this.http.put(
      routes.QuotationCurrency.statusUpdateQuotationcurrency(
        quotation_currency_id
      ),
      data
    );
  }
  updateSingleQuotationcurrency(
    quotation_currency_id: any,
    data: any
  ): Observable<any> {
    return this.http.put<any>(
      routes.QuotationCurrency.quotationcurrencyUpdate(quotation_currency_id),
      data
    );
  }
  deleteQuotationCurrency(quotation_currency_id: any): Observable<any> {
    return this.http.delete(
      routes.QuotationCurrency.quotationCurrencyDelete(quotation_currency_id)
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
      routes.AccrediationId.accrediationidGetById(accreditationID)
    );
  }
  updateAccrediationid(accreditationID: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.AccrediationId.accrediationidUpdate(accreditationID),
      data
    );
  }
  deleteAccrediation(
    accredition_logo_details_id: any,
    body: any
  ): Observable<any> {
    return this.http.delete(
      routes.AccrediationId.accrediationDelete(accredition_logo_details_id),
      body
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
      data
    );
  }
  getAccrediationlogo(): Observable<any> {
    return this.http.get(routes.AccrediationLogo.accrediationlogoGet());
  }
  getByIdAccrediationlogo(accredition_logo_details_id: any): Observable<any> {
    return this.http.get(
      routes.AccrediationLogo.accrediationlogoGetById(
        accredition_logo_details_id
      )
    );
  }
  updateSingleAccrediationlogo(
    accredition_logo_details_id: any,
    data: any
  ): Observable<any> {
    return this.http.put<any>(
      routes.AccrediationLogo.accrediationlogoUpdate(
        accredition_logo_details_id
      ),
      data
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
      data
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
      data
    );
  }

  // vehicle registration master
  CreateVehicleRegistration(data: any): Observable<any> {
    return this.http.post(
      routes.vehicleRegistration.createVehicleRegistration(),
      data
    );
  }
  getAllVehicleRegistration(): Observable<any> {
    return this.http.get(
      routes.vehicleRegistration.getAllVehicleRegistration()
    );
  }
  getByIdVehicleRegistration(vehicle_registration_id: any): Observable<any> {
    return this.http.get(
      routes.vehicleRegistration.getByIdVehicleRegistration(
        vehicle_registration_id
      )
    );
  }
  updateVehicleRegistration(
    vehicle_registration_id: any,
    data: any
  ): Observable<any> {
    return this.http.put<any>(
      routes.vehicleRegistration.updateVehicleRegistrationById(
        vehicle_registration_id
      ),
      data
    );
  }
  deleteVehicleRegistration(id: any): Observable<any> {
    return this.http.delete(
      routes.vehicleRegistration.vehicleRegistrationDelete(id)
    );
  }

  toogleVehicleStatus(id: any, data: any): Observable<any> {
    return this.http.put(
      routes.vehicleRegistration.toogleVehicleStatus(id),
      data
    );
  }

  //  customer type starts
  CreateCustomerType(data: any): Observable<any> {
    return this.http.post(routes.CustomerType.CustomerTypeCreate(), data);
  }
  updateSingleCustomer(customer_type_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.CustomerType.customertypeUpdate(customer_type_id),
      data
    );
  }
  getCustomerType(): Observable<any> {
    return this.http.get(routes.CustomerType.CustomerGet());
  }
  editCustomerType(customer_type_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.CustomerType.customerTypeEdit(customer_type_id),
      data
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
      data
    );
  }
  editTrainingName(traning_name_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.TrainingName.trainingNameEdit(traning_name_id),
      data
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
      data
    );
  }
  updateStatusLevelSlab(level_slab_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.LevelSlab.levelSlabUpdateStatus(level_slab_id),
      data
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
      data
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
      data
    );
  }
  updatePriceLevel(pricing_level_id: any, data: any): Observable<any> {
    return this.http.put<any>(
      routes.PriceLevel.updatePriceLevel(pricing_level_id),
      data
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
      routes.certiTypes.certificateGetById(certificate_type_id)
    );
  }
  updateSingleCertificate(
    certificate_type_id: any,
    data: any
  ): Observable<any> {
    return this.http.put<any>(
      routes.certiTypes.certificateUpdate(certificate_type_id),
      data
    );
  }
  /* Certificate Type start */
  /*regional bussinesshead start */
  Createnewregionalbussinesshead(data: any): Observable<any> {
    return this.http.post(
      routes.regionalbussinesshead.regionalbussinessheadCreate(),
      data
    );
  }
  getAllRegionalbussinesshead(): Observable<any> {
    return this.http.get(
      routes.regionalbussinesshead.regionalbussinessheadGet()
    );
  }
  getByIdRegionalbussinesshead(
    new_regional_business_head_id: any
  ): Observable<any> {
    return this.http.get(
      routes.regionalbussinesshead.regionalbussinessheadGetById(
        new_regional_business_head_id
      )
    );
  }
  updateSingleRegionalbussinesshead(
    new_regional_business_head_id: any,
    data: any
  ): Observable<any> {
    return this.http.put<any>(
      routes.regionalbussinesshead.regionalbussinessheadUpdate(
        new_regional_business_head_id
      ),
      data
    );
  }
  /*regional bussinesshead end */

  //Global sales manager
  createGSM(data: any): Observable<any> {
    return this.http.post(
      routes.globalSalesManager.globalSalesManagerCreate(),
      data
    );
  }
  getAllGSM(): Observable<any> {
    return this.http.get(routes.globalSalesManager.globalSalesManagerList());
  }
  updateGSM(new_global_manager_sales_id: any, data: any): Observable<any> {
    return this.http.put(
      routes.globalSalesManager.globalSalesManagerUpdate(
        new_global_manager_sales_id
      ),
      data
    );
  }
  getByIdGSM(new_global_manager_sales_id: any): Observable<any> {
    return this.http.get(
      routes.globalSalesManager.getById(new_global_manager_sales_id)
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
      data
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
      data
    );
  }
  // conclusion of completeness Check
  createconcompleteness(data: any): Observable<any> {
    return this.http.post(
      routes.concompleteness.concompleteness_create(),
      data
    );
  }
  getAllconcompleteness(): Observable<any> {
    return this.http.get(routes.concompleteness.concompletenessList());
  }
  updateconcompeteness(
    completeness_Checkl1_id: any,
    data: any
  ): Observable<any> {
    return this.http.put(
      routes.concompleteness.concompletenessUpdate(completeness_Checkl1_id),
      data
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
      data
    );
  }

  // conclusion of Technical Review Check
  createcontechreview(data: any): Observable<any> {
    return this.http.post(
      routes.contechnicalCheck.contechreview_create(),
      data
    );
  }
  getAllcontechreview(): Observable<any> {
    return this.http.get(routes.contechnicalCheck.contechreviewList());
  }
  updatecontechreview(
    completeness_Check_tech_id: any,
    data: any
  ): Observable<any> {
    return this.http.put(
      routes.contechnicalCheck.contechreviewUpdate(completeness_Check_tech_id),
      data
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
      data
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
  getPlantMasterList() {
    return this.http.get(routes.plantMasterService.plantMaster_List());
  }

  createPlantMaster(data: any) {
    return this.http.post(routes.plantMasterService.plantMaster_create(), data);
  }

  updatePlantMaster(id: any, data: any) {
    return this.http.put(
      routes.plantMasterService.plantMaster_update(id),
      data
    );
  }

  getByIdPlantMaster(id: any) {
    return this.http.get(routes.plantMasterService.plantMasterGetById(id));
  }
  deletePlantMaster(id: any) {
    return this.http.delete(routes.plantMasterService.plantMasterDelete(id));
  }
  statusPlantMasterById(id: any, data: any) {
    return this.http.put(
      routes.plantMasterService.plantMasterStatusById(id),
      data
    );
  }
  // plant master end -->
  // Branch-Setup
  getListBranchSetup(query: any) {
    return this.http.get(routes.branchSetup.list(query));
  }
  getListBranchSetup_migration() {
    return this.http.get(routes.branchSetup.list_migration());
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
      data
    );
  }
  updateAssetMasterStatus(id: any, data: any) {
    return this.http.put(
      routes.assetMasterService.assetMaster_update_status(id),
      data
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
  getServiceMasterList() {
    return this.http.get(routes.serviceMasterService.serviceMaster_List());
  }

  createServiceMaster(data: any) {
    return this.http.post(
      routes.serviceMasterService.serviceMaster_create(),
      data
    );
  }

  updateServiceMaster(id: any, data: any) {
    return this.http.put(
      routes.serviceMasterService.serviceMaster_update(id),
      data
    );
  }

  getByIdServiceMaster(id: any) {
    return this.http.get(routes.serviceMasterService.serviceMasterGetById(id));
  }

  deleteServiceMaster(id: any) {
    return this.http.delete(
      routes.serviceMasterService.serviceMasterDelete(id)
    );
  }

  statuseServiceMasterById(id: any, formData: any) {
    return this.http.put(routes.serviceMasterService.statusById(id), formData);
  }
  // servicecategory master end -->

  getServiceCategoryMasterList() {
    return this.http.get(
      routes.servicecategoryMasterService.servicecategoryMaster_List()
    );
  }

  getActiveServiceCategoryMasterList() {
    return this.http.get(
      routes.servicecategoryMasterService.activeServicecategoryMaster_List()
    );
  }

  createServiceCategoryMaster(data: any) {
    return this.http.post(
      routes.servicecategoryMasterService.servicecategoryMaster_create(),
      data
    );
  }

  updateServiceCategoryMaster(id: any, data: any) {
    return this.http.put(
      routes.servicecategoryMasterService.servicecategoryMaster_update(id),
      data
    );
  }

  statusServiceCategoryMaster(id: any, data: any) {
    return this.http.put(
      routes.servicecategoryMasterService.servicecategoryMaster_Status(id),
      data
    );
  }

  getByIdServiceCategoryMaster(id: any) {
    return this.http.get(
      routes.servicecategoryMasterService.servicecategoryMasterGetById(id)
    );
  }
  deleteServiceCategoryMaster(id: any) {
    return this.http.delete(
      routes.servicecategoryMasterService.servicecategoryMasterDelete(id)
    );
  }
  // servicecategory master end -->

  //bank master
  create_Bank(data: any) {
    return this.http.post(routes.bankMasterService.create_Bank(), data);
  }

  getAllBANK() {
    return this.http.get(routes.bankMasterService.getAllBANK());
  }

  BankStatus(b_id: any, data: any) {
    return this.http.put(routes.bankMasterService.BankStatus(b_id), data);
  }

  delete_Bank(b_id: any) {
    return this.http.delete(routes.bankMasterService.delete_Bank(b_id));
  }

  getByBankID(id: any) {
    return this.http.get(routes.bankMasterService.getByBankID(id));
  }

  updateBankById(a_id: any, data: any) {
    return this.http.put(routes.bankMasterService.updateBankById(a_id), data);
  }

  // Sub Department Master Start

  createAreaMaster(data: any) {
    return this.http.post(routes.areaMasterService.areaMaster_create(), data);
  }

  getAreaMasterList(entity_id: any) {
    return this.http.get(routes.areaMasterService.areaMaster_list(entity_id));
  }

  getByIdAreaMaster(id: any) {
    return this.http.get(routes.areaMasterService.areaMaster_getById(id));
  }

  getByAreaname(area_name: any) {
    return this.http.get(
      routes.areaMasterService.areaMaster_getByareaname(area_name)
    );
  }

  getDepartmentByAreaMaster(id: any) {
    return this.http.get(routes.areaMasterService.areaMaster_getDepByArea(id));
  }

  areaMasterUpdate(a_id: any, data: any) {
    return this.http.put(
      routes.areaMasterService.areaMaster_update(a_id),
      data
    );
  }

  updatearematserare_namewise(area_name: any, data: any) {
    return this.http.put(
      routes.areaMasterService.updaateDataareaName(area_name),
      data
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
  getAllItem() {
    return this.http.get(routes.itemService.itemList());
  }
  // item end -->

  // work station master start -->
  getWorkStationMasterList() {
    return this.http.get(
      routes.workStationMasterService.workStationMaster_List()
    );
  }

  getActiveWorkStationMasterList() {
    return this.http.get(
      routes.workStationMasterService.activeWorkStationMaster_List()
    );
  }

  createWorkStationMaster(data: any) {
    return this.http.post(
      routes.workStationMasterService.workStationMaster_create(),
      data
    );
  }

  updateWorkStationMaster(id: any, data: any) {
    return this.http.put(
      routes.workStationMasterService.workStationMaster_update(id),
      data
    );
  }

  getByIdWorkStationMaster(id: any) {
    return this.http.get(
      routes.workStationMasterService.workStationMasterGetById(id)
    );
  }
  deleteWorkStationMaster(id: any) {
    return this.http.delete(
      routes.workStationMasterService.workStationMasterDelete(id)
    );
  }
  statusWorkStationMasterById(id: any, data: any) {
    return this.http.put(
      routes.workStationMasterService.workStationMasterStatusById(id),
      data
    );
  }
  // work station master end -->

  //bonus
  create_bonus(data: any): Observable<any> {
    return this.http.post(routes.bonus.create_bonus(), data);
  }
  getBonusById(id: any): Observable<any> {
    return this.http.get(routes.bonus.getBonusById(id));
  }
  getAll_Bonus(entity_id: any, employee_id: any, role: any) {
    return this.http.get(routes.bonus.getAll_Bonus(entity_id, employee_id, role))
  }
  deleteBonusById(bonus_id: any) {
    return this.http.delete(routes.bonus.deleteBonusById(bonus_id))
  }
  //bonus ends here


  //encashment
  create_Encashment(data: any): Observable<any> {
    return this.http.post(routes.encashment.create_Encashment(), data);
  }
  getAll_Encashment(entity_id: any, employee_id: any, role: any) {
    return this.http.get(routes.encashment.getAll_Encashment(entity_id, employee_id, role))
  }
  getEncashmentById(id: any): Observable<any> {
    return this.http.get(routes.encashment.getEncashmentById(id));
  }
  deleteEncashmentById(bonus_id: any) {
    return this.http.delete(routes.encashment.deleteEncashmentById(bonus_id))
  }

  getEncashLeave(entity_id: any) {
    return this.http.get(routes.encashment.getEncashLeave(entity_id))
  }
  //encashment ends here

  //Advance-Payment start
  create_advancepayment(data: any): Observable<any> {
    return this.http.post(routes.advancepayment.create_advancepayment(), data);
  }
  getAll_advancepayment() {
    return this.http.get(routes.advancepayment.getAll_advancepayment())
  }
  getadvancepaymentById(id: any): Observable<any> {
    return this.http.get(routes.advancepayment.getadvancepaymentById(id));
  }
  deleteadvancepaymentById(bonus_id: any) {
    return this.http.delete(routes.advancepayment.deleteadvancepaymentById(bonus_id))
  }
  //Advance-Payment ends here

  // Product Master Start

  getProductMasterList() {
    return this.http.get(routes.productMasterService.productMaster_List());
  }

  getProductsMasterById(id: any) {
    return this.http.get(routes.productMasterService.productMasterById(id));
  }
  getDuplicateProductMasterList() {
    return this.http.get(
      routes.productMasterService.duplicateProductMaster_List()
    );
  }

  createProductMaster(data: any) {
    return this.http.post(
      routes.productMasterService.productMaster_create(),
      data
    );
  }

  updateProductMasterNew(id: any, data: any) {
    return this.http.put(
      routes.productMasterService.productMaster_update(id),
      data
    );
  }

  getByIdProductMaster(id: any) {
    return this.http.get(routes.productMasterService.productMasterGetById(id));
  }

  deleteProductMaster(id: any) {
    return this.http.delete(
      routes.productMasterService.productMasterDelete(id)
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
      routes.productMasterService.ActiveProductVariantById(id)
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
      data
    );
  }
  // Workflow for Rfp end ////

  // Quality Master
  createQuality(data: any) {
    return this.http.post(routes.qualityService.createQuality(), data);
  }
  getAllQualityData() {
    return this.http.get(routes.qualityService.getAllQuality());
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
      data
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
      data
    );
  }
  listBudgetCategory(entity_id: any): Observable<any> {
    return this.http.get(routes.BudgetCategory.budgetCategoryList(entity_id));
  }
  listBudgetCategoryActive(entity_id: any): Observable<any> {
    return this.http.get(
      routes.BudgetCategory.budgetCategoryListActive(entity_id)
    );
  }
  updateBudgetCategory(id: any, data: any, entity_id: any): Observable<any> {
    return this.http.put(
      routes.BudgetCategory.updateBudgetCategory(id, entity_id),
      data
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
    console.log('++++++++++++++++++', entity_id);
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

  getAllAllownce() {
    return this.http.get(routes.allowance.getAllAllownce());
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
        })
      );
  }
  Allowance_Data_updateById(id: any, body: any) {
    return this.http
      .put<any>(`${databaseKey}/api/v1/Allowance_updateById/${id}`, body)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  allowanceGetByID(id: any): Observable<any> {
    return this.http.get(routes.allowance.allowanceGetByID(id));
  }

  // Seal Type
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
  ////////////////////////////////////////global minutes\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  create_global_minutes(body: any) {
    return this.http
      .post<any>(`${databaseKey}/api/v1/create_global_minutes`, body)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  global_minutes_list(entity_id: any) {
    return this.http
      .get<any>(
        `${databaseKey}/api/v1/global_minutes_list?entity_id=${entity_id}`
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  global_minutes(id: any) {
    return this.http
      .get<any>(`${databaseKey}/api/v1/global_minutes/${id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  global_minute_update(id: any, data: any) {
    return this.http
      .put<any>(`${databaseKey}/api/v1/global_minute_update/${id}`, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  update_minute_status(id: any, data: any) {
    return this.http
      .put<any>(`${databaseKey}/api/v1/update_minute_status/${id}`, data)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  delete_minute(id: any) {
    return this.http
      .delete<any>(`${databaseKey}/api/v1/delete_minute/${id}`)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  ////////Reimbursement Master Starts Here//////////////////////
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
  ////////Reimbursement Master Ends Here//////////////////////

  //Business Unit
  businessunitCreate(data: any): Observable<any> {
    return this.http.post(routes.busssinessUnit.businessunitCreate(), data);
  }
  businessunitList(entity_id: any): Observable<any> {
    return this.http.get(routes.busssinessUnit.businessunitList(entity_id));
  }
  getActiveBusinessUnit(entity_id: any): Observable<any> {
    return this.http.get(routes.busssinessUnit.getActiveBusinessUnit(entity_id));
  }
  businessUnitEdit(id: any, data: any): Observable<any> {
    return this.http.put(routes.busssinessUnit.businessUnitEdit(id), data);
  }
  updatebusinessunitStatus(id: any, data: any): Observable<any> {
    return this.http.put(routes.busssinessUnit.updateStatusbusinessunit(id), data);
  }
  getbusinessUnitById(id: any): Observable<any> {
    return this.http.get(routes.busssinessUnit.getbusinessUnitById(id));
  }
  deleteBusinessUnit(id: any): Observable<any> {
    return this.http.delete(routes.busssinessUnit.deleteBusinessUnit(id));
  }
  //KT Category
  createKtCategory(data: any): Observable<any> {
    return this.http.post(routes.ktmaster.createKtCategory(), data);
  }
  KtCategoryList(entity_id: any): Observable<any> {
    return this.http.get(routes.ktmaster.KtCategoryList(entity_id));
  }
  KtCategoryUpdate(id: any, data: any): Observable<any> {
    return this.http.put(routes.ktmaster.KtCategoryUpdate(id), data);
  }
  updateKtCategoryStatus(id: any, data: any): Observable<any> {
    return this.http.put(routes.ktmaster.updateKtCategoryStatus(id), data);
  }
  KtCategoryById(id: any): Observable<any> {
    return this.http.get(routes.ktmaster.KtCategoryById(id));
  }
  deleteKtCategoryById(id: any): Observable<any> {
    return this.http.delete(routes.ktmaster.deleteKtCategoryById(id));
  }
  //Assets API's
  //Asset Category Master
  assetCategoryCreate(data: any): Observable<any> {
    return this.http.post(routes.assetCategory.assetCategoryCreate(), data);
  }
  getassetCategoryList(entity_id: any): Observable<any> {
    return this.http.get(routes.assetCategory.getassetCategoryList(entity_id));
  }
  getassetCategoryListActiveStatus(entity_id: any): Observable<any> {
    return this.http.get(routes.assetCategory.getassetCategoryListActiveStatus(entity_id));
  }
  assetCategoryEdit(id: any, data: any): Observable<any> {
    return this.http.put(routes.assetCategory.assetCategoryEdit(id), data);
  }
  updateAssetCategoryStatus(id: any, data: any): Observable<any> {
    return this.http.put(routes.assetCategory.updateAssetCategoryStatus(id), data);
  }
  getassetCategoryById(id: any): Observable<any> {
    return this.http.get(routes.assetCategory.getassetCategoryById(id));
  }
  deleteAssetCategory(id: any): Observable<any> {
    return this.http.delete(routes.assetCategory.deleteAssetCategory(id));
  }
  //Asset Subcategory Master
  assetSubcategoryCreate(data: any): Observable<any> {
    return this.http.post(routes.assetSubcategory.assetSubcategoryCreate(), data);
  }
  getassetSubcategoryList(entity_id: any): Observable<any> {
    return this.http.get(routes.assetSubcategory.assetSubcategoryList(entity_id));
  }
  getassetSubcategoryListActiveStatus(entity_id: any): Observable<any> {
    return this.http.get(routes.assetSubcategory.assetSubcategoryListActiveStatus(entity_id));
  }
  assetSubcategoryEdit(id: any, data: any): Observable<any> {
    return this.http.put(routes.assetSubcategory.assetSubcategoryEdit(id), data);
  }
  updateAssetSubcategoryStatus(id: any, data: any): Observable<any> {
    return this.http.put(routes.assetSubcategory.updateAssetSubcategoryStatus(id), data);
  }
  getassetSubcategoryById(id: any): Observable<any> {
    return this.http.get(routes.assetSubcategory.getassetSubcategoryById(id));
  }
  deleteAssetSubcategory(id: any): Observable<any> {
    return this.http.delete(routes.assetSubcategory.deleteAssetSubcategory(id));
  }
   //Asset Master
  assetMasterCreate(data: any): Observable<any> {
    return this.http.post(routes.assetMaster.assetMasterCreate(), data);
  }
  getAllAssetMaster(entity_id: any): Observable<any> {
    return this.http.get(routes.assetMaster.getAllAssetMaster(entity_id));
  }
  getAllAssetMasterActiveStatus(entity_id: any): Observable<any> {
    return this.http.get(routes.assetMaster.getAllAssetMasterActiveStatus(entity_id));
  }
  assetMasterUpdate(id: any, data: any): Observable<any> {
    return this.http.put(routes.assetMaster.assetMasterUpdate(id), data);
  }
  assetMasterStatusUpdate(id: any, data: any): Observable<any> {
    return this.http.put(routes.assetMaster.assetMasterStatusUpdate(id), data);
  }
  getAssetMasterById(id: any): Observable<any> {
    return this.http.get(routes.assetMaster.getAssetMasterById(id));
  }
  deleteAsseMasterById(id: any): Observable<any> {
    return this.http.delete(routes.assetMaster.deleteAsseMasterById(id));
  }

  //Notice Period Master
  noticePeriodCreate(data: any): Observable<any> {
    return this.http.post(routes.noticePeriod.noticePeriodCreate(), data);
  }
  getAllNoticePeriod(entity_id: any): Observable<any> {
    return this.http.get(routes.noticePeriod.getAllNoticePeriod(entity_id));
  }
  noticePeriodUpdate(id: any, data: any): Observable<any> {
    return this.http.put(routes.noticePeriod.noticePeriodUpdate(id), data);
  }
  updateNoticePeriodStatus(id: any, data: any): Observable<any> {
    return this.http.put(routes.noticePeriod.updateNoticePeriodStatus(id), data);
  }
  getNoticePeriodById(id: any): Observable<any> {
    return this.http.get(routes.noticePeriod.getNoticePeriodById(id));
  }
  deleteNoticePeriodById(id: any): Observable<any> {
    return this.http.delete(routes.noticePeriod.deleteNoticePeriodById(id));
  }
}

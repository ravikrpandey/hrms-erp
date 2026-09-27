import { Injectable } from '@angular/core';
import { map, BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/app/environments/environment';
import { Login } from '../model/Login.model';

const databaseKey: any = environment.serverUrl;

const routes = {
  recruitment: {
    createJob: () => `${databaseKey}/api/v1/job/create`,
    createJobPost: () => `${databaseKey}/api/v1/job/update`,
    recruitList: () => `${databaseKey}/api/v1/alljob`,
    getJobTitle: () => `${databaseKey}/api/v1/jobtitle/getall`,
    getJobType: () => `${databaseKey}/api/v1/jobtype/getall`,
    // getJobById: (jobId: any) => `${databaseKey}/api/v1/${jobId}`,
    getJobById: (jobId: any) => `${databaseKey}/api/v1/job/${jobId}`,

    deleteJob: () => `${databaseKey}/api/v1/job/deleteJob`,
    updateAll: (id: any) => `${databaseKey}/api/v1/job/updatejobdetails/${id}`,
    //jonTitleGet api change
    jobSpocRecruip: () => `${databaseKey}/api/auth/registrationallName`,
    titleJobGetId: (e: any) => `${databaseKey}/api/v1/jobtitle/getalllist/${e}`,
    titlejobGetData: () => `${databaseKey}/api/v1/jobs/list2`,
    updatePost: (jobId: any) => `${databaseKey}/api/v1/job/updateRound/${jobId}`,
    verticalGetData: () => `${databaseKey}/api/v1/job/verticle/list`,
    createCandidateProfile: () => `${databaseKey}/api/v1/createCondidate`,
    candidateList: () => `${databaseKey}/api/v1/getAllCondidate`,
    update: (candidate_id: any) =>
      `${databaseKey}/api/v1/editCondidate/${candidate_id}`,

    managersList: () => `${databaseKey}/api/auth/registrationallName`,
    jobRole: () => `${databaseKey}/api/v1/get_All_Post_Vancay`,
    allHrRole: () => `${databaseKey}/api/v1/getallassignby`,
    ///api/v1/alljob

    // new job details
    createJobDetails: () => `${databaseKey}/api/v1/createJob_descripition`,
    documentsUpdate: () => `${databaseKey}/documents`,
    uploaddocumentsUpdate: () => `${databaseKey}/documents`,

    getByJobDescription: (id: any) => `${databaseKey}/api/v1/getAll_job_descripition/${id}`,
    getAllJobDescription: (query: any) => `${databaseKey}/api/v1/get_all_job?user_id=${query?.user_id}&entity_id=${query?.entity_id}&user_role=${query?.user_role}&financial_year_id=${query?.financial_year_id }`,
    getApprovedJobRequest: () => `${databaseKey}/get_Approved_Jobdescription`,
    submitUserQuestion: (id: any) => `${databaseKey}/api/v1/get_user_selection_answer/${id}`,
    createUserData: (query: any) => `${databaseKey}/api/v1/createjob_email?jd_id=${query?.jd_id}&entityId=${query?.entityId }`
  },
  resignation: {
    createResignation: () => `${databaseKey}/api/v1/createEmployeeResignation`,
    createAllResignation: (id:any) => `${databaseKey}/api/v1/create_all_resignation_approval/${id}`,
    getAllResignationList: (id:any) => `${databaseKey}/api/v1/get_all_resignation_list/${id}`,
    getAllPendingResignationList: (id:any) => `${databaseKey}/api/v1/get_all_approved_resignation_list/${id}`,
    getAllApproveResignationList: () => `${databaseKey}/api/v1/getAllApprovedEmployeeResignation`,
    getResignation: (id:any) => `${databaseKey}/api/v1/getAllEmployeeResignation/${id}`,
    getAllChecklistApproval: (id:any) => `${databaseKey}/api/v1/getAllchecklistapproval/${id}`,
    getalllevelresignation: (id:any) => `${databaseKey}/api/v1/getAllApprovallevelResignation/${id}`,
    getAllOffBoarding: () => `${databaseKey}/api/v1/getOffboardingEmployee`,
    getPendingResignation: (id:any) => `${databaseKey}/api/v1/get_all_pending_Resignation/${id}`,
    getApprovelResignation: (id:any) => `${databaseKey}/api/v1/get_all_Approved_Resignation/${id}`,
    getRejectedResignation: (id:any) => `${databaseKey}/api/v1/get_all_Denied_Resignation/${id}`,
    getloggedInResignationList: (userId: any) => `${databaseKey}/api/v1/getByIdAllEmployeeResignation/${userId}`,
    editResignation: (resignId: any) => `${databaseKey}/api/v1/editEmployeeResignation/${resignId}`,
    getByIdResignation: (id: any) => `${databaseKey}/api/v1/getByIdEmployeeResignation/${id}`,
    deleteResignation: (id: any) => `${databaseKey}/api/v1/deleteEmployeeResignation/${id}`,
    changeResignStatus: (resignId: any) => `${databaseKey}/api/v1/Change_Resignation_status/${resignId}`,
    getResignationById: (id: any) => `${databaseKey}/api/get_all_employee_regsign_status/${id}`,
    getResignationApprovelLevelRequest: (id: any) => `${databaseKey}/api/v1/getAll_Resigantion_Approval_level/${id}`,
    updateMyResignationRequest: (id: any) => `${databaseKey}/api/v1/Resignation_approve_levels/${id}`,
    updateAllResignation: (id: any) => `${databaseKey}/api/v1/update_resignation/${id}`,
    allreview: (id: any) => `${databaseKey}/api/v1/getAllreviewList/${id}`,
    getbyidchecklistapproval: (id: any) => `${databaseKey}/api/v1/getIdbychecklistapproval/${id}`,
    
  },
  interviewlist: {
    getFixedInterview: () => `${databaseKey}/api/v1/getdropdownCandidate`,
    get_all_approved_candidates: () => `${databaseKey}/api/v1/get_all_approved_candidates`,


    getAllfixedInterview: () => `${databaseKey}/api/v1/getAllfixedInterview`,
    getAll_short_listed_data: () => `${databaseKey}/api/v1/getAll_short_listed_data`,


    candidate_Final_Shortlisted: () => `${databaseKey}/api/v1/candidate_Final_Shortlisted`,
    editFixedInterview: (fixedId: any) => `${databaseKey}/api/v1/FixingInterview/${fixedId}`,
    getByIdFixedInterview: (fixedId: any) => `${databaseKey}/api/v1/getByIdFixedInterview/${fixedId}`,
    getAllCandidate: () => `${databaseKey}/api/v1/getAllCandidate`,
    getAllShortListedCandidate: () => `${databaseKey}/api/v1/getCandidateShortlisted`,
    interViewGetIdBy: (candidate_id: any) => `${databaseKey}/api/v1/getByIdInterviewStatus/${candidate_id}`,
    interViewUpdate: (candidate_id: any) => `${databaseKey}/api/v1/editInterviewStatus/${candidate_id}`,
    getAllInterview: () => `${databaseKey}/api/v1/getAllInterviewStatus`,
    interviewById: (interview_id: any) => `${databaseKey}/api/v1/getByIdInterviewStatus/${interview_id}`,
  },
  achievement: {
    createAchievement: () => `${databaseKey}/api/v1/createAchievement`,
    achievementList: () => `${databaseKey}/api/v1/achievementsList`,
    getSalesPerson: () => `${databaseKey}/api/auth/allsalesPreson`,


    deleteAchievement: (achieveId: any) =>
      `${databaseKey}/api/v1/achievementDeleted/${achieveId}`,
    updateAchievement: (achieveId: any) =>
      `${databaseKey}/api/v1/achievementUpdate/${achieveId}`,
    achievementDetails: (id: any) =>
      `${databaseKey}/api/v1/achievementDetails/${id}`,
    getAllAchivemnet: () =>
      `${databaseKey}/api/auth/registrationallName`,
    getAllSalesPerson: () =>
      `${databaseKey}/api/auth/allsalesPreson`,
  },
  complaint: {
    createComplaint: () => `${databaseKey}/api/v1/createComplaint`,
    getcomplientuser: (id:any) => `${databaseKey}/api/v1/getcomplaintuser/${id}`,
    editComplaint: (complaintId: any) =>
      `${databaseKey}/api/v1/editComplaint/${complaintId}`,
    complaintById: (complaintId: any) =>
      `${databaseKey}/api/v1/getByIdComplaint/${complaintId}`,
    loggedInUserListComplaintGet: (loginId: any) => `${databaseKey}/api/v1/getByIdAllComplaint/${loginId}`,
    listComplaintGet: (entity_id:any,financial_year_id:any) =>
       `${databaseKey}/api/v1/getAllComplaint?entity_id=${entity_id}&financial_year_id=${financial_year_id}`,
    getAllMyComplaint: (entity_id:any,financial_year_id:any,employee_id:any) =>
       `${databaseKey}/api/v1/getAllMyComplaint?entity_id=${entity_id}&financial_year_id=${financial_year_id}&employee_id=${employee_id}`,
    deleteComplaint: (complaintId: any) =>
      `${databaseKey}/api/v1/deleteComplaint/${complaintId}`,
    getAll_against_complaint: (emp_id:any) =>`${databaseKey}/api/v1/getAll_against_complaint?emp_id=${emp_id}`,
    getAll_assigned_complaint: (emp_id:any) =>`${databaseKey}/api/v1/getAll_assigned_complaint?emp_id=${emp_id}`,
  },
  // PMS 
  performanceAppraisal: {
    createPerformanceAppraisal: () => `${databaseKey}/api/v1/create_initiate_performance_appraisal`,
    editPerformanceAppraisal: (initiate_performance_appraisal_id: any) => `${databaseKey}/api/v1/edit_initiate_performance_appraisal/${initiate_performance_appraisal_id}`,
    getPerformanceAppraisal: () => `${databaseKey}/api/v1/getAll_initiate_performance_appraisal`,
    getOnGoingPerformance: () => `${databaseKey}/api/v1/getAll_ongoing_initiate_performance_appraisal`,
    getCompletedPerformance: () => `${databaseKey}/api/v1/getAll_completed_initiate_performance_appraisal`,
    getByIdPerformanceAppraisal: (initiate_performance_appraisal_id: any) => `${databaseKey}/api/v1/get_ById_initiate_performance_appraisal/${initiate_performance_appraisal_id}`,
    deletePerformanceAppraisal: (initiate_performance_appraisal_id: any) => `${databaseKey}/api/v1/delete_initiate_performance_appraisal/${initiate_performance_appraisal_id}`
  },
  //Previous Goals

  previousGoals: {
    createPerviousGoals: () => `${databaseKey}/api/v1/create_previous_goal`,
    listPreviousGoals: (id: any) => `${databaseKey}/api/v1/get_ByEMPId_PREVIOUSLIST_goal/${id}`,
    editPreviousGoals: (previous_goal_id: any) => `${databaseKey}/api/v1/edit_previous_goal/${previous_goal_id}`,
    getByIePreviousGoals: (previous_goal_id: any) => `${databaseKey}/api/v1/get_ById_previous_goal/${previous_goal_id}`,
    deletePreviousGoals: (previous_goal_id: any) => `${databaseKey}/api/v1/delete_previous_goal/${previous_goal_id}`
  },
  // New Goal Defined
  newGoals: {
    createNewGoals: (id: any) => `${databaseKey}/api/v1/create_ByEMPId_new_goal/${id}`,
    listNewGoals: (id: any) => `${databaseKey}/api/v1/get_ByEMPId_NEWLIST_goal/${id}`,
    editNewGoals: (new_goal_id: any) => `${databaseKey}/api/v1/edit_new_goal/${new_goal_id}`,
    getByIdNewGoals: (new_goal_id: any) => `${databaseKey}/api/v1/get_ById_new_goal/${new_goal_id}`,
    deleteNewGoals: (new_goal_id: any) => `${databaseKey}/api/v1/delete_new_goal/${new_goal_id}`
  },

  // ManagerReview

  managerReviewed: {
    send_link: (id: any) => `${databaseKey}/api/v1/send_employee_contact_form/${id}`,
    create_emp: () => `${databaseKey}/api/v1/create_new_employee_details`,
    addPersonal: (id: any) => `${databaseKey}/api/v1/candidate_personal_details/${id}`,
    addPrevious: (id: any) => `${databaseKey}/api/v1/candidate_previous_employement_detail/${id}`,
    upload_doc: (id: any) => `${databaseKey}/api/v1/candidate_document_details/${id}`,
    hr_approving: (id: any) => `${databaseKey}/api/v1/apprrove_pending_emp/${id}`,
    editManagerReview: (manager_review_id: any) => `${databaseKey}/api/v1/edit_manager_review/${manager_review_id}`,
    getReviewedmanager: () => `${databaseKey}/api/v1/getAll_Reviewed_manager_review`,
    getPendingManager: () => `${databaseKey}/api/v1/getAll_Pending_manager_review`,
    getByIDManagerReview: (manager_review_id: any) => `${databaseKey}/api/v1/get_ById_manager_review/${manager_review_id}`,
    getByEMPIDselfAppraisal: (employee_id: any) => `${databaseKey}/api/v1/get_ByEMPId_self_appraisal/${employee_id}`,
    getByIDDesignation: (employee_id: any) => `${databaseKey}/api/v1/getbyid_designation_self_kpi/${employee_id}`,
    getByEMPIDNewGoal: (employee_id: any) => `${databaseKey}/api/v1/get_ByEMPId_new_goal/${employee_id}`,
    getByEMPIDPreviousGoal: (employee_id: any) => `${databaseKey}/api/v1/get_ByEMPId_previous_goal/${employee_id}`,
    calculateRating: (employee_id: any) => `${databaseKey}/api/v1/calculate_rating_manager/${employee_id}`,
    designation_self_kpi: (employee_id: any) => `${databaseKey}/api/v1/getbyid_designation_self_kpi/${employee_id}`,
  },
  // Functional head
  FunctionalHeadLogin: {
    editHeadReview: (head_review_id: any) => `${databaseKey}/api/v1/edit_head_review/${head_review_id}`,
    getReviewedHead: () => `${databaseKey}/api/v1/getAll_Reviewed_head_review`,
    getPendinghead: () => `${databaseKey}/api/v1/getAll_Pending_head_review`,
    getByIDHeadReview: (head_review_id: any) => `${databaseKey}/api/v1/get_ById_head_review/${head_review_id}`,
    calculatRating: (employee_id: any) => `${databaseKey}/api/v1/calculate_rating_head/${employee_id}`,
  },

  // KeyPerformance Indicator
  keyPerformanceIndicator: {
    createKeyPerformanceIndicator: () => `${databaseKey}/api/v1/create_key_performance_indicator`,
    editKeyPerformanceIndicator: (key_performance_indicator_id: any) => `${databaseKey}/api/v1/edit_key_performance_indicator/${key_performance_indicator_id}`,
    getKeyPerformanceIndicator: () => `${databaseKey}/api/v1/getAll_key_performance_indicator`,
    getByIDKeyPerformanceIndicator: (key_performance_indicator_id: any) => `${databaseKey}/api/v1/get_ById_key_performance_indicator/${key_performance_indicator_id}`,
    deleteKeyPerformanceIndicator: (key_performance_indicator_id: any) => `${databaseKey}/api/v1/delete_key_performance_indicator/${key_performance_indicator_id}`,
    editEMPFunctionalHead: (employee_id: any) => `${databaseKey}/api/v1/editbyEMP_ID_head_review/${employee_id}`,
    editEMPManagerReview: (employee_id: any) => `${databaseKey}/api/v1/editbyEMP_ID_manager_review/${employee_id}`
  },

  selfKeyPerformanceIndicator: {
    createSelfKeyPerformanceIndicator: () => `${databaseKey}/api/v1/create_Self_key_performance_indicator`,
    getByIDSelfKeyPerformanceIndicator: (keyPerformanceIndicator: any) => `${databaseKey}/api/v1/getAll_key_performance_indicator_on_role_base/${keyPerformanceIndicator}`,
  },


  background: {
    createCandidate: () => `${databaseKey}/api/v1/createCandidates`,
    getcandidateById: (verifyId: any) => `${databaseKey}/api/v1/getByCandidate/${verifyId}`,
    listCandidate: () => `${databaseKey}/api/v1/candidatesList`,
    createPdf: (bvg_id: any) => `${databaseKey}/api/v1/updatePdfCandidates/${bvg_id}`,
    createArray: () => `${databaseKey}/api/v1/createArrayCandidates`,
    backgroundVerification: () => `${databaseKey}/api/v1/createCandidates`,

  },
  // post vaccancy opening
  postVaccancy: {
    vaccancyCreate: () => `${databaseKey}/api/v1/createPostVancay`,
    vaccancyGet: () => `${databaseKey}/api/v1/getAllPostVancay`,
    vaccancyJobTypeGet: () => `${databaseKey}/api/v1/jobtype/getall`,
    vaccancyJobTitleGet: () => `${databaseKey}/api/v1/jobtitle/getall`,
    shareLinkedinPost: () => `https://api.linkedin.com/v2/ugcPosts`,
  },

  candidateProfile: {
    candidateProfileList: (id: any) => `${databaseKey}/api/v1/candidateProfileList/${id}`,
    candidateProfileShortlisted: () => `${databaseKey}/api/v1/candidateProfileShortlisted`,
    singleCandidateInfoById: (candidateId: any) => `${databaseKey}/api/v1/getByIdCandidate/${candidateId}`,
    candidateInfoById: (candidateId: any) => `${databaseKey}/api/v1/getByIdCandidate/${candidateId}`,
  },

  sheduledFixedInterview: {
    schedule_FixedInterview: () => `${databaseKey}/api/v1/schedule_FixedInterview`,
    editSchedule_FixedInterview: (iterview_id: any) => `${databaseKey}/api/v1/editSchedule_FixedInterview/${iterview_id}`,

    editIterview: (iterview_id: any) => `${databaseKey}/api/v1/schedule_interview_Date/${iterview_id}`,

    getSingleSchedule: (iterview_id: any) => `${databaseKey}/api/v1/getByIdCandidate/${iterview_id}`,
    updateFinalInterviewStatus: (candidate_id: any) => `${databaseKey}/api/v1/final_update_ShortlistedCandidate/${candidate_id}`,
    deleteFixedInterview: (candidate_id: any) => `${databaseKey}/api/v1/delete_fixed_interview/${candidate_id}`,
    getAllInterviewr: () => `${databaseKey}/api/v1/interviewerList`,
  },

  candidateShortList: {
    update_candidate: (id: any) => `${databaseKey}/api/v1/editCandidateShortlisted/${id}`,
    singleShortlisted_candidate: (id: any) => `${databaseKey}/api/v1/getByIdFixedInterview/${id}`,
    allCandidate: () => `${databaseKey}/api/v1/getAllCandidate`,
    allShortlisted_candidate: () => `${databaseKey}/api/v1/getAllCandidateShortListed`,
    update_status: (id: any) => `${databaseKey}/api/v1/editStatus/${id}`,
    goFor_onboard: (id: any) => `${databaseKey}/api/v1/employee_final_background__verification/${id}`,
    allOnboardList: (id: any) => `${databaseKey}/api/v1/get_all_background_verified_employee/${id}`,
    getAllSelectEmp: () => `${databaseKey}/api/v1/get_all_unverifid_emp`,
    getrejectAllCondidate: () => `${databaseKey}/api/v1/Get_all_Ex_Employee_list`,
    noticPeriodList: () => `${databaseKey}/api/v1/get_all_Notice_period_serving_employee`,
    get_all_LOI_sended: (id: any) => `${databaseKey}/api/v1/get_all_LOI_sended/${id}`,
    convert_noticEmptoExemp: () => `${databaseKey}/api/v1/changing_status_Notice_period_employee`,
  },
  hrDeskboard: {
    HrDashboardList: () => `${databaseKey}/api/v1/hrDashboardList`,
    getSingleInHrDeshboard: (candidate_id: any) => `${databaseKey}/api/v1/singleCandidate_HrDashboard/${candidate_id}`,
  },

  onBoarding: {
    onBoarding: () => `${databaseKey}/api/v1/getfinalCandidateShortlisted`,
    getSingleData: (candidate_id: any) => `${databaseKey}/api/v1/getbyidfinalCandidateShortlisted/${candidate_id}`,
  },


  selfAppraisal: {
    updateRatingById: (id: any) => `${databaseKey}/api/v1/edit_self_appraisal/${id}`,
  },

  hrReview: {
    getAllHrReviewlist: () => `${databaseKey}/api/v1/getAll_self_appraisal_hr`,
    getAllHeadReviewlist: () => `${databaseKey}/api/v1/getAll_head_review`,
    getEmployeStatus: (id: any) => `${databaseKey}/api/v1/get_ByempId_hr_review/${id}`,
    calculateTotalRating: (id: any) => `${databaseKey}/api/v1/calculate_rating_hr/${id}`,
    getAllCommentById: (id: any) => `${databaseKey}/api/v1/getbyid_emp_comment/${id}`
  },

  gratuity :{
    calculateGratuity:()=>`${databaseKey}/api/v1/calculateGratuity`

  }

};

@Injectable({
  providedIn: 'root',
})
export class RecruitService {
  newData: any;
  private messageSource = new BehaviorSubject<any>("default message");
  currentMessage = this.messageSource.asObservable();
  constructor(private httpclient: HttpClient, private http: HttpClient) { }
  // userS: any = new BehaviorSubject(null);
  // Recruitment Module API's

  changeMessage(message: string) {
    this.messageSource.next(message);
  }
  createJob(data: any): Observable<any> {
    return this.httpclient.post(routes.recruitment.createJob(), data);
  }

  deleteJob(data: any): Observable<any> {
    return this.httpclient.post(routes.recruitment.deleteJob(), data);
  }

  deleteAchievement(achieveId: any, data: any): Observable<any> {
    return this.httpclient.put(
      routes.achievement.deleteAchievement(achieveId),
      data
    );
  }
  updateAchievement(achieveId: any, data: any): Observable<any> {
    return this.httpclient.put(
      routes.achievement.updateAchievement(achieveId),
      data
    );
  }
  createJobPost(dataNew: any): Observable<any> {
    return this.httpclient.post(routes.recruitment.createJobPost(), dataNew);
  }

  getSpocRecruipment() {
    return this.httpclient.get(routes.recruitment.jobSpocRecruip())
  }
  //AllHrRole based on Job Description
  allHrRoleJobDescription() {
    return this.httpclient.get(routes.recruitment.allHrRole())
  }
  //AchievementList
  getAchievementList() {
    return this.httpclient.get(routes.achievement.achievementList());
  }
  getSalesPerson() {
    return this.httpclient.get(routes.achievement.getSalesPerson());
  }
  //achivement get by id
  achivementAddedById(id: any): Observable<any> {
    return this.httpclient.get<any>(routes.achievement.achievementDetails(id));
  }
  getJobById(jobId: any): Observable<any> {
    return this.httpclient.get(routes.recruitment.getJobById(jobId));
  }

  updateAll(id: any, dataUpdate: any): Observable<any> {
    return this.httpclient.put(routes.recruitment.updateAll(id), dataUpdate);
  }
  getJobTitle() {
    return this.httpclient.get(routes.recruitment.getJobTitle());
  }

  getJobType() {
    return this.httpclient.get(routes.recruitment.getJobType());
  }
  createAchievement(data: any): Observable<any> {
    return this.httpclient.post(routes.achievement.createAchievement(), data);
  }

  //achievementdialogBox
  achievementDetails(listById: any): Observable<any> {
    return this.httpclient.get(routes.achievement.achievementDetails(listById));
  }
  //complaintDialogBox
  getByIdcomplaint(complaintId: any): Observable<any> {
    return this.httpclient.get(routes.complaint.complaintById(complaintId));
  }

  getRecruitList() {
    return this.httpclient.get(routes.recruitment.recruitList());
  }
  //createComplaint

  createComplaint(data: any): Observable<any> {
    return this.httpclient.post(routes.complaint.createComplaint(), data);
    
  }
  calculateGratuity(payload: any): Observable<any> {
    return this.httpclient.post(routes.gratuity.calculateGratuity(), payload);
    
  }
  getListComplaint(entity_id:any,financial_year_id:any): Observable<any> {
    return this.httpclient.get(routes.complaint.listComplaintGet(entity_id,financial_year_id));
  }
  getAllMyComplaint(entity_id:any,financial_year_id:any, employee_id: any): Observable<any> {
    return this.httpclient.get(routes.complaint.getAllMyComplaint(entity_id,financial_year_id,employee_id));
  }
  getLoggedInUserListComplaint(loginId: any): Observable<any> {
    return this.httpclient.get(routes.complaint.loggedInUserListComplaintGet(loginId));
  }

  // getAll_Country_codes(): Observable<any> {
  //   return this.http.get(routes.recruitment.getAll_Country_codes());
  // }

  editComplaint(employee_complaint_id: any, data: any): Observable<any> {
    return this.httpclient.put(routes.complaint.editComplaint(employee_complaint_id), data);
  }


  deleteComplaint(employee_complaint_id: any): Observable<any> {
    return this.httpclient.delete(
      routes.complaint.deleteComplaint(employee_complaint_id),
    );
  }
  getAll_against_complaint(emp_id:any): Observable<any> {
    return this.httpclient.get(routes.complaint.getAll_against_complaint(emp_id));
  }
  getAll_assigned_complaint(emp_id:any): Observable<any> {
    return this.httpclient.get(routes.complaint.getAll_assigned_complaint(emp_id));
  }

  getcomplientuser(id:any): Observable<any> {
    return this.httpclient.get(routes.complaint.getcomplientuser(id));
  }
  // Performance Appraisal 

  performanceApraisalCreate(data: any): Observable<any> {
    return this.httpclient.post(routes.performanceAppraisal.createPerformanceAppraisal(), data)
  }
  performanceApraisalList(): Observable<any> {
    return this.httpclient.get(routes.performanceAppraisal.getPerformanceAppraisal())
  }
  performanceOnGoingList(): Observable<any> {
    return this.httpclient.get(routes.performanceAppraisal.getOnGoingPerformance())
  }
  performanceCompletedList(): Observable<any> {
    return this.httpclient.get(routes.performanceAppraisal.getCompletedPerformance())
  }
  performanceApraisalUpdate(initiate_performance_appraisal_id: any, data: any): Observable<any> {
    return this.httpclient.put(routes.performanceAppraisal.editPerformanceAppraisal(initiate_performance_appraisal_id), data)
  }
  getByIdPerformance(initiate_performance_appraisal_id: any): Observable<any> {
    return this.httpclient.get(routes.performanceAppraisal.getByIdPerformanceAppraisal(initiate_performance_appraisal_id))
  }

  performanceApraisalDelete(initiate_performance_appraisal_id: any): Observable<any> {
    return this.httpclient.delete(routes.performanceAppraisal.deletePerformanceAppraisal(initiate_performance_appraisal_id))
  }

  // KeyPerformance Indicator
  keyPerformanceIndicatorCreate(data: any): Observable<any> {
    return this.httpclient.post(routes.keyPerformanceIndicator.createKeyPerformanceIndicator(), data)
  }
  keyPerformanceIndicatorList(): Observable<any> {
    return this.httpclient.get(routes.keyPerformanceIndicator.getKeyPerformanceIndicator())
  }
  keyPerformanceIndicatorUpdate(key_performance_indicator_id: any, data: any): Observable<any> {
    return this.httpclient.put(routes.keyPerformanceIndicator.editKeyPerformanceIndicator(key_performance_indicator_id), data)
  }
  keyPerformanceIndicatorByID(keyPerformanceIndicator: any): Observable<any> {
    return this.httpclient.get(routes.keyPerformanceIndicator.getByIDKeyPerformanceIndicator(keyPerformanceIndicator))
  }
  keyPerformanceIndicatorDelete(keyPerformanceIndicator: any): Observable<any> {
    return this.httpclient.delete(routes.keyPerformanceIndicator.deleteKeyPerformanceIndicator(keyPerformanceIndicator))
  }
  editFunctionHeadStatus(employee_id: any, data: any): Observable<any> {
    return this.http.put(routes.keyPerformanceIndicator.editEMPFunctionalHead(employee_id), data)
  }
  editManagerStatus(employee_id: any, data: any): Observable<any> {
    return this.http.put(routes.keyPerformanceIndicator.editEMPManagerReview(employee_id), data)
  }
  // self KeyPerformance Indicator

  selfKeyPerformanceIndicatorCreate(data: any): Observable<any> {
    return this.httpclient.post(routes.selfKeyPerformanceIndicator.createSelfKeyPerformanceIndicator(), data)
  }
  selfKeyPerformanceIndicatorByID(keyPerformanceIndicator: any): Observable<any> {
    return this.httpclient.get(routes.selfKeyPerformanceIndicator.getByIDSelfKeyPerformanceIndicator(keyPerformanceIndicator))
  }

  // Resignation
  createResignation(data: any) {
    return this.httpclient.post(routes.resignation.createResignation(), data)
  }

  createAllResignation(data: any,id:any) {
    return this.httpclient.post(routes.resignation.createAllResignation(id), data)
  }

  getAllResignationList(id:any) {
    return this.httpclient.get(routes.resignation.getAllResignationList(id));
  }

  getAllPendingResignationList(id:any) {
    return this.httpclient.get(routes.resignation.getAllPendingResignationList(id));
  }
  getAllApproveResignationList() {
    return this.httpclient.get(routes.resignation.getAllApproveResignationList());
  }

  // getResignation() {
  //   return this.httpclient.get(routes.resignation.getResignation())
  // }

  getAllSalesPerson(): Observable<any> {
    return this.httpclient.get<any>(routes.achievement.getAllSalesPerson());
  };
  getAllAchivement(): Observable<any> {
    return this.httpclient.get<any>(routes.achievement.getAllAchivemnet());
  };
  getResignation(id:any) {
    return this.httpclient.get(routes.resignation.getResignation(id))
  }
  getAllChecklistApproval(id:any) {
    return this.httpclient.get(routes.resignation.getAllChecklistApproval(id))
  }
  getalllevelresignation(id:any) {
    return this.httpclient.get(routes.resignation.getalllevelresignation(id))
  }
  getAllOffBoarding() {
    return this.httpclient.get(routes.resignation.getAllOffBoarding())
  }
  getPendingResignation(id:any) {
    return this.httpclient.get(routes.resignation.getPendingResignation(id))
  }
  getApprovelResignation(id:any) {
    return this.httpclient.get(routes.resignation.getApprovelResignation(id))
  }
  getRejectedResignation(id:any) {
    return this.httpclient.get(routes.resignation.getRejectedResignation(id))
  }
  getloggedInResignationList(userId: any) {
    return this.httpclient.get(routes.resignation.getloggedInResignationList(userId))
  }
  editResignation(resignId: any, data: any) {
    return this.httpclient.put(routes.resignation.editResignation(resignId), data);
  }
  getIdResignation(id: any) {
    return this.httpclient.get(routes.resignation.getByIdResignation(id));
  }
  deleteResignation(id: any, data: any) {
    return this.httpclient.delete(routes.resignation.deleteResignation(id), data);
  }
  statusResignation(resignId: any, data: any) {
    return this.httpclient.put(routes.resignation.changeResignStatus(resignId), data)
  }
  getResignationByID(id: any) {
    return this.httpclient.get(routes.resignation.getResignationById(id));
  }

  getResignationApprovelLevelRequest(id: any, data: any) {
    return this.httpclient.post(routes.resignation.getResignationApprovelLevelRequest(id), data)
  }

  updateMyResignationRequest(id: any, data: any) {
    return this.httpclient.post(routes.resignation.updateMyResignationRequest(id), data)
  }

  updateAllResignation(id: any, data: any) {
    return this.httpclient.put(routes.resignation.updateAllResignation(id), data)
  }

  allreview(id: any) {
    return this.httpclient.get(routes.resignation.allreview(id))
  }

  getbyidchecklistapproval(id:any){
    return this.httpclient.get(routes.resignation.getbyidchecklistapproval(id))
  }

  //post vaccancy opening
  createPostVaccancy(data: any) {
    return this.httpclient.post(routes.postVaccancy.vaccancyCreate(), data)
  }

  getPostVaccancy() {
    return this.httpclient.get(routes.postVaccancy.vaccancyGet())
  }

  getJobTypeVaccancy() {
    return this.httpclient.get(routes.postVaccancy.vaccancyJobTypeGet())
  }

  getJobTitleVaccancy() {
    return this.httpclient.get(routes.postVaccancy.vaccancyJobTitleGet())
  }
  linkedinPostshare(data: any): Observable<any> {
    let header = new HttpHeaders().set(
      "Authorization",
      'AQV6NUaFuMmz8qa0id57CpYzSpzQSEinESAPCixhAPXRV3Sl9d1kTBGULVmy45vLNRod7Sgug_sSSZXIBJBz_yfpvm-sA-l5el48abPzJRuikX_RMznH4uYybsK0r2Yq66YSVPdehPmxJ3wjRFX3O58a5N0Nb2_C5_lLrEdLDlPScaWjJiBcVCcBhaiBqniHRJ7B-GPSz3zc_SBnBOFiBejxC4Fg7ZoKDaUz0vtNnkgVIMVj-5iSKKkmrJD0bnAS_zJtorH0aOt6E2TEEryHn6hzrcD5ev1pO-VlVUuo3QQoVoHiK_4OgutaOqyryMRGmOTeZvEvHG7CXxyyX6Oc7iRQvpJ7ew'
    );
    return this.httpclient.post(routes.postVaccancy.shareLinkedinPost(), { headers: header }, data);
  }
  // linkedinPostshare(data: any): Observable<any> {
  //   return this.http.post<any>(routes.postVaccancy.shareLinkedinPost(), data).pipe(
  //     tap(res => {
  //       this.authenticationUser(data.employee_official_email, res.accessToken, res.employee_photo, res.first_name, res.employee_id)
  //     })
  //   )
  // };
  // authenticationUser(employee_official_email: string, token: string, img: string, name: string, employee_id: number) {
  //   const userS = new Login(employee_official_email, token, img, name)
  //   this.userS.next(userS)
  //   localStorage.setItem('postJob', JSON.stringify(userS))
  //   return userS
  // };
  update_candidate(id: any, data: any): Observable<any> {
    return this.httpclient.put<any>(routes.candidateShortList.update_candidate(id), data);
  };

  singleShortlisted_candidate(id: any): Observable<any> {
    return this.httpclient.get<any>(routes.candidateShortList.singleShortlisted_candidate(id));
  };

  update_status(id: any, data: any): Observable<any> {
    return this.httpclient.put<any>(routes.candidateShortList.update_status(id), data);
  };
  goFor_onboard(id: any, data: any): Observable<any> {
    return this.httpclient.patch<any>(routes.candidateShortList.goFor_onboard(id), data);
  };






  allOnboardList(id: any, data: any): Observable<any> {
    return this.httpclient.post<any>(routes.candidateShortList.allOnboardList(id), data);
  };

  getAllSelectEmp() {
    return this.httpclient.get<any>(routes.candidateShortList.getAllSelectEmp());
  }

  getAllOffersendedList(id: any, data: any) {
    return this.httpclient.post<any>(routes.candidateShortList.get_all_LOI_sended(id), data);
  }

  allCandidate(): Observable<any> {
    return this.httpclient.get<any>(routes.candidateShortList.allCandidate());
  };

  allShortlisted_candidate(): Observable<any> {
    return this.httpclient.get<any>(routes.candidateShortList.allShortlisted_candidate());
  };


  // Background verification
  listCandidate(): Observable<any> {
    return this.httpclient.get(routes.background.listCandidate())
  }

  backgroundVerification(verifyData: any, fileData: any): Observable<any> {
    console.log(verifyData, "verifyDataverifyDataverifyDataverifyData");

    const formData = new FormData();
    // "email": "demo@gmail.com",
    // "email_verification": true,
    // "mobile_no": "7485968522",
    // "phone_verification": true,
    // "candidate_id": 202,
    // "candidate_name": "demo12"

    if (verifyData) {
      formData.append("precious_job_status", JSON.stringify(verifyData.precious_job_status));
      formData.append('email', verifyData.email);
      formData.append('email_verification', verifyData.email_verification);
      formData.append('mobile_no', verifyData.mobile_no);
      formData.append('phone_verification', verifyData.phone_verification);
      formData.append('candidate_id', verifyData.candidate_id);
      formData.append('candidate_name', verifyData.candidate_name);

    }
    if (fileData) {
      formData.append("others_documents", fileData, fileData.name);
    }

    return this.httpclient.post<any>(routes.background.backgroundVerification(), formData)
  }


  createPdf(bvg_id: any, file: File): Observable<any> {
    const formData = new FormData();
    if (file) {
      formData.append('others_documents', file, file.name);
    } else {
      formData.append('others_documents', 'undefined');
    }

    return this.httpclient.put(routes.background.createPdf(bvg_id), formData);
  }

  getJobTitleId(e: any) {
    // 

    return this.httpclient.get(routes.recruitment.titleJobGetId(e))
  }

  getJobTitleData() {
    return this.httpclient.get(routes.recruitment.titlejobGetData())
  }

  updatePost(jobId: any, data: any) {
    return this.httpclient.put(routes.recruitment.updatePost(jobId), data)
    // createCandidate(data:any){
    //   return this.httpclient.post(routes.background.createCandidate(),data)
    // }
  }
  createCandidate(data: any) {
    return this.httpclient.post(routes.background.createCandidate(), data)
  }
  getAllCandidate() {
    return this.httpclient.get(routes.interviewlist.getAllCandidate())
  };

  getAllShortListedCandidate(): Observable<any> {
    return this.httpclient.get<any>(routes.interviewlist.getAllShortListedCandidate())
  }
  getFixedInterview() {
    return this.httpclient.get(routes.interviewlist.getFixedInterview())
  }

  get_approved_candidates() {
    return this.httpclient.get(routes.interviewlist.get_all_approved_candidates())
  }




  getAllfixedInterview() {
    return this.httpclient.get(routes.interviewlist.getAllfixedInterview())
  }

  getAllfinalList() {
    return this.httpclient.get(routes.interviewlist.getAll_short_listed_data())
  }

  candidate_Final_Shortlisted() {
    return this.httpclient.get(routes.interviewlist.candidate_Final_Shortlisted())
  }
  editFixedInterview(fixedId: any, data: any) {
    return this.httpclient.put(routes.interviewlist.editFixedInterview(fixedId), data);
  }
  getByIdFixedInterview(fixedId: any) {
    return this.httpclient.get(routes.interviewlist.getByIdFixedInterview(fixedId));
  }
  // Update Interviewlist Data
  updateInterviewlist(candidate_id: any, formData: any) {
    // return this.httpclient.put(
    //   routes.recruitment.update(candidate_id),
    //   formData
    // );
  }

  interViewGetIdBy(candidate_id: any) {
    return this.httpclient.get(routes.interviewlist.interViewGetIdBy(candidate_id))
  }

  interViewUpdate(candidate_id: any, data: any) {
    return this.httpclient.put(routes.interviewlist.interViewUpdate(candidate_id), data)
  }
  getAllInterview() {
    return this.httpclient.get(routes.interviewlist.getAllInterview());
  }
  getcandidateById(verifyId: any) {
    return this.httpclient.get(routes.background.getcandidateById(verifyId));
  }
  interviewById(interview_id: any) {
    return this.httpclient.get(routes.interviewlist.interviewById(interview_id));
  }
  getVerticalData(): Observable<any> {
    return this.httpclient.get(routes.recruitment.verticalGetData())
  }


  // candidate profile

  candidateProfileList(id: any): Observable<any> {
    return this.httpclient.get<any>(routes.candidateProfile.candidateProfileList(id))
  };

  candidateProfileShortlisted(): Observable<any> {
    return this.httpclient.get<any>(routes.candidateProfile.candidateProfileShortlisted())
  };

  singleCandidateInfoById(id: any): Observable<any> {
    return this.httpclient.get<any>(routes.candidateProfile.singleCandidateInfoById(id));
  };

  // sheduled fixed interview
  schedule_FixedInterview(data: any): Observable<any> {
    return this.httpclient.post<any>(routes.sheduledFixedInterview.schedule_FixedInterview(), data);
  };

  editSchedule_FixedInterview(id: any, data: any): Observable<any> {
    return this.httpclient.put<any>(routes.sheduledFixedInterview.editSchedule_FixedInterview(id), data);
  };

  editSchedule_iterview(id: any, data: any): Observable<any> {
    return this.httpclient.patch(routes.sheduledFixedInterview.editIterview(id), data);
  };

  updateFinalInterviewStatus(id: any, data: any): Observable<any> {
    return this.httpclient.put<any>(routes.sheduledFixedInterview.updateFinalInterviewStatus(id), data);
  };
  deleteFixedInterview(id: any, data: any): Observable<any> {
    return this.httpclient.delete<any>(routes.sheduledFixedInterview.deleteFixedInterview(id), data);
  };

  getAllInterviewr(): Observable<any> {
    return this.httpclient.get<any>(routes.sheduledFixedInterview.getAllInterviewr());
  };


  // Create Candidate profile
  createCandidateProfile(data: any, file: any): Observable<any> {
    const formData = new FormData();
    if (file) {
      formData.append('upload_resume', file, file.name);
    } else {
      formData.append('upload_resume', 'undefined');
    }
    for (let key in data) {
      formData.append(`${key}`, data[key]);
    }

    return this.httpclient.post(
      routes.recruitment.createCandidateProfile(),
      formData
    );
  }
  // get all Candidate List
  getCandidateList() {
    return this.httpclient.get(routes.recruitment.candidateList());
  }

  // Update Candidate Data
  updateCandidateProfile(candidate_id: any, formData: any) {
    return this.httpclient.patch(
      routes.recruitment.update(candidate_id),
      formData
    );
  }

  // get candidate data by using id
  candidateInfoById(id: any) {
    return this.httpclient.get(routes.candidateProfile.candidateInfoById(id));
  }
  // get candidate data by using id
  getHiringManagersList(): Observable<any> {
    return this.httpclient.get(routes.recruitment.managersList());
  }
  jobRole(): Observable<any> {
    return this.httpclient.get(routes.recruitment.jobRole());
  }

  // hr dashboard /jobRole
  HrDashboardList(): Observable<any> {
    return this.httpclient.get<any>(routes.hrDeskboard.HrDashboardList());
  }

  singleCandidateInHrDashboard(id: any): Observable<any> {
    return this.httpclient.get<any>(routes.hrDeskboard.getSingleInHrDeshboard(id));
  }

  //On Boarding Employee
  onBoargingList(): Observable<any> {
    return this.httpclient.get<any>(routes.onBoarding.onBoarding());
  }

  getSingleOnBoarding(id: any): Observable<any> {
    return this.httpclient.get<any>(routes.onBoarding.getSingleData(id));
  }

  // Previous Goals API's
  previousGoalsCreate(data: any): Observable<any> {
    return this.http.post(routes.previousGoals.createPerviousGoals(), data)
  }
  previousGoalsList(id: any): Observable<any> {
    return this.http.get(routes.previousGoals.listPreviousGoals(id))
  }
  previousGoalsEdit(previous_goal_id: any, data: any): Observable<any> {
    return this.http.put(routes.previousGoals.editPreviousGoals(previous_goal_id), data)
  }
  previousGoalsGetByID(previous_goal_id: any): Observable<any> {
    return this.http.get(routes.previousGoals.getByIePreviousGoals(previous_goal_id))
  }
  previousGoalsDelete(previous_goal_id: any): Observable<any> {
    return this.http.delete(routes.previousGoals.deletePreviousGoals(previous_goal_id))
  }

  // New Goals API's
  newGoalsCreate(id: any, data: any): Observable<any> {
    return this.http.post(routes.newGoals.createNewGoals(id), data);
  }
  newGoalsList(id: any): Observable<any> {
    return this.http.get(routes.newGoals.listNewGoals(id))
  }
  newGoalsEdit(new_goal_id: any, data: any): Observable<any> {
    return this.http.put(routes.newGoals.editNewGoals(new_goal_id), data)
  }
  newGoalsGetByID(new_goal_id: any): Observable<any> {
    return this.http.get(routes.newGoals.getByIdNewGoals(new_goal_id))
  }
  newGoalDelete(new_goal_id: any): Observable<any> {
    return this.http.delete(routes.newGoals.deleteNewGoals(new_goal_id))
  }

  // ManagerReview

  ListPendingManager(): Observable<any> {
    return this.http.get(routes.managerReviewed.getPendingManager())
  }

  ListReviewedManager(): Observable<any> {
    return this.http.get(routes.managerReviewed.getReviewedmanager())
  }

  editManagerR(manager_review_id: any, data: any): Observable<any> {
    return this.http.put(routes.managerReviewed.editManagerReview(manager_review_id), data)
  }

  getByIDManagerr(manager_review_id: any): Observable<any> {
    return this.http.get(routes.managerReviewed.getByIDManagerReview(manager_review_id))
  }

  getByEMPiDAppRaisal(employee_id: any): Observable<any> {
    return this.http.get(routes.managerReviewed.getByEMPIDselfAppraisal(employee_id))
  }
  getbyIDDesignation(employee_id: any): Observable<any> {
    return this.http.get(routes.managerReviewed.getByIDDesignation(employee_id))
  }
  getByEMPiDNewwGoaal(employee_id: any): Observable<any> {
    return this.http.get(routes.managerReviewed.getByEMPIDNewGoal(employee_id))
  }
  getByEMPiDPrevioussGoall(employee_id: any): Observable<any> {
    return this.http.get(routes.managerReviewed.getByEMPIDPreviousGoal(employee_id))
  }

  // functional head 
  ListPendingHead(): Observable<any> {
    return this.http.get(routes.FunctionalHeadLogin.getPendinghead())
  }
  listReviewedHead(): Observable<any> {
    return this.http.get(routes.FunctionalHeadLogin.getReviewedHead())
  }
  getByHeadID(head_review_id: any): Observable<any> {
    return this.http.get(routes.FunctionalHeadLogin.getByIDHeadReview(head_review_id))
  }
  calculatingRating(employee_id: any): Observable<any> {
    return this.http.get(routes.FunctionalHeadLogin.calculatRating(employee_id))
  }


  updatePreviousRating(id: any, data: any): Observable<any> {
    console.log(id, data, "iddd++++datata");
    return this.http.put(routes.previousGoals.editPreviousGoals(id), data)
  }

  updateNewRating(id: any, data: any): Observable<any> {
    console.log(id, data, "iddd++++datata");

    return this.http.put(routes.newGoals.editNewGoals(id), data)

  }

  updateSelfApraisalRating(id: any, data: any): Observable<any> {
    return this.http.put(routes.selfAppraisal.updateRatingById(id), data)
  }

  getAllHrReviewlist(): Observable<any> {
    return this.http.get(routes.hrReview.getAllHrReviewlist())
  }

  getAllHeadReviewlist(): Observable<any> {
    return this.http.get(routes.hrReview.getAllHeadReviewlist())
  }

  getEmployeStatus(employee_id: any): Observable<any> {
    return this.http.get(routes.hrReview.getEmployeStatus(employee_id))
  }

  calculateTotalRating(id: any): Observable<any> {
    return this.http.get(routes.hrReview.calculateTotalRating(id))
  }

  calculateManagerRating(id: any): Observable<any> {
    return this.http.get(routes.managerReviewed.calculateRating(id))
  }
  designation_self_kpi(id: any): Observable<any> {
    return this.http.get(routes.managerReviewed.designation_self_kpi(id))
  }

  calculateHeadRating(id: any): Observable<any> {
    return this.http.get(routes.FunctionalHeadLogin.calculatRating(id))
  }
  getAllCommentById(id: any): Observable<any> {
    return this.http.get(routes.hrReview.getAllCommentById(id))
  }

  sendForm(id: any, data: any): Observable<any> {
    return this.http.patch(routes.managerReviewed.send_link(id), data)
  }


  createNewEmp(data: any): Observable<any> {
    return this.http.post<any>(routes.managerReviewed.create_emp(), data)
  }

  addPersonal(id: any, data: any) {
    return this.http.patch(routes.managerReviewed.addPersonal(id), data)
  }

  addPrevious(id: any, data: any) {
    return this.http.patch(routes.managerReviewed.addPrevious(id), data)
  }
  upload_doc(id: any, data: any) {
    return this.http.patch(routes.managerReviewed.upload_doc(id), data)
  }

  approvedCandidate(id: any, data: any) {
    return this.http.patch(routes.managerReviewed.hr_approving(id), data)
  }

  getrejectAllCondidate() {
    return this.http.get(routes.candidateShortList.getrejectAllCondidate())
  }
  noticPeriodList() {
    return this.http.get(routes.candidateShortList.noticPeriodList())
  }
  convert_noticEmptoExemp(id: any) {
    return this.http.patch(routes.candidateShortList.convert_noticEmptoExemp(), id)
  }

  // new job details

  createJobDetails(data: any) {
    return this.http.post(routes.recruitment.createJobDetails(), data)
  }

  documentsUpdate(data: any) {
    return this.http.post(routes.recruitment.documentsUpdate(), data)
  }
  uploaddocumentsUpdate(data: any) {
    return this.http.post(routes.recruitment.uploaddocumentsUpdate(), data)
  }
  getByJobDescription(id: any) {
    return this.http.get(routes.recruitment.getByJobDescription(id))
  }
  getAllJobDescription(query: any) {
    return this.http.get(routes.recruitment.getAllJobDescription(query))
  }

  getApprovedJobRequest() {
    return this.http.get(routes.recruitment.getApprovedJobRequest())
  }


  submitUserQuestion(id: any, data: any) {
    return this.http.put(routes.recruitment.submitUserQuestion(id), data)
  }

  createUserData(query: any) {
    return this.http.post(routes.recruitment.createUserData(query), null)
  }
}

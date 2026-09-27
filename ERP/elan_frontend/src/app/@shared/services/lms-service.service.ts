import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { Subject } from 'rxjs'
import { HttpResponse } from '@angular/common/http';

const databaseKey: any = environment.servralUrl;
const routes = {
  logIn:{
    login: () => `${databaseKey}/api/auth/signin`,
  },
  lmsManager:{
    userListbyReportingManager:(e:any)=>`${databaseKey}/api/v1/AssignedUser_list/${e}`,
    userListbyReportinManagers:(e:any)=>`${databaseKey}/api/v1/AssignedUser_list_byreportmanger/${e}`,

    //
  },
  lmsUser: {
    userList: () => `${databaseKey}/api/v1/getAll_New_user`,
    userSelectDropdownName_Code: () => `${databaseKey}/api/v1/userAllData`,
    userSelectDropdown_Role: () => `${databaseKey}/api/v1/getAllRoleMaster`,
    createUserList: () => `${databaseKey}/api/v1/create_add_user_course`,
    createCSV_File: () => `${databaseKey}/api/v1/uploadCsv`,
    deleteById: (e: any) => `${databaseKey}/api/v1/delete_New_user/${e}`,
    getById: (e: any) => `${databaseKey}/api/v1/get_All_User_Course/${e}`,
    toDoList: () => `${databaseKey}/api/v1/getAllCourse`,
    toDoListById: (e: any) => `${databaseKey}/api/v1/getById_getAll_Course/${e}`,
    requestByUserId: (e: any) => `${databaseKey}/api/v1/getByIdCourse/${e}`,
    videoList: () => `${databaseKey}/api/v1/get_All_Video_list`,
    assignUserList: () => `${databaseKey}/api/v1/AssignedUser_list_traning_author`,
    
    
    
    

  },

  lmsScheduleTraining: {
    assignUserListByTrainingID: (id:any) => `${databaseKey}/api/v1/get_All_User_Course/${id}`,
    // reassignUserListByTrainingID: (id:any) => `${databaseKey}/api/v1/getAll_list_re_assigned/${id}`,
    reassignUserListByTrainingID: (id:any) => `${databaseKey}/api/v1/AssignedUser_list_course_id/${id}`,

    scheduleTrainingList: (id:any) => `${databaseKey}/api/v1/getbyempidAllCource/${id}`,
    scheduleTrainingSingleDataByID: (e: any) => `${databaseKey}/api/v1/get_ById_New_Traning/${e}`,
    categoryList: () => `${databaseKey}/api/v1/getAllDepartment`,
    editCheck: (e:any) => `${databaseKey}/api/v1/editCheck_content2/${e}`,


    //
    branchList: () => `${databaseKey}/api/v1/get_All_Branch`,
    regionList: () => `${databaseKey}/api/v1/region_List`,
    multiUserList: () => `${databaseKey}/api/v1/get_All_User`,
    getUserByCategoryList: (param:any) => `${databaseKey}/api/v1/getAllData_category/${param}`,
    getAllUserByCategoryList: () => `${databaseKey}/api/v1/get_All_User`,
    checkDuplicate: (id:any) => `${databaseKey}/api/v1/Check_find_emp_id/${id}`,

    //
    editTrainingData: (id: any) => `${databaseKey}/api/v1/edit_New_Traning/${id}`,
    createTrainingList: () => `${databaseKey}/api/v1/create_New_user`,
    cencel_training_by_ID: (e: any) => `${databaseKey}/api/v1/cancel_Traning/${e}`,
    assign_course_to_user: () => `${databaseKey}/api/v1/assign_course_to_user`,
    getUserByTrainingID: (e: any) => `${databaseKey}/api/v1/getBy_user_traning_id/${e}`,
    editUserByTrainingID: (id: any) => `${databaseKey}/api/v1/edit_add_user/${id}`,

    //edit_add_user
    create_training_CSV_File: () => `${databaseKey}/api/v1/user_Traning_uploadCsv`,
    trainingDeleteById: (e: any) => `${databaseKey}/api/v1/cancel_Traning/${e}`,
    rescheduleTraining:(e:any)=> `${databaseKey}/api/v1/reschedule_Traning_Update/${e}`,
    complete_training: (e: any) => `${databaseKey}/api/v1/status_Closed_Traning/${e}`,
    scheduleTrainingAuthorList: () => `${databaseKey}/api/v1/get_All_New_Author`,
    scheduleTrainingUserList: () => `${databaseKey}/api/v1/get_All_New_User`,


    //api/v1/get_All_New_Author api/v1/get_All_New_User



  },
  lmsContentTraining:{
    createContentList: () => `${databaseKey}/api/v1/create_New_Content`,
    contentTrainingList: () => `${databaseKey}/api/v1/get_All_New_Content`,
    getContentByID: (e: any) => `${databaseKey}/api/v1/get_ById_Content/${e}`,
    deleteContentByID: (e: any) => `${databaseKey}/api/v1/delete_newContent/${e}`,
    editContentTrainingData: (id: any) => `${databaseKey}/api/v1/edit_New_Content/${id}`,
    getCategory: () => `${databaseKey}/api/v1/get_All_category`,
    PDF: (e:any) => `${databaseKey}/api/v1/getbyideadmanagment/${e}`,
  },
  lmsCourseManagement:{
    createCourse: () => `${databaseKey}/api/v1/CreateNewCourse`,
    courseList: () => `${databaseKey}/api/v1/getAllCource`,
    editCourse: (id: any) => `${databaseKey}/api/v1/editCourse/${id}`,
    get_Author_List: () => `${databaseKey}/api/v1/getAll_course_author`,


    //
    // getContentByID: (e: any) => `${databaseKey}/api/v1/get_ById_Content/${e}`,
    // deleteContentByID: (e: any) => `${databaseKey}/api/v1/deleteContent/${e}`,
    // getCategory: () => `${databaseKey}/api/v1/get_All_category`,
    // PDF: (e:any) => `${databaseKey}/api/v1/getbyideadmanagment/${e}`,
  },
  courseContent:{
    createCourseContent: () => `${databaseKey}/api/v1/create_Content_Course`,
    getAllContentByTrainingID: (e: any) => `${databaseKey}/api/v1/get_cource_id_newContent/${e}`,
    getContentByContentID: (e: any) => `${databaseKey}/api/v1/getContentBY_contentID/${e}`,
    editCourseContents: (e: any) => `${databaseKey}/api/v1/editcontent/${e}`,



    // courseList: () => `${databaseKey}/api/v1/getAllCource`, 
    // editCourse: (id: any) => `${databaseKey}/api/v1/editCourse/${id}`,

    // getContentByID: (e: any) => `${databaseKey}/api/v1/get_ById_Content/${e}`,
    // deleteContentByID: (e: any) => `${databaseKey}/api/v1/deleteContent/${e}`,
    // getCategory: () => `${databaseKey}/api/v1/get_All_category`,
    // PDF: (e:any) => `${databaseKey}/api/v1/getbyideadmanagment/${e}`,
  },
  questions:{
    createQuestion: () => `${databaseKey}/api/v1/create_questionaries`,
    generate_question_status: (e: any) => `${databaseKey}/api/v1/editcontent_status/${e}`,
    getQuestionsByID: (e: any) => `${databaseKey}/api/v1/get_questions_By_content_id/${e}`,
    editQuestionsByID: () => `${databaseKey}/api/v1/editquestionaries`,
    deleteQuestionByID: (e: any) => `${databaseKey}/api/v1/delete_questionaries/${e}`,
    deleteQuestion_byQuestionID: (e: any) => `${databaseKey}/api/v1/delete_questionaries/${e}`,

//
    // courseList: () => `${databaseKey}/api/v1/getAllCource`, 
    // editCourse: (id: any) => `${databaseKey}/api/v1/editCourse/${id}`,

    // deleteContentByID: (e: any) => `${databaseKey}/api/v1/deleteContent/${e}`,
    // getCategory: () => `${databaseKey}/api/v1/get_All_category`,
    // PDF: (e:any) => `${databaseKey}/api/v1/getbyideadmanagment/${e}`,
  },
  //author management  
  autherMan: {
    getAuther: () => `${databaseKey}/api/v1/getAllAuthor`,   
    getcoursesByAuther: (author_trainer_id: any) => `${databaseKey}/api/v1/ByAuther_getAll_empResult/${author_trainer_id}`,
    getcoursesByAdmin: () => `${databaseKey}/api/v1/getAll_empResult_admin`,
    getcoursesByUser: (author_trainer_id: any) => `${databaseKey}/api/v1/getAll_empResult_user/${author_trainer_id}`,
    getassignedUsersByAuther: (author_trainer_id: any) => `${databaseKey}/api/v1/no_of_attend_and_no_of_assined_course/${author_trainer_id}`,
    getassignedUsersByAdmin: () => `${databaseKey}/api/v1/no_of_assined_for_admin`,
    getassignedUsersByUser: (user_id: any) => `${databaseKey}/api/v1/no_of_assined_course_user/${user_id}`,
    getattendessUsersByAuther: (author_trainer_id: any) => `${databaseKey}/api/v1/no_of_attendes_count/${author_trainer_id}`,
    getattendessUsersByAdmin: () => `${databaseKey}/api/v1/no_of_attendes_count_admin`,
    getattendessUsersByUser: (user_id: any) => `${databaseKey}/api/v1/no_of_attendes_count_user/${user_id}`,
    getByAuther: (author_trainer_id: any) => `${databaseKey}/api/v1/get_ById_user/${author_trainer_id}`,
    createAuther: () => `${databaseKey}/api/v1/createAuthor`,
    deleteAuther: (author_trainer_id: any) => `${databaseKey}/api/v1/deleteAuthor/${author_trainer_id}`,
    getCategoryies: () => `${databaseKey}/api/v1/get_All_Categoryies`,
    getRegion: () => `${databaseKey}/api/v1/get_All_region_List`,
    getAutherName: () => `${databaseKey}/api/v1/user_Name_List`,
    getByAutherView: (author_trainer_id: any) => `${databaseKey}/api/v1/getByIdAuthor/${author_trainer_id}`,
  },
  assessment_content: {
    getAllNewAssessment: () => `${databaseKey}/api/v1/get_All_New_Assessment`,
    getAssessmentCategory: () => `${databaseKey}/api/v1/get_All_category`,
    createAssessement: () => `${databaseKey}/api/v1/create_New_Assesment`,
    getByAssessment: (assesment_id: any) => `${databaseKey}/api/v1/get_ById_New_Assessment/${assesment_id}`,
    deleteAssessment: (assesment_id: any) => `${databaseKey}/api/v1/delete_Assessment/${assesment_id}`,
    customAssessmentCreate: () => `${databaseKey}/api/v1/create_mcqCustom_Assesment`,
    customAssessmentGetBY: (assesment_id: any) => `${databaseKey}/api/v1/getById_mcqCustom_Assesment/${assesment_id}`,
    customAssessSubjectCreate:()=>`${databaseKey}/api/v1/create_mcq_QUES`,
    customAssessUpdateMcq:(assesment_id:any)=>`${databaseKey}/api/v1/edit_mcqCustom_Assesment/${assesment_id}`,
    customAssessUpdateSubject:(assesment_id:any)=>`${databaseKey}/api/v1/edit_subjectiveCustom_Assesment/${assesment_id}`,
    customAssessGetBySubjective:(id:any)=>`${databaseKey}/api/v1/getById_subjectiveCustom_Assesment/${id}`,
    updateNewAssessment:(id:any)=>`${databaseKey}/api/v1/edit_New_Assessment/${id}`
    
  },
  superAdminDashbord:{
    contentList: () => `${databaseKey}/api/v1/get_All_Content_Learning`,
    upcommingCourse:{
      createEvent:()=>`${databaseKey}/api/v1/create_Upcomming_Course`,
      updateEvent:(id:any)=>`${databaseKey}/api/v1/edit_Upcomming_Course/${id}`,
      allEvent:()=>`${databaseKey}/api/v1/getAll_Upcomming_Course`,
      singleEvent:(id:any)=>`${databaseKey}/api/v1/getById_Upcomming_Course/${id}`,
      deleteEvent:(id:any)=>`${databaseKey}/api/v1/delete_Upcomming_Course/${id}`,
    }
  },
  myScheduleTrainingbyID:{
    myScheduleTrainingByID:(id:any)=>`${databaseKey}/api/v1/getAllScheduledTrainng/${id}`,
  },
  getUserListbyTrainingID:{
    getUserListbyTrainingID:(id:any)=>`${databaseKey}/api/v1/get_By_Request_Course/${id}`,
    getUserListbyTrainingID_2nd:(id:any)=>`${databaseKey}/api/v1/get_By_Ap_rej_Course/${id}`,

    //
  },
  reassign:{
    re_assign:(id:any)=>`${databaseKey}/api/v1/RE_Assigned/${id}`,

    //
  }
  
}

@Injectable({
  providedIn: 'root'
})
export class LmsServiceService {

  constructor(private http: HttpClient) { }
  question_variable = new BehaviorSubject('Generate Questionaries');


  // **************************
  re_assign(e: any, data: any): Observable<any> {
    return this.http.post<any>(routes.reassign.re_assign(e), data);
  }
  // *************************user management**************************************************
  
  
  getUserList(): Observable<any> {
    return this.http.get<any>(routes.lmsUser.userList());
  }
  getToDoList(): Observable<any> {
    return this.http.get<any>(routes.lmsUser.toDoList());
  }

  getvideoList(): Observable<any> {
    return this.http.get<any>(routes.lmsUser.videoList());
  }

  getToDoListGetByID(e: any): Observable<any> {
    return this.http.get<any>(routes.lmsUser.toDoListById(e));
  }

  requestByUserID(e: any): Observable<any> {
    return this.http.get<any>(routes.lmsUser.requestByUserId(e));
  }

  userSelectDropdownName_Code(): Observable<any> {
    return this.http.get<any>(routes.lmsUser.userSelectDropdownName_Code());
  }
  userSelectDropdown_Role(): Observable<any> {
    return this.http.get<any>(routes.lmsUser.userSelectDropdown_Role());
  }
  assignUserList(data: any): Observable<any> {
    return this.http.post<any>(routes.lmsUser.assignUserList(), data)
  }


  createUserMaster(data: any): Observable<any> {
    return this.http.post<any>(routes.lmsUser.createUserList(), data)
  }
  createCSV_File(data: any): Observable<any> {
    return this.http.post<any>(routes.lmsUser.createCSV_File(), data)
  }
  GetByUserId(e: any): Observable<any> {
    return this.http.get<any>(routes.lmsUser.getById(e));
  }
  DeleteByrId(e: any, data: any): Observable<any> {
    return this.http.put<any>(routes.lmsUser.deleteById(e), data);
  }
  //***************************MySchedule Training Master******************************************
  myScheduleTrainingbyID(e: any): Observable<any> {
    return this.http.get<any>(routes.myScheduleTrainingbyID.myScheduleTrainingByID(e));
  }
  logIn(): Observable<any> {
    return this.http.get<any>(routes.logIn.login());
  }
    // *************************USer List**************************************************
    getUserListbyTrainingID(id:any): Observable<any> {
      return this.http.get<any>(routes.getUserListbyTrainingID.getUserListbyTrainingID(id));
    }
    getUserListbyTrainingID_2nd(id:any): Observable<any> {
      return this.http.get<any>(routes.getUserListbyTrainingID.getUserListbyTrainingID_2nd(id));
    }

  // *************************Schedule Training**************************************************
  scheduleTrainingList(id:any): Observable<any> {
    return this.http.get<any>(routes.lmsScheduleTraining.scheduleTrainingList(id));
  }
  scheduleTrainingAuthorList(): Observable<any> {
    return this.http.get<any>(routes.lmsScheduleTraining.scheduleTrainingAuthorList());
  }
  scheduleTrainingUserList(): Observable<any> {
    return this.http.get<any>(routes.lmsScheduleTraining.scheduleTrainingUserList());
  }
  scheduleTrainingSingleDataByID(e: any): Observable<any> {
    return this.http.get<any>(routes.lmsScheduleTraining.scheduleTrainingSingleDataByID(e));
  }
  categoryList(): Observable<any> {
    return this.http.get<any>(routes.lmsScheduleTraining.categoryList());
  }
  editCheck(id:any): Observable<any> {
    return this.http.get<any>(routes.lmsScheduleTraining.editCheck(id));
  }


  branchList(): Observable<any> {
    return this.http.get<any>(routes.lmsScheduleTraining.branchList());
  }
  regionList(): Observable<any> {
    return this.http.get<any>(routes.lmsScheduleTraining.regionList());
  }

  multiUserList(): Observable<any> {
    return this.http.get<any>(routes.lmsScheduleTraining.multiUserList());
  }

  // createTrainingList(data: any,file:File,csv_file:File): Observable<any> {
  //   
  //   

    
  //   const formData=new FormData();
  //   for(let key in data){
  //     formData.append(`${key}`, data[key]);
  //   }
  //   if (file) {
  //     formData.append("upload_material", file, file.name);
  //   }
  //   if(csv_file){
  //     formData.append("bulk_upload_user", csv_file, csv_file.name);
  //   }
  //   return this.http.post<any>(routes.lmsScheduleTraining.createTrainingList(), formData)

  // }
  getUserByCategory(param:any): Observable<any> {
    
    return this.http.get(routes.lmsScheduleTraining.getUserByCategoryList(param));
  }
  checkDuplicate(training_id:any): Observable<any> {
    
    return this.http.get(routes.lmsScheduleTraining.checkDuplicate(training_id));
  }

  //
  getAllUserByCategory(): Observable<any> {
    
    return this.http.get(routes.lmsScheduleTraining.getAllUserByCategoryList());
  }
  assign_course_to_user(data:any):Observable<any> {
    return this.http.post<any>(routes.lmsScheduleTraining.assign_course_to_user(),data);
  } 
  getUserByTrainingId(e: any):Observable<any> {
    return this.http.get<any>(routes.lmsScheduleTraining.getUserByTrainingID(e));
  } 
  editUserByTrainingID(e: any,data:any):Observable<any> {
    return this.http.put<any>(routes.lmsScheduleTraining.editUserByTrainingID(e),data);
  } 

  //
  editTrainingData(id: any, data: any,file:File,csv_file:File): Observable<any> {
    const formData=new FormData();
    for(let key in data){
      formData.append(`${key}`, data[key]);
    }
    if (file) {
      formData.append("upload_material", file, file.name);
    }
    if(csv_file){
      formData.append("bulk_upload_user", csv_file, csv_file.name);
    }
    return this.http.put(routes.lmsScheduleTraining.editTrainingData(id),formData);
  }

  assignUserListByTrainingID(training_id: any): Observable<any> {
    return this.http.get(routes.lmsScheduleTraining.assignUserListByTrainingID(training_id))

  }
  reassignUserListByTrainingID(id:any): Observable<any> {
    return this.http.get(routes.lmsScheduleTraining.reassignUserListByTrainingID(id))

  }
  //getUserByCategoryList
  cencled_training_data(e: any, data:any):Observable<any> {
    return this.http.put<any>(routes.lmsScheduleTraining.cencel_training_by_ID(e), data);
  } 
  createBulk_upload_trainee_name(data:any):Observable<any>{
    return this.http.get<any>(routes.lmsScheduleTraining.create_training_CSV_File(),data)
   }

  trainingDeleteById(e: any, data: any): Observable<any> {
    return this.http.put<any>(routes.lmsScheduleTraining.trainingDeleteById(e), data);
  }
  rescheduleTraining(e: any, data: any): Observable<any> {
    return this.http.put<any>(routes.lmsScheduleTraining.rescheduleTraining(e), data);
  }

  complete_training(e: any, data: any): Observable<any> {
    return this.http.put<any>(routes.lmsScheduleTraining.complete_training(e), data);
  }

  // **************************Add Course*******************************************

  createCourse(data: any,thumbnail:File): Observable<any> {

    const formData=new FormData();
    for(let key in data){
      formData.append(`${key}`, data[key]);
    }
    if (thumbnail) {
      formData.append("course_thumbnail", thumbnail, thumbnail.name);
    }
    return this.http.post<any>(routes.lmsCourseManagement.createCourse(), formData)
  }

  editCourse(id:any,data: any,thumbnail:File): Observable<any> {
    const formData=new FormData();
    for(let key in data){
      formData.append(`${key}`, data[key]);
    }
    if (thumbnail) {
      formData.append("course_thumbnail", thumbnail, thumbnail.name);
    }
    
    return this.http.put<any>(routes.lmsCourseManagement.editCourse(id), formData)
  }
  get_Author_List(): Observable<any> {
    return this.http.get<any>(routes.lmsCourseManagement.get_Author_List())
  }

  //
    // **************************Add-Question*******************************************

    addQuestion(data:any): Observable<any> {
      return this.http.post<any>(routes.questions.createQuestion(), data)
    }

    generate_question_status(e: any, data: any): Observable<any> {
      return this.http.put<any>(routes.questions.generate_question_status(e), data);
    }

    getByQuestionbyID(content_id: any): Observable<any> {
      return this.http.get(routes.questions.getQuestionsByID(content_id))
  
    }

    editQuestionsByID(data: any): Observable<any> {
      return this.http.put<any>(routes.questions.editQuestionsByID(), data);
    }

    deleteQuestionsByID(e: any): Observable<any> {
      return this.http.delete<any>(routes.questions.deleteQuestionByID(e));
    }

    deleteQuestion_byQuestionID(e: any): Observable<any> {
      return this.http.delete<any>(routes.questions.deleteQuestion_byQuestionID(e));
    }


    ///api/v1/delete_questionaries/:id


  
  
    //editQuestionsByID delete_questionaries


  // **************************Course Content *******************************************


    createCourseContents(data: any,file:File,video_file:File,thumbnail:File): Observable<any> {
      
      
      const formData=new FormData();
      for(let key in data){
        formData.append(`${key}`, data[key]);
      }
      if (file) {
        formData.append("upload_material", file, file.name);
      }
      if(video_file){
        formData.append("upload_course_video", video_file, video_file.name);
      }
      if(thumbnail){
        formData.append("thumbnail", thumbnail, thumbnail.name);
      }
      return this.http.post<any>(routes.courseContent.createCourseContent(), formData)
  
    }
    editCourseContents(content_id:any,data: any,file:File,video_file:File,thumbnail:File): Observable<any> {
      
      
      const formData=new FormData();
      for(let key in data){
        formData.append(`${key}`, data[key]);
      }
      if (file) {
        formData.append("upload_material", file, file.name);
      }
      if(video_file){
        formData.append("upload_course_video", video_file, video_file.name);
      }
      if(thumbnail){
        formData.append("thumbnail", thumbnail, thumbnail.name);
      }
      return this.http.put<any>(routes.courseContent.editCourseContents(content_id), formData)
  
    }

    getAllContentByTrainingID(training_id: any): Observable<any> {
      return this.http.get(routes.courseContent.getAllContentByTrainingID(training_id))
    }
    getContentByContentID(content_id: any): Observable<any> {
      return this.http.get(routes.courseContent.getContentByContentID(content_id))
    }

    //
  


 //
  // *************************Content Training**************************************************
  createContentList(data: any,upload_file:File,content_file:File): Observable<any> {
    
    
    const formData=new FormData();
    for(let key in data){
      formData.append(`${key}`, data[key]);
    }
    if (upload_file) {
      formData.append("upload_assessment", upload_file, upload_file.name);
    }
    if(content_file){
      formData.append("upload_content", content_file, content_file.name);
    }
    return this.http.post<any>(routes.lmsContentTraining.createContentList(), formData)
  }
  editTrainingContentData(id: any, data: any,assessementFile:File,contentFile:File): Observable<any> {
    const formData=new FormData();
    for(let key in data){
      formData.append(`${key}`, data[key]);
    }
    if (assessementFile) {
      formData.append("upload_material", assessementFile, assessementFile.name);
    }
    if(contentFile){
      formData.append("bulk_upload_user", contentFile, contentFile.name);
    }
    return this.http.put(routes.lmsContentTraining.editContentTrainingData(id),formData);
  }

  trainingContentList(): Observable<any> {
    return this.http.get<any>(routes.lmsContentTraining.contentTrainingList());
  }
  getByIDContentData(content_id: any): Observable<any> {
    return this.http.get(routes.lmsContentTraining.getContentByID(content_id))
  }
  deleteContentByID(e:any,data:any):Observable<any>{
    return this.http.delete<any>(routes.lmsContentTraining.deleteContentByID(e),data)
  }

  deleteTrainingContent(e: any):Observable<any> {
    return this.http.delete<any>(routes.lmsContentTraining.deleteContentByID(e));
  } 
  getCategory():Observable<any>{
    return this.http.get<any>(routes.lmsContentTraining.getCategory());
  }
  PDF(e:any):Observable<any>{
    return this.http.get<any>(routes.lmsContentTraining.PDF(e));
  }

  //author mangement    
  getAuther(): Observable<any> {
    return this.http.get(routes.autherMan.getAuther())
  }

  getByAuther(author_trainer_id: any): Observable<any> {
    return this.http.get(routes.autherMan.getByAuther(author_trainer_id))
  }

  getcoursesByAuther(author_trainer_id: any): Observable<any> {
    return this.http.get(routes.autherMan.getcoursesByAuther(author_trainer_id))
  }
  getcoursesByAdmin(): Observable<any> {
    return this.http.get(routes.autherMan.getcoursesByAdmin())
  }
  getcoursesByUser(user_id: any): Observable<any> {
    return this.http.get(routes.autherMan.getcoursesByUser(user_id))
  }
  getassignedusersByAuther(author_trainer_id: any): Observable<any> {
    return this.http.get(routes.autherMan.getassignedUsersByAuther(author_trainer_id))
  }
  getassignedusersByAdmin(): Observable<any> {
    return this.http.get(routes.autherMan.getassignedUsersByAdmin())

    }
 getassignedusersByUser(user_id: any): Observable<any> {
      return this.http.get(routes.autherMan.getassignedUsersByUser(user_id))
  
  }
  getattendessByAuther(author_trainer_id: any): Observable<any> {
    return this.http.get(routes.autherMan.getattendessUsersByAuther(author_trainer_id))
  }
  getattendessByAdmin(): Observable<any> {
    return this.http.get(routes.autherMan.getattendessUsersByAdmin())
  }
   getattendessByuser(user_id: any): Observable<any> {
    return this.http.get(routes.autherMan.getattendessUsersByUser(user_id))
  }
  createAuther(data: any): Observable<any> {
    return this.http.post(routes.autherMan.createAuther(), data)
  }

  delete(author_trainer_id: any, body: any): Observable<any> {
    

    return this.http.put(routes.autherMan.deleteAuther(author_trainer_id), body)
  }
  getCategoryies(): Observable<any> {
    return this.http.get(routes.autherMan.getCategoryies())
  }

  getRegion(): Observable<any> {
    return this.http.get(routes.autherMan.getRegion())
  }
  getAutherName(): Observable<any> {
    return this.http.get(routes.autherMan.getAutherName())
  }

  getByautherView(author_trainer_id: any): Observable<any> {
    return this.http.get(routes.autherMan.getByAutherView(author_trainer_id))

  }

  //assessment-content

  getAllAssessmentContent(): Observable<any> {
    return this.http.get(routes.assessment_content.getAllNewAssessment())
  }

  getAssessmentCategory(): Observable<any> {
    return this.http.get(routes.assessment_content.getAssessmentCategory())
  }

  createAssessment(data: any): Observable<any> {
    return this.http.post(routes.assessment_content.createAssessement(), data)
  }

  getByNewAssessment(assesment_id: any): Observable<any> {
    return this.http.get(routes.assessment_content.getByAssessment(assesment_id))
  }

  customAssessmentCreate(data: any): Observable<any> {
    return this.http.post(routes.assessment_content.customAssessmentCreate(), data)
  }

  customAssessmentGetById(assesment_id: any): Observable<any> {
    return this.http.get(routes.assessment_content.customAssessmentGetBY(assesment_id))
  }

  customAssessSubjectCreate(data:any):Observable<any>{
    return this.http.post(routes.assessment_content.customAssessSubjectCreate(),data)
  }

  customAssessUpdateMcq(assesment_id:any,data:any):Observable<any>{
    return this.http.put(routes.assessment_content.customAssessUpdateMcq(assesment_id),data)
  }
  
  customAssessUpdateSubject(assesment_id:any,data:any){
    return this.http.put(routes.assessment_content.customAssessUpdateSubject(assesment_id),data)
  }
  
customAssessGetbyIdSubjective(id:any){
  return this.http.get(routes.assessment_content.customAssessGetBySubjective(id))
}

updateNewAssessment(id:any,data:any){
  return this.http.put(routes.assessment_content.updateNewAssessment(id),data)
}


  // super admin deshboard start -------------------------------------------------------------------
  getAllContentList(): Observable<any>{
    return this.http.get(routes.superAdminDashbord.contentList())
  };

  createEvent(data:any): Observable<any>{
    return this.http.post(routes.superAdminDashbord.upcommingCourse.createEvent(),data);
  };

  updateEvent(id:any,data:any): Observable<any>{
    return this.http.put(routes.superAdminDashbord.upcommingCourse.updateEvent(id),data);
  };

  getAllEvent(): Observable<any>{
    return this.http.get(routes.superAdminDashbord.upcommingCourse.allEvent())
  };

  getSingleEvent(id:any,): Observable<any>{
    return this.http.get(routes.superAdminDashbord.upcommingCourse.singleEvent(id));
  };

  deleteEvent(id:any,): Observable<any>{
    return this.http.delete(routes.superAdminDashbord.upcommingCourse.deleteEvent(id));
  };

  // super admin deshboard end -------------------------------------------------------------------
  userListbyReportinManager(id:any,): Observable<any>{
    return this.http.get(routes.lmsManager.userListbyReportingManager(id));
  };

  userListbyReportinManagers(id:any): Observable<any>{
    return this.http.get(routes.lmsManager.userListbyReportinManagers(id));
  };

}
// }

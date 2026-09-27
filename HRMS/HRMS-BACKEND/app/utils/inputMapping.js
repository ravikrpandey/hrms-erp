const mappings = {
  createJob: {
    jobTitle: 'job_title',
    jobRole: 'job_role',
    jobTypeId: 'FK_job_type_id',
    startDate: 'start_date',
    endDate: 'end_date',
    numberOfPosition: 'number_of_positions',
    experience: 'experience',
    requisitionStatus: 'requisition_status',
    requisitionOtherStatus: 'requisition_other_status',
  },
  jobDescription: {
    description: 'description',
  },
  jobPost: {
    location: 'location',
    verticalId: 'FK_vertical_id',
    department: 'department',
    candidateAge: 'candidate_age',
    salaryRange: 'salary_range',
    qualification: 'qualification',
  },
  additionalInformation: {
    jobStatus: 'status',
    requestedBy: 'requested_by',
    assignedTo: 'assigned_to',
    assigned_to_name:"assigned_to_name",
    requested_by_name:"requested_by_name",
  },
  // jobPostRound: {
  //   SPOCName: 'spoc_name',
  //   interviewLevel: 'interview_level',
  //   createdBy: 'created_by',
  //   createdOn: 'created_on',
  // },
  jobPostRound: {
    jobTitle: 'job_title',
    description: 'description',
    jobRole: 'job_role',
    verticalId: 'FK_vertical_id',
    department: 'department',
    startDate: 'start_date',
    experience: 'experience',
    numberOfPosition: 'number_of_positions',
    location: 'location',
    requisitionStatus: 'requisition_status',
    SPOCName: 'spoc_name',
    jobStatus: 'status',
  },
  job: {
    id: 'jobId',
    jobTitle: 'jobTitle',
    assigned_to_name:"assigned_to_name",
    requested_by_name:"requested_by_name",
    job_role: 'jobRole',
    job_type: 'jobType',
    start_date: 'startDate',
    end_date: 'endDate',
    number_of_positions: 'numberOfPosition',
    experience: 'experience',
    requisition_status: 'requisitionStatus',
    requisition_other_status: 'requisitionOtherStatus',
    description: 'description',
    location: 'location',
    vertical_name: 'verticalName',
    department: 'department',
    candidate_age: 'candidateAge',
    salary_range: 'salaryRange',
    qualification: 'qualification',
    status: 'status',
    requested_by: 'requestedBy',
    assigned_to: 'assignedTo',
    spoc_name: 'SPOCName',
    interview_level: 'interviewLevel',
    created_by: 'createdBy',
    created_on: 'createdOn',
  }
};

exports.mapInput = function (object, type) {
  const generatedObj = {};
  for (const i of Object.keys(object)) {
    if (mappings[type] && mappings[type][i]) {
      generatedObj[mappings[type][i]] = object[i];
    }
  }
  return generatedObj;
};

exports.mapOutput = function (object, type) {
  const swappedType = Object.fromEntries(
    Object.entries(mappings[type]).map((key) => key.reverse()));
  const generatedObj = {};
  for (const i of Object.keys(object)) {
    if (swappedType && swappedType[i]) {
      generatedObj[swappedType[i]] = object[i];
    }
  }
  return generatedObj;
};
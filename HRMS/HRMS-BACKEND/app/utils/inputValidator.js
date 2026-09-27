const niv = require('node-input-validator');

const Validator = niv.Validator;

const templates = {
    createJob: {
        jobTitle: 'required|string',
        jobRole: 'required|string',
        jobTypeId: 'required|integer',
        startDate: 'required|date',
        endDate: 'required|date',
        numberOfPosition: 'required|integer',
        experience: 'required|integer',
        requisitionStatus: 'string',
        requisitionOtherStatus: 'string',
    },
    jobStepUpdate: {
        data: 'required|object',
        stepId: 'required|string',
        jobId: 'required|integer',
    },
    jobDescription: {
        description: 'required|string',
    },
    jobPost: {
        location: 'required|string',
        verticalId: 'required|integer',
        department: 'required|string',
        candidateAge: 'required|string',
        salaryRange: 'required|string',
        qualification: 'required|string',
    },
    additionalInformation: {
        jobStatus: 'required|string',
        requestedBy: 'required|string',
        assignedTo: 'required|string',
    },
    jobPostRound: {
        SPOCName: 'required|string',
        interviewLevel: 'required|string',
        createdBy: 'required|string',
        createdOn: 'required|date',
    },
    jobUpdate: {
        jobTitle: 'required|string',
        description: 'required|string',
        jobRole: 'required|string',
        verticalId: 'required|integer',
        department: 'required|string',
        startDate: 'required|date',
        experience: 'required|string',
        numberOfPosition: 'required|integer',
        location: 'required|string',
        requisitionStatus: 'string',
        SPOCName: 'required|string',
        jobStatus: 'required|string',
    },
    deleteJob: {
        jobId: 'required|integer',
    }
};

exports.validateRequestInput = async (object, templateName) => {
    const v = new Validator(object, templates[templateName]);
    const isValid = await v.check();
    const resObj = { isValid };
    if (!isValid) {
        resObj.errors = v.errors;
    }
    return resObj;
};

exports.validateFields = async(fields, requiredFields) => {
    const errors = [];
    requiredFields.forEach(field => {
        if (fields[field] === undefined || fields[field] === null) {
            errors.push(field);
        }
    });

    if (errors.length > 0) {
        return {
            isValid: false,
            message: `The fields ${errors.join(', ')} are required and must not be null or undefined`
        };
    }

    return { isValid: true };
}


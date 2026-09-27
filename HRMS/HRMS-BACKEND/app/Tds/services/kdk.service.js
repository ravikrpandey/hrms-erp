const axios = require('axios');
const FormData = require('form-data');

const kdkClient = axios.create({
    baseURL: 'https://amztdsapp.kdksoftware.co.in',
    timeout: 60000,
});

const expressClient = axios.create({
    baseURL: 'https://amztdsapp.kdksoftware.co.in',
    timeout: 60000,
});

const withAuth = (token) => ({
    headers: { Authorization: `Bearer ${token}` },
});

// Step 1: Login
const login = async (country_code, mobile_no, password) => {
    console.log("Base URL:", kdkClient.defaults.baseURL);

    console.log(
        "Final URL:",
        kdkClient.getUri({
            url: "/api/v1/auth/login"
        })
    );

    try {
        const response = await kdkClient.post("/api/v1/auth/login", {
            country_code,
            mobile_no,
            password
        });

        return response;
    } catch (err) {
        console.log("Status:", err.response?.status);
        console.log("Headers:", err.response?.headers);
        console.log("Body:", err.response?.data);
        console.log("Error:", err.message);

        throw err;
    }
};

// Step 2: Add Deductor
// const addDeductor = (token, deductorData) =>
//     kdkClient.post('api/v1/deductor', deductorData, withAuth(token));

const addDeductor = async (token, deductorData) => {
    try {
        const response = await kdkClient.post(
            '/api/v1/deductor',
            deductorData,
            withAuth(token)
        );

        return response;
    } catch (err) {
        console.log("Status:", err.response?.status);
        console.log("Headers:", err.response?.headers);
        console.log("Body:", err.response?.data);
        console.log("Error:", err.message);

        throw err;
    }
};

// Step 3: Add New Return
const addReturn = (token, { deductor_id, form_type, quarter, return_type, year }) =>
    kdkClient.post('api/v1/returns', { deductor_id, form_type, quarter, return_type, year }, withAuth(token));  // ✅ /returns

// Step 4: Import Return Data (Excel file upload)
const importReturn = (token, deductor_id, return_id, overwrite, return_type, fileBuffer, fileName) => {
    const form = new FormData();
    form.append('deductor_id', deductor_id);
    form.append('return_id', return_id);
    form.append('overwrite', overwrite ?? 'true');
    form.append('file', fileBuffer, { filename: fileName });

    // ✅ Use correct endpoint based on return_type
    const endpoint = return_type === 'CORRECTION'
        ? 'api/v1/return/regular/import'
        : 'api/v1/return/regular/import';

    return kdkClient.post(endpoint, form, {
        headers: {
            ...withAuth(token).headers,
            ...form.getHeaders(),
        },
    });
};

// Step 5: Get Return Status (also used in Step 8 for acknowledgement)
const getReturnStatus = (token, deductor_id, return_id) =>
    kdkClient.get('/api/v1/return/regular/import-return-status', {
        params: {
            deductor_id,
            return_id
        },
        ...withAuth(token)
    });

// Step 5: Download Error Report
const downloadErrorReport = (token, deductor_id, return_id) =>
    kdkClient.get('/api/v1/return/regular/download-error-file', {
        params: {
            deductor_id,
            return_id,
        },
        ...withAuth(token),
        responseType: 'arraybuffer',
    });

// Step 6 (Optional): Export Return Data
const exportReturnData = (token, deductor_id, return_id) =>
    kdkClient.get('api/v1/return/regular/export', {
        params: { deductor_id, return_id },
        ...withAuth(token)
    });

// Step 7a: Start Generate FVU File
const startGenerateFvu = (token, deductor_id, return_id) =>
    kdkClient.get('api/v1/returns/start-generate-fvu-file', {
        params: {
            deductor_id,
            return_id,
        },
        ...withAuth(token),
    });

// Step 7b: Check FVU Generation Status
const getFvuStatus = (token, deductor_id, return_id) =>
    kdkClient.get('api/v1/returns/status-generate-fvu-file', {
        params: { deductor_id, return_id },
        ...withAuth(token),
    });

// Step 7c: Download FVU File
const downloadFvu = (token, deductor_id, return_id) =>
    kdkClient.get('api/v1/returns/download-fvu-file', {
        params: { deductor_id, return_id },
        ...withAuth(token),
        responseType: 'arraybuffer',
    });

// Step 8 (Optional): Get Return Summary (FY level)
const getReturnSummary = (token, deductor_tan, financial_year) =>
    kdkClient.get('api/v1/report/deductor/return-summary', {
        params: { deductor_tan, financial_year },
        ...withAuth(token),
    });

// Step 8 (Optional): Return Register / List
const getReturnList = (token, filters) =>
    kdkClient.get('/return/list', {
        ...withAuth(token),
        params: filters,
    });

const getReturnFilingStatus = (token, deductor_id, return_id) =>
    kdkClient.get('api/v1/returns/filing-data', {
        params: { deductor_id, return_id },
        ...withAuth(token),
    });

// Step 9: Download PDF Receipt
const downloadPdfReceipt = (token, deductor_id, ack_no) =>
    kdkClient.get('api/v1/return/efiling/download-receipts', {
        params: { deductor_id, ack_no },
        ...withAuth(token),
        responseType: 'arraybuffer',
    });

module.exports = {
    login,
    addDeductor,
    addReturn,
    importReturn,
    getReturnStatus,
    downloadErrorReport,
    exportReturnData,
    startGenerateFvu,
    getFvuStatus,
    downloadFvu,
    getReturnSummary,
    getReturnList,
    getReturnFilingStatus,
    downloadPdfReceipt,
};

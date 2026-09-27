const kdkService = require('../../services/kdk.service');

const addReturnController = async (req, res) => {
  const { deductor_id, form_type, quarter, return_type, year } = req.body;  // ✅ snake_case + year

  if (!deductor_id || !form_type || !quarter || !return_type || !year) {
    return res.status(400).json({
      success: false,
      message: 'deductor_id, form_type, quarter, return_type and year are required',
    });
  }

  try {
    const response = await kdkService.addReturn(req.token, { deductor_id, form_type, quarter, return_type, year });
    return res.status(200).json({ success: true, data: response.data });
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || err.message,
    });
  }
};

const importReturnController = async (req, res) => {
  const { deductor_id, return_id, overwrite, return_type } = req.body;  // ✅ add return_type

  if (!deductor_id || !return_id || !return_type) {
    return res.status(400).json({ 
      success: false, 
      message: 'deductor_id, return_id and return_type are required' 
    });
  }
  if (!req.file) {
    return res.status(400).json({ 
      success: false, 
      message: 'File is required' 
    });
  }

  try {
    const response = await kdkService.importReturn(
      req.token,
      deductor_id,
      return_id,
      overwrite,
      return_type,        // ✅ pass return_type
      req.file.buffer,
      req.file.originalname
    );
    return res.status(200).json({ success: true, data: response.data });
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || err.message,
      errors: err.response?.data?.errors || null,
      data: err.response?.data || null
    });
  }
};

const getReturnStatusController = async (req, res) => {
  const { deductor_id, return_id } = req.query;

  if (!deductor_id || !return_id) {
    return res.status(400).json({
      success: false,
      message: 'deductor_id and return_id are required'
    });
  }

  try {
    const response = await kdkService.getReturnStatus(
      req.token,
      deductor_id,
      return_id
    );

    return res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || err.message,
      errors: err.response?.data?.errors || null,
      data: err.response?.data || null
    });
  }
};

const downloadErrorReportController = async (req, res) => {
  const { deductor_id, return_id } = req.query;

  //console.log(req.query , "req.query");

  if (!deductor_id || !return_id) {
    return res.status(400).json({
      success: false,
      message: 'deductor_id and return_id are required',
    });
  }

  try {
    const response = await kdkService.downloadErrorReport(
      req.token,
      deductor_id,
      return_id
    );

    res.setHeader(
      'Content-Type',
      response.headers['content-type'] || 'application/octet-stream'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=error-report-${return_id}.xlsx`
    );

    return res.send(response.data);
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || err.message,
    });
  }
};

const exportReturnDataController = async (req, res) => {
  const { deductor_id, return_id } = req.query;

  //console.log("req.query" ,req.query);

  if (!deductor_id || !return_id) {
    return res.status(400).json({
      success: false,
      message: 'deductor_id and return_id are required'
    });
  }

  try {
    const response = await kdkService.exportReturnData(req.token, deductor_id, return_id);
    return res.status(200).json({ success: true, data: response.data });
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || err.message,
      errors: err.response?.data?.errors || null,
      data: err.response?.data || null
    });
  }
};

const getReturnSummaryController = async (req, res) => {
  const { financialYear } = req.query;
  if (!financialYear) {
    return res.status(400).json({ success: false, message: 'financialYear query param is required' });
  }

  try {
    const response = await kdkService.getReturnSummary(req.token, financialYear);
    return res.status(200).json({ success: true, data: response.data });
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || err.message,
    });
  }
};

const getReturnListController = async (req, res) => {
  try {
    const response = await kdkService.getReturnList(req.token, req.query);
    return res.status(200).json({ success: true, data: response.data });
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || err.message,
    });
  }
};

module.exports = {
  addReturnController,
  importReturnController,
  getReturnStatusController,
  downloadErrorReportController,
  exportReturnDataController,
  getReturnSummaryController,
  getReturnListController,
};

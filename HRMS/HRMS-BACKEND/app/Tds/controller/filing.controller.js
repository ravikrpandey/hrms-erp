const path = require('path');
const fs = require('fs');
const kdkService = require('../services/kdk.service');

const startGenerateFvuController = async (req, res) => {
  const { deductor_id, return_id } = req.query;

  console.log("req.query",req.query);

  if (!deductor_id || !return_id) {
    return res.status(400).json({
      success: false,
      message: 'deductor_id and return_id are required',
    });
  }

  try {
    const response = await kdkService.startGenerateFvu(
      req.token,
      deductor_id,
      return_id
    );

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || err.message,
      errors: err.response?.data?.errors || null,
      data: err.response?.data || null,
    });
  }
};

const getFvuStatusController = async (req, res) => {
  const { deductor_id, return_id } = req.query;  // ✅ query params not params

  if (!deductor_id || !return_id) {
    return res.status(400).json({
      success: false,
      message: 'deductor_id and return_id are required'
    });
  }

  try {
    const response = await kdkService.getFvuStatus(req.token, deductor_id, return_id);
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



const downloadFvuController = async (req, res) => {
  const { deductor_id, return_id } = req.query;

  if (!deductor_id || !return_id) {
    return res.status(400).json({
      success: false,
      message: 'deductor_id and return_id are required'
    });
  }

  try {
    const response = await kdkService.downloadFvu(req.token, deductor_id, return_id);

    // ✅ Create directory if not exists
    const uploadDir = path.join(__dirname, '../uploads/fvu');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // ✅ Save file locally
    const fileName = `fvu-${return_id}-${Date.now()}.fvu`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(response.data));

    console.log('FVU File saved at:', filePath);

    // ✅ Send file to client as download
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    return res.send(Buffer.from(response.data));

  } catch (err) {
    return res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || err.message,
      errors: err.response?.data?.errors || null,
      data: err.response?.data || null
    });
  }
};

const getReturnFilingStatus = async (req, res) => {
  const { deductor_tan, financial_year } = req.query;  // ✅ correct params

  if (!deductor_tan || !financial_year) {
    return res.status(400).json({
      success: false,
      message: 'deductor_tan and financial_year are required'
    });
  }

  try {
    const response = await kdkService.getReturnSummary(req.token, deductor_tan, financial_year);
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

const downloadPdfReceiptController = async (req, res) => {
  const { deductor_id, ack_no } =req.query;  // ✅ snake_case

  if (!deductor_id || !ack_no) {
    return res.status(400).json({
      success: false,
      message: 'deductor_id and ack_no are required'
    });
  }

  try {
    const response = await kdkService.downloadPdfReceipt(req.token, deductor_id, ack_no);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=receipt-${ack_no}.pdf`);
    return res.send(Buffer.from(response.data));
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || err.message,
      errors: err.response?.data?.errors || null,
      data: err.response?.data || null
    });
  }
};

module.exports = {
  startGenerateFvuController,
  getFvuStatusController,
  downloadFvuController,
  getReturnFilingStatus,
  downloadPdfReceiptController,
};

const kdkService = require('../../services/kdk.service');

const addDeductorController = async (req, res) => {
  const deductorData = req.body;

  //console.log("deductorData" ,deductorData);

  if (!deductorData || Object.keys(deductorData).length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Deductor data is required' 
    });
  }

  // ✅ Validate required fields from curl
  const { deductor_name, tan, pan } = deductorData;
  if (!deductor_name || !tan || !pan) {
    return res.status(400).json({ 
      success: false, 
      message: 'deductor_name, tan and pan are required' 
    });
  }

  try {
    const response = await kdkService.addDeductor(req.token, deductorData);
    return res.status(200).json({ success: true, data: response.data });
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || err.message,
    });
  }
};

module.exports = { addDeductorController };

const kdkService = require('../../services/kdk.service');

const loginController = async (req, res) => {
    console.log('loginkjkkk')
  const { country_code, mobile_no, password } = req.body;  // ✅ match curl params

  if (!mobile_no || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'mobile_no and password are required' 
    });
  }

  try {
    console.log('1111')
    const response = await kdkService.login(country_code, mobile_no, password);
    console.log('2222',response)
    return res.status(200).json({ success: true, data: response.data });
  } catch (err) {
    return res.status(err.response?.status || 500).json({
      success: false,
      message: err.response?.data?.message || err.message,
    });
  }
};

module.exports = { loginController };

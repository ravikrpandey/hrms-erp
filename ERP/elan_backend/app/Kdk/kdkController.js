const axios = require("axios");

module.exports.registerForGSTPortalLink = async (data) => {
    try {
      console.log("===========", data);
  
      const sendOtpSignup = await axios.post(
        "https://amzgstapp.kdksoftware.co.in/api/v1/auth/send-otp-signup",
        {
          country_code: "+91",
          mobile_no: data.mobile,
          email: data.email,
          organization_type: "CA",
          organization_name: data.company_name,
          pincode: "302001"
        }
      );
  
      return sendOtpSignup;
  
    } catch (error) {
      const errMsg =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
  
      throw new Error(errMsg);
    }
  };

  module.exports.verifyOtpForGSTPortalLink = async (data) => {
    try {
      console.log("===================", data);
  
      const verifyOtp = await axios.post(
        "https://amzgstapp.kdksoftware.co.in/api/v1/auth/verify-otp",
        {
          country_code: "+91",
          mobile_no: data.mobile,
          otp_verification_id: data.otp_verification_id,
          otp: data.otp
        }
      );
  
      
      const signup = await axios.post(
        "https://amzgstapp.kdksoftware.co.in/api/v1/auth/signup",
        {
          country_code: "+91",
          otp_verification_id:verifyOtp.data?.data?.otp_verification_id || data.otp_verification_id,
          mobile_no: data.mobile,
          email: data.email_id,
          full_name: data.contact_person_name,
          organization_name: data.company_name,
          password: "Kdk@12345",
          password_confirmation: "Kdk@12345",
          organization_type: "CORPORATE",
          pincode: "302021",
          utm_source: "",
          terms_and_conditions: true,
          industry_type: "CA/CS/Tax Professionals"
        }
      );
  
      const loginUser = await axios.post(
        "https://amzgstapp.kdksoftware.co.in/api/v1/auth/login",
        {
          country_code: "+91",
          mobile_no: data.mobile,
          password: "Kdk@12345"
        }
      );
  
      
      return {
        verifyOtp,
        signup,
        loginUser
      };
  
    } catch (error) {
      const errMsg =
        error.response?.data?.errors?.[0] ||
        error.response?.data?.message ||
        error.message ||
        "Something went wrong";
  
      // Don't use res here
      throw new Error(errMsg);
    }
  };
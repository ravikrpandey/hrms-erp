const jwt = require('jsonwebtoken');
const secret = "abcTTT6543uzzzyyyuccccr434cvewqjhgder";
const db = require("../models");
const User = db.user_login;
const logger = require('../.././logger/index');

const intercepterMiddleware = async (req, res, next) => {
  try {
    if (checkWithoutLoginUrl(req)) {
      next();
    }
    else {
      let token = req.headers.authorization;
      if (token) {
        token = token?.split(" ")[1];
        const findTokan = await User.findOne({ where: { token: token } })
        if (!findTokan) {
          return res.status(498).json({ message: "Invalid token" });
        }
        let tokenDetail = jwt.verify(token, secret);
        next();
      }
      else {
        return res.status(401).json({ message: "Unauthorized User" });
      }
    }
  } catch (error) {
    logger.error(`Error ${error.message}`, { error });
    console.log(error)
  }

}

const checkWithoutLoginUrl = (req) => {
  if ((req.url.includes("signin")
    || req.url.includes("sso-login")
    || req.url.includes("generate-sso-token")
    || req.url.includes("getCandidate_detailsByID")
    || req.url.includes("getCandidateoffer_detailsBYID")
    || req.url.includes("register_onboarded_employee")
    || req.url.includes("download_offer_letter")
    || req.url.includes("updateCandidate_OfferStatus")
    || req.url.includes("userbyid")
    || req.url.includes("create_company_quality_ratings")
    || req.url.includes("submit_employer_details")
    || req.url.includes("documents")
    || req.url.includes("upload_document")
    || req.url.includes("uploaded_files")
    || req.url.includes("get_user_selection_answer")
    || req.url.includes("download_resume")
    || req.url.includes("getAll_Country_codes")
    || req.url.includes("branchSetup_get_active")
    || req.url.includes("createjob_email")
    || req.url.includes("getAllcountry")
    || req.url.includes("getcitybystateid")
    || req.url.includes("getstatesbycountryid")
    || req.url.includes("getAll_Active_BANK")
    || req.url.includes("get_Active_ContractTypes")
    || req.url.includes("api_docs_details")
    || req.url.includes("forgotPassword")
    || req.url.includes("getIpAddress")
    || req.url.includes("cronJobScript")
    || req.url.includes("proposalVersionListById")
    || req.url.includes("getAllItemCategory")
    || req.url.includes("getCustomerContactById")
    || req.url.includes("getAll_scheme")

  )) return true;
}

module.exports = {
  secret: secret,
  expiresIn: 60000000,
  authorization: intercepterMiddleware
};

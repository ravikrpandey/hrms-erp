const CryptoJS = require('crypto-js');

const secretKey = 'elanpro-elitemindz';

const encrypt = (value) => {

  return CryptoJS.AES.encrypt(
    String(value),
    secretKey
  ).toString();

};

const decrypt = (value) => {

  try {

    const bytes = CryptoJS.AES.decrypt(
      value,
      secretKey
    );

    return bytes.toString(CryptoJS.enc.Utf8);

  } catch (error) {

    return '';

  }

};

module.exports = {
  encrypt,
  decrypt
};
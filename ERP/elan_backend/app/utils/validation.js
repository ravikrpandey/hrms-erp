// const emailToValidate = 'a@gmail.co';
valideEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[gmail.com]/;

exports.isCompanyEmail = function(email)
{
if(!valideEmail){
    return false;
}
else{
    return true;
}
}
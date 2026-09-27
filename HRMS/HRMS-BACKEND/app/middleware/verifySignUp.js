const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  const { employee_id,employee_official_email } = req.body;
  if (!employee_id) {
    User.findOne({
      where: { 
        employee_official_email: employee_official_email, 
        status: "ACTIVE" 
      }
    })
    .then(user => {
      if (user) {
        return res.status(400).send({ message: "Failed! Email is already in use!" });
      }
      next();
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
  } else {
    next();
  }
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
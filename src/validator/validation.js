const mongoose = require("mongoose");


const validateEnum = function(value) {


  var titleEnum = ["Mr", "Mrs", "Miss"];
  if (titleEnum.includes(value)) {
    return true;
  }

  return false;
};

const validateNumber = function validateNumber(value) {
  if (typeof value == "number") {
    return true;
  }
  return false;
};

const validateString = function (name) {
  if (typeof name == undefined || typeof name == null) return false;
  if (typeof name == "string" && name.trim().length == 0) return false;

  return true;
};


const validateEmail = function (value) {
  let re = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
  let validEmail = re.test(value);

  if (!validEmail) {
    return false;
  }

  return true;
};

const validatePassword = function (value) {
  let re = /^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]{8,15}$/;
  let validPassword = re.test(value);

  if (!validPassword) {
    return false;
  }

  return true;
};

const validateRequest = function (value) {
  if (Object.keys(value).length == 0) {
    return false;
  } else return true;
};
let validateObjectId = function (ObjectId) {
  return mongoose.isValidObjectId(ObjectId)
}
// mongoose.Types.ObjectId.isValid

const passwordLength = function (password) {
  if (password.length >= 8 && password.length <= 15) {
    return true;
  } else return false;
};

const regxName = function (val) {
  let regx = /^[a-zA-Z]+([\s][a-zA-Z]+)*$/;
  return regx.test(val);
}

module.exports = {
  validateString,
  validateEmail,
  validatePassword,
  validateRequest,
  validateNumber,
  validateObjectId,
  passwordLength,
  validateEnum,
  regxName
};
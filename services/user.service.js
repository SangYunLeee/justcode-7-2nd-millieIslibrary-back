const userDao = require('../models/user.dao');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // 토큰 발급
const jwtSecret = process.env.SECRET_KEY;

const emailRegExp = /\S+@\S+\.\S+/;

const signUp = async (email, password, nickname) => {
  if (!emailRegExp.test(email)) {
    const error = new Error('Email-Invalid');
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 10) {
    //비밀번호가 10자리 이상만 가능 아니면 error 날림
    const error = new Error('Password-Invalid');
    error.statusCode = 400;
    throw error;
  }

  const salt = bcrypt.genSaltSync();

  const hashedPw = bcrypt.hashSync(password, salt);

  await userDao.signUp(email, hashedPw, nickname);
};

const login = async (email, password) => {
  if (!email.includes('@') || !email.includes('.')) {
    const error = new Error('Email-Invalid');
    error.statusCode = 400;
    throw error;
  }
  if (password.length < 10) {
    const error = new Error('Password-Invalid');
    error.statusCode = 400;
    throw error;
  }

  const userInfo = await userDao.login(email);
  if (!userInfo) {
    const error = new Error("User doesn't exist");
    error.statusCode = 404;
    throw error;
  }

  const isSame = bcrypt.compareSync(password, userInfo.password);
  if (!isSame) {
    const error = new Error('Your password is incorrect');
    error.statusCode = 400;
    throw error;
  }
  const token = jwt.sign({ id: userInfo.id }, jwtSecret);
  return token;
};

const updateInfo = async (password, nickname, user_id) => {
  if (password.length < 10) {
    //비밀번호가 10자리 이상만 가능 아니면 error 날림
    const error = new Error('Password-Invalid');
    error.statusCode = 400;
    throw error;
  }
  const salt = bcrypt.genSaltSync();
  const hashedPw = bcrypt.hashSync(password, salt);

  await userDao.updateInfo(hashedPw, nickname, user_id);
};

const withdrawUser = async user_id => {
  await userDao.withdrawUser(user_id);
};

const getMe = async user_id => {
  return await userDao.getMe(user_id);
};

const changePassword = async (email, password) => {
  if (password.length < 10) {
    const error = new Error('Password-Invalid');
    error.statusCode = 400;
    throw error;
  }
  const salt = bcrypt.genSaltSync();
  const hashedPw = bcrypt.hashSync(password, salt);

  await userDao.changePassword(email, hashedPw);
};

module.exports = {
  signUp,
  login,
  updateInfo,
  withdrawUser,
  getMe,
  changePassword,
};

const myDataSource = require('../models/index');

const signUp = async (email, hashedPw, nickname) => {
  try {
    await myDataSource.query(
      `
      INSERT INTO 
          users ( email, nickname, password)
      VALUES
          (?, ?, ?)
      `,
      [email, nickname, hashedPw]
    );
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      const error = new Error('email already exist');
      error.statusCode = 400;
      throw error;
    }
  }
};

const login = async email => {
  const [userInfo] = await myDataSource.query(
    `
    SELECT * FROM
      users 
    WHERE
      email = ?
    `,
    [email]
  );

  return userInfo;
};

const updateInfo = async (hashedPw, nickname, user_id) => {
  await myDataSource.query(
    `
    UPDATE 
      users 
    SET
      password = ?,
      nickname = ?
    WHERE 
      id = ?
  `,
    [hashedPw, nickname, user_id]
  );
};

const withdrawUser = async user_id => {
  await myDataSource.query(
    `
    DELETE FROM users
    WHERE id = ?
  `,
    [user_id]
  );
};

const getMe = async user_id => {
  let userInfo = await myDataSource.query(
    `
    SELECT
      email, nickname
    FROM
      users
    WHERE
      id = ?;
  `,
    [user_id]
  );
  return userInfo;
};

const changePassword = async (email, hashedPw) => {
  await myDataSource.query(
    `
    UPDATE 
      users 
    SET
      password = ?
    WHERE 
      email = ?
  `,
    [hashedPw, email]
  );
};

module.exports = {
  signUp,
  login,
  updateInfo,
  withdrawUser,
  getMe,
  changePassword,
};

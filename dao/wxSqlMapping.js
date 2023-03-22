// CRUD SQL语句
var wx = {
  queryOpenid: (openid) => { return `SELECT * FROM openid_uuid WHERE openid='${openid}'` },
  upDataUuid: (openid, uuid) => { return `UPDATE openid_uuid SET uuid = '${uuid}' WHERE openid = '${openid}'` },
  addData: (openid, uuid) => { return `INSERT INTO openid_uuid (openid, uuid) VALUES ('${openid}', '${uuid}');` },
  queryUserInfoOpenid: (openid) => { return `SELECT * FROM user_info WHERE openid='${openid}'` },
  queryUserName: (userName) => { return `SELECT * FROM user_info WHERE userName='${userName}'` },
  queryMobile: (mobile) => { return `SELECT * FROM user_info WHERE mobile='${mobile}'` },
  addUserInfo: (openid, userName, mobile) => { return `INSERT INTO user_info (openid, userName, mobile, grade) VALUES ('${openid}', '${userName}', '${mobile}', 'level1');` },
};

module.exports = wx;

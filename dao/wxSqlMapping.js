// CRUD SQL语句
var wx = {
  queryOpenid: (openid) => { return `SELECT * FROM openid_uuid WHERE openid='${openid}'` },
  upDataUuid: (openid, uuid) => { return `UPDATE openid_uuid SET uuid = '${uuid}' WHERE openid = '${openid}'` },
  addData: (openid, uuid) => { return `INSERT INTO openid_uuid (openid, uuid) VALUES ('${openid}', '${uuid}');` }
};

module.exports = wx;

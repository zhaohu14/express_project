var user = {
  queryById: (uid) => {
    console.log(`SELECT * from t_user where uid='${uid}';`)
    return `SELECT * from t_user where uid='${uid}';`
  },
  adminLogin: (admin_id) => {
    return `SELECT * from t_system WHERE admin_id='${admin_id}';`
  }
};

module.exports = user;

// CRUD SQL语句
var article = {
  queryArticle: (id) => { return `SELECT * FROM articlelist WHERE articleID='${id}'` },
  queryAllArticle: () => { return `SELECT * FROM articlelist` }
};

module.exports = article;

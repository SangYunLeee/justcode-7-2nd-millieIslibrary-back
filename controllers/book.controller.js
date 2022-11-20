const bookServ = require('../services/book.service');
const myUtil = require('../utils/myutil.js');

async function createBook(req, res) {
  const book = ({
    title,
    author,
    authorIntro,
    category,
    coverImg,
    introduction,
    toc,
    publishTime,
    publisher,
    ratingScore,
    page,
  } = req.body);
  myUtil.checkDataIsNotEmpty(book);
  await bookServ.createBook(book);
  res.json('생성 완료');
}

const findBooks = async (req, res) => {
  let serchOption = req.query;
  serchOption = { ...serchOption, booksId: req.params.id };
  const result = await bookServ.findBooks(serchOption);
  res.json(result);
};

module.exports = { createBook, findBooks };

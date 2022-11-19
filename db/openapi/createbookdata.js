var fs = require('fs');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.API_KEY;
const ORIGIN_URL = process.env.ORIGIN_URL;
const booksNum = 50;
const pages = [1, 2, 3, 4];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

function getbookListUrl(pageNumber) {
  return `https://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${API_KEY}&QueryType=ItemNewSpecial&MaxResults=${booksNum}&start=${pageNumber}&SearchTarget=Book&output=js&Version=20131101`;
}

function getBookDetail(isbn13) {
  return `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx?ttbkey=${API_KEY}&itemIdType=ISBN13&ItemId=${isbn13}&output=js&Version=20131101&OptResult=ebookList,usedList,Toc,ratingInfo`;
}

function getBookPath(idx) {
  return __dirname + `/aladindb/item_${idx}.json.stackdump`;
}

function convertFormat(aladinItem) {
  let convertedItem = {
    title: aladinItem.title,
    author: aladinItem.author.split(' ')[0],
    category: aladinItem.categoryName.split('>')[1],
    coverImg: aladinItem.cover,
    introduction: aladinItem.description || '소개 없음',
    toc: aladinItem.subInfo.toc || '목차 없음',
    publishTime: aladinItem.pubDate,
    publisher: aladinItem.publisher,
    ratingScore: getRandomInt(100) * 0.1,
    page: aladinItem.subInfo.itemPage || 0,
  };
  return convertedItem;
}
// npm run db 명령어 사용시 books data 생성

const postBook = async book => {
  await axios
    .post(ORIGIN_URL + '/books', book)
    .then(v => {
      console.log(`worked`);
    })
    .catch(e => {
      console.log(`something wrong`);
    });
};

const createBookData = async () => {
  let savingCount = 0;
  for (idx of pages) {
    const responedListDB = await axios.get(getbookListUrl(idx));
    for (book of responedListDB.data.item) {
      let responedBookDB;
      const bookPath = getBookPath(++savingCount);
      if (false === fs.existsSync(bookPath)) {
        responedBookDB = (await axios.get(getBookDetail(book.isbn13))).data;
        if (!responedBookDB.item) {
          continue;
        }
        storeData(responedBookDB, bookPath);
      } else {
        let rawdata = fs.readFileSync(bookPath);
        responedBookDB = JSON.parse(rawdata);
      }

      const detailBook = {
        ...responedBookDB,
        ...responedBookDB.item[0],
        item: undefined,
      };
      const millyBook = convertFormat(detailBook);
      await postBook(millyBook);
    }
  }
  return;
};

(async () => {
  await createBookData();
})();

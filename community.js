var express = require("express");
var router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.json());

var db = require("./signup/db");

const appStyle = () => {
  router.use(express.static("styles"));
};

const appDirname = () => {
  router.use(express.static(__dirname));
};

router.post("/list/remove", (req, res) => {
  const dataFromClient = req.body.data;
  db.query(
    "DELETE FROM board WHERE id = ?",
    [dataFromClient],
    (queryErr, results, fields) => {
      if (queryErr) {
        console.error("쿼리 오류:", queryErr);
        throw queryErr;
      }
    }
  );
  res.redirect("/user/community");
});

router.post("/desc/update", (req, res) => {
  const dataFromClient = req.body;
  const title = dataFromClient.title;
  const desc = dataFromClient.desc;
  const index = dataFromClient.data;

  const query = `UPDATE board SET title = ?, description = ? WHERE id = ?`;

  // 데이터를 배열로 전달합니다.
  const values = [title, desc, index];

  // 데이터베이스 쿼리를 실행하기 전에 SQL Injection 공격으로부터 보호됩니다.
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("쿼리 실행 중 에러 발생:", err);
    } else {
      console.log("쿼리가 성공적으로 실행됨");
    }
  });

  console.log(
    "수정 클라이언트로부터 받은 데이터:",
    dataFromClient.data,
    dataFromClient.title,
    dataFromClient.desc
  );
  res.redirect("/user/community");
});

router.post("/view/update", (req, res) => {
  const dataFromClient = req.body.data;

  db.query(
    `SELECT views FROM board WHERE id=${dataFromClient}`,
    (queryErr, results, fields) => {
      if (queryErr) {
        console.error("쿼리 오류:", queryErr);
        throw queryErr;
      }
      db.query(
        `UPDATE board SET views = ${
          results[0].views + 1
        } WHERE id=${dataFromClient}`
      );
      console.log(results[0].views);
    }
  );
  console.log("클라이언트로부터 받은 데이터:", dataFromClient);

  // 노드 서버로 데이터 전달 또는 다른 처리 수행

  // 클라이언트에 응답 보내기
  res.json({ message: "데이터 전달이 완료되었습니다." });
});

router.get("/community", function (request, response) {
  appStyle(), appDirname();
  response.sendFile(__dirname + "/community.html");
});

router.get("/board_data", function (request, response) {
  db.query("SELECT * FROM board", (queryErr, results, fields) => {
    if (queryErr) {
      console.error("쿼리 오류:", queryErr);
      throw queryErr;
    }
    response.send(results);
  });
});

router.get("/board_write", function (request, response) {
  appStyle(), appDirname();
  response.sendFile(__dirname + "/community_write.html");
});

router.get("/board_read", function (request, response) {
  appStyle(), appDirname();
  response.sendFile(__dirname + "/community_read.html");
});

router.get("/board_update", function (request, response) {
  appStyle(), appDirname();
  response.sendFile(__dirname + "/community_update.html");
});

router.post("/board_save", function (request, response) {
  var title = request.body.title;
  var desc = request.body.desc;
  function getToday() {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var today = year + "-" + month + "-" + day;

    return today;
  }

  let name = () => {
    const rName = request.body.name;
    if (rName === "") {
      let newName = "손님";
      return newName;
    } else {
      let userName = request.body.name;
      return userName;
    }
  };

  const password = request.body.password;

  var views = 0;

  db.query(
    "INSERT INTO board (title, description, created, name, views, password) VALUES(?,?,?,?,?,?)",
    [title, desc, getToday(), name(), views, password]
  );
  console.log("정보 저장 완료");
  console.log(title, desc, name(), password);
});

module.exports = router;

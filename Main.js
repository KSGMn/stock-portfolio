const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const FileStore = require("session-file-store")(session);

var db = require("./signup/db");

var userRouter = require("./community");
var authRouter = require("./signup/auth.js");
var authCheck = require("./signup/authCheck.js");
var template = require("./signup/template.js");
// var headerFn = require("./header.js");

const app = express();

const port = 3000;

const appStyle = () => {
  app.use(express.static("styles"));
};
const appDirname = () => {
  app.use(express.static(__dirname));
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "~~~", // 원하는 문자 입력
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);

app.use(bodyParser.json());

app.get("/user_asset/month", (req, res) => {
  var name = authCheck.statusUI(req, res);
  db.query(
    "SELECT * FROM monthAssets WHERE name = ?",
    [name],
    (queryErr, results, fields) => {
      if (queryErr) {
        console.error("쿼리 오류:", queryErr);
        throw queryErr;
      }
      res.send(results);
    }
  );
});

//유저 원칙 메모 삭제
app.post("/user_rule/remove", (req, res) => {
  const receivedData = req.body.data;
  db.query(
    "DELETE FROM userRule WHERE description = ?",
    [String(receivedData)],
    (queryErr, results, fields) => {
      if (queryErr) {
        console.error("쿼리 오류:", queryErr);
        throw queryErr;
      }
      res.redirect("/main");
      console.log("클라이언트로부터 받은 데이터:", receivedData);
    }
  );
});

//유저 원칙 메모 추가
app.post("/user_rule/add", function (request, response) {
  var userMemo = request.body.memo;
  var name = authCheck.statusUI(request, response);

  db.query("INSERT INTO userRule (name, description) VALUES(?,?)", [
    name,
    userMemo,
  ]);
  console.log("메모 정보 저장 완료");
  response.redirect("/main");

  console.log(name);
});

//유저 원칙 데이터 조회
app.get("/user_rule/data", (req, res) => {
  var name = authCheck.statusUI(req, res);
  db.query(
    "SELECT * FROM userRule WHERE name = ?",
    [name],
    (queryErr, results, fields) => {
      if (queryErr) {
        console.error("쿼리 오류:", queryErr);
        throw queryErr;
      }
      res.send(results);
    }
  );
});

//유저 포트폴리오 메모 삭제
app.post("/user_memo/remove", (req, res) => {
  const receivedData = req.body.data;
  db.query(
    "DELETE FROM userMemo WHERE description = ?",
    [String(receivedData)],
    (queryErr, results, fields) => {
      if (queryErr) {
        console.error("쿼리 오류:", queryErr);
        throw queryErr;
      }
      res.redirect("/portfolio");
      console.log("클라이언트로부터 받은 데이터:", receivedData);
    }
  );
});

//유저 포트폴리오 메모 추가
app.post("/user_memo/add", function (request, response) {
  var userMemo = request.body.memo;
  var name = authCheck.statusUI(request, response);

  db.query("INSERT INTO userMemo (name, description) VALUES(?,?)", [
    name,
    userMemo,
  ]);
  console.log("메모 정보 저장 완료");
  response.redirect("/portfolio");

  console.log(name);
});

//유저 포트폴리오 메모 조회
app.get("/user_memo/data", (req, res) => {
  var name = authCheck.statusUI(req, res);
  db.query(
    "SELECT * FROM userMemo WHERE name = ?",
    [name],
    (queryErr, results, fields) => {
      if (queryErr) {
        console.error("쿼리 오류:", queryErr);
        throw queryErr;
      }
      res.send(results);
    }
  );
});

//현재 유저 투자종목 조회
app.get("/userdata", (req, res) => {
  var name = authCheck.statusUI(req, res);
  db.query(
    "SELECT * FROM userStock WHERE name = ?",
    [name],
    (queryErr, results, fields) => {
      if (queryErr) {
        console.error("쿼리 오류:", queryErr);
        throw queryErr;
      }
      res.send(results);
    }
  );
});

//유저 투자종목 삭제
app.post("/stock/list/remove", (req, res) => {
  const receivedData = req.body.data;
  db.query(
    "DELETE FROM userStock WHERE itmsNm = ?",
    [String(receivedData)],
    (queryErr, results, fields) => {
      if (queryErr) {
        console.error("쿼리 오류:", queryErr);
        throw queryErr;
      }
      res.redirect("/portfolio");
      console.log("클라이언트로부터 받은 데이터:", receivedData);
    }
  );
});

//유저 투자종목 조회
app.get("/stock/list/data", function (request, response) {
  db.query("SELECT * FROM userStock", (queryErr, results, fields) => {
    if (queryErr) {
      console.error("쿼리 오류:", queryErr);
      throw queryErr;
    }
    response.send(results);
  });
});

//유저 투자종목 추가
app.post("/add/stock_list", function (request, response) {
  var srtnCd = request.body.srtnCd;
  var itmsNm = request.body.itmsNm;
  var quantity = request.body.quantity;
  var rp = request.body.rp;
  var name = authCheck.statusUI(request, response);

  db.query(
    "SELECT * FROM userStock WHERE srtnCd = ?",
    [srtnCd],
    (queryErr, results, fields) => {
      if (queryErr) {
        console.error("쿼리 오류:", queryErr);
        throw queryErr;
      }
      if (results.length === 1) {
        console.log("중복된 데이터입니다");
      } else {
        db.query(
          "INSERT INTO userStock (srtnCd, itmsNm, rp, quantity, name) VALUES(?,?,?,?,?)",
          [srtnCd, itmsNm, Number(quantity), Number(rp), name]
        );
        console.log("주식 정보 저장 완료");
        response.redirect("/portfolio");
      }
    }
  );
});

app.get("/", (req, res) => {
  appStyle(), appDirname();
  if (!authCheck.isOwner(req, res)) {
    // 로그인 안되어있으면 로그인 페이지로 이동시킴
    res.redirect("/guest");
    // res.sendFile(__dirname + "/guest.html");
    // headerFn.BtnChange(!authCheck.isOwner(req, res));
    // res.redirect("/auth/login");
    return false;
  } else {
    // 로그인 되어있으면 메인 페이지로 이동시킴
    // res.sendFile(__dirname + "/index.html");
    res.redirect("/main");
    return false;
  }
});

//포트폴리오 페이지
app.get("/portfolio", (req, res) => {
  appStyle(), appDirname();

  if (!authCheck.isOwner(req, res)) {
    // 로그인 안되어있으면 로그인 페이지로 이동시킴
    // res.sendFile(__dirname + "/guest.html");
    // headerFn.BtnChange(!authCheck.isOwner(req, res));
    res.redirect("/auth/login");
    return false;
  } else {
    // 로그인 되어있으면 메인 페이지로 이동시킴
    // res.sendFile(__dirname + "/index.html");
    res.sendFile(__dirname + "/portfolio.html");
    return false;
  }
});

// 인증 라우터
app.use("/auth", authRouter);
app.use("/user", userRouter);

//게스트페이지
app.get("/guest", (req, res) => {
  appStyle(), appDirname();
  if (!authCheck.isOwner(req, res)) {
    // 로그인 안되어있으면 로그인 페이지로 이동시킴
    res.sendFile(__dirname + "/guest.html");
    // headerFn.BtnChange(!authCheck.isOwner(req, res));
    // res.redirect("/auth/login");
    return false;
  } else {
    // 로그인 되어있으면 메인 페이지로 이동시킴
    // res.sendFile(__dirname + "/index.html");
    res.redirect("/main");
    return false;
  }
});

//유저 네임 조회
app.get("/username", (req, res) => {
  const data = { name: authCheck.statusUI(req, res) };
  res.json(data); // JSON 형식으로 데이터 전송
});

// 메인 페이지
app.get("/main", (req, res) => {
  if (!authCheck.isOwner(req, res)) {
    // 로그인 안되어있으면 로그인 페이지로 이동시킴
    // res.redirect("/auth/login");
    // res.sendFile(__dirname + "/guest.html");
    res.redirect("/guest");
    return false;
  } else {
    appStyle(), appDirname();
    res.sendFile(__dirname + "/index.html");
    return false;
  }

  // var html = template.HTML(
  //   "Welcome",
  //   `<hr>
  //       <h2>메인 페이지에 오신 것을 환영합니다</h2>
  //       <p>로그인에 성공하셨습니다.</p>`,
  // authCheck.statusUI(req, res);
  // );

  // res.send(html);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

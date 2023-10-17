import { MyApiKey } from "./apikey.js";

fetch("http://localhost:3000/userdata")
  .then((response) => response.json())
  .then((data) => {
    addList(MyApiKey, data); //종목 불러오기 && 종목 삭제

    if (data.length === 0) {
      noDataChart(); //예시 차트
    } else {
      dataChart(data); //차트
    }
  });

//종목 추가 버튼
document.getElementById("stock_add_btn").onclick = function () {
  stockAdd();
};

//메모 불러오기 && 메모 삭제
fetch("http://localhost:3000/user_memo/data")
  .then((response) => response.json())
  .then((data) => {
    memoRoad(data);
  });

const addList = (MyApiKey, data) => {
  if (data.length === 0) {
    const newWrapper = document.createElement("div");
    const tableBody = document.getElementsByClassName("table__body")[0];
    newWrapper.className = "table__item__ex";
    tableBody.appendChild(newWrapper);
    newWrapper.textContent = "종목을 추가해보세요";
  } else {
    getData(data, MyApiKey);
  }
};

const noDataChart = () => {
  pieChartData = {
    labels: ["종목1", "종목2", "종목3", "종목4", "종목5", "종목6"],
    datasets: [
      {
        data: [10, 20, 30, 40, 50, 60],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
        ],
      },
    ],
  };

  let pieChartDraw = function () {
    let ctx = document.getElementById("chart__canvas").getContext("2d");

    window.pieChart = new Chart(ctx, {
      type: "pie",
      data: pieChartData,
      options: {
        responsive: false,
      },
    });
  };
  pieChartDraw();
};

const dataChart = (data) => {
  const labelList = new Array(length);
  const qnList = new Array(length);
  const rpList = new Array(length);
  const dataList = new Array(length);
  for (let i = 0; i < data.length; i++) {
    labelList[i] = data[i].itmsNm;
    qnList[i] = data[i].quantity;
    rpList[i] = data[i].rp;
    dataList[i] = qnList[i] * rpList[i];
  }

  let pieChartData = {
    labels: labelList,
    datasets: [
      {
        data: dataList,
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
        ],
      },
    ],
  };

  let pieChartDraw = function () {
    let ctx = document.getElementById("chart__canvas").getContext("2d");

    window.pieChart = new Chart(ctx, {
      type: "pie",
      data: pieChartData,
      options: {
        responsive: false,
      },
    });
  };
  pieChartDraw();
};

//주식 종목 추가
function stockAdd() {
  let add1 = document.getElementById("add1").value;
  let add2 = document.getElementById("add2").value;
  let add3 = document.getElementById("add3").value;

  if (!add1 || !add2 || add3 === "") {
    alert("종목명, 잔고수량, 평균매입가를 입력해주세요");
  } else {
    const Name = add1;
    const apiKey = MyApiKey;
    const apiUrl = `https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=${apiKey}&ItmsNm=${Name}&resultType=json&numOfRows=1&mrktCtg=KOSPI`;
    const config = {
      method: "get",
    };
    fetch(apiUrl, config)
      .then((response) => response.json())
      .then((data) => {
        let stockData = data.response.body.items.item;
        if (typeof stockData[0] === "undefined") {
          alert("종목명을 정확히 입력하세요");
        } else if (stockData[0].itmsNm !== add1) {
          alert("종목명을 확인해주세요");
        } else {
          location.reload();
          var dataToSend = {
            srtnCd: stockData[0].srtnCd,
            itmsNm: stockData[0].itmsNm,
            quantity: Number(add2),
            rp: Number(add3),
          };
          // Express 서버의 URL 및 엔드포인트 설정
          var serverURL = " http://localhost:3000/add/stock_list"; // 실제 서버 주소와 포트로 변경
          // POST 요청 생성
          fetch(serverURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
          });
        }
      })
      .catch((error) => console.log(error));
  }
}

//종목 데이터 api요청
function getData(sData, MyApiKey) {
  const apiKey = MyApiKey;
  for (let ii = 0; ii < sData.length; ii++) {
    const newWrapper = document.createElement("div");
    const tableBody = document.getElementsByClassName("table__body")[0];
    newWrapper.className = "table__item";
    tableBody.appendChild(newWrapper);

    const Name = sData[ii].itmsNm;
    const apiUrl = `https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=${apiKey}&ItmsNm=${Name}&resultType=json&numOfRows=1&mrktCtg=KOSPI`;

    const config = {
      method: "get",
    };
    const add2 = sData[ii].rp;
    const add3 = sData[ii].quantity;
    const newItmsNm = sData[ii].itmsNm; //종목명

    fetch(apiUrl, config)
      .then((response) => response.json())
      .then((data) => {
        let stockData = data.response.body.items.item;
        const srtnCdData = stockData[0].srtnCd; //종목코드 데이터
        const clprData = JSON.stringify(stockData[0].clpr).slice(1, -1); //현재가 데이터

        let x = clprData * add2;
        let y = add3 * add2;
        let z = (clprData / add3) * 100 - 100;
        let zFixed = z.toFixed(2);

        const palData = x - y; //평가손익 데이터
        const revenueData = zFixed; //수익률 데이터

        //text생성
        const newSrtncd = stockData[0].srtnCd; //종목코드
        const newClpr = clprData; //현재가
        const newRp = add3; //평균매입가
        const newQuantity = add2; //잔고수량
        const newPal = x - y; //평가손익
        const newRevenue = zFixed; //수익률
        //text생성

        let idList = [
          "srtnCd",
          "itmsNm",
          "clpr",
          "Repurchase_price",
          "quantity",
          "profit_and_loss",
          "revenue",
        ];

        for (let i = 0; i < 7; i++) {
          let newDiv = document.createElement("div");

          newDiv.className = "table__item__text";
          newDiv.id = idList[i];
          const addList = [
            newSrtncd,
            newItmsNm,
            `${newClpr
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원`,
            `${newRp
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원`,
            newQuantity
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","),
            `${newPal
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원`,
            `${newRevenue}%`,
          ];
          let text = document.createTextNode(addList[i]);
          newDiv.appendChild(text);
          newWrapper.appendChild(newDiv);
        }
        let newRemoveBtn = document.createElement("button");
        let remove = document.createElement("i");
        newRemoveBtn.id = "remove_btn";
        remove.classList.add("fas", "fa-trash-can");
        let form = document.createElement("form");
        form.id = "form";
        form.method = "POST";
        form.action = "/stock/list/remove";

        newWrapper.appendChild(newRemoveBtn);
        newRemoveBtn.appendChild(form);
        form.appendChild(remove);

        newRemoveBtn.onclick = function () {
          const findName = newWrapper.childNodes[1].textContent;
          console.log(findName);
          const userConfirm = confirm("삭제하시겠습니까?");

          if (userConfirm) {
            var dataToSend = {
              data: findName,
            };

            // Express 서버의 URL 및 엔드포인트 설정
            var serverURL = " http://localhost:3000/stock/list/remove"; // 실제 서버 주소와 포트로 변경

            // POST 요청 생성
            fetch(serverURL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(dataToSend),
            });

            console.log(findName);
            console.log("삭제");
            location.reload();
          } else {
            console.log("취소");
          }
        };
      })
      .catch((error) => console.log(error));
  }
}

const memoRoad = (data) => {
  if (data.length === 0) {
    const ul = document.getElementById("list_ul");
    const newLi = document.createElement("li");
    const newSpan = document.createElement("span");
    const liText = document.createTextNode("메모를 입력해보세요");
    const memoRemoveBtn = document.createElement("button");
    const memoRemoveBtnIcon = document.createElement("i");

    memoRemoveBtnIcon.classList.add("fas", "fa-trash-can");
    memoRemoveBtn.id = "memo_remove_btn_ex";
    memoRemoveBtn.className = "memo_remove_btn";
    ul.appendChild(newLi);
    newLi.appendChild(newSpan);
    newSpan.appendChild(liText);
    newLi.appendChild(memoRemoveBtn);
    memoRemoveBtn.appendChild(memoRemoveBtnIcon);
    newLi.className = "list_li";
    liText.className = "list_node";
    newSpan.className = "list_span";
  } else {
    for (let i = 0; i < data.length; i++) {
      const ul = document.getElementById("list_ul");
      const newLi = document.createElement("li");
      const newSpan = document.createElement("span");
      const liText = document.createTextNode(data[i].description);
      const memoRemoveBtn = document.createElement("button");
      const memoRemoveBtnIcon = document.createElement("i");

      memoRemoveBtnIcon.classList.add("fas", "fa-trash-can");
      memoRemoveBtn.id = "memo_remove_btn_" + i;
      memoRemoveBtn.className = "memo_remove_btn";
      ul.appendChild(newLi);
      newLi.appendChild(newSpan);
      newSpan.appendChild(liText);
      newLi.appendChild(memoRemoveBtn);
      memoRemoveBtn.appendChild(memoRemoveBtnIcon);
      newLi.className = "list_li";
      liText.className = "list_node";
      newSpan.className = "list_span";

      memoRemoveBtn.onclick = function () {
        const findText = liText.textContent;

        const userConfirm = confirm("삭제하시겠습니까?");

        if (userConfirm) {
          location.reload();
          var dataToSend = {
            data: findText,
          };

          // Express 서버의 URL 및 엔드포인트 설정
          var serverURL = " http://localhost:3000/user_memo/remove"; // 실제 서버 주소와 포트로 변경

          // POST 요청 생성
          fetch(serverURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(dataToSend),
          });

          console.log("삭제");
        } else {
          console.log("취소");
        }
      };
    }
  }
};

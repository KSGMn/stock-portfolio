import { MyApiKey } from "./apikey.js";

const nmList = [];
const rpList = [];
const qnList = [];
const clprList = new Array(length);

function aaa(data1, length, MyApiKey) {
  const fetchPromises = [];
  const apiKey = MyApiKey;
  // "wqzu4Mo%2FOHjXQDLLn6WM%2FPwT6VbIBNg1%2BProaIyLJ3Pxy6GzVihcd1bIOSdvMe9vF%2FuRJ7JZwcT%2F4nvX8V1a4g%3D%3D";

  for (let i = 0; i < length; i++) {
    const config = {
      method: "get",
    };
    let Name = data1[i].itmsNm;
    const apiUrl = `https://apis.data.go.kr/1160100/service/GetStockSecuritiesInfoService/getStockPriceInfo?serviceKey=${apiKey}&ItmsNm=${Name}&resultType=json&numOfRows=1&mrktCtg=KOSPI`;

    const fetchPromise = fetch(apiUrl, config)
      .then((response) => response.json())
      .then((data2) => {
        let stockData = data2.response.body.items.item;
        let clpr = JSON.stringify(stockData[0].clpr).slice(1, -1);
        clprList[i] = JSON.parse(clpr);
      })
      .catch((error) => console.log(error));
    fetchPromises.push(fetchPromise);
  }
  Promise.all(fetchPromises)
    .then(() => {
      // clprList를 사용하여 원하는 작업을 수행할 수 있습니다.

      const totalAssetsEl = new Array(length); //총 자산 요소
      const vPnlEl = new Array(length); //평가손익 요소
      const myMoneyEl = new Array(length); //투자 원금 요소
      for (let i = 0; i < data1.length; i++) {
        totalAssetsEl[i] = clprList[i] * rpList[i];
        vPnlEl[i] = clprList[i] * rpList[i] - rpList[i] * qnList[i];
        myMoneyEl[i] = rpList[i] * qnList[i];
      }
      let totalAssets = 0; //총 자산
      let vPnl = 0; //평가손익
      let myMoney = 0; //투자 원금

      for (let i = 0; i < data1.length; i++) {
        totalAssets += totalAssetsEl[i];
        vPnl += vPnlEl[i];
        myMoney += myMoneyEl[i];
      }

      const vPnlPel = vPnlEl.filter((element) => 0 < element); //수익중인 평가손익 요소
      const vPnlMel = vPnlEl.filter((element) => 0 > element); //손실중인 평가손익 요소

      let vPnlP = 0; //수익중인 평가손익
      let vPnlM = 0; //손실중인 평가손익

      for (let i = 0; i < vPnlPel.length; i++) {
        vPnlP += vPnlPel[i];
      }

      for (let i = 0; i < vPnlMel.length; i++) {
        vPnlM += vPnlMel[i];
      }

      barChart(vPnlP, vPnlM);

      let ror = (vPnl / myMoney) * 100; //수익률
      let rorFixed = ror.toFixed(2);

      const upCount = vPnlEl.filter((element) => 0 < element).length;
      const downCount = vPnlEl.filter((element) => 0 > element).length;

      if (data1.length === 0) {
        document.getElementById("a").textContent = "0" + "원";
        document.getElementById("b").textContent = "수익률" + "0" + "%";
        document.getElementById("c").textContent = "0" + "원";
        document.getElementById("d").textContent = "투자중인 기업" + "0" + "개";
        document.getElementById("e").textContent = "수익 기업" + "0" + "개";
        document.getElementById("f").textContent = "손실 기업" + "0" + "개";
      } else {
        document.getElementById("a").textContent = `총 자산 ${totalAssets
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원`;

        document.getElementById("b").textContent = `수익률 ${rorFixed}%`;
        document.getElementById("c").textContent = `평가손익 ${vPnl
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}원`;

        document.getElementById("d").textContent = `투자종목 : ${String(
          data1.length
        )}개`;
        document.getElementById("e").textContent = `수익종목 : ${String(
          upCount
        )}개`;
        document.getElementById("f").textContent = `손실종목 : ${String(
          downCount
        )}개`;
      }
    })
    .catch((error) => console.log(error));
}

fetch("http://localhost:3000/userdata")
  .then((response) => response.json())
  .then((data1) => {
    if (data1.length === 0) {
      fetch("http://localhost:3000/username")
        .then((response) => response.json())
        .then((data) => {
          const element = document.getElementById("myName");
          if (element) {
            element.textContent = `${data.name}님의 자산`;
          } else {
            console.log("요소를 찾을 수 없습니다.");
          }
        });
    } else {
      document.getElementById(
        "myName"
      ).textContent = `${data1[0].name}님의 자산`;
    }

    for (let i = 0; i < data1.length; i++) {
      const itmsNm = data1[i].itmsNm; //종목명
      const rp = data1[i].rp; //잔고수량
      const quanTity = data1[i].quantity; //평균매입가

      nmList.push(itmsNm);
      rpList.push(rp);
      qnList.push(quanTity);
    }

    aaa(data1, data1.length, MyApiKey);
  })
  .catch((error) => console.log(error));

fetch("http://localhost:3000/user_rule/data")
  .then((response) => response.json())
  .then((data) => {
    if (data.length === 0) {
      const ul = document.getElementById("list_ul");
      const newLi = document.createElement("li");
      const newSpan = document.createElement("span");
      const liText = document.createTextNode("메모를 입력해보세요");
      const ruleRemoveBtn = document.createElement("button");
      const ruleRemoveBtnIcon = document.createElement("i");

      ruleRemoveBtnIcon.classList.add("fas", "fa-trash-can");
      ruleRemoveBtn.id = "rule_remove_btn_ex";
      ruleRemoveBtn.className = "rule_remove_btn_ex";

      ul.appendChild(newLi);
      newLi.appendChild(newSpan);
      newSpan.appendChild(liText);
      newLi.appendChild(ruleRemoveBtn);
      ruleRemoveBtn.appendChild(ruleRemoveBtnIcon);

      newLi.className = "list_li_ex";
      liText.className = "list_node_ex";
      newSpan.className = "list_span_ex";
    } else {
      for (let i = 0; i < data.length; i++) {
        const ul = document.getElementById("list_ul");
        const newLi = document.createElement("li");
        const newSpan = document.createElement("span");
        const liText = document.createTextNode(data[i].description);
        const ruleRemoveBtn = document.createElement("button");
        const ruleRemoveBtnIcon = document.createElement("i");

        ruleRemoveBtnIcon.classList.add("fas", "fa-trash-can");
        ruleRemoveBtn.id = "rule_remove_btn_" + i;
        ruleRemoveBtn.className = "rule_remove_btn";
        ul.appendChild(newLi);
        newLi.appendChild(newSpan);
        newSpan.appendChild(liText);
        newLi.appendChild(ruleRemoveBtn);
        ruleRemoveBtn.appendChild(ruleRemoveBtnIcon);
        newLi.className = "list_li";
        liText.className = "list_node";
        newSpan.className = "list_span";

        ruleRemoveBtn.onclick = function () {
          const findText = liText.textContent;

          const userConfirm = confirm("삭제하시겠습니까?");

          if (userConfirm) {
            location.reload();
            var dataToSend = {
              data: findText,
            };

            // Express 서버의 URL 및 엔드포인트 설정
            var serverURL = " http://localhost:3000/user_rule/remove"; // 실제 서버 주소와 포트로 변경

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
  });

// fetch("http://localhost:3000/user_asset/month")
//   .then((response) => response.json())
//   .then((data1) => {});

new Chart(document.getElementById("line-chart"), {
  type: "line",
  data: {
    labels: [
      "1월",
      "2월",
      "3월",
      "4월",
      "5월",
      "6월",
      "7월",
      "8월",
      "9월",
      "10월",
      "11월",
      "12월",
    ],
    datasets: [
      {
        data: [
          50000000, 60000000, 40000000, 90000000, 140000000, 160000000,
          130000000, 150000000, 170000000, 200000000, 160000000, 155000000,
        ],
        label: "",
        borderColor: "#FFA500",
        fill: true,
        backgroundColor: "rgba(255, 165, 0, 0.2)",
      },
    ],
  },
  options: {
    maintainAspectRatio: false,
    // aspectRatio: 2,
    title: {
      display: false,
      text: "월별 수익률",
      fontSize: 20,
    },
    legend: {
      display: false,
    },
  },
});

let barChart = (p, m) => {
  let dataList = [p, m];
  new Chart(document.getElementById("bar-chart-horizontal"), {
    type: "horizontalBar",
    data: {
      labels: ["수익", "손실"],
      datasets: [
        {
          label: "",
          backgroundColor: ["#3e95cd", "#8e5ea2"],
          data: dataList,
        },
      ],
    },
    options: {
      legend: { display: false },
      title: {
        display: false,
        text: "Predicted world population (millions) in 2050",
      },
    },
  });
};

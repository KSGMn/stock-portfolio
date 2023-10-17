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
          0, 0, 0, 0, 140000000, 160000000, 130000000, 150000000, 170000000,
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

new Chart(document.getElementById("bar-chart-horizontal"), {
  type: "horizontalBar",
  data: {
    labels: ["수익", "손실"],
    datasets: [
      {
        label: "",
        backgroundColor: ["#3e95cd", "#8e5ea2"],
        data: [115910000, -9880000],
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

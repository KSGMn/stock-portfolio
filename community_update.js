let index = localStorage.getItem("index");

function newRead(index) {
  fetch("http://localhost:3000/user/board_data")
    .then((response) => response.json())
    .then((data) => {
      const idx = data.findIndex((obj) => obj.id === Number(index));
      const readData = data[idx];

      document.getElementById("board__title").value = readData.title;
      document.getElementById("text__area__desc").value = readData.description;
      document.getElementById("board__name").placeholder = readData.name;
      document.getElementById("board__password").placeholder =
        readData.password;

      console.log(readData);

      document.getElementById("update_btn").onclick = function () {
        fetch("http://localhost:3000/user/desc/update", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: index,
            title: document.getElementById("board__title").value,
            desc: document.getElementById("text__area__desc").value,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("수정 서버 응답:", data);
          })
          .catch((error) => {
            console.error("오류 발생:", error);
          });
      };
    });
}

newRead(index);

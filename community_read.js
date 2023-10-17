let index = localStorage.getItem("index");

function newRead(index) {
  fetch("http://localhost:3000/user/board_data")
    .then((response) => response.json())
    .then((data) => {
      const idx = data.findIndex((obj) => obj.id === Number(index));
      const readData = data[idx];
      document.getElementById("name").value = readData.name;
      document.getElementById("board__title").value = readData.title;
      document.getElementById("text__area__desc").value = readData.description;

      document.getElementById("created_btn").onclick = function (event) {
        const password = document.getElementById("password").value;
        if (password !== readData.password) {
          alert("비밀번호가 틀립니다.");
          event.preventDefault();
        } else {
          location.href = `/user/board_update?index=${index}`;
        }
      };

      document.getElementById("remove_btn").onclick = function (event) {
        const password = document.getElementById("password").value;
        if (password !== readData.password) {
          alert("비밀번호가 틀립니다.");
          event.preventDefault();
        } else {
          const userConfirm = confirm("게시글을 삭제할까요?");
          if (userConfirm) {
            fetch("http://localhost:3000/user/list/remove", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: index,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("수정 서버 응답:", data);
              })
              .catch((error) => {
                console.error("오류 발생:", error);
              });
          }
        }
      };
    });
}

newRead(index);

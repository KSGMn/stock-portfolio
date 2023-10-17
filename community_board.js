fetch("http://localhost:3000/user/board_data")
  .then((response) => response.json())
  .then((data) => {
    function makeList() {
      for (var i = 0; i < data.length; i++) {
        let numBer = data[i].id;
        let Title = data[i].title;
        let Created = data[i].created;
        let Name = data[i].name;
        let Views = data[i].views;

        const newList = document.createElement("div");
        const boardBody = document.getElementsByClassName("board__body")[0];
        newList.className = "list";

        boardBody.appendChild(newList);

        for (var ii = 0; ii < 5; ii++) {
          let newA = document.createElement("div");
          let listClass = ["number", "title", "wirter", "wirter_day", "check"];
          newA.className = listClass[ii];
          newA.id = listClass[ii];
          const addList = [numBer, Title, Name, Created, Views];
          let text = document.createTextNode(addList[ii]);
          newA.appendChild(text);
          newList.appendChild(newA);
        }

        newList.onclick = function () {
          const index = newList.firstChild.textContent;
          localStorage.setItem("index", index);
          fetch("http://localhost:3000/user/view/update", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: index }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("서버 응답:", data);
            })
            .catch((error) => {
              console.error("오류 발생:", error);
            });
          location.href = `/user/board_read?index=${index}`;
          // nR.newRead(Number(index));
        };
      }
    }
    makeList();
  });

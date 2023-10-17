document.getElementById("save_btn").onclick = function () {
  const title = document.getElementById("title").value;
  const desc = document.getElementById("desc").value;
  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;

  if (!title || !desc || password === "") {
    alert("제목, 내용, 비밀번호를 입력하세요");
  } else {
    fetch("http://localhost:3000/user/board_save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        desc: desc,
        name: name,
        password: password,
      }),
    });
    location.href = "/user/community";
  }
};

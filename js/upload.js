function uploadFile() {
    const file = document.getElementById("file").files[0];
    const fileName = document.getElementById("fileName").value;
    const describtion = document.getElementById("describtion").value;
    const result = document.getElementById("result");
	const loggedUser = localStorage.getItem("loggedInUser")
		? JSON.parse(localStorage.getItem("loggedInUser"))
		: null;

if (!loggedUser || !loggedUser.token) {
    alert("请先登录");
    location.href = "login.html";
}

const token = loggedUser.token;

    // if (!file) {
    //     result.innerText = "请选择文件";
    //     return;
    // }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("describtion", describtion);

    fetch("https://robbie-3fob.onrender.com/robert/uploadOss", {
        method: "POST",
        headers: {
            "Authorization": token || ""
        },
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        result.innerText = "上传成功：" + data;
    })
    .catch(err => {
        result.innerText = "上传失败";
        console.error(err);
    });
}

document.body.addEventListener("pointermove", (e)=>{
  const { currentTarget: el, clientX: x, clientY: y } = e;
  const { top: t, left: l, width: w, height: h } = el.getBoundingClientRect();
  el.style.setProperty('--posX',  x-l-w/2);
  el.style.setProperty('--posY',  y-t-h/2);
})

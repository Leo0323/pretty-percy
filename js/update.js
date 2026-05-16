document.addEventListener("DOMContentLoaded", function () {
    loadFile();
});

// 页面初始化：根据 id 查询文件信息并填充
function loadFile() {
    const params = new URLSearchParams(window.location.search);
    const fileId = params.get("id");

    if (!fileId) {
        alert("缺少文件 ID");
        return;
    }

    const loggedUser = localStorage.getItem("loggedInUser")
        ? JSON.parse(localStorage.getItem("loggedInUser"))
        : null;

    if (!loggedUser || !loggedUser.token) {
        alert("请先登录");
        location.href = "login.html";
        return;
    }

    const token = loggedUser.token;

    fetch(`https://robbie-3fob.onrender.com/robert/JsonById/${fileId}`, {
        headers: {
            "Authorization": token
        }
    })
    .then(res => res.json())
    .then(data => {
        // 🔥 回显到表单
        document.getElementById("fileId").value = data.id;
        document.getElementById("fileName").value = data.fileName || "";
        document.getElementById("describtion").value = data.describtion || "";
    })
    .catch(err => {
        console.error(err);
        alert("加载文件信息失败");
    });
}
function updateFile() {
	 const fileId = document.getElementById("fileId").value;
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
    if (!fileId || !fileName) {
        result.innerText = "文件ID和文件名称不能为空";
        return;
    }

    const payload = {
        fileName: fileName,
        describtion: describtion
    };

    fetch(`https://robbie-3fob.onrender.com/robert/updateFile/${fileId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token || ""
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.text())
    .then(data => {
        result.innerText = data;
    })
    .catch(err => {
        console.error(err);
        result.innerText = "修改失败";
    });
}

	document.body.addEventListener("pointermove", (e)=>{
			  const { currentTarget: el, clientX: x, clientY: y } = e;
			  const { top: t, left: l, width: w, height: h } = el.getBoundingClientRect();
			  el.style.setProperty('--posX',  x-l-w/2);
			  el.style.setProperty('--posY',  y-t-h/2);
			})

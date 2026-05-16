const BASE = "https://robbie-3fob.onrender.com/robert";
const user = JSON.parse(localStorage.getItem("loggedInUser"));
const fileId = new URLSearchParams(location.search).get("id");

let parentPage = 1;
let parentTotal = 0;
let subPageMap = {};
let subTotalMap = {};
let loadingParent = false;
let replyPid = 0, replyUserId = 0, replyUsername = "";
let fileOwnerId = null;

const mediaContainer = document.getElementById("media");

function toggleSendBtn() {
  const v = document.getElementById("content").value.trim();
  document.getElementById("sendBtn").classList.toggle("active", v.length > 0);
}

/* 加载文件 */
axios.get(`${BASE}/JsonById/${fileId}`, { headers: { Authorization: user.token } })
.then(res => {
  const f = res.data;
  fileOwnerId = f.id;

  document.getElementById("descText").innerText = f.describtion || "";
  document.getElementById("authorTime").innerText = (f.uploadTime || "").slice(0, 10);

  // 加载作者信息
  // 加载作者信息
  axios.get(`${BASE}/getUserByFileName/${fileOwnerId}`, { headers: { Authorization: user.token } })
  .then(ress => {
    const u = ress.data;
    const avatar = u.avatar || "https://via.placeholder.com/34/181818/888?text=U";
    const uid = u.userId;
    
    document.getElementById("authorAvatar").src = avatar;
    document.getElementById("authorName").innerText = u.userName || f.userName || "—";
  
   // 权限检查：只有当前用户是帖子发布者才显示操作按钮
   if (uid == user.userId) {
     const actionsDiv = document.getElementById("authorActions");
     actionsDiv.innerHTML = `
       <button class="author-action-icon" 
               onclick="editPost(${fileId})" 
               data-tooltip="编辑"
               title="编辑">
         <i class="layui-icon layui-icon-edit"></i>
       </button>
       <button class="author-action-icon delete-icon" 
               onclick="deletePost(${fileId})" 
               data-tooltip="删除"
               title="删除">
         <i class="layui-icon layui-icon-delete"></i>
       </button>
     `;
   }
  })
  })
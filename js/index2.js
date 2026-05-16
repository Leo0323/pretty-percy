/* ========== Feed 变量 ========== */
let feedPage = 1;
let totalPages = 1;
let feedMode = 'latest';
let currentKeyword = '';
let currentType = '';
const pageSize = 9;
let isLoading = false;
let colCount = 5;
let cols = [];
let totalCardCount = 0;

const fileGrid    = document.getElementById('fileGrid');
const latestBtn   = document.getElementById('latestBtn');
const hotBtn      = document.getElementById('hotBtn');
const indicator   = document.getElementById('feedIndicator');
const searchInput = document.getElementById('searchInput');
const backToTop   = document.getElementById('backToTop');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const noMoreText  = document.getElementById('noMoreText');

/* ========== 加载动态 ========== */
function loadFeed(append) {
    if (isLoading) return;
    isLoading = true;
    if (loadMoreBtn) loadMoreBtn.disabled = true;

    const params = { currentPage: feedPage, pageSize };
    if (currentKeyword) params.name = currentKeyword;
    if (currentType)    params.type = currentType;

    const url = feedMode === 'latest'
        ? 'https://robbie-3fob.onrender.com/robert/getFileByTime'
        : 'https://robbie-3fob.onrender.com/getFileByLike';

    axios.get(url, {
        params,
        headers: { Authorization: loggedInUser.token }
    }).then(res => {
        const page  = res.data;
        const files = page.records || [];
        totalPages  = page.pages  || 1;

        if (!append) {
            fileGrid.innerHTML = '';
            cols = [];
            totalCardCount = 0;
            colCount = window.innerWidth > 1200 ? 5 : window.innerWidth > 900 ? 4 : window.innerWidth > 600 ? 3 : 2;
            for (let i = 0; i < colCount; i++) {
                const col = document.createElement('div');
                col.className = 'masonry-col';
                fileGrid.appendChild(col);
                cols.push(col);
            }
        }
        renderFiles(files);

        if (feedPage >= totalPages) {
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            if (noMoreText)  noMoreText.style.display  = 'block';
        } else {
            if (loadMoreBtn) { loadMoreBtn.style.display = 'inline-flex'; loadMoreBtn.disabled = false; }
            if (noMoreText)  noMoreText.style.display  = 'none';
        }
    }).catch(err => {
        console.error('loadFeed error', err);
        if (loadMoreBtn) loadMoreBtn.disabled = false;
    }).finally(() => {
        isLoading = false;
    });
}

/* ========== 加载更多 ========== */
function loadMore() {
    if (feedPage >= totalPages) return;
    feedPage++;
    loadFeed(true);
}

/* ========== 重置并重新加载 ========== */
function reloadFeed() {
    feedPage = 1;
    loadFeed(false);
}

/* ========== 渲染文件列表 ========== */
function renderFiles(files) {
    if (!files || files.length === 0) {
        if (feedPage === 1) fileGrid.innerHTML = '<div class="empty">暂无内容</div>';
        return;
    }

    files.forEach((file, idx) => {
        const card = document.createElement('div');
        card.className = 'feed-card';
        card.style.animationDelay = (idx * 0.03) + 's';

        /* --- 媒体区 --- */
        const mediaBox = document.createElement('div');
        mediaBox.className = 'img-box';

        if (file.fileType === 'image' || file.fileType === 'video') {
            if (file.ossUrl) {
                appendMedia(mediaBox, file, file.ossUrl);
            } else {
                axios.get(
                    `https://robbie-3fob.onrender.com/robert/getFileById/${file.id}`,
                    { responseType: 'blob', headers: { Authorization: loggedInUser.token } }
                ).then(r => {
                    appendMedia(mediaBox, file, URL.createObjectURL(r.data));
                }).catch(() => appendCaption(mediaBox, file));
            }
        } else {
            const colors = ['#8ecae6','#a8dadc','#ffd166','#cdb4db','#b7e4c7'];
            mediaBox.classList.add('color-placeholder');
            mediaBox.style.background = colors[Math.floor(Math.random() * colors.length)];
            appendCaption(mediaBox, file);
        }
        card.appendChild(mediaBox);

        /* --- 底部 --- */
        const footer = document.createElement('div');
        footer.className = 'card-footer';

        const stats = document.createElement('div');
        stats.className = 'card-stats';

        /* 点赞 */
        const likeItem = document.createElement('div');
        likeItem.className = 'stat-item';
        likeItem.innerHTML = `<i class="layui-icon layui-icon-heart-fill" style="display:none"></i><i class="layui-icon layui-icon-heart"></i><span>0</span>`;
        const likeCount = likeItem.querySelector('span');

        let liked = false;
        const user = JSON.parse(localStorage.getItem('loggedInUser'));

        /* 查询点赞数 */
        axios.get(`https://robbie-3fob.onrender.com/robert/getLikeCount/${file.id}`, {
            headers: { Authorization: user.token }
        }).then(r => {
            likeCount.textContent = r.data ?? 0;
        });

        /* 查询是否已点赞 */
        axios.get(`https://robbie-3fob.onrender.com/robert/like/hasLiked/${file.id}/${user.userId}`, {
            headers: { Authorization: user.token }
        }).then(r => {
            liked = r.data === true;
            if (liked) {
                likeItem.classList.add('liked');
                likeItem.querySelector('.layui-icon-heart-fill').style.display = '';
                likeItem.querySelector('.layui-icon-heart').style.display = 'none';
            }
        });

        likeItem.addEventListener('click', e => {
            e.stopPropagation();
            const likeUrl = liked
                ? `https://robbie-3fob.onrender.com/robert/like/cancel/check/${file.id}/${user.userId}`
                : `https://robbie-3fob.onrender.com/robert/like/check/${file.id}/${user.userId}`;

            axios.get(likeUrl, { headers: { Authorization: user.token } })
                .then(() => {
                    liked = !liked;
                    let n = parseInt(likeCount.textContent) || 0;
                    likeCount.textContent = liked ? n + 1 : Math.max(0, n - 1);
                    likeItem.classList.toggle('liked', liked);
                    likeItem.querySelector('.layui-icon-heart-fill').style.display = liked ? '' : 'none';
                    likeItem.querySelector('.layui-icon-heart').style.display = liked ? 'none' : '';
                })
                .catch(err => console.error('点赞失败', err));
        });

        /* 评论数 */
        const commentItem = document.createElement('div');
        commentItem.className = 'stat-item';
        commentItem.innerHTML = `<i class="layui-icon layui-icon-chat"></i><span>0</span>`;
        axios.get(`https://robbie-3fob.onrender.com/robert/getCommCount/${file.id}`, {
            headers: { Authorization: user.token }
        }).then(r => {
            commentItem.querySelector('span').textContent = r.data ?? 0;
        });

        stats.appendChild(likeItem);
        stats.appendChild(commentItem);
        footer.appendChild(stats);

        /* 编辑按钮 */
        if (file.isOwner) {
            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.innerHTML = '<i class="layui-icon layui-icon-edit"></i> 修改';
            editBtn.onclick = e => {
                e.stopPropagation();
                localStorage.setItem('editFile', JSON.stringify(file));
                window.location.href = 'update.html?id=' + file.id;
            };
            footer.appendChild(editBtn);
        }

        card.appendChild(footer);

        card.addEventListener('click', () => {
            localStorage.setItem('currentFile', JSON.stringify(file));
            window.open(`fileDetail.html?id=${file.id}`, '_blank');
        });

        // 轮流分配到各列
        cols[totalCardCount % cols.length].appendChild(card);
        totalCardCount++;
    });
}

/* ========== 附加媒体 + caption ========== */
function appendMedia(container, file, src) {
    let el;
    if (file.fileType === 'image') {
        el = new Image();
        el.alt = file.fileName;
    } else {
        el = document.createElement('video');
        el.controls = true;
    }
    el.src = src;
    container.appendChild(el);
    appendCaption(container, file);
}

function appendCaption(container, file) {
    const box = document.createElement('div');
    box.className = 'transparent-box';
    const cap = document.createElement('div');
    cap.className = 'caption';
    const t = document.createElement('p');
    t.textContent = file.fileName;
    const d = document.createElement('p');
    d.textContent = file.describtion || '';
    cap.appendChild(t);
    cap.appendChild(d);
    box.appendChild(cap);
    container.appendChild(box);
}

/* ========== 排序切换 ========== */
latestBtn.onclick = () => {
    if (feedMode === 'latest') return;
    feedMode = 'latest';
    latestBtn.classList.add('active');
    hotBtn.classList.remove('active');
    updateIndicator();
    reloadFeed();
};
hotBtn.onclick = () => {
    if (feedMode === 'hot') return;
    feedMode = 'hot';
    hotBtn.classList.add('active');
    latestBtn.classList.remove('active');
    updateIndicator();
    reloadFeed();
};

function updateIndicator() {
    const active = feedMode === 'latest' ? latestBtn : hotBtn;
    indicator.style.width = active.offsetWidth + 'px';
    indicator.style.transform = `translateX(${active.offsetLeft}px)`;
}

/* ========== 搜索 ========== */
function searchFiles() {
    currentKeyword = searchInput.value.trim();
    currentType    = document.getElementById('typeSelect').value;
    reloadFeed();
}
searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') searchFiles();
});

/* ========== 返回顶部 ========== */
window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 400);
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========== 初始化 ========== */
updateIndicator();
loadFeed(false);
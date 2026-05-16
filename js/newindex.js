/* ========== 专辑多曲目音乐播放器 - 简化版（直接替换你的 main.js 中的相关代码） ========== */

if (document.getElementById("progress")) {
    const progress = document.getElementById("progress");
    const song = document.getElementById("song");
    const controlIcon = document.getElementById("controlIcon");
    const playPauseButton = document.querySelector(".play-pause-btn");
    const nextButton = document.querySelector(".controls button.forward");
    const prevButton = document.querySelector(".controls button.backward");
    const songName = document.querySelector(".music-player h1");   // ✨ h1 显示专辑名
    const artistName = document.querySelector(".music-player p");  // ✨ p 显示当前曲目

    // ✨ 专辑数据结构 - 修改这里添加你的专辑和曲目
    const albums = [
        {
            name: "Led Zeppelin Ⅰ",
            songs: [
                { title: "Babe I Gonna Laeve You", source: "https://raw.githubusercontent.com/Leo0323/pervik/main/025e_550e_0109_5432df01cdbdfb56062d6cd0438f2b61.m4a" },
                { title: "You Shook Me", source: "https://raw.githubusercontent.com/Leo0323/pervik/main/"},
                { title: "Communication Breakdown", source: "https://raw.githubusercontent.com/Leo0323/pervik/main/cmbd.m4a" },
            ]
        },
        {
            name: "Led Zeppelin Ⅱ",
            songs: [
                { title: "Whole Lotta Love", source: "https://raw.githubusercontent.com/Leo0323/pervik/main/wll.m4a" },
                { title: "Heartbreaker", source: "https://raw.githubusercontent.com/Leo0323/pervik/main/heartbreaker.m4a" },
                { title: "Living Loving Maid", source:"https://raw.githubusercontent.com/Leo0323/pervik/main/she just women.m4a"},
            ]
        },
        {
            name: "Led Zeppelin Ⅲ",
            songs: [
                { title: "Immigrant Song", source: "https://raw.githubusercontent.com/Leo0323/pervik/main/immigrantson.m4a" },
                { title: "Since I`ve Been Loving You", source: "https://raw.githubusercontent.com/Leo0323/pervik/main/sinceibeeen lovingyou.m4a"},
                { title: "That`s the Way", source:"https://raw.githubusercontent.com/Leo0323/pervik/main/thatway.m4a" },
            ]
        },
        {
            name: "Led Zeppelin Ⅳ",
            songs: [
                { title: "Stairway To Heaven", source: "https://raw.githubusercontent.com/Leo0323/pervik/main/obj_wonDkMOGw6XDiTHCmMOi_14052380510_ce9e_c248_ceb4_a84f1344781ab195bd54c48c11f8fbb6.mp3" },
                { title: "Black Dog", source: "https://raw.githubusercontent.com/Leo0323/pervik/main/black dog.m4a" },
                { title: "Rock And Roll", source:"https://raw.githubusercontent.com/Leo0323/pervik/main/rockn roll.m4a"},
            ]
        },
        {
            name: "House of the Holy",
            songs: [
                { title: "No Quarter", source: "https://raw.githubusercontent.com/Leo0323/pervik/main/noquarter.m4a" },
                { title: "The Rain Song", source: "https://raw.githubusercontent.com/Leo0323/pervik/main/rain song.m4a"},
                { title: "The Ocean", source:"https://raw.githubusercontent.com/Leo0323/pervik/main/theocean.m4a" },
            ]
        },
        {
            name: "Physical Graffti",
            songs: [
                { title: "In My Time Of Dying", source: "https://raw.githubusercontent.com/Leo0323/pervik/main/inmytimeofdying.m4a" },
                { title: "Don't Start Now", source: "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Dua-Lipa-Physical.mp3" },
                { title: "Break My Heart", source: "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Dua-Lipa-Physical.mp3" },
            ]
        },
        {
            name: "Delicate",
            songs: [
                { title: "Delicate", source: "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Taylor-Swift-Delicate.mp3" },
                { title: "Look What You Made Me Do", source: "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Taylor-Swift-Delicate.mp3" },
                { title: "Getaway Car", source: "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Taylor-Swift-Delicate.mp3" },
            ]
        },
        {
            name: "Robert Plant",
            songs: [
                { title: "Whole Lotta Love", source: "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Taylor-Swift-Delicate.mp3" },
                { title: "Black Dog", source: "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Taylor-Swift-Delicate.mp3" },
                { title: "Immigrant Song", source: "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Taylor-Swift-Delicate.mp3" },
            ]
        },
    ];

    // ✨ 当前播放状态
    let currentAlbumIndex = 3;  // 初始专辑（对应 swiper 的 initialSlide: 3）
    let currentSongIndex = 0;   // 专辑内的曲目索引
    let swiper = null;

    // ✨ 获取当前专辑
    function getCurrentAlbum() {
        return albums[currentAlbumIndex];
    }

    // ✨ 获取当前曲目
    function getCurrentSong() {
        return getCurrentAlbum().songs[currentSongIndex];
    }

    // ✨ 更新播放器显示
   function updatePlayerDisplay() {
   
       const album = getCurrentAlbum();
       const currentSong = getCurrentSong();
   
       songName.textContent = album.name;
   
       artistName.textContent = currentSong.title;
   
       song.src = currentSong.source;
   
       song.load();   // ✨ 必须加
   
   }

    // ========== 音频事件监听 ==========
    song.addEventListener("timeupdate", () => {
        if (!song.paused) {
            progress.value = song.currentTime;
        }
    });

    song.addEventListener("loadedmetadata", () => {

        progress.max = song.duration;
        progress.value = song.currentTime;
    });

    // ✨ 曲目结束 - 自动播放下一首
    song.addEventListener("ended", () => {
        const album = getCurrentAlbum();
        
        if (currentSongIndex < album.songs.length - 1) {
            // 同专辑的下一首
            currentSongIndex++;
            updatePlayerDisplay();
            playSong();
        } else {
    // 本专辑全部播放完毕，跳下一张专辑
    if (currentAlbumIndex < albums.length - 1) {
        currentAlbumIndex++;
        currentSongIndex = 0;
        updatePlayerDisplay();
        playSong();
        swiper.slideTo(currentAlbumIndex); // swiper跟着切换
    } else {
        pauseSong(); // 最后一张专辑最后一首，停止
    }
	}
});

    // ========== 播放/暂停控制 ==========
    function pauseSong() {
        song.pause();
        controlIcon.classList.remove("fa-pause");
        controlIcon.classList.add("fa-play");
    }

    function playSong() {
		song.muted = false;
        const p = song.play();
            if(p !== undefined){
                p.catch(()=>{});
            }
        controlIcon.classList.add("fa-pause");
        controlIcon.classList.remove("fa-play");
    }

    function playPause() {
        if (song.paused) {
            playSong();
        } else {
            pauseSong();
        }
    }

    playPauseButton.addEventListener("click", playPause);

    // ========== 进度条控制 ==========
    progress.addEventListener("input", () => {
        song.currentTime = progress.value;
    });

    progress.addEventListener("change", () => {
        playSong();
    });

    // ========== 下一首/上一首 - 只在当前专辑内 ==========
    nextButton.addEventListener("click", () => {
        const album = getCurrentAlbum();
        
        if (currentSongIndex < album.songs.length - 1) {
            currentSongIndex++;
        } else {
            // 循环回第一首
            currentSongIndex = 0;
        }
        
        updatePlayerDisplay();
        playSong();
    });

    prevButton.addEventListener("click", () => {
        if (currentSongIndex > 0) {
            currentSongIndex--;
        } else {
            // 回到最后一首
            currentSongIndex = getCurrentAlbum().songs.length - 1;
        }
        
        updatePlayerDisplay();
        playSong();
    });
	
	function autoPlay(){
	    // 先静音保证能触发1播放
	    song.muted = true;
	    const playPromise = song.play();
	    if(playPromise !== undefined){
	        playPromise
	        .then(()=>{
	            console.log("自动播放成功");
	            // 用户第一次交互恢复声音
	            const unlock = ()=>{
	                song.muted = false;
	                song.play().catch(()=>{});
	                console.log("声音已恢复");
	                document.removeEventListener("click",unlock);
	                document.removeEventListener("mousemove",unlock);
	                document.removeEventListener("keydown",unlock);
	            }
	            document.addEventListener("click",unlock);
	            document.addEventListener("mousemove",unlock);
	            document.addEventListener("keydown",unlock);
	        })
	        .catch(()=>{
	            console.log("自动播放失败");
	        });
	    }
	}

    // ✨ 初始化
    updatePlayerDisplay();
 
    // ========== Swiper 初化 - 专辑轮播 ==========
    setTimeout(() => {
		autoPlay();
        swiper = new Swiper(".swiper", {
            effect: "coverflow",
            centeredSlides: true,
            initialSlide: 3,
            slidesPerView: "auto",
            grabCursor: true,
            spaceBetween: 40,
            loop: true,
            freeMode: false,
            resistance: true,
            resistanceRatio: 0.85,
            
            coverflowEffect: {
                rotate: 25,
                stretch: 0,
                depth: 50,
                modifier: 1,
                slideShadows: false,
            },

            // ✨ 当专辑改变时
            on: {
                'slideChange': function() {
                    currentAlbumIndex = this.realIndex;     // 切换到新专辑
                    currentSongIndex = 0;                      // 重置为该专辑第一首
                    updatePlayerDisplay();
                    playSong();  
                    console.log(`📀 切换到: ${getCurrentAlbum().name}`);
                }
            },
        });
    }, 100);
}
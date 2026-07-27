jQuery(async function () {
    // 1. 初始化本地歌单
    let savedLinks = localStorage.getItem('ost_custom_playlist');
    let playlist = savedLinks ? savedLinks.split('\n').filter(link => link.trim() !== '') : [];
    let currentIndex = 0;
    let audio = new Audio(playlist.length > 0 ? playlist[currentIndex] : "");

    // 2. 注入极简悬浮窗
    const playerHTML = `
    <div id="ost-player-container">
        <div class="ost-cover">🎵</div>
        <div class="ost-info">
            <span class="ost-title">ARCHIVE_OST</span>
            <span class="ost-subtitle" id="ost-track-num">Track -- / --</span>
        </div>
        <div class="ost-controls">
            <button class="ost-btn" id="ost-play-btn">▶️</button>
            <button class="ost-btn" id="ost-next-btn">⏭️</button>
        </div>
    </div>
    `;
    $('body').append(playerHTML);

    const playBtn = $('#ost-play-btn');
    const nextBtn = $('#ost-next-btn');
    const trackNum = $('#ost-track-num');

    function updateTrackInfo() {
        if (playlist.length === 0) {
            trackNum.text("No Tracks");
            return;
        }
        let displayNum = (currentIndex + 1).toString().padStart(2, '0');
        trackNum.text(`Track ${displayNum} / ${playlist.length}`);
    }
    updateTrackInfo();

    playBtn.on('click', function() {
        if (playlist.length === 0) {
            alert("请先去「扩展菜单」的 OST 面板里输入音乐链接！");
            return;
        }
        if (audio.paused) {
            audio.play();
            playBtn.text('⏸️');
        } else {
            audio.pause();
            playBtn.text('▶️');
        }
    });

    nextBtn.on('click', function() {
        if (playlist.length === 0) return;
        audio.pause();
        currentIndex = (currentIndex + 1) % playlist.length;
        audio.src = playlist[currentIndex];
        audio.play();
        playBtn.text('⏸️');
        updateTrackInfo();
    });

    audio.addEventListener('ended', function() {
        nextBtn.click();
    });

    // 3. 监听酒馆原生菜单里的操作
    // 使用事件委托，确保哪怕酒馆菜单重新渲染也能捕捉到点击
    $(document).on('click', '#ost-save-btn', function() {
        const newLinks = $('#ost-links-input').val();
        localStorage.setItem('ost_custom_playlist', newLinks);
        playlist = newLinks.split('\n').filter(link => link.trim() !== '');
        
        if (playlist.length > 0) {
            currentIndex = 0;
            audio.src = playlist[currentIndex];
            audio.pause();
            playBtn.text('▶️');
            updateTrackInfo();
            alert("✅ 歌单保存成功！");
        } else {
            audio.pause();
            audio.src = "";
            updateTrackInfo();
        }
    });

    // 4. 等待酒馆 UI 渲染完毕后，把已有的歌单填入菜单的输入框
    setTimeout(() => {
        if (savedLinks) {
            $('#ost-links-input').val(savedLinks);
        }
    }, 1500);
});
            alert("✅ 歌单保存成功！");
        } else {
            audio.pause();
            audio.src = "";
            updateTrackInfo();
            settingsPanel.hide();
        }
    });
});


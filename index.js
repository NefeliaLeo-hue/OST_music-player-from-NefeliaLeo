// 1. 从玩家的设备本地读取他们保存的歌单，如果没有，就默认是空列表
let savedLinks = localStorage.getItem('ost_custom_playlist');
let playlist = savedLinks ? savedLinks.split('\n').filter(link => link.trim() !== '') : [];

let currentIndex = 0;
let audio = new Audio(playlist.length > 0 ? playlist[currentIndex] : "");

// 2. 构建 UI：
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
        <button class="ost-btn" id="ost-settings-btn">⚙️</button>
    </div>
</div>

<!-- 隐藏的设置面板 -->
<div id="ost-settings-panel" style="display:none; position:fixed; top:120px; right:20px; width:260px; background:rgba(24, 24, 27, 0.95); border:1px solid #3f3f46; border-radius:12px; padding:12px; box-shadow:0 8px 16px rgba(0,0,0,0.6); z-index:99999; backdrop-filter:blur(8px); font-family:system-ui, sans-serif; color:#e4e4e7; box-sizing:border-box;">
    <div style="font-size:12px; font-weight:bold; margin-bottom:8px;">配置自定义歌单 (每行填一个音乐直链)</div>
    <textarea id="ost-links-input" style="width:100%; height:120px; background:#27272a; color:#a1a1aa; border:1px solid #3f3f46; border-radius:6px; padding:8px; font-size:10px; box-sizing:border-box; white-space:pre; outline:none;" placeholder="https://files.catbox.moe/...\nhttps://files.catbox.moe/..."></textarea>
    <button id="ost-save-btn" style="margin-top:8px; width:100%; background:linear-gradient(135deg, #a855f7, #6366f1); border:none; color:white; padding:8px; border-radius:6px; cursor:pointer; font-weight:bold;">保存并应用</button>
</div>
`;

jQuery(document).ready(function () {
    $('body').append(playerHTML);

    const playBtn = $('#ost-play-btn');
    const nextBtn = $('#ost-next-btn');
    const settingsBtn = $('#ost-settings-btn');
    const settingsPanel = $('#ost-settings-panel');
    const linksInput = $('#ost-links-input');
    const saveBtn = $('#ost-save-btn');
    const trackNum = $('#ost-track-num');

    // 把本地保存的链接显示在输入框里，方便user下次修改
    if (savedLinks) {
        linksInput.val(savedLinks);
    }

    // 更新显示的曲目序号
    function updateTrackInfo() {
        if (playlist.length === 0) {
            trackNum.text("No Tracks (未设置)");
            return;
        }
        let displayNum = (currentIndex + 1).toString().padStart(2, '0');
        trackNum.text(`Track ${displayNum} / ${playlist.length}`);
    }
    updateTrackInfo();

    // 播放按钮逻辑
    playBtn.on('click', function() {
        if (playlist.length === 0) {
            alert("请先点击 ⚙️ 按钮，填入你的音乐直链！");
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

    // 下一首逻辑
    nextBtn.on('click', function() {
        if (playlist.length === 0) return;
        audio.pause();
        currentIndex = (currentIndex + 1) % playlist.length;
        audio.src = playlist[currentIndex];
        audio.play();
        playBtn.text('⏸️');
        updateTrackInfo();
    });

    // 自动切歌
    audio.addEventListener('ended', function() {
        nextBtn.click();
    });

    // 打开/关闭设置面板
    settingsBtn.on('click', function() {
        settingsPanel.toggle();
    });

    // 保存user输入的歌单
    saveBtn.on('click', function() {
        const newLinks = linksInput.val();
        // 存入玩家浏览器的本地存储
        localStorage.setItem('ost_custom_playlist', newLinks);
        
        // 解析成新的数组
        playlist = newLinks.split('\n').filter(link => link.trim() !== '');
        
        if (playlist.length > 0) {
            currentIndex = 0;
            audio.src = playlist[currentIndex];
            audio.pause();
            playBtn.text('▶️');
            updateTrackInfo();
            settingsPanel.hide();
            alert("✅ 歌单保存成功！");
        } else {
            audio.pause();
            audio.src = "";
            updateTrackInfo();
            settingsPanel.hide();
        }
    });
});


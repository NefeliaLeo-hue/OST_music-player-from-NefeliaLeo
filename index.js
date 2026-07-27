jQuery(async function () {
    let savedLinks = localStorage.getItem('ost_custom_playlist');
    let playlist = savedLinks ? savedLinks.split('\n').filter(link => link.trim() !== '') : [];
    let currentIndex = 0;
    let audio = new Audio(playlist.length > 0 ? playlist[currentIndex] : "");

    // 直接在悬浮窗上加回 ⚙️ 齿轮按钮，并附带完全独立的悬浮设置面板
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

    <div id="ost-floating-settings" style="display:none; position:fixed; top:130px; right:20px; width:260px; background:rgba(24,24,27,0.95); border:1px solid #3f3f46; border-radius:12px; padding:12px; box-shadow:0 8px 16px rgba(0,0,0,0.8); z-index:999999; backdrop-filter:blur(8px); font-family:system-ui, sans-serif; box-sizing:border-box;">
        <div style="font-size:12px; color:#e4e4e7; font-weight:bold; margin-bottom:8px;">🎵 OST 专属播放器</div>
        <div style="font-size:10px; color:#a1a1aa; margin-bottom:8px;">在此粘贴 Catbox 直链 (一行一首)：</div>
        <textarea id="ost-links-input" style="width:100%; height:120px; background:#18181b; color:#a1a1aa; border:1px solid #3f3f46; border-radius:6px; padding:8px; font-size:10px; box-sizing:border-box; white-space:pre; outline:none;"></textarea>
        <button id="ost-save-btn" style="margin-top:10px; width:100%; background:linear-gradient(135deg, #a855f7, #6366f1); border:none; color:white; padding:8px; border-radius:6px; cursor:pointer; font-weight:bold;">保存并应用</button>
    </div>
    `;
    
    $('body').append(playerHTML);

    const playBtn = $('#ost-play-btn');
    const nextBtn = $('#ost-next-btn');
    const settingsBtn = $('#ost-settings-btn');
    const settingsPanel = $('#ost-floating-settings');
    const linksInput = $('#ost-links-input');
    const saveBtn = $('#ost-save-btn');
    const trackNum = $('#ost-track-num');

    if (savedLinks) { linksInput.val(savedLinks); }

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
            alert("请先点击 ⚙️ 齿轮按钮，输入音乐链接！");
            settingsPanel.show();
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

    audio.addEventListener('ended', function() { nextBtn.click(); });

    settingsBtn.on('click', function() {
        settingsPanel.toggle();
    });

    saveBtn.on('click', function() {
        const newLinks = linksInput.val();
        localStorage.setItem('ost_custom_playlist', newLinks);
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

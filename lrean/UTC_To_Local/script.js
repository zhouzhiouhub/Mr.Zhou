 // 确保 Day.js 已加载
 if (typeof dayjs === 'undefined') {
    console.error('Day.js 未加载，请检查网络或 CDN 链接');
    document.getElementById("utc-time").textContent = "加载失败";
    document.getElementById("local-time").textContent = "加载失败";
} else {
    dayjs.extend(dayjs_plugin_utc);

    function updateTime() {
        const currentUTCTime = dayjs.utc();
        document.getElementById("utc-time").textContent = currentUTCTime.format('YYYY-MM-DD HH:mm:ss');
        document.getElementById("local-time").textContent = currentUTCTime.local().format('YYYY-MM-DD HH:mm:ss');
    }
    updateTime();
    setInterval(updateTime, 1000);
}
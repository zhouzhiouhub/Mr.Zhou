 // 确保 Day.js 已加载
 if (typeof dayjs === 'undefined') {
    console.error('Day.js 未加载，请检查网络或 CDN 链接');
    document.getElementById("utc-time").textContent = "加载失败";
    document.getElementById("local-time").textContent = "加载失败";
} else {
    dayjs.extend(dayjs_plugin_utc);

    function updateTime() {
        // 获取当前 UTC 时间并格式化为字符串
        // 使用 UTC 插件获取当前 UTC 时间
        const currentUTCTime = dayjs.utc();
        //获取UTC时间
        // 使用 format() 方法将时间格式化为字符串
        document.getElementById("utc-time").textContent = currentUTCTime.format('YYYY-MM-DD HH:mm:ss');
        //获取本地时间
        // 使用 local() 方法获取本地时间并格式化为字符串
        document.getElementById("local-time").textContent = currentUTCTime.local().format('YYYY-MM-DD HH:mm:ss');
    }
    updateTime();
    setInterval(updateTime, 1000);
}
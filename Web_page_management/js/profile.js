/**
 * 个人资料与交互功能
 */
document.addEventListener('DOMContentLoaded', function() {
    // 头像上传功能
    setupAvatarUpload();
    
    // 微信二维码弹窗
    setupWechatQRCode();
    
    // 文章预览功能
    setupArticlePreviews();
});

/**
 * 设置头像上传功能
 */
function setupAvatarUpload() {
    const profileImage = document.getElementById('profile-image');
    const uploadModal = document.getElementById('avatar-upload-modal');
    const closeModal = uploadModal.querySelector('.close-modal');
    const fileInput = document.getElementById('avatar-upload');
    const previewArea = document.getElementById('avatar-preview');
    const previewImg = document.getElementById('preview-img');
    const confirmBtn = document.getElementById('confirm-upload');
    const cancelBtn = document.getElementById('cancel-upload');
    const avatarImg = document.getElementById('profile-avatar');
    
    // 点击头像打开上传窗口
    profileImage.addEventListener('click', function() {
        uploadModal.style.display = 'block';
    });
    
    // 关闭上传窗口
    closeModal.addEventListener('click', function() {
        uploadModal.style.display = 'none';
        resetUploadForm();
    });
    
    // 点击取消按钮关闭窗口
    cancelBtn.addEventListener('click', function() {
        uploadModal.style.display = 'none';
        resetUploadForm();
    });
    
    // 文件上传预览
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                previewArea.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });
    
    // 确认上传
    confirmBtn.addEventListener('click', function() {
        if (previewImg.src) {
            avatarImg.src = previewImg.src;
            uploadModal.style.display = 'none';
            resetUploadForm();
        }
    });
    
    // 点击窗口外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === uploadModal) {
            uploadModal.style.display = 'none';
            resetUploadForm();
        }
    });
    
    // 重置表单
    function resetUploadForm() {
        fileInput.value = '';
        previewArea.style.display = 'none';
    }
}

/**
 * 设置微信二维码弹窗
 */
function setupWechatQRCode() {
    const wechatIcon = document.querySelector('.wechat-icon');
    const qrcodePopup = document.getElementById('wechat-qrcode');
    const closeQrcode = document.querySelector('.close-qrcode');
    
    // 点击微信图标显示二维码
    wechatIcon.addEventListener('click', function(e) {
        e.preventDefault();
        qrcodePopup.style.display = 'block';
    });
    
    // 关闭二维码弹窗
    closeQrcode.addEventListener('click', function() {
        qrcodePopup.style.display = 'none';
    });
    
    // 点击窗口外部关闭
    qrcodePopup.addEventListener('click', function(e) {
        if (e.target === qrcodePopup) {
            qrcodePopup.style.display = 'none';
        }
    });
}

/**
 * 设置文章预览功能
 */
function setupArticlePreviews() {
    const readMoreLinks = document.querySelectorAll('.read-more');
    const previewModal = document.getElementById('article-preview-modal');
    const closeModal = previewModal.querySelector('.close-modal');
    const closePreviewBtn = previewModal.querySelector('.close-preview');
    const readFullBtn = document.getElementById('read-full-article');
    
    // 模拟文章数据库
    const articles = {
        1: {
            title: "春日漫步，听花开的声音",
            date: "2023年3月15日",
            category: "散文",
            content: `<p>春天悄然而至，樱花轻舞，柳絮飘飞。漫步于小道，感受微风拂面，仿佛能听见花开的声音。这是一场与春天的对话，是一次心灵的净化之旅。</p>
                    <p>清晨，第一缕阳光穿透云层，洒在刚刚绽放的花朵上。露珠在花瓣上滚动，折射出七彩的光芒。我静静地站在花丛中，倾听着大自然的声音。鸟儿清脆的鸣叫，昆虫轻微的振翅，还有那几乎听不见的花朵绽放的声音。</p>
                    <blockquote>春有百花秋有月，夏有凉风冬有雪。若无闲事挂心头，便是人间好时节。</blockquote>
                    <p>走在林间小道，感受着脚下松软的泥土，呼吸着清新的空气。每一步都像是与大地的对话，每一次呼吸都是与自然的交流。春天不仅是视觉的盛宴，更是一场全感官的体验。</p>
                    <p>在这个万物复苏的季节，我们或许应该放慢脚步，感受生命的律动，倾听自然的声音，找回那份内心的宁静与和谐。</p>`
        },
        2: {
            title: "雨巷中的邂逅",
            date: "2023年2月28日",
            category: "诗歌",
            content: `<p>丁香一样的姑娘在雨巷中撑着油纸伞，她的眼神像是诉说着千年的孤寂。雨滴敲打着青石板，奏响了一曲思念的乐章。我站在巷口，看着远去的背影。</p>
                    <p>细雨如丝，濡湿了石板路，也濡湿了心情。江南的雨总是带着一丝忧伤，打湿了屋檐，也打湿了诗人的思绪。那把油纸伞下，是怎样一个故事的开始？</p>
                    <blockquote>撑着油纸伞，独自<br>彷徨在悠长、悠长<br>又寂寥的雨巷<br>我希望逢着<br>一个丁香一样的<br>结着愁怨的姑娘</blockquote>
                    <p>雨中的巷子弯弯曲曲，仿佛通往记忆的深处。石板反射的灯光摇曳，时光在这一刻被拉长，变得缓慢而悠长。雨声滴答，仿佛一首无言的诗，诉说着古老的故事。</p>
                    <p>也许，正是在这样的雨巷中，诗人与丁香姑娘不期而遇，创造了那首传颂至今的诗篇。而我，只是一个过客，在雨中聆听岁月的回响。</p>`
        },
        3: {
            title: "冬日咖啡馆的午后时光",
            date: "2023年1月10日",
            category: "随想",
            content: `<p>窗外是纷扬的雪花，窗内是温暖的咖啡香。手捧一本村上春树的小说，任思绪随着钢琴曲飘荡。冬日的午后，最适合在咖啡馆里静静品味生活。</p>
                    <p>我总是喜欢选一个靠窗的位置，点一杯拿铁，然后沉浸在书本的世界中。窗外的行人匆匆走过，偶尔有人驻足欣赏橱窗中的展品，偶尔有情侣依偎着走过。而我，只是一个安静的观察者，记录着这个城市的日常。</p>
                    <blockquote>生活中真正重要的事情，往往是那些不紧不慢，似乎微不足道的小事。一杯咖啡的温度，一本书中的故事，一首钢琴曲的旋律，都是构成幸福的元素。</blockquote>
                    <p>咖啡馆里的钢琴师开始演奏一首德彪西的《月光》，柔和的旋律与窗外的雪景完美融合。我啜饮一口咖啡，感受着苦涩中的甘甜，就像生活本身，有苦有甜，但总是令人沉醉。</p>
                    <p>村上春树在《挪威的森林》中写道："每个人都有属于自己的森林，迷失的森林。"而我想，或许每个人也都有属于自己的咖啡馆，一个可以安放灵魂的地方。</p>`
        }
    };
    
    // 点击阅读全文按钮打开预览窗口
    readMoreLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const articleId = this.getAttribute('data-article-id');
            const article = articles[articleId];
            
            if (article) {
                document.getElementById('preview-title').textContent = article.title;
                document.getElementById('preview-date').textContent = article.date;
                document.getElementById('preview-category').textContent = article.category;
                document.getElementById('preview-content').innerHTML = article.content;
                
                previewModal.style.display = 'block';
            }
        });
    });
    
    // 关闭预览窗口
    closeModal.addEventListener('click', function() {
        previewModal.style.display = 'none';
    });
    
    closePreviewBtn.addEventListener('click', function() {
        previewModal.style.display = 'none';
    });
    
    // 阅读全文按钮
    readFullBtn.addEventListener('click', function() {
        // 这里可以添加跳转到完整文章页面的逻辑
        alert('即将跳转到完整文章页面...');
        previewModal.style.display = 'none';
    });
    
    // 点击窗口外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === previewModal) {
            previewModal.style.display = 'none';
        }
    });
} 
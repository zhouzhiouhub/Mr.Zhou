/**
 * 页面导航与交互功能
 */
document.addEventListener('DOMContentLoaded', function() {
    // 导航菜单与内容区域切换
    setupNavigation();
    
    // 书架相关功能
    setupBookshelf();
    
    // 图集相关功能
    setupGallery();
});

/**
 * 设置导航菜单功能
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取目标内容区域ID
            const targetSectionId = this.getAttribute('data-section');
            
            // 移除所有导航链接的活动状态
            navLinks.forEach(item => item.classList.remove('active'));
            // 添加当前链接的活动状态
            this.classList.add('active');
            
            // 隐藏所有内容区域
            contentSections.forEach(section => section.classList.remove('active'));
            
            // 显示目标内容区域
            document.getElementById(targetSectionId).classList.add('active');
            
            // 滚动到页面顶部
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * 设置书架功能
 */
function setupBookshelf() {
    // 书籍数据 - 用于书籍预览
    const booksData = {
        "百年孤独": {
            "author": "加西亚·马尔克斯",
            "category": "文学",
            "cover": "https://img9.doubanio.com/view/subject/s/public/s27237850.jpg",
            "rating": 4.5,
            "year": "1967",
            "description": "《百年孤独》是魔幻现实主义文学的代表作，描写了布恩迪亚家族七代人的传奇故事，以及加勒比海沿岸小镇马孔多的百年兴衰，反映了拉丁美洲一个世纪以来风云变幻的历史。作品融入神话传说、民间故事、宗教典故等神秘因素，巧妙地糅合了现实与虚幻，展现出一个瑰丽的想象世界，并借此反映了拉丁美洲的现实。",
            "downloadLink": "#"
        },
        "围城": {
            "author": "钱钟书",
            "category": "文学",
            "cover": "https://img9.doubanio.com/view/subject/s/public/s1070222.jpg",
            "rating": 5,
            "year": "1947",
            "description": "《围城》是钱钟书所著的长篇小说，是中国现代文学史上一部风格独特的讽刺小说。小说描写了青年方鸿渐从大学毕业到结婚的过程，以幽默辛辣的笔触描绘了当时社会各阶层众生相。钱钟书先生将自己的语言天才与机智幽默发挥得淋漓尽致，直到今天，《围城》依然是讽刺小说的巅峰之作。",
            "downloadLink": "#"
        },
        "苏菲的世界": {
            "author": "乔斯坦·贾德",
            "category": "哲学",
            "cover": "https://img1.doubanio.com/view/subject/s/public/s2347562.jpg",
            "rating": 4,
            "year": "1991",
            "description": "《苏菲的世界》是挪威作家乔斯坦·贾德的代表作，也是一本风靡全球的哲学启蒙书。小说讲述了14岁的少女苏菲接到一封奇怪的信，由此进入了一段奇特的哲学课程。在一位神秘导师的引导下，苏菲开始思考人生的基本问题，逐渐了解西方哲学发展的历程。作者通过小说的形式，巧妙地介绍了西方哲学史上各个重要流派的思想精髓。",
            "downloadLink": "#"
        },
        "时间简史": {
            "author": "斯蒂芬·霍金",
            "category": "科学",
            "cover": "https://img9.doubanio.com/view/subject/s/public/s29634484.jpg",
            "rating": 4.5,
            "year": "1988",
            "description": "《时间简史》是英国物理学家斯蒂芬·霍金的科普著作，主要讲述了关于宇宙本性的最前沿知识，包括我们的宇宙图像、空间和时间、膨胀的宇宙、不确定性原理、黑洞、宇宙的起源和命运等内容。霍金用通俗易懂的语言，将复杂深奥的宇宙学理论介绍给大众，被誉为"给大众的上帝之书"。",
            "downloadLink": "#"
        },
        "明朝那些事儿": {
            "author": "当年明月",
            "category": "历史",
            "cover": "https://img1.doubanio.com/view/subject/s/public/s1800355.jpg",
            "rating": 4,
            "year": "2006",
            "description": "《明朝那些事儿》是一部关于中国明朝历史的通俗读物，作者以轻松幽默的笔触，通过对明朝历史上的重大事件、人物命运的描述，为读者展现了一个波澜壮阔的历史长卷。作品既有对历史事件的客观叙述，也有作者对历史人物性格的生动刻画，使历史变得平易近人，让读者在轻松阅读中了解明朝历史。",
            "downloadLink": "#"
        },
        "活着": {
            "author": "余华",
            "category": "文学",
            "cover": "https://img2.doubanio.com/view/subject/s/public/s29053580.jpg",
            "rating": 5,
            "year": "1993",
            "description": "《活着》是中国作家余华的代表作之一，该小说讲述了农村人福贵悲惨的人生遭遇。主人公经历了家庭破败、新中国成立、三年困难时期、文化大革命等大时代变迁，失去了所有的亲人，最后只剩下一头老牛相伴。小说以普通人的悲惨命运揭示了人生的苦难本质，同时也展现了生命的坚韧与不屈。",
            "downloadLink": "#"
        }
    };
    
    // 书籍分类筛选器
    const bookFilters = document.querySelectorAll('.book-filter');
    const bookItems = document.querySelectorAll('.book-item');
    
    bookFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有筛选器的活动状态
            bookFilters.forEach(item => item.classList.remove('active'));
            // 添加当前筛选器的活动状态
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // 显示或隐藏书籍
            bookItems.forEach(book => {
                if (category === 'all' || book.getAttribute('data-category') === category) {
                    book.style.display = 'block';
                } else {
                    book.style.display = 'none';
                }
            });
        });
    });
    
    // 书籍预览功能
    const previewButtons = document.querySelectorAll('.preview-book');
    const bookPreviewModal = document.getElementById('book-preview-modal');
    const bookPreviewImage = document.getElementById('book-preview-image');
    const bookPreviewTitle = document.getElementById('book-preview-title');
    const bookPreviewAuthor = document.getElementById('book-preview-author');
    const bookPreviewCategory = document.getElementById('book-preview-category');
    const bookPreviewYear = document.getElementById('book-preview-year');
    const bookPreviewRating = document.getElementById('book-preview-rating');
    const bookPreviewDescription = document.getElementById('book-preview-description');
    const bookPreviewDownload = document.getElementById('book-preview-download');
    const bookPreviewClose = document.getElementById('book-preview-close');
    
    previewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取书籍标题
            const bookItem = this.closest('.book-item');
            const bookTitle = bookItem.querySelector('.book-title').textContent;
            const bookData = booksData[bookTitle];
            
            if (bookData) {
                // 填充预览模态框
                bookPreviewImage.src = bookData.cover;
                bookPreviewImage.alt = bookTitle;
                bookPreviewTitle.textContent = bookTitle;
                bookPreviewAuthor.textContent = bookData.author;
                bookPreviewCategory.textContent = bookData.category;
                bookPreviewYear.textContent = bookData.year;
                
                // 设置评分
                bookPreviewRating.innerHTML = '';
                const fullStars = Math.floor(bookData.rating);
                const halfStar = bookData.rating % 1 !== 0;
                
                for (let i = 0; i < fullStars; i++) {
                    bookPreviewRating.innerHTML += '<i class="fas fa-star"></i>';
                }
                
                if (halfStar) {
                    bookPreviewRating.innerHTML += '<i class="fas fa-star-half-alt"></i>';
                }
                
                const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
                for (let i = 0; i < emptyStars; i++) {
                    bookPreviewRating.innerHTML += '<i class="far fa-star"></i>';
                }
                
                bookPreviewDescription.textContent = bookData.description;
                bookPreviewDownload.href = bookData.downloadLink;
                
                // 显示模态框
                bookPreviewModal.style.display = 'block';
            }
        });
    });
    
    // 关闭预览
    bookPreviewClose.addEventListener('click', function(e) {
        e.preventDefault();
        bookPreviewModal.style.display = 'none';
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(e) {
        if (e.target === bookPreviewModal) {
            bookPreviewModal.style.display = 'none';
        }
    });
    
    // 下载按钮点击
    document.querySelectorAll('.download-book').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const bookTitle = this.closest('.book-item').querySelector('.book-title').textContent;
            alert(`开始下载《${bookTitle}》电子书！`);
        });
    });
}

/**
 * 设置图集功能
 */
function setupGallery() {
    // 图集分类筛选器
    const galleryFilters = document.querySelectorAll('.gallery-filter-item');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryFilters.forEach(filter => {
        filter.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除所有筛选器的活动状态
            galleryFilters.forEach(item => item.classList.remove('active'));
            // 添加当前筛选器的活动状态
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // 显示或隐藏图片
            galleryItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // 图片查看器
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentIndex = 0;
    const visibleGalleryItems = () => {
        return Array.from(galleryItems).filter(item => 
            item.style.display !== 'none'
        );
    };
    
    // 打开图片查看器
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const items = visibleGalleryItems();
            currentIndex = items.indexOf(this);
            
            const imgSrc = this.querySelector('img').src;
            const imgTitle = this.querySelector('h4').textContent;
            const imgDesc = this.querySelector('p').textContent;
            
            lightboxImage.src = imgSrc;
            lightboxCaption.textContent = `${imgTitle} - ${imgDesc}`;
            
            lightbox.style.display = 'flex';
            
            // 显示或隐藏导航按钮
            updateNavButtons();
        });
    });
    
    // 关闭图片查看器
    lightboxClose.addEventListener('click', function() {
        lightbox.style.display = 'none';
    });
    
    // 点击图片查看器外部关闭
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
    
    // 上一张图片
    lightboxPrev.addEventListener('click', function() {
        navigateImage(-1);
    });
    
    // 下一张图片
    lightboxNext.addEventListener('click', function() {
        navigateImage(1);
    });
    
    // 键盘导航
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                navigateImage(-1);
            } else if (e.key === 'ArrowRight') {
                navigateImage(1);
            } else if (e.key === 'Escape') {
                lightbox.style.display = 'none';
            }
        }
    });
    
    // 图片导航函数
    function navigateImage(direction) {
        const items = visibleGalleryItems();
        currentIndex = (currentIndex + direction + items.length) % items.length;
        
        const item = items[currentIndex];
        const imgSrc = item.querySelector('img').src;
        const imgTitle = item.querySelector('h4').textContent;
        const imgDesc = item.querySelector('p').textContent;
        
        lightboxImage.src = imgSrc;
        lightboxCaption.textContent = `${imgTitle} - ${imgDesc}`;
        
        updateNavButtons();
    }
    
    // 更新导航按钮显示
    function updateNavButtons() {
        const items = visibleGalleryItems();
        
        if (items.length <= 1) {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        } else {
            lightboxPrev.style.display = 'flex';
            lightboxNext.style.display = 'flex';
        }
    }
} 
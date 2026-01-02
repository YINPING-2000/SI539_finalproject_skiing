/* =========================================
   Visitor Check-in Logic (Index Page Only)
   ========================================= */
console.log("Visitor Check-in Script Loaded");

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('visit-form');

    if (form) {
        const btn = document.getElementById('check-in-btn');
        const msg = document.getElementById('feedback-msg');
        const countSpan = document.getElementById('visitor-count'); // 记得这里ID修正了
        const timeInput = document.getElementById('visit-time');
        
        // 1. 设置 Formspree (发邮件用的)
        // ⚠️ 请务必确保这里是你自己的 Formspree ID
        const FORMSPREE_URL = "https://formspree.io/f/xkoneweg"; 

        // 2. 设置 CounterAPI (计数用的 - 新的可用服务)
        // namespace: 你的名字 (随便起，英文)
        // key: 项目名 (随便起，英文)
        const NAMESPACE = "pings_skiing_diary"; 
        const KEY = "check_ins";
        
        const COUNTER_GET_URL = `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/`;
        const COUNTER_UP_URL  = `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/up`;

        // A. 页面刚加载时：只读取，不增加
        // 这可以让还没打卡的人也能看到现在有多少人来过了
        fetch(COUNTER_GET_URL)
            .then(res => res.json())
            .then(data => {
                // 新API返回的是 { count: 123 }，所以用 data.count
                if(countSpan) countSpan.innerText = data.count || 0;
            })
            .catch(err => {
                console.log("Counter init error:", err);
                // 如果第一次由于没有数据报错，显示0
                if(countSpan) countSpan.innerText = "0"; 
            });

        // B. 点击按钮提交时
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 

            // 填入时间
            const now = new Date();
            timeInput.value = now.toLocaleString(); 

            // UI 变化
            btn.textContent = 'Sending...';
            btn.disabled = true;
            btn.style.backgroundColor = '#999';

            // 并行任务：发名字 + 计数加1
            Promise.all([
                // 任务1: 发名字给 Formspree
                fetch(FORMSPREE_URL, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                }),
                // 任务2: 计数器 +1
                fetch(COUNTER_UP_URL) 
            ])
            .then(results => results[1].json()) // 获取任务2(计数器)的返回结果
            .then(data => {
                // 成功！
                btn.style.backgroundColor = '#34a853'; 
                btn.textContent = 'Checked In!';
                
                // 更新页面上的数字
                if(countSpan) countSpan.innerText = data.count;
                
                // 显示感谢语和数字
                msg.style.display = 'block';
                
                // 确保 Total Visitors 那一行是可见的 (如果你之前隐藏了它，这里让它显示)
                if(countSpan && countSpan.parentElement) {
                    countSpan.parentElement.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                btn.textContent = 'Try Again';
                btn.disabled = false;
                btn.style.backgroundColor = '#d93025';
                alert("Network error. Please try again.");
            });
        });
    }
});

/* =========================================
       Trip Gallery Auto-Scroll (Infinite Loop)
       ========================================= */
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.trip-gallery');

    if (gallery) {
        // 1. 克隆内容：把所有卡片复制一份加到后面，实现无缝循环
        gallery.innerHTML += gallery.innerHTML;

        let scrollSpeed = 1; // 滚动速度 (数字越大越快)
        let isHovered = false;

        // 2. 监听鼠标：鼠标放上去暂停，移开继续
        gallery.addEventListener('mouseenter', () => {
            isHovered = true;
        });
        
        gallery.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        // 3. 动画循环函数
        function autoScroll() {
            // 只有当鼠标没放上去时，才自动滚
            if (!isHovered) {
                gallery.scrollLeft += scrollSpeed;

                // 4. 无缝重置逻辑
                // 如果滚动的距离超过了内容的一半（因为我们复制了一份，所以是一半）
                // 就瞬间跳回起点 (0)，因为起点的内容和中间的内容是一模一样的
                if (gallery.scrollLeft >= gallery.scrollWidth / 2) {
                    gallery.scrollLeft = 0;
                }
            }
            // 请求下一帧动画
            requestAnimationFrame(autoScroll);
        }

        // 启动动画
        autoScroll();
    }

    
});

/* =========================================
       Moments Gallery Auto-Scroll (Infinite Loop)
       ========================================= */
document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel-track');

    if (carousel) {
        // 1. 克隆内容：把所有卡片复制一份加到后面，实现无缝循环
        carousel.innerHTML += carousel.innerHTML;
        let scrollSpeed = 1; // 滚动速度 (数字越大越快)
        let isHovered = false;

        // 2. 监听鼠标：鼠标放上去暂停，移开继续
        carousel.addEventListener('mouseenter', () => {
            isHovered = true;
        });
        
        carousel.addEventListener('mouseleave', () => {
            isHovered = false;
        });

        // 3. 动画循环函数
        function autoScroll() {
            // 只有当鼠标没放上去时，才自动滚
            if (!isHovered) {
                carousel.scrollLeft += scrollSpeed;

                // 4. 无缝重置逻辑
                // 如果滚动的距离超过了内容的一半（因为我们复制了一份，所以是一半）
                // 就瞬间跳回起点 (0)，因为起点的内容和中间的内容是一模一样的
                if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
                    carousel.scrollLeft = 0;
                }
            }
            // 请求下一帧动画
            requestAnimationFrame(autoScroll);
        }

        // 启动动画
        autoScroll();
    }

    
});

/* =========================================
   Timeline Image Lightbox (追加在文件底部)
   ========================================= */
document.addEventListener('DOMContentLoaded', function() {
    
    // 1. 创建灯箱的 HTML 骨架并塞进页面
    // (如果页面上还没有灯箱的话)
    if (!document.querySelector('.lightbox')) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img src="" alt="Full Screen Image">
        `;
        document.body.appendChild(lightbox);
    }

    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    // 2. 选择所有 timeline 里的图片
    // 如果你想让其他区域的图片也能放大，可以在这里加选择器，比如:
    // document.querySelectorAll('.timeline-img img, .trip-card img')
    const images = document.querySelectorAll('.timeline-img img');

    // 3. 给每张图片绑定点击事件
    images.forEach(img => {
        img.addEventListener('click', (e) => {
            // 阻止冒泡防止触发其他点击事件
            e.stopPropagation();
            
            // 把被点击图片的 src 赋值给灯箱里的大图
            lightboxImg.src = img.src;
            
            // 显示灯箱
            lightbox.classList.add('open');
        });
    });

    // 4. 关闭功能 (点X 或 点黑背景)
    const closeLightbox = () => {
        lightbox.classList.remove('open');
        // 清空 src 防止下次打开时闪烁旧图
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    };

    closeBtn.addEventListener('click', closeLightbox);
    
    lightbox.addEventListener('click', (e) => {
        // 只有点在背景上才关闭，点在图片上不关
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // 5. 按 ESC 键也可以关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('open')) {
            closeLightbox();
        }
    });
});
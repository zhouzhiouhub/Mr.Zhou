// 获取元素
const chatBtn = document.getElementById("chat-btn");
const chatPopup = document.getElementById("chat-popup");
const closeChat = document.getElementById("close-chat");
const chatForm = document.getElementById("chat-form");
const chatResult = document.getElementById("chat-result");

// 点击气泡显示/隐藏聊天框
chatBtn.addEventListener("click", () => {
    chatPopup.style.display = (chatPopup.style.display === "block") ? "none" : "block";
});

// 关闭按钮
closeChat.addEventListener("click", () => {
    chatPopup.style.display = "none";
});

// 表单提交处理
chatForm.addEventListener("submit", function(event) {
    event.preventDefault();

    let formData = new FormData(this);
    let sendButton = document.querySelector("button[type='submit']");
    
    if (sendButton.disabled) return;
    sendButton.disabled = true;
    sendButton.classList.add('disabled');

    fetch("send_mail.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            chatResult.innerHTML = "发送成功！";
            chatResult.classList.add('success');

            // 清空输入框
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("message").value = "";

            // 2 秒后隐藏窗口
            setTimeout(() => {
                chatPopup.style.display = "none";
                chatResult.innerHTML = "";
                chatResult.classList.remove('success');
            }, 2000);
        } else {
            chatResult.innerHTML = "发送失败：" + data.message;
            chatResult.classList.add('error');
        }
    })
    .catch(error => {
        chatResult.innerHTML = "发送失败，请稍后再试。";
        chatResult.classList.add('error');
    })
    .finally(() => {
        // 1 秒后恢复按钮
        setTimeout(() => {
            sendButton.disabled = false;
            sendButton.classList.remove('disabled');
        }, 2000);
    });
});
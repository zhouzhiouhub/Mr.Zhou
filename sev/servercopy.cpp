#include "httplib.h"
#include <fstream>
#include <sstream>

int main() {
    httplib::Server svr;

    // 处理根路径，返回 indexcopy.html 页面
    svr.Get("/", [](const httplib::Request&, httplib::Response& res) {
        std::ifstream ifs("indexcopy.html");
        if (ifs) {
            std::stringstream buffer;
            buffer << ifs.rdbuf();
            res.set_content(buffer.str(), "text/html; charset=utf-8");
        } else {
            res.status = 404;
            res.set_content("indexcopy.html 文件未找到", "text/plain");
        }
    });

    // 处理聊天请求
    svr.Post("/chat", [](const httplib::Request& req, httplib::Response& res) {
        std::string msg = req.body;
        std::cout << "收到消息: " << msg << std::endl;
        std::string reply;

        if (msg == "你好") reply = "你好！我是后端。";
        else if (msg == "你是谁") reply = "我是C++写的后端服务器。";
        else if (msg == "再见") reply = "再见，祝你一天愉快！";
        else reply = "我不太明白你的意思。";

        res.set_content(reply, "text/plain; charset=utf-8");
    });

    std::cout << "服务器运行在 http://localhost:8080" << std::endl;
    svr.listen("0.0.0.0", 8080);
}

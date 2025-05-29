#include "httplib.h"
#include <iostream>
#include <fstream>
#include <sstream>

int main() {
    httplib::Server svr;

    // 提供 index.html 静态页面
    svr.Get("/", [](const httplib::Request&, httplib::Response& res) {
        std::ifstream file("index.html");
        std::stringstream buffer;
        buffer << file.rdbuf();
        res.set_content(buffer.str(), "text/html; charset=UTF-8");
    });

    // 提供聊天响应 GET /chat?msg=你好
    svr.Get("/chat", [](const httplib::Request& req, httplib::Response& res) {
        std::string msg = req.get_param_value("msg");
        std::string reply = "后端回复：你说的是「" + msg + "」吗？";
        res.set_content(reply, "text/plain; charset=UTF-8");
    });

    std::cout << "服务器运行在 http://localhost:8080" << std::endl;
    svr.listen("0.0.0.0", 8080);
}

const ip = "http://127.0.0.1/fgs-api/";
layui.use(["layer"],function () {
    let layer = layui.layer,
        $ = layui.$;
    $.ajaxSetup({
        cache: false,
        timeout: 8000,
        type: "post",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        headers: {
            "token": localStorage.getItem("user_token")
        },
        beforeSend: function(xhr) {
            layer.load(1);
        },
        error: function(xhr, textStatus, errorThrown) {
            layer.closeAll('loading');
            //按钮禁用
            $(".layui-submit").attr('disabled', false);
            let msg = "";
            if(!xhr.responseText) {
                msg = "连接超时";
            } else {
                let response = JSON.parse(xhr.responseText);
                msg = response.message;
                if(response.code == 401) {
                    localStorage.removeItem("user_token");
                }
            }
            layer.msg(msg, {
                icon: 2,
                time: 2000
            });
        }
    });
});
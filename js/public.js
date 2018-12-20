const IP = "/fgs-api/";
let layerMsg = null;
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
        },
        complete:function () {
            layer.closeAll("loading");
        }
    });

    $('#refresh').on('click',function () {
        window.location.reload();
    });
    layerMsg ={
        msg:function (code,type,t) {
            this.closeAll();
            type = type?type:"操作";
            t = parseInt(t?t:1000);
            if (code ===0){
                layer.msg(type+'成功', {icon: 6,time:t});
            }else {
                layer.msg(type+'失败', {icon: 5,time:t});
            }
            return false;
        },
        closeAll:function (type) {
            type = type?type:'loading';
            layer.closeAll(type);
        }
    }
});
layui.use(['layer', 'form', 'element', 'jquery'], function() {
    let layer = layui.layer,
        form = layui.form,
        $ = layui.$;

    let login = {
        init: function () {
            this.initStorage();
            this.storageIsEnable();
            this.verificationToken();
            form.on('submit(LAY-user-login-submit)', function(data) {
                if (!login.storageIsEnable()){
                    alert("请开启浏览器localstorage,否则二无法正常使用本系统！");
                    return false;
                }
                $.ajax({
                    url: IP+"login",
                    type: "POST",
                    contentType: "application/x-www-form-urlencoded",
                    data: $("#login").serialize(),
                    dataType: "json",
                    success: function (result) {
                        localStorage.setItem("user_token",result.token);
                        parent.window.location="index.html";
                    },
                });
                return false;
            });
            form.verify({
                password: [
                    /^[\S]{5,16}$/, '密码必须5到16位，且不能出现空格'
                ]
            });

            $("#codeImg").click(function(){
                //TODO:
            });
        },
        initStorage:function () {
            if(!localStorage){
                alert("浏览器不支持localstorage，为不影响正常使用，请更换新版本浏览器！");
                console.log("浏览器不支持localstorage，为不影响正常使用，请更换新版本浏览器！");
            }else{
                console.log("浏览器支持localstorage!");
            }
        },
        verificationToken:function () {
            let user_token = localStorage.getItem("user_token");
            if (!!user_token && user_token.trim().length !== 0) {
                $.ajax({
                    type: 'GET',
                    headers: {'token': user_token},
                    async: false,
                    url: IP + 'tokenIsValid',
                    success: function(data) {
                        parent.window.location.href = 'index.html';
                    },
                    error: function(xhr, textStatus, errorThrown) {

                        console.log("token not valid");
                        if(xhr.status == 401) {
                            localStorage.removeItem("user_token");
                        }
                    }
                });
            }
            else {
                console.log("token is empty");
            }
        },
        storageIsEnable:function () {
            if(!!localStorage){
                try {
                    localStorage.setItem("key", "value");
                    localStorage.removeItem("key");
                    console.log("浏览器启用localstorage!");
                    return true;
                } catch(e){
                    alert("浏览器禁用localstorage!，请开启。");
                    return false;
                }
            }else{
                return false;
            }
        },
        initVerifyCode:function () {
            return;
            //TODO:
            $.ajax({
                type: 'GET',
                async: false,
                url: IP + 'getVerifyCode?histCode='+$("input[name='code']").val(),
                success: function(data) {
                    layer.closeAll('loading');
                    $("input[name='code']").val(data.code);
                    $("#codeImg").attr('src',data.codeStr);
                }
            });
        }
    };
    $(function () {
        login.init();
    });
});
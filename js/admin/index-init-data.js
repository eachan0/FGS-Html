layui.use(['layer','form'], function () {
    let layer = layui.layer,
        form = layui.form;

    let changePwd = {
        init:function () {
            form.on('submit(subchangepwd)', function(data){
                $.ajax({
                    url:IP+'user/changepwd',
                    data:JSON.stringify(data.field),
                    success:function (res) {
                        if (res.code===0){
                            layer.msg('修改成功，请重新登陆！', {
                                icon: 6,
                                time: 1500 //2秒关闭（如果不配置，默认是3秒）
                            }, function(){
                                initData.loginOut();
                            });
                        }
                        else{
                            layer.msg('修改失败：'+(res.msg||""), {
                                icon: 5,
                                time: 1500 //2秒关闭（如果不配置，默认是3秒）
                            });
                        }
                    }
                });
                return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。
            });
            form.verify({
                newpass: function(value, item){ //value：表单的值、item：表单的DOM对象
                    let oldpass = $('#changepwd input[name="oldPass"]').val();
                    if(value===oldpass){
                        return '不能与原密码相同';
                    }
                }
                //我们既支持上述函数式的方式，也支持下述数组的形式
                //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
                ,pass: [
                    /^[\S]{6,12}$/
                    ,'密码必须6到12位，且不能出现空格'
                ]
                ,repass:function (value, item) {
                    let pass = $('#changepwd input[name="newPass"]').val();
                    if(value!==pass){
                        return '两次密码不一致';
                    }
                }
            });

        },
        showModel:function () {
            return layer.open({
                type: 1,
                content: $("#changepwd"), //这里content是一个普通的String
                area: ['500px', '300px']
            });
        }
    };
    let initData = {
        init: function () {
            this.getUserInfo();
            this.bindingEvents();
        },
        getUserInfo: function () {
            $.ajax({
                url: IP + 'get_user_info',
                type: 'GET',
                headers: {
                    "token": localStorage.getItem("user_token")
                },
                async: false,
                success: function (result, status, xhr) {
                    if (result.code!=0){
                        layer.msg("请求异常", {
                            icon: 2,
                            time: 1000
                        });
                        console.log(result);
                        return false;
                    }

                    let data = result.data;
                    $('#nickname').html(data.nickname)
                    sessionStorage.setItem("username", data.username);
                    sessionStorage.setItem("nickname", data.nickname);
                    initData.getMenusInfo(data.menus);
                },
                error: function (xhr) {
                    let msg = "";
                    if (!xhr.responseText) {
                        msg = "连接超时";
                    } else {
                        let response = null;
                        try {
                            if(typeof xhr.responseText =="string"){
                                response = JSON.parse(xhr.responseText);
                            }else {
                                response = xhr.responseText;
                            }
                        }catch (e) {
                            response = {};
                            response.message = "连接超时";
                        }
                        msg = response.message;
                        if (response.code == 401) {
                            localStorage.removeItem("user_token");
                        }
                    }
                    layer.msg(msg, {
                        icon: 2,
                        time: 1000
                    }, function () {
                        parent.window.location = "login.html";
                    });
                }
            });
        },
        getMenusInfo: function (obj) {
            let menus = this.toTree(this.bubbleSort(obj));
            let menuHtml = "";
            $.each(menus, function (idx, obj) {
                let p = '<li>' +
                    '<dt><i class="layui-icon ' + obj.ico + '"></i>&nbsp;' + obj.menuName +
                    '<i class="layui-icon layui-icon-triangle-r"></i></dt><dl>'
                $.each(obj.children, function (idx1, child) {
                    p += "<dd>" +
                        "<a data-url='" + child.url + "' data-title='" + child.menuName + "'>" + child.menuName + "</a>" +
                        "</dd>"
                });
                p += "</dl></li>"
                menuHtml += p;
            });
            $('.layui-nav-myitem').append(menuHtml)
        },
        loginOut: function () {
            $.ajax({
                url:IP+"logout",
                type:"POST",
                async: false,
                success:function () {
                    localStorage.clear();
                    parent.window.location = "login.html";
                }
            });
        },
        toTree: function (data) {
            data.forEach(function (item) {
                delete item.children;
            });
            let map = {};
            data.forEach(function (item) {
                map[item.id] = item;
            });
            let val = [];
            data.forEach(function (item) {
                let parent = map[item.parentid];
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    val.push(item);
                }
            });
            return val;
        },
        bubbleSort: function (arr) {
            let i = arr.length,
                j;
            let tempExchangeVal;
            while (i > 0) {
                for (j = 0; j < i - 1; j++) {
                    if (arr[j].sort > arr[j + 1].sort) {
                        tempExchangeVal = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = tempExchangeVal;
                    }
                }
                i--;
            }
            return arr;
        },
        bindingEvents:function () {
            $('#user_info dl dd a').click(function() {
                var index = $("#user_info dl dd a").index(this);
                switch(index) {
                    case 0:
                        changePwd.showModel();
                        break;
                    case 1:
                        layer.confirm("您要退出吗？", {
                            icon: 3
                        }, function(index) {
                            layer.close(index);
                            initData.loginOut();
                        });
                        break;
                }
            });
        }
    };
    $(function () {
        initData.init();
        changePwd.init();
    });
});

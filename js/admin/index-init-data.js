layui.use(['layer'], function () {
    let layer = layui.layer;

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
                        if(typeof xhr.responseText =="string"){
                            response = JSON.parse(xhr.responseText);
                        }else {
                            response = xhr.responseText;
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
                    localStorage.removeItem("user_token");
                    parent.window.location = "login.html";
                }
            });
        },
        changePwd: function () {

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
                        $('#update_password').trigger('click')
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
    }
    $(function () {
        initData.init();
    });
});
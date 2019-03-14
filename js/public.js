const IP = "/fgs-api/";
let layerMsg = null;
layui.use(["layer"], function () {
    let layer = layui.layer,
        $ = layui.$;
    $.ajaxSetup({
        cache: false,
        timeout: 18000,
        type: "post",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        headers: {
            "token": localStorage.getItem("user_token")
        },
        beforeSend: function (xhr) {
            layer.load(1);
        },
        error: function (xhr) {
            let msg = "连接超时";
            try {
                let code = xhr.status;
                if (code == 403) {
                    msg = "权限不足";
                } else if (code == 500) {
                    msg = '服务器错误';
                } else if (code == 404) {
                    msg = '资源不存在';
                } else if (code == 401) {
                    localStorage.removeItem("user_token");
                    if (xhr.responseJSON.message) {
                        msg = xhr.responseJSON.message;
                    } else {
                        msg = "请先登陆!"
                    }
                }
                layer.msg(msg, {
                    icon: 2,
                    time: 2000
                });
            } catch (e) {
                return false;
            } finally {

                // layer.closeAll("loading");
            }
        },
        complete: function () {
            layer.closeAll("loading");
        }
    });

    $('#refresh').on('click', function () {
        window.location.reload();
    });
    $("#back").on('click', function () {
        window.history.back(-1);
    });
    layerMsg = {
        msg: function (code, type, t) {
            this.closeAll();
            type = type ? type : "操作";
            t = parseInt(t ? t : 1500);
            if (code === 0) {
                layer.msg(type + '成功', {icon: 1, time: t});
                return true;
            } else {
                if (code == 300) {
                    layer.msg('数据已存在', {icon: 5, time: t});
                    return false;
                } else {
                    layer.msg(type + '失败', {icon: 2, time: t});
                    return false;
                }
            }
        },
        closeAll: function (type) {
            type = type ? type : 'loading';
            layer.closeAll(type);
        }
    }
});
let publicJs = {
    getRoles: function () {
        let data;
        $.ajax({
            type: 'get',
            url: IP + "role/roles",
            async: false,
            success: function (result) {
                data = result.data;
            }
        });
        return data;
    },
    getRolesByUserId: function (id) {
        let data;
        $.ajax({
            type: 'get',
            url: IP + "role/roleByUserId/" + id,
            data: {id: id},
            async: false,
            success: function (result) {
                data = result.data;
            }
        });
        return data;
    },
    getMenus: function f() {
        let menus = null;
        $.ajax({
            url: IP + 'menu/list',
            async: false,
            success: function (data) {
                menus = data.data;
            }
        });
        return menus;
    },
    menuSort: function (hasMenu, countMenu) {
        if (!!hasMenu) {
            $.each(countMenu, function (i, cItem) {
                $.each(hasMenu, function (j, hItem) {
                    if (cItem.id == hItem.id) {
                        cItem.checked = true;
                        return false;
                    }
                });
            });
        }
        return countMenu;
    },
    closeCurrentWindow: function (obj) {
        window.opener = null;
        window.open('', '_self');
        window.close();
    }
}
let ztree_menu_setting = {
    check: {
        enable: true
    },
    data: {
        key: {
            name: "menuName"
        },
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "parentid",
            rootPId: 0
        }
    }
};

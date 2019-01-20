layui.use(['layer', 'form'], function() {
    let layer = layui.layer,
        $ = layui.$,
        form = layui.form;

    let roleAdd = {
        zTreeObj:null,
        init: function f() {
            this.zTreeObj = $.fn.zTree.init($("#treeDemo"), ztree_menu_setting, publicJs.getMenus());
            this.formEvents();
        },
        formEvents:function () {
            //表单监听提交
            form.on('submit(formDemo)', function(data) {
                let dict_data = data.field;
                let checkedNodes = roleAdd.zTreeObj.getCheckedNodes();
                let permissionIds=[];
                $.each(checkedNodes, function(idx,obj) {
                    permissionIds.push(obj.id)
                });
                dict_data.menus=permissionIds;
                roleAdd.submitAddAction(dict_data);
                return false;
            });
        },
        submitAddAction:function (obj) {
            $.ajax({
                url: IP + 'role/role',
                type: 'POST',
                data: JSON.stringify(obj),
                success: function(result) {
                    let msg ='';
                    let option = {
                        time:1000
                    };
                    if (result.code=='0'){
                        msg = "添加角色成功！";
                        option.icon = 1;
                    } else{
                        msg = "添加角色失败！";
                        option.icon = 2;
                    }
                    layer.msg(msg, option, function() {
                        window.history.back(-1);
                    });
                }
            });
        }
    };

    $(function () {
        roleAdd.init();
    });
});
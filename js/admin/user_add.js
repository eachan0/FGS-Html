layui.use(['layer', 'form'], function() {
    let layer = layui.layer,
        $ = layui.$,
        form = layui.form;

    let userAdd = {
        init:function () {
            $('#user_add_btn').attr("disabled","disabled");
            this.initRoles();
            this.formEvents();
        },
        initRoles:function(){
            let roles = publicJs.getRoles();
            if (roles == null || roles.length === 0){
                layer.msg('获取数据异常');
                return false;
            }
            let str = '';
            $.each(roles,function (index,item) {
                str += '<input type="checkbox" name="role" lay-skin="primary" title="'+item.roleName+'" value="'+item.id+'">';
            });
            $('#role').append(str);
            $('#user_add_btn').removeAttr("disabled");
            form.render();
        },
        formEvents:function () {
            //表单监听提交
            form.on('submit(formDemo)', function(data) {
                let user_data = data.field;
                let roles = [];
                $.each($('#role').children('input:checked'), function(idx, obj) {
                    roles.push($(this).val())
                });
                user_data.roles = roles;
                userAdd.submitAddAction(user_data);
                return false;
            });
            form.verify({
                username: function(value, item) {
                    if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                        return '用户名不能有特殊字符';
                    }
                    if(!(/^[\S]{2,16}$/.test(value))) {
                        return '用户名必须2到16位，且不能出现空格';
                    }
                },
                nickname: function(value, item) {
                    if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                        return '昵称不能有特殊字符';
                    }
                    if(!(/^[\S]{2,16}$/.test(value))) {
                        return '昵称必须2到16位，且不能出现空格';
                    }
                },
                password: function(value, item) {
                    if(!(/^[\S]{5,18}$/.test(value))) {
                        return '密码必须5到18位，且不能出现空格';
                    }
                },
                phone: function(value, item) {
                    if(value) {
                        if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(value))) {
                            return '请填写正确的电话';
                        }
                    }
                },
                email: function(value, item) {
                    if(value) {
                        if(!(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value))) {
                            return "请填写正确的邮箱"
                        }
                    }
                }
            });
        },
        submitAddAction:function (obj) {
            $.ajax({
                url: IP + 'user/user',
                type: 'POST',
                data: JSON.stringify(obj),
                success: function(result, status, xhr) {
                    if (layerMsg.msg(result.code,"添加",800)){
                        window.history.back(-1);
                    }
                }
            });
        }
    }
    $(function () {
        userAdd.init();
    });
});
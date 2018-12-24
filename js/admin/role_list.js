//JavaScript代码区域
layui.use(['layer', 'form', 'table'], function () {
    let layer = layui.layer,
        $ = layui.$,
        form = layui.form,
        table = layui.table;

    let role = {
        init: function () {
            this.tableInit();
            this.tableEvents();
            this.formEvents();
            this.bindingEvents();
        },
        tableInit: function () {
            //数据表格实例
            table.render({
                id: 'idTest',
                elem: '#demo',
                url: IP + 'role/roles',
                height: 'full-180',
                method: 'get',
                page: true,
                even: true,
                cols: [
                    [{
                        type: 'checkbox'
                    }, {
                        type: 'numbers'
                    }, {
                        field: 'id',
                        title: 'ID',
                        hide: true
                    }, {
                        field: 'roleName',
                        title: '角色名',
                        edit: true
                    }, {
                        field: 'isEnable',
                        title: '状态',
                        templet: '#checkboxTpl',
                        unresize: true
                    }, {
                        fixed: 'right',
                        width: 200,
                        title: '操作',
                        align: 'center',
                        toolbar: '#barDemo'
                    }]
                ],
                request: {
                    pageName: 'page',
                    limitName: 'pageSize'
                },
                response: {
                    statusName: 'code',
                    statusCode: 0,
                    msgName: 'msg',
                    countName: 'count',
                    dataName: 'data'
                },
                done: function (res, curr, count) {
                    layer.closeAll('loading');
                }
            });
        },
        tableEvents: function () {
            //数据表格监听工具条(编辑、删除按钮)
            table.on('tool(test)', function (obj) {
                let data = obj.data;
                let layEvent = obj.event;
                if (layEvent === 'del') {
                    let id = [];
                    id.push(data.id);
                    role.submitDelAction(id);
                    return false;
                } else if (layEvent === 'edit') {
                    console.log(obj);
                    return false;
                }
            });
            //复选框批量操作
            table.on('checkbox(test)', function (obj) {
                let checkStatus = table.checkStatus('idTest');
                if (checkStatus.data.length > 0) {
                    $('#delAll').show()
                } else {
                    $('#delAll').hide()
                }
            });
            //监听单元格编辑
            table.on('edit(test)', function (obj) {
                let value = obj.value //得到修改后的值
                    , id = obj.data.id //得到所在行所有键值
                    , field = obj.field; //得到字段
                let temp = '{"id":' + id + ',"' + field + '":"' + value + '"}';
                role.layerMsg(role.submitEditAction(temp));
            });
        },
        formEvents: function () {
            //监听提交
            form.on('submit(formDemo)', function (data) {
                table.reload('idTest', {
                    where: data.field
                });
                return false;
            });
            //监听锁定操作
            form.on('checkbox(lockDemo)', function (obj) {
                $(obj.elem).attr("disabled", "disabled");
                let id = this.value, isEnable = 1;
                if (obj.elem.checked) {
                    isEnable = 0;
                }
                let temp = '{"id":' + id + ',"isEnable":' + isEnable + '}';
                role.layerTips(role.submitEditAction(temp), obj);
                $(obj.elem).removeAttr("disabled");
            });
        },
        bindingEvents: function () {
            //批量删除按钮
            $('#delAll').click(function () {
                let checkStatus = table.checkStatus('idTest');
                if (checkStatus.data.length > 0) {
                    let list = checkStatus.data;
                    let ids = [];
                    $.each(list, function (idx, obj) {
                        ids.push(obj.id)
                    });
                    role.submitDelAction(ids);
                }
            });
            //添加按钮事件
            $('#addRole').on('click', function () {
                window.location.href='role_add.html';
            });
        },
        submitEditAction: function (obj, type) {
            let status = false;
            $.ajax({
                type: "put",
                url: IP + "role/role",
                data: obj,
                async: false,
                success: function (result) {
                    if (result.code === 0) {
                        status = true;
                    }
                }
            });
            return status;
        },
        submitDelAction: function (arry) {
            layer.confirm('确认删除吗？', {icon: 3}, function () {
                    $.ajax({
                        type: 'delete',
                        url: IP + 'role/role',
                        data: JSON.stringify(arry),
                        success: function (result) {
                            layerMsg.msg(result.code, '删除', 1000);
                        }
                    });
                }
            );
        },
        layerTips: function (res, obj) {
            if (res) {
                layer.tips("修改成功!", obj.othis);
            } else {
                layer.tips("修改失败!", obj.othis);
                this.tableReload({});
            }
        },
        layerMsg: function (res) {
            if (res) {
                layer.msg('修改成功', {icon: 6, time: 1000});
            } else {
                layer.msg('修改失败', {icon: 5, time: 1000});
                this.tableReload({});
            }
        }
    };

    $(function () {
        role.init();
    });

    //单、批量删除
    function deleteByUids(ts, ids) {
        layer.confirm('真的删除' + ts + "吗？", {
            icon: 3
        }, function (index) {
            layer.close(index);
            $.ajax({
                url: IP + '/api/blog-admin/role',
                type: "DELETE",
                data: JSON.stringify(ids),
                success: function (result, status, xhr) {
                    layer.closeAll('loading');
                    layer.msg(result.message, {
                        icon: 1,
                        time: 1300
                    }, function () {
                        table.reload('idTest', {});
                    });
                }
            });
        });
    }
});
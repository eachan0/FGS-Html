layui.use(['layer', 'form', 'table'], function () {
    let layer = layui.layer,
        $ = layui.$,
        form = layui.form,
        table = layui.table;

    $(function () {
        product.init();
    });

    let product = {
        init:function () {
            this.tableInit();
            this.bindingEvents();
            this.formEvents();
            this.tableEvents();
        },
        tableInit: function () {
            //数据表格实例
            table.render({
                id: 'idTest',
                elem: '#demo',
                url: IP + 'product/product',
                height: 'full-180',
                method: 'get',
                page: true,
                even: true,
                cols: [
                    [{
                        type: 'checkbox'
                    }, {
                        field: 'id',
                        title: 'id',
                        hide: true
                    }, {
                        field: 'name',
                        title: '商品名称'
                    }, {
                        field: 'photo',
                        title: '图片',
                        templet: function(d){
                            let str = d.photo;
                            str = str.replace(/\ +/g,"");
                            str = str.replace(/[\r\n]/g,"");
                            return '<img style="width: 100px;" src="'+str+'"/>'
                        }
                    }, {
                        field: 'desc',
                        title: '描述',
                        width: 150
                    }, {
                        field: 'price',
                        title: '单价',
                    }, {
                        field: 'tuanPrice',
                        title: '团购单价',
                    },{
                        fixed: 'right',
                        width: 300,
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
        formEvents:function(){
            form.on('submit(formDemo)', function (data) {
                table.reload('idTest', {
                    where: data.field
                });
                return false;
            });
        },
        tableEvents:function(){
            //数据表格监听工具条(查看、编辑、删除按钮)
            table.on('tool(test)', function (obj) {
                let data = obj.data;
                let layEvent = obj.event;
                if (layEvent === 'edit') {
                    localStorage.setItem("product",JSON.stringify(data));
                    window.location = "edit.html";
                } else if (layEvent === 'del') {
                    let ids = [];
                    ids.push(data.id);
                    product.submitDelAction(ids);
                }
            });
            //复选框批量操作
            table.on('checkbox(test)', function (obj) {
                let checkStatus = table.checkStatus('idTest');
                if (checkStatus.data.length > 0) {
                    $('#delAll').show();
                } else {
                    $('#delAll').hide();
                }
            });
        },
        bindingEvents:function () {//批量删除按钮
            $('#delAll').on('click', function () {
                let checkStatus = table.checkStatus('idTest');
                if (checkStatus.data.length > 0) {
                    let list = checkStatus.data;
                    let ids = [];
                    $.each(list, function (idx, obj) {
                        ids.push(obj.id);
                    });
                    product.submitDelAction(ids);
                }
            });
            //添加按钮事件
            $('#adduser').on('click', function () {
                window.location = 'add.html'
            });
        },
        submitDelAction:function (array) {
            layer.confirm('确认删除吗？', {icon: 3}, function () {
                $.ajax({
                    url: IP + 'product/product',
                    type: "DELETE",
                    data: JSON.stringify(array),
                    success: function (result) {
                        if (layerMsg.msg(result.code, '删除', 1000)) {
                            table.reload('idTest');
                        }
                    }
                });
            });
        }
    };

});

//JavaScript代码区域
layui.use(['layer', 'form', 'laydate', 'table'], function () {
    let layer = layui.layer,
        $ = layui.$,
        form = layui.form,
        laydate = layui.laydate,
        table = layui.table;

    let sysOrder = {
        init: function () {
            this.tableInit();
            this.laydateInit();
            this.tableEvents();
            this.formEvents();
        },
        tableInit: function () {
            //数据表格实例
            table.render({
                id: 'idTest',
                elem: '#demo',
                url: IP + 'order/orders',
                height: 'full-180',
                method: 'get',
                page: true,
                even: true,
                cols: [
                    [{
                        type:"numbers",
                        width: 50
                    },{
                        field: 'orderNo',
                        title: '订单号',
                    }, {
                        field: 'createTime',
                        title: '创建时间'
                    }, {
                        field: 'proId',
                        title: '商品编号'
                    }, {
                        field: 'price',
                        title: '单价',
                        sort: true
                    }, {
                        field: 'num',
                        title: '数量',
                        sort: true
                    }, {
                        field: 'amount',
                        title: '总价',
                        sort: true
                    }, {
                        field: 'schedule',
                        title: '交易状态',
                        templet:function (d) {
                            const i = parseInt(d.schedule);
                            switch (i) {
                                case 1:return "已付款";
                                case 2:return "待收货";
                                case 3:return "交易成功";
                                case 4:return "交易取消";
                                default:return "数据错误";
                            }
                        }
                    },{
                        fixed: 'right',
                        width: 150,
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
        laydateInit: function () {
            //执行一个laydate实例
            laydate.render({
                elem: '#start',
                type:"datetime"
            });
            laydate.render({
                elem: '#end',
                type:"datetime"
            });
        },
        tableEvents: function () {
            //数据表格监听工具条(查看、编辑、删除按钮)
            table.on('tool(test)', function (obj) {
                let data = obj.data;
                let layEvent = obj.event;
                if (layEvent === 'send') {
                    sysOrder.submitEditAction({orderNo:data.orderNo,schedule:"2"});
                } else if (layEvent === 'cancel') {
                    sysOrder.submitEditAction({orderNo:data.orderNo,schedule:"4"});
                }
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
        },
        submitEditAction: function (data) {
            $.ajax({
                type: 'put',
                url: IP + "order/order",
                data: JSON.stringify(data),
                async: false,
                success: function (result) {
                    sysOrder.layerMsg(result.code);
                }
            });
        },
        layerMsg: function (res) {
            if (!res) {
                layer.msg('修改成功', {icon: 6, time: 1000});
            } else {
                layer.msg('修改失败', {icon: 5, time: 1000});
            }
            sysOrder.tableReload({});
        },
        tableReload: function (obj) {
            table.reload('idTest', obj);
        }
    };

    $(function () {
        sysOrder.init();
    });

});

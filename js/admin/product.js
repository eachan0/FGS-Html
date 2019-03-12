layui.use(['layer', 'form', 'table','laydate'], function () {
    let layer = layui.layer,
        $ = layui.$,
        form = layui.form,
        laydate = layui.laydate,
        table = layui.table;

    $(function () {
        product.init();
    });

    let product = {
        myLock:"POST",
        index:null,
        init:function () {
            this.tableInit();
            this.bindingEvents();
            this.formEvents();
            this.tableEvents();
            this.dateInit();
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
        dateInit:function(){
            laydate.render({
                elem: "#time1",
                type:"datetime",
            });
            laydate.render({
                elem: "#time2",
                type:"datetime",
            });
        },
        formEvents:function(){
            form.on('submit(formDemo)', function (data) {
                table.reload('idTest', {
                    where: data.field
                });
                return false;
            });
            form.on('submit(formDemo1)', function (data) {
                $.ajax({
                    type:product.myLock,
                    url:IP+"fightgroup/fightgroup",
                    data:JSON.stringify(data.field),
                    success:function (res) {
                        if(layerMsg.msg(res.code,"设置")){
                            product.closeIndex();
                        }
                    }
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
                }else if(layEvent === "setfg"){
                    product.setFightGroup(data.id);
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

            $("#delset").click(function () {
                if (product.myLock==="POST"){
                    return false;
                }
                let id = $("#proId").val();
                let ids = [];
                ids.push(id);
                $.ajax({
                    type:"DELETE",
                    url:IP+"fightgroup/fightgroup",
                    data:JSON.stringify(ids),
                    success:(res)=>{
                        if(layerMsg.msg(res.code,"删除")){
                            product.closeIndex();
                        }
                    }
                });
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
        },
        setFightGroup:function (id) {
            $("#proId").val(id);
            $.ajax({
                type:"get",
                url:IP+"fightgroup/fightgroup",
                data:{id:id},
                async:false,
                success:(res)=>{
                    if (res.code===0 && res.data){
                        form.val("modelform", res.data);
                        product.myLock = "PUT";
                    }
                }
            });
            this.index = layer.open({
                type:1,
                title:"拼团设置",
                content:$("#fgmodel"),
                area: ['400px', '300px'],
                closeBtn:2,
                end:()=>{
                    $("#fgmodel")[0].reset();
                    product.myLock = "POST";
                }
            });
        },
        closeIndex(){
            if (this.index){
                layer.close(this.index);
            }
        }
    };

});

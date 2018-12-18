layui.config({
    base: '/FGS-Html/layui/extend/'
}).extend({
    treeGrid:'treeGrid'
}).use(['jquery','treeGrid','layer'], function(){
    let $ = layui.jquery,
        treeGrid = layui.treeGrid,//很重要
        layer = layui.layer;


    let menu = {
        init:function () {
            this.tableInit();
            this.tableEvents();
        },
        tableInit:function () {
            treeGrid.render({
                id:'treeTable'
                ,elem: '#'+'treeTable'
                ,idField:'id'
                ,url:IP+'menu/list'
                ,cellMinWidth: 100
                ,treeId:'id'//树形id字段名称
                ,treeUpId:'parentid'//树形父id字段名称
                ,treeShowName:'menuName'//以树形式显示的字段
                ,cols: [[
                    {type:'numbers'}
                    ,{field:'menuName', edit:'text',width:200, title: 'name'}
                    ,{field:'id', width:50 ,title: 'id'}
                    ,{field:'parentid', width:50 ,title: 'pId'}
                    ,{field:'type', edit:'text',title: 'type'}
                    ,{field:'url', edit:'text',title: 'url'}
                    ,{field:'ico', edit:'text',title: 'ico'}
                    ,{field:'sort', width:50 ,edit:'text',title: 'sort'}
                    ,{field:'permission', edit:'text',title: 'permission'}
                    ,{width:150,title: '操作', align:'center',toolbar: '#barDemo'
                    }
                ]]
                ,page:false
            });
        },
        tableEvents:function () {
            $('#menu_add').on('click',function () {
                menu.addMenu();
                return false;
            });
            treeGrid.on('tool(treeTable)',function (obj) {
                if(obj.event === 'del'){//删除行
                    obj.del();
                    menu.delMenu(obj);
                }else if(obj.event==="add"){//添加行
                    menu.addMenu(obj.data);
                }else if (obj.event==="sub"){
                    menu.submitAddAction(obj);
                }
                return false;
            });
            //监听单元格编辑
            treeGrid.on('edit(treeTable)', function(obj){
                if (!obj.data.id){
                    return false;
                }
                menu.putMenu(obj);
                return false;
            });
        },
        addMenu:function (pObj) {
            let param={};
            param.menuName='<span style="color: red">单击输入名称</span>';
            param.parentid=pObj?pObj.id:0;
            treeGrid.addRow("treeTable",pObj?pObj.LAY_TABLE_INDEX+1:0,param);
        },
        delMenu:function (obj) {
            layer.confirm("你确定删除数据吗？如果存在下级节点则一并删除，此操作不能撤销！", {icon: 3, title:'提示'},
                function(index){//确定回调
                    console.log(obj);
                    layer.close(index);
                },function (index) {//取消回调
                    layer.close(index);
                }
            );
        },
        putMenu:function (obj) {
            let value = obj.value;
            let field = obj.field;
            let id = obj.data.id;
            let temp = '{"id":'+id+',"'+field+'":"'+value+'"}';
            $.ajax({
                url:IP+"menu/menu",
                type:"PUT",
                data:temp,
                success:function (result) {
                    if (result.code ===0){
                        layer.msg('修改成功', {icon: 6,time:800});
                    }else {
                        layer.msg('修改失败', {icon: 5,time:800});
                    }
                }
            })
        },
        submitAddAction:function (obj) {
            console.log(obj.data);
        }
    };

    $(function () {
        menu.init();
    })
});
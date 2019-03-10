layui.use(['layer','form'], function() {
    let layer = layui.layer,
        $ = layui.$,
        form = layui.form;

    $(function () {
        product_edit.init();
    });

    let product_edit = {
        data:null,
        init:function () {
            this.formEvents();
            this.data = JSON.parse(localStorage.getItem("product"));
            this.initData();
            this.bindingEvents();
        },
        initData:function(){
            form.val('pro_form',this.data);
            $("#img").attr("src",product_edit.data.photo);
        },
        formEvents:function () {
            //表单监听提交
            form.on('submit(formDemo)', function(data) {
                let formData = new FormData($("#addProductForm")[0]);
                $.ajax({
                    url: IP + 'product/product',
                    type: 'PUT',
                    processData:false,
                    contentType:false,
                    data: formData,
                    success: function(result, status, xhr) {
                        if (layerMsg.msg(result.code,"添加",800)){
                            window.history.back(-1);
                        }
                    }
                });
                return false;
            });
        },
        bindingEvents:function () {
            $("#imgbtn").click(function () {
                $("#imgdiv").show();
                return false;
            });
        }
    }
});

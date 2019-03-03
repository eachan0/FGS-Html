layui.use(['layer','form'], function() {
    let layer = layui.layer,
        $ = layui.$,
        form = layui.form;

    $(function () {
        product_add.init();
    });

    let product_add = {
        init:function () {
            this.formEvents();
        },
        formEvents:function () {
            //表单监听提交
            form.on('submit(formDemo)', function(data) {
                let formData = new FormData($("#addProductForm")[0]);
                $.ajax({
                    url: IP + 'product/product',
                    type: 'POST',
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
        }
    }
});

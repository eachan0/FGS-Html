//JavaScript代码区域
layui.use(['layer', 'element'], function() {
	let layer = layui.layer,
		$ = layui.$,
		element = layui.element;
        
    $(function(){
        index.init();
    });
    
    let index = {
        item:null,
        parentItems:null,
        myNav:null,
        parentItemsIsClick:false,
        init:function () {
            //初始化导航栏
            this.myNav = new IScroll('#wrapper', {
                mouseWheel: true,
                bounce: true,
                scrollX: true,
                tap: true,
                click: true
            });

            this.items = $('.layui-side .layui-nav-myitem li dl dd a');
            this.items.each(function(idx, obj) {
                $(obj).attr('lay-id', 'items' + idx);
            });
            this.parentItems = $('.layui-side .layui-nav-myitem');

            this.LAY_app_flexible($(window).width());
            /*右键菜单*/
            this.refreshContextMenu();
            this.bindingEvents();
        },
        clearOtherCss:function(parentItems){
            //var parentItems = $('.layui-side .layui-nav-myitem');
            $(parentItems).children('li').children('dt').children('.layui-icon-triangle-r').css({
                "transform": "rotate(0deg)"
            });
            $('.layui-nav-myitem dl').hide(300, function() {
                $(parentItems).children('li').children('dt').removeClass('selected');
            });
        },
        refreshContextMenu:function () {
            $('#wrapper ul li').not('.layui-tab-index').contextMenu('myMenu1', {
                bindings: {
                    'deletemyself': function(t) {
                        element.tabDelete('layui-tab', $(t).attr('lay-id'));
                        element.tabChange('layui-tab', $('#layui-tabs li:last').attr('lay-id'));
                        index.Naviscroll();
                    },
                    'deleteother': function(t) {
                        $.each($('#layui-tabs li'), function(idx, obj) {
                            console.log($(obj).attr('lay-id'))
                            if($(t).attr('lay-id') != $(obj).attr('lay-id')) {
                                if($(obj).attr('lay-id') != "index") {
                                    element.tabDelete('layui-tab', $(obj).attr('lay-id'));
                                }
                            }
                            element.tabChange('layui-tab', $(t).attr('lay-id'));
                        });
                        index.Naviscroll();
                    },
                    'deleteall': function(t) {
                        $.each($('#layui-tabs li'), function(idx, obj) {
                            if($(obj).attr('lay-id') != "index") {
                                element.tabDelete('layui-tab', $(obj).attr('lay-id'));
                            }
                            element.tabChange('layui-tab', "index");
                        });
                        index.Naviscroll();
                    }
                }
            });
        },
        Naviscroll:function () {
            //改变.layui-layout-admin .layui-body .layui-tab .layui-tab-title的宽度
            var list = $('.layui-layout-admin .layui-body .layui-tab .layui-tab-title li');
            var width = 0;
            var tabtitle = $('.layui-layout-admin .layui-body .layui-tab .layui-tab-title');
            $.each(list, function(idx, obj) {
                width += parseInt($(this).outerWidth(true));
            });
            $(tabtitle).width(width + 3);
            index.myNav.refresh(); //刷新滑块
        },
        changeLAY_app_flexible:function (flag) {
            $('#LAY_app_flexible').removeClass('layui-icon-shrink-right layui-icon-spread-left');
            if(flag) {
                $('#LAY_app_flexible').addClass('layui-icon-spread-left');
            } else {
                $('#LAY_app_flexible').addClass('layui-icon-shrink-right');
            }
        },
        changeSide:function (width) {
            $('.layui-layout-admin .layui-side').css({
                "left": -(200 - width) + "px",
            })
            $('.layui-layout-admin .layui-body').css({
                "left": width + "px",
            })
            setTimeout(function() {
                index.Naviscroll();
            }, 350)
        },
        LAY_app_flexible:function (width) {
            $('#LAY_app_flexible').removeClass('layui-icon-shrink-right layui-icon-spread-left');
            if(width <= 768) {
                index.changeSide(0);
                $('#LAY_app_flexible').addClass('layui-icon-spread-left');
            } else {
                index.changeSide(200);
                $('#LAY_app_flexible').addClass('layui-icon-shrink-right');
            }
        },
        bindingEvents:function () {
            /*遮罩*/
            $('.layadmin-body-shade').click(function() {
                this.changeSide(0);
                $(this).hide();
                this.changeLAY_app_flexible(true)
            });
            /*LAY_app_flexible*/
            $('#LAY_app_flexible').parent('a').click(function() {
                let that = $('#LAY_app_flexible');
                if($(that).hasClass('layui-icon-shrink-right')) {
                    index.changeSide(0)
                    index.changeLAY_app_flexible(true)
                    $('.layadmin-body-shade').hide();
                } else {
                    index.changeSide(200)
                    index.changeLAY_app_flexible(false)
                    if($(window).width() <= 768) {
                        $('.layadmin-body-shade').show();
                    }
                }
            });
            /*监听窗口大小改变*/
            $(window).resize(function() {
                index.LAY_app_flexible($(window).width());
            });
            //左侧菜单栏添加事件(子菜单事件)
            $(this.parentItems).on('click','li dl dd',function(){
                $(index.items.parent("dd")).removeClass('selected');
                $(this).addClass('selected');
                var that = $(this).children('a').get(0);
                var flag = true;
                var tabs = $('#layui-tabs li');
                var url = $(that).data('url');
                var title = $(that).data('title');
                var id = $(that).attr('lay-id');
                if(url && title && id) {
                    tabs.each(function(idx, obj) {
                        //判断是否在右侧菜单栏是否打开
                        if($(that).attr('lay-id') == $(obj).attr('lay-id')) {
                            flag = false;
                            element.tabChange('layui-tab', id); //如果存在，则打开它
                        }
                    });
                    if(flag) {
                        var close = $('<i class="layui-icon layui-unselect layui-tab-close" data-id="' + id + '">ဆ</i>');
                        $(close).click(function() {
                            element.tabDelete('layui-tab', $(this).data('id'));
                            element.tabChange('layui-tab', $('#layui-tabs li:last').attr('lay-id'));
                            index.Naviscroll(); //刷新滑块
                        })
                        element.tabAdd('layui-tab', {
                            title: title,
                            content: '<iframe scrolling="auto" frameborder="0"  src="' + url + '" style="width:100%;height:100%;"></iframe>',
                            id: id
                        });
                        element.tabChange('layui-tab', id)
                        $('#layui-tabs .layui-this').append(close)
                        index.Naviscroll(); //刷新滑块
                        index.refreshContextMenu();
                    }
                }
                //关闭遮罩
                $('.layadmin-body-shade').hide();
                if($(window).width() <= 768) {
                    changeSide(0);
                    changeLAY_app_flexible(true)
                }
            });
            $(this.parentItems).on('click','li dt',function(){
                var that = this;
                if(index.parentItemsIsClick) {
                    return;
                }
                index.parentItemsIsClick = true;
                //判断是否有.selected
                if($(that).hasClass('selected')) {
                    index.clearOtherCss(index.parentItems);
                    $(that).children('.layui-icon-triangle-r').css({
                        "transform": "rotate(0deg)"
                    });
                    $(that).siblings('dl').hide(300, function() {
                        $(that).removeClass('selected');
                        index.parentItemsIsClick = false;
                    });
                } else {
                    index.clearOtherCss(index.parentItems);
                    $(that).children('.layui-icon-triangle-r').css({
                        "transform": "rotate(90deg)"
                    });
                    $(that).siblings('dl').show(300, function() {
                        $(that).addClass('selected');
                        index.parentItemsIsClick = false;
                    });
                }
            });
        }
    }
});
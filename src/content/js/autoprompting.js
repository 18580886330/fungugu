/**
 * 下拉框搜索提示插件
 */
; (function ($, window, document, undefined) {
    var autoprompting = function (elm, opts) {
        this.elm = elm;
        this.defaults = {
            style: {},
            timer: 0, // 定时请求对象
            time: 0,  //定时请求
            type: 'get',
            dataType: 'json',
            url: '',
            mustData: '',
            params: '',
            getType: 'remote', // 1.remote   2.static提供两种请求数据的试，一种远程http请求数据(默认)，另一种本地检索静态数据
            otherElm: '', // 指定一个元素绑定click事件，与回车事件enter相同
            render: null,      // 用于生成dom的结构的回调方法
            callBack: null,
            enter: null,       // 回车按键回调
        };
        if (!this.elm) {
            throw new Error(this.elm + ' 缺少ID元素');
        }
        this.searchElmType = ''; // 保存搜索类型（1.点击otherElm对象搜索，2.回车搜索，点击元素搜索）
        this.autoprompting = $('<div data-type="autoprompting" data-elmid="' + this.elm.attr('id') + '" class="autoprompting" style="width:' + this.elm.width() + 'px;left:' + this.elm.offset().left + 'px;top:' + (this.elm.offset().top + this.elm.height() + 5) + 'px;">');
        this.autoprompting_ul = $('<ul class="prompting_ul">');
        this.autoprompting.html(this.autoprompting_ul);
        this.settings = $.extend({}, this.defaults, opts);
        var str = '';
        for (var must in this.settings.mustData) {
            str += this.settings.mustData[must] + '/';
        }
        this.settings.mustData = str.substr(0, str.lastIndexOf('/'));
        // console.log(this.settings.params);
    };
    autoprompting.prototype = {
        init: function () {
            var _this = this,
                otherElm = $(this.settings.otherElm);

            this.elm.unbind().bind('keyup click', function (event) {
                _this.keywords = _this.elm.val().replace(/<.[^<>]*?>|\s/g, "");
                if (_this.keywords == '') {
                    return _this.autoprompting && _this.autoprompting.hide();
                }
                // _this.searchValue = _this.keywords; // 记录用户输入的数据
                if (event.keyCode == 40 || event.keyCode == 38 || event.keyCode == 13 || _this.keywords == '') { return; }
                _this.searchElmType = 'auto';
                _this.search();
            });
            // 如果指定了其他对象，则添加click事件，与回车事件相同
            if (otherElm.length) {
                otherElm.bind('click', function () {
                    _this.keywords = _this.elm.val().replace(/<.[^<>]*?>|\s/g, "");
                    if (_this.keywords != '') {
                        _this.searchElmType = 'object';
                        _this.search();
                    }
                });
            }
        },
        /**
         * ajax请求
         */
        search: function () {
            //console.log(_this.keywords)
            var _this = this;
            this.settings.timer && clearTimeout(this.settings.timer);
            // ajax请求
            this.settings.timer = setTimeout(function () {
                if (_this.settings.getType == 'remote') {
                    // 远程请求
                    $.ajax({
                        type: _this.settings.type,
                        dataType: _this.settings.dataType,
                        url: _this.settings.url + encodeURIComponent(_this.settings.mustData) + '/' + encodeURIComponent(_this.keywords),
                        data: _this.settings.params,
                        beforeSend: function (request) { },
                        async: _this.settings.async || true,
                        success: function (data) {
                            _this.dataResult = data.data; // 存储数据length
                            if (!_this.dataResult) {
                                layer.msg(data.msg);
                                return;
                            }
                            // 存在数据则显示数据列表
                            if (_this.dataResult.length) {
                                _this.createElment(_this.dataResult);
                            } else {
                                $('div[data-type="autoprompting"]').remove();
                            }
                            clearTimeout(_this.settings.timer);
                            // _this.settings.callBack&&_this.settings.callBack(_this.dataResult);
                        },
                        error: function (e) { }
                    });
                } else {
                    // 静态资源请求
                    _this.createElment(_this.settings.staticData);
                }
            }, _this.settings.time || 200);
        },
        /**
         * 生成dom
         */
        createElment: function (datalist) {
            var _this = this,
                html = '',
                alis = '';
            if (_this.settings.getType == 'remote') {
                // console.log(datalist.length)
                // 远程资源
                if (datalist.length == 1) {
                    html += this.settings.render && this.settings.render(datalist[0], 1);
                } else {
                    for (var i = 0; i < datalist.length; i++) {
                        // html += '<li data-districtname="'+datalist[i].districtName+'" data-keywords="'+datalist[i].residentialName+'">'+datalist[i].residentialName+'<span>'+datalist[i].districtName || ""+'</span></li>';
                        html += this.settings.render && this.settings.render(datalist[i], datalist.length);
                    }
                }
            } else {
                // 筛选静态资源
                var tempArr = [];
                for (var i = 0; i < datalist.length; i++) {
                    if (datalist[i].cityName.indexOf(_this.keywords) != -1 || datalist[i].cityNameEn.indexOf(_this.keywords) != -1 || datalist[i].spellingAlphabet.indexOf(_this.keywords) != -1) {
                        tempArr.push(datalist[i]);
                    }
                }
                for (var i = 0; i < tempArr.length; i++) {
                    html += this.settings.render && this.settings.render(tempArr[i]);
                }
            }

            if ($('div[data-type="autoprompting"]').length) {
                this.autoprompting_ul.html(html);
            } else {
                for (var key in this.settings.style) {
                    this.autoprompting.css(key, this.settings.style[key]);
                }
                this.autoprompting_ul.html(html);
                $('body').append(this.autoprompting);
            }
            var children = this.autoprompting_ul.children();
            // object对象点击
            if (this.searchElmType == 'object' && html != '') {
                return this.enterEvent(children);
            }
            //点击li
            children.each(function (idx, elm) {
                $(elm).html($(elm).html().replace(new RegExp(_this.keywords, 'g').exec($(elm).text()), '<strong>' + _this.keywords + '</strong>'))
                    .unbind('click').bind('click', function () {
                        if ($(this).hasClass('disabled')) return; // 禁用不能点击
                        $(this).addClass('active').siblings().removeClass('active');
                        _this.elm.val($(this).data().keywords);
                        _this.enterEvent(children);
                    });
            });
            if (html != '') {
                this.autoprompting.show().css({
                    left: _this.elm.offset().left + 'px',
                    top: _this.elm.offset().top + this.elm.height() + 5 + 'px',
                    height: 'auto',
                    display: 'block'
                });
            } else {
                this.autoprompting.hide();
            }
            yf.scroll({ elmId: '.autoprompting' });
            this.watchkeyboard();
            this.stopPropagation();
        },
        enterEvent: function (children) {
            var _this = this, active_elm = this.autoprompting_ul.children('.active');
            // this.autoprompting&&_this.autoprompting.remove();
            $('div[data-type="autoprompting"]').length && $('div[data-type="autoprompting"]').remove();
            var dataLen = 0;
            if (_this.settings.getType == 'remote') {
                // 远程资源    
                dataLen = _this.dataResult.length;
            } else {
                // 静态资源
                dataLen = _this.autoprompting_ul.children().not('.disabled').length;
            }
            if (active_elm.length > 0) {
                return this.settings.enter && this.settings.enter(active_elm.data(), '', dataLen, this.keywords);
            } else {
                // 没有选中数据时返回第一条数据 这个时候需要弹窗
                return this.settings.enter && this.settings.enter(children.eq(0).data(), this.keywords, dataLen, this.keywords);
            }
        },
        /**
         * 监听键盘事件
         */
        watchkeyboard: function () {
            /**
             * 通过键盘上下键控制搜索框内的值
             */
            var _this = this,
                currentElm = null,
                searchListIndex = -1;
            var keyDownChange = function (index) {
                currentElm = _this.autoprompting_ul.children().eq(index);
                currentElm.addClass('active').siblings().removeClass('active');
                _this.elm.val(currentElm.data().keywords).blur();  // 是否有必要监听键盘上下按键来选中数据
            };
            /**
             * 键盘事件控制上下选中搜索框中的数据
             */
            $(document).unbind('keydown').bind('keydown', function (event) {
                var keyCode = event.keyCode;
                var children = _this.autoprompting_ul.children().not('.disabled');
                if (_this.autoprompting.is(":visible") && children.length > 0) {
                    var len = children.length;
                    switch (keyCode) {
                        case 40:
                            // 向下
                            searchListIndex++;
                            if (searchListIndex > len - 1) { searchListIndex = 0; }
                            keyDownChange(searchListIndex);
                            break;
                        case 38:
                            // 向上
                            searchListIndex--;
                            if (searchListIndex < 0) { searchListIndex = len - 1; }
                            keyDownChange(searchListIndex);
                            break;
                        case 13:
                            // 开始搜索
                            _this.enterEvent(children);
                            break;
                    }
                }
            });
        },
        stopPropagation: function () {
            var _this = this;
            this.autoprompting.click(function (event) {
                event.stopPropagation();
                event.preventDefault();
            });
            this.elm.unbind('click').bind('click', function (event) {
                _this.keywords = _this.elm.val().replace(/<.[^<>]*?>|\s/g, "");
                if (_this.keywords == '') {
                    return _this.autoprompting && _this.autoprompting.hide();
                }
                if (_this.autoprompting.length && _this.autoprompting_ul.children().length) {
                    // 重新搜索
                    _this.searchElmType = 'auto';
                    _this.search();
                }
                event.stopPropagation();
                event.preventDefault();
            });
            // 路径跳转时清除autoprompting
            $('a[href]').click(function () {
                $('div[data-type="autoprompting"]').length && $('div[data-type="autoprompting"]').remove();
            });
            $(document).click(function (e) {
                if (!_this.autoprompting.length) return;
                _this.autoprompting.hide();
            });
        }
    }
    $.fn.autoprompting = function (options) {
        var prompting = new autoprompting(this, options);
        return prompting.init();
    };
})(jQuery, window, document);

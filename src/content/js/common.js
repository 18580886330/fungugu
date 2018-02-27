~ function (w) {
    w.yf = {
        setItem: function (key, value) {
            return localStorage.setItem(key, encodeURIComponent(typeof value == "object" ? JSON.stringify(value) : String(value)));
        },
        getItem: function (key) {
            if (typeof decodeURIComponent(localStorage.getItem(key)).match(/\{/)) {
                return JSON.parse(decodeURIComponent(localStorage.getItem(key)));
            }
            return decodeURIComponent(localStorage.getItem(key));
        },
        removeItem: function (key) {
            if (!localStorage.getItem(key)) {
                return false;
            }
            return !localStorage.removeItem(key);
        },
        isIe: function () {
            return navigator.userAgent.toLowerCase().indexOf("msie") >= 0;
        },
        // 针对ie转json对象
        jsonParse: function (object) {
            return this.isIe() ? JSON.parse(decodeURIComponent(JSON.stringify(object))) : object;
        }
    };

    /**
     * 读取缓存用户信息
     */
    yf.userInfo = yf.getItem('userInfo');
    $('#userName').append(yf.userInfo.userName);
    $('#cityLink').find('.name').text(yf.userInfo.city);

    /**
     * 权限控制,获取权限列表
     */
    $.ajax({
        type: 'get',
        url: '/api/v1/moduleAuthority/' + encodeURIComponent(yf.userInfo.city),
        dataType: 'json',
        async: false,
        success: function (data) {
            // console.log(data);
            if (!data || !data.data) {
                return layer.msg(data.msg);
            }
            var data = yf.jsonParse(data.data);
            // 存储模块列表
            yf.layoutData = data.otherModule;
            // 树型模块列表
            yf.treeModuleData = data.treeModule;
            // console.log( JSON.stringify( yf.layoutData ) )
        }, error: function (e) {
            // console.log(e)
        }
    });

    /*
     * 让浏览器原生支持placeholder
     * initPlaceHolders => input placeholder
     * */
    yf.placeholder = function () {
        if ('placeholder' in document.createElement('input')) { //如果浏览器原生支持placeholder
            return;
        }

        function target(e) {
            var e = e || window.event;
            return e.target || e.srcElement;
        };

        function _getEmptyHintEl(el) {
            var hintEl = el.hintEl;
            return hintEl && g(hintEl);
        };

        function blurFn(e) {
            var el = target(e);
            if (!el || el.tagName != 'INPUT' && el.tagName != 'TEXTAREA') return; //IE下，onfocusin会在div等元素触发
            var emptyHintEl = el.__emptyHintEl;
            if (emptyHintEl) {
                //clearTimeout(el.__placeholderTimer||0);
                //el.__placeholderTimer=setTimeout(function(){//在360浏览器下，autocomplete会先blur再change
                if (el.value) emptyHintEl.style.display = 'none';
                else emptyHintEl.style.display = '';
                //},600);
            }
        };

        function focusFn(e) {
            var el = target(e);
            if (!el || el.tagName != 'INPUT' && el.tagName != 'TEXTAREA') return; //IE下，onfocusin会在div等元素触发
            var emptyHintEl = el.__emptyHintEl;
            if (emptyHintEl) {
                //clearTimeout(el.__placeholderTimer||0);
                emptyHintEl.style.display = 'none';
            }
        };
        if (document.addEventListener) { //ie
            document.addEventListener('focus', focusFn, true);
            document.addEventListener('blur', blurFn, true);
        } else {
            document.attachEvent('onfocusin', focusFn);
            document.attachEvent('onfocusout', blurFn);
        }
        var elss = [document.getElementsByTagName('input'), document.getElementsByTagName('textarea')];
        //alert(elss.length+'===aaaaa');
        for (var n = 0; n < 2; n++) {
            var els = elss[n];
            for (var i = 0; i < els.length; i++) {
                var el = els[i];
                var placeholder = el.getAttribute('placeholder'),
                    emptyHintEl = el.__emptyHintEl;
                if (emptyHintEl && el.value) {
                    emptyHintEl.style.display = 'none';
                } else if (emptyHintEl && !el.value) {
                    emptyHintEl.style.display = 'block';
                }
                if (placeholder && !emptyHintEl) {
                    emptyHintEl = document.createElement('span');
                    emptyHintEl.innerHTML = placeholder;
                    emptyHintEl.className = 'emptyhint';
                    emptyHintEl.onclick = function (el) {
                        return function () {
                            try {
                                el.focus();
                            } catch (ex) { }
                        }
                    }(el);
                    // if(el.value) emptyHintEl.style.display='none';
                    el.parentNode.style.position = 'relative';
                    if (el.value) {
                        emptyHintEl.style.display = 'none';
                    }
                    el.parentNode.appendChild(emptyHintEl); //.insertBefore(emptyHintEl,el);
                    el.__emptyHintEl = emptyHintEl;

                }
            }
        }
    };

    /**
     * 数组扩展方法
     */
    Array.prototype.indexOf = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    }
    // 删除数组中的某个元素
    Array.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
        return this;
    }
    // 数组去重
    Array.prototype.unique = function () {
        this.sort();
        var re = [this[0]];
        for (var i = 1; i < this.length; i++) {
            if (this[i] !== re[re.length - 1]) {
                re.push(this[i]);
            }
        }
        return re;
    }

    /**
     * 动态加载css
     * @param {[string]} url    [文件相对路径]
     * @param {[dom]} content   [指定存放文件的容器#id，默认head]
     * @param {[type]} callBack [description]
     */
    var loadFile = function () {
        this.name = ''; // 占个位置（...）
    }
    loadFile.prototype.init = function (url, callBack) {
        var _this = this;
        var tempUrl = url.split('/');
        // 文件后缀名
        var fileType = tempUrl[tempUrl.length - 1].substring(tempUrl[tempUrl.length - 1].lastIndexOf('.'));
        // 文件名称
        this.fileName = tempUrl[tempUrl.length - 1].substring(0, tempUrl[tempUrl.length - 1].lastIndexOf('.'));
        /**
         * 比较文件存在的情况不重复添加文件
         */
        if (fileType == '.css') {
            var target = document.createElement("link");
            target.setAttribute("rel", "stylesheet");
            target.setAttribute("type", "text/css");
            target.setAttribute("href", url);
            target.setAttribute("data-href", this.fileName);
            var temp = true;
            $("link[data-href]").each(function (i, elm) {
                if ($(elm).attr('data-href') == _this.fileName) {
                    temp = true;
                    // return;
                    // $($("link[data-href='"+_this.fileName+"']")).remove();
                } else {
                    temp = true;
                    document.getElementsByTagName("head")[0].appendChild(target);
                }
            });
            if (!temp) {
                document.getElementsByTagName("head")[0].appendChild(target);
            }
            callBack && callBack();
        } else if (fileType == '.js') {
            var target = document.createElement("script");
            target.setAttribute("charset", "utf-8");
            target.setAttribute("type", "text/javascript");
            target.setAttribute("src", url);
            target.setAttribute("data-href", this.fileName);
            // 是否根据指定的容器来加载script
            $("script[data-href]").each(function (i, elm) {
                if ($(elm).attr('data-href') == _this.fileName) {
                    $($("script[data-href='" + _this.fileName + "']")).remove();
                }
            });
            if (typeof (callBack) != "undefined") {
                if (target.readyState) {
                    target.onreadystatechange = function () {
                        if (target.readyState == "loaded" || target.readyState == "complete") {
                            target.onreadystatechange = null;
                            callBack();
                        }
                    }
                } else {
                    target.onload = function () {
                        callBack();
                    };
                }
            }
            document.body.appendChild(target);

            //document.getElementsByTagName("head")[0].appendChild(target);
        }
        //callBack&&callBack();
    }

    /**
     * 路由切换时添加导航选中状态.active
     * 描述: 目前暂定头部导航和左侧导航的选中状态
     */
    var runNavActive = function () {
        var oHead = $('#header'),
            oNavTree = $('#navTree'),
            aA = oHead.find('a[data-href]'),
            aNavTrees = oNavTree.find('a[data-href]'),
            aLinks = [];
        // 头部导航
        aA.each(function (idx, elm) {
            aLinks.push($(elm));
        });
        // 左侧导航
        aNavTrees.each(function (idx, elm) {
            aLinks.push($(elm));
        });
        // 处理状态
        for (var i = 0; i < aLinks.length; i++) {
            try {
                var sHref = $(aLinks).eq(i)[0].data().href; // 出现多个地址跳的情况
                $(aLinks).eq(i)[0].removeClass('active');
                if (location.href.match(sHref)) {
                    $(aLinks).eq(i)[0].addClass('active');
                    $(aLinks).eq(i)[0].parent().parent().prev('.lead').addClass('activity');
                    continue;
                }
                //初始化页面时，默认给第一个加上颜色
                if (location.href.indexOf('layout') > -1 || location.href.indexOf('houseValuation') > -1) {
                    $(aLinks).eq(0)[0].parent().parent().prev('.lead').addClass('activity');
                }
            } catch (e) {
                // console.log(e)
            }
        }
    };

    /**
     * 根据路由地址匹配标题
     */
    yf.matchTitle = function (key) {
        var match = {
            'houseValuation': '房产估值',
            'layout': '房产估值',
            'valuationRecord': '估值记录',
            'auditPriceRecord': '核价记录',
            'personalData': '基本资料',
            'accountManagement': '账号管理',
            'jurisdictionManagement': '权限管理',
            'moduleExplain': '应用说明'
        }
        document.title = match[key];
    }

    /**
     * 匹配路由地址
     */
    yf.matchRouter = function (str) {
        return !str ? location.href.match(/.*\/([^?]*)/)[1] : str.match(/.*\/([^?]*)/)[1];
    }

    /**
     * 路由
     */
    var Path = {
        version: "1.0.0",
        map: function (path) {
            var path = path.split("?")[0];
            if (Path.routes.defined.hasOwnProperty(path)) {
                return Path.routes.defined[path];
            } else {
                return new Path.core.route(path);
            }
        },
        load: function (elm, config) {
            if (!config.reload) {
                // 是否需要重新加载组件，默认不需要重新加载 reload: boolean
                if ($(elm).attr('data-refresh')) return;
            }
            var script = document.createElement('script');
            script.type = 'type/javascript';
            script.src = config.controllerUrl;
            $(elm).attr('data-refresh', 'true').html($.ajax({ url: config.templateUrl, async: false }).responseText).append(script);
            return this;
        },
        root: function (path) {
            Path.routes.root = path;
        },
        rescue: function (fn) {
            Path.routes.rescue = fn;
        },
        history: {
            initial: {},
            pushState: function (state, title, path) {
                if (Path.history.supported) {
                    if (Path.dispatch(path)) {
                        history.pushState(state, title, path);
                    }
                } else {
                    if (Path.history.fallback) {
                        window.location.hash = "#" + path;
                    }
                }
            },
            popState: function (event) {
                var initialPop = !Path.history.initial.popped && location.href == Path.history.initial.URL;
                Path.history.initial.popped = true;
                if (initialPop) return;
                Path.dispatch(document.location.pathname);
            },
            listen: function (fallback) {
                Path.history.supported = !!(window.history && window.history.pushState);
                Path.history.fallback = fallback;

                if (Path.history.supported) {
                    Path.history.initial.popped = ('state' in window.history), Path.history.initial.URL = location.href;
                    window.onpopstate = Path.history.popState;
                } else {
                    if (Path.history.fallback) {
                        for (route in Path.routes.defined) {
                            if (route.charAt(0) != "#") {
                                Path.routes.defined["#" + route] = Path.routes.defined[route];
                                Path.routes.defined["#" + route].path = "#" + route;
                            }
                        }
                        Path.listen();
                    }
                }
            }
        },
        match: function (path, parameterize) {
            var params = {},
                route = null,
                possible_routes, slice, i, j, compare;
            for (route in Path.routes.defined) {
                if (route !== null && route !== undefined) {
                    route = Path.routes.defined[route];
                    possible_routes = route.partition();
                    for (j = 0; j < possible_routes.length; j++) {
                        slice = possible_routes[j];
                        compare = path;
                        if (slice.search(/:/) > 0) {
                            for (i = 0; i < slice.split("/").length; i++) {
                                if ((i < compare.split("/").length) && (slice.split("/")[i].charAt(0) === ":")) {
                                    params[slice.split('/')[i].replace(/:/, '')] = compare.split("/")[i];
                                    compare = compare.replace(compare.split("/")[i], slice.split("/")[i]);
                                }
                            }
                        }
                        if (slice === compare.split("?")[0]) {
                            if (parameterize) {
                                route.params = params;
                            }
                            return route;
                        }
                    }
                }
            }
            return null;
        },
        dispatch: function (passed_route) {
            var previous_route, matched_route;
            if (Path.routes.current !== passed_route) {
                Path.routes.previous = Path.routes.current;
                Path.routes.current = passed_route;
                matched_route = Path.match(passed_route, true);

                if (Path.routes.previous) {
                    previous_route = Path.match(Path.routes.previous);
                    if (previous_route !== null && previous_route.do_exit !== null) {
                        previous_route.do_exit();
                    }
                }

                if (matched_route !== null) {
                    matched_route.run();
                    return true;
                } else {
                    if (Path.routes.rescue !== null) {
                        Path.routes.rescue();
                    }
                }
            }
        },
        listen: function () {
            var fn = function () {
                Path.dispatch(location.hash);
            }
            if (location.hash === "") {
                if (Path.routes.root !== null) {
                    location.hash = Path.routes.root;
                }
            }

            if ("onhashchange" in window && (!document.documentMode || document.documentMode >= 8)) {
                window.onhashchange = fn;
            } else {
                setInterval(fn, 50);
            }

            if (location.hash !== "") {
                Path.dispatch(location.hash);
            }
        },
        core: {
            route: function (path) {
                this.path = path;
                this.action = null;
                this.do_enter = [];
                this.do_exit = null;
                this.params = {};
                Path.routes.defined[path] = this;
            }
        },
        routes: {
            'current': null,
            'root': null,
            'rescue': null,
            'previous': null,
            'defined': {}
        }
    };
    Path.core.route.prototype = {
        to: function (config) {
            this.action = function () {
                if (!config) return;
                $("div[show-view]").html($.ajax({ url: config.templateUrl, async: false }).responseText);
                yf.matchTitle(yf.matchRouter());
                yf.loadFile(config.controllerUrl);
                yf.placeholder();
                yf.runNavActive();
                yf.mainScroll.init();
            };
            return this;
        },
        enter: function (fns) {
            if (fns instanceof Array) {
                this.do_enter = this.do_enter.concat(fns);
            } else {
                this.do_enter.push(fns);
            }
            return this;
        },
        exit: function (fn) {
            this.do_exit = fn;
            return this;
        },
        partition: function () {
            var parts = [],
                options = [],
                re = /\(([^}]+?)\)/g,
                text, i;
            while (text = re.exec(this.path)) {
                parts.push(text[1]);
            }
            options.push(this.path.split("(")[0]);
            for (i = 0; i < parts.length; i++) {
                options.push(options[options.length - 1] + parts[i]);
            }
            return options;
        },
        run: function () {
            var halt_execution = false,
                i, result, previous;
            if (Path.routes.defined[this.path].hasOwnProperty("do_enter")) {
                if (Path.routes.defined[this.path].do_enter.length > 0) {
                    for (i = 0; i < Path.routes.defined[this.path].do_enter.length; i++) {
                        result = Path.routes.defined[this.path].do_enter[i].apply(this, []);
                        if (result === false) {
                            halt_execution = true;
                            break;
                        }
                    }
                }
            }
            if (!halt_execution) {
                Path.routes.defined[this.path].action();
            }
        }
    };

    /**
     * 获取url参数的值
     */
    var GetParameterByName = function (name) {
        var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.href);
        return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

    /**
     * 下拉菜单
     */
    var MenuDown = function () {
        this.setings = {
            timer: null,
            node: '',
            showNode: '',
            callBack: function () { }
        }
    };
    MenuDown.prototype = {
        init: function (opts) {
            $.extend(this.setings, opts || {});
            var _this = this;
            var node = this.setings.node;
            var showNode = this.setings.showNode;
            var callBack = this.setings.callBack;

            node.each(function (idx, elm) {
                $(elm).hover(function () {
                    if (!$(showNode).length) return;
                    if (showNode.selector == "#non_competition") {
                        _this.autoSeat(elm);
                    }
                    _this.show(showNode);
                }, function () {
                    if (!$(showNode).length) return;
                    _this.hide(showNode);
                });
            });
            showNode.hover(function () {
                _this.show(showNode);
            }, function () {
                _this.hide(showNode);
            });
        },
        show: function (elm, callBack) {
            this.setings.node.addClass('on');
            this.setings.showNode.addClass('on');
            this.timer && clearTimeout(this.timer); elm.stop(true, true).show();
            this.setings.callBack && this.setings.callBack();
        },
        hide: function (elm) {
            var _this = this;
            this.timer = setTimeout(function () { elm.stop(true, true).hide(); _this.setings.node.removeClass('on'); _this.setings.showNode.removeClass('on'); clearTimeout(this.timer) }, 200);
        },
        /*对于竞价模块进行特殊处理*/
        autoSeat: function (elm) {
            var disY = $(elm).position().top;
            var oH = $(elm).height();
            var disX = $(elm).position().left;
            $('#non_competition').css({
                'top': disY - oH + 'px',
                'left': disX + 'px'
            })
        }
    };

    /**
     * 选项卡
     */
    var tab = function () {
        this.setings = {
            tabId: "",
            contents: "",
            offset: "" // opacity
        }
        if (this.setings.tabId == "") return;
    }
    tab.prototype.init = function (opts, ind) {
        var _this = this;
        var ind = ind || 0;
        $.extend(this.setings, opts || {});
        this.setings.index = ind || 0;
        if (!$(this.setings.tabId)) {
            return;
        }
        this.childNode = $(this.setings.tabId).children();
        this.childPanel = $(this.setings.contents).children();
        $(this.childNode).each(function (idx, elm) {
            $(elm).attr('data-id', idx);
            $(elm).unbind().bind('click', function () {
                _this.changeTab($(this), idx, $(this).text());
            });
        });
        if (!this.childNode.hasClass('active')) {
            this.childNode.eq(ind).addClass('active').siblings().removeClass('active');
            this.childPanel.eq(ind).show().siblings().hide();
            this.setings.callBack && this.setings.callBack();
        } else {
            var elm = $(this.setings.tabId).children('.active');
            _this.changeTab($(elm), $(elm).attr('data-id'), $(elm).text());
        }
        this.setings.text = $(this.childNode).eq(ind).text();
        return this.setings;
    };
    tab.prototype.changeTab = function (obj, index, text) {
        var _this = this;
        $(this.childNode).removeClass('active');
        $(obj).addClass('active');
        if (_this.setings.offset == 'opacity') {
            $(this.childPanel).eq(index).removeClass('none').show().siblings().addClass('none').hide();
        } else {
            $(this.childPanel).eq(index).show().siblings().hide();
        }
        this.setings.index = index;
        this.setings.text = text;
        this.setings.callBack && this.setings.callBack();
    }

	/**
	 * 倒计时
	 * 
	 */
    function _timer() { };
    _timer.prototype = {
        _init: function (obj, iNum) {
            this.oSecond = $(obj);
            this.timer = null;
            this.iSecond = 60;
            if (!this.oSecond.length) return;
            this._interval(iNum);
        },
        _interval: function (iNum) {
            var _this = this;
            var isec = iNum ? iNum : _this.iSecond;
            _this.oSecond.addClass("disable");
            this.timer = setInterval(function () {
                _this.oSecond.text(isec <= 10 ? "0" + --isec + "S" : --isec + "S");
                if (isec <= 0) {
                    clearInterval(_this.timer);
                    _this.oSecond.removeClass("disable").text("获取验证码");
                }
            }, 1000);
        }
    };

    /**
     * 主体内容部分滚动条
     */
    yf.mainScroll = function () {
        var mainHei = '';
        return {
            init: function () {
                this.oContentBody = $("div[show-view]");
                this.oScrollWamp = $("#scrollWamp");
                this.resize();
                this.scroll();
                return this;
            },
            resize: function () {
                var _this = this;
                mainHei = $(window).height() - $('.header').height();
                _this.oContentBody.css({
                    height: mainHei
                });
                if ($(window).width() <= 1200) {
                    _this.oContentBody.css('width', '990px');
                    $('body').addClass('hidden');
                }
                $(window).resize(function () {
                    yf.autopromptingAlign(); // 控制下拉框的位置
                    mainHei = $(window).height() - $('.header').height();
                    _this.oContentBody.css({
                        width: 'auto',
                        height: mainHei
                    });
                    _this.oScrollWamp.css({
                        height: mainHei
                    });
                    $('body').removeClass('hidden');
                    if ($(window).width() <= 1200) {
                        _this.oContentBody.css('width', '990px');
                        $('body').addClass('hidden');
                    }
                });
            },
            scroll: function () {
                if (!this.oScrollWamp.length) return;
                this.oScrollWamp.mCustomScrollbar({
                    setHeight: mainHei,
                    scrollInertia: 180,
                    theme: "minimal-dark",
                    axis: "y",
                    alwaysShowScrollbar: 2,
                    callbacks: {
                        whileScrolling: function () {
                            // 检测是否有下拉检索框显示
                            yf.autopromptingAlign();
                            // 检测是否有loading状态
                            if ($('div[data-type="loading"]').is(':visible')) {
                                var ld = function () {
                                    var loading_div = $('div[data-type="loading"]');
                                    loading_div.each(function (idx, elm) {
                                        var loading_id = $(elm).attr('data-id'),
                                            e = $('#' + loading_id);
                                        $(elm).css({ top: e.offset().top, left: e.offset().left, width: e.outerWidth(), height: e.outerHeight() });
                                    });
                                }
                                ld(), $(window).resize(ld);
                            }
                            //滚动的时候 竞价模块的提示 隐藏
                            if ($('#non_competition').length) {
                                $('#non_competition').hide();
                            }
                        }
                    }
                });
            },
            // 停止滚动
            stopMainScroll: function () {
                this.oScrollWamp.mCustomScrollbar("disable");
            },
            // 开始或更新滚动
            updateMainScroll: function () {
                this.oScrollWamp.mCustomScrollbar("update");
            }
        }
    }();

    // 窗体改变时将下拉检索框对齐
    yf.autopromptingAlign = function () {
        if (!$('div[data-type="autoprompting"]').is(':visible')) return;
        var autoprompting = $('div[data-type="autoprompting"]'),
            inputElm = $('#' + autoprompting.data().elmid);
        autoprompting.css({ top: inputElm.offset().top + inputElm.height() + 5 + 'px', left: inputElm.offset().left });
    }


    // 生成(适合)选项卡模块容器生成
    yf.tabInit = function (id, json) {
        var oHouseReference = $(id),
            oTabTitle = oHouseReference.find('.layui-tab-title'),
            oTabContent = oHouseReference.find('.layui-tab-content'),
            tHtml = '',
            bHtml = '',
            tClass = 'layui-this',
            bClass = 'layui-tab-item layui-show';
        for (var i = 0; i < json.length; i++) {
            if (i == 0) {
                // 默认选中第一条
                tHtml += '<li data-module="' + json[i].nameEn + '" class="' + tClass + '">' + json[i].nameZn + '</li>';
                bHtml += '<div id="' + json[i].nameEn + '" class="' + bClass + '"><div class="loading"><img src="src/content/js/third/layer/css/modules/layer/default/loading-2.gif">正在加载...</div></div>';
            } else {
                tHtml += '<li data-module="' + json[i].nameEn + '">' + json[i].nameZn + '</li>';
                bHtml += '<div id="' + json[i].nameEn + '" class="layui-tab-item"><div class="loading"><img src="src/content/js/third/layer/css/modules/layer/default/loading-2.gif">正在加载...</div></div>';
            }
        }
        oTabTitle.html(tHtml);
        oTabContent.html(bHtml);
    }

    // loading加载
    yf.loading = function (elm) {
        if ($('div[data-id="' + $(elm).attr('id') + '"]').length) return;
        var elm = $(elm), loading = $('<div class="loading" data-type="loading" data-id="' + elm.attr('id') + '" style="position:absolute;width:100%;height:100%;left:0;top:0;line-height:100%;background-color:#fff;background-color:rgba(255,255,255,.5);filter:alpha(opacity=50);z-index: 99999999;">\
        <div style="position:absolute;top:50%;width: 100%;line-height: 25px;color:#333">\
        <img src="src/content/js/third/layer/css/modules/layer/default/loading-2.gif" class="mCS_img_loaded">正在加载...</div></div>');
        loading.css({
            /* left: elm.offset().left + 'px',
            top: elm.offset().top + 'px', */
            width: elm.outerWidth(),
            height: elm.outerHeight()
        });
        $(elm).addClass('pv').append(loading);
    }

    // loading移除
    yf.removeLoading = function (elm) {
        $(elm).removeClass('pv');
        $('div[data-id="' + $(elm).attr('id') + '"]').remove();
    };

    // 错误信息提示
    yf.msg = function (data) {
        return data.code != '200' ? !layer.msg(data.msg) : 1;
    }

    /**
     * 匹配权限模块
     */
    yf.matchModule = function (moduleNames, callBack) {
        try {
            var arr = [];
            for (var i = 0; i < moduleNames.length; i++) {
                for (var j = 0; j < yf.layoutData.length; j++) {
                    if (moduleNames[i].indexOf(yf.layoutData[j].nameEn) != -1 && yf.layoutData[j].cityAuthority == yf.userInfo.city) {
                        arr.push(yf.layoutData[j]);
                    }
                }
            }
        } catch (e) {
            //console.log(e)
        }
        return callBack ? callBack(arr) : arr;
    }


    /**
     * 美化滚动条
     */
    var Scroll = function (config) {
        var elm = $(config.elmId);
        elm.mCustomScrollbar("destroy"); // 先销毁
        elm.mCustomScrollbar({
            setHeight: config.height || elm.outerHeight(),
            scrollInertia: 180,
            theme: "minimal-dark",
            axis: "y"
        });
    };

    /**
     * 替换特殊字符
     */
    var ReplaceHtml = function (value) {
        return value.replace(/<.[^<>]*?>|\s/g, "");
    }

    /**
     * 处理空字符
     */
    var FilterStr = function (str) {
        if (str == "0") {
            return str;
        }
        if (str == undefined || str == null || str == "" || str == "请选择") {
            str = '--'
        };
        return str;
    }

    /**
     * 时间戳转为标准时间
     */
    var DateStampFn = function (tm) {
        if (tm == "--") return tm;
        var tt = new Date(parseInt(tm)),
            year = tt.getFullYear(),
            month = tt.getMonth() + 1,
            day = tt.getDate();
        return year + "-" + month + "-" + day;
    };
    /**
	 * 限制文本框出入长度(例:'<input class="input" length='60' onkeyup="limitLength(this)" name="keHuDanWei" type="text" placeholder="请输入所属单位"/>')
	 * 须有 length说明长度
	 **/
    var limitLength = function (obj) {
        var text = $(obj).parent().siblings().text();
        if (text.indexOf('：') > 0) {
            text = text.substr(0, text.indexOf('：'));
        }
        var length = $(obj).attr('length');
        var val = $(obj).val();
        var size = val.length;
        if (size > length) {
            val = val.substr(0, length);
            $(obj).val(val);
            layer.tips(text + "不能超过" + length + "个字符", obj, { tips: [1, '#666'], time: 4000 });
        }
    };


    /**
     * 切换城市时更新用户切换的城市
     */
    yf.updataCity = function (cityName) {
        yf.setItem('userInfo', {
            city: cityName,
            userName: yf.userInfo.userName,
        });
        yf.userInfo.city = cityName;
        $('#cityLink').find('.name').text(cityName);
    }


    /**
     * 限制字符数
     */
    yf.limitStr = function (textId, hintId, len) {
        var oTextId = $(textId),
            oHintId = $(hintId),
            textVal;
        oHintId.text(len - oTextId.val().length);
        oTextId.on('keyup', function () {
            textVal = $(this).val();
            rLen = len - textVal.length;
            if (rLen <= 0) {
                oTextId.val(oTextId.val().substring(0, len));
                rLen = 0;
            }
            oHintId.text(rLen);
        });
    };

    /**
     * 截取字符数
     */
    yf.subStr = function (strs, len) {
        return strs != null ? (strs.length <= len ? strs : strs.substring(0, len) + "...") : '';
    };

    /**
     *估值结果展示
     */
    yf.priceTypeShow = {
        '0': '市场评估价',
        '1': '抵押评估价',
        '2': '自定义抵押评估价'
    };

	/**
	 *一般的正则校验 
	 */
    yf.REGS = {
        PASS_WORLD: /(?!.*[\u4E00-\u9FA5\s])(?!^[a-zA-Z]+$)(?!^[\d]+$)(?!^[^a-zA-Z\d]+$)^.{8,16}$/ //密码长度8-16位,须为字母、数字和符号两种及以上的组合
    };


    /**
     * 默认初始化方法
     */
    w.onload = function () {
        // 统一下拉菜单
        //yf.menuDown({node:$('#userCenter'),showNode:$('.drop-nav').find('.drop-nav-child')});
    }

    var oTab,
        oLoadFile,
        oMenuDown;
    // 路由
    yf.path = Path;
    // 选项卡
    yf.tab = function (obj, ind) {
        return oTab ? oTab.init(obj, ind) : (oTab = new tab).init(obj, ind);
    }
    // 加载css/js
    yf.loadFile = function (url, type) {
        return oLoadFile ? oLoadFile.init(url, type) : (oLoadFile = new loadFile).init(url, type);
    };
    // 下拉菜单
    yf.menuDown = function (opts) {
        return oMenuDown ? oMenuDown.init(opts) : (oMenuDown = new MenuDown).init(opts);
    };
    // 获取url参数的值
    yf.param = function (name) {
        return GetParameterByName(name);
    };
    // 导航切换状态改变
    yf.runNavActive = function () {
        return runNavActive();
    };
    // 停止滚动
    yf.stopMainScroll = function () {
        return yf.mainScroll.stopMainScroll();
    }
    // 更新滚动
    yf.updateMainScroll = function () {
        return yf.mainScroll.updateMainScroll();
    }
    // 美化滚动条
    yf.scroll = function (config) {
        return Scroll(config);
    };
    yf.replaceHtml = function (val) {
        return ReplaceHtml(val);
    };
    //字符串
    yf.filterStr = function (val) {
        return FilterStr(val);
    };
    //时间戳转化
    yf.dateStampFn = function (tm, mon) {
        return DateStampFn(tm, mon);
    };
    //倒计时
    yf._timer = function (obj, num) {
        return new _timer()._init(obj, num);
    };
    yf.limitLength = function (obj) {
        return limitLength(obj);
    }
    return yf;
}(window);

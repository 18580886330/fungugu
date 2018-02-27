require([
    'src/components/city/js/city.server.js',
    'src/components/feedBack/js/feedBack.server.js'
], function (cityServer, feedBackServer) {
    /**
     * 权限模块加载
     */
    var jurisdiction = ({
        init: function () {
            this.authorFlag = false;  //是否有人工核价的权限
            this.leftModules();
        },
        // 头部模块加载
        headerModules: function () {
            return;
            var _this = this,
                oHeaderModule = $('#headerModule'),
                html = '',
                moduleNames = oHeaderModule.data().modules.replace(/[\[\]]/g, '').split(',');
            yf.matchModule(moduleNames, function (data) {
                for (var i = 0; i < data.length; i++) {
                    html += '<a class="link" data-href="' + data[i].nameEn + '" href="javascript:;"><b class="icon ' + data[i].nameEn + '"></b><span>' + data[i].nameZn + '</span></a>';
                }
                // 绑定事件，加载模块
                oHeaderModule.prepend(html).find('a[data-href]').each(function (idx, elm) {
                    $(elm).unbind().bind('click', function () {
                        // console.log( $(this).data().href )
                    });
                });
            });
        },
        // 左侧导航模块
        leftModules: function () {
            var oNavTree = $('#navTree'), _this = this, html = '',
                moduleNames = oNavTree.data().modules.replace(/[\[\]]/g, '').split(',');
            treeIcon = {
                'intelligentSearch': '&#xe62c;',//智能收索
                'recordCenter': '&#xe62e;',// 记录中心
                'organizationalManagement': '&#xe62d;',//机构管理
                'personalCenter': '&#xe62b;',//个人中心
                'moduleAuthority': '&#xe639;'//应用市场
            };
            if (!yf.treeModuleData) return;
            for (var i = 0; i < yf.treeModuleData.length; i++) {
                var data = yf.treeModuleData[i];
                html += '<li class="nav-tree-item">\
                    <a class="link lead" href="javascript:;"><b class="fgg-icon '+ data.info.nameEn + '">' + treeIcon[data.info.nameEn] + '</b><span>' + data.info.nameZn + '</span></a>';
                // 是否有子级
                if (!data.children.length) {
                    continue;
                }
                // 子菜单
                html += '<ul class="nav-tree-child">';
                for (var j = 0; j < data.children.length; j++) {
                    var child = data.children;
                    // 城市不匹配，不拼接
                    if (child[j].cityAuthority != yf.userInfo.city && child[j].usePermission == 'Y') {
                        continue;
                    }
                    // 房产估值特殊处理
                    if (child[j].nameZn == '房产估值') {
                        html += '<li class="nav-tree-item">\
                            <a class="link" data-href="'+ child[i].nameEn + '" href="javascript:;"><b class="icon ' + child[i].nameEn + '"></b><span>' + child[i].nameZn + '</span></a>\
                        </li>';
                    } else {
                        html += '<li class="nav-tree-child">\
                            <a class="link" data-href="'+ child[j].nameEn + '" href="#/' + child[j].nameEn + '"><b class="icon"></b><span>' + child[j].nameZn + '</span></a>\
                        </li>';
                    }
                }
                html += '</ul>';
                html += '</li>';
            }

            // 绑定事件，加载模块
            oNavTree.prepend(html).find('a[data-href]').each(function (idx, elm) {
                $(elm).unbind().bind('click', function () {
                    _this.isHaveNews();
                    oNavTree.find('.lead').removeClass('activity');
                    $(this).parent().parent().prev('.lead').addClass('activity');
                    // console.log( $(this).data().href )
                });
            });
            //主导航收起展开
            oNavTree.find('.lead').click(function () {
                $(this).next().stop(true, true).fadeToggle(200);
            })
            //是否有新消息
            _this.isHaveNews();

            // 房产估值
            $('a[data-href="propertyValuation"],a[data-href="intelligentSearch"]').click(function () {
                if (!yf.param('housingName')) {
                    location.href = '#/layout';
                } else {
                    // location.reload();
                }
            });
            // 绑定导航状态
            yf.runNavActive();
        },
        /**
         * 是否有新消息
         */
        isHaveNews: function () {
            if (!this.authorFlag) {
                for (var i = 0; i < yf.layoutData.length; i++) {
                    // 如果有记录中心模块
                    if (yf.layoutData[i].nameZn == '人工核价' && yf.layoutData[i].cityAuthority == yf.userInfo.city) {
                        this.authorFlag = true;
                        $('#message_box').removeClass('hide');
                    }

                }
            };
            // 是否有消息权限
            if (this.authorFlag) {
                $.ajax({
                    type: "get",
                    url: "/api/v1/artificialNuclearValence/" + yf.userInfo.city + "/newMsgStateGet",
                    success: function (data) {
                        var twinkle = null;
                        if (data.code == '200') {
                            $('#red_dot').removeClass('hide');
                            twinkle = setInterval(function () {
                                $('#red_dot').fadeIn(500).fadeOut(500);
                            }, 1000);
                        } else {
                            $('#red_dot').addClass('hide');
                            if (twinkle != null) clearInterval(twinkle);
                        }
                    }
                });
            };
        }
    }).init();


    /**
     * 城市弹窗
     */
    var cityPop = ({
        data: {
            purchasedProvince: null,    // 已购买按省份数据
            notBurchasedProvince: null, // 未购买按省份数据
            purchasedLetter: null,      // 已购买按字母排序数据
            notPurchasedLetter: null,   // 未购买按字母排序数据
            buyAllData: [],             // 所有购买的城市数据
            notBuyAllData: [],          // 所有未购买的城市数据,
            allData: []                 // 所有城市数据
        },
        init: function () {
            this.cityContent = $('#cityContent');
            this.cityBody = $('#cityLink');
            this.cityName = this.cityBody.find('.name').eq(0);
            this.changeCityBtn = this.cityBody.find('.change-city').eq(0);
            this.loadModules();
            return this;
        },
        // 切换城市时更新城市数据
        updateCityInfo: function (cityName) {
            this.popCityName.text(cityName);
            yf.updataCity(cityName);
            layer.closeAll();
            // 如果是在房产估值页面中切换了城市需要跳转到layout过度页面
            if (yf.matchRouter() == 'houseValuation') {
                location.href = '#/layout';
            }
            location.reload();
        },
        loadModules: function () {
            var _this = this;
            this.changeCityBtn.unbind('click').bind('click', function () {
                yf.path.load("#cityContent", {
                    controllerUrl: 'src/components/city/js/city.controller.js',
                    templateUrl: 'src/components/city/city.html',
                    reload: false // 是否重新加载该组件，默认不重新加载
                });
                layer.open({
                    area: ['560px', ''],
                    type: 1,
                    closeBtn: false,
                    title: false,
                    shade: [.6, '#000'],
                    resize: false,
                    content: _this.cityContent,
                    success: function () {
                        _this.popCityName = $('#popCityName');
                        _this.cityLogs = _this.cityContent.find('.search-logs').eq(0);
                        _this.province = _this.cityContent.find('div[data-sort="province"]');
                        _this.letter = _this.cityContent.find('div[data-sort="letter"]');
                        _this.cityListContent = _this.cityContent.find('.citylist-content').eq(0);
                        _this.aCityList = _this.cityListContent.find('.city-list');
                        _this.popCityName.text(yf.userInfo.city);

                        _this.searchCity(); // 获取城市数据
                        _this.bindEvent();  // 绑定事件交互
                    },
                    end: function () {
                        // 关闭后要做的事情
                        $('#cityContent').hide();
                    }
                });
                yf.scroll({
                    elmId: '#cityScrollContent'
                });
            });
        },
        // 请求城市数据
        searchCity: function () {
            var _this = this;
            cityServer.getCity().success(function (data) {
                var data = data.data;
                // 常用城市城市
                ; (function () {
                    var html = '<span>常用城市：</span>';
                    for (var i = 0; i < data.inCommonUseCity.length; i++) {
                        html += '<a href="javascript:;" class="item">' + data.inCommonUseCity[i].cityName + '</a>';
                    }
                    _this.cityLogs.removeClass('hide').html(html);
                    _this.aLinkCityEvent(_this.cityLogs.find('.item'));
                })();

                _this.saveData(data); // 缓存数据
                _this.buyCityListProvince(data.authorityProvinceCity.purchased); // 默认按已购买按省份排序

                /* _this.notBuyCityListProvince( data.authorityProvinceCity.notPurchased );// 未购买按省份排序
                _this.buyCityListLetter( data.authorityInitialCity.purchased.cityData );// 已购买按字母排序
                _this.notBuyCityListLetter( data.authorityInitialCity.notPurchased.cityData );// 未购买按字母排序 */
            }).error(function (e) { });
        },
        // 缓存数据
        saveData: function (data) {
            var _this = this;
            // 根据按拼音排序数据进行数据验证
            if (this.data.purchasedLetter && this.data.purchasedLetter.length) {
                // 缓存数据，不再重新赋值数据
                return;
            }
            // 存储数据
            this.data.purchasedProvince = data.authorityProvinceCity.purchased;             // 已购买按省份排序
            this.data.notBurchasedProvince = data.authorityProvinceCity.notPurchased;       // 未购买按省份排序
            this.data.purchasedLetter = data.authorityInitialCity.purchased.cityData;       // 已购买按字母排序
            this.data.notPurchasedLetter = data.authorityInitialCity.notPurchased.cityData; // 未购买按字母排序
            this.data.allCityData = this.data.purchasedLetter.concat(this.data.notPurchasedLetter); // 所有城市数据

            for (var i = 0; i < this.data.purchasedLetter.length; i++) {
                // 存储已购买的城市用于搜索城市功能使用
                var tempData = this.data.purchasedLetter[i];
                if (tempData.citys.length > 0) {
                    for (var j = 0; j < tempData.citys.length; j++) {
                        this.data.buyAllData.push({ 'cityName': tempData.citys[j].cityName, 'cityNameEn': tempData.citys[j].cityNameEn, 'spellingAlphabet': tempData.citys[j].spellingAlphabet });
                    }
                }
            }

            for (var i = 0; i < this.data.allCityData.length; i++) {
                // 存储已购买的城市用于搜索城市功能使用
                var tempData = this.data.allCityData[i];
                if (tempData.citys.length > 0) {
                    for (var j = 0; j < tempData.citys.length; j++) {
                        this.data.allData.push({ 'cityName': tempData.citys[j].cityName, 'cityNameEn': tempData.citys[j].cityNameEn, 'spellingAlphabet': tempData.citys[j].spellingAlphabet });
                    }
                }
            }

            var isBuy = '',
                disable = '';
            $('#searchCityInput').autoprompting({
                style: { 'max-height': '175px' },
                time: 100, // 延时时间
                getType: 'static',
                otherElm: '#searchCity',
                staticData: _this.data.allData, // 检索的静态资源数据
                render: function (data) {
                    for (var j = 0; j < _this.data.buyAllData.length; j++) {
                        isBuy = '';
                        if (_this.data.buyAllData[j].cityName != data.cityName) {
                            isBuy = '没有权限';
                            disable = 'disabled';
                            continue;
                        } else {
                            isBuy = '';
                            disable = '';
                            break;
                        }
                    }
                    return '<li class="' + disable + '" data-isbuy="' + isBuy + '" data-keywords="' + data.cityName + '">' + data.cityName + '<span>' + isBuy + '</span></li>';
                },
                enter: function (data, sval) {
                    var b = false;
                    // 验证该城市是否有权限
                    for (var i = 0; i < _this.data.buyAllData.length; i++) {
                        if (_this.data.buyAllData[i].cityName.match(data.keywords) && _this.data.buyAllData[i].cityName.match(data.keywords)[0]) {
                            b = true;
                            break;
                        } else {
                            b = !true;
                            // 比较是不是输入的城市名称...还没写。。
                            continue;
                        }
                    }
                    if (b) {
                        // 设置城市=====================
                        $('#searchCityInput').val(data.keywords);
                        _this.updateCityInfo(data.keywords);
                    }
                }
            });
        },
        // 已购买按省份排序
        buyCityListProvince: function (data) {
            var buyProvince = this.cityContent.find('div[data-sort="buyProvince"]');
            this.createProvinceDom(buyProvince, data, 'buy');
        },
        // 未购买按省份排序
        notBuyCityListProvince: function (data) {
            var notBuyProvince = this.cityContent.find('div[data-sort="notBuyProvince"]');
            this.createProvinceDom(notBuyProvince, data, 'notBuy');
        },
        // 已购买按字母排序
        buyCityListLetter: function (data) {
            var buyLetter = this.cityContent.find('div[data-sort="buyLetter"]');
            this.createLetterDom(buyLetter, data, 'buy');
        },
        // 未购买按字母排序
        notBuyCityListLetter: function (data) {
            var notBuyLetter = this.cityContent.find('div[data-sort="notBuyLetter"]');
            this.createLetterDom(notBuyLetter, data, 'notBuy');
        },
        showHide: function (elm) {
            /**
             * 防止dom重新渲染
             */
            this.aCityList.addClass('hide').removeClass('show');
            elm.removeClass('hide');
        },
        // 生成省份排序数据
        createProvinceDom: function (elm, data, isBuy) {
            //console.log(data)
            this.showHide(elm);
            if (elm[0].getAttribute('data-loading') == 'true') return;
            var municipalityData = data.municipalityData; // 直辖市
            var provinceData = data.provinceData;         // 省份
            // 直辖市数据不为空则拼接数据
            var sHtml = '';
            if (municipalityData.length) { // 直辖市
                sHtml += '<li>\
                <div class="key">直辖市：</div>\
                <div class="vals">';
                for (var i = 0; i < municipalityData.length; i++) {
                    sHtml += '<a href="javascript:;" data-type="' + isBuy + '" class="link ' + isBuy + '">' + municipalityData[i].cityName + '</a>';
                }
                sHtml += '</div>\
                </li>';
            }
            // 省份数据
            for (var i = 0; i < provinceData.length; i++) {
                var data = provinceData[i];
                if (!data.citys.length) continue;
                sHtml += '<li>\
                    <div class="key">'+ data.province + '：</div>\
                    <div class="vals">';
                for (var j = 0; j < data.citys.length; j++) {
                    sHtml += '<a href="javascript:;" data-type="' + isBuy + '" class="link ' + isBuy + '">' + data.citys[j].cityName + '</a>';
                }
                sHtml += '</div>\
                    </li>';
            }
            elm.attr('data-loading', 'true').addClass('show').removeClass('hide').find('ul').html(sHtml);
            // console.log( $('div[data-sort="buyProvince"]').find('a[data-type="buy"]') )
            this.aLinkCityEvent($('div[data-sort="buyProvince"]').find('a[data-type="buy"]'));
        },
        // 生成字母排序数据
        createLetterDom: function (elm, data, isBuy) {
            this.showHide(elm);
            if (elm[0].getAttribute('data-loading') == 'true') return;
            var sHtml = '';
            // 省份数据
            for (var i = 0; i < data.length; i++) {
                var tempData = data[i];
                if (!tempData.citys.length) continue;
                sHtml += '<li>\
                    <div class="key">'+ tempData.initial.toUpperCase() + '：</div>\
                    <div class="vals">';
                for (var j = 0; j < tempData.citys.length; j++) {
                    sHtml += '<a href="javascript:;" data-type="' + isBuy + '" class="link ' + isBuy + '">' + tempData.citys[j].cityName + '</a>';
                }
                sHtml += '</div>\
                    </li>';
            }
            elm.attr('data-loading', 'true').addClass('show').removeClass('hide').find('ul').html(sHtml);
            // console.log( $('div[data-sort="buyLetter"]').find('a[data-type="buy"]') )
            // 已购买城市点击
            this.aLinkCityEvent($('div[data-sort="buyLetter"]').find('a[data-type="buy"]'));
        },
        aLinkCityEvent: function (aElms) {
            var _this = this;
            aElms.each(function (idx, elm) {
                $(elm).unbind('click').bind('click', function () {
                    _this.updateCityInfo($(this).text());
                });
            });
        },
        bindEvent: function () {
            var _this = this;
            this.modelTab = this.cityContent.find('.model-tab').eq(0);
            this.modelTabLi = this.modelTab.find('li');
            this.buyType = this.cityContent.find('.buy-type').eq(0);
            this.oAs = this.buyType.find('a');
            this.modelTabLi.eq(0).addClass('active').siblings().removeClass('active');
            this.oAs.eq(0).addClass('active').siblings().removeClass('active');
            $('#searchCityInput').val(''); // 清空搜索过的数据

            this.modelTabLi.each(function (idx, elm) {
                $(elm).unbind('click').bind('click', function () {
                    // 根据状态显示不同的城市数据
                    $(this).addClass('active').siblings().removeClass('active');
                    _this.changePanel($(this).data().name);
                });
            });

            this.oAs.each(function (idx, elm) {
                $(elm).unbind('click').bind('click', function () {
                    // 根据状态显示不同的城市数据
                    $(this).addClass('active').siblings().removeClass('active');
                    _this.changePanel($(this).data().name);
                });
            });
        },
        changePanel: function (type) {
            if (type == 'buy') {  // 按钮点击(已购买)
                var tabType = this.modelTab.find('li.active[data-name]').data().name;
                // console.log( tabType )
                if (tabType == 'province') { // 按省份
                    // 显示按省份排序数据
                    // console.log( 'province' )
                    this.buyCityListProvince(this.data.purchasedProvince); // 已购买按省份排序
                } else if (tabType == 'letter') { // 按字母
                    // 显示按字母排序数据
                    // console.log( 'letter' )
                    this.buyCityListLetter(this.data.purchasedLetter);// 已购买按字母排序
                }
            } else if (type == 'notBuy') {  // 按钮点击(未购买)
                var tabType = this.modelTab.find('li.active[data-name]').data().name;
                if (tabType == 'province') { // 按省份
                    // 显示按省份排序数据
                    // console.log( 'not buy province' )
                    this.notBuyCityListProvince(this.data.notBurchasedProvince);// 未购买按省份排序

                } else if (tabType == 'letter') { // 按字母
                    // 显示按字母排序数据
                    // console.log( 'not buy letter' )
                    this.notBuyCityListLetter(this.data.notPurchasedLetter);// 未购买按字母排序
                }
            } else if (type == 'province') {  // tab按钮点击(按省份)
                var btnType = this.buyType.find('a.active[data-name]').data().name;
                if (btnType == 'buy') {
                    // 显示按省份排序数据(已购买)
                    // console.log( 'buy province' )
                    this.buyCityListProvince(this.data.purchasedProvince); // 已购买按省份排序
                } else if (btnType == 'notBuy') {
                    // 显示按省份排序数据(未购买)
                    // console.log( 'not buy province' )
                    this.notBuyCityListProvince(this.data.notBurchasedProvince);// 未购买按省份排序
                }
            } else if (type == 'letter') {  // tab按钮点击(按字母)
                var btnType = this.buyType.find('a.active[data-name]').data().name;
                if (btnType == 'buy') {
                    // 显示按省份排序数据(已购买)
                    // console.log( 'buy letter' )
                    this.buyCityListLetter(this.data.purchasedLetter);// 已购买按字母排序
                } else if (btnType == 'notBuy') {
                    // 显示按省份排序数据(未购买)
                    // console.log( 'not buy letter' )
                    this.notBuyCityListLetter(this.data.notPurchasedLetter);// 未购买按字母排序
                }
            }
        }
    }).init();


    /**
     * 意见反馈
     */
    var feedBackPop = ({
        init: function () {
            this.loadModules();
        },
        loadModules: function () {
            var _this = this;
            $('#feedBack').unbind('click').bind('click', function () {
                yf.path.load("#feedBackContent", {
                    controllerUrl: 'src/components/feedBack/js/feedBack.controller.js',
                    templateUrl: 'src/components/feedBack/feedBack.html',
                    reload: false // 是否重新加载该组件，默认不重新加载
                });
                var layerIndex = layer.open({
                    area: ['auto', 'auto'],
                    type: 1,
                    closeBtn: false,
                    title: false,
                    content: $('#feedBackPop'),
                    resize: false,
                    success: function () {
                        _this.judgeViewFn();
                        $('#subFeed').unbind('click').bind('click', function () {
                            _this.subFeedFn();
                        })
                        //加载成功 初始化弹框内容
                        $('#interfaceProposal,#caseFunProposal,#communityGradeProposal,#othersProposal').val('');
                        $('#interfaceSatisfaction,#caseFunSatisfaction,#communityGradeSatisfaction').attr('checked', 'checked');
                        $('#interfaceSatisfaction,#caseFunSatisfaction,#communityGradeSatisfaction').parent().siblings('label').find('input').removeAttr('checked');
                        yf.limitStr('#interfaceProposal', '#inter_num', '300');
                        yf.limitStr('#othersProposal', '#feed_num', '300');
                    },
                    end: function () {
                        // 关闭后要做的事情
                        $('#feedBackPop').hide();
                    }
                });
                /*yf.scroll({
                    elmId: '#opinion',
                });*/
            });
        },
        /*提交意见反馈*/
        subFeedFn: function () {
            var interface = '';
            var caseSatis = '';
            var comm = '';
            //var i=layer.load(2, {shade: [0.1,'#000']});
            $('#interfaceSatisfaction').is(':checked') ? interface = 1 : interface = 0;
			/*$('#caseFunSatisfaction').is(':checked')?caseSatis=1:caseSatis=0;
			$('#communityGradeSatisfaction').is(':checked')?comm=1:comm=0;*/
            var params = {
                interfaceSatisfaction: interface,//界面满意度(0:不满意,1:满意)
                interfaceProposal: yf.replaceHtml($('#interfaceProposal').val()),
				/*caseFunSatisfaction:caseSatis,
				caseFunProposal:yf.replaceHtml($('#caseFunProposal').val()),
				communityGradeSatisfaction:comm,
				communityGradeProposal:yf.replaceHtml($('#communityGradeProposal').val()),*/
                othersProposal: yf.replaceHtml($('#othersProposal').val())
            }
            feedBackServer.sendFeed(params).success(function (data) {
                layer.closeAll();
                if (data.success) {
                    layer.msg('提交成功，感谢您的建议 ,您的支持是我们房估估前进的动力~', { time: 30000, btn: ['知道了'] });
                } else {
                    layer.msg('提交失败，请重新尝试', { time: 20000, btn: ['知道了'] });
                }
            }).error(function (e) {});
        },
        /*处理意见反馈的 checkbox*/
        judgeViewFn: function () {
            $('.feed-back-hd').find('input').unbind('change').bind('change', function (e) {
                e.stopPropagation();
                if ($(this).is(':checked')) {
                    $(this).attr('checked', 'checked');
                    $(this).parent().siblings('label').find('input').removeAttr('checked')
                } else {
                    $(this).removeAttr('checked');
                    $(this).parent().siblings('label').find('input').attr('checked', 'checked');
                }
            });
        }
    }).init();

    /**
     *右侧侧边栏
     */
    ;({
        init: function () {
            this.fixCon = $('#fix_tool');
            this.autoHeight();
        },
        autoHeight: function () {
            var _this = this, wH = 0, fixHei = 0;
            autoHei(); $(window).resize(autoHei);
            function autoHei() {
                wH = $(window).height();
                fixHei = _this.fixCon.height();
                _this.fixCon.css('top', parseInt((wH - fixHei) / 2) + 'px').animate({ right: "0px" }, 300);
            }
        },
    }).init();


});


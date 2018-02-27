define(function () {
	return {
		/*搜索弹框的展示*/
		init: function (data, sval, len, curWorld) {
			this.dataFn();
			this.showPop(data, sval, len, curWorld);
		},
		dataFn: function () {
			this.searchPop = $('#search_pop_affirm');
		},
		/*弹框显示*/
		showPop: function (data, sval, len, curWorld) {
			var _this = this;
			layer.open({
				type: '1',
				area: ['auto', 'auto'],
				title: false,
				closeBtn: false,
				shadeClose: false,
				content: _this.searchPop,
				success: function () {
					//防止用户在弹窗后反复点击
					$('#valuationInput,#searchHouse').blur();
					$('.autoprompting').hide();
					setTimeout(function () { $('.autoprompting').hide(); }, 160);
					//输入项
					$('#search_pop_initem').text(sval);
					//匹配项
					$('#search_pop_mate').text(data.keywords);
					_this.searchPop.parents('.layui-layer-content').css({ 'overflow': 'visible', 'height': _this.searchPop.outerHeight() });
					_this.searchPop.parent().parent().css({ "top": "50%", "margin-top": -parseInt(_this.searchPop.outerHeight()) / 2 });
					//返回修改
					$('#search_pop_back').off('click').click(function () {
						layer.closeAll();
						$('.layui-layer-shade').remove();
						_hmt.push(['_trackEvent', '搜索弹框', '点击', '返回修改']);
					});
					//确认提交
					$('#search_pop_confirm').off('click').click(function () {
						_hmt.push(['_trackEvent', '搜索弹框', '点击', '确认估值']);
						layer.closeAll();
						$('.layui-layer-shade').remove();
						$('#valuationInput').val(data.keywords);
						//如果只有1条数据的时候
						if (len == 1) {
							var sval = data.keywords;
							location.href = '#/houseValuation?alias=' + data.residentialname + '&housingName=' + data.residentialname + '&istrative=' + data.districtname + '&sval=' + sval + '&buildingName=' + data.buildingname + '&buildingId=' + data.buildingid + '&unitName=' + data.unitname + '&unitId=' + data.unitid + '&houseName=' + data.housename + '&houseId=' + data.houseid + '&originalInputItem=' + curWorld;
						} else {
							location.href = '#/houseValuation?alias=' + (!data.similarword ? data.residentialname : data.similarword) + '&housingName=' + data.residentialname + '&istrative=' + data.districtname + '&sval=' + '&originalInputItem=' + curWorld + '';
						}
						location.reload();
					});
					//关闭按钮
					$('#search_pop_close').off('click').click(function () {
						layer.closeAll();
						$('.layui-layer-shade').remove();
					})
					//判断用户是否有人工核价的权限
					if (!$('#message_box').is(':hidden')) {
						_this.artificialPop();
						$('#nopricePop_artificial').removeClass('layui-disabled');
					} else {
						$('#search_pop_artificial').removeClass('c-blue');
						$('#search_pop_artificial').addClass('c-gray');
						$('#nopricePop_artificial').addClass('layui-disabled');
					}
				},
				end: function () {
					_this.searchPop.hide();
				}
			})
		},
		/*人工核价*/
		artificialPop: function () {
			var _this = this;
			if ($('#search_pop_artificial').hasClass('c-blue')) {
				$('#search_pop_artificial').off('click').click(function () {
					_hmt.push(['_trackEvent', '搜索弹框', '点击', '人工核价']);
					_this.goToArtificial();
				})
			}
		},
		/*打开人工核价的弹框*/
		goToArtificial: function () {
			yf.path.load("#auditPriceRecord", {
				controllerUrl: 'src/components/artificialNuclearValence/js/artificialNuclearValence.controller.js',
				templateUrl: 'src/components/artificialNuclearValence/artificialNuclearValence.html',
				reload: true
			});
		},
		/*暂无价格的弹框*/
		noPricePop: function () {
			var _this = this;
			var nopricePopBtn = $('#nopricePop_artificial');
			if (!$('#message_box').is(':hidden')) {
				nopricePopBtn.removeClass('layui-disabled');
			} else {
				nopricePopBtn.addClass('layui-disabled');
			};
			layer.open({
				type: '1',
				area: ['auto', 'auto'],
				title: false,
				closeBtn: false,
				shadeClose: false,
				content: $('#noprice_popup'),
				success: function () {
					if (!nopricePopBtn.hasClass('layui-disabled')) {
						nopricePopBtn.off('click').click(function () {
							_this.goToArtificial();
						})
					}

				},
				end: function () {
					$('#noprice_popup').hide();
				}
			})
		}
	}
})
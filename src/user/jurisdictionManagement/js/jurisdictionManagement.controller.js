require([
	'src/user/jurisdictionManagement/js/jurisdictionManagement.server.js',
], function (server) {
	"use strict";
	var main = ({
		init: function () {
			this.mechDataArr = [];//缓存机构数据
			this.subCityDataArr = [];//缓存下属城市数据
			this.numReg = /^(100|\d{0,2}|\d)$/;//匹配0-100内的整数
			this.rateReg = /^([1-9]\d?|100)$/;//匹配1-100的整数
			this.gainMechanisms('全部', null, '#jurdt_outfit', '#jurdt_subCity');//机构展示
			this.showBatchFn();
			this.showTableFn();
		},
		/*批量设置弹窗*/
		showBatchFn: function () {
			var _this = this;
			var oneceLoad = 1;//加载1次的判断		
			$('#go_batch').click(function () {
				layer.open({
					type: 1,
					title: false,
					area: ['auto', 'auto'],
					closeBtn: false,
					shadeClose: false,
					resize: false,
					content: $('#batch_setup'),
					success: function () {
						//弹出框select选项的数据要还原
						_this.gainMechanisms('全部', null, '#batch_pop_outfit', '#batch_pop_subCity');//机构展示
						_this.gainSubCity('全部', null, '#batch_pop_subCity', '#batch_pop_outfit');
						if (oneceLoad != 1) {
							$('#batch_pop_type').find("option[value='0']").attr("selected", "selected");
							_this.form.render('select');
						};
						oneceLoad++;
						//弹窗初始化的时候 文本框需要置空
						$('#batch_pop_discount').val('');
						$('#batch_pop_mortgage').val('');

						//取消
						$('#batch_pop_cancle').off('click').click(function () {
							layer.closeAll();
						});
						//保存
						$('#batch_pop_conserve').off('click').click(function () {
							var mechPop = $('#batch_pop_outfit').siblings('.layui-form-select').find('.layui-anim-upbit').find('.layui-this').attr('lay-value');//机构
							var curSubPop = $('#batch_pop_subCity').siblings('.layui-form-select').find('.layui-anim-upbit').find('.layui-this').attr('lay-value');//下属城市
							var rusultTypePop = $('#batch_pop_type').siblings('.layui-form-select').find('.layui-anim-upbit').find('.layui-this').attr('lay-value');//结果展示
							var discountPop = $('#batch_pop_discount');//放款折扣
							var mortgagePop = $('#batch_pop_mortgage');//自设抵押率
							if (discountPop.val() != '' && !_this.numReg.test(discountPop.val())) {
								layer.tips('放款折扣只能为0-100之间的整数', discountPop, { tips: [2, '#666'] });
								return;
							}
							if (mortgagePop.val() != '' && !_this.rateReg.test(mortgagePop.val())) {
								layer.tips('抵押率只能为1-100之间的整数', mortgagePop, { tips: [2, '#666'] });
								return;
							}
							if (mechPop == "全部") mechPop = '';
							if (curSubPop == "全部") curSubPop = '';
							//判断弹窗的数据是否有改动，要是没有改动的话提示用户
							var params = {
								userId: mechPop,
								selectCity: curSubPop,
								mortgageRate: mortgagePop.val(),
								discountRate: discountPop.val(),
								priceTypeDefault: rusultTypePop
							};
							if (mortgagePop.val()) { params.mortgageRate = (mortgagePop.val() / 100).toFixed(2) };
							if (discountPop.val()) { params.discountRate = (discountPop.val() / 100).toFixed(2) };
							yf.loading('#batch_setup_main');
							server.getBatchSetUp(params).success(function (data) {
								yf.removeLoading('#batch_setup_main');
								if (data.success) {
									layer.closeAll();
									layer.msg(data.msg);
									//刷新列表
									_this.showTableFn();
								}
							})
						})
					},
					end: function () {
						$('#batch_setup').hide();
						yf.removeLoading('#batch_setup_main');
						//因为弹出框在打开之时 重新渲染了一遍 那么在关闭的时候需要重新美化页面上的下拉框
						setTimeout(function () {
							_this.glorifyFn('#jurdt_outfit');
							_this.glorifyFn('#jurdt_subCity');
						}, 100);
					}
				})
			})
		},
		/*获取机构
		 *subCity:下属城市
		 *curMecUserId：当前选中的机构
		 *selectId:下拉框的id
		 *linkageId:联动城市id
		 * */
		gainMechanisms: function (subCity, curMecUserId, selectId, linkageId) {
			var params = {
				moduleName: '抵押比率关联',
				selectCity: subCity || ''
			};
			if (subCity == '全部') params.selectCity = '';
			var _this = this;
			var html = '<option value="全部">全部</option>';
			//先从缓存中取数据
			if (this.mechDataArr.length > 0) {
				for (var j = 0; j < this.mechDataArr.length; j++) {
					if (subCity == this.mechDataArr[j].subCity) {
						for (var t = 0; t < this.mechDataArr[j].mechArr.length; t++) {
							html += '<option value="' + this.mechDataArr[j].mechArr[t].userId + '">' + this.mechDataArr[j].mechArr[t].mechName + '</option>';
						};
						//判断是页面上的还是弹窗中的
						if (selectId == '#jurdt_outfit') {
							$('#jurdt_outfit').html(html);
							if (curMecUserId) { $('#jurdt_outfit').find("option[value='" + curMecUserId + "']").attr("selected", "selected") };
							//_this.showTableFn();
						} else {
							$('#batch_pop_outfit').html(html);
							if (curMecUserId) { $('#batch_pop_outfit').find("option[value='" + curMecUserId + "']").attr("selected", "selected") };
						}
						_this.form.render('select');
						setTimeout(function () {
							_this.glorifyFn(selectId);
						}, 100);
						return;
					}
				}
			}
			server.getMechanisms(params).success(function (data) {
				if (data.success) {
					var str = '<option value="全部">全部</option>';
					var obj = {
						subCity: '',//城市
						mechArr: []
					};
					if (yf.filterStr(data.data.organizationName) != '--') {
						str += '<option value="' + data.data.userId + '">' + data.data.organizationName + '</option>';
						obj.mechArr.push({ 'userId': data.data.userId, 'mechName': data.data.organizationName });
					};
					if (data.data.subordinateRelation.length > 0) {
						for (var i = 0; i < data.data.subordinateRelation.length; i++) {
							str += '<option value="' + data.data.subordinateRelation[i].SubaccountId + '">' + data.data.subordinateRelation[i].keHuDanWei + '</option>';
							obj.mechArr.push({ 'userId': data.data.subordinateRelation[i].SubaccountId, 'mechName': data.data.subordinateRelation[i].keHuDanWei });
						};
					};

					//判断是页面上的还是弹窗中的
					if (selectId != '#batch_pop_outfit') {
						$(selectId).html(str);
						if (curMecUserId) { $(selectId).find("option[value='" + curMecUserId + "']").attr("selected", "selected") };
					} else {
						$('#batch_pop_outfit').html(str);
						if (curMecUserId) { $(selectId).find("option[value='" + curMecUserId + "']").attr("selected", "selected") };
					}
					layui.use(['form'], function () {
						_this.form = layui.form;
						_this.form.render('select');
						setTimeout(function () {
							_this.glorifyFn(selectId);
						}, 100);
						//初始化执行 加载城市数据
						if (subCity == "全部") {
							_this.gainSubCity('全部', null, linkageId, selectId)
						};
						_this.form.on('select(jurdtName)', function (data) {
							//获取当前页面选中的城市，防止在点击的时候，重构城市选项 jurdt_subCity
							var curSubCity = $('#jurdt_subCity').siblings('.layui-form-select').find('.layui-anim-upbit').find('.layui-this').text();
							_this.gainSubCity(data.value, curSubCity, '#jurdt_subCity', '#jurdt_outfit');//获取城市
							//页面上的下拉框是需要刷新列表项的
							_this.showTableFn();
							setTimeout(function () {
								_this.glorifyFn('#jurdt_outfit');
							}, 100);
						});
						//批量弹窗
						_this.form.on('select(batchPop-outfit)', function (data) {
							//获取当前页面选中的城市，防止在点击的时候，重构城市选项 jurdt_subCity
							var curSubCity = $('#batch_pop_subCity').siblings('.layui-form-select').find('.layui-anim-upbit').find('.layui-this').text();
							_this.gainSubCity(data.value, curSubCity, '#batch_pop_subCity', '#batch_pop_outfit');//获取城市
							setTimeout(function () {
								_this.glorifyFn('#batch_pop_outfit');
							}, 100);
						});

					});
					obj.subCity = subCity;
					_this.mechDataArr.push(obj);

				}
			})
		},
		/*获取下属城市
		 *subUserId：机构id
		 *curSubCity:当前选中的城市 
		 * */
		gainSubCity: function (subUserId, curSubCity, selectId, linkageId) {
			var params = {
				moduleName: '抵押比率关联',//（'询价记录关联','估值共享关联'，'抵押比率关联'）
				subUserId: subUserId
			};
			if (subUserId == '全部') params.subUserId = '';
			var _this = this;
			var html = '<option value="全部">全部</option>';
			//先从缓存中去数据
			if (this.subCityDataArr.length > 0) {
				for (var t = 0; t < this.subCityDataArr.length; t++) {
					if (subUserId == this.subCityDataArr[t].mecId) {
						for (var o = 0; o < this.subCityDataArr[t].subCity.length; o++) {
							html += '<option value="' + this.subCityDataArr[t].subCity[o] + '">' + this.subCityDataArr[t].subCity[o] + '</option>'
						}
						//判断是页面上的还是弹窗中的
						if (selectId == '#jurdt_subCity') {
							$('#jurdt_subCity').html(html);
							if (curSubCity) {
								$('#jurdt_subCity').find("option[value='" + curSubCity + "']").attr("selected", true);
							};
							//_this.showTableFn();
						} else {
							$('#batch_pop_subCity').html(html);
							if (curSubCity) {
								$(selectId).find("option[value='" + curSubCity + "']").attr("selected", true);
							}
						}
						_this.form.render('select');
						setTimeout(function () {
							_this.glorifyFn(selectId);
						}, 100);
						return;
					}
				}
			}
			server.getsubordinateCity(params).success(function (data) {
				if (data.success) {
					var str = '<option value="全部">全部</option>';
					//缓存数据
					var obj = {
						mecId: '',
						subCity: []
					};
					if (data.data.length > 0) {
						for (var j = 0; j < data.data.length; j++) {
							str += '<option value="' + data.data[j].ChengShiMingCheng + '">' + data.data[j].ChengShiMingCheng + '</option>';
							obj.subCity.push(data.data[j].ChengShiMingCheng);
						};
					};
					//需要判断是页面上的还是弹窗中的
					if (selectId != '#batch_pop_subCity') {
						$(selectId).html(str);
						if (curSubCity) {
							$(selectId).find("option[value='" + curSubCity + "']").attr("selected", true);
						}
					} else {
						$('#batch_pop_subCity').html(str);
						if (curSubCity) {
							$(selectId).find("option[value='" + curSubCity + "']").attr("selected", true);
						}
					}
					_this.form.render('select');
					setTimeout(function () {
						_this.glorifyFn(selectId);
					}, 100);
					var layFilter = $(selectId).attr('lay-filter');
					_this.form.on('select(subCity)', function (data) {
						//获取当前选中的机构
						var curMecUserId = $('#jurdt_outfit').siblings('.layui-form-select').find('.layui-anim-upbit').find('.layui-this').attr('lay-value');
						_this.gainMechanisms(data.value, curMecUserId, '#jurdt_outfit', '#jurdt_subCity');
						_this.showTableFn();
						/*if(selectId=="#jurdt_subCity"){
							_this.showTableFn();
						};*/
						setTimeout(function () {
							_this.glorifyFn("#jurdt_subCity");
						}, 100);
					});
					_this.form.on('select(batchPop-subCity)', function (data) {
						//获取当前选中的机构
						var curMecUserId = $('#batch_pop_outfit').siblings('.layui-form-select').find('.layui-anim-upbit').find('.layui-this').attr('lay-value');
						_this.gainMechanisms(data.value, curMecUserId, '#batch_pop_outfit', '#batch_pop_subCity');
						setTimeout(function () {
							_this.glorifyFn("#batch_pop_subCity");
						}, 100);
					});
					obj.mecId = subUserId;
					_this.subCityDataArr.push(obj);
					/*setTimeout(function(){
						_this.glorifyFn(selectId);
					},50);*/
				}
			})
		},

		/*列表信息*/
		showTableFn: function (cur) {
			var userId = $('#jurdt_outfit').siblings('.layui-form-select').find('.layui-anim-upbit').find('.layui-this').attr('lay-value');
			var selectCity = $('#jurdt_subCity').siblings('.layui-form-select').find('.layui-anim-upbit').find('.layui-this').attr('lay-value');
			var params = {
				userId: userId,
				selectCity: selectCity,
				pageNo: cur || 1,
				pageSize: 10
			};
			var _this = this;
			/*var mortgage = {
				'0':'市场评估价',
				'1':'抵押评估价',
				'2':'自定义抵押评估价'
			};*/
			var iTip = layer.load(2, { shade: [0.1, '#000'] });
			if (userId == "全部") params.userId = '';
			if (selectCity == "全部") params.selectCity = '';
			server.getJurisdictionList(params).success(function (data) {
				layer.close(iTip);
				if (!data.success) {
					layer.msg(data);
					return;
				}
				if (data.data.list.length > 0) {
					var str = "";
					for (var i = 0; i < data.data.list.length; i++) {
						var recordData = JSON.stringify(data.data.list[i]).replace(" ", "");
						str += '<tr>\
								<td width="180">'+ yf.filterStr(data.data.list[i].KeHuDanWei) + '</td>\
								<td width="80">'+ yf.filterStr(data.data.list[i].ChengShiMingCheng) + '</td>\
								<td width="40">\
									<div class="layui-form-item">\
										<label class="layui-form-label">自设抵押率：</label>\
										<div class="layui-input-block">\
											<p class="authority-reveal">'+ (data.data.list[i].DiYaJiaGeChengShu * 100).toFixed(0) + '%</p>\
											<input type="text" class="layui-input text-center hide" value="'+ (data.data.list[i].DiYaJiaGeChengShu * 100).toFixed(0) + '" maxLength="3"/>\
											<span class="authority-unit hide">%</span>\
										</div>\
									</div>\
								</td>\
								<td width="40">\
									<div class="layui-form-item">\
										<label class="layui-form-label">放款折扣：</label>\
										<div class="layui-input-block">\
											<p class="authority-reveal">'+ (data.data.list[i].FangDaiZheKouChengShu * 100).toFixed(0) + '%</p>\
											<input type="text" class="layui-input text-center hide" value="'+ (data.data.list[i].FangDaiZheKouChengShu * 100).toFixed(0) + '" maxLength="3"/>\
											<span class="authority-unit hide">%</span>\
										</div>\
									</div>\
								</td>\
								<td width="220">\
									<div class="layui-form-item">\
										<label class="layui-form-label">结果展示：</label>\
										<div class="layui-input-block">\
											<p class="authority-reveal" data-type="'+ data.data.list[i].GuJiaZhanShiLeiXing + '">' + yf.priceTypeShow[data.data.list[i].GuJiaZhanShiLeiXing] + '</p>\
										</div>\
									</div>\
								</td>\
								<td class="text-center"  width="100">\
									<a class="c-blue hide keep" href="javascript:;">保存</a>\
									<a class="c-blue hide cancel" href="javascript:;">取消</a>\
									<a class="c-blue edit" href="javascript:;" data-record='+ recordData + '>设置</a>\
								</td>\
							</tr>';
					};
					$('#jurdtTable').html(str);
					$("#jurdtTable tr:odd").css("background", "#f9f9f9");
					_this.pageFn('jurdtPages', data.data.pageNum, data.data.total, 'showTableFn');
					_this.setUpFn();

				} else {
					$('#jurdtPages').html('');
					$('#jurdtTable').html('<tr class="text-center"><td colspan="6">暂无数据</td></tr>');
				}
			})
		},
		/*设置*/
		setUpFn: function () {
			var _this = this;
			$('#jurdtTable').find('.edit').off('click').click(function () {
				var html = '<select>\
							 <option value="0">市场评估价</option>\
							 <option value="1">抵押评估价</option>\
							 <option value="2">自定义抵押评估价</option>\
						 	<select>';
				var inputVal0 = $(this).parents('tr').find('.authority-reveal').eq(0);
				var inputVal1 = $(this).parents('tr').find('.authority-reveal').eq(1);
				var typeObj = $(this).parents('tr').find('.authority-reveal').eq(2);
				var typeNum = typeObj.attr('data-type');
				var recordInfo = $(this).attr('data-record');
				$(this).hide();
				$(this).parent().find('a').removeClass('hide');
				$(this).parents('tr').find('.authority-reveal').hide();
				$(this).parents('tr').find('.authority-reveal').next().removeClass('hide');
				$(this).parents('tr').find('.authority-unit').removeClass('hide');
				inputVal0.next('input').val(inputVal0.text().split('%')[0]);
				inputVal1.next('input').val(inputVal1.text().split('%')[0]);
				typeObj.after(html);
				typeObj.siblings('select').val(typeNum);
				_this.form.render('select');
				setTimeout(function () {
					_this.glorifyFn('#jurdt_outfit');
					_this.glorifyFn('#jurdt_subCity');
				}, 100);
				_this.conserveFn($(this).siblings('.keep'), recordInfo);//保存cancel
				_this.cancelFn($(this).siblings('.cancel'));
			});
		},
		/*保存
		 *obj:操作的对象;
		 *data:修改所需要的参数;
		 */
		conserveFn: function (obj, data) {
			var data = JSON.parse(data);
			var _this = this;
			obj.off('click').click(function () {
				//需要判断文本框里面的值
				var pledg = obj.parents('tr').find('.authority-reveal').eq(0);//自设抵押率
				var pledgInput = pledg.siblings('input');
				var loan = obj.parents('tr').find('.authority-reveal').eq(1);//放款折扣
				var loanInput = loan.siblings('input');
				var typeObj = obj.parents('tr').find('.authority-reveal').eq(2);
				var typeNum = typeObj.siblings('.layui-form-select').find('.layui-anim-upbit').find('.layui-this').attr('lay-value');
				if (pledgInput.val() == '' || $.trim(pledgInput.val()) == '') {
					layer.tips('请输入自设抵押率', pledgInput, { tips: [1, '#666'] });
					return;
				};
				if (!_this.rateReg.test(pledgInput.val())) {
					layer.tips('抵押率只能为1-100之间的整数', pledgInput, { tips: [1, '#666'] });
					return;
				}
				if (loanInput.val() != '' && !_this.numReg.test(loanInput.val())) {
					layer.tips('放款折扣只能为0-100之间的整数', loanInput, { tips: [1, '#666'] });
					return;
				};
				//如果没有修改 那么操作是跟‘取消’一样的
				if (pledg.text().split('%')[0] == pledgInput.val() && loan.text().split('%')[0] == loanInput.val() && typeObj.attr('data-type') == typeNum) {
					$(this).siblings('.cancel').trigger('click');
					return;
				}
				var params = {
					recordId: data.id,
					selectCity: data.ChengShiMingCheng,
					mortgageRate: (pledgInput.val() / 100).toFixed(2),//抵押率
					discountRate: (loanInput.val() / 100).toFixed(2) || '0',//折扣率
					priceTypeDefault: typeNum//价格类型
				};
				server.getAmend(params).success(function (data) {
					if (!data.success) {
						layer.msg(data.msg);
						return;
					};
					layer.msg(data.msg);
					_this.showTableFn();
				})
			});
		},
		/*取消*/
		cancelFn: function (obj) {
			obj.off('click').click(function () {
				obj.addClass('hide');
				obj.siblings('.keep').addClass('hide');
				obj.siblings('.edit').show();
				obj.parents('tr').find('.authority-reveal').show();
				obj.parents('tr').find('.authority-reveal').next().addClass('hide');
				obj.parents('tr').find('.authority-reveal').eq(2).nextAll().remove();
				obj.parents('tr').find('.authority-unit').addClass('hide');
			})
		},
		/**分页(params)
		 *id:当前分页的容器
		 *curr:当前页码
		 *total:总数
		 *callback:回掉函数
		**/
		pageFn: function (id, curr, total, callBack) {
			var _self = this;
			if (!this.layPage) {
				layui.use(['laypage'], function () {
					_self.layPage = layui.laypage;
					_self.page(id, curr, total, callBack);
				});
			} else {
				_self.page(id, curr, total, callBack);
			}
		},
		page: function (id, curr, total, callBack) {
			var _self = this;
			this.layPage.render({
				elem: id, //注意，这里的 test1 是 ID，不用加 # 号
				curr: curr || 1,
				count: total,
				limit: 10,            //每页显示的条数
				layout: ['prev', 'page', 'next', 'count'],
				jump: function (obj, first) {
					if (!first) {
						//console.log(callBack);
						_self[callBack](obj.curr);
					}
				}
			});
		},
		/*美化区域选项的滚动条*/
		glorifyFn: function (id) {
			var _this = this;
			var sId = $(id).siblings('.layui-unselect').find('.layui-anim');
			yf.scroll({ elmId: sId, 'height': 'auto' });
			//在选项滚动区域滚动的时候 禁止掉最外层的滚动
			//this.banScrollFn(sId);
			//this.banScrollFn(sDist);
		}
	}).init();


})

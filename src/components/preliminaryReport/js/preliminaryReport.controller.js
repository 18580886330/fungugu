require([
	'src/components/preliminaryReport/js/preliminaryReport.server.js'
], function (server) {
	var main = ({
		init: function () {
			this.picNum = 0; //需要上传图片的数量
			this.reportParams = {}; //生成报告需要传的参数
			this.picArr = []; //上传成功的图片
			this.form;//layui中的form
			yf.loadFile("src/content/js/third/ajaxfileupload/ajaxfileupload.js"); /*加载插件*/
			this.showReportInfoFn();
			this.gainDataFn();
			this.pageShowDataFn();
		},
		/*显示填写资料页面*/
		showReportInfoFn: function () {
			var _this = this;
			this.previewPicFn();
			this.preauditReport = $('#preaudit_report');
			this.thumb = this.preauditReport.find('.thumb');//缩略图
			this.reportContent = this.preauditReport.find('.report-content');//填写信息的部分
			layer.open({
				area: ['auto', 'auto'],
				type: 1,
				closeBtn: false,
				title: false,
				shade: [.6, '#000'],
				resize: false,
				content: _this.preauditReport,
				success: function () {
					_this.seeMoreFn();//查看更多
					_this.isMakePreviewRepFn();//生成预览
					//获取焦点的时候改变边框颜色
					_this.preauditReport.find('input').focus(function () {
						$(this).css("borderColor", '#e6e6e6');
						if ($(this).parent().hasClass('box-border')) {
							$(this).parent().css("borderColor", '#e6e6e6');
						}
					});
					//重置信息
					$('#rep_reset').off('click').click(function () {
						//先获取select的边框颜色，重置的时候会更改边框值，防止用户是点击了补充，然后点返回的
						var oSel = _this.preauditReport.find('select');
						var oBorderColorArr = [];
						for (var i = 0; i < oSel.length; i++) {
							oBorderColorArr.push(oSel.eq(i).siblings('.layui-unselect').find('input').css('borderColor'));
						}
						_this.preauditReport.find('input').val('');
						_this.preauditReport.find('select').val('');
						_this.form.render('select'); //需要手动渲染下拉框
						//给重置后的select添加边框色
						for (var i = 0; i < oSel.length; i++) {
							oSel.eq(i).siblings('.layui-unselect').find('input').css('borderColor', oBorderColorArr[i]);
						}
						//解决重置信息后的select边框颜色不变
						_this.reportContent.find('input').click(function () {
							$(this).css("borderColor", '#e6e6e6');
						});
						//重置上传的图片
						_this.picNum = 0;
						_this.reportParams = {};
						_this.thumb.children().remove();
						_this.thumb.attr('data-upload', 'true');
						//console.log();
					})
				},
				end: function () {
					_this.preauditReport.hide();
				}
			});

		},
		/*取出页面要用的元素*/
		gainDataFn: function () {
			this.houseLocal = $('#rep_houseLocal'); //房屋坐落
			this.area = $('#rep_area'); //面积
			this.houseUse = $('#rep_houseUse'); //房屋用途
			this.housingProperty = $('#rep_housingProperty'); //房屋性质==权利性质
			this.buildYear = $('#rep_buildYear'); //建成年代
			this.curFloor = $('#rep_curFloor'); //所在楼层
			this.totalFloor = $('#rep_totalFloor'); //总楼层
			this.exceptionalCase = $('#rep_exceptionalCase'); //特殊情况
			this.room = $('#rep_room'); //室
			this.hall = $('#rep_hall'); //厅
			this.toilet = $('#rep_toilet'); //卫
			this.toward = $('#rep_toward'); //朝向
			this.obligee = $('#rep_obligee'); //权利人
			this.taxation = $('#rep_taxation'); //税费
		},
		/*页面展示数据*/
		pageShowDataFn: function () {
			var _this = this;
			//特殊因素 添加
			var str = $('#valuationRequire').find('select[name="special"]').html();
			this.exceptionalCase.html(str);
			//回显页面的值
			this.houseLocal.val($('#valuationInput').val());
			this.area.val(yf.$params().houseArea);
			this.houseUse.val(_this.filterSelectStrFn(yf.$params().estateType));
			this.buildYear.val(yf.$params().year);
			this.curFloor.val(yf.$params().floor);
			this.totalFloor.val(yf.$params().sumFloor);
			this.exceptionalCase.val(_this.filterSelectStrFn(yf.$params().special));
			this.toward.val(_this.filterSelectStrFn(yf.$params().toward));
			this.taxation.val(yf.taxationNum);
			this.autoScrollFn();
		},
		/*校验规则*/
		checkRuleFn: function () {
			var flag = true;
			var _this = this;
			var sYear = new Date().getFullYear();
			var spacileReg = /[~#^$@%&！!*]/;
			if (this.houseLocal.val() == "" || $.trim(_this.houseLocal.val()) == "") {
				layer.msg("房屋坐落不能为空");
				//_this.houseLocal.addClass('warm');
				_this.elemBlurFn(_this.houseLocal);
				flag = false;
				return;
			}
			if (spacileReg.test(_this.houseLocal.val())) {
				layer.msg("房屋坐落不能有特殊字符");
				_this.elemBlurFn(_this.houseLocal);
				flag = false;
				return;
			}
			if (this.houseLocal.val().length < 2) {
				layer.msg("房屋坐落长度在2~100之间");
				_this.elemBlurFn(_this.houseLocal);
				flag = false;
				return;
			}
			if (this.area.val() == "" || $.trim(_this.area.val()) == "") {
				layer.msg("面积不能为空");
				_this.elemBlurFn(_this.area);
				flag = false;
				return;
			}
			if (!/^[1-9]\d{0,3}(\.\d{0,2})?$/.test(_this.area.val()) || _this.area.val() > 9998.99) {
				// _this.oHouseArea.focus();
				layer.msg("请输入面积为1~9998.99，只留两位小数！");
				_this.elemBlurFn(_this.area);
				flag = false;
				return;
			}
			if (this.buildYear.val() != '' && !/^\d{4}$/.test(_this.buildYear.val())) {
				//_this.oYear.focus();
				layer.msg("请输入年代为1900~" + sYear + "的四位整数！");
				_this.elemBlurFn(_this.buildYear);
				flag = false;
				return;
			}
			if (this.buildYear.val() != '' && (this.buildYear.val() < 1900 || this.buildYear.val() > sYear)) {
				//_this.oYear.focus();
				layer.msg("请输入年代为1900~" + sYear + "的四位整数！");
				_this.elemBlurFn(_this.buildYear);
				flag = false;
				return;
			}
			if (this.curFloor.val() != '' && !/^\d{1,2}$|-1$/.test(_this.curFloor.val())) {
				//_this.oFloor.focus();
				layer.msg("所在楼层应该为-1或1~99！");
				_this.elemBlurFn(_this.curFloor.parent());
				flag = false;
				return;
			}
			if (this.curFloor.val() != '' && this.curFloor.val() == '0') {
				//_this.oFloor.focus();
				layer.msg("所在楼层应该为-1或1~99！");
				_this.elemBlurFn(_this.curFloor.parent());
				flag = false;
				return;
			}
			if (this.totalFloor.val() != '' && !/^\d{0,2}$/.test(_this.totalFloor.val())) {
				//_this.oSumFloor.focus();
				layer.msg("总楼层应该为1~99！");
				_this.elemBlurFn(_this.totalFloor.parent());
				flag = false;
				return;
			}
			if (this.totalFloor.val() != '' && this.totalFloor.val() == '0') {
				//_this.oSumFloor.focus();
				layer.msg("总楼层应该为1~99！");
				_this.elemBlurFn(_this.totalFloor.parent());
				flag = false;
				return;
			}
			// 大小判断
			if ((this.curFloor.val() != '' && this.totalFloor.val() != '') && Number(_this.curFloor.val()) > Number(_this.totalFloor.val())) {
				//_this.oFloor.focus();
				layer.msg("所在楼层不能大于总楼层！");
				_this.elemBlurFn(_this.totalFloor.parent());
				flag = false;
				return;
			}
			//判断室、厅、卫
			if (this.room.val() != "" && !this.limitRoomFn(_this.room)) {
				flag = false;
				return;
			}
			if (this.hall.val() != "" && !this.limitRoomFn(_this.hall)) {
				flag = false;
				//alert();
				return;
			}
			if (this.toilet.val() != "" && !this.limitRoomFn(_this.toilet)) {
				flag = false;
				return;
			}
			//委托人
			if (this.obligee.val() != "" && !/^[\u4E00-\u9FA5，,]{2,200}/.test(_this.obligee.val())) {
				layer.msg("委托人必须是中文，多个时必须以逗号隔开！");
				_this.elemBlurFn(_this.obligee);
				flag = false;
				return;
			}
			if (this.obligee.val().indexOf(',') > 0) {
				var lastStr = this.obligee.val().substr(_this.obligee.val().length - 1, 1);
				if (lastStr == "," || lastStr == "，") {
					var qlrName = this.obligee.val().substr(0, _this.obligee.val().length - 1);
					this.obligee.val(qlrName);
				}
				var obligeeArr = this.obligee.val().split(',');
				if (obligeeArr.length > 7) {
					layer.msg("委托人必须是中文，多个时必须以逗号隔开！");
					_this.elemBlurFn(_this.obligee);
					flag = false;
					return;
				}
			}
			// 预计税费

			if (this.taxation.val() != "" && !/^[1-9][0-9]*$/.test(_this.taxation.val())) {
				layer.msg("请输入正确的税费！");
				_this.elemBlurFn(_this.taxation);
				flag = false;
				return;

			}
			if (yf.$params().jTotalPrice != '暂无价格') {
				var ShiChangZongJia = Number(yf.$params().jTotalPrice * 10000);
				if (this.taxation.val() != "" && this.taxation.val() > ShiChangZongJia) {
					layer.msg("税费不能高于房屋总价！");
					_this.elemBlurFn(_this.taxation);
					flag = false;
					return;
				}
			}

			//需要传送的数据
			this.reportParams.cityName = yf.userInfo.city;
			this.reportParams.comName = yf.$params().housingName;
			this.reportParams.regionName = yf.$params().istrative;
			this.reportParams.beLocated = this.houseLocal.val();
			this.reportParams.housingConstructionArea = this.area.val();
			this.reportParams.obligee = this.obligee.val();
			this.reportParams.housingProperty = this.housingProperty.val();
			this.reportParams.houseUse = this.houseUse.val();
			this.reportParams.orientation = this.toward.val();
			this.reportParams.exceptionalCase = this.exceptionalCase.val();
			this.reportParams.room = this.room.val();
			this.reportParams.hall = this.hall.val();
			this.reportParams.toilet = this.toilet.val();
			this.reportParams.housingLocationLayer = this.curFloor.val();
			this.reportParams.totalNumberOfHouses = this.totalFloor.val();
			this.reportParams.housingCompletionTime = this.buildYear.val();
			this.reportParams.unitPrice = yf.$params().jUnitPrice; //市场单价
			this.reportParams.totalPrice = yf.$params().jTotalPrice; //市场总价
			this.reportParams.taxation = this.taxation.val();
			this.reportParams.mortgagePrice = yf.$params().mortgagePrice;//抵押单价
			this.reportParams.mortgageTotalPrice = yf.$params().mortgageTotalPrice;//抵押总价
			return flag;
		},
		/*过滤显示页面的字段*/
		filterSelectStrFn: function (str) {
			if (str == undefined || str == '' || str == null) {
				return "请选择";
			}
			return str;
		},
		/*查看更多*/
		seeMoreFn: function () {
			var _this = this;
			yf.scroll({
				elmId: _this.preauditReport,
				height: '634'
			});
			$('#see_more').off('click').click(function () {
				if ($(this).text() == "更多") {
					$(this).text('收起');
					$('#more_info').removeClass('hide').stop(true, true).slideDown();
				} else {
					$(this).text('更多');
					_this.preauditReport.mCustomScrollbar('scrollTo', 'top');
					setTimeout(function () {
						$('#more_info').removeClass('hide').stop(true, true).slideUp();
					}, '300');

				}
			})
		},
		/*确认是否生成*/
		isMakePreviewRepFn: function () {
			var _this = this;
			$('#makeReport').click(function () {
				var oZidx = _this.preauditReport.parent().parent().css('zIndex');
				//先验证字段
				if (!_this.checkRuleFn()) return;

				layer.open({
					area: ['auto', 'auto'],
					type: 1,
					closeBtn: false,
					title: false,
					resize: false,
					content: $("#report_affirm"),
					success: function (layero, index) {
						_this.preauditReport.parent().parent().css('zIndex', '100');
						//返回补充
						$('#backAdd').click(function () {
							layer.close(index);
							for (var i = 0; i < _this.reportContent.find('input').length; i++) {
								if (_this.reportContent.find('input').eq(i).val() == "" || $.trim(_this.reportContent.find('input').eq(i).val()) == "") {
									_this.reportContent.find('input').eq(i).css("borderColor", '#db2029');
								}
							};
							//楼层
							if (_this.curFloor.val() == '' || _this.totalFloor.val() == "") {
								_this.curFloor.parent().css("borderColor", '#db2029');
							};
							//户型
							if (_this.room.val() == '' || _this.hall.val() == "" || _this.toilet.val()) {
								_this.room.parent().css("borderColor", '#db2029');
							};
							_this.reportContent.find('input').click(function () {
								$(this).css("borderColor", '#e6e6e6');
							});
						});
						_this.subPreviewFn();
					},
					end: function () {
						_this.preauditReport.parent().parent().css('zIndex', oZidx);
						$("#report_affirm").hide();
					}
				})
			})
		},
		/*提交预览报告数据*/
		subPreviewFn: function () {
			var oH = $(window).height();
			var _this = this;
			$('#preview_report').mCustomScrollbar({
				setHeight: oH,
				scrollInertia: 180,
				theme: "minimal-dark",
				axis: "y",
				alwaysShowScrollbar: 2,
				callbacks: {
					whileScrolling: function () {
						if (parseInt($('#preview_report').find('.mCSB_dragger_onDrag').css('top')) > 50) {
							$('#back_top').show();
						} else {
							$('#back_top').hide();
						}
					}
				}
			});
			$('#back_top').off('click').click(function () {
				$('#preview_report').mCustomScrollbar('scrollTo', 'top', function () {
					$('#back_top').hide();
				});
			});

			$('#makePreview').off('click').click(function () {
				//生成预览报告 先上传图片
				$('#back_top').hide();
				yf.loading('#report_affirm');
				_this.demandPicNumFn();
				return;
			})
		},
		/*预览报告数据的生成*/
		greatPreviewFn: function () {
			var _this = this;
			server.getReport(_this.reportParams).success(function (data) {
				if (data.success) {
					//弹出预览报告的模板页面
					var oH = $(window).height();
					var oHg = oH;
					layer.open({
						area: ['auto', oHg + 'px'],
						type: 1,
						closeBtn: false,
						title: false,
						resize: false,
						content: $("#preview_report"),
						success: function (layero, index) {
							$('#back_affirm').off('click').click(function () {
								layer.close(index);
							});
							//绑定数据
							_this.echoTempPageFn(data.data);
							//下载报告
							_this.downLoadRepFn(data.data.downRpRecordId);
							//ie下回到顶部按钮的兼容
							_this.backToTopFn();
							$(window).resize(function () {
								_this.backToTopFn();
							});
						},
						end: function () {
							$("#preview_report").hide()
						}

					})
				} else {
					layer.msg(data.msg);
				}
				yf.removeLoading('#report_affirm');
			}).error(function (data) {
				layer.msg(data.msg);
				yf.removeLoading('#report_affirm');
			})

		},
		/*下载报告*/
		downLoadRepFn: function (id) {
			var params = {
				reportId: id
			};
			$('.reportDownload').off('click').click(function () {
				yf.loading('#preview_report');
				server.downReportFn(params).success(function (data) {
					if (data.success) {
						$('#rep_downLoad').attr('href', data.data);
						layer.open({
							type: '1',
							title: false,
							closeBtn: false,
							shadeClose: false,
							resize: false,
							area: ['auto', 'auto'],
							content: $('#reportDownLoadPop'),
							success: function (layero, index) {
								//取消
								$('#rep_cancel').off('click').click(function () {
									layer.close(index);
									yf.removeLoading('#preview_report');
								});
								//立即下载
								$('#rep_downLoad').off('click').click(function () {
									layer.close(index);
									yf.removeLoading('#preview_report');
									layer.msg('下载成功');
								})
							},
							end: function () {
								$('#reportDownLoadPop').hide();
							}
						})
					} else {
						layer.msg(data.msg);
						yf.removeLoading('#preview_report');
					}
				}).error(function () { })
			})

		},
		/*模板页回显数据*/
		echoTempPageFn: function (data) {
			$('.rep-valuationItemName').text(data.valuationItemName);//估价项目名称
			$('.rep-pointOfValue').text(data.pointOfValue);//价值时点
			$('#reportNum').text(data.reportNum);//报告编号
			$('#valuationPrincipal').text(data.valuationPrincipal);//估价委托人
			$('.rep-buildingArea').text(data.buildingArea);//建筑面积
			$('.rep-unitPrice1').text(data.unitPrice);//单位面积价值
			$('.rep-totalPrice').text(data.totalPrice);//总价
			$('.rep-capitalamount').text(data.capitalamount);//大写
			$('.rep-taxation').text(data.taxation);//税费
			$('.rep-referenceValue').text(data.referenceValue);//参考净值
			//房屋基本信息
			$('#prew_xqName').text(yf.$params().housingName);//小区名称
			$('#prew_housingConstructionArea').html(data.housingConstructionArea + '㎡');//面积
			$('#prew_houseType').text(data.houseType);//户型
			$('#prew_totleFloor').text(data.floor_TotleFloor);//楼层
			$('#prew_orientation').text(data.orientation);//朝向
			$('#prew_buildingTime1').text(data.buildingTime);//建成年代
			$('#prew_housingProperty').text(data.housingProperty);//房屋性质
			$('#prew_houseUse').text(data.houseUse);//房屋用途
			$('#prew_exceptionalCase').text(data.exceptionalCase);//特殊因素
			//周边配套
			$('#prew_bus').text(data.bus);//公交
			$('#prew_subway').text(data.subway);//轨道
			$('#prew_supermarket').text(data.supermarket);//商业配套
			$('#prew_school').text(data.school);//教育机构
			$('#prew_hospital').text(data.hospital);//医疗机构
			$('#prew_bank').text(data.bank);//金融机构
			//电子印章
			if (data.sealImg != '' && data.sealImg != '-') {
				$('#e_seal').attr('src', data.sealImg);
			}

			//地图
			if (data.mapImgUrl == '' || data.mapImgUrl == undefined || data.mapImgUrl == null) {
				$('#report_map').find('img').hide();;
				$('#report_map').html('<p class="text-center">暂无小区地图</p>')
			} else {
				$('#report_map img').show().attr('src', data.mapImgUrl);
			}
			//价格走势
			if (data.trendChartImgUrl == "" || data.trendChartImgUrl == undefined || data.trendChartImgUrl == null) {
				$('#report_chart').find('img').hide();;
				$('#report_chart').html('<p class="text-center">暂无价格走势图</p>')
			} else {
				$('#report_chart img').show().attr('src', data.trendChartImgUrl);
			}
			//挂牌案列
			var html2 = "";
			if (data.listingCases.length > 0) {
				for (var i = 0; i < data.listingCases.length; i++) {
					html2 += '<tr>\
							<td>'+ data.listingCases[i].unitPrice + '元/㎡</td>\
							<td>'+ data.listingCases[i].totalPrice + '万元</td>\
							<td>'+ data.listingCases[i].caseTime + '</td>\
							<td>'+ data.listingCases[i].buildingArea + '㎡</td>\
							<td>'+ data.listingCases[i].floors_fLOOR + '</td>\
							<td>'+ data.listingCases[i].toward + '</td>\
						</tr>';
				}
			} else {
				html2 = '<tr><td class="text-center" colspan="6">暂无数据</td></tr>'
			}
			$("#rep_listingCases").html(html2);
			//周边小区楼盘
			var html3 = "";
			if (data.surroundingAreas.length > 0) {
				for (var i = 0; i < data.surroundingAreas.length; i++) {
					html3 += '<tr>\
							<td>'+ data.surroundingAreas[i].residentialAreaName + '</td>\
							<td>'+ data.surroundingAreas[i].unitPrice + '</td>\
							<td>'+ data.surroundingAreas[i].distance + '</td>\
							</tr>';
				}
			} else {
				html3 = '<tr><td class="text-center" colspan="3">暂无数据</td></tr>'
			}
			$("#rep_surroundingAreas").html(html3);
			//上传的图片
			this.loadPicsFn(data.iDPhotos, data.realEstateLicensePhotos, data.housing_ResidentialPhotos);

		},
		/*报告页图片的展示*/
		loadPicsFn: function (iDPhotos, realEstateLicensePhotos, housing_ResidentialPhotos) {
			var iDCardStr = "";
			var fangChanCardStr = "";
			var xiaoQuPhotoStr = "";
			if (iDPhotos) {
				for (var i = 0; i < iDPhotos.length; i++) {
					if (iDPhotos[i] != "—") {
						iDCardStr += '<li><span><img src="' + iDPhotos[i] + '" alt=""></span></li>';
					}
				}
			}
			$("#rep_iDPhotos").html(iDCardStr);
			if (realEstateLicensePhotos) {
				for (var i = 0; i < realEstateLicensePhotos.length; i++) {
					if (realEstateLicensePhotos[i] != "—") {
						fangChanCardStr += '<li><span><img src="' + realEstateLicensePhotos[i] + '" alt=""></span></li>';
					}
				}
			}
			$("#rep_fangChanCard").html(fangChanCardStr);
			if (housing_ResidentialPhotos) {
				for (var i = 0; i < housing_ResidentialPhotos.length; i++) {
					if (housing_ResidentialPhotos[i] != "—") {
						xiaoQuPhotoStr += '<li><span><img src="' + housing_ResidentialPhotos[i] + '" alt=""></span></li>';
					}
				}
			}
			$("#rep_housePhotos").html(xiaoQuPhotoStr);
		},
		/*图片预览*/
		previewPicFn: function () {
			var len = $('.pic-box').length;
			var _this = this;
			for (var i = 0; i < len; i++) {
				$('.pic-box').eq(i).find('input[type=file]').change(function () {
					var div = $(this).next(".thumb");
					// ie10以下的浏览需要用滤镜
					if (this.value && yf.isIe() && !(navigator.userAgent.indexOf("MSIE 10.0") > 0)) {
						this.select();
						this.blur();
						var src = document.selection.createRange().text;
						$(div).html('<div class="divhead inline" style="width:108px;height:108px">');
						var box = div.children('.divhead')[0];
						box.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
						//_this.picNum++;
						//alert(_this.picNum);
						return;
					}
					//如果有file
					if (this.files && this.files[0]) {
						$(div).html('<img class="imghead" />');
						var img = div.children('.imghead')[0];
						//var fileId=$(this).attr('id');
						var reader = new FileReader();
						reader.onload = function (evt) {
							img.src = evt.target.result;
						}
						reader.readAsDataURL(this.files[0]);
						$(this).next(".thumb").attr('data-upload', 'true');
					} else {
						$(this).next(".thumb").html('');
						//对于已经上传成功的图片,需要从已经添加过的对象去除,并且改变上传状态
						$(this).next(".thumb").attr('data-upload', 'true');
						_this.reportParams[$(this).attr('id')] = '';
					}


				})
			}

		},
		/*上传图片*/
		uploadPicFn: function (fileId) {
			var _this = this;
			//alert(this.picNum);
			$.ajaxFileUpload({
				url: '/api/v1/preliminaryReport/imageUpload', //用于文件上传的服务器端请求地址
				secureuri: false, //是否需要安全协议，一般设置为false
				fileElementId: fileId, //文件上传域的ID
				type: "post",
				dataType: 'text',
				data: {
					cityName: yf.userInfo.city
				},
				success: function (data) {
					var data = eval("(" + data + ")");
					if (data.success) {
						_this.picNum--;
						_this.picArr.push(data.data.imgUrl);
						_this.reportParams[fileId] = data.data.imgUrl;
						$('#' + fileId).next('.thumb').attr('data-upload', 'false'); //改变图片上传成功的状态
						//console.log(_this.reportParams);
						if (_this.picNum == 0) {
							//生成报告
							_this.greatPreviewFn();
						}
					} else {
						//上传失败
						layer.msg(data.msg);
						yf.removeLoading('#report_affirm');
					}
				},
				error: function (data) {
					layer.msg(data.msg);
					yf.removeLoading('#report_affirm');
				}
			})
		},
		/*页面上需要上传的图片*/
		demandPicNumFn: function () {
			var _this = this;
			var len = this.thumb.length;
			for (var i = 0; i < len; i++) {
				if (_this.thumb.eq(i).children().length > 0 && _this.thumb.eq(i).attr('data-upload') == "true") {
					var fileId = _this.thumb.eq(i).prev().attr('id');
					//上传图片
					_this.picNum++;
					_this.uploadPicFn(fileId);
				}
			};
			if (this.picNum == 0) {
				_this.greatPreviewFn();
				//console.log('生成报告接口');
			}
		},
		/*layui组件的操作
		 *左右切换
		 * */
		autoScrollFn: function () {
			var _this = this;
			var muns = {
				'1': '一',
				'2': '二',
				'3': '三',
				'4': '四',
				'5': '五',
				'6': '六',
				'7': '七'
			};
			layui.use(['carousel', 'form'], function () {
				var carousel = layui.carousel;
				_this.form = layui.form;
				_this.form.render('select'); //需要手动渲染下拉框
				//建造实例
				carousel.render({
					elem: '#house_pic',
					width: '100%', //设置容器宽度
					arrow: 'always', //始终显示箭头
					autoplay: false,
					indicator: 'none',
					height: '112px'
					//,anim: 'updown' //切换动画方式
				});
				carousel.on('change(house_pic)', function (obj) {
					$('#curPage').text(muns[obj.index + 1]);
				});
			});
		},
		/*室、厅、卫的验证*/
		limitRoomFn: function (id) {
			var flag = true;
			var _this = this;
			if (!/^[1-9][0-9]{0,1}$/.test(id.val())) {
				layer.msg("请输入1-99之间的任意数字");
				_this.elemBlurFn(id.parent());
				flag = false;
				return;
			};
			return flag;
		},
		/*失去焦点*/
		elemBlurFn: function (elm) {
			elm.css("borderColor", '#db2029');
		},
		/*回到顶部在ie下的兼容性*/
		backToTopFn: function () {
			if (!!window.ActiveXObject || "ActiveXObject" in window) {
				var oLeft = $('#preaudit_report').width() + $('#preaudit_report').offset().left + 20;
				$('#back_top').css('left', oLeft + 'px');
			}
		}
	}).init()

})
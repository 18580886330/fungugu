require([
	'src/components/taxation/js/taxation.server.js',
], function (server) {

	var main = ({
		init: function () {
			this.showPopFn();
		},
		showPopFn: function () {
			var _this = this;
			if (yf.userInfo.city == '北京') {
				$("#taxCalculation .mortgage-cell").addClass('gide3');
				$("#taxCalculation .auction-box").hide();
			} else {
				$('#taxCalculation .added-box').hide();
				$('#taxCalculation .first-buy-box').hide();
			};
			$('#assess_target').val($('#valuationInput').val());
			$('#assess_unit_price').val(yf.$params().jUnitPrice + '元/㎡');
			$('#assess_total_price').val(yf.$params().jTotalPrice + '万元');

			layer.open({
				area: ['auto', 'auto'],
				type: 1,
				closeBtn: false,
				title: false,
				shade: [.6, '#000'],
				resize: false,
				content: $("#taxation_info_pop"),
				success: function () {
					$('#begin_assess').unbind('click').bind('click', function () {
						var original_value = $('#assess_oren_price').val();
						if (!/^\d*$/.test(original_value)) {
							layer.tips('原值应为正整数', '#assess_oren_price', { tips: [2, '#e84c3d'] });
							return;
						}
						if (Number(original_value) > Number(yf.$params().jTotalPrice)) {
							layer.tips('原值不能大于评估总价', '#assess_oren_price', { tips: [2, '#e84c3d'] });
							return;
						}
						_this.reckonFn();
					});
					yf.menuDown({ node: $('.icon-question-mark'), showNode: $('.explain-box') });
				},
				end: function () {
					// 关闭后要做的事情
					$('#taxCalculation').html('');
				}
			});
		},
		reckonFn: function () {
			var params = {
				city: yf.userInfo.city,
				overYears: $('#house_quality').val(),
				houseArea: yf.$params().houseArea,
				houseType: $('#house_type').val(),
				assessmentValue: yf.$params().jTotalPrice,
				fvId: yf.$params().valuationId,
				originalValue: $('#assess_oren_price').val(),
				firstHouse: $('#first_house').val(),
			};
			yf.loading('#calculator_result');
			server.getTaxation(params).success(function (data) {
				if (!yf.msg(data)) return;
				if (data.code == 200) {
					var sum = '';
					$("#deed_tax").text(yf.filterStr(data.data.deedTax)); //契税
					$("#value_added_tax").text(yf.filterStr(data.data.valueAddedTax));//增值税
					$("#personal_tax").text(yf.filterStr(data.data.personalTax));//个人所得税
					$("#litigation_costs").text(yf.filterStr(data.data.litigationCosts));//诉讼费
					$("#auction_tax").text(yf.filterStr(data.data.feeAuction));//拍卖费
					yf.filterStr(data.data.deedTax) == "--" ? data.data.deedTax = 0 : Number(data.data.deedTax);
					yf.filterStr(data.data.valueAddedTax) == "--" ? data.data.valueAddedTax = 0 : Number(data.data.valueAddedTax);
					yf.filterStr(data.data.personalTax) == "--" ? data.data.personalTax = 0 : Number(data.data.personalTax);
					yf.filterStr(data.data.litigationCosts) == "--" ? data.data.litigationCosts = 0 : Number(data.data.litigationCosts);
					yf.filterStr(data.data.feeAuction) == "--" ? data.data.feeAuction = 0 : Number(data.data.feeAuction);

					if (yf.userInfo.city == '北京') {
						sum = Number(data.data.deedTax) +
							Number(data.data.valueAddedTax) +
							Number(data.data.personalTax)
					} else {
						sum = Number(data.data.valueAddedTax) +
							Number(data.data.personalTax) +
							Number(data.data.litigationCosts) +
							Number(data.data.feeAuction)
					};

					$('#tax_sum').text(sum);
					yf.taxationNum = sum;//将税费存在对象中，确保其他页面在用的时候有值
					setTimeout(function () {
						yf.removeLoading('#calculator_result');
					}, 2000);
				};

			}).error(function (e) { })
		}
	}).init();

	layui.use(['form'], function () {
		var form = layui.form;
		form.render('select'); //刷新select选择框渲染
	});

})
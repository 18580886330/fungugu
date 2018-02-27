require([
	'src/components/surroundingHouse/js/surroundingHouse.server.js',
], function (server) {
	'use strict';
    /**
     * 模块入口
     */
	var main = ({
		init: function () {
			this.basicFn();
			/*this.initMapFn();*/
			return this;
		},
		basicFn: function () {
			var _this = this;
			var params = {
				city: yf.userInfo.city,
				comName: yf.param('housingName'),
				distance: 2000
			};
			yf.loading('#neighborhood');
			server.getSurHouse(params).success(function (data) {
				if (data.code == 200) {
					var len;
					var str = '';
					var arr = [];
					var avg;//平均值
					data.data.aroundPrice.length >= 6 ? len = 6 : len = data.data.length;
					for (var i = 0; i < len; i++) {
						arr.push(Number(data.data.aroundPrice[i].unitPrice));
					}
					arr.push(data.data.additionalInfo.unitPriceSelf);
					avg = Math.max.apply(null, arr);
					for (var i = 0; i < len; i++) {
						str += '<tr>\
        						<td class="sur-house-name" title="'+ data.data.aroundPrice[i].residentialAreaName + '">' + data.data.aroundPrice[i].residentialAreaName + '</td>\
        						<td>'+ data.data.aroundPrice[i].distance + '</td>\
        						<td><div class="layui-progress layui-progress-big" lay-showpercent="true">\
                           			 	<div class="layui-progress-bar layui-bg-blue" lay-percent="100%"  style="width:'+ Math.floor((Number(data.data.aroundPrice[i].unitPrice) / avg) * 100) + '%" ></div>\
                   					</div>\
                       			</td>\
                       			<td>'+ data.data.aroundPrice[i].unitPrice + '</td>\
        					</tr>'
					}
					str += '<tr>\
        						<td><p class="sur-house-name" title="'+ yf.param('housingName') + '">' + yf.param("housingName") + '</p><p>(本小区)</p></td>\
        						<td>--</td>\
        						<td><div class="layui-progress layui-progress-big" lay-showpercent="true">\
                           			 	<div class="layui-progress-bar layui-bg-red" lay-percent="100%"  style="width:'+ Math.floor((Number(data.data.additionalInfo.unitPriceSelf) / avg) * 100) + '%" ></div>\
                   					</div>\
                       			</td>\
                       			<td>'+ data.data.additionalInfo.unitPriceSelf + '</td>\
        					</tr>'
					$('#surround_list').html(str);

					layui.use(['element'], function () {
						var element = layui.element;
					});
					_this.initMapFn(data.data.additionalInfo, data.data.aroundPrice, len);

				} else {
					$('#surroundingMap').html('<div class="non-near-map">暂无临近小区分布地图</div>');
					$('#surround_list').html('<tr><td colspan="4"><div class="non-near">暂无临近小区信息</div></td></tr>');
				}
				yf.removeLoading('#neighborhood');
			}).error(function (res) {

			})
		},
		initMapFn: function (basicData, aroundData, len) {
			var map = new AMap.Map('surroundingMap', { resizeEnable: true });
			var infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
			var _this = this;
			for (var i = 0; i < len; i++) {
				var marker = new AMap.Marker({
					icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
					position: [aroundData[i].XLongitude, aroundData[i].YLatitude],
					map: map
				});
				marker.content = aroundData[i].residentialAreaName;
				marker.on('mouseover', function (e) {
					infoWindow.setContent(e.target.content);
					infoWindow.open(map, e.target.getPosition());
				});
			}
			var curMarker = new AMap.Marker({
				icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
				position: [basicData.XLongitude, basicData.YLatitude],
				map: map
			});
			curMarker.content = yf.param("housingName");
			curMarker.on('mouseover', function (e) {
				infoWindow.setContent(e.target.content);
				infoWindow.open(map, e.target.getPosition());
			});
			curMarker.emit('mouseover', { target: curMarker });
			map.setFitView();

			// 监听鼠标事件，防止滚动地图时触发到滚动条
			$('#surroundingMap').hover(function () {
				yf.stopMainScroll();
			}, function () {
				yf.updateMainScroll();
			});
		}
	}).init();
});

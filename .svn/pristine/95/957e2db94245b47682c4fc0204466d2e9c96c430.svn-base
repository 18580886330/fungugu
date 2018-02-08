require([
    'src/user/valuationRecord/js/valuationRecord.server.js',
], function(server) {
    'use strict';
    /**
     * 模块入口
     */
    var main = ({
        data: {},
        init: function(){
        	this.startDate="";
        	this.endDate="";
        	this.resTabelFn();
        	this.searchFn();
        	this.resetFn();
        	this.dateInitFn();
        	this.exportListFn();
        	this.areaDisPoseFn();
        	this.gainMechanisms();
        	layer.closeAll();
			yf.scroll({
			    elmId: '#his_evaluate'
			});
        	return this;
        },
        /*历史查询记录*/
        detailFN:function(data){
			var detailsPop = $('#details_popup');
        	layer.open({
        		type:1,
				title: false,
				area: ['auto', 'auto'],
				closeBtn: false,
				shadeClose: false,
				resize:false, 
				content: detailsPop,
				success:function() {
					$('#market_unit_price').text(yf.filterStr(data.shiChangDanJia));
					$("#market_total_price").text(yf.filterStr(data.shiChangZongJia));
					$("#evaluate_unit_price").text(yf.filterStr(data.diYaDanJia));
					$("#evaluate_total_price").text(yf.filterStr(data.diYaZongJia));
					$("#gu_time").text(yf.filterStr(data.xunJiaShiJian));
					
					$("#village_addr").val(yf.filterStr(data.xiaoQuDiZhi));              //小区地址
					$("#village_name").val(yf.filterStr(data.xiaoQuMingCheng));
					$("#village_city").val(yf.filterStr(data.chengShi));
					$("#village_district").val(yf.filterStr(data.xingZhengQu)); 					//行政区
					$("#village_zone").val(yf.filterStr(data.pianQu)); 					  //片区
					$("#village_building").val(yf.filterStr(data.louZhuangHao)); 	     //楼栋号
					$("#village_unit").val(yf.filterStr(data.danYuanHao)); 			     //单元号
					$("#village_code").val(yf.filterStr(data.huHao));                   //户号
					$("#village_area").val(yf.filterStr(data.mianJi)+'㎡');                      //面积
					$("#village_floor").val('所在'+yf.filterStr(data.suoZaiLouCeng)+'层'+'  '+'共'+yf.filterStr(data.zongLouCeng)+'层');  //楼层
					$("#village_direction").val(yf.filterStr(data.chaoXiang));                  //朝向
					$("#village_year").val(yf.filterStr(data.jianChengNianDai));                  //年
					$("#village_estates").val(yf.filterStr(data.wuYeLeiXing));                //物业类型
					$("#village_specil").val(yf.filterStr(data.teShuYinSu));                //特殊因素
					$("#village_benchmark").val(yf.filterStr(data.xiaoQuJiZhunJia));           //小区基准价
				},
				end: function(){
					detailsPop.hide();
				}
        	})
        },
        /*加载历史数据*/
        resTabelFn:function(cur){
        	var _self=this;
        	var jigou = $('#valuation_organ').siblings('.layui-form-select').find('.layui-anim-upbit').find('.layui-this').attr('lay-value');
        	var params={
        		city:yf.replaceHtml($('#local_city').val()),
        		comName:yf.replaceHtml($('#com_name').val()),
        		areaMin:$('#min_area').val(),
        		areaMax:$('#max_area').val(),
        		dateMin:yf.replaceHtml($('#begin_date').val()),
        		dateMax:yf.replaceHtml($('#end_date').val()),
        		pageNo:cur||1,//当前页
        		pageSize:10,  //每页10条
        		userId:jigou   //机构
        	};
        	if(jigou=='全部') params.userId='';
        	var iTip=layer.load(2, {shade: [0.1,'#000']});
        	server.getTableList(params).success(function(data){
        		layer.close(iTip);
        		if(data.code==200){
        			var str="";
        			if(data.data.list.length>0){
        				$('#detail_export').removeClass('layui-btn-disabled');
        				for(var i=0;i<data.data.list.length;i++){
	        				str+='<tr>\
								 <td width="80" class="text-center">'+yf.filterStr(data.data.list[i].chengShi)+'</td>\
								 <td width="260">\
									 <p>'+yf.filterStr(data.data.list[i].xiaoQuMingCheng)+'</p>\
									 <p>'+yf.filterStr(data.data.list[i].xunJiaShiJian)+'</p>\
								 </td>\
								 <td width="160">\
									 <p>总价：<span class="c-red">'+yf.filterStr(data.data.list[i].shiChangZongJia)+'</span>万元</p>\
									 <p>单价：<span class="c-red">'+yf.filterStr(data.data.list[i].shiChangDanJia)+'</span>元/㎡</p>\
								 </td>\
								 <td width="120">\
									 <p>面积：<span class="c-red">'+yf.filterStr(data.data.list[i].mianJi)+'</span>㎡</p>\
									 <p>朝向：<span>'+yf.filterStr(data.data.list[i].chaoXiang)+'</span></p>\
								 </td>\
								 <td width="120">\
									 <p>总楼层：'+yf.filterStr(data.data.list[i].zongLouCeng)+'层</p>\
									 <p>所在层：'+yf.filterStr(data.data.list[i].suoZaiLouCeng)+'层</p>\
								 </td>\
								 <td width="80">\
									 <a class="c-blue" href="javascript:" data-id="'+data.data.list[i].id+'">查看详情</a>\
								 </td>\
							 </tr>';
	        			}
	        			$('#his_detatil').html(str);
	        			$("#his_detatil tr:odd").css("background","#f9f9f9");
	        			_self.detailsFn();
	        			_self.pageFn('queryLogsPage',data.data.pageNum,data.data.total,"resTabelFn");
	        			
        			}else{
        				$('#his_detatil').html('<tr class="text-center"><td colspan="6">暂无数据</td></tr>');
        				$('#detail_export').addClass('layui-btn-disabled');
        			}
        			
        		}else{
        			$('#queryLogsPage').html('');
					$('#his_detatil').html('<tr class="text-center"><td colspan="6">暂无数据</td></tr>');  
					$('#detail_export').addClass('layui-btn-disabled');
					
        		}
        	}).error(function(){
        		layer.close(iTip);
        	})
        	
        },
        /*查看历史记录*/
        detailsFn:function(){
        	var _this=this;
        	$('#his_detatil tr td').find('a').unbind('click').bind('click',function(){
        		var id=$(this).attr('data-id')
        		var i=layer.load(2, {shade: [0.1,'#000']});
        		server.getLocalRecord(id).success(function(data){
        			if(!yf.msg(data)) {
        				layer.close(i);
        				return;
        			};
        			if(data.code==200){
        				_this.detailFN(data.data);
        				layer.close(i);
        			}
        		}).error(function(){
        			
        		})
        	})
        },
        /*条件查询*/
        searchFn:function(){
        	var _this=this;
        	var specilReg = /[~#^$@%&！!*]/;
        	$('#detail_search').click(function(){
        		var flag1=true,flag2=true;
        		var minArea = $('#min_area').val();
        		var maxArea = $('#max_area').val();
        		if($('#com_name').val()!=''&&specilReg.test($('#com_name').val())){
    				layer.tips('估值对象不能有特殊符号','#com_name',{tips: [2, '#666']});
    				return;
        		}
        		if($('#local_city').val()!=''&&specilReg.test($('#local_city').val())){
        			layer.tips('城市不能有特殊符号','#local_city',{tips: [2, '#666']});
        			return;
        		}
        		
        		if(minArea!=''){
        			flag1=_this.limitAreaFn('#min_area');
        		};
        		if(maxArea!=''){
        			flag2=_this.limitAreaFn('#max_area');
        		};
        		if(flag1&&flag2){
        			if(minArea!=''&&maxArea!=''){
        				if(Number(minArea)>Number(maxArea)){
	        				//当小面积大于大面积的时候
	        				$('#min_area').val(maxArea);
	        				$('#max_area').val(minArea);
        				}
        			}
        			_this.resTabelFn();
        		}
        	});
        },
        /*重置*/
       resetFn:function(){
       		var _this=this;
       		$('#detail_reset').click(function(){
       			//先判断各个项,若为空 就不用执行一下操作
       			var jigou = $('#valuation_organ').siblings('.layui-form-select').find('.layui-anim-upbit').find('.layui-this').attr('lay-value');
       			if(jigou=='全部'&&$('#begin_date').val()==''&&$('#end_date').val()==''&&$('#min_area').val()==''&&$('#max_area').val()==''&&$('#com_name').val()==''&&$('#local_city').val()=='') return;
       			
       			$('#detail_record').find('input').val(''); 
       			_this.endDate.config.min.year = _this.startDate.config.min.year;
				_this.endDate.config.min.month = _this.startDate.config.min.month;
				_this.endDate.config.min.date = _this.startDate.config.min.date;
				_this.startDate.config.max.year =  _this.endDate.config.max.year;
				_this.startDate.config.max.month = _this.endDate.config.max.month;
				_this.startDate.config.max.date =  _this.endDate.config.max.date;
				$('#valuation_organ').find("option[value='全部']").attr("selected","selected");
				 _this.form.render('select');
				// 重置完重新请求数据
				_this.resTabelFn();
				yf.placeholder();
       		});
       },
        /**分页(params)
         *id:当前分页的容器
         *curr:当前页码
         *total:总数
         *callback:回掉函数
         **/
       pageFn:function(id,curr,total,callBack){
       		var _self = this;
       		if(!this.layPage) {
       			layui.use(['laypage','form'],function() {
					 _self.layPage = layui.laypage;
					 _self.form = layui.form;
					 _self.form.render('select'); //刷新select选择框渲染
					 _self.page(id,curr,total,callBack);
				});
       		}else{
				_self.page(id,curr,total,callBack);
			}
       },
       page: function(id,curr,total,callBack) {
	       	var _self = this;
	       	this.layPage.render({
	             elem: id, //注意，这里的 test1 是 ID，不用加 # 号
	             curr: curr||1,
	             count: total,
	             limit: 10,            //每页显示的条数
	             layout:[ 'prev', 'page', 'next', 'skip','count'],
	             jump: function(obj,first){
	            	if (!first) {
	            		//_self[callBack].apply(_self,[obj.curr]);
	            		_self[callBack](obj.curr);
	            	}
	             }
	    	});
	    },
	    /*日期操作*/
	   dateInitFn:function(){
	   		var _this=this;
	   		layui.use(['laydate'], function(){
	   			//开始日期 结束日期
		      _this.startDate = layui.laydate.render({
					elem: '#begin_date',
					max:0,
					done:function(value,date){
					if( value !== '' ){
						_this.endDate.config.min.year = date.year;
						_this.endDate.config.min.month = date.month - 1;
						_this.endDate.config.min.date = date.date;
					}else{
						_this.endDate.config.min.year = _this.startDate.config.min.year;
						_this.endDate.config.min.month = _this.startDate.config.min.month;
						_this.endDate.config.min.date = _this.startDate.config.min.date;
						}
					}
				});
				_this.endDate = layui.laydate.render({
					elem: '#end_date',
					max:0,
					done:function(value,date){
						if( value !== '' ){
							_this.startDate.config.max.year = date.year;
							_this.startDate.config.max.month = date.month - 1;
							_this.startDate.config.max.date = date.date;
						}else{
							//选择清空按钮
							_this.startDate.config.max.year =  _this.endDate.config.max.year;
							_this.startDate.config.max.month = _this.endDate.config.max.month;
							_this.startDate.config.max.date =  _this.endDate.config.max.date;
						}
					}
					
				});
	   			
	   		})
	   },
	   /*导出*/
	  	exportListFn:function(){
	  		$('#detail_export').unbind('click').bind('click',function(){
	  			if($('#detail_export').hasClass('layui-btn-disabled')) return;
	  			var jigouId = $('#valuation_organ').siblings('.layui-form-select').find('.layui-anim-upbit').find('.layui-this').attr('lay-value');
		  		var params={
		  			city:yf.replaceHtml($('#local_city').val()),
	        		comName:yf.replaceHtml($('#com_name').val()),
	        		areaMin:$('#min_area').val(),
	        		areaMax:$('#max_area').val(),
	        		dateMin:yf.replaceHtml($('#begin_date').val()),
	        		dateMax:yf.replaceHtml($('#end_date').val()),
	        		userId:jigouId
		  		};
		  		if(params.userId=='全部') params.userId='';
				  var i=layer.load(2, {shade: [0.1,'#000']});
				  
		  		server.getExcelExport(params).success(function(data){
		  			if(!yf.msg(data)){
		  				layer.close(i);
		  				return;
		  			};
		  			if(data.code=='200') {
		  				layer.close(i);
						$('#exportDownload').attr('href',data.data);
		  				layer.open({
		  					type:'1',
		  					title: false,
		                    closeBtn: false,
		                    shadeClose: false,
		                    resize:false,
		                    area:['auto','auto'],
		                    content :$('#exportDownPop'),
		                    success:function(){
		                    	$('#exportDownload').off('click').click(function(){
		                    		layer.closeAll();
		                    		layer.msg('导出成功');
		                    	})
							},
							end: function() {
								$('#exportDownPop').hide();
							}
						});
		  			}
				}).error(function(res){});
				  
	  		})
	  		
	  	},
	  	/*面积的限制*/
	  	areaDisPoseFn:function(){
	  		var _this=this;
	  		$('#min_area').keyup(function(){
	  			_this.limitAreaFn('#min_area');
	  		});
	  		$('#max_area').keyup(function(){
	  			_this.limitAreaFn('#max_area');
	  		});
	  	},
	  	limitAreaFn:function(id){
	  		var area=$(id).val().replace(/\s+/g,'');
	  		var flag=true;
	  		if(area=='') return flag;
  			if(!/^(([1-9]\d{0,3}(\.\d{0,2})?)|9999)$/.test(area) || area > 9998.99) {
                $(id).val(area.length>=4?area.substr(0,4):area.substr(area.length-1));
                layer.tips("请输入面积为1~9998.99，只留两位小数！", id, {tips: [2, '#666']});
                flag=false;
                return flag;
            }
  			return flag;
	  	},
	  	/*获取机构*/
	  	gainMechanisms:function(subCity){
	  		var params = {
				moduleName:'询价记录关联',
			};
			var _this = this;
			var str ='<option value="全部">全部</option>';
			server.getMechanisms(params).success(function(data){
				if(data.success){
					if(yf.filterStr(data.data.organizationName)!='--'){
						str += '<option value="'+data.data.userId+'">'+data.data.organizationName+'</option>';
					}
					if(data.data.subordinateRelation.length>0){
						for(var i =0;i<data.data.subordinateRelation.length;i++){
							str+='<option value="'+data.data.subordinateRelation[i].SubaccountId+'">'+data.data.subordinateRelation[i].keHuDanWei+'</option>';
						};
					}
					$('#valuation_organ').html(str);
					layui.use(['form'],function() {
						 _this.form = layui.form;
						 _this.form.render('select'); //刷新select选择框渲染
					});
				}else{
					$('#valuation_organ').html(str);
					$('#valuation_organ').attr('disabled','disabled');
					$('#valuation_organ').removeAttr('lay-search');
					layui.use(['form'],function() {
						 _this.form = layui.form;
						 _this.form.render('select'); //刷新select选择框渲染
					});
				}
			})
			
			
	  	}
    }).init();
   
   
    
     
});

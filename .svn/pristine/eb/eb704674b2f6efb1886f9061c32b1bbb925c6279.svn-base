require([
    'src/components/artificialNuclearValence/js/artificialNuclearValence.server.js'
], function(server) {
	var main = ({
		init:function(){
			var _this = this;
			this.hrefUrl = window.location.href;
			this.showPopFn();     //人工核价弹窗
			yf.loadFile("src/content/js/third/webUpload/diyUpload.js",function(){
				_this.upPicInitFn();
			});
			this.upPicNum = 0;    //需要上传图片的数量
			this.hosuePicArr = []; //房本图片
			this.villPicArr = []; //小区图片
			this.otherPicArr = []; //小区图片
			this.doSubAllFn();
			$('#manmade_scroll').mCustomScrollbar({
	            scrollInertia: 180,
	            theme: "minimal-dark",
	            axis: "y",
	            callbacks:{
	            	whileScrolling:function(){
	            	 	layer.closeAll('tips');
	            	 }
	            }
			})
		},
		/*人工核价弹窗*/
		showPopFn:function(){
			var _this = this;
			
			//房产估值模块直接点击人工核价模块
			if(this.hrefUrl.indexOf('houseValuation') != -1&&$('#search_pop_affirm').is(':hidden')){
				$('#md_name').val($('#valuationInput').val());
				$('#md_area').val(yf.$params().houseArea);
				$('#md_house_type,#md_house_toward').hide();
				$('#md_Fhouse_type').val(yf.filterStr(yf.$params().estateType));
				$('#md_Fhouse_toward').val(yf.filterStr(yf.$params().toward));
				$('#md_year').val(yf.filterStr(yf.$params().year));
				$('#md_floor').val(yf.filterStr(yf.$params().floor));
				$('#md_totalFloor').val(yf.filterStr(yf.$params().sumFloor));
				$('#md_special').val(yf.filterStr(yf.$params().special));
				$('#md_baseInfo input,#md_baseInfo select').attr('disabled','disabled');
				$('#md_confirm_price').removeAttr('disabled');
			}else{
				//如果是直接点击人工核价 从弹出窗出来的
				$('#md_Fhouse_type,#md_Fhouse_toward').hide();
				$('#md_name').val($('#search_pop_initem').text());
				layui.use(['form'], function(){
				 	 var form = layui.form;
				 	 form.render('select'); //刷新select选择框渲染
				 	 var sId = $('#md_Fhouse_toward').siblings('.layui-unselect').find('.layui-anim');
				 	 yf.scroll({elmId:sId,height:'auto'});
	 			});
			}
			//核价记录模块
			if(this.hrefUrl.indexOf('auditPriceRecord') != -1){
				$('#md_Fhouse_type,#md_Fhouse_toward').hide();
				layui.use(['form'], function(){
				 	 var form = layui.form;
				 	 form.render('select'); //刷新select选择框渲染
				 	 var sId = $('#md_Fhouse_toward').siblings('.layui-unselect').find('.layui-anim');
				 	 yf.scroll({elmId:sId,height:'auto'});
	 			});
			}
			//如果是主页面
			if(this.hrefUrl.indexOf('layout') !=-1){
				$('#md_Fhouse_type,#md_Fhouse_toward').hide();
				$('#md_name').val($('#search_pop_initem').text());
				layui.use(['form'], function(){
				 	 var form = layui.form;
				 	 form.render('select'); //刷新select选择框渲染
				 	 var sId = $('#md_Fhouse_toward').siblings('.layui-unselect').find('.layui-anim');
				 	 yf.scroll({elmId:sId,height:'auto'});
	 			});
			}
			
			
			
			this.reckonPricFn();
			this.areaCalFn();
			layer.open({
					area: ['auto','auto'],
					type: 1,
					closeBtn: false,
					title: false,
					shade: [.6, '#000'],
					resize:false, 
					content: $("#artifical_info_pop"),
					success:function(){
						$('#search_pop_artificial').blur();
						$('#artifical_info_close').off('click').click(function(){
							layer.closeAll('tips');
						});
					},
					end:function(){
						$("#auditPriceRecord").html('');
					}
				})
			
		},
		/*初始化上传控件*/
		upPicInitFn:function(){
			this.uploadPic('#premises','房本图片');
			this.uploadPic('#village_pics','小区图片');
			this.uploadPic('#others_pics','其他图片');
		},
		/*上传图片*/
		uploadPic:function(id,title){
			var _this = this;
			$(id).diyUpload({
				url:'/api/v1/imageUpload',
				success:function( data ) {
					_this.upPicNum--;	
					switch(title){
						case '房本图片':
							_this.hosuePicArr.push(data.data);
						break;	
						case '小区图片':
							_this.villPicArr.push(data.data);
						break;
						case '其他图片':
							_this.otherPicArr.push(data.data);
						break;	
					}
					
					if(_this.upPicNum==0){
						_this.sendInfoFn();
					}
					
				},
				error:function( err ) {
					yf.removeLoading('#manmade_scroll');
				},
				//auto:true,
				formData:{imgType:title},
				buttonText : '选择图片',
				chunked:false,
				// 分片大小
				chunkSize:512 * 1024,
				//最大上传的文件数量, 总文件大小,单个文件大小(单位字节);
				fileNumLimit:2,
				fileSizeLimit:200 * 1024 * 1024,
				fileSingleSizeLimit:8 * 1024 * 1024
			});
		},
		//点击确认
		doSubAllFn:function(){
			var _this = this;
			$('#sendMI').off('click').click(function(){
				if(!_this.checkRuleFn()) return;
				yf.loading('#manmade_scroll');
				var picOli=$('.parentFileBox').find('.fileBoxUl li');
				var len=picOli.length;
				for(var i=0;i<len;i++){
					/*需要上传的图片*/
					if(picOli.eq(i).attr('data-reup')!=undefined){
						_this.upPicNum++;//需要上传图片的长度
						yf.loading('#manmade_scroll');
						$('.diyStart').trigger('click');
					}
				}
				
				if(_this.upPicNum==0){
					_this.sendInfoFn();
				}
			})
		},
		//提交数据
		sendInfoFn:function(){
			var _this = this;
			var params = {
				curCity:yf.userInfo.city,
				area:this.disposeStrFn(yf.replaceHtml($('#md_area').val())),
				comName:this.disposeStrFn(yf.replaceHtml($('#md_name').val())),
				priceType:'0', 			//价格类型 市场(0)or抵押(1)
				houseType:this.disposeStrFn(yf.replaceHtml($('#md_house_type').val())),  //物业类型
				floor:this.disposeStrFn(yf.replaceHtml($('#md_floor').val())),
				totalFloor:this.disposeStrFn(yf.replaceHtml($('#md_totalFloor').val())),
				toward:this.disposeStrFn(yf.replaceHtml($('#md_house_toward').val())),   //朝向
				specialFactors:this.disposeStrFn(yf.replaceHtml($('#md_special').val())),
				buildYear:this.disposeStrFn(yf.replaceHtml($('#md_year').val())),
				price:'',
				totalPrice:'',
				confirmPrice:this.disposeStrFn(yf.replaceHtml($('#md_confirm_price').val())),
				confirmTotalPrice:this.disposeStrFn(yf.replaceHtml($('#md_confirm_Tprice').val())),
				priceDY:'',
				priceZY:'',
				premisesPermitImgOne:this.hosuePicArr[0]==undefined?'':this.hosuePicArr[0],
				premisesPermitImgTwo:this.hosuePicArr[1]==undefined?'':this.hosuePicArr[1],
				comImgOne:this.villPicArr[0]==undefined?'':this.villPicArr[0],
				comImgTwo:this.villPicArr[1]==undefined?'':this.villPicArr[1],
				otherImgOne:this.otherPicArr[0]==undefined?'':this.otherPicArr[0],
				otherImgTwo:this.otherPicArr[1]==undefined?'':this.otherPicArr[1]
			};
			//房产估值模块
			if(this.hrefUrl.indexOf('houseValuation') != -1){
				params.price = yf.$params().jUnitPrice;
				params.totalPrice = yf.$params().jTotalPrice;
				if(params.price=="暂无价格"||params.price=="--")params.price='';
				if(params.totalPrice=="暂无价格"||params.totalPrice=="--")params.totalPrice='';
				params.toward = this.disposeStrFn($('#md_Fhouse_toward').val());
				params.houseType = this.disposeStrFn($('#md_Fhouse_type').val());
			};
			
			server.sendPriceFn(params).success(function(data){
				if(data.success){
					$('#go_chat').attr('href','./chatServer.html?bussinessID='+
                         data.data.bussinessId+"&recordID="+
                           data.data.recordId);
					layer.open({
		  					type:'1',
		  					title: false,
		                    closeBtn: false,
		                    shadeClose: false,
		                    resize:false,
		                    area:['auto','auto'],
		                    content :$('#toChat'),
		                    success:function(layero,index){
		                    	$('#go_chat').off('click').click(function(){
		                    		yf.removeLoading('#manmade_scroll');
		                    		layer.closeAll();
		                    		$('.layui-layer-shade').remove();
		                    	});
		                    	$('#artifical_info_close,#chat_close').off('click').click(function(){
		                    		layer.closeAll();
		                    		$('.layui-layer-shade').remove();
		                    	});
							},
							end: function() {
								$('#toChat').hide();
								yf.removeLoading('#manmade_scroll');
								$('#artifical_info_close').off('click');
							}
						});
					
				}else{
					layer.msg(data.msg,{time:3000},function(){
						yf.removeLoading('#manmade_scroll');
						layer.closeAll();
					});
					
				}
			}).error(function(res){yf.removeLoading('#manmade_scroll');})
		},
		//字段校验
		checkRuleFn:function(){
			var flag = true;
			var _this = this;
			this.getFieldsFn();
			var mdNameVal = this.mdName.val(), 
				mdAreaVal = this.mdArea.val(),  
				mdYearVal = this.mdYear.val();
				mdSzlcVal = this.mdSzlc.val(),
				mdZlcVal = this.mdZlc.val(),
				mdFkdjVal = this.mdFkdj.val(),
				sYear = new Date().getFullYear();
			if(this.hrefUrl.indexOf('auditPriceRecord') != -1||this.hrefUrl.indexOf('layout') != -1||
			  (this.hrefUrl.indexOf('houseValuation') != -1&&!$('#search_pop_affirm').is(':hidden'))
			){
				if(mdNameVal==''){
					this.misTipsFn('请输入核价对象',_this.mdName);
					flag = false;
					return;
				};
				if((/[~#^$@%&！!*]/.test(mdNameVal))){
					this.misTipsFn('核价对象不能有特殊字符',_this.mdName);
					flag = false;
					return;
				};
				if(!_this.limitAreaFn(mdAreaVal,_this.mdArea)) return;
				/*if(mdAreaVal==''){
					this.misTipsFn('请输入具体的建筑面积',_this.mdArea);
					flag = false;
					return;
				};
				if( !/^[1-9]\d{0,3}(\.\d{0,2})?$/.test( mdAreaVal ) || mdAreaVal > 9998.99 ){
					this.misTipsFn('请输入面积为1~9998.99，只留两位小数',_this.mdArea);
					flag = false;
		            return;
				};*/
				
				if( mdYearVal!='' && !/^\d{4}$/.test( mdYearVal ) ){
		            this.misTipsFn("请输入年代为1900~"+sYear+"的四位整数！",_this.mdYear);
					flag = false;
		            return;
		       };
		        if( mdYearVal!='' && (mdYearVal < 1900 || mdYearVal > sYear) ) {
		            this.misTipsFn("请输入年代为1900~"+sYear+"的四位整数！",_this.mdYear);
					flag = false;
		            return;
		        };
				
				if( mdSzlcVal!='' && !/^\d{1,2}$|-1$/.test(mdSzlcVal) ) {
		           	this.misTipsFn('所在楼层应该为-1或1~99！',_this.mdSzlc);
		            flag = false;
		            return;
		       	};
		        if( mdSzlcVal!='' && mdSzlcVal == '0' ) {
		        	this.misTipsFn('所在楼层应该为-1或1~99！',_this.mdSzlc);
		            flag = false;
		            return;
		        };
		        if( mdZlcVal!='' && !/^\d{0,2}$/.test(mdZlcVal) ) {
		            this.misTipsFn('总楼层应该为1~99！',_this.mdZlc);
		            flag = false;
		            return;
		        };
		        if( mdZlcVal!='' && mdZlcVal == '0' ) {
		          	this.misTipsFn('总楼层应该为1~99！',_this.mdZlc);
		            flag = false;
		            return;
		        };
		        if( (mdSzlcVal!='' && mdZlcVal!='') && Number(mdSzlcVal) > Number(mdZlcVal) ) {
		            this.misTipsFn('所在楼层不能大于总楼层！',_this.mdSzlc);
		            flag = false;
		            return;
		        };
			}
         	if((isNaN(mdFkdjVal) || 0 >= mdFkdjVal) && mdFkdjVal != '') {
                this.misTipsFn('请输入正确的单价！',_this.mdFkdj);
                flag = false;
                return;
            };
			return flag;
			
		},
		//总价的计算
		reckonPricFn:function(){
			var _this = this;
			$('#md_confirm_price').on('keyup',function(){
				if($("#md_area").val()!=''&&_this.limitAreaFn($("#md_area").val(),'#md_area')){
					var fkdj_tmp =$(this).val();
					if(fkdj_tmp==''){
						 $('#md_confirm_Tprice').val('');
						return;
					}
	                if((isNaN(fkdj_tmp) || 0>= fkdj_tmp) && fkdj_tmp!='')
	                    return layer.tips("请输入正确的单价！", "#md_confirm_price", {tips: [2, '#666']});
	                $('#md_confirm_Tprice').val(Math.round(fkdj_tmp*$("#md_area").val()/10000));
				}
				
			})
		},
		//验证字段的滚动
		misTipsFn:function(str,id){
			$('#manmade_scroll').mCustomScrollbar('scrollTo','top');
			setTimeout(function(){layer.tips(str,id,{tips: [1, '#666']})},300);
		},
		getFieldsFn:function(){
			this.mdName = $('#md_name');
			this.mdArea = $('#md_area');
			this.mdYear = $('#md_year');
			this.mdSzlc = $('#md_floor');
			this.mdZlc = $('#md_totalFloor');		
			this.mdFkdj = $('#md_confirm_price');
		},
		disposeStrFn:function(str){
			if(str=="--"||str=="请选择"){
				str="";
			}
			return str;
		},
		//面积的限制
		limitAreaFn:function(val,id){
			var flag = true;
			if(val==''){
				this.misTipsFn('请输入具体的建筑面积',id);
				flag = false;
				return;
			};
			if( !/^[1-9]\d{0,3}(\.\d{0,2})?$/.test( val ) || val > 9998.99 ){
				this.misTipsFn('请输入面积为1~9998.99，只留两位小数',id);
				flag = false;
	            return;
			};
			return flag;
		},
		//输入面积计算价格
		areaCalFn:function(){
			var _this = this;
			$('#md_area').keyup(function(){
				if(_this.limitAreaFn($('#md_area').val(),'#md_area')){
					var fkdj_tmp =$('#md_confirm_price').val();
					if(fkdj_tmp==''){ 
						$('#md_confirm_Tprice').val('');
						return;
					};
					 if((isNaN(fkdj_tmp) || 0>= fkdj_tmp) && fkdj_tmp!='')
	                    return layer.tips("请输入正确的单价！", "#md_confirm_price", {tips: [2, '#666']});
	                $('#md_confirm_Tprice').val(Math.round(fkdj_tmp*$("#md_area").val()/10000));
				}
			})
		}
	}).init();
	
	
})
require([
	'src/moduleAuthority/moduleExplain/js/moduleExplain.server.js',
	'src/moduleAuthority/moduleExplain/js/moduleDescription.js'
],function(server,mData){
	var main = ({
		init:function(){
			this.abilityType = '全部功能';//功能类型 防止用户一直切换一个值 dom不断加载
			this.showListFn();
		},
		showListFn:function(){
			var _this = this;
			this.marketList = $('#market_list');
			yf.loading('#market_list');
			server.getModuleExplain().success(function(data){
				yf.removeLoading('#market_list');
				if(!data.success) {
					layer.msg(data.msg);
					return;
				}
				var str='';
				for(var i=0;i<data.data.length;i++){
					str += '<li data-type="'+data.data[i].moduleType+'" data-open="'+data.data[i].isOpen+'">'+
								'<p class="market-title">'+data.data[i].moduleName+'</p>'+
								'<p class="market-describe">'+mData[data.data[i].moduleName]+'</p>';
					if(data.data[i].isOpen){
						str +='<p class="market-fd">'+
							  '<span class="fl c-light-blue">已开通  有效期至'+yf.filterStr(data.data[i].termOfValidity)+'</span>'+
							  '<a class="fr c-blue" href="javascript:;" data-name="'+data.data[i].moduleName+'" data-state="续费">续费延期</a></p></li>'
					}else{
						str +='<p><a class="layui-btn layui-btn-warm" data-name="'+data.data[i].moduleName+'" data-state="开通">立即开通</a></p></li>'	
					}
				}
				_this.marketList.html(str);
				_this.openAuthorityFn('#market_list');
				_this.showTbaleFn(data.data);
				layui.use('form', function(){
			  		var form = layui.form;
			  		form.render('select');
			  		form.on('select(ability-type)', function(data){
					    if(data.value== _this.abilityType) return;
					    $('#no_market').addClass('hide');
					    switch(data.value){
					  	    case '全部功能':
					  	   		_this.marketList.find('li').fadeIn();
					  			break;
					  		case '基础功能':	
					  			var oLis = _this.marketList.find('li');
					  			for(var j = 0;j<oLis.length;j++){
					  				if(oLis.eq(j).data().type=="extend"){
					  					oLis.eq(j).fadeOut();
					  				}else{
					  					oLis.eq(j).fadeIn();
					  				}
					  			}
					  			break;
					  		case '扩展功能':	
					  			var oLis = _this.marketList.find('li');
					  			for(var j = 0;j<oLis.length;j++){
					  				if(oLis.eq(j).data().type=="basics"){
					  					oLis.eq(j).fadeOut();
					  				}else{
					  					oLis.eq(j).fadeIn();
					  				}
					  			}
					  			break; 
					  		case '已开通功能':	
					  			var oLis = _this.marketList.find('li');
					  			var num = 0;
					  			for(var j = 0;j<oLis.length;j++){
					  				if(!oLis.eq(j).data().open){
					  					num++;
					  					oLis.eq(j).fadeOut();
					  				}else{
					  					oLis.eq(j).fadeIn();
					  				}
					  			};
					  			//如果都未开通的话
					  			if(num==oLis.length){
					  				//给予提示
					  				$('#no_market').removeClass('hide');
					  			};
					  			break;	
					    };
					    _this.abilityType=data.value;
					}); 
				});
				
				
			})
		},
		/*权限功能展示*/
		showTbaleFn:function(data){
			var str ='';
			for(var i = 0;i<data.length;i++){
				str+='<tr>'+
					 '<td>'+data[i].moduleName+'</td>';
				//如果是基础功能	 
				if(data[i].moduleType=="basics"){
					str+='<td class="fgg-icon">&#xe621;</td>'+
						 '<td><p class="line"></p></td>';
				}else{
					str+='<td><p class="line"></p></td>'+
						 '<td class="fgg-icon">&#xe621;</td>';
				};
				//开通与未开通的样式
				if(data[i].isOpen){
					str+='<td class="c-blue">已开通</td></tr>';
				}else{
					str+='<td><a class="layui-btn layui-btn-warm" href="javascript:;" data-name="'+data[i].moduleName+'" data-state="开通">立即开通</a></td></tr>';
				}
			}
			$('#market_table').html(str);
			$('#market_table tr:odd').css('background','#F9F9F9');
			this.openAuthorityFn('#market_table');
		},
		/*立即开通*/
		openAuthorityFn:function(id){
			//open_authority
			$(id).find('a').off('click').click(function(){
				var name = $(this).data().name;
				var state =$(this).data().state;
				layer.open({
					type:'1',
                    area: ['auto', 'auto'],
                    title: false,
                    closeBtn: false,
                    shadeClose: false,
                    content:$('#open_authority'),
                    success:function(){
                    	$('#authority_pop_name').text(name);
                    	$('#authority_pop_state').text(state);
                    },
                    end:function(){
                    	$('#open_authority').hide();
                    }
				})
			})
		}
	}).init();
	
})

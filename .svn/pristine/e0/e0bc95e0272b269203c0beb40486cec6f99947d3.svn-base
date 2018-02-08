require([
	'src/user/accountManagement/js/accountManagement.server.js',
], function(server) {
	"use strict";
	var main = ({
		init: function() {
			yf.loadFile('src/content/js/third/md5/md5.js');
			this.specilReg = /[~#^$@%&！!*]/;
			this.showAccountListFn();
			this.searchListFn();
			this.resetTermFn();
			this.addAccountFn();//添加子机构
		},
		/*账号弹框
		 *type 弹窗的title(默认添加，有参数时是修改)
		 * */
		showAccountPopFn: function(type,obj) {
			var accountPop = $('#account_popup');
			var _this = this;
			layer.open({
        		type:1,
				title: false,
				area: ['auto', 'auto'],
				closeBtn: false,
				shadeClose: false,
				resize:false, 
				content: accountPop,
				success:function(){
					_this.gainDataFn();
					//修改账号
					if(type){
						$('#account_tit').text('修改账号');
						_this.userName.attr('disabled','disabled');
						_this.userName.val(obj.keHuDengLuZhangHao);
						//_this.userPwd.val(obj.keHuMiMa);
						_this.fullName.val(obj.keHuMingCheng);
						_this.comp.val(obj.keHuDanWei);
						_this.department.val(obj.keHuBuMen);
					}else{
						$('#account_tit').text('添加账号');
						_this.userName.removeAttr('disabled');
					}
					
					$('#account_cancel').off('click').click(function(){
						layer.closeAll();
					});
					$('#account_ensure').off('click').click(function(){
						//验证字段
						if(_this.checkRuleFn(type,obj)){
							var params = {
								userName:yf.replaceHtml(_this.userName.val()),
								userPwd:hex_md5(yf.replaceHtml(_this.userPwd.val())),
								fullName:yf.replaceHtml(_this.fullName.val()),
								department:yf.replaceHtml(_this.department.val())
							};
							yf.loading('#account_body');
							//添加账号
							if(!type){
								server.addAccountUser(params).success(function(data){
									yf.removeLoading('#account_body');
									if(data.success){
										layer.closeAll();
										layer.msg(data.msg);
										_this.showAccountListFn();
									}else{
										layer.msg(data.msg);
									}
								})	
							}else{
								//判断用户是否修改过信息
								if(_this.userPwd.val()==''&&_this.fullName.val()==obj.keHuMingCheng&&_this.department.val()==obj.keHuBuMen){
										yf.removeLoading('#account_body');
										layer.closeAll();
										layer.msg('操作成功');
										return;
									}
								
								//修改账户
								params.operationType="modify";
								server.operateAccount(params).success(function(data){
									yf.removeLoading('#account_body');
									if(data.success){
										layer.closeAll();
										layer.msg(data.msg);
										_this.showAccountListFn();
									}else{
										layer.msg(data.msg);
									}
								});
							}
						}
					});
				},
				end:function(){
					//清空字段
					accountPop.find('input').val('');
					yf.removeLoading('#account_body');
					accountPop.hide();
				}
			})
		},
		/*获取弹出窗的值*/
		gainDataFn: function(){
			this.userName = $('#account_pop_userName');
			this.userPwd = $('#account_pop_userPass');
			this.fullName = $('#account_pop_fullName');
			this.comp = $('#account_pop_comp');
			this.department = $('#account_pop_department');
		},
		/*验证添加字段
		 *
		 * */
		checkRuleFn: function(type,obj){
			var _this = this;
			var flag = true;
			var passReg = /^(?!\D+$)(?![^a-zA-Z]+$)\S{8,16}$/;
			if(this.userName.val()==''){
				layer.tips('用户名不能为空',_this.userName,{tips: [2, '#666']});
				flag=false;
				return;
			};
			if(_this.specilReg.test(_this.userName.val())){
				layer.tips('用户名不能有特殊符号',_this.userName,{tips: [2, '#666']});
				flag=false;
				return;
			};
			//添加用户
			if(this.userPwd.val()==''&&!type){
				layer.tips('密码不能为空',_this.userPwd,{tips: [2, '#666']});
				flag=false;
				return;
			};
			//如果是修改账户
			if(type&&this.userPwd.val()!=''&&!yf.REGS.PASS_WORLD.test(_this.userPwd.val())){
				layer.tips('长度为8-16位，须为字母、数字和符号两种及以上的组合',_this.userPwd,{tips: [2, '#666']});
				flag=false;
				return;
			}
			//添加用户
			if(!type&&!yf.REGS.PASS_WORLD.test(_this.userPwd.val())){
				layer.tips('长度为8-16位，须为字母、数字和符号两种及以上的组合',_this.userPwd,{tips: [2, '#666']});
				flag=false;
				return;
			}
			if(this.fullName.val()==''){
				layer.tips("姓名不能为空！",_this.fullName,{tips: [2, '#666']});//提交验证
				flag=false;
				return;
			}
			if(_this.specilReg.test(_this.fullName.val())){
				layer.tips("姓名不能有特殊字符！", _this.fullName,{tips: [2, '#666']});//提交验证
				flag=false;
				return;
			}
			if(this.department.val()!=''&&_this.specilReg.test(_this.department.val())){
				layer.tips("部门不能有特殊字符！", _this.department,{tips: [2, '#666']});//提交验证
				flag=false;
				return;
			}
			return flag;
		},
		/*添加账号*/
		addAccountFn: function() {
			var _this = this;
			$('#account_add').off('click').click(function(){
				//先判断是否还能在添加子机构
				if($('#account_astrict').text()==0){
					layer.msg('已经达到上限不能再添加');
					return;
				}
				_this.showAccountPopFn();
			})
		},
		/*修改账号*/
		updataAccountFn: function(){
			var _this = this;
			$('#account_table').find('a[data-revise]').click(function(){
				var obj = JSON.parse($(this).attr('data-revise'));
				_this.showAccountPopFn('修改账号',obj);
				
			})
		},
		/*删除账号*/
		removeAccountFn: function(){
			var _this = this;
			$('#account_table').find('a[data-remove]').click(function(){
				var obj = JSON.parse($(this).attr('data-remove'));
				//_this.showAccountPopFn('修改账号',obj);
				var accountDelete = $('#account_delete');
				layer.open({
					type:1,
					title: false,
					area: ['auto', 'auto'],
					closeBtn: false,
					shadeClose: false,
					resize:false, 
					content: accountDelete,
					success:function(){
						$('#account_rev_cancel').off('click').click(function(){
							layer.closeAll();
						})
						var params = {
							operationType:'remove',
							userName:obj.keHuDengLuZhangHao
						}
						$('#account_rev_amend').off('click').click(function(){
							server.operateAccount(params).success(function(data){
								console.log(data);
								if(data.success){
									layer.closeAll();
									layer.msg(data.msg);
									_this.showAccountListFn();
								}else{
									layer.msg(data.msg);
								}
							})
						})
					},
					end:function(){
						accountDelete.hide();
					}
				})
				
			})
		},
		/*查询*/
		searchListFn: function(){
			var _this = this;
			this.userName = $('#account_name');
			this.fullName = $('#account_fullname');
			$('#account_search').click(function(){
				if(_this.userName.val()!=''&&$.trim(_this.userName.val())!=''&&_this.specilReg.test(_this.userName.val())){
					layer.tips('估值对象不能有特殊符号',_this.userName,{tips: [1, '#666']});
    				return;
				};
				if(_this.fullName.val()!=''&&$.trim(_this.fullName.val())!=''&&_this.specilReg.test(_this.fullName.val())){
					layer.tips('估值对象不能有特殊符号',_this.fullName,{tips: [1, '#666']});
    				return;
				};
				_this.showAccountListFn();
			});
		},
		/*重置*/
		resetTermFn: function(){
			var _this = this;
			$('#account_reset').click(function(){
				if(_this.userName.val()==''&&$.trim(_this.userName.val()=='')&&_this.fullName.val()==''&&$.trim(_this.fullName.val()=='')) return;
				_this.userName.val('');
				_this.fullName.val('');
				_this.showAccountListFn();
				yf.placeholder();
			})
		},
		/*展示账号列表*/
		showAccountListFn: function(cur){
			var params = {
				'pageNum':cur||1,
				'pageSize':10,
				'userName':yf.replaceHtml($('#account_name').val()),
				'fullName':yf.replaceHtml($('#account_fullname').val())
			};
			var _this = this;
			var iTip=layer.load(2, {shade: [0.1,'#000']});
			server.getAccountList(params).success(function(data){
				layer.close(iTip);
				if(!data.success){
					layer.msg(data.msg);
					return;
				};
				$('#account_have').text(yf.filterStr(data.data.subUserCount));
				$('#account_astrict').text(yf.filterStr(data.data.remainderCount));
				if(data.data.list.length>0){
					var str='';
					for(var i = 0;i<data.data.list.length;i++){
						str+='<tr>\
						<td width="200">\
							<p>用户名:'+yf.filterStr(data.data.list[i].keHuDengLuZhangHao)+'</p>\
							<p>姓名:'+yf.filterStr(data.data.list[i].keHuMingCheng)+'</p>\
						</td>\
						<td width="300">\
							<p>机构名称：'+yf.filterStr(data.data.list[i].keHuDanWei)+'</p>\
							<p>部门名称：'+yf.filterStr(data.data.list[i].keHuBuMen)+'</p>\
						</td>\
						<td class="text-center" width="80">\
							<a class="c-blue" href="javascript:;" data-revise='+JSON.stringify(data.data.list[i])+'>修改</a>&nbsp;\
							<a class="c-blue" href="javascript:;" data-remove='+JSON.stringify(data.data.list[i])+'>删除</a>\
						</td>';
					}
					$('#account_table').html(str);
					$("#account_table tr:odd").css("background","#f9f9f9");
					_this.updataAccountFn();
					_this.removeAccountFn();
					_this.pageFn('accountPages',data.data.pageNum,data.data.total,'showAccountListFn');
				}else{
					$('#accountPages').html('');
					$('#account_table').html('<tr class="text-center"><td colspan="6">暂无数据</td></tr>');
					return;
				}
				
			}).error(function(){
				layer.close(iTip);
			})
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
					// _self.form.render('select'); //刷新select选择框渲染
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
	    }
	}).init();

})
require(["src/user/accountManagement/js/accountManagement-f28370363b.server.js"],function(t){"use strict";({init:function(){yf.loadFile("src/content/js/third/md5/md5-4f4394c843.js"),this.specilReg=/[~#^$@%&！!*]/,this.showAccountListFn(),this.searchListFn(),this.resetTermFn(),this.addAccountFn()},showAccountPopFn:function(e,a){var c=$("#account_popup"),s=this;layer.open({type:1,title:!1,area:["auto","auto"],closeBtn:!1,shadeClose:!1,resize:!1,content:c,success:function(){s.gainDataFn(),e?($("#account_tit").text("修改账号"),s.userName.attr("disabled","disabled"),s.userName.val(a.keHuDengLuZhangHao),s.fullName.val(a.keHuMingCheng),s.comp.val(a.keHuDanWei),s.department.val(a.keHuBuMen)):($("#account_tit").text("添加账号"),s.userName.removeAttr("disabled")),$("#account_cancel").off("click").click(function(){layer.closeAll()}),$("#account_ensure").off("click").click(function(){if(s.checkRuleFn(e,a)){var c={userName:yf.replaceHtml(s.userName.val()),userPwd:hex_md5(yf.replaceHtml(s.userPwd.val())),fullName:yf.replaceHtml(s.fullName.val()),department:yf.replaceHtml(s.department.val())};if(yf.loading("#account_body"),e){if(""==s.userPwd.val()&&s.fullName.val()==a.keHuMingCheng&&s.department.val()==a.keHuBuMen)return yf.removeLoading("#account_body"),layer.closeAll(),void layer.msg("操作成功");c.operationType="modify",t.operateAccount(c).success(function(t){yf.removeLoading("#account_body"),t.success?(layer.closeAll(),layer.msg(t.msg),s.showAccountListFn()):layer.msg(t.msg)})}else t.addAccountUser(c).success(function(t){yf.removeLoading("#account_body"),t.success?(layer.closeAll(),layer.msg(t.msg),s.showAccountListFn()):layer.msg(t.msg)})}})},end:function(){c.find("input").val(""),yf.removeLoading("#account_body"),c.hide()}})},gainDataFn:function(){this.userName=$("#account_pop_userName"),this.userPwd=$("#account_pop_userPass"),this.fullName=$("#account_pop_fullName"),this.comp=$("#account_pop_comp"),this.department=$("#account_pop_department")},checkRuleFn:function(t,e){var a=!0;return""==this.userName.val()?(layer.tips("用户名不能为空",this.userName,{tips:[2,"#666"]}),void(a=!1)):this.specilReg.test(this.userName.val())?(layer.tips("用户名不能有特殊符号",this.userName,{tips:[2,"#666"]}),void(a=!1)):""!=this.userPwd.val()||t?t&&""!=this.userPwd.val()&&!yf.REGS.PASS_WORLD.test(this.userPwd.val())?(layer.tips("长度为8-16位，须为字母、数字和符号两种及以上的组合",this.userPwd,{tips:[2,"#666"]}),void(a=!1)):t||yf.REGS.PASS_WORLD.test(this.userPwd.val())?""==this.fullName.val()?(layer.tips("姓名不能为空！",this.fullName,{tips:[2,"#666"]}),void(a=!1)):this.specilReg.test(this.fullName.val())?(layer.tips("姓名不能有特殊字符！",this.fullName,{tips:[2,"#666"]}),void(a=!1)):""!=this.department.val()&&this.specilReg.test(this.department.val())?(layer.tips("部门不能有特殊字符！",this.department,{tips:[2,"#666"]}),void(a=!1)):a:(layer.tips("长度为8-16位，须为字母、数字和符号两种及以上的组合",this.userPwd,{tips:[2,"#666"]}),void(a=!1)):(layer.tips("密码不能为空",this.userPwd,{tips:[2,"#666"]}),void(a=!1))},addAccountFn:function(){var t=this;$("#account_add").off("click").click(function(){0!=$("#account_astrict").text()?t.showAccountPopFn():layer.msg("已经达到上限不能再添加")})},updataAccountFn:function(){var t=this;$("#account_table").find("a[data-revise]").click(function(){var e=JSON.parse($(this).attr("data-revise"));t.showAccountPopFn("修改账号",e)})},removeAccountFn:function(){var e=this;$("#account_table").find("a[data-remove]").click(function(){var a=JSON.parse($(this).attr("data-remove")),c=$("#account_delete");layer.open({type:1,title:!1,area:["auto","auto"],closeBtn:!1,shadeClose:!1,resize:!1,content:c,success:function(){$("#account_rev_cancel").off("click").click(function(){layer.closeAll()});var c={operationType:"remove",userName:a.keHuDengLuZhangHao};$("#account_rev_amend").off("click").click(function(){t.operateAccount(c).success(function(t){console.log(t),t.success?(layer.closeAll(),layer.msg(t.msg),e.showAccountListFn()):layer.msg(t.msg)})})},end:function(){c.hide()}})})},searchListFn:function(){var t=this;this.userName=$("#account_name"),this.fullName=$("#account_fullname"),$("#account_search").click(function(){""!=t.userName.val()&&""!=$.trim(t.userName.val())&&t.specilReg.test(t.userName.val())?layer.tips("估值对象不能有特殊符号",t.userName,{tips:[1,"#666"]}):""!=t.fullName.val()&&""!=$.trim(t.fullName.val())&&t.specilReg.test(t.fullName.val())?layer.tips("估值对象不能有特殊符号",t.fullName,{tips:[1,"#666"]}):t.showAccountListFn()})},resetTermFn:function(){var t=this;$("#account_reset").click(function(){""==t.userName.val()&&$.trim(""==t.userName.val())&&""==t.fullName.val()&&$.trim(""==t.fullName.val())||(t.userName.val(""),t.fullName.val(""),t.showAccountListFn(),yf.placeholder())})},showAccountListFn:function(e){var a={pageNum:e||1,pageSize:10,userName:yf.replaceHtml($("#account_name").val()),fullName:yf.replaceHtml($("#account_fullname").val())},c=this,s=layer.load(2,{shade:[.1,"#000"]});t.getAccountList(a).success(function(t){if(layer.close(s),t.success){if($("#account_have").text(yf.filterStr(t.data.subUserCount)),$("#account_astrict").text(yf.filterStr(t.data.remainderCount)),!(t.data.list.length>0))return $("#accountPages").html(""),void $("#account_table").html('<tr class="text-center"><td colspan="6">暂无数据</td></tr>');for(var e="",a=0;a<t.data.list.length;a++)e+='<tr>\t\t\t\t\t\t<td width="200">\t\t\t\t\t\t\t<p>用户名:'+yf.filterStr(t.data.list[a].keHuDengLuZhangHao)+"</p>\t\t\t\t\t\t\t<p>姓名:"+yf.filterStr(t.data.list[a].keHuMingCheng)+'</p>\t\t\t\t\t\t</td>\t\t\t\t\t\t<td width="300">\t\t\t\t\t\t\t<p>机构名称：'+yf.filterStr(t.data.list[a].keHuDanWei)+"</p>\t\t\t\t\t\t\t<p>部门名称："+yf.filterStr(t.data.list[a].keHuBuMen)+'</p>\t\t\t\t\t\t</td>\t\t\t\t\t\t<td class="text-center" width="80">\t\t\t\t\t\t\t<a class="c-blue" href="javascript:;" data-revise='+JSON.stringify(t.data.list[a])+'>修改</a>&nbsp;\t\t\t\t\t\t\t<a class="c-blue" href="javascript:;" data-remove='+JSON.stringify(t.data.list[a])+">删除</a>\t\t\t\t\t\t</td>";$("#account_table").html(e),$("#account_table tr:odd").css("background","#f9f9f9"),c.updataAccountFn(),c.removeAccountFn(),c.pageFn("accountPages",t.data.pageNum,t.data.total,"showAccountListFn")}else layer.msg(t.msg)}).error(function(){layer.close(s)})},pageFn:function(t,e,a,c){var s=this;this.layPage?s.page(t,e,a,c):layui.use(["laypage","form"],function(){s.layPage=layui.laypage,s.form=layui.form,s.page(t,e,a,c)})},page:function(t,e,a,c){var s=this;this.layPage.render({elem:t,curr:e||1,count:a,limit:10,layout:["prev","page","next","skip","count"],jump:function(t,e){e||s[c](t.curr)}})}}).init()});
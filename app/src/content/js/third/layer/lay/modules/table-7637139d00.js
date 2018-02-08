layui.define(["laytpl","laypage","layer","form"],function(e){"use strict";var t=layui.$,i=layui.laytpl,a=layui.laypage,l=layui.layer,n=layui.form,s=layui.hint(),o=layui.device(),r={config:{checkName:"LAY_CHECKED",indexName:"LAY_TABLE_INDEX"},cache:{},index:layui.table?layui.table.index+1e4:0,set:function(e){return this.config=t.extend({},this.config,e),this},on:function(e,t){return layui.onevent.call(this,c,e,t)}},d=function(){var e=this,t=e.config,i=t.id;return i&&(d.config[i]=t),{reload:function(t){e.reload.call(e,t)},config:t}},c="table",h=".layui-table-sort",u="layui-table-edit",f=function(e){return e=e||{},['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" ','{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>',"<thead>","{{# layui.each(d.data.cols, function(i1, item1){ }}","<tr>","{{# layui.each(item1, function(i2, item2){ }}",'{{# if(item2.fixed && item2.fixed !== "right"){ left = true; } }}','{{# if(item2.fixed === "right"){ right = true; } }}',e.fixed&&"right"!==e.fixed?'{{# if(item2.fixed && item2.fixed !== "right"){ }}':"right"===e.fixed?'{{# if(item2.fixed === "right"){ }}':"","{{# if(item2.checkbox){ }}",'<th data-field="{{ item2.field||i2 }}" data-type="checkbox" {{#if(item2.colspan){}} colspan="{{item2.colspan}}"{{#} if(item2.rowspan){}} rowspan="{{item2.rowspan}}"{{#}}} unresize="true"><div class="layui-table-cell laytable-cell-checkbox"><input type="checkbox" name="layTableCheckbox" lay-skin="primary" lay-filter="layTableAllChoose" {{# if(item2[d.data.checkName]){ }}checked{{# }; }}></div></th>',"{{# } else if(item2.space){ }}",'<th data-field="{{ item2.field||i2 }}" {{#if(item2.colspan){}} colspan="{{item2.colspan}}"{{#} if(item2.rowspan){}} rowspan="{{item2.rowspan}}"{{#}}} unresize="true"><div class="layui-table-cell laytable-cell-space"></div></th>',"{{# } else { }}",'<th data-field="{{ item2.field||i2 }}" {{#if(item2.colspan){}} colspan="{{item2.colspan}}"{{#} if(item2.rowspan){}} rowspan="{{item2.rowspan}}"{{#}}} {{# if(item2.unresize){ }}unresize="true"{{# } }}>',"{{# if(item2.colspan > 1){ }}",'<div class="layui-table-cell laytable-cell-group" {{#if(item2.align){}}align="{{item2.align}}"{{#}}}>','<span>{{item2.title||""}}</span>',"</div>","{{# } else { }}",'<div class="layui-table-cell laytable-cell-{{d.index}}-{{item2.field||i2}}" {{#if(item2.align){}}align="{{item2.align}}"{{#}}}>','<span>{{item2.title||""}}</span>',"{{# if(item2.sort){ }}",'<span class="layui-table-sort layui-inline"><i class="layui-edge layui-table-sort-asc"></i><i class="layui-edge layui-table-sort-desc"></i></span>',"{{# } }}","</div>","{{# } }}","</th>","{{# }; }}",e.fixed?"{{# }; }}":"","{{# }); }}","</tr>","{{# }); }}","</thead>","</table>"].join("")},y=['<table cellspacing="0" cellpadding="0" border="0" class="layui-table" ','{{# if(d.data.skin){ }}lay-skin="{{d.data.skin}}"{{# } }} {{# if(d.data.size){ }}lay-size="{{d.data.size}}"{{# } }} {{# if(d.data.even){ }}lay-even{{# } }}>',"<tbody></tbody>","</table>"].join(""),p=['<div class="layui-form layui-border-box {{d.VIEW_CLASS}}" lay-filter="LAY-table-{{d.index}}" style="{{# if(d.data.width){ }}width:{{d.data.width}}px;{{# } }} {{# if(d.data.height){ }}height:{{d.data.height}}px;{{# } }}">',"{{# var left, right; }}",'<div class="layui-table-header">',f(),"</div>",'<div class="layui-table-body layui-table-main">',y,"</div>","{{# if(left){ }}",'<div class="layui-table-fixed layui-table-fixed-l">','<div class="layui-table-header">',f({fixed:!0}),"</div>",'<div class="layui-table-body">',y,"</div>","</div>","{{# }; }}","{{# if(right){ }}",'<div class="layui-table-fixed layui-table-fixed-r">','<div class="layui-table-header">',f({fixed:"right"}),'<div class="layui-table-mend"></div>',"</div>",'<div class="layui-table-body">',y,"</div>","</div>","{{# }; }}","{{# if(d.data.page){ }}",'<div class="layui-table-tool">','<div class="layui-inline layui-table-page" id="layui-table-page{{d.index}}"></div>',"</div>","{{# } }}","<style>","{{# layui.each(d.data.cols, function(i1, item1){","layui.each(item1, function(i2, item2){ }}",".laytable-cell-{{d.index}}-{{item2.field||i2}}{ width:{{item2.width||50}}px }","{{# });","}); }}","</style>","</div>"].join(""),m=t(window),v=t(document),g=function(e){this.index=++r.index,this.config=t.extend({},this.config,r.config,e),this.render()};g.prototype.config={limit:30,loading:!0},g.prototype.render=function(e){var a;if(e&&(this.config=e),a=this.config,a.elem=t(a.elem),a.where=a.where||{},a.request=t.extend({pageName:"page",limitName:"limit"},a.request),a.response=t.extend({statusName:"code",statusCode:0,msgName:"msg",dataName:"data",countName:"count"},a.response),!a.elem[0])return this;var l=a.elem,n=l.next(".layui-table-view");a.height&&/^full-\d+$/.test(a.height)&&(this.fullHeightGap=a.height.split("-")[1],a.height=m.height()-this.fullHeightGap);var s=this.elem=t(i(p).render({VIEW_CLASS:"layui-table-view",data:a,index:this.index}));if(a.index=this.index,n[0]&&n.remove(),l.after(s),this.layHeader=s.find(".layui-table-header"),this.layMain=s.find(".layui-table-main"),this.layBody=s.find(".layui-table-body"),this.layFixed=s.find(".layui-table-fixed"),this.layFixLeft=s.find(".layui-table-fixed-l"),this.layFixRight=s.find(".layui-table-fixed-r"),this.layTool=s.find(".layui-table-tool"),a.height&&this.fullSize(),a.cols.length>1){var o=this.layFixed.find(".layui-table-header").find("th");o.height(this.layHeader.height()-1-parseFloat(o.css("padding-top"))-parseFloat(o.css("padding-bottom")))}this.pullData(1),this.events()},g.prototype.reload=function(e){this.config=t.extend({},this.config,e),this.render()},g.prototype.pullData=function(e,i){var a=this,n=a.config,s=n.request,o=n.response,r=function(){"object"==typeof n.initSort&&a.sort(n.initSort.field,n.initSort.type)};if(n.url){var d={};d[s.pageName]=e,d[s.limitName]=n.limit,t.ajax({type:n.method||"get",url:n.url,data:t.extend(d,n.where),dataType:"json",success:function(t){if(t[o.statusName]!=o.statusCode)return a.renderForm(),a.layMain.html('<div class="layui-none">'+(t[o.msgName]||"返回的数据状态异常")+"</div>");a.renderData(t,e,t[o.countName]),r(),i&&l.close(i),"function"==typeof n.done&&n.done(t,e,t[o.countName])},error:function(e,t){a.layMain.html('<div class="layui-none">数据接口请求异常</div>'),a.renderForm(),i&&l.close(i)}})}else if(n.data&&n.data.constructor===Array){var c={},h=e*n.limit-n.limit;c[o.dataName]=n.data.concat().splice(h,n.limit),c[o.countName]=n.data.length,a.renderData(c,e,n.data.length),r(),"function"==typeof n.done&&n.done(c,e,c[o.countName])}},g.prototype.page=1,g.prototype.eachCols=function(e){layui.each(this.config.cols,function(t,i){layui.each(i,function(a,l){e(a,l,[t,i])})})},g.prototype.renderData=function(e,n,s,o){var d=this,c=d.config,h=e[c.response.dataName]||[],u=[],f=[],y=[],p=function(){if(!o&&d.sortKey)return d.sort(d.sortKey.field,d.sortKey.sort,!0);layui.each(h,function(e,a){var l=[],n=[],s=[];0!==a.length&&(o||(a[r.config.indexName]=e),d.eachCols(function(e,o){var d=a[o.field||e];if(void 0!==d&&null!==d||(d=""),!(o.colspan>1)){var h=['<td data-field="'+(o.field||e)+'"'+function(){var e=[];return o.edit&&e.push(' data-edit="true"'),o.align&&e.push(' align="'+o.align+'"'),o.templet&&e.push(' data-content="'+d+'"'),o.toolbar&&e.push(' data-off="true"'),o.event&&e.push(' lay-event="'+o.event+'"'),o.style&&e.push(' style="'+o.style+'"'),e.join("")}()+">",'<div class="layui-table-cell laytable-cell-'+(o.checkbox?"checkbox":o.space?"space":c.index+"-"+(o.field||e))+'">'+(o.checkbox?'<input type="checkbox" name="layTableCheckbox" lay-skin="primary" '+function(){var e=r.config.checkName;return o[e]?(a[e]=o[e],o[e]?"checked":""):a[e]?"checked":""}()+">":o.toolbar?i(t(o.toolbar).html()||"").render(a):o.templet?i(t(o.templet).html()||String(d)).render(a):d),"</div></td>"].join("");l.push(h),o.fixed&&"right"!==o.fixed&&n.push(h),"right"===o.fixed&&s.push(h)}}),u.push('<tr data-index="'+e+'">'+l.join("")+"</tr>"),f.push('<tr data-index="'+e+'">'+n.join("")+"</tr>"),y.push('<tr data-index="'+e+'">'+s.join("")+"</tr>"))}),d.layBody.scrollTop(0),d.layMain.find("tbody").html(u.join("")),d.layFixLeft.find("tbody").html(f.join("")),d.layFixRight.find("tbody").html(y.join("")),d.renderForm(),d.syncCheckAll(),d.haveInit?d.scrollPatch():setTimeout(function(){d.scrollPatch()},50),d.haveInit=!0,l.close(d.tipsIndex)};return d.key=c.id||c.index,r.cache[d.key]=h,o?p():0===h.length?(d.renderForm(),d.layFixed.remove(),d.layMain.html('<div class="layui-none">无数据</div>')):(p(),void(c.page&&(d.page=n,d.count=s,a.render({elem:"layui-table-page"+c.index,count:s,groups:3,limits:c.limits||[10,20,30,40,50,60,70,80,90],limit:c.limit,curr:n,layout:["prev","page","next","skip","count","limit"],prev:'<i class="layui-icon">&#xe603;</i>',next:'<i class="layui-icon">&#xe602;</i>',jump:function(e,t){t||(d.page=e.curr,c.limit=e.limit,d.pullData(e.curr,d.loading()))}}),d.layTool.find(".layui-table-count span").html(s))))},g.prototype.renderForm=function(e){n.render(e||"checkbox","LAY-table-"+this.index)},g.prototype.sort=function(e,i,a,n){var o,d=this.config,u=d.elem.attr("lay-filter"),f=r.cache[this.key];"string"==typeof e&&this.layHeader.find("th").each(function(i,a){var l=t(this),n=l.data("field");if(n===e)return e=l,y=n,!1});try{var y=y||e.data("field");if(this.sortKey&&!a&&y===this.sortKey.field&&i===this.sortKey.sort)return;var p=this.layHeader.find("th .laytable-cell-"+d.index+"-"+y).find(h);this.layHeader.find("th").find(h).removeAttr("lay-sort"),p.attr("lay-sort",i||null),this.layFixed.find("th")}catch(e){return s.error("Table modules: Did not match to field")}this.sortKey={field:y,sort:i},"asc"===i?o=layui.sort(f,y):"desc"===i?o=layui.sort(f,y,!0):(o=layui.sort(f,r.config.indexName),delete this.sortKey),this.renderData({data:o},this.page,this.count,!0),l.close(this.tipsIndex),n&&layui.event.call(e,c,"sort("+u+")",{field:y,type:i})},g.prototype.loading=function(){var e=this.config;if(e.loading&&e.url)return l.msg("数据请求中",{icon:16,offset:[this.elem.offset().top+this.elem.height()/2-35-m.scrollTop()+"px",this.elem.offset().left+this.elem.width()/2-90-m.scrollLeft()+"px"],anim:-1,fixed:!1})},g.prototype.setCheckData=function(e,t){var i=this.config,a=r.cache[this.key];a[e]&&(a[e][i.checkName]=t)},g.prototype.syncCheckAll=function(){var e=this,t=e.config,i=e.layHeader.find('input[name="layTableCheckbox"]'),a=function(i){return e.eachCols(function(e,a){a.checkbox&&(a[t.checkName]=i)}),i};i[0]&&(r.checkStatus(e.key).isAll?(i[0].checked||(i.prop("checked",!0),e.renderForm()),a(!0)):(i[0].checked&&(i.prop("checked",!1),e.renderForm()),a(!1)))},g.prototype.getCssRule=function(e,t){var i=this,a=i.elem.find("style")[0],l=a.sheet||a.styleSheet,n=l.cssRules||l.rules;layui.each(n,function(a,l){if(l.selectorText===".laytable-cell-"+i.index+"-"+e)return t(l),!0})},g.prototype.fullSize=function(){var e,t=this.config,i=t.height;this.fullHeightGap&&((i=m.height()-this.fullHeightGap)<135&&(i=135),this.elem.css("height",i)),e=parseFloat(i)-parseFloat(this.layHeader.height())-1,t.page&&(e-=parseFloat(this.layTool.outerHeight()+1)),this.layBody.css("height",e)},g.prototype.scrollPatch=function(){var e=this.layMain.children("table"),i=this.layMain.width()-this.layMain.prop("clientWidth"),a=this.layMain.height()-this.layMain.prop("clientHeight");if(i&&a){if(!this.elem.find(".layui-table-patch")[0]){var l=t('<th class="layui-table-patch"><div class="layui-table-cell"></div></th>');l.find("div").css({width:i}),this.layHeader.eq(0).find("thead tr").append(l)}}else this.layHeader.eq(0).find(".layui-table-patch").remove();this.layFixed.find(".layui-table-body").css("height",this.layMain.height()-a),this.layFixRight[e.width()>this.layMain.width()?"removeClass":"addClass"]("layui-hide"),this.layFixRight.css("right",i-1)},g.prototype.events=function(){var e,a=this,n=a.config,s=t("body"),d={},f=a.layHeader.find("th"),y=n.elem.attr("lay-filter");f.on("mousemove",function(e){var i=t(this),a=i.offset().left,l=e.clientX-a;i.attr("colspan")>1||i.attr("unresize")||d.resizeStart||(d.allowResize=i.width()-l<=10,s.css("cursor",d.allowResize?"col-resize":""))}).on("mouseleave",function(){t(this);d.resizeStart||s.css("cursor","")}).on("mousedown",function(e){if(d.allowResize){var i=t(this).data("field");e.preventDefault(),d.resizeStart=!0,d.offset=[e.clientX,e.clientY],a.getCssRule(i,function(e){d.rule=e,d.ruleWidth=parseFloat(e.style.width)})}}),v.on("mousemove",function(t){if(d.resizeStart){if(t.preventDefault(),d.rule){var i=d.ruleWidth+t.clientX-d.offset[0];d.rule.style.width=i+"px",l.close(a.tipsIndex)}e=1}}).on("mouseup",function(t){d.resizeStart&&(d={},s.css("cursor",""),a.scrollPatch()),2===e&&(e=null)}),f.on("click",function(){var i,l=t(this),n=l.find(h),s=n.attr("lay-sort");if(!n[0]||1===e)return e=2;i="asc"===s?"desc":"desc"===s?null:"asc",a.sort(l,i,null,!0)}).find(h+" .layui-edge ").on("click",function(e){var i=t(this),l=i.index(),n=i.parents("th").eq(0).data("field");layui.stope(e),0===l?a.sort(n,"asc",null,!0):a.sort(n,"desc",null,!0)}),a.elem.on("click",'input[name="layTableCheckbox"]+',function(){var e=t(this).prev(),i=a.layBody.find('input[name="layTableCheckbox"]'),l=e.parents("tr").eq(0).data("index"),n=e[0].checked,s="layTableAllChoose"===e.attr("lay-filter");s?(i.each(function(e,t){t.checked=n,a.setCheckData(e,n)}),a.syncCheckAll(),a.renderForm()):(a.setCheckData(l,n),a.syncCheckAll()),layui.event.call(this,c,"checkbox("+y+")",{checked:n,data:r.cache[a.key][l],type:s?"all":"one"})}),a.layBody.on("mouseenter","tr",function(){var e=t(this).index();a.layBody.find("tr:eq("+e+")").addClass("layui-table-hover")}).on("mouseleave","tr",function(){var e=t(this).index();a.layBody.find("tr:eq("+e+")").removeClass("layui-table-hover")}),a.layBody.on("change","."+u,function(){var e=t(this),i=this.value,l=e.parent().data("field"),n=e.parents("tr").eq(0).data("index"),s=r.cache[a.key][n];s[l]=i,layui.event.call(this,c,"edit("+y+")",{value:i,data:s,field:l})}).on("blur","."+u,function(){var e,l=t(this),n=l.parent().data("field"),s=l.parents("tr").eq(0).data("index"),o=r.cache[a.key][s];a.eachCols(function(t,i){i.field==n&&i.templet&&(e=i.templet)}),l.siblings(".layui-table-cell").html(e?i(t(e).html()||this.value).render(o):this.value),l.parent().data("content",this.value),l.remove()}),a.layBody.on("click","td",function(){var e=t(this),i=(e.data("field"),e.children(".layui-table-cell"));if(!e.data("off")){if(e.data("edit")){var s=t('<input class="'+u+'">');return s[0].value=e.data("content")||i.text(),e.find("."+u)[0]||e.append(s),s.focus()}i.prop("scrollWidth")>i.outerWidth()&&(a.tipsIndex=l.tips(['<div class="layui-table-tips-main" style="margin-top: -'+(i.height()+16)+"px;"+("sm"===n.size?"padding: 4px 15px; font-size: 12px;":"lg"===n.size?"padding: 14px 15px;":"")+'">',i.html(),"</div>",'<i class="layui-icon layui-table-tips-c">&#x1006;</i>'].join(""),i[0],{tips:[3,""],time:-1,anim:-1,maxWidth:o.ios||o.android?300:600,isOutAnim:!1,skin:"layui-table-tips",success:function(e,t){e.find(".layui-table-tips-c").on("click",function(){l.close(t)})}}))}}),a.layBody.on("click","*[lay-event]",function(){var e=t(this),l=e.parents("tr").eq(0).data("index"),n=a.layBody.find('tr[data-index="'+l+'"]'),s=r.cache[a.key][l];layui.event.call(this,c,"tool("+y+")",{data:r.clearCacheKey(s),event:e.attr("lay-event"),tr:n,del:function(){r.cache[a.key][l]=[],n.remove(),a.scrollPatch()},update:function(e){e=e||{},layui.each(e,function(e,l){if(e in s){var o;s[e]=l,a.eachCols(function(t,i){i.field==e&&i.templet&&(o=i.templet)}),n.children('td[data-field="'+e+'"]').children(".layui-table-cell").html(o?i(t(o).html()||l).render(s):l)}})}}),n.addClass("layui-table-click").siblings("tr").removeClass("layui-table-click")}),a.layMain.on("scroll",function(){var e=t(this),i=e.scrollLeft(),n=e.scrollTop();a.layHeader.scrollLeft(i),a.layFixed.find(".layui-table-body").scrollTop(n),l.close(a.tipsIndex)}),m.on("resize",function(){a.fullSize(),a.scrollPatch()})},r.init=function(e,i){i=i||{};var a="Table element property lay-data configuration item has a syntax error: ";return t(e?'table[lay-filter="'+e+'"]':".layui-table[lay-data]").each(function(){var l=t(this),n=l.attr("lay-data");try{n=new Function("return "+n)()}catch(e){s.error(a+n)}var o=[],d=t.extend({elem:this,cols:[],data:[],skin:l.attr("lay-skin"),size:l.attr("lay-size"),even:"string"==typeof l.attr("lay-even")},r.config,i,n);e&&l.hide(),l.find("thead>tr").each(function(e){d.cols[e]=[],t(this).children().each(function(i){var l=t(this),n=l.attr("lay-data");try{n=new Function("return "+n)()}catch(e){return s.error(a+n)}var r=t.extend({title:l.text(),colspan:l.attr("colspan"),rowspan:l.attr("rowspan")},n);o.push(r),d.cols[e].push(r)})}),l.find("tbody>tr").each(function(e){var i=t(this),a={};i.children("td").each(function(e,i){var l=t(this),n=l.data("field");if(n)return a[n]=l.html()}),layui.each(o,function(e,t){var l=i.children("td").eq(e);a[t.field]=l.html()}),d.data[e]=a}),r.render(d)}),this},r.checkStatus=function(e){var t=0,i=[],a=r.cache[e];return a?(layui.each(a,function(e,a){a[r.config.checkName]&&(t++,i.push(r.clearCacheKey(a)))}),{data:i,isAll:t===a.length}):{}},d.config={},r.reload=function(e,i){var a=d.config[e];return a?r.render(t.extend({},a,i)):s.error("The ID option was not found in the table instance")},r.render=function(e){var t=new g(e);return d.call(t)},r.clearCacheKey=function(e){return e=t.extend({},e),delete e[r.config.checkName],delete e[r.config.indexName],e},r.init(),e(c,r)});
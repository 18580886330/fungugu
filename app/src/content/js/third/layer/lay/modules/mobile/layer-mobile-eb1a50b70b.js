layui.define(function(e){"use strict";window;var t=document,i="getElementsByClassName",n=function(e){return t.querySelectorAll(e)},s={type:0,shade:!0,shadeClose:!0,fixed:!0,anim:"scale"},a={extend:function(e){var t=JSON.parse(JSON.stringify(s));for(var i in e)t[i]=e[i];return t},timer:{},end:{}};a.touch=function(e,t){e.addEventListener("click",function(e){t.call(this,e)},!1)};var l=0,o=["layui-m-layer"],r=function(e){this.config=a.extend(e),this.view()};r.prototype.view=function(){var e=this.config,s=t.createElement("div");this.id=s.id=o[0]+l,s.setAttribute("class",o[0]+" "+o[0]+(e.type||0)),s.setAttribute("index",l);var a=function(){var t="object"==typeof e.title;return e.title?'<h3 style="'+(t?e.title[1]:"")+'">'+(t?e.title[0]:e.title)+"</h3>":""}(),r=function(){"string"==typeof e.btn&&(e.btn=[e.btn]);var t,i=(e.btn||[]).length;return 0!==i&&e.btn?(t='<span yes type="1">'+e.btn[0]+"</span>",2===i&&(t='<span no type="0">'+e.btn[1]+"</span>"+t),'<div class="layui-m-layerbtn">'+t+"</div>"):""}();if(e.fixed||(e.top=e.hasOwnProperty("top")?e.top:100,e.style=e.style||"",e.style+=" top:"+(t.body.scrollTop+e.top)+"px"),2===e.type&&(e.content='<i></i><i class="layui-m-layerload"></i><i></i><p>'+(e.content||"")+"</p>"),e.skin&&(e.anim="up"),"msg"===e.skin&&(e.shade=!1),s.innerHTML=(e.shade?"<div "+("string"==typeof e.shade?'style="'+e.shade+'"':"")+' class="layui-m-layershade"></div>':"")+'<div class="layui-m-layermain" '+(e.fixed?"":'style="position:static;"')+'><div class="layui-m-layersection"><div class="layui-m-layerchild '+(e.skin?"layui-m-layer-"+e.skin+" ":"")+(e.className?e.className:"")+" "+(e.anim?"layui-m-anim-"+e.anim:"")+'" '+(e.style?'style="'+e.style+'"':"")+">"+a+'<div class="layui-m-layercont">'+e.content+"</div>"+r+"</div></div></div>",!e.type||2===e.type){var c=t[i](o[0]+e.type);c.length>=1&&d.close(c[0].getAttribute("index"))}document.body.appendChild(s);var y=this.elem=n("#"+this.id)[0];e.success&&e.success(y),this.index=l++,this.action(e,y)},r.prototype.action=function(e,t){var n=this;e.time&&(a.timer[n.index]=setTimeout(function(){d.close(n.index)},1e3*e.time));var s=function(){0==this.getAttribute("type")?(e.no&&e.no(),d.close(n.index)):e.yes?e.yes(n.index):d.close(n.index)};if(e.btn)for(var l=t[i]("layui-m-layerbtn")[0].children,o=l.length,r=0;r<o;r++)a.touch(l[r],s);if(e.shade&&e.shadeClose){var c=t[i]("layui-m-layershade")[0];a.touch(c,function(){d.close(n.index,e.end)})}e.end&&(a.end[n.index]=e.end)};var d={v:"2.0 m",index:l,open:function(e){return new r(e||{}).index},close:function(e){var i=n("#"+o[0]+e)[0];i&&(i.innerHTML="",t.body.removeChild(i),clearTimeout(a.timer[e]),delete a.timer[e],"function"==typeof a.end[e]&&a.end[e](),delete a.end[e])},closeAll:function(){for(var e=t[i](o[0]),n=0,s=e.length;n<s;n++)d.close(0|e[0].getAttribute("index"))}};e("layer-mobile",d)});
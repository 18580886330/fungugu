layui.define("jquery",function(e){"use strict";var o=layui.$;e("util",{fixbar:function(e){var t,a,i=o(document),l=o("body");(e=o.extend({showHeight:200},e)).bar1=!0===e.bar1?"&#xe606;":e.bar1,e.bar2=!0===e.bar2?"&#xe607;":e.bar2,e.bgcolor=e.bgcolor?"background-color:"+e.bgcolor:"";var r=[e.bar1,e.bar2,"&#xe604;"],c=o(['<ul class="layui-fixbar">',e.bar1?'<li class="layui-icon" lay-type="bar1" style="'+e.bgcolor+'">'+r[0]+"</li>":"",e.bar2?'<li class="layui-icon" lay-type="bar2" style="'+e.bgcolor+'">'+r[1]+"</li>":"",'<li class="layui-icon layui-fixbar-top" lay-type="top" style="'+e.bgcolor+'">'+r[2]+"</li>","</ul>"].join("")),n=c.find(".layui-fixbar-top"),u=function(){i.scrollTop()>=e.showHeight?t||(n.show(),t=1):t&&(n.hide(),t=0)};o(".layui-fixbar")[0]||("object"==typeof e.css&&c.css(e.css),l.append(c),u(),c.find("li").on("click",function(){var t=o(this).attr("lay-type");"top"===t&&o("html,body").animate({scrollTop:0},200),e.click&&e.click.call(this,t)}),i.on("scroll",function(){clearTimeout(a),a=setTimeout(function(){u()},100)}))},countdown:function(e,o,t){var a=this,i="function"==typeof o,l=new Date(e).getTime(),r=new Date(!o||i?(new Date).getTime():o).getTime(),c=l-r,n=[Math.floor(c/864e5),Math.floor(c/36e5)%24,Math.floor(c/6e4)%60,Math.floor(c/1e3)%60];i&&(t=o);var u=setTimeout(function(){a.countdown(e,r+1e3,t)},1e3);return t&&t(c>0?n:[0,0,0,0],o,u),c<=0&&clearTimeout(u),u},timeAgo:function(e,o){var t=(new Date).getTime()-new Date(e).getTime();return t>2592e6?(t=new Date(e).toLocaleString(),o&&(t=t.replace(/\s[\S]+$/g,"")),t):t>=864e5?(t/1e3/60/60/24|0)+"天前":t>=36e5?(t/1e3/60/60|0)+"小时前":t>=18e4?(t/1e3/60|0)+"分钟前":t<0?"未来":"刚刚"}})});
layui.define(function(e){"use strict";var r={open:"{{",close:"}}"},n={exp:function(e){return new RegExp(e,"g")},query:function(e,n,c){var o=["#([\\s\\S])+?","([^{#}])*?"][e||0];return t((n||"")+r.open+o+r.close+(c||""))},escape:function(e){return String(e||"").replace(/&(?!#?[a-zA-Z0-9]+;)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/'/g,"&#39;").replace(/"/g,"&quot;")},error:function(e,r){return"object"==typeof console&&console.error("Laytpl Error："+e+"\n"+(r||"")),"Laytpl Error："+e}},t=n.exp,c=function(e){this.tpl=e};c.pt=c.prototype,window.errors=0,c.pt.parse=function(e,c){var o=this,p=e,a=t("^"+r.open+"#",""),l=t(r.close+"$","");e='"use strict";var view = "'+(e=e.replace(/\s+|\r|\t|\n/g," ").replace(t(r.open+"#"),r.open+"# ").replace(t(r.close+"}"),"} "+r.close).replace(/\\/g,"\\\\").replace(/(?="|')/g,"\\").replace(n.query(),function(e){return'";'+(e=e.replace(a,"").replace(l,"")).replace(/\\/g,"")+';view+="'}).replace(n.query(1),function(e){var n='"+(';return e.replace(/\s/g,"")===r.open+r.close?"":(e=e.replace(t(r.open+"|"+r.close),""),/^=/.test(e)&&(e=e.replace(/^=/,""),n='"+_escape_('),n+e.replace(/\\/g,"")+')+"')}))+'";return view;';try{return o.cache=e=new Function("d, _escape_",e),e(c,n.escape)}catch(e){return delete o.cache,n.error(e,p)}},c.pt.render=function(e,r){var t;return e?(t=this.cache?this.cache(e,n.escape):this.parse(this.tpl,e),r?void r(t):t):n.error("no data")};var o=function(e){return"string"!=typeof e?n.error("Template not found"):new c(e)};o.config=function(e){e=e||{};for(var n in e)r[n]=e[n]},o.v="1.2.0",e("laytpl",o)});
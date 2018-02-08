;(function(w){
	w.comboBuyServer = w.comboBuyServer || {
		getPropertyTaxes:function(form){
			var param = {

			};
			return $.ajax({
				type: 'post',
				//url: "/house/getPropertyTaxes",
				data: form,
				beforeSend: function(request) {
					/*yf.load = layer.load(2);
                    request.setRequestHeader("token", yf.getCookie('token'));*/
                },
				complete: function(){
					//layer.close(yf.load);
				},
				dataType: 'json'
			});
		}
	};
	return w.comboBuyServer;
})(window);
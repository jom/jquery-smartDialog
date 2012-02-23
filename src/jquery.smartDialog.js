/* jQuery Smart Dialog
*/
(function($){

  $.widget("jom.smartDialog", {

    options: {
    	'dialog': {
    		'title':'',
    		'width':'700px',
    		'height':'auto',
    		'autoOpen':false,
    		'bgiframe':true,
    		'position':'top',
    		'buttons':null,
    		'modal':true,
    		'content': {
    			'url':	null,
    			'loadOnce':false,
    			'loadingMessage': 'Loading...',
    			'ajaxOptions': {
    				'data':[]
    			}
    		}
    	},
    	'form': {
    		'id':false,
    		'submitLabel':'Submit',
    		'cancelLabel':'Cancel',
    		'ajax':false,
    		'ajaxOptions': {
    			'context': null,
    		}
    	},
    	'button': {
    		'onClick':null,
    		'binder':'live'
    	}
    },

    _create: function(){
    	var self = this;
    	
    	var d = jQuery.extend(true, {}, this.options.dialog);
    	d.open = function () {
    		if($(this).data("popup-status")) {
				if($(":has(.status_box)", this).size() == 0){
					$(this).prepend('<ul class="status_box"></ul>');
				}
				$(".status_box", this).show().html($(this).data("popup-status").replace(/([^>\\r\\n]*)(\\r\\n|\\n\\r|\\r|\\n)/g, '<li>\$1</li>')).effect('pulsate');
				$(this).removeData("popup-status");
			}
			if($(this).data("popup-error")) {
				if($(":has(.error_box)", this).size() == 0){
					$(this).prepend('<ul class="error_box"></ul>');
				}
				$(".error_box", this).show().html($(this).data("popup-error").replace(/([^>\\r\\n]*)(\\r\\n|\\n\\r|\\r|\\n)/g, '<li>\$1</li>')).effect('pulsate');
				$(this).removeData("popup-error");
			}
    	}
		if (this.options.form.id) {
			d.buttons = {};
				
			if (this.options.form.ajax) {
				if (!self.options.form.ajaxOptions.context) {
					self.options.form.ajaxOptions.context = $("#"+ self.options.dialog.id);
				}
				$("#"+self.options.form.id).live('submit', function(){
					$("#"+self.options.form.id).dialog("close");
					self.options.form.ajaxOptions.success = function(result) {
						if (result.formError) {
							$("#"+ self.options.dialog.id).data('popup-error', result.formError);
							$("#"+ self.options.dialog.id).dialog("open");
						}
					}
					$(this).ajaxSubmit(self.options.form.ajaxOptions);
					return false;
				});
			}
			
			d.buttons[this.options.form.submitLabel] = function () {
				$("#"+self.options.form.id).submit();
				$(this).dialog("close");
			}
			d.buttons[this.options.form.cancelLabel] = function () {
				if($("#"+self.options.form.id)[0] != undefined){
					$("#"+self.options.form.id)[0].reset(); 
				} 
				$("#"+self.options.form.id).find(".error_box").remove();
				$(this).dialog("close");
			}
		}
    	$("#"+ this.options.dialog.id).dialog(d);
		this.element.click(function(){
			if(self.options.dialog.content.url != undefined && !(self.options.dialog.content.loadOnce && $("#"+ self.options.dialog.id).data('loaded'))) {
				var url = self.options.dialog.content.url;
				if (url == true && self.element.attr("href") != undefined) {
					url = self.element.attr("href");
				}
				$("#"+ self.options.dialog.id).data('loaded', true);
				self.options.dialog.content.ajaxOptions.success = function(data) {
					$("#"+ self.options.dialog.id).html(data.content);
				};
				$("#"+ self.options.dialog.id).html(self.options.dialog.content.loadingMessage);
				$.ajax(url, self.options.dialog.content.ajaxOptions);
			}
			$("#"+ self.options.dialog.id).dialog("open");
			return false;
		});
    },

  });
})(jQuery);

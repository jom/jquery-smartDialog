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
    			'ajaxOptions': {
    				'notify':false,
    				'data':[]
    			}
    		}
    	},
    	'form': {
    		'id':false,
    		'submitLabel':'Submit',
    		'ajax':false,
    		'ajaxOptions': {
    			'notifyMessage':'Saving...',
    			'context':'this'
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
    	$("#"+ this.options.dialog.id).dialog(d);
		
		this.element.click(function(){
			if(self.options.dialog.content.url != undefined && !(self.options.dialog.content.loadOnce && $("#"+ self.options.dialog.id).data('loaded'))) {
				var url = self.options.dialog.content.url;
				if (url == true && self.element.attr("href") != undefined) {
					url = self.element.attr("href");
				}
				$("#"+ self.options.dialog.id).data('loaded', true);
				console.log(self.options.dialog.content.ajaxOptions);
				self.options.dialog.content.ajaxOptions.success = function(data) {
					$("#"+ self.options.dialog.id).html(data.content);
				};
				$.ajax(url, self.options.dialog.content.ajaxOptions);
			}
			$("#"+ self.options.dialog.id).dialog("open");
			return false;
		});
    },

  });
})(jQuery);

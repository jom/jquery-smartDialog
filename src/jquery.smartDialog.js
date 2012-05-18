/* jQuery smartDialog Widget 1.0 by Jacob Morrison
 * http://projects.ofjacob.com
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
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
    				'dataType': 'json',
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
    			'dataType': 'json',
    			'context': null
    		}
    	},
    	'button': {
    		'onClick':null,
    		'binder':'bind' /* bind, "on", or live */
    	}
    },
	_setForm: function() {
    	var self = this;
		$("#"+self.options.dialog.id + " form input:not(.noEnterSubmit)").keypress(function (e) {
			if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
				console.log("oops");
				$("#"+ self.options.dialog.id +" ~ .ui-dialog-buttonpane button").first().click();
				return false;
			} else {
				return true;
			}
		});

		if (this.options.form.ajax) {
			if (!self.options.form.ajaxOptions.context) {
				self.options.form.ajaxOptions.context = $("#"+ self.options.dialog.id);
			}
			$("#"+self.options.dialog.id + " #"+self.options.form.id).bind('submit', function(event){
				$("#"+self.options.dialog.id).dialog("close");
				self.options.form.ajaxOptions.success = function(result) {
					if (result.formError) {
						$("#"+ self.options.dialog.id).data('popup-error', result.formError);
						$("#"+ self.options.dialog.id).dialog("open");
						self._setForm();
					}
				}
				$(this).ajaxSubmit(self.options.form.ajaxOptions);
				return false;
			});
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

    	/* Bind Button */

		$(this.element)[self.options.button.binder]("click", function(event){
			if(self.options.dialog.content.url != undefined && !(self.options.dialog.content.loadOnce && $("#"+ self.options.dialog.id).data('loaded'))) {
				var url = self.options.dialog.content.url;
				if (url == true && self.element.attr("href") != undefined) {
					url = self.element.attr("href");
				}
				$("#"+ self.options.dialog.id).data('loaded', true);
				self.options.dialog.content.ajaxOptions.success = function(data) {
					if (data.error) {
						$("#"+ self.options.dialog.id).dialog("close");
					} else {
						$("#"+ self.options.dialog.id).html(data.content);
						$(document).trigger('prepare', "#"+ self.options.dialog.id);
						self._setForm();
						$("#"+ self.options.dialog.id +" ~ .ui-dialog-buttonpane button").button("enable");
					}
				};
				$("#"+ self.options.dialog.id).html(self.options.dialog.content.loadingMessage);
				$("#"+ self.options.dialog.id +" ~ .ui-dialog-buttonpane button").button("disable");
				$.ajax(url, self.options.dialog.content.ajaxOptions);
			} else if(self.options.dialog.content.url == undefined) {
				if(!$("#"+ self.options.dialog.id).data('loaded')) {
					$("#"+ self.options.dialog.id).data('loaded', true);
					self._setForm();
				}
			}

			$("#"+ self.options.dialog.id).dialog("open");
			event.stopPropagation();
			return false;
		});
    }

  });
})(jQuery);

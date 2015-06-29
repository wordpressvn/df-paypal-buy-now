import { decorateCooked } from 'discourse/lib/plugin-api';
let _buttonsMap;
export default {name: 'df-paypal-buy-now', after: 'inject-objects', initialize: function (container) {
	if (Discourse.SiteSettings['«PayPal_Buy_Now»_Enabled']) {
		decorateCooked(container, function($post) {
			if (!_buttonsMap) {
				var valueS = Discourse.SiteSettings['«PayPal_Buy_Now»_Button_Code'];
				/** @type {Object[]} */
				var items;
				try {
					/** @link http://caniuse.com/#feat=json */
					items = JSON.parse(valueS);
				}
				catch (ignore) {
					// Legacy support.
					/** @type {String[]} */
					var htmlA = valueS && valueS.length ? valueS.split("\n") : [];
					items = [];
					htmlA.forEach(function(html, index) {
						items.push({id: 'paypal-' + (1 + index), html: html});
					});
				}
				_buttonsMap = [];
				items.forEach(function(item) {
					_buttonsMap[item.id] = item.html;
				});
			}
			$('.df-paypal-button', $post).each(function() {
				var classesA = this.className.split(/\s+/);
				if (classesA.length) {
					var id = classesA[classesA.length - 1];
					var html = _buttonsMap[id];
					if (html) {
						$(this).html(html);
					}
				}
			});
		});
	}
}};
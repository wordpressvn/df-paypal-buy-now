function textPostProcess(content, state) {
	var button, result;
	if (button = state.md.options.discourse.dfPayPalButtons[content]) {
		// 2018-01-18 I have used this code as an example of a `html_block` usage:
		// https://github.com/valeriangalliat/markdown-it-anchor/blob/v4.0.0/index.js#L27
		result = new state.Token('html_block', '', 0);
		result.content = '<div class="df-paypal-button ' + button + '"></div>';
	}
	return result;
}

// 2019-12-09
// 1) «_.zipObject is not a function»: https://github.com/discourse-pro/df-paypal-buy-now/issues/3
// 2) Discourse uses a reduced version of Lodash (without `zipObject`).
function zipObject(a) {
	var r = {};
	const l = a.length;
	for (var i = 0; i < l; i++) {
		var v = a[i];
		r[v[0]] = v[1];
	}
	return r;
}

export function setup(helper) {
	helper.registerOptions((opts, siteSettings) => {
		var valueS = siteSettings['«PayPal_Buy_Now»_Button_Code'];
		/** @type {Object[]} */ var items;
		try {items = JSON.parse(valueS);}
		catch(ignore) {items = [];}
		// 2019-12-08 «_.object is not a function»: https://github.com/discourse-pro/df-paypal-buy-now/issues/2
		opts.dfPayPalButtons = zipObject(_.map(items, item => ['[' + item.id + ']', item.id]));
	});
	helper.whiteList({custom(tag, name, value) {
		return 'div' === tag && 'class' == name && 0 === value.indexOf('df-');
	}});
	helper.registerPlugin(md => {
		md.core.ruler.push('df-paypal-buy-now', state => md.options.discourse.helpers.textReplace(
			state, (content, state) => textPostProcess(content, state), true
		));
	});
}
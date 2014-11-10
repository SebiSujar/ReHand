/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'rFont\'">' + entity + '</span>' + html;
	}
	var icons = {
		'ricon-doctor': '&#xe600;',
		'ricon-pencil': '&#xe606;',
		'ricon-users': '&#xe601;',
		'ricon-expand': '&#xe607;',
		'ricon-cog': '&#xe602;',
		'ricon-exit': '&#xe603;',
		'ricon-trash': '&#xe608;',
		'ricon-back': '&#xe604;',
		'ricon-new-user': '&#xe605;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/ricon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());

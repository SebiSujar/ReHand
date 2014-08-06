window.onload = function() {
	<!--  selecciono la clase javascript -->
    var javascript = document.querySelector('.javascript');
    
    new EasyPieChart(javascript, {
			<!-- activo la animación y establezco su duración a un segundo -->
			animate: ({ duration: 10000, enabled: true }),
			<!-- aumento la longitud de las lineas de la gráfica -->
			scaleLength:10,
			<!-- aumento el tamaño de la gráfica -->
			size:150,

			<!-- añado el número del porcentaje que se muestra en el span -->
			onStep: function(from, to, percent) {
				this.el.children[0].innerHTML = Math.round(percent)+"%";
			}
    });
}

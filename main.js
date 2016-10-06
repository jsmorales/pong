/*3 objetos
tablero
2 barras
pelota
*/

//funcion anonima que se ejecuta a si misma para no contaminar el scope general

//clase Tablero "modelo"
(function(){

	//se define el tablero como una "clase"
	self.Tablero = function(alto,ancho){
		//setea alto ancho
		this.alto = alto;
		this.ancho = ancho;
		//variable booleanas
		this.jugando = false;
		this.juego_terminado = false;
		this.barras = [];
		this.pelota = null;
	}

	//se modifica el prototype de Tablero para 
	//poder modificar los metodos del mismo.
	//esto permite declarar diferentes
	self.Tablero.prototype = {
		get elementos(){
			var elementos = this.barras
			elementos.push(pelota);
			//regresa todos los elementos
			return elementos;
		}
	}

})();

//vista del tablero "vista"
(function(){

	self.TableroVista = function(canvas,tablero){
		this.canvas = canvas;
		this.canvas.width = tablero.ancho;
		this.canvas.height = tablero.alto;
		this.tablero = tablero;
		//el contexto es por medio de lo cual se pueden dibujar
		//los elementos.
		this.contexto = canvas.getContext("2d");
	}

})();

//modelo de las barras
(function(){

	self.Barra = function(x,y,ancho,alto,tablero){
		//en donde va estar
		this.x = x;
		this.y = y;

		//que tamaño
		this.width = ancho;
		this.height = alto;

		//en donde va a estar
		this.tablero = tablero;

		//se cargan las barras dentro del tablero
		this.tablero.barras.push(this);
	}

})();

//se añade un listener para que se ejecute cuando cargue la ventana

window.addEventListener("load",main);

//controlador
function main(){

	//se intancia la clase Tablero
	var tablero = new Tablero(400,800);
	console.log(tablero);
	//se obtiene el canvas del DOM
	var canvas = document.getElementById('canvas');
	//se intancia la vista del tablero con el canvas y el tablero instanciado
	var vista_tablero = new TableroVista(canvas,tablero);
}
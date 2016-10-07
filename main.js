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
			//se crea una copia de este array ya que 
			//si se iguala carga la memoria y estalla
			var elementos = this.barras.map(function(barra) {
				return barra;
			});
			elementos.push(this.pelota);
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



	//modificacion del prototipo de TableroVista
	self.TableroVista.prototype = {
		//funcion limpiar para evitar el bug que deja el
		//rastro del canvas
		limpiar: function(){
			this.contexto.clearRect(0,0,this.tablero.ancho,this.tablero.alto);
		},
		dibujar: function(){
						
			var cant_elementos = this.tablero.elementos.length;		
			/**/
			var i = 0;
			for (i; i < cant_elementos; i++) {
				//console.log("Cant elementos: "+this.tablero.elementos.length) 
			    //console.log("Cant i: "+i)
			    dibujar(this.contexto,this.tablero.elementos[i])
			}
		},
		valida_colision: function(){

			for (var i = 0; i < this.tablero.barras.length; i++) {
				//console.log('colision');
				var barra = this.tablero.barras[i];

				console.log(hit(barra,this.tablero.pelota));

				if (hit(barra,this.tablero.pelota)) {
					//si hay colision
					//se ejecuta colision pasando la barra
					this.tablero.pelota.colision(barra);
				};
			};
		},
		jugar: function(){
			
			if (this.tablero.jugando) {
				
				this.limpiar();

				this.dibujar();

				this.valida_colision();

				this.tablero.pelota.mover();

			};
			
		}
	}

	//metodo para dibujar
	//sele pasa contexto:donde va a dibujar, elemento: que va a dibujar
	function dibujar(contexto,elemento){
		//console.log(elemento)
		//console.log(elemento.hasOwnProperty("tipo"))
		//if (elemento !== null) {
			//console.log("Este elemento no es nulo")
			//console.log(contexto)
			switch(elemento.tipo) {
			    case 'rectangle':
			        contexto.fillRect(elemento.x,elemento.y,elemento.width,elemento.height);
			    break;
			    case 'circle':
			    	contexto.beginPath();	
			        contexto.arc(elemento.x,elemento.y,elemento.radio,0,7);
			        contexto.fill();
			        contexto.closePath();
			    break;			    
			}
		//};
		
	}

	function hit(a,b){
		//console.log('hit');
		//valida si pelota colisiona con barra
		//Revisa si a colisiona con b
	  var hit = false;
	  //Colisiones hirizontales
	  if(b.x + b.width >= a.x && b.x < a.x + a.width){

	   //Colisiona verticales
	   if (b.y + b.height >= a.y && b.y < a.y + a.height) 
	    hit = true;
	  }

	  //Colisión de a con b
	  if(b.x <= a.x && b.x + b.width >= a.x + a.width){
	   
	   if (b.y <= a.y && b.y + b.height >= a.y + a.height) 
	    hit = true;
	  }

	  //Colision b con a
	  if(a.x <= b.x && a.x + a.width >= b.x + b.width){
	   //Colisiona verticales
	   if (a.y <= b.y && a.y + a.height >= b.y + b.height) 
	    hit = true;
	  }
	  return hit;
	}

})();

//------------------------------------------------------------------------------------------
//La pelota
//Modelo
(function(){
	self.Pelota = function(x,y,radio,tablero){
		this.x = x;
		this.y = y;
		this.radio = radio;
		this.tablero = tablero;
		this.velocidad_y = 0;
		this.velocidad_x = 3;
		this.bounce_angle = 0;
		this.max_bounce_angle = Math.PI / 12;
		//en que direccion se dirige?
		this.direccion = 1;
		this.tipo = "circle";
		//se añade la pelota al tablero
		this.tablero.pelota = this;
		this.velocidad = 3;
	}

	self.Pelota.prototype = {
		mover: function(){
			this.x += (this.velocidad_x * this.direccion);
			this.y += (this.velocidad_y);
		},

		get width(){
			return this.radio * 2;
		},
		get height(){
			return this.radio * 2;
		},
		colision: function(bar){

			//reaccion a la colision con una barra
			//Reacciona a la colisiona con una barra que recibe como parametro  
		    var relative_intersect_y = ( bar.y + (bar.height / 2) ) - this.y;

		    var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

		    this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

		    this.velocidad_y = this.velocidad * -Math.sin(this.bounce_angle);
		    this.velocidad_x = this.velocidad * Math.cos(this.bounce_angle);

		    if (this.x > (this.tablero.ancho / 2)) this.direccion = -1;
		    else this.direccion = 1;

		}
		
	}


})();
//------------------------------------------------------------------------------------------

//modelo de las barras
(function(){

	self.Barra = function(x,y,ancho,alto,tablero){
		//en donde va estar
		this.x = x;
		this.y = y;

		//que tamaño
		this.width = ancho;
		this.height = alto;

		//que tipo
		this.tipo = "rectangle";

		//en donde va a estar
		this.tablero = tablero;

		//se cargan las barras dentro del tablero
		this.tablero.barras.push(this);

		//velocidad con la que se va a mover
		this.velocidad = 10;
	}

	self.Barra.prototype = {

		arriba: function(){
			//para mover hacia arriba se reduce la coordenada en y
			this.y -= this.velocidad;
		},
		abajo: function(){
			//para mover hacia abajo se aumenta la coordenada en y
			this.y += this.velocidad;
		},
		//funcion toString se ejecuta automaticamente cuando
		//se concatena el objeto con una cadena.
		//cuando se quiera mostar la version string de este
		//objeto solo muestra esto.
		toString: function(){
			//sirve para mostrar en que coordenadas está
			return "x: "+this.x + " y: "+this.y;
		}
	}

})();

//------------------------------------------------------------------------
//Ejecución

//se intancia la clase Tablero
var tablero = new Tablero(400,800);
//inicia el juego sin tener que puilsar la barra
tablero.jugando = true;

console.log(tablero);
//se obtiene el canvas del DOM
var canvas = document.getElementById('canvas');
//se intancia la vista del tablero con el canvas y el tablero instanciado
var vista_tablero = new TableroVista(canvas,tablero);

//console.log(vista_tablero)
//barra 1
var barra = new Barra(20,100,40,100,tablero);
//barra 2
var barra2 = new Barra(700,100,40,100,tablero);
//pelota
var pelota = new Pelota(350,100,10,tablero);

//se añade listener para del DOM 
//evento de las teclas arriba, abajo.
document.addEventListener("keydown",function(ev){
	//console.log(ev.keyCode);
	//arriba 38
	//abajo 40	

	if (ev.keyCode == "38") {
		//quitar el por defecto de las flechas
		ev.preventDefault();
		//flecha arriba
		barra.arriba();
		console.log(barra.toString());
	}else if(ev.keyCode == "40"){
		//quitar el por defecto de las flechas
		ev.preventDefault();
		//flecha abajo
		barra.abajo();
		console.log(barra.toString());
	}else if(ev.keyCode == "87"){
		//quitar el por defecto de las flechas
		ev.preventDefault();
		//tecla w
		barra2.arriba();
		console.log(barra2.toString());
	}else if(ev.keyCode == "83"){
		//quitar el por defecto de las flechas
		ev.preventDefault();
		//tecla s
		barra2.abajo();
		console.log(barra2.toString());
	}else if(ev.keyCode == "32"){
		//quitar el por defecto de las flechas
		ev.preventDefault();
		//tecla barra pausa
		tablero.jugando = !tablero.jugando; //el contrario del valor
	};

	
}); 

//se añade un listener para que se ejecute cuando cargue la ventana
//se comenta ya que lo ejecuta requestAnimationFrame
//window.addEventListener("load",main);

//------------------------------------------------------------------------
//para animar las barras se usa:
window.requestAnimationFrame(controller);

//cada 2 segundos cambia la direccion
setTimeout(function(){
	//pelota.direccion = -1;
},2000);
//------------------------------------------------------------------------


//controlador
function controller(){
	
	vista_tablero.jugar();

	//barra.velocidad = 2;
	//para actualizar constantemente
	window.requestAnimationFrame(controller);
}
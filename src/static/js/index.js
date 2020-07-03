// btn = document.querySelector('.btn');
// select_products = document.querySelector('#products');
// select_amount1 = document.querySelector('#amount1');
// select_amount2 = document.querySelector('#amount2');
// input_amount = document.querySelector("#amount");
// input_value = document.querySelector("#value");


// btn.onclick = calc;

// // popular lista
// $.getJSON("./src/static/js/index.json", function(json){
//     json.products.forEach(element => {
//         // criar elemento da lista         
//         select_products.appendChild(create_option(element.pesoliquido, element.name));
//     });

//     json.amounts.forEach(element=>{
//         select_amount1.appendChild(create_option(
//             element.value, element.name
//         ));

//         select_amount2.appendChild(create_option(
//             element.value, element.name
//         ));
//     });

// });

// function create_option(value, name){
//     // create element option
//     option = document.createElement('OPTION');
//     txt_option = document.createTextNode(name);

//     option.setAttribute("value", value);
//     option.setAttribute("name", name);
//     option.appendChild(txt_option);
//     return option
// }

// // criar um verificador dos campos 

// function calc(){
//     if(select_products.value != "Selecione o produto" && select_amount1.value != "Un. Medida"
//         && select_amount2.value != "Un. Medida"){
//         un_medida_1 = parseFloat(select_amount1.value);
//         quantidade = parseFloat(input_amount.value);
//         peso_liquido = parseFloat(select_products.value);

//         valor = (peso_liquido * (quantidade * un_medida_1))/peso_liquido;
        
//         input_value.value = valor;
//     }
//     else{
//         alert("preencha todos os campos");
//     }
    
// }


// revisar ////////////////////////

function Conversor()
{
	//constantes privadas
	var PESO = 1; //identifica uma medida de peso
	var VOLUME = 0; //identifica uma medida de volume
	
	//atributos privados
	var ingredientes = new Array(); //lista de ingredientes
	var medidas = new Array(); //lista de medidas
	var selectIngredientes; //elemento select com os ingredientes
	var selectMedidasEntrada; //elemento select com as medidas de entrada
	var selectMedidasSaida; //elemento select com as medidas de saída
	var inputEntrada; //elemento input para entrada de texto
	var inputSaida; //elemento input para saída de texto
	var ingredienteSelecionado; //código do último ingrediente selecionado
	var medidaEntrada; //código da última medida de entrada selecionada
	var medidaSaida; //código da última medida de saida selecionada
	
	//definição de classe
	function Ingrediente(nome, liquido, conversao)
	{
		//atributos públicos
		this.nome = nome; //nome do ingrediente
		this.liquido = liquido; //indica se o ingrediente é líquido
		this.conversao = conversao; //valor para conversão entre volume e peso
	}
	
	//definição de classe
	function Medida(tipo, nome, abreviacao, conversao, liquido, imgsrc)
	{
		//atributos públicos
		this.tipo = tipo; //volume ou peso
		this.nome = nome; //nome da medida
		this.abreviacao = abreviacao; //abreviação da medida
		this.conversao = conversao; //valor para conversões do mesmo tipo
		this.liquido = liquido; //indica se a medida é exclusiva para líquidos
		this.imgsrc = imgsrc; //endereço do ícone relativo a unidade de medida
	}
	
	//método privado
	function criarOpcao(texto, valor)
	{
		//cria e retorna uma nova opção para caixas de seleção
		var elementoOption = document.createElement("option");
		elementoOption.text = texto;
		elementoOption.value = valor;
		return elementoOption;
	}
	
	//método privado
	function exibirIngredientes(elementoDestino)
	{
		var elementoSelect, indiceIngrediente;
		
		//cria uma nova caixa de seleção e define seu evento de mudança
        elementoSelect = document.createElement("select");        
        elementoSelect.setAttribute("class", "custom-select mb-3");
		elementoSelect.onchange = selecionarIngrediente;
		
		//insere e define a opção padrão
		elementoSelect.options[0] = criarOpcao("Selecione o produto", -1); //elementoSelect.add(criarOpcao("- produto -", -1), null);
		elementoSelect.selectedIndex = 0;
		
		//insere todas as outras opções
		for (indiceIngrediente = 0; indiceIngrediente < ingredientes.length; indiceIngrediente++)
		{
			elementoSelect.options[indiceIngrediente + 1] = criarOpcao(ingredientes[indiceIngrediente].nome, indiceIngrediente); //elementoSelect.add(criarOpcao(ingredientes[indiceIngrediente].nome, indiceIngrediente), null);
		}
		
		//adiciona a caixa de seleção ao elemento de destino
		document.getElementById(elementoDestino).appendChild(elementoSelect);
		
		//devolve uma referência à caixa de seleção
		return elementoSelect;
	}
	
	//método privado
	function exibirMedidas(idDestino)
	{
		var elementoSelect, indiceMedida;
		
		//cria uma nova caixa de seleção e define seu evento de mudança
        elementoSelect = document.createElement("select");
        elementoSelect.setAttribute("class", "custom-select mb-3");
		elementoSelect.onchange = selecionarMedida;
		
		//se nenhum ingrediente está selecionado
		if (ingredienteSelecionado < 0)
		{
			//indica que o ingrediente ainda não foi selecionado
			elementoSelect.options[0] = criarOpcao(" Aguardando..", -1); //elementoSelect.add(criarOpcao("- aguardando -", -1), null);
            
            // document.getElementById("ico-img-entrada").src = "imgs/cancel.svg";
            // document.getElementById("ico-img-saida").src = "imgs/cancel.svg";
		}
		else
		{
            //insere todas as opções de medidas
            // document.getElementById("dsbl-elem").classList.remove("disabled");
			elementoSelect.options[0] = criarOpcao("Un. Medida", -1); //elementoSelect.add(criarOpcao("- unidade -", -1), null);
            
            // document.getElementById("ico-img-entrada").src = "imgs/select.svg";
            // document.getElementById("ico-img-saida").src = "imgs/select.svg";
            
            for (indiceMedida = 0; indiceMedida < medidas.length; indiceMedida++)
			{
				if (!medidas[indiceMedida].liquido || ingredientes[ingredienteSelecionado].liquido)
				{
					elementoSelect.options[indiceMedida + 1] = criarOpcao(medidas[indiceMedida].nome, indiceMedida); //elementoSelect.add(criarOpcao(medidas[indiceMedida].nome, indiceMedida), null);
				}
			}
		}
		
		//define a opção padrão
        elementoSelect.selectedIndex = 0;
		
		//localiza o elemento de destino
		elementoDestino = document.getElementById(idDestino);
		
		//remove todos os filhos do elemento de destino
		while (elementoDestino.hasChildNodes())
		{
			elementoDestino.removeChild(elementoDestino.firstChild);
		}
		
		//adiciona a caixa de seleção ao elemento de destino
		elementoDestino.appendChild(elementoSelect);
		
		//devolve uma referência à caixa de seleção
		return elementoSelect;
	}
	
	//método privado
	function selecionarIngrediente()
	{
		//pega o código do ingrediente selecionado
		ingredienteSelecionado = selectIngredientes.options[selectIngredientes.selectedIndex].value;
		
		//inicializa as caixas de seleção de medidas em função do ingrediente escolhido
		selectMedidasEntrada = exibirMedidas("medidas-entrada");
        selectMedidasSaida = exibirMedidas("medidas-saida");
		
		//inicializa os componentes restantes
		selecionarMedida();
	}
	
	//método privado
	function selecionarMedida()
	{
		//pega os códigos das medidas selecionadas
		medidaEntrada = selectMedidasEntrada.options[selectMedidasEntrada.selectedIndex].value;
        medidaSaida = selectMedidasSaida.options[selectMedidasSaida.selectedIndex].value;
		console.log("ronaldo",medidas[selectMedidasEntrada.selectedIndex-1])
		if(medidas[selectMedidasEntrada.selectedIndex-1]){
			document.getElementById("ico-img-entrada").src = "imgs/" + medidas[selectMedidasEntrada.selectedIndex-1].imgsrc;
        	document.getElementById("ico-img-saida").src = "imgs/" + medidas[selectMedidasSaida.selectedIndex-1].imgsrc;
		}
        
		
		//tenta calcular o resultado
		//calcularResultado();
		
		//limpa o texto de saída
		inputSaida.value = "";
	}
	
	//método privado
	function validarEntrada()
	{
		var entradasValidas = "0123456789.,/";
		var textoOrigem, textoDestino;
		var indice, caractere;
		
		//remove os caracteres inválidos do texto
		textoOrigem = inputEntrada.value;
		textoDestino = "";
		for (indice = 0; indice < textoOrigem.length; indice++)
		{
			caractere = textoOrigem.charAt(indice);
			if (entradasValidas.indexOf(caractere) == -1)
			{
				caractere = "";
			}
			textoDestino += caractere;
		}
		
		//remove caracteres especiais das extremidades
		for (caractere = textoDestino.charAt(0); entradasValidas.indexOf(caractere) > 9; caractere = textoDestino.charAt(0))
		{
			textoDestino = textoDestino.substr(1, textoDestino.length - 1);
		}
		for (caractere = textoDestino.charAt(textoDestino.length - 1); entradasValidas.indexOf(caractere) > 9; caractere = textoDestino.charAt(textoDestino.length - 1))
		{
			textoDestino = textoDestino.substr(0, textoDestino.length - 1);
		}
		
		//garante que apenas um caractere especial permaneça
		textoOrigem = textoDestino;
		textoDestino = "";
		for (indice = 0; indice < textoOrigem.length; indice++)
		{
			caractere = textoOrigem.charAt(indice);
			if (entradasValidas.indexOf(caractere) == -1)
			{
				caractere = "";
			}
			if (entradasValidas.indexOf(caractere) > 9)
			{
				entradasValidas = "0123456789";
			}
			textoDestino += caractere;
		}
		
		//se sobrou alguma informação válida
		if (textoDestino.length > 0)
		{
			//realiza uma última limpeza
			//textoDestino = textoDestino.replace(",", ".")
			//textoDestino = parseFloat(textoDestino).toString();
			textoDestino = textoDestino.replace(".", ",")
		}
		
		//sobrescreve a entrada original com a entrada processada
		inputEntrada.value = textoDestino;
		
		//tenta calcular o resultado
		//calcularResultado();
	}
	
	//método privado
	function calcularResultado()
	{
		//var entrada = parseFloat(inputEntrada.value.replace(",", "."));
		var entrada = eval(inputEntrada.value.replace(",", "."));
		var saida = -1;
		
		//se é possível fazer a conversão
		if ((ingredienteSelecionado > -1)&&(isFinite(entrada)))
		{
			if ((medidaEntrada > -1) && (medidaSaida > -1) && (inputEntrada.value.length > 0))
			{
				/*
				//converte a quantidade para a medida padrão
				saida = entrada * medidas[medidaEntrada].conversao;
				
				//se as duas medidas são de tipos diferentes
				if (medidas[medidaEntrada].tipo != medidas[medidaSaida].tipo)
				{
					//converte a quantidade para a medida padrão do tipo de destino
					if (medidas[medidaEntrada].tipo == PESO)
					{
						saida = saida * ingredientes[ingredienteSelecionado].conversao;
					}
					else
					{
						saida = saida / ingredientes[ingredienteSelecionado].conversao;
					}
				}
				
				//converte a quantidade para a medida de destino
				saida = saida / medidas[medidaSaida].conversao;
				*/
				
				//converte a quantidade para a medida padrão
				if (medidas[medidaEntrada].tipo == PESO)
				{
					saida = entrada * medidas[medidaEntrada].conversao;
				}
				else
				{
					saida = entrada * ingredientes[ingredienteSelecionado].conversao[medidas[medidaEntrada].conversao];
				}
				
				//converte a quantidade para a medida de destino
				if (medidas[medidaSaida].tipo == PESO)
				{
					saida = saida / medidas[medidaSaida].conversao;
				}
				else
				{
					saida = saida / ingredientes[ingredienteSelecionado].conversao[medidas[medidaSaida].conversao];
				}
			}
		}
		
		//se o resultado for válido
		if (saida > -1)
		{
			//limita o número de casas decimais
			//saida = Math.round(saida * 100)/100;
			
			//exibe o resultado
			inputSaida.value = filtrarFracao(saida); //inputSaida.value = saida.toString().replace(".", ",");
		}
		else
		{
			//limpa o texto de saída
			inputSaida.value = "";
		}

		return false;
	}
	
	//método privado
	function filtrarFracao(numero)
	{
		var fracoes = ["0", "1/4", "1/3", "1/2", "2/3", "3/4", "1"];
		var valores = [0, 1/4, 1/3, 1/2, 2/3, 3/4, 1];
		var diferenca, indice;
		var menorDiferenca, menorIndice;
		
		//separa a parte inteira da parte fracionária
		inteiro = Math.floor(numero);
		fracao = numero - inteiro;
		
		//procura a fração mais próxima
		menorDiferenca = 10;
		for (indice = 0; indice < fracoes.length; indice++)
		{
			diferenca = Math.abs(fracao - valores[indice]);
			if (diferenca < menorDiferenca)
			{
				menorDiferenca = diferenca;
				menorIndice = indice;
			}
		}
		
		//incrementa a parte inteira se a parte fracionária for próxima de 1
		if (valores[menorIndice] == 1)
		{
			inteiro++;
			menorIndice = 0;
		}
		
		//formata o resultado da forma mais apropriada
		if (inteiro > 0)
		{
			if (menorIndice > 0)
			{
				return parseInt(inteiro) + " e " + fracoes[menorIndice];
			}
			else
			{
				return parseInt(inteiro);
			}
		}
		else
		{
			if (menorIndice > 0)
			{
				return fracoes[menorIndice];
			}
			else
			{
				return "0";
			}
		}
	}
	
	//cadastra os ingredientes
	ingredientes.push(new Ingrediente("Açúcar", false, [180, 10, 5, 150]));
	ingredientes.push(new Ingrediente("Água", true, [240, 15, 2.5, 200]));
	ingredientes.push(new Ingrediente("Amendoim cru", false, [160, 10, 5, 120]));
	ingredientes.push(new Ingrediente("Amido de milho", false, [120, 5, 2.5, 100]));
	ingredientes.push(new Ingrediente("Arroz arborio cru", false, [210, 10, 5, 150]));
	ingredientes.push(new Ingrediente("Arroz cru", false, [175, 15, 5, 155]));
	ingredientes.push(new Ingrediente("Aveia em flocos finos", false, [115, 5, 2.5, 85]));
	ingredientes.push(new Ingrediente("Café pronto", true, [240, 15, 5, 200]));
	ingredientes.push(new Ingrediente("Cebola picadinha", false, [110, 10, 5, 90]));
	ingredientes.push(new Ingrediente("Chocolate em pó / Cacau / Achocolatado", false, [100, 10, 5, 80]));
	ingredientes.push(new Ingrediente("Creme de leite de caixinha", true, [240, 15, 5, 200]));
	ingredientes.push(new Ingrediente("Creme de leite fresco", true, [240, 15, 5, 200]));
	ingredientes.push(new Ingrediente("Farinha de rosca", false, [100, 5, 2.5, 70]));
	ingredientes.push(new Ingrediente("Farinha de trigo", false, [140, 5, 2.5, 120]));
	ingredientes.push(new Ingrediente("Feijão cru", false, [200, 10, 5, 160]));
	ingredientes.push(new Ingrediente("Grão de bico cozido", false, [170, 20, 10, 130]));
	ingredientes.push(new Ingrediente("Grão de bico cru", false, [195, 15, 5, 140]));
	ingredientes.push(new Ingrediente("Leite", true, [240, 15, 5, 200]));
	ingredientes.push(new Ingrediente("Leite condensado", true, [240, 15, 5, 200]));
	ingredientes.push(new Ingrediente("Leite de coco", true, [240, 15, 10, 200]));
	ingredientes.push(new Ingrediente("Milho cru", false, [200, 20, 10, 165]));
	ingredientes.push(new Ingrediente("Passas", false, [140, 15, 5, 100]));
	ingredientes.push(new Ingrediente("Polvilho doce e azedo", false, [155, 15, 2.5, 100]));
	ingredientes.push(new Ingrediente("Sal grosso", false, [300, 20, 5, 210]));
	
	//cadastra as medidas (líquidos devem ficar no final)
	medidas.push(new Medida(PESO, "quilograma", "Kg", 1000, false, "quilograma.svg"));
	medidas.push(new Medida(PESO, "gramas", "g", 1, false, "grama.svg"));
	medidas.push(new Medida(VOLUME, "xícara (chá)", "", 0, false, "caneca.svg"));
	medidas.push(new Medida(VOLUME, "colher (sopa)", "", 1, false, "colher.svg"));
	medidas.push(new Medida(VOLUME, "colher (chá)", "", 2, false, "colher-cha.svg"));
	medidas.push(new Medida(VOLUME, "copo (americano)", "", 3, false, "copo.svg"));
	//medidas.push(new Medida(VOLUME, "litros", "l", 1000, true));
	//medidas.push(new Medida(VOLUME, "mililitros", "ml", 1, true));
	
	//cria referencias às caixas de texto
	inputEntrada = document.getElementById("quantidade-entrada");
	inputSaida = document.getElementById("quantidade-saida");
	
	//limpa e ativa a validação do texto de entrada
	inputEntrada.value = "";
	inputEntrada.onchange = validarEntrada;
	
	//cria a caixa de seleção de ingredientes
    selectIngredientes = exibirIngredientes("caixa-ingredientes");
	
	//iniciliza todos os componentes
	selecionarIngrediente();
	
	//ativa o botão de conversão
	document.getElementById("botao-converter").onclick = function(e){
		e.preventDefault();
		calcularResultado();
		return false
		
		// calcularResultado;
		// e.preventDefault();
	}
}


var conversor = new Conversor();

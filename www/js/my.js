var idlembretes = [0];
var paraexcluir = [];
var editandoId = [];

	// Confere se já existem ids salvos no local storage e os passa para a variável idLembretes
	
	 if (typeof localStorage.idLembretes != 'undefined') {
		idlembretes = JSON.parse(localStorage.idLembretes);
	};

// Inicia com o html, carrega todos os lembretes salvos no localStorage e os apresenta no body
// Também atualiza os ids dos lembretes e seus conteúdos

function carregar() {
	let lembretes = [];

	// Confere se já existem lembretes salvos

	if (typeof localStorage.Lembretes != 'undefined') {

		//Formata os lembretes, para funcionar com os filtros, independente do tamanho de caixa das letras

		lembretes = JSON.parse(localStorage.Lembretes);

		let busca = document.getElementById("buscar").value.toLowerCase();

		let filtrocor = document.getElementById("filtrocor").value;

		// Laço de repetição para reescrever os ids dos lembretes

		for (var i = 0; i < lembretes.length; i++) {
			lembretes[i].id = i + 1;
		}
		localStorage.setItem("Lembretes", JSON.stringify(lembretes));
		localStorage.setItem("idLembretes", lembretes.length)

		if (busca != "") {

			// Filtro por caixa de texto
			// Percorre a array de lembretes salvos, formatando-os para a busca com filtro por texto
			// e retornando o que for pedido pela caixa de busca

			lembretes = lembretes.filter(lembrete => {
				let titulo = lembrete.titulo.toLowerCase();
				let anotacao = lembrete.anotacao.toLowerCase();
				let observacao = lembrete.observacao.toLowerCase();
				return titulo.indexOf(busca) != -1 | anotacao.indexOf(busca) != -1 | observacao.indexOf(busca) != -1;
			})
			
		};

		// Filtro por cor

		console.log(filtrocor);
		if (filtrocor != "") {
			lembretes = lembretes.filter(lembrete => {
				
				return lembrete.cor == filtrocor;
			})

		};

		// Limpa o campo onde ficam os lembretes no html

		document.getElementById("listalembretes").innerHTML = "";
	
		// Laço de repetição para carregar os lembretes no html

		for (var i = 0; i < lembretes.length; i++) {

			//Declaração dos valores

			let titulo = lembretes[i].titulo;
			let anotacao = lembretes[i].anotacao;
			let observacao = lembretes[i].observacao;
			let cor = lembretes[i].cor;
			let id = i + 1;

			// Garante um espaço na observação do lembrete, para manter o padrão nos cards de lembrete

			if (observacao == "") {
				observacao = "⠀";
			}

			// Incrementa o lembrete no html

			document.getElementById("listalembretes").innerHTML +=
			'<div class="lembrete card ' + cor +'"> <div style="text-transform: uppercase;" class="card-header titulolembrete" onclick="mostrar('+ id + ')">'
			+ '<div id="menulembrete'+ id +'" class="menulembrete esconde">'
			+ '<img class="lixeira" src="css/excluir.svg" onclick="excluir('+lembretes[i].id+'), esconder(rodape), mostrar('+id+'), mostrar(confirmarexcluir), rotacionar(seta'+id+', menulembrete'+id+')">'
			+ '<img src="css/editar.svg" class="editar" onclick="editar('+id+'), mostrar(sobrepor), esconder(rodape), mostrar('+id+'), rotacionar(seta'+id+', menulembrete'+id+')"> </div> '
			+ '<div class="menuseta"><img id="seta'+id+'" src="css/seta.svg" onclick="mostrar('+id+'), rotacionar(seta'+id+', menulembrete'+id+')"></div> '
			+ '<b id="titulo'+id+'">'
			+ titulo
			+ '</b> </div>'
			+ '<div id="'+id+'" style="display: none;" class="esconde"> '
			+ '<blockquote class="anotacao blockquote mb-0"> '
			+ '<p id="anotacao'+id+'"> '
			+ anotacao
			+ '</p>'
			+ '<small class="text-muted">'
			+ '<i class="obs" id="obs'+id+'">'
			+ observacao
			+ '</i> </small> </blockquote> </div>'

		}
	}
};

// Foca no item "elemento", quando solicitado
// Usado para focar no input de texto, usado para o filtro por texto

function focar(elemento) {
	elemento.focus();
}

// Gira a seta de menu de cada lembrete independentemente, utilizando o id do lembrete como parâmetro de especificação

function rotacionar(seta, icones) {

	if (document.getElementById(icones.id).style.display != 'block' | undefined) {
		document.getElementById(icones.id).style.display = 'block';
	} else {
		document.getElementById(icones.id).style.display = 'none';
	}
	
	if (document.getElementById(icones.id).style.display != 'block') {
	document.getElementById(seta.id).style.transform = 'rotate(0deg)';
	} else {
	document.getElementById(seta.id).style.transform = 'rotate(-180deg)';
	}
}

// Função chamada quando é pressionado o botão de busca
// Esconde o nome do aplicativo e mostra a caixa de texto para pesquisa, e vice-versa

function pesquisar(busca, lembrou) {
	let item = busca.id;
	let item2 = lembrou.id;

	if (document.getElementById(item).style.display == "") {
		document.getElementById(item).style.display = 'block';
	}else {
		document.getElementById(item).style.display = "";
	}

	if (document.getElementById(item2).style.display == "none") {
		document.getElementById(item2).style.display = "inline-block";
	}else {
		document.getElementById(item2).style.display = "none";
	}

}

// Mostra um elemento escondido no html, quando solicitado, através do parâmetro "mostra"

function mostrar (mostra) {
	let item = mostra.id;
	if (mostra.id == null) {
		item = mostra;
	}
	if (document.getElementById(item).style.display != 'block') {
		document.getElementById(item).style.display = 'block';
	} else {
		document.getElementById(item).style.display = 'none';
	}
	
}

// Oculta um elemento no html, quando solicitado, atráves do parâmetro "esconde"

function esconder (esconde) {
	let item = esconde.id;
	if (esconde.id == null) {
		item = esconde;
	}
	if (document.getElementById(item).style.display == 'none') {
		document.getElementById(item).style.display = 'block'
	}else{
	document.getElementById(item).style.display = 'none';

	};
};

/* Salva um novo lembrete, onde:
	tit = Título do lembrete
	lemb = A escrita principal do lembrete, ou o "corpo"
	obs = Observação
	corlemb = Cor
*/

function salvar(tit, lemb, obs, corlemb) {
	let titulo = tit.value;
	let anotacao = lemb.value;
	let observacao = obs.value;
	let cor = corlemb.value;
	let lembrete = [];
	let lembretes = [];
	console.log(cor);

/*
	Substitui os espaços por "", em seguida substitui quebras de linha por "" também,
	para impedir que seja criado lembretes em branco
*/
	
	 anotacao = anotacao.replace(/ /g, "");
	 anotacao = anotacao.replace(/\n/g, "");
	 observacao = observacao.replace(/ /g, "");


//--------------------------------------------------------------------------------//

	if (observacao != "") {
		observacao = obs.value;
	} else{
		observacao = "";
	}

/*
	Verifica o valor do título e lembrete, caso não tenha título,
	é tirado uma parte do "corpo" do lembrete e salvo como titulo
*/

	if (lemb.value != "" && anotacao != "") {
		anotacao = lemb.value.replace(/\n/g, "<br>");

	if (titulo == "" && anotacao != "") {
		titulo = lemb.value.slice(0,15);
		if (titulo.length >= 15) {
			titulo += "...";
		}
	}

	// incremento na variavel global, para contagem de lembretes

		idlembretes++;

	//-----------------//
		
		// Adiciona os elementos do lembrete a ser salvo, já formatados, na variável lembrete

		lembrete.push({"titulo": titulo,"anotacao": anotacao, "observacao": observacao, "cor": cor, "id": idlembretes})

		// Verifica se já possui lembretes salvos, caso sim, adiciona-os na variável "lembretes"		

		if (typeof localStorage.Lembretes != 'undefined') {
			lembretes = JSON.parse(localStorage.Lembretes);
		}

		// Incrementa o novo lembrete para a variável "lembretes"

		lembretes.push(lembrete);
		lembretes = lembretes.flat();

		// Salva a variável "lembretes" no localStorage e atualiza os ids, substituindo o conteúdo antigo

		localStorage.setItem("Lembretes", JSON.stringify(lembretes));
		localStorage.setItem("idLembretes", idlembretes);

		// Redefine os campos da página de novo lembrete e envia uma mensagem de sucesso

		document.getElementById("tit").value = "";
		document.getElementById("lemb").value = "";
		document.getElementById("obs").value = "";
		document.getElementById("cor").value = "border-light";

		alert("Lembrete Salvo");
		
	} else {

		// Caso o campo do lembrete esteja em branco, notifica o usuário

		alert("Campo 'Lembrete' Em Branco!")
	}
};

// Salva na variável "paraexcluir" o item a ser exluido

function excluir(item) {
	paraexcluir = item;

}

// Exclui o lembrete escolhido, ou cancela a operação

function confirmarexclusao() {
	let lembretes = JSON.parse(localStorage.Lembretes);
	lembretes = lembretes.filter(lembrete =>{
		return lembrete.id != paraexcluir;
	})
	localStorage.setItem("Lembretes", JSON.stringify(lembretes))
	alert("Lembrete Excluido");
	esconder("confirmarexcluir");
	mostrar("rodape");
	carregar();
}

// Função para editar o lembrete solicitado

function editar(item) {
	
	let lembretes = JSON.parse(localStorage.Lembretes);
	let editando = lembretes.filter(lembrete =>{
		return lembrete.id == item;
	})

	editandoId = item;

	let anotacao = editando[0].anotacao;
	anotacao = anotacao.replace(/<br>/g, "\n" );

	document.getElementById("titulo").value = editando[0].titulo;
	document.getElementById("anotacao").value = anotacao;
	document.getElementById("observacao").value = editando[0].observacao;
	document.getElementById("cor").value = editando[0].cor;

};

// Salva a edição do lembrete solicitado

function salvaredicao(cor, titulo, anotacao, observacao) {
		
		titulo = titulo.value;
		anotacao = anotacao.value;
		observacao = observacao.value;

		anotacao = anotacao.replace(/\n/g, "<br>");

		let checaranotacao = anotacao.replace(/<br>/g, "\n");
		checaranotacao = checaranotacao.replace(/ /g, "");
		observacao = observacao.replace(/ /g, "");

		let checartitulo = titulo.replace(/ /g, "");

		if (checaranotacao == "") {
			anotacao = "";
		}
		if (anotacao != "") {
			if (checartitulo == "") {
				titulo = anotacao.slice(0, 15);
				if (titulo.length >= 15) {
					titulo += "...";
				}
			}
		
		let lembretes = JSON.parse(localStorage.Lembretes);

		let editando = ({"titulo": titulo,"anotacao": anotacao, "observacao": observacao, "cor": cor.value, "id": editandoId})

		for (var i = 0;i < lembretes.length; i ++) {
					lembretes[i]
					if (lembretes[i].id == editandoId) {
						lembretes[i] = editando;
					}
				}		

		lembretes = lembretes.flat();

		localStorage.setItem("Lembretes", JSON.stringify(lembretes));
		esconder(sobrepor);
		mostrar(rodape);
		carregar();
		}else{
			alert("Campo 'Lembrete' em Branco!")
		}
};

// Cancela a edição de um lembrete, limpando a variável "editandoId"

function cancelaredicao() {
		editandoId = [];
	}





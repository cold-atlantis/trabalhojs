// Incluir aqui as funções para manipulação da página
function esconder(){
	$('#home').hide();
	$('#conta').hide();
	$('#saque').hide();
	$('#deposito').hide();
	$('#transferencia').hide();
	$('#saldo').hide();
	$('#extrato').hide();
	$('#limite').hide();
	$('#extrato-lista-operacoes').hide();
}

$(document).ready(function(){
	esconder();
	$('#home').show();
});
$('a:contains(Home)').click(function(){
	esconder();
	$('#home').show();
});
$('a:contains(Abertura)').click(function(){
	esconder();
	$('#conta').show();
});
$('a:contains(Saque)').click(function(){
	esconder();
	$('#saque').show();
});
$('a:contains(Depósito)').click(function(){
	esconder();
	$('#deposito').show();
});
$('a:contains(Transferência)').click(function(){
	esconder();
	$('#transferencia').show();
});
$('a:contains(Saldo)').click(function(){
	esconder();
	$('#saldo').show();
});
$('a:contains(Extrato)').click(function(){
	esconder();
	$('#extrato').show();
});
$('a:contains(Aumentar)').click(function(){
	esconder();
	$('#limite').show();
});

$('a:contains(Total)').click(function(){
	esconder();
	$('#home').show();
	var tots= 0;
	liContas.forEach(function(x){
		tots+= x.saldo + x.limite;
	});
	alert("Total de dinheiro disponível é de R$"+tots);
});

function Conta(num, nome, senha){
	this.num= num;
	this.nome= nome;
	this.senha= senha;
	this.saldo= 0;
	this.limite= 100.0;
	this.extrato= new Array();
	this.saque= function(data, valor){
        if(this.verificaSaldo(valor)){
            this.saldo-= valor;
			this.extrato.push(new Extrato(data, "Saque", valor*(-1)));
			return true;
        }
		else{
            return false;
        }
    }
	this.deposito= function(data, valor){
		this.saldo+= valor;
		this.extrato.push(new Extrato(data, "Depósito", valor));
		return this.saldo;
	}
	this.transfere= function(data, valor){
		if(this.verificaSaldo(valor)){
            this.saldo-= valor;
			this.extrato.push(new Extrato(data, "Transferência(-)", valor*(-1)));
			return true;
        }
		else{
            return false;
        }
	}
	this.recebeTransfere= function(data, valor){
		this.saldo+= valor;
		this.extrato.push(new Extrato(data, "Transferência(+)", valor));
		return this.saldo;
	}
	this.verificaSaldo = function(valor){
		return valor< this.saldo+this.limite;
    }
};

function Extrato(data, descricao, valor){
	this.data= data;
	this.descricao= descricao;
	this.valor= valor;
}

var liContas= new Array();

$('#conta-btn').click(function abreConta(){
	var num= parseInt($('#conta-num-conta').val());
	var veri= true;
	liContas.forEach(function(x){
		if(x.num == num){
			veri= false;
		}
	});
	if(veri && !isNaN(num)){
		var nome= $('#conta-nome').val();
		if(nome!=""){
			var senha= $('#conta-senha').val();
			var senha2= $('#conta-senha-repetir').val();
			if(senha==senha2 && senha!=""){
				liContas.push(new Conta(num, nome, senha));
				alert("Conta criada com sucesso!");
			}
			else{
				alert("Senha incompatível!");
			}
		}
		else{
			alert("Preencha o campo nome!");
		}
	}
	else if(!veri){
		alert("Conta já existente!");
	}
	else{
		alert("Somente números aceitos!")
	}
	var num= $('#conta-num-conta').val('');
	var nome= $('#conta-nome').val('');
	var senha= $('#conta-senha').val('');
	var senha2= $('#conta-senha-repetir').val('');
	console.log(liContas);
});

$('#saque-btn').click(function sacar(){
	var num= parseInt($('#saque-num-conta').val());
    var veri= false;
    var y;
    var c;
    liContas.forEach(function(x){
		if(x.num == num){
			veri= true;
			y= liContas.indexOf(x);
		}
    });
    if(veri){
		var confi;
        var data= $('#saque-data').val();
		var x= data.split("/");
		x= x[2]+'/'+x[1]+'/'+x[0];
		confi= new Date(x);
		if(!isNaN(confi.getTime())){
            var senha= $('#saque-senha').val();
            if(liContas[y].senha == senha && senha!=""){
				var saque= $('#saque-valor').val();
				var valor= saque.replace('.', '');
				valor= parseFloat(valor);
				if (valor>=2.00 && valor<=2000.00){
					c= confirm("Saque de R$ "+valor+" na conta de "+liContas[y].nome);
					if(c){
						c= liContas[y].saque(data, valor);
						if(c){
							alert("Saque concluído!");
						}
						else{
							alert("Saldo Insuficiente");
						}  
					}
					else{
						alert("Saque cancelado");
					}
				}    
				else{
					alert("Saque no mínimo R$2,00 e no máximo R$2.000,00");
				}
			}
			else{
				alert("Senha inválida!");
			}
		}
		else{
			alert("Data inválida!");
		}
    }
    else{
         alert("Conta não existente!");
    }
    var num= $('#saque-num-conta').val('');
    var data= $('#saque-data').val('');
    var valor= $('#saque-valor').val('');
    var senha= $('#saque-senha').val('');
    console.log(liContas);
});

$('#deposito-btn').click(function depositar(){
	var num= parseInt($('#deposito-num-conta').val());
	var veri= false;
	var y;
	var c;
	liContas.forEach(function(x){
		if(x.num == num){
			veri= true;
			y= liContas.indexOf(x);
		}
	});
	if(veri){
		var confi;
        var data= $('#deposito-data').val();
		var x= data.split("/");
		x= x[2]+'/'+x[1]+'/'+x[0];
		confi= new Date(x);
		if(!isNaN(confi.getTime())){
			var deposito= $('#deposito-valor').val();
			var valor= deposito.replace('.', '');
			valor= parseFloat(valor);
			if(valor!=""){
				c= confirm("Depósito de R$"+valor+" na conta de "+liContas[y].nome);
				if(c){
					liContas[y].deposito(data, valor);
					alert("Depósito concluído!");
				}
				else{
					alert("Depósito cancelado");
				}
			}
			else{
				alert("Preencha o valor!");
			}
		}
		else{
			alert("Data inválida!");
		}
	}
	else{
		alert("Conta não existente!");
	}
	var num= $('#deposito-num-conta').val('');
	var data= $('#deposito-data').val('');
	var valor= $('#deposito-valor').val('');
	console.log(liContas);
});

$('#transferencia-btn').click(function transferir(){
	var num= parseInt($('#transferencia-num-conta').val());
	var numOutro= parseInt($('#transferencia-num-conta-outra').val());
	var veri= false;
	var veri2= false;
	var y;
	var z;
	var c;
	liContas.forEach(function(x){
		if(x.num == num){
			veri= true;
			y= liContas.indexOf(x);
		}
		if(x.num == numOutro){
			veri2= true;
			z= liContas.indexOf(x);
		}
	});
	if(veri && veri2){
		var senha= $('#transferencia-senha').val();
		if(liContas[y].senha == senha){
			var confi;
			var data= $('#transferencia-data').val();
			var x= data.split("/");
			x= x[2]+'/'+x[1]+'/'+x[0];
			confi= new Date(x);
			if(!isNaN(confi.getTime())){
				var transferencia= $('#transferencia-valor').val();
				var valor= transferencia.replace('.', '');
				valor= parseFloat(valor);
				if(valor>=20.00 && valor<=1000.00){
					c= confirm("Transferência de R$"+valor+" de "+liContas[y].nome+" para "+liContas[z].nome);
					if(c){
						c= liContas[y].transfere(data, valor);
						if(c){
							liContas[z].recebeTransfere(data, valor);
							alert("Transferência concluída!");
						}
						else{
							alert("Saldo Insuficiente");
						}
					}
					else{
						alert("Transferência cancelada!");
					}
				}
				else{
					alert("Transfira no mínimo R$20,00 e no máximo R$1.000,00");
				}
			}
			else{
				alert("Data inválida!");
			}
		}
		else if(!veri){
			alert("Senha da conta de saída inválida!");
		}
		else{
			alert("Senha da conta de entrada inválida!");
		}
	}
	else{
		alert("Conta não existente!");
	}
	var num= $('#transferencia-num-conta').val('');
	var numOutro= $('#transferencia-num-conta-outra').val('');
	var senha= $('#transferencia-senha').val('');
	var data= $('#transferencia-data').val('');
	var valor= $('#transferencia-valor').val('');
	console.log(liContas);
});

$('#saldo-btn').click(function consultarSaldo(){
	var num= parseInt($('#saldo-num-conta').val());
    var veri= false;
    var y;
    var z;
    liContas.forEach(function(x){
		if(x.num == num){
			veri= true;
			y= liContas.indexOf(x);
		}
    });
    if(veri){
		var senha= $('#saldo-senha').val();
		if(liContas[y].senha==senha){
			alert("O seu saldo atual é de R$ "+ liContas[y].saldo);
		}
		else{
			alert("Senha incompatível!");
		}
	}
	else{
		alert("Conta não existente!");
    }
	
	var num= $('#saldo-num-conta').val('');
	var senha= $('#saldo-senha').val('');
});

$('#extrato-btn').click(function consultarExtrato(){
	$('#tabela').remove();
	var num= parseInt($('#extrato-num-conta').val());
	var veri= false;
	var y;
	var z;
	liContas.forEach(function(x){
		if(x.num == num){
			veri= true;
			y= liContas.indexOf(x);
		}
	});
	if(veri){
		var senha= $('#extrato-senha').val();
		if(liContas[y].senha == senha && senha!=""){
			$('#extrato-lista-operacoes').show();
			$('#extrato-lista-operacoes').append('<table id="tabela"></table>');
			$('#tabela').css('border-collapse', 'collapse').css('width', '300').css('marginLeft', '50').css('border', '1px solid #ddd').css('padding', '10px');
			$('#tabela').append('<tr id="linha"></tr>');
			$('#linha').css('background-color', '#48D1CC').css('color', 'white');
			$('#linha').append('<td>Data</td>');
			$('#linha').append('<td>Operação</td>');
			$('#linha').append('<td>Valor</td>');
			$('#linha').append('</br>');
			liContas[y].extrato.forEach(function(i){
				z= liContas[y].extrato.indexOf(i);
				$('#tabela').append('<tr></tr>');
				$('tr:last').attr('id', 'l'+z);
				$('#l'+z).append('<td>'+i.data+'</td>');
				$('#l'+z).append('<td>'+i.descricao+'</td>');
				$('#l'+z).append('<td>'+i.valor+'</td>');
				$('#l'+z).append('</br>');
			});
			$('#tabela td, #tabela tr').css('padding', '10px');
			$('#tabela').append('<tr id="linhaFim"></tr>');
			$('#linhaFim').append('<td>Total</td>');
			$('#linhaFim').append('<td>'+liContas[y].saldo+'</td>');
			$('#linhaFim').attr('colSpan','2');
		}
		else{
			alert("Senha incompatível!");
		}
	}
	else{
		alert("Conta não existente!");
	}
	var num= $('#extrato-num-conta').val('');
	var senha= $('#extrato-senha').val('');
	
	console.log(liContas);
});

$('#limite-btn').click(function aumentarLimite(){
	var num= parseInt($('#limite-num-conta').val());
    var veri= false;
    var y;
    liContas.forEach(function(x){
		if(x.num == num){
			veri= true;
			y= liContas.indexOf(x);
		}
    });
    if(veri){
        var senha= $('#limite-senha').val();
		if(liContas[y].senha == senha){
			var soma= 0;
			liContas[y].extrato.forEach(function(a){
				if(a.descricao == "Depósito" || a.descricao == "Transferência(+)"){
					soma+= a.valor;
				}
			});
			liContas[y].limite= 100 + (5/100) * soma;
			alert("Limite atual: "+liContas[y].limite);
		}
		else{
			alert("Senha incompatível!")
		}
    }
    else{
        alert("Conta não existente!");
    }
	var num= $('#limite-num-conta').val('');
	var senha= $('#limite-senha').val('');
});
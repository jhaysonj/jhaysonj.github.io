$("#submitButton").click(function (event) {
    // Impedir o envio do formulário padrão
    event.preventDefault();
    // Obter os valores de entrada do usuário
    var np = parseInt($("#parc").val()); // Parcelamento (meses)
    var pv = parseFloat($("#ipv").val()); // Valor financiado
    var pp = parseFloat($("#ipp").val()); // Valor final (opcional)
    var pb = parseFloat($("#ipb").val()); // Valor a voltar (opcional)
    var dp = $("#idp").is(":checked"); // Entrada (true ou false)
    var tax = parseFloat($("#itax").val()) / 100;
    var mesesVoltar = $("#mesesVoltarInput").val();


    // Validar os valores de entrada
    if (isNaN(np) || isNaN(tax) || isNaN(pv)) {
        $("#errorMessage").html("<p>Por favor, preencha os campos corretamente.</p>");
        $("#errorMessage").show();
        $("#successMessage").hide();
        return;
    }

    // Ajuste para a primeira parcela paga no ato da compra
    var n = np - (dp ? 1 : 0);

    // Calcular a parcela mensal (Tabela Price) com a entrada
    var i = tax != 0? tax : calcularTaxa(pp,pv,np)[0] / 100; // Taxa de juros mensal
    var pmt; // Parcela mensal
    if (i === 0) {
        // Caso de juros zero
        pmt = pv / n;
    } else {
        pmt = (pv * i) / (1 - Math.pow(1 + i, -n));
    }

    // Calcular o valor final (se não fornecido)
    if (isNaN(pp)) {
        pp = pmt * n;
    }

    // Calcular o valor a voltar (se não fornecido)
    if (isNaN(pb)) {
        pb = pp - pv;
    }

    // Calcular o Custo Total do Empréstimo
    var cost = n * pmt - pv;

    // Calcular o Valor Total Pago
    var totalPaid = pv + cost;

    // Exibir os resultados
    $("#errorMessage").hide();
    $("#successMessage").html(
        "<p>Parcela Mensal: $" + pmt.toFixed(2) + "</p>" +
        "<p>Valor Final: $" + pp.toFixed(2) + "</p>" +
        "<p>Valor a Voltar: $" + pb.toFixed(2) + "</p>" +
        "<p>Custo Total do Empréstimo: $" + cost.toFixed(2) + "</p>" +
        "<p>Valor Total Pago: $" + totalPaid.toFixed(2) + "</p>"
    );
    $("#successMessage").show();

    // Preencher a tabela com os detalhes mensais
    var resultTable = $("#resultTable tbody");
    resultTable.empty(); // Limpar a tabela anterior, se houver

    var saldoDevedor = pv;
    var valorCorrigido = 0; // Variável para armazenar o valor corrigido



    // loop que itera as linhas da tabela
    for (var month = 1; month <= n; month++) {

        var juros = saldoDevedor * i;
        var amortizacao = pmt - juros;
        saldoDevedor -= amortizacao;



        // Verifique se este é o mês a partir do final que corresponde a "Meses a Voltar"
        if (month == n - mesesVoltar) {
            valorCorrigido = saldoDevedor;
            if (valorCorrigido <= 0){
                valorCorrigido = 0;
                saldoDevedor = 0;
            }
        }
    

        // Adiciona a linha à tabela
        resultTable.append(
            "<tr>" +
            "<td>" + month + "</td>" +
            "<td>$" + pmt.toFixed(2) + "</td>" +
            "<td>$" + juros.toFixed(2) + "</td>" +
            "<td>$" + amortizacao.toFixed(2) + "</td>" +
            "<td>$" + saldoDevedor.toFixed(2) + "</td>" +
            "</tr>"
        );
    }


    // Atualize o valor das informações com base nos valores do formulário
    $("#valorFinanciado").text("$" + $("#ipv").val());
    $("#valorVoltar").text("$" + $("#ipb").val());

    // Leia o valor do campo de entrada "mesesVoltarInput"
    var mesesVoltar = $("#mesesVoltarInput").val();

    // Atualize o elemento de saída "Meses a Voltar" com o valor lido
    $("#mesesVoltar").text(mesesVoltar);


    var isChecked = $("#idp").is(":checked");
    $("#entrada").text(isChecked ? "true" : "false");
    $("#valorFinal").text("$" + $("#ipp").val());


    // Atualize o valor a voltar
    $("#valorVoltar").text("$" + $("#ipb").val());

    // Atualize o valor do parcelamento
    var parcelamento = $("#parc").val();
    $("#parcelamento").text(parcelamento + " meses");

    // Atualize a taxa de juros mensal na div
    var taxaMensal = tax;
    $("#taxaMensal").text((taxaMensal * 100).toFixed(2));
  
   // Calcule a taxa de juros anual com base na taxa mensal
   var taxaAnual = (Math.pow(1 + taxaMensal, 12) - 1) * 100;
   $("#taxaAnual").text(taxaAnual.toFixed(2));



    // Calcule as informações da Div 2
    var valorFinanciado = parseFloat($("#ipv").val());
    var mesesVoltar = parseInt($("#mesesVoltar").val());
    // Verifique se este é o mês a partir do final que corresponde a "Meses a Voltar"
    if (month == n - mesesVoltar) {
        valorCorrigido = saldoDevedor;
        if (valorCorrigido <= 0){
            valorCorrigido = 0;
        }
    }

    var coeficienteFinanciamento = (i / (1 - Math.pow(1 + i, -n)));
    coeficienteFinanciamento = (i / (1 - Math.pow(1 + i, -n)));
    var valorPago = pmt * n;

    // Taxa de Juros Real = ((1 + Taxa de Juros Anual) ^ (1/N) - 1) * 100
    var interacoes = 0;
    var taxaReal = tax == 0? (interacoes = calcularTaxa(pp,pv,np)[1]) && calcularTaxa(pp,pv,np)[0] : 0;
    
    // Atualize as informações na Div 2
    $("#prestacao").text(pmt.toFixed(2));
    $("#coeficienteFinanciamento").text(coeficienteFinanciamento.toFixed(6));
    $("#valorPago").text(valorPago.toFixed(2));
    $("#interacoes").text(interacoes);
    $("#taxaReal").text(taxaReal.toFixed(4));
    // Atualize o valor corrigido na "Div 2"
    $("#valorCorrigido").text(valorCorrigido.toFixed(2));
    
});


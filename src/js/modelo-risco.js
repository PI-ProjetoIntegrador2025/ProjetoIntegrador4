// Modelo de risco de hipertensão arterial (regressão logística treinada com a PNS 2013).
// Os coeficientes ficam em src/data/modelo-dados.js (MODELO_RISCO), gerado por ml/01_limpeza_e_modelo.ipynb.
//
//   logit = intercepto + peso_UF + soma( peso_i * (valor_i - media_i) / desvio_i )
//   probabilidade = 1 / (1 + e^(-logit))
//   score = parte inteira de (probabilidade * 10 + 0,5)     -> 0 a 10

var RiscoHipertensao = (function () {

    var LIMITES = {
        idade: [18, 120],
        peso: [30, 200],     // kg
        altura: [120, 210],  // cm
        cintura: [20, 210]   // cm
    };

    function dentro(valor, faixa) {
        return typeof valor === 'number' && isFinite(valor) && valor >= faixa[0] && valor <= faixa[1];
    }

    function logit(spec, entrada, variaveis) {
        var z = spec.intercepto + spec.uf[entrada.uf];
        variaveis.forEach(function (nome) {
            var v = spec.numericas[nome];
            z += v.peso * (entrada[nome] - v.media) / v.desvio;
        });
        return z;
    }

    function faixaDoScore(modelo, score) {
        for (var i = 0; i < modelo.faixas.length; i++) {
            var f = modelo.faixas[i];
            if (score >= f.score_min && score <= f.score_max) return f.nome;
        }
        return null;
    }

    // entrada: { uf, idade, sexoMasc (0|1), peso, altura, cintura, diabetes (0|1|null), fuma (0|1|null) }
    // devolve { ok, erros[], aviso, modelo, probabilidade, score, faixa, imc }
    function calcular(modelo, entrada) {
        var erros = [];

        if (!entrada.uf || !(entrada.uf in modelo.minimo.uf)) erros.push('Selecione o estado (UF).');
        if (!dentro(entrada.idade, LIMITES.idade) || entrada.idade % 1 !== 0) erros.push('Informe a idade em anos (de 18 a 120).');
        if (entrada.sexoMasc !== 0 && entrada.sexoMasc !== 1) erros.push('Selecione o sexo.');

        var opcionais = [entrada.peso, entrada.altura, entrada.cintura, entrada.diabetes, entrada.fuma];
        var preenchidos = opcionais.filter(function (v) { return v !== null && v !== undefined && !(typeof v === 'number' && isNaN(v)); });
        var usaEstendido = preenchidos.length === opcionais.length;
        var aviso = null;

        if (preenchidos.length > 0 && !usaEstendido) {
            aviso = 'Dados da triagem incompletos: preencha todos os campos opcionais (peso, altura, cintura, diabetes e fumo) para usar o modelo estendido. O cálculo foi feito só com UF, idade e sexo.';
        }
        if (usaEstendido) {
            if (!dentro(entrada.peso, LIMITES.peso)) erros.push('Peso fora da faixa esperada (30 a 200 kg).');
            if (!dentro(entrada.altura, LIMITES.altura)) erros.push('Altura fora da faixa esperada (120 a 210 cm).');
            if (!dentro(entrada.cintura, LIMITES.cintura)) erros.push('Cintura fora da faixa esperada (20 a 210 cm).');
        }
        if (erros.length) return { ok: false, erros: erros };

        var dados = { uf: entrada.uf, idade: entrada.idade, sexo_masc: entrada.sexoMasc };
        var spec = modelo.minimo, variaveis = ['idade', 'sexo_masc'], imc = null;

        if (usaEstendido) {
            imc = entrada.peso / Math.pow(entrada.altura / 100, 2);
            dados.imc = imc;
            dados.cintura = entrada.cintura;
            dados.diabetes = entrada.diabetes;
            dados.fuma = entrada.fuma;
            spec = modelo.estendido;
            variaveis = ['idade', 'sexo_masc', 'imc', 'cintura', 'diabetes', 'fuma'];
        }

        var p = 1 / (1 + Math.exp(-logit(spec, dados, variaveis)));
        var score = Math.floor(p * 10 + 0.5);

        return {
            ok: true,
            erros: [],
            aviso: aviso,
            modelo: usaEstendido ? 'estendido' : 'minimo',
            probabilidade: p,
            score: score,
            faixa: faixaDoScore(modelo, score),
            imc: imc
        };
    }

    // Conteúdo exibido para cada faixa (apoio à triagem; a avaliação do profissional de saúde prevalece).
    var CONTEUDO = {
        'Baixo': {
            classe: 'alert-success',
            mensagem: 'apresenta risco baixo de hipertensão arterial em relação ao perfil da população da PNS.',
            acoes: [
                'Manter a aferição da pressão arterial (PA) nos atendimentos de rotina.',
                'Reforçar hábitos saudáveis: alimentação com pouco sal, atividade física regular, peso adequado e moderação no álcool.'
            ]
        },
        'Moderado': {
            classe: 'alert-info',
            mensagem: 'apresenta risco moderado de hipertensão arterial.',
            acoes: [
                'Aferir a PA neste atendimento, seguindo a técnica padronizada.',
                'Orientar mudanças de estilo de vida (sal, atividade física, peso, fumo e álcool).',
                'Programar nova aferição da PA em um prazo curto, conforme avaliação do profissional.'
            ]
        },
        'Elevado': {
            classe: 'alert-warning',
            mensagem: 'apresenta risco elevado de hipertensão arterial (ou de pré-hipertensão, com PA entre 120 x 80 e 139 x 89 mmHg). Por gentileza, consulte as ações preventivas recomendadas abaixo.',
            acoes: [
                'Aferir a PA neste atendimento e repetir a medição se estiver alterada.',
                'Verificar a conveniência de iniciar o protocolo MRPA (Medição Residencial da Pressão Arterial).',
                'Orientar mudanças de estilo de vida e acompanhar a evolução da PA.'
            ]
        },
        'Muito elevado': {
            classe: 'alert-danger',
            mensagem: 'apresenta risco muito elevado de hipertensão arterial (valores de PA a partir de 140 x 90 mmHg). Por gentileza, consulte as ações preventivas recomendadas abaixo.',
            acoes: [
                'Priorizar a aferição da PA neste atendimento, com repetição da medição.',
                'Iniciar o protocolo MRPA (Medição Residencial da Pressão Arterial) para este paciente.',
                'Verificar a conveniência de aplicar o protocolo MAPA-24 horas (Monitorização Ambulatorial da Pressão Arterial).',
                'Encaminhar para avaliação médica, conforme o protocolo da unidade.'
            ]
        }
    };

    return { calcular: calcular, CONTEUDO: CONTEUDO, LIMITES: LIMITES };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = RiscoHipertensao;

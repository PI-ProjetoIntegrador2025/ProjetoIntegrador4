// Página "Aprendizado de Máquina Especializada - Hipertensão Arterial":
// lê o formulário, calcula o score com o modelo (modelo-risco.js) e mostra o resultado.

(function () {
    var UFS = {
        'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas', 'BA': 'Bahia', 'CE': 'Ceará',
        'DF': 'Distrito Federal', 'ES': 'Espírito Santo', 'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso',
        'MS': 'Mato Grosso do Sul', 'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
        'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
        'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
        'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
    };

    function numero(id) {
        var texto = document.getElementById(id).value.replace(',', '.').trim();
        return texto === '' ? null : Number(texto);
    }

    function escolha(id) {            // '' -> null, '0' -> 0, '1' -> 1
        var v = document.getElementById(id).value;
        return v === '' ? null : Number(v);
    }

    function escapar(texto) {
        var d = document.createElement('div');
        d.textContent = texto;
        return d.innerHTML;
    }

    function mostrarErros(erros) {
        var caixa = document.getElementById('resultado');
        caixa.innerHTML = '<div class="alert alert-danger"><strong>Verifique os dados:</strong><ul class="mb-0">' +
            erros.map(function (e) { return '<li>' + escapar(e) + '</li>'; }).join('') + '</ul></div>';
    }

    function mostrarResultado(r) {
        var conteudo = RiscoHipertensao.CONTEUDO[r.faixa];
        var pct = Math.round(r.probabilidade * 100);
        var usado = r.modelo === 'estendido'
            ? 'Modelo estendido (UF, idade, sexo, IMC' + (r.imc ? ' ' + r.imc.toFixed(1).replace('.', ',') : '') + ', cintura, diabetes e fumo) – AUC ' + String(MODELO_RISCO.auc_teste.estendido).replace('.', ',')
            : 'Modelo mínimo (UF, idade e sexo) – AUC ' + String(MODELO_RISCO.auc_teste.minimo).replace('.', ',');

        var html = '';
        if (r.aviso) html += '<div class="alert alert-secondary small">' + escapar(r.aviso) + '</div>';

        html += '<div class="alert ' + conteudo.classe + '">' +
            '<div class="row align-items-center">' +
            '<div class="col-md-3 text-center">' +
            '<div class="display-3 font-weight-bold" id="resultado-score">' + r.score + '</div>' +
            '<div>de 10 pontos</div></div>' +
            '<div class="col-md-9">' +
            '<h5 class="mb-1">Risco ' + escapar(r.faixa.toLowerCase()) + '</h5>' +
            '<p class="mb-1 text-justify">O score do paciente, <strong>' + r.score + ' pontos</strong> (probabilidade estimada de ' + pct + '%), ' +
            escapar(conteudo.mensagem) + '</p>' +
            '<small class="text-muted">' + escapar(usado) + '</small>' +
            '</div></div></div>';

        html += '<h6 class="mt-4">Ações preventivas (recomendações):</h6><ol class="text-justify">' +
            conteudo.acoes.map(function (a) { return '<li>' + escapar(a) + '</li>'; }).join('') + '</ol>';

        html += '<p class="small text-muted text-justify">Estimativa estatística baseada na Pesquisa Nacional de Saúde 2013 (IBGE), ' +
            'para apoio à triagem. <strong>Não é diagnóstico</strong>: a medição da pressão arterial e a avaliação do profissional de saúde prevalecem.</p>';

        document.getElementById('resultado').innerHTML = html;
    }

    function calcular(evento) {
        evento.preventDefault();
        var entrada = {
            uf: document.getElementById('entrada-uf').value,
            idade: numero('entrada-idade'),
            sexoMasc: escolha('entrada-sexo'),
            peso: numero('entrada-peso'),
            altura: numero('entrada-altura'),
            cintura: numero('entrada-cintura'),
            diabetes: escolha('entrada-diabetes'),
            fuma: escolha('entrada-fuma')
        };
        var r = RiscoHipertensao.calcular(MODELO_RISCO, entrada);
        if (r.ok) mostrarResultado(r); else mostrarErros(r.erros);
    }

    document.addEventListener('DOMContentLoaded', function () {
        var select = document.getElementById('entrada-uf');
        Object.keys(UFS).forEach(function (sigla) {
            var op = document.createElement('option');
            op.value = sigla;
            op.textContent = sigla + ' – ' + UFS[sigla];
            select.appendChild(op);
        });
        document.getElementById('form-risco').addEventListener('submit', calcular);
    });
})();

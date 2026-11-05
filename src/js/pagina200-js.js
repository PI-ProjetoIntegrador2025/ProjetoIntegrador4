// Página "Analise de Dados - Analysis-PA (Hipertensão Arterial":

(function () {
    var UFS = {
        'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas', 'BA': 'Bahia', 'CE': 'Ceará',
        'DF': 'Distrito Federal', 'ES': 'Espírito Santo', 'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso',
        'MS': 'Mato Grosso do Sul', 'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
        'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
        'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
        'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins'
    };
    

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

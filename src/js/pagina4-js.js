//Calendário:
const mesAtual = document.getElementById('mes&ano'),
    diaTag = document.querySelector('#dias'),
    iconeAntesDepois = document.querySelectorAll('.icone span');

var meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

let data = new Date(),
    mes = data.getMonth(),//3
    ano = data.getFullYear();//2025

/**new Date();
new Date(valor);
new Date(dataString);
"YYYY-MM-DD"
new Date(ano, mês, dia, hora, minuto, segundo, milissegundo); 

dateObj.getDate() // O método getDate() retorna o dia do mês da data especificada de acordo com a hora local;

dateObj.getDay() // O método getDay() retorna o dia da semana para a data especificada de acordo com a hora local, 
onde 0 representa o Domingo.
*/

let teste = new Date(2025, 3, 30).getDay();
console.log("Teste " + teste);

function displayData() {
    let ultimoDiaMesAtual = new Date(ano, mes + 1, 0).getDate(),

        diaSemanaPrimeiroDiaMesAtual = new Date(ano, mes, 1).getDay(),
        ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate(),

        diaSemanaUltimoDiaMesAtual = new Date(ano, mes, ultimoDiaMesAtual).getDay();

    let liDia = "";

    for (let i = diaSemanaPrimeiroDiaMesAtual; i > 0; i--) {
        liDia += `<li class="desativo">${ultimoDiaMesAnterior - i + 1}</li>`;
    }


    for (let i = 1; i <= ultimoDiaMesAtual; i++) {
        let hoje = i === data.getDate() && mes === new Date().getMonth() && ano === new Date().getFullYear() ? 'ativo cad' :
            i < data.getDate() && mes === new Date().getMonth() && ano === new Date().getFullYear() ? 'desativo' : 'cad';
        liDia += `<li class="${hoje}">${i}</li>`;
    }

    for (let i = diaSemanaUltimoDiaMesAtual; i < 6; i++) {
        liDia += `<li class="desativo">${i - diaSemanaUltimoDiaMesAtual + 1}</li>`;
    }

    mesAtual.innerText = `${meses[mes]} ${ano}`;
    diaTag.innerHTML = liDia;
}

displayData();

iconeAntesDepois.forEach(icone => {
    icone.addEventListener("click", () => {
        mes = icone.id === "antes" ? mes - 1 === new Date().getMonth() - 1 ? mes : mes - 1 : mes + 1;

        if (mes < 0 || mes > 11) {
            data = new Date(ano, mes),
                mes = data.getMonth(),
                ano = data.getFullYear();
        } else {
            data = new Date();
        }
        displayData();
    })
})
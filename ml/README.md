# Modelo de aprendizado de máquina – risco de hipertensão (PNS 2013)

Parte de Aprendizado de Máquina do Projeto Integrador 4 (UNIVESP).

## O que tem aqui

| Arquivo | Para quê |
|---|---|
| `01_limpeza_e_modelo.ipynb` | Notebook completo: limpeza da PNS 2013, análise exploratória, treino/avaliação, score 0–10, exportação para o site |
| `requirements.txt` | Bibliotecas Python |
| `dados/pns2013_hipertensao_limpa.csv` | Base limpa (59.402 adultos com pressão medida; separador `;`, decimal `,`) – útil também para o dashboard de Análise Populacional |
| `dados/metricas_modelos.csv` | Comparação dos modelos (AUC, precisão média, Brier) |
| `dados/casos_teste.json` | Casos calculados no Python, usados para conferir o JavaScript |
| `figuras/` | Gráficos prontos para o relatório |

O notebook gera também `../src/data/modelo.json` e `../src/data/modelo-dados.js`, que a página
`pagina300-aprendizado.html` usa (via `src/js/modelo-risco.js`) para calcular o score **no navegador**, sem servidor.

## Como rodar o notebook

1. Baixe a base do IBGE (`PNS_2013.csv`) – **ela não está no repositório** (445 MB).
2. Em `01_limpeza_e_modelo.ipynb`, ajuste a variável `CAMINHO_PNS` na célula de configuração.
3. `pip install -r requirements.txt` e execute todas as células (`Run All`).

## Resumo do modelo

* Alvo: pressão medida ≥ 140/90 mmHg **ou** diagnóstico médico de hipertensão.
* Modelo mínimo (UF + idade + sexo) e estendido (+ IMC, cintura, diabetes, fumo): regressão logística.
* Score = parte inteira de (probabilidade × 10 + 0,5); faixas: 0–2 Baixo, 3–4 Moderado, 5–6 Elevado, 7–10 Muito elevado.
* **Apoio à triagem, não é diagnóstico.**

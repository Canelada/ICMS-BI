const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');

// Função para obter dados do Boletim de Arrecadação
async function getBoletimData() {
    return [
        { mes: 'jan', arrecadacao: 3396696802 },
        { mes: 'fev', arrecadacao: 2875750191 },
        { mes: 'mar', arrecadacao: 3303671608 },
        { mes: 'abr', arrecadacao: 3695495022 },
        { mes: 'mai', arrecadacao: 3614986330 },
        { mes: 'jun', arrecadacao: 3560570036 },
        { mes: 'jul', arrecadacao: 3612400327 },
        { mes: 'ago', arrecadacao: 3941040217 },
        { mes: 'set', arrecadacao: 4075958492 },
        { mes: 'out', arrecadacao: 3913886177 },
        { mes: 'nov', arrecadacao: 4047408892 },
        { mes: 'dez', arrecadacao: 4664675213 }
    ];
}

// Mapeamento correto dos meses
const mesesMap = {
    "MR": "dez", "MR-1": "nov", "MR-2": "out", "MR-3": "set",
    "MR-4": "ago", "MR-5": "jul", "MR-6": "jun", "MR-7": "mai",
    "MR-8": "abr", "MR-9": "mar", "MR-10": "fev", "MR-11": "jan"
};

// Função para obter dados da API do Siconfi para o Paraná
async function getSiconfiData() {
    const url = 'https://apidatalake.tesouro.gov.br/ords/siconfi/tt/rreo';
    const anExercicio = 2023;
    const coTipoDemonstrativo = 'RREO';
    const idEnte = 41; // Código IBGE do Paraná
    const coEsfera = 'E';

    let allData = [];
    let hasError = false;

    for (let nrPeriodo = 1; nrPeriodo <= 6; nrPeriodo++) {
        try {
            const params = {
                an_exercicio: anExercicio,
                nr_periodo: nrPeriodo,
                co_tipo_demonstrativo: coTipoDemonstrativo,
                co_esfera: coEsfera,
                id_ente: idEnte
            };

            console.log(`Fetching data for period ${nrPeriodo} with params:`, params);
            const response = await axios.get(url, { params });

            if (response.data && response.data.items && Array.isArray(response.data.items)) {
                allData = allData.concat(response.data.items);
            } else {
                console.warn(`No data or invalid data structure for period ${nrPeriodo}`);
            }
        } catch (error) {
            hasError = true;
            console.error(`Failed to fetch Siconfi data for period ${nrPeriodo}: ${error.message}`);
        }
    }

    if (allData.length === 0 && hasError) {
        throw new Error('No Siconfi data fetched');
    }

    // Filtrar apenas os dados de ICMS e anexo RREO-Anexo 03
    const filteredData = allData.filter(item =>
        item.anexo === 'RREO-Anexo 03' &&
        item.conta && item.conta.includes('ICMS') &&
        item.coluna &&
        item.coluna !== 'PREVISÃO ATUALIZADA 2023' &&
        item.coluna !== 'TOTAL (ÚLTIMOS 12 MESES)'
    );

    return filteredData;
}

// Função para salvar dados em CSV
async function saveDataToCSV(data, filename) {
    if (!data || data.length === 0) {
        throw new Error('No data to save');
    }

    const csvWriter = createCsvWriter({
        path: filename,
        header: Object.keys(data[0]).map(key => ({ id: key, title: key }))
    });

    await csvWriter.writeRecords(data);
}

// Função principal para obter e salvar dados
async function main() {
    try {
        // Obter dados do Boletim
        const boletimData = await getBoletimData();
        await saveDataToCSV(boletimData, 'boletim_data.csv');

        // Obter dados do Siconfi
        const siconfiData = await getSiconfiData();

        

        // Normalizar meses e preparar dados para CSV
        const siconfiFormattedData = siconfiData.map(item => {
            // Remover caracteres extras como < > da coluna
            let colunaFormatada = item.coluna ? item.coluna.replace(/[<>]/g, '').trim() : '';

            // Fazer a conversão correta para os meses
            let mesConvertido = mesesMap[colunaFormatada] || colunaFormatada;

            // Log para depuração
            console.log(`Coluna antes: ${item.coluna}, Formatada: ${colunaFormatada}, Mês convertido: ${mesConvertido}`);

            return {
                exercicio: item.exercicio,
                demonstrativo: item.demonstrativo,
                periodo: item.periodo,
                periodicidade: item.periodicidade,
                instituicao: item.instituicao,
                cod_ibge: item.cod_ibge,
                uf: item.uf,
                populacao: item.populacao,
                anexo: item.anexo,
                esfera: item.esfera,
                rotulo: item.rotulo,
                coluna: colunaFormatada, // Agora contém o valor formatado
                mes_referencia: mesConvertido, // Agora contém o valor correto ou original
                cod_conta: item.cod_conta,
                conta: item.conta,
                valor: item.valor
            };
        });

        await saveDataToCSV(siconfiFormattedData, 'siconfi_data.csv');
        console.log("✅ Dados do Siconfi salvos corretamente com conversão de meses!");

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Executar script
main();

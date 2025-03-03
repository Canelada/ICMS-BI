const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process'); // Importa módulo para executar comandos no sistema

const app = express();
app.use(cors());  // Habilita requisições do frontend

const port = 3000;

// Função para rodar getData.js antes de processar os dados
function updateData(callback) {
    console.log("🔄 Atualizando dados do Siconfi...");
    exec('node src/getData.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`❌ Erro ao atualizar dados: ${error.message}`);
            return callback(error);
        }
        if (stderr) {
            console.warn(`⚠️ Aviso: ${stderr}`);
        }
        console.log(`✅ Dados atualizados com sucesso:\n${stdout}`);
        callback(null);
    });
}

// Função para carregar CSV
function loadCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

// Rota para obter os dados processados
app.get('/data', async (req, res) => {
    updateData(async (error) => {
        if (error) return res.status(500).json({ error: "Erro ao atualizar os dados" });

        try {
            const boletimData = await loadCSV(path.join(__dirname, '../boletim_data.csv'));
            const siconfiData = await loadCSV(path.join(__dirname, '../siconfi_data.csv'));

            console.log(`📊 Boletim Data: ${boletimData.length} registros`);
            console.log(`📊 Siconfi Data: ${siconfiData.length} registros`);

            res.json({ boletim: boletimData, siconfi: siconfiData });
        } catch (error) {
            console.error("❌ Erro ao carregar os dados:", error);
            res.status(500).json({ error: "Erro ao carregar os dados" });
        }
    });
});

// Servir o frontend
app.use(express.static(path.join(__dirname, '../public')));

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(port, () => {
    console.log(`📡 Servidor rodando em http://localhost:${port}`);
});

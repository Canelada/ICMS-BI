const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');

const app = express();
app.use(cors());

const port = 3000;

// Atualiza os dados antes de processar a requisição
function updateData(callback) {
    exec('node src/getData.js', (error) => {
        if (error) return callback(error);
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
            res.json({ boletim: boletimData, siconfi: siconfiData });
        } catch (error) {
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

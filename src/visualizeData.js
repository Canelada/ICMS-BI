const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

const port = process.env.PORT || 8080; // 🔥 Azure exige process.env.PORT

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
  try {
    const boletimData = await loadCSV(
      path.join(__dirname, '../boletim_data.csv')
    );
    const siconfiData = await loadCSV(
      path.join(__dirname, '../siconfi_data.csv')
    );

    res.json({ boletim: boletimData, siconfi: siconfiData });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar os dados' });
  }
});

// Servir o frontend
app.use(express.static(path.join(__dirname, '../public')));

// Rota principal para o dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`📡 Servidor rodando na porta ${port}`);
});

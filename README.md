📂 icms-bi
│── 📂 src
│   │── getData.js         # 🔄 Coleta os dados da API do Siconfi e salva em CSV
│   │── visualizeData.js   # 📡 Servidor Express.js que processa e serve os dados para o frontend
│── 📂 public
│   │── index.html         # 🌍 Página principal do dashboard
│   │── script.js          # 📜 Consome API e renderiza o gráfico com Chart.js
│   │── style.css          # 🎨 Estilos visuais do dashboard
│── 📂 data
│   │── boletim_data.csv   # 📄 Dados do boletim de arrecadação (fonte 1)
│   │── siconfi_data.csv   # 📄 Dados extraídos da API do Siconfi (fonte 2)
│── package.json           # 📦 Dependências do Node.js
│── README.md              # 📖 Documentação do projeto

🔁 Fluxo de Funcionamento

1️⃣ O usuário acessa a página
Usuário → [ Navegador ] → http://localhost:3000/
O frontend faz uma requisição para o backend pedindo os dados.

2️⃣ O servidor Express.js recebe a requisição
Frontend (script.js) → [ API (Express.js) ] → /data
O servidor processa a requisição e chama getData.js para garantir que os dados estejam atualizados.

3️⃣ O backend executa getData.js para coletar dados
API (Express.js) → Executa → getData.js
getData.js → 🔄 Faz requisição à API do Siconfi → 💾 Salva CSV
getData.js:

Consulta os dados da API do Siconfi.
Filtra e processa os valores.
Salva os dados em siconfi_data.csv.
4️⃣ O servidor carrega os dados do CSV e retorna JSON
API (Express.js) → 📄 Lê boletim_data.csv + siconfi_data.csv → 🔄 Retorna JSON ao frontend
O backend lê os arquivos CSV e monta um JSON no seguinte formato:

{
    "boletim": [
        { "mes": "jan", "arrecadacao": 3396696802 },
        { "mes": "fev", "arrecadacao": 2875750191 }
    ],
    "siconfi": [
        { "mes_referencia": "jan", "valor": 2855616828 },
        { "mes_referencia": "fev", "valor": 3154991230 }
    ]
}
5️⃣ O frontend exibe o gráfico com os dados
JSON recebido → [ script.js ] → Chart.js → 📊 Renderiza gráfico no index.html
O script.js pega os dados do JSON, organiza por mês e exibe o gráfico comparando Boletim x Siconfi.

🛠 Resumo do Processo

1️⃣ O usuário acessa o dashboard no navegador.
2️⃣ O frontend solicita os dados para o servidor Express.js.
3️⃣ O servidor roda `getData.js` para atualizar os dados do Siconfi.
4️⃣ Os dados são carregados dos arquivos CSV e enviados como JSON.
5️⃣ O frontend exibe os dados no gráfico.
6️⃣ Se o usuário recarregar a página, o processo se repete e os dados são sempre atualizados!
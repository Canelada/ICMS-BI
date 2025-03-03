📂 Estrutura do Projeto
📂 icms-bi
│── 📂 src
│   │── getData.js        # 🔄 Obtém e processa os dados do Siconfi e Boletim
│   │── visualizeData.js  # 📡 Servidor Express.js que serve os dados para o frontend
│── 📂 public
│   │── index.html        # 🌍 Página do dashboard
│   │── script.js         # 📜 Lógica do frontend para consumir a API e exibir gráficos
│   │── style.css         # 🎨 Estilos visuais do dashboard
│── 📂 data
│   │── boletim_data.csv  # 📄 Dados da arrecadação do boletim
│   │── siconfi_data.csv  # 📄 Dados extraídos da API do Siconfi
│── package.json          # 📦 Dependências do Node.js
│── README.md             # 📖 Documentação do projeto

📊 Fluxo da Aplicação

1️⃣ O usuário acessa o dashboard (http://localhost:3000/)
    ⬇️
2️⃣ O frontend (script.js) faz uma requisição GET para /data
    ⬇️
3️⃣ O backend (visualizeData.js) recebe a requisição e executa:
    - Chama getData.js para obter novos dados do Siconfi
    - Lê boletim_data.csv e siconfi_data.csv
    - Retorna um JSON com os dados para o frontend
    ⬇️
4️⃣ O frontend processa o JSON e usa Chart.js para renderizar o gráfico
    ⬇️
5️⃣ O usuário vê o gráfico atualizado na interface

[ Usuário ] → (HTTP Request) → [ Frontend (HTML + JS) ] → (API Call) → [ Backend (Express.js) ]
                  ⬇️                                      ⬇️
                Chart.js                     CSV Processado e Enviado
                  ⬇️                                      ⬇️
             Dashboard ICMS                      Siconfi API


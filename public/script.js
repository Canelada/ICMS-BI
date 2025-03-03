async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/data');
        const data = await response.json();

        if (!data.boletim || !data.siconfi) {
            console.error("❌ Erro: Dados não carregados corretamente", data);
            return;
        }

        console.log("📊 Dados recebidos do backend:", data);

        // Definir a ordem correta dos meses
        const mesesOrdem = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

        // Criar objetos para armazenar os valores do Boletim e do Siconfi
        let boletimMap = {};
        let siconfiMap = {};

        // Preencher os valores do boletim no mapa
        data.boletim.forEach(d => {
            boletimMap[d.mes] = parseFloat(d.arrecadacao) || 0;
        });

        // Preencher os valores do Siconfi no mapa
        data.siconfi.forEach(d => {
            siconfiMap[d.mes_referencia] = parseFloat(d.valor) || 0;
        });

        // Criar arrays alinhados e ordenados para exibir no gráfico
        const boletimValores = mesesOrdem.map(mes => boletimMap[mes] || 0);
        const siconfiValores = mesesOrdem.map(mes => siconfiMap[mes] || 0);

        // Exibir logs para depuração
        console.log("📊 Boletim por mês:", boletimMap);
        console.log("📊 Siconfi por mês:", siconfiMap);

        // Configurar o gráfico
        const ctx = document.getElementById('icmsChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: mesesOrdem,
                datasets: [
                    {
                        label: "Boletim",
                        data: boletimValores,
                        backgroundColor: 'blue'
                    },
                    {
                        label: "Siconfi",
                        data: siconfiValores,
                        backgroundColor: 'orange'
                    }
                ]
            },
            options: { responsive: true }
        });

    } catch (error) {
        console.error("❌ Erro ao carregar os dados:", error);
    }
}

// Chamar a função para carregar os dados
fetchData();

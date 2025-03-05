async function fetchData() {
  try {
    const response = await fetch("https://icms-bi.onrender.com/data");
    const data = await response.json();

    if (!data.boletim || !data.siconfi) return;

    const mesesOrdem = [
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez",
    ];

    let boletimMap = {};
    let siconfiMap = {};

    data.boletim.forEach(
      (d) => (boletimMap[d.mes] = parseFloat(d.arrecadacao) || 0)
    );
    data.siconfi.forEach(
      (d) => (siconfiMap[d.mes_referencia] = parseFloat(d.valor) || 0)
    );

    const boletimValores = mesesOrdem.map((mes) => boletimMap[mes] || 0);
    const siconfiValores = mesesOrdem.map((mes) => siconfiMap[mes] || 0);

    // Configuração do gráfico com labels e responsividade 🔥
    const ctx = document.getElementById("icmsChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: mesesOrdem,
        datasets: [
          {
            label: "Boletim",
            data: boletimValores,
            backgroundColor: "rgba(54, 162, 235, 0.7)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
          {
            label: "Siconfi",
            data: siconfiValores,
            backgroundColor: "rgba(255, 159, 64, 0.7)",
            borderColor: "rgba(255, 159, 64, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true, // 🔥 Ajusta dinamicamente
        maintainAspectRatio: false, // 🔥 Não fixa tamanho
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (tooltipItem) {
                return `R$ ${tooltipItem.raw.toLocaleString("pt-BR")}`;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return `R$ ${value.toLocaleString("pt-BR")}`;
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("❌ Erro ao carregar os dados:", error);
  }
}

fetchData();

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

    const ctx = document.getElementById("icmsChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: mesesOrdem,
        datasets: [
          { label: "Boletim", data: boletimValores, backgroundColor: "blue" },
          { label: "Siconfi", data: siconfiValores, backgroundColor: "orange" },
        ],
      },
      options: { responsive: true },
    });
  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }
}

fetchData();

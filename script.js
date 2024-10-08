

const container = document.getElementById("container")


const generateList = (arr) => {
   const list = arr.map((item) => {
        const formattedLastContact = new Date(item.ultimoContato * 1000).toLocaleDateString('pt-BR')
        const formatterValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor)
        return `
            <div class="item">
                <div class="item__header">
                    <h2 class="item__title">${item.nomeImovel}</h2>
                </div>
                <div class="item__body">
                    <p>
                        <span class="item__label">Valor:</span>
                        <span class="item__value">${formatterValue}</span>
                    </p>
                    <p>
                        <span class="item__label">Cliente:</span>
                        <span class="item__value">${item.proprietario}</span>
                    </p>
                </div>
                <div class="item__footer">
                    <p>
                        <span class="item__label">Último Contato:</span>
                        <span class="item__value">${formattedLastContact}</span>
                    </p>
                </div>
            </div>
        `
    })

    container.innerHTML = list.join('')
}

async function load() {
    try {
      const response = await fetch("http://localhost:4001/api/imoveis/ordenados");
      const data = await response.json();
        generateList(data)
    } catch (error) {
    //   console.error("Error fetching data:", error);
      alert("Error fetching data");
    }
  }
  
load();
const dateOnlyRegex = /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])))$/

function parseDateString(dateString) {
  if (dateOnlyRegex.test(dateString)) {
    const utcDate = new Date(dateString)
    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000)
    return localDate  
  }
  return new Date(dateString)
}

const populateEditForm = (item) => {
    const sidebar = document.getElementById('edit')
    sidebar.setAttribute('class', 'edit-sidebar active')

    document.getElementById('imovel_id').value = item.id;
    document.getElementById('imovel_nome').value = item.nomeImovel;
    document.getElementById('imovel_cliente').value = item.proprietario;
    document.getElementById('imovel_contato').value = item.contato;
    document.getElementById('imovel_valor').value = item.valor;
    document.getElementById('imovel_corretor').value = item.corretor;
    if (item.status === "1") {
        document.getElementById("available").checked = true
    } else {
        document.getElementById("unavailable").checked = true
    }
 
}


const closeSidebar = () => {
    const sidebar = document.getElementById('edit')
    sidebar.setAttribute('class', 'edit-sidebar')
}
document.getElementById("closeSidebar").addEventListener("click", closeSidebar)


const container = document.getElementById("container");
const generateList = (arr) => {
   const list = arr.map((item, index) => {
        const formattedLastContact = parseDateString(item.ultimoContato).toLocaleDateString('pt-BR');
        const formattedCreationDate = parseDateString(item.dataRegistro).toLocaleDateString('pt-BR');
        const formatterValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.valor);
        const formatStatus = item.status === "1" ? 'Disponível' : 'Indisponível';
        const isAvailable = item.status === "1";
        const handleStatusClass = isAvailable ? 'item__status--available' : 'item__status--unavailable';
        
        return `
            <div class="item">
                <div class="item__header">
                    <h2 class="item__title">${item.nomeImovel}</h2>
                    <div class="item__status ${handleStatusClass}">${formatStatus}</div>
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
                     <p>
                        <span class="item__label">Modo de contato:</span>
                        <span class="item__value">${item.contato}</span>
                    </p>
                    <p>
                        <span class="item__label">Último Contato:</span>
                        <span class="item__value">${formattedLastContact}</span>
                    </p>
                    <p>
                        <span class="item__label">Data de registro:</span>
                        <span class="item__value">${formattedCreationDate}</span>
                    </p>
                </div>
                <div class="item__footer">
                    <button class="edit__button" data-index="${index}">
                        ✎
                    </button>
                </div>
            </div>
        `;
    });
    container.innerHTML = list.join('');
}


async function load() {
    try {
      const response = await fetch("http://localhost:4001/api/imoveis/ordenados");
      const data = await response.json();
      generateList(data)
        // Add event listeners to each edit button
        const editButtons = document.querySelectorAll('.edit__button');
        editButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                const itemIndex = event.currentTarget.getAttribute('data-index');
                populateEditForm(data[itemIndex]);
            });
        });
    } catch (error) {
        console.log(error)
        if (error) {alert("Error fetching data");}
    }
  }
  
load();

const submitEditForm = async (event) => {
    event.preventDefault()
    const id = document.getElementById('imovel_id').value;

    const status = document.getElementById('available').checked? "1" : "2"
    
    await fetch(`http://localhost:4001/api/imoveis/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nomeImovel: document.getElementById('imovel_nome').value,
            proprietario: document.getElementById('imovel_cliente').value,
            contato: document.getElementById('imovel_contato').value,
            valor: document.getElementById('imovel_valor').value,
            corretor: document.getElementById('imovel_corretor').value,
            status
        })
    })

    alert("Imóvel editado com sucesso!");
    closeSidebar();
    load();
}
document.getElementById("imovelForm").addEventListener("submit", submitEditForm)

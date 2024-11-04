document.getElementById('imovelForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    
    const nome = document.getElementById('nome').value;
    const cliente = document.getElementById('cliente').value;
    const contato = document.getElementById('contato').value;
    const valor = document.getElementById('valor').value;
    const corretor = document.getElementById('corretor').value;

    const novoImovel = {
        nomeImovel: nome,
        proprietario: cliente,
        contato: contato,
        valor: Number(valor), 
        corretor: corretor,
        status: "1", 
    };

    // Envia o novo imóvel para o backend
    try {
        const response = await fetch('http://localhost:4001/api/imoveis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoImovel),
        });

        if (response.ok) {
            alert('Imóvel cadastrado com sucesso!');
            // Redireciona de volta para a página principal após o cadastro
           window.location.href = 'index.html';
        } else {
            alert('Erro ao cadastrar o imóvel.');
        }
    } catch (error) {
        console.error('Erro ao cadastrar o imóvel:', error);
        alert('Erro ao conectar com o servidor.');
    }
});

const closeForm = () => {
    window.location.href = 'index.html'; 
}
document.getElementById("closeForm").addEventListener("click", closeForm)
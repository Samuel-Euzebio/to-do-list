const add = document.querySelector('#add');
const lista = document.querySelector('#lista');

add.addEventListener('click', (event) => {
    event.preventDefault();
    adicionarTarefa();
});

function adicionarTarefa(texto = null) {
    const input = document.querySelector('#input');
    const tarefaTexto = texto !== null ? texto : input.value.trim();

    if (tarefaTexto === '') {
        input.classList.add('input-erro');
        return;
    } else {
        input.classList.remove('input-erro');
    }

    const newElement = document.createElement('li');
    newElement.textContent = tarefaTexto;

    const editButton = document.createElement('button');
    editButton.className = 'edit-button';
    editButton.textContent = 'Editar';

    const removeButton = document.createElement('button');
    removeButton.className = 'remove';
    removeButton.textContent = 'Remover';


    removeButton.addEventListener('click', (event) => {
        event.stopPropagation();
        lista.removeChild(newElement);
        salvarTarefas();
    });

    newElement.appendChild(editButton);
    newElement.appendChild(removeButton);
    lista.appendChild(newElement);

    if (texto === null) {
        input.value = '';
    } 

    newElement.addEventListener('click', ()=> {
        newElement.classList.toggle('tarefa-concluida');
        salvarTarefas();
    });

    editButton.addEventListener('click', (event) => {

        event.stopPropagation();

        const originalTexto = newElement.firstChild.textContent;

        const inputEditar = document.createElement('input');
        inputEditar.type = 'text';
        inputEditar.value = originalTexto;
        inputEditar.classList.add('editar-input');

        newElement.textContent = ''; 
        newElement.appendChild(inputEditar);
        inputEditar.focus();

        
        const salvarEdicao = () => {
            const novoTexto = inputEditar.value.trim();
            if (novoTexto !== '') {
                newElement.textContent = novoTexto;
                newElement.appendChild(editButton);
                newElement.appendChild(removeButton); 
                salvarTarefas();
            } else {
                newElement.textContent = originalTexto;
                newElement.appendChild(editButton);
                newElement.appendChild(removeButton);
            }
        };

        inputEditar.addEventListener('blur', salvarEdicao);
        inputEditar.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                salvarEdicao();
            }
        });

    });

    salvarTarefas();

};

function salvarTarefas() {
    const tarefas = [];
    lista.querySelectorAll('li').forEach(li => {
        tarefas.push({
            texto: li.firstChild.textContent,
            concluida: li.classList.contains('tarefa-concluida')
        });
    });
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
};

function carregarTarefas(){
    const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas'));
    if (tarefasSalvas) {
        tarefasSalvas.forEach(tarefa => {
            adicionarTarefa(tarefa.texto);
            if (tarefa.concluida){
                const ultimoLi = lista.lastChild;
                ultimoLi.classList.add('tarefa-concluida');
            }
        });
    }
}

const campoBusca = document.querySelector('.busca');

campoBusca.addEventListener('input', ()=> {
    const termo = campoBusca.value.toLowerCase();
    const itens = lista.querySelectorAll('li');

    itens.forEach(item => {
        const texto = item.firstChild.textContent.toLowerCase();
        item.style.display = texto.includes(termo) ? 'flex' : 'none';
    });
});

const botaoOrdenarNome = document.querySelector('#ordenar-nome');
const botaoOrdenarStatus = document.querySelector('#ordenar-status');

botaoOrdenarNome.addEventListener('click', ()=>{
    const itens = Array.from(lista.querySelectorAll('li'));

    itens.sort((a, b)=>{
        const textoA = a.firstChild.textContent.toLowerCase();
        const textoB = b.firstChild.textContent.toLowerCase();
        return textoA.localeCompare(textoB)
    });

    itens.forEach(item => lista.appendChild(item));
});

botaoOrdenarStatus.addEventListener('click', ()=>{
    const itens = Array.from(lista.querySelectorAll('li'));

    itens.sort((a, b) =>{
        const statusA = a.classList.contains('tarefa-concluida') ? 1 : 0;
        const statusB = b.classList.contains('tarefa-concluida') ? 1 : 0;
        return statusA - statusB;
    });

    itens.forEach(item => lista.appendChild(item));

});

const botaoLimpar = document.querySelector('#limpar');

botaoLimpar.addEventListener('click', ()=>{

    const confirmar = confirm('Deseja apagar TODAS as tarefas?');

    if(confirmar){
        const itens = lista.querySelectorAll('li');
        itens.forEach( tarefa => tarefa.remove());
        localStorage.removeItem('tarefas');
    };
    
});

carregarTarefas();
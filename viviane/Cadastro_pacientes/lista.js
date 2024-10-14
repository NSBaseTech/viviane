verificaAutenticado()

document.getElementById("ch-side").addEventListener("change",event=>{
  const mainSide=document.getElementById("main-side")
  if(event.target.checked){
     mainSide.classList.remove("off") 
  }
  else{
     mainSide.classList.add("off") 
  }
})

document.getElementById("btn_voltar_li").addEventListener("click", () => {
  window.location.href = '../Menu/menu.html';
});

document.getElementById("open-chat-btn1").addEventListener("click", () => {
  window.location.href = '../chat/chat.html'
})

const tbody = document.querySelector("tbody");
const type = document.querySelector("#type");
let items = [];

function editarItem(index) {
  const url = new URL(window.location.href)
  url.pathname = `/sistema/EditarPacientes/editar.html`
  url.searchParams.set("id",  items.filter(item => item.Especialista === list.value)[index].id);
  window.location.href = url.toString()
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.Nome}</td>
  </td>
    <td class="columnAction">
      <button onclick="editarItem(${index})"><i class='bi bi-pencil'></i></button>
    </td>
     <td class="columnAction">
     <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

function loadItens(user) {
  tbody.innerHTML = ''

  items.filter(item => item.Especialista === user).forEach((item, index) => {
    insertItem(item, index);
  });
}

function deleteItem(index) {
  // Filtra o item com base no Especialista selecionado
  const filteredItems = items.filter(item => item.Especialista === list.value);

  // Verifica se o índice é válido no array filtrado
  if (filteredItems[index]) {
    const itemToDelete = filteredItems[index];
    const patientName = itemToDelete.Nome; // Supondo que o campo do nome do paciente seja 'Nome'

    // Primeiro alerta de confirmação com o nome do paciente
    const confirmDelete = confirm(`Tem certeza que deseja deletar o cadastro do(a) paciente ${patientName}?`);

    if (confirmDelete) {
       // Alerta para verificar agendamentos em aberto
       alert("Verifique se o(a) paciente possui agendamentos em aberto.");
       
      const idToDelete = itemToDelete.id;

      // Realiza a requisição DELETE
      fetch('/pacientes', {
        method: 'DELETE',
        body: JSON.stringify({ id: idToDelete }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao deletar o cadastro.");
        }
        return response.json();
      })
      .then(() => {
        // Remover o item excluído do array 'items' localmente
        items = items.filter(item => item.id !== idToDelete);
        loadItens(); // Atualiza a lista na interface

        // Segundo alerta de sucesso
        alert("Cadastro deletado com sucesso.");
        location.reload();
      })
      .catch(error => {
        console.error('Erro ao deletar item:', error);
        alert('Erro ao deletar o cadastro. Por favor, tente novamente.');
      });
    } else {
      console.log('Ação de exclusão cancelada.');
    }
  } else {
    console.error('Índice de item inválido ou item não encontrado para o Especialista selecionado.');
  }
}




const getItensBD = async () => {
  const response = await fetch('/pacientes')
 items = await response.json()
}


getItensBD()




const list = document.getElementById("lista")

list.addEventListener('change', e => {
  loadItens(e.target.value)
})

;(async () => {
  const token = localStorage.getItem(CHAVE)

  const response = await fetch('/verify', {
      body: JSON.stringify({ token }),
      method: 'POST',
      headers: {
          "Content-Type": "application/json"
      }
  })

  const data = await response.json()
  Usuario = data.Usuario;
  const userGreeting = document.getElementById('userGreeting');
    userGreeting.textContent = `Olá, ${Usuario}!`;

  // data = USUARIO DO BANCO LOGADO

// -----------------------------------

  const response2 = await fetch('/users')
  const consultores = await response2.json()


  if (data.Secretaria) {
    consultores.filter(arq=>!arq.Secretaria && arq.Nome !== "ADM").forEach(({Usuario, Nome}) => {
          list.innerHTML += `<option value="${Usuario}">${Nome}</option>`
      })
  } else {
      [data].forEach(({Usuario, Nome}) => {
          list.innerHTML += `<option value="${Usuario}">${Nome}</option>`
          console.log(Usuario)
      })
  }
})().catch(console.error)


const draggable = document.getElementById('draggable-container');
let isDraggable = true;
let mouseDown = false;

draggable.onmousedown = function(event) {
    if (!isDraggable) return;

    mouseDown = true;
    event.preventDefault();
    
    let shiftX = event.clientX - draggable.getBoundingClientRect().left;
    let shiftY = event.clientY - draggable.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        draggable.style.left = pageX - shiftX + 'px';
        draggable.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        if (mouseDown) {
            moveAt(event.pageX, event.pageY);
        }
    }

    document.addEventListener('mousemove', onMouseMove);

    draggable.onmouseup = function() {
        mouseDown = false;
        document.removeEventListener('mousemove', onMouseMove);
    };
};

draggable.ondragstart = function() {
    return false;
};

document.addEventListener('click', function(event) {
    isDraggable = !isDraggable;
    draggable.style.cursor = isDraggable ? 'move' : 'default';
});



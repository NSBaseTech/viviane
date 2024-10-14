verificaAutenticado()

let Usuario = ""

const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const date = document.querySelector("#date");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items = []

btnNew.onclick = (event) => {
  if (descItem.value === "" || amount.value === "" || type.value === "" || date.value === "") {
    return alert("Preencha todos os campos!");
  }

  const Descricao = descItem.value
  const Valor = parseFloat(amount.value, 10);
  const Tipo = type.value
  const Data = date.value

  descItem.value = "";
  amount.value = "";
  date.value = "";


  
  fetch('/Fluxo_de_caixa', {
    method: 'POST',
    body: JSON.stringify({
      Descricao,
      Valor,
      Tipo,
      Data,
      Especialista: Usuario
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(() => {
      location.reload();
  })

};


function deleteItem(index) {

  fetch('/Fluxo_de_caixa', {
    method: 'DELETE',
    body: JSON.stringify({
      id: items[index].id
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(() => {
    loadItens()
  })
  location.reload();
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.Descricao}</td>
    <td>R$ ${item.Valor}</td>
    
    <td class="columnType">${item.Tipo === "Entrada"
      ? '<i class="bx bxs-chevron-up-circle"></i>'
      : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td>${item.Data}</td>
    <td class="columnAction">
      ${
        item.Descricao.startsWith('Atendimento: ') ? '' : `<button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>`
      }
      
    </td>
  `;

  tbody.appendChild(tr);
}

function loadItens() {
  const mes = document.getElementById('meses').value
  const selectedYear = document.getElementById('selected-year').value
  const selectedPaciente = document.getElementById('selected-Pacientes').value

  console.log(selectedPaciente)

  tbody.innerHTML = "";

  const itensFiltrados = items.filter(item => item.Especialista === Usuario 
    && (mes === '' || item.Data.split('-')[1] === mes) 
    && (selectedYear === '' || item.Data.split('-')[0] === selectedYear) 
    && (selectedPaciente === '' || item.Descricao === selectedPaciente))
    console.log(itensFiltrados)
  itensFiltrados.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals(itensFiltrados);
}

function getTotals(itensFiltrados) {
  const amountIncomes = itensFiltrados
    .filter((item) => item.Tipo === "Entrada" && item.Especialista === Usuario)
    .map((transaction) => Number(transaction.Valor));

  const amountExpenses = itensFiltrados
    .filter((item) => item.Tipo === "Saída" && item.Especialista === Usuario)
    .map((transaction) => Number(transaction.Valor));

  const totalIncomes = amountIncomes
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);

  const totalExpenses = Math.abs(
    amountExpenses.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2);

  const totalItems = (totalIncomes - totalExpenses).toFixed(2);

  incomes.innerHTML = totalIncomes;
  expenses.innerHTML = totalExpenses;
  total.innerHTML = totalItems;
}

const getItensBD = async () => {
  const response = await fetch('/Fluxo_de_caixa')
  items = await response.json()


  const itensFiltrados = items.filter(item => item.Especialista === Usuario) 
  const atendimentos = itensFiltrados.filter(items => items.Descricao.startsWith('Atendimento: ')).map(arg => arg.Descricao)
   
   
  let atendimentosDistintos = [...new Set(atendimentos)];

  document.getElementById('selected-Pacientes').innerHTML += atendimentosDistintos.map(arg => `
    <option value="${arg}">${arg.replace('Atendimento: ', '')}</option>  
  `)
}





  ; (async () => {
    const token = localStorage.getItem(CHAVE)

    const response = await fetch('/verify', {
      body: JSON.stringify({ token }),
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }
    })

    const data = await response.json()

    Usuario = data.Usuario

    const userGreeting = document.getElementById('userGreeting');
    userGreeting.textContent = `Olá, ${Usuario}!`;

    await getItensBD()

    loadItens();
  })().catch(console.error)

document.getElementById("ch-side").addEventListener("change", event => {
  const mainSide = document.getElementById("main-side")
  if (event.target.checked) {
    mainSide.classList.remove("off")
  }
  else {
    mainSide.classList.add("off")
  }
})



document.getElementById("btn_voltar_flx").addEventListener("click", () => {
  window.location.href = '../Menu/menu.html';
}); 

document.getElementById("open-chat-btn1").addEventListener("click", () => {
  window.location.href = '../chat/chat.html'
})

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



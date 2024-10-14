verificaAutenticado()

document.getElementById("ch-side").addEventListener("change", event => {
    const mainSide = document.getElementById("main-side")
    if (event.target.checked) {
        mainSide.classList.remove("off")
    }
    else {
        mainSide.classList.add("off")
    }
})

document.getElementById("open-chat-btn1").addEventListener("click", () => {
    window.location.href = '../chat/chat.html'
})

document.getElementById("btn_voltar_ed").addEventListener("click", () => {
    window.location.href = '../Cadastro_pacientes/lista_pacientes.html'
})


document.getElementById('btn_cadastrar').addEventListener('click', cadastrar_paciente);


const list = document.getElementById("lista")

const nameinp = document.getElementById("name")
const phoneinp = document.getElementById("phone")
const emailinp = document.getElementById("email")
const nascinp = document.getElementById("nasc")
const cpf_cnpjinp = document.getElementById("cpf_cnpj")
const addressinp = document.getElementById("address")
const numberinp = document.getElementById("number")
const cepinp = document.getElementById("cep");
const cidadeinp = document.getElementById("cidade")
const estadoinp = document.getElementById("estado")
const isehcrianca = document.getElementById("mostrarSubformi")
const namepaiinp = document.getElementById("namepai")
const phonepaiinp = document.getElementById("phonepai")
const namemaeinp = document.getElementById("namemae")
const phonemaeinp = document.getElementById("phonemae")

    ; (async () => {
        const params = new URLSearchParams(window.location.search)
        const response = await fetch(`/pacientes/${params.get('id')}`)
        const data = await response.json()

        nameinp.value = data.Nome
        phoneinp.value = data.Telefone
        emailinp.value = data.Email
        nascinp.value = data.Data_de_Nascimento
        cpf_cnpjinp.value = data.CPF_CNPJ
        addressinp.value = data.Endereco
        numberinp.value = data.Numero
        cepinp.value = data.CEP
        cidadeinp.value = data.Cidade
        estadoinp.value = data.Estado
        isehcrianca.checked = data.Eh_Crianca
        namepaiinp.value = data.Nome_do_Pai_ou_Responsavel
        phonepaiinp.value = data.Telefone_Pai
        namemaeinp.value = data.Nome_da_Mae_ou_Responsavel
        phonemaeinp.value = data.Telefone_Mae

    })();

// Adicione um evento de clique ao botão

function cadastrar_paciente(event) {
    event.preventDefault();
    const params = new URLSearchParams(window.location.search);
    fetch(`/cadastrar_paciente/${params.get('id')}`, {
        method: "PUT",
        body: JSON.stringify({
            Nome: nameinp.value,
            Telefone: phoneinp.value,
            Email: emailinp.value,
            Data_de_Nascimento: nascinp.value,
            CPF_CNPJ: cpf_cnpjinp.value,
            Endereco: addressinp.value,
            Numero: numberinp.value,
            CEP: cepinp.value,
            Estado: estadoinp.value,
            Cidade: cidadeinp.value,
            Eh_Crianca: isehcrianca.checked,
            Nome_do_Pai_ou_Responsavel: namepaiinp.value,
            Telefone_Pai: phonepaiinp.value,
            Nome_da_Mae_ou_Responsavel: namemaeinp.value,
            Telefone_Mae: phonemaeinp.value,
            Especialista: lista.value,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => {
        if (lista.value === "-") {
            alert("Selecione o Especialista");
            return;
        } else {
            alert("Paciente atualizado com sucesso!");
            window.location.reload();
        }
    }).catch(() => alert("Erro ao atualizar"));
}




document.getElementById('mostrarSubformi').addEventListener('change', function () {
    var subformi = document.getElementById('subformi');
    subformi.style.display = this.checked ? 'block' : 'none';
});




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
    Usuario = data.Usuario;
    const userGreeting = document.getElementById('userGreeting');
    userGreeting.textContent = `Olá, ${Usuario}!`;

    // data = USUARIO DO BANCO LOGADO

    // -----------------------------------

    const response2 = await fetch('/users')
    const consultores = await response2.json()


    if (data.Secretaria) {
        consultores.filter(arq => !arq.Secretaria && arq.Nome !== "ADM").forEach(({ Usuario, Nome }) => {
            list.innerHTML += `<option value="${Usuario}">${Nome}</option>`
        })
    } else {
        [data].forEach(({ Usuario, Nome }) => {
            list.innerHTML += `<option value="${Usuario}">${Nome}</option>`

        })
    }
})().catch(console.error)


const draggable = document.getElementById('draggable-container');
let isDraggable = true;
let mouseDown = false;

draggable.onmousedown = function (event) {
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

    draggable.onmouseup = function () {
        mouseDown = false;
        document.removeEventListener('mousemove', onMouseMove);
    };
};

draggable.ondragstart = function () {
    return false;
};

document.addEventListener('click', function (event) {
    isDraggable = !isDraggable;
    draggable.style.cursor = isDraggable ? 'move' : 'default';
});

//cep

// Função para consultar o CEP e preencher os campos de endereço
async function consultarCEP(cep) {
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;

        // Preencher os campos de endereço com os dados recebidos da API
        document.getElementById('address').value = data.logradouro;
        document.getElementById('cidade').value = data.localidade;
        document.getElementById('estado').value = data.uf;
    } catch (error) {
        console.error('Erro ao consultar CEP:', error);
        alert('CEP não encontrado. Verifique o número e tente novamente.');
    }
}

// Função para capturar o evento de mudança no campo de CEP
document.getElementById('cep').addEventListener('change', function () {
    const cep = this.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cep.length === 8) { // Verifica se o CEP possui 8 dígitos
        consultarCEP(cep);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const numberInput = document.getElementById('number');

    // Seleciona todos os inputs relevantes exceto o campo de número
    const inputs = Array.from(document.querySelectorAll('input.input, input.inputnasc'))
        .filter(input => input.id !== 'number');

    inputs.forEach((input) => {
        input.addEventListener('keydown', (event) => {
            console.log('Tecla pressionada:', event.key); // Log para verificar a tecla pressionada
            if (event.key === 'Enter' || event.keyCode === 13) {
                event.preventDefault(); // Evita o envio do formulário
                console.log('Enter detectado no input:', input.id); // Log para verificar o input atual

                // Foco específico no campo de número
                if (numberInput) {
                    setTimeout(() => {
                        numberInput.focus(); // Move o foco para o campo de número
                        console.log('Foco movido para o campo número:', numberInput.id); // Log para verificar o campo de número
                    }, 10); // Adiciona um pequeno atraso
                }
            }
        });
    });
});
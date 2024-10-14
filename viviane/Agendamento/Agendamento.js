verificaAutenticado()
document.getElementById("btn_voltar_a").addEventListener("click", () => {
    window.location.href = '../Menu/menu.html'
})

const nameinp = document.getElementById("name") //O getElementById tem que ser igual o id
const phoneinp = document.getElementById("phone")
const especialistainp = document.getElementById("especialista")
const data_atendimentoinp = document.getElementById("data_atendimento")
const horario_consultainp = document.getElementById("horario_consulta")
const valor_consultainpinp = document.getElementById("valor_consulta")
const status_pagamentoinp = document.getElementById("status_pagamento")
const observacaoinp = document.getElementById("observacao")

function agendamento(event) {
    event.preventDefault()
    fetch("/agendamento", {
        method: "POST", body: JSON.stringify({

            Nome: nameinp.value, // A escrita antes do : tem que ta igual ao campo que foi criado no prisma
            Telefone: phoneinp.value,
            Especialista: especialistainp.value,
            Data_do_Atendimento: data_atendimentoinp.value,
            Horario_da_consulta: horario_consultainp.value,
            Valor_da_Consulta: valor_consultainpinp.value,
            Status_do_pagamento: status_pagamentoinp.value,
            observacao: observacaoinp.value,

        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => {
        alert("Paciente Agendado com sucesso!")
        window.location.reload()
    }).catch(() => alert("Erro ao Agendar"))
}

document.getElementById("ch-side").addEventListener("change",event=>{
    const mainSide=document.getElementById("main-side")
    if(event.target.checked){
       mainSide.classList.remove("off") 
    }
    else{
       mainSide.classList.add("off") 
    }
  })
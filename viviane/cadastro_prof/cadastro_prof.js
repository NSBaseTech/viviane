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

  document.getElementById("btn_voltar_pr").addEventListener("click", () => {
    window.location.href = '../Menu/menu.html';
});


const nameprofinp = document.getElementById("nameprof")
const faixa_etariainp = document.getElementById("faixa_etaria")
const data_atendinp = document.getElementById("data_atend")
const horario_atendinp = document.getElementById("horario_atend")
const especialidadeinp = document.getElementById("especialidade")
const reg_profissionalinp = document.getElementById("reg_profissional")


const list = document.getElementById("lista")

list.onchange = async function (e) {
   const response = await fetch(`/cadastro_prof/${e.target.value}`)
   const data = await response.json()
   if(data){
    nameprofinp.value = data.Nome
    faixa_etariainp.value  = data.Faixa_Etaria_de_Atendimento
    data_atendinp.value = data.Dias_de_Atendimento
    horario_atendinp.value = data.Horarios_de_Atendimento
    especialidadeinp.value = data.Especialidade
    reg_profissionalinp.value = data.Registro_do_Profissional

   }
   else {
    nameprofinp.value = ''
    faixa_etariainp.value  = ''
    data_atendinp.value = ''
    horario_atendinp.value = ''
    especialidadeinp.value = ''
    reg_profissionalinp.value = ''
   }

   
}


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
          
        })
    }
})().catch(console.error)

async function cadastro_prof(event) {
    event.preventDefault()

   const response = await fetch(`/cadastro_prof/${list.value}`)
   const data = await response.json()

    fetch("/cadastro_prof", {
        method: data===null?"POST":"PUT",
        body: JSON.stringify({

            Nome: nameprofinp.value,
            Faixa_Etaria_de_Atendimento: faixa_etariainp.value,
            Dias_de_Atendimento: data_atendinp.value,
            Horarios_de_Atendimento: horario_atendinp.value,
            Especialidade: especialidadeinp.value,
            Registro_do_Profissional: reg_profissionalinp.value, 
            Especialista: list.value,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => {
        alert("Profissional cadastrado com sucesso!")
        window.location.reload()
    }).catch(() => alert("Erro ao cadastrar"))
}
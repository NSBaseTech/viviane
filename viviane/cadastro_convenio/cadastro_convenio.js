verificaAutenticado()
document.getElementById("btn_voltar_cvn").addEventListener("click", () => {
    window.location.href = '../Menu/menu.html'
})

document.getElementById("ch-side").addEventListener("change",event=>{
    const mainSide=document.getElementById("main-side")
    if(event.target.checked){
       mainSide.classList.remove("off") 
    }
    else{
       mainSide.classList.add("off") 
    }
  })


const name_cvninp = document.getElementById("name_cvn")
const cnpjinp = document.getElementById("cnpj")
const valoresinp = document.getElementById("valores")
const data_contratacaoinp = document.getElementById("data_contratacao")


function cadastro_convenio(event) {
    event.preventDefault()
    fetch("/cadastro_convenio", {
        method: "POST",
        body: JSON.stringify({

            Nome_do_Convenio: name_cvninp.value,
            CNPJ: cnpjinp.value,
            Valores: valoresinp.value,
            Data_de_Contratacao: data_contratacaoinp.value,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => {
        alert("Convênio cadastrado com sucesso!")
        window.location.reload()
    }).catch(() => alert("Erro ao cadastrar"))
}

let Usuario = ''

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

   if (data.Secretaria) {
      const btnFluxo = document.getElementById("btn_fluxo");
      btnFluxo.parentNode.removeChild(btnFluxo);
      const backdrop3 = document.getElementById("backdrop3");
      backdrop3.parentNode.removeChild(backdrop3);
      
   } else {
      // COISAS Q EU QUERO FAZER SE N FOR SECRETARIA
   }

   if (data.Profissional) {
       // COISAS Q EU QUERO FAZER SE FOR PROFISSIONAL
   } else {
      // COISAS Q EU QUERO FAZER SE N FOR PROFISSIONAL
   }
})().catch(console.error)

 function redirecionaCadUser() {
    if (Usuario === 'Adm'){
       location.href = '../cadastro_user/cadastro_user.html'
    } else {
       alert('Entrar em contato com Administrativo')
    }
 }
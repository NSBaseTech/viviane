verificaAutenticado()

document.getElementById("btn_cadastro").addEventListener("click", () => {
   window.location.href = '../Cadastro_pacientes/Cadastro.html'
})
document.getElementById("btn_agendamento").addEventListener("click", () => {
   window.location.href = '../calendario/calendario.html'
})

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

let Usuario = ''

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
      Nome = data.Nome;

      const userGreeting = document.getElementById('userGreeting');
      userGreeting.textContent = `Olá, ${Nome}!`;

      const userGreeting1 = document.getElementById('userGreeting1');
      userGreeting1.textContent = `Bem-vindo(a) ${Nome}!`;

      const thumbnail = document.getElementById('thumbnail');
      thumbnail.src = data.foto
      thumbnail.style.display = 'block';


      if (data.Secretaria) {
         const btnFluxo = document.getElementById("btn_fluxo");
         btnFluxo.parentNode.removeChild(btnFluxo);
         const backdrop3 = document.getElementById("backdrop3");
         backdrop3.parentNode.removeChild(backdrop3);
         const flxlateral = document.getElementById("flxLateral");
         flxlateral.parentNode.removeChild(flxLateral);

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


   if (Nome == 'ADM NSBaseTech') {
      location.href = '../cadastro_user/cadastro_user.html'
   } else {
      alert('Entrar em contato com Administrativo')
   }
}

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
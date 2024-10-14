verificaNaoAutenticado()

 document.getElementById("form-login").addEventListener("submit", (e) => {
  e.preventDefault()
   const usuario = document.getElementById("exampleInputLOGIN").value
   const senha = document.getElementById("exampleInputPassword1").value
    login(usuario, senha)
 })
 

 document.getElementById("forgot-password").addEventListener("click", e => {
   e.preventDefault()

   const usuario = document.getElementById("exampleInputLOGIN").value

   if (usuario === "") {
      alert("preecha seu login")
      return
   }

   fetch('/gerar-recovery', {
      method: "POST",
      body: JSON.stringify({

         usuario
          
      }),
      headers: {
          "Content-Type": "application/json"
      }
  }).finally(() => {
   window.location.href = `/sistema/redefinir_senha/redefinir_senha.html?user=${usuario}`
  })
 }) 
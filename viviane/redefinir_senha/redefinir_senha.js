verificaNaoAutenticado()

document.getElementById("btn_voltar_d").addEventListener("click", () => {
    window.location.href = '../Login/Login.html'
})

const inp_codigo = document.getElementById('codigo')
const inp_senha = document.getElementById('senha')
const inp_c_senha = document.getElementById('c_senha')

function resetar_senha(event) {
    event.preventDefault()


    if (inp_senha.value !== inp_c_senha.value) {
        alert("Senha Incorreta, tente novamente")
        return
    }

    const params = new URLSearchParams(window.location.search)
    const user = params.get("user")

    fetch('/resetar-senha', {
        method: "POST",
        body: JSON.stringify({

            usuario: user,
            codigo: Number(inp_codigo.value),
            senha: inp_senha.value

        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).finally(() => {
        window.location.href = `/sistema/Login/Login.html`
    })
}
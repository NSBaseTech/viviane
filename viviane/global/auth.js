const CHAVE = "token"

function login(usuario, senha) {
    fetch("/login", {
        body: JSON.stringify({
            usuario, senha
        }),
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => {
        alert("Login efetuado com sucesso!")
        localStorage.setItem(CHAVE, data.token)
        window.location.reload()
    }).catch(() => alert("usuario/senha incorreta"))
}
function logout() {
    localStorage.removeItem(CHAVE)
    window.location.reload()
}
function verificaAutenticado() {
    const token = localStorage.getItem(CHAVE)
    if (token === null) {
        window.location.href = "../Login/Login.html"
    }
}
function verificaNaoAutenticado() {
    const token = localStorage.getItem(CHAVE)
    if (token !== null) {
        window.location.href = "../Menu/menu.html"
    }

}


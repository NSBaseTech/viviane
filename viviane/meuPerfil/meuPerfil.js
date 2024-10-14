//verificaAutenticado()

document.getElementById("btn_voltar_mp").addEventListener("click", () => {
    window.location.href = '../Login/Login.html'
})

const nameinp = document.getElementById("name")
const emailinp = document.getElementById("email")
const userinp = document.getElementById("user")


let id = " "
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

        nameinp.value = data.Nome
        emailinp.value = data.Email
        userinp.value = data.Usuario
        id = data.id
        const thumbnail = document.getElementById('thumbnail');
            thumbnail.src = data.foto
            thumbnail.style.display = 'block';

      

    })();


const fotinha = document.getElementById("fotinha")


const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});


    async function cadastro_user(event) {
    event.preventDefault()
    const params = new URLSearchParams(window.location.search)
   
    let foto = null

    if (fotinha.files.length !== 0) {
        const arquivoFoto = fotinha.files[0]
        foto = await toBase64(arquivoFoto)
    }
    console.log (foto)

    fetch(`/cadastrar_user/${id}`, {
        method: "PUT",
        body: JSON.stringify({

            Nome: nameinp.value,
            Email: emailinp.value,
            Usuario: userinp.value,
            foto,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => {
        alert("Perfil Atualizado com sucesso!")
        window.location.reload()
    }).catch(() => alert("Erro ao atualizar"))
}

document.getElementById("ch-side").addEventListener("change", event => {
    const mainSide = document.getElementById("main-side")
    if (event.target.checked) {
        mainSide.classList.remove("off")
    }
    else {
        mainSide.classList.add("off")
    }
})

function displayThumbnail(event) {
    const input = event.target;
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const thumbnail = document.getElementById('thumbnail');
            thumbnail.src = e.target.result;
            thumbnail.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
}



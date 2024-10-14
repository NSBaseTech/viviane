// RYAN  1
let from = ""
let to = ""


let ultimaMensagemid = ''
let carregado = false

function generateContainer(message) {
        var activeProfileName = document.getElementById("chat-name").textContent;
    
        var messageContainer = document.createElement("div");
        if (message.from === from) {
            messageContainer.style="margin-left: auto; background-color: rgb(101, 181, 184);color: #fff;"
        }
        messageContainer.classList.add("message", "sent");
        var messageText = document.createElement("span");
        messageText.textContent = message.content;
        var messageInfo = document.createElement("div");
        messageInfo.classList.add("message-info");
        var moment = new Date(message.createdAt);
        var time = moment.getHours() + ":" + (moment.getMinutes() < 10 ? '0' : '') + moment.getMinutes();
        var timeText = document.createTextNode(time);
        
        var messageStatus = document.createElement("span");
        messageStatus.classList.add("message-status");

        
        if (message.visualizado && message.from === from) {

            messageStatus.innerHTML = '<i class="bi bi-check-all simbolo-visualizado"></i>';
        } else {
            messageStatus.innerHTML = '<i class="bi bi-check-all"></i>';
        }
        
        // var messageDelete = document.createElement("span");
        // messageDelete.classList.add("message-delete");
        // messageDelete.innerHTML = '<i class="bi bi-trash"></i>'; // Ícone de lixeira
        // messageDelete.onclick = function() {
        //     var index = chats[activeProfileName].indexOf(messageContainer);
        //     if (index !== -1) {
        //         chats[activeProfileName].splice(index, 1); // Remover do array de mensagens
        //         messageContainer.remove();
        //     }
        // };
        // var messageEdit = document.createElement("span");
        // messageEdit.classList.add("message-edit");
        // messageEdit.innerHTML = '<i class="bi bi-pencil"></i>'; // Ícone de edição
        // messageEdit.onclick = function() {
        //     var newMessage = prompt("Editar mensagem:", messageText.textContent);
        //     if (newMessage !== null) {
        //         messageText.textContent = newMessage;
        //     }
        // };
        messageContainer.appendChild(messageText);
        messageInfo.appendChild(timeText); // Horário
        // messageInfo.appendChild(document.createTextNode(" · ")); // Dois pontinhos separando
        messageInfo.appendChild(messageStatus);
        // messageInfo.appendChild(messageEdit);
        // messageInfo.appendChild(messageDelete);
        messageContainer.appendChild(messageInfo);
       return messageContainer
}

async function setup() {
    const token = localStorage.getItem(CHAVE)
    const response = await fetch('/verify', {
        body: JSON.stringify({ token }),
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json()
    from = data.id;
    const response2 = await fetch('/users')
    const data2 = await response2.json()
    const element = document.getElementById("profile-list")
    element.innerHTML = ''
    
    data2.filter(arg=>arg.id !== data.id).forEach((arg, index) => {
        element.innerHTML += `
        
        <div class="profile" data-name="${arg.Nome}" data-to="${arg.id}" data-status="online" onclick="openChat(this)">
            <img src="${arg.foto}" alt="${arg.Nome}" class="profile-pic" id="nayara-pic">
            <span class="profile-name">${arg.Nome}</span>
        </div>
        
        `
    })
}


// PARTE DA NOTIFICACAO
setInterval(async () => {
    const response3 = await fetch('/chat/pendentes', {
        body: JSON.stringify({from}),
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const data3 = await response3.json()

    const aa = document.querySelectorAll(".profile")
    const bb = document.querySelector(".open-chat-btn")
    
    if (data3.length > 0 ) {
        bb.classList.add('notificacao')
        
    } else {
        bb.classList.remove('notificacao')
    }

    aa.forEach(arg => {
        arg.classList.remove('notificacao')

        if (data3.includes(arg.getAttribute('data-to'))) {
            arg.classList.add('notificacao')
        }
    })
}, 1000)

setInterval(async () => {
    var chatPopup = document.getElementById("chat-popup");
    if (to === "" || from === "" || (chatPopup.style.display === "none" || chatPopup.style.display === "")) return
    const response = await fetch('/chat', {
        body: JSON.stringify({ to, from, focus: document.hasFocus() }),
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json()
    const messages = data.map(generateContainer)
    // Limpa as mensagens anteriores
    var chatMessages = document.getElementById("chat-messages");
    var isScrolledToBottom = chatMessages.scrollHeight - chatMessages.clientHeight <= chatMessages.scrollTop + 1;
    chatMessages.innerHTML = "";
    // Adiciona as novas mensagens
    messages.forEach(arg => {
        chatMessages.appendChild(arg);
    });
    // Se já estiver no final antes de atualizar, permanece no final
    if (isScrolledToBottom) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    const ultimaMensagem = data[data.length - 1]

    if (carregado && ultimaMensagemid !== ultimaMensagem.id && ultimaMensagem.to === from) {
        sendNotification("Nova mensagem", ultimaMensagem.content)
        console.log("E PRA TER NOTIFICADO")
    } else {
        carregado = true
    }
    
    ultimaMensagemid = ultimaMensagem.id
}, 1000);
setup()

function sendMessage() {
    var messageInput = document.getElementById("message-input");
    var message = messageInput.value.trim();
    if (message !== "") {       
        fetch('/chat/message', {
            method: 'POST',
            body: JSON.stringify({
                content: message,
                from, to
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
         // Limpar o campo de entrada
         messageInput.value = "";
    }
}

document.getElementById("message-input").addEventListener("keypress", function(event) {
    // Verifica se a tecla pressionada é "Enter" (código 13)
    if (event.key === "Enter") {
        sendMessage(); // Chama a função sendMessage() quando "Enter" for pressionado
    }
});


// FIM RYAN 1

function toggleChat() {
    var chatPopup = document.getElementById("chat-popup");
    if (chatPopup.style.display === "none" || chatPopup.style.display === "") {
        chatPopup.style.display = "block";
    } else {
        chatPopup.style.display = "none";
    }

    
    carregado =false
}
function triggerFileInput(event) {
    event.stopPropagation();
    var fileInput = event.target.parentElement.querySelector('.upload-photo-input');
    fileInput.click();
}
function uploadPhoto(event) {
    var input = event.target;
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var img = input.parentElement.querySelector('.profile-pic');
            img.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}
function openChat(profileElement) {
    carregado = false
    var name = profileElement.getAttribute('data-name');
    var status = profileElement.getAttribute('data-status');
    to =  profileElement.getAttribute('data-to');
    document.getElementById("chat-title").style.display = "none";
    document.getElementById("chat-avatar").style.display = "block";
    document.getElementById("chat-avatar").src = profileElement.querySelector('img').src;
    document.getElementById("chat-name").textContent = name;
    //document.getElementById("chat-status").textContent = status === "online" ? "Online" : "Offline";
    document.getElementById("chat-popup").style.display = "block";
    // Limpar mensagens antigas
    var chatMessagesContainer = document.getElementById("chat-messages");
    chatMessagesContainer.innerHTML = '';
}


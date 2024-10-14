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

document.getElementById("btn_voltar_atd").addEventListener("click", () => {
    window.location.href = '../calendario/calendario.html';
});

// Selecionando elementos do DOM
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const stopButton = document.getElementById('stopButton');
const form = document.getElementById('form');
const formTitle = document.getElementById('formTitle');
const formContent = document.getElementById('formContent');
const nomePacienteInput = document.getElementById('nomePaciente');
const fileInput = document.getElementById('fileInput');
const historyList = document.getElementById('historyList');
const limparButton = document.getElementById('limparButton');

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);

const id_agendamento = params.get('id');
const id_paciente = params.get('id_paciente');
const nome_paciente = params.get('nome');
nomePacienteInput.value = nome_paciente;

let timerInterval;
let timerSeconds = 0;
let timerPaused = false;
let atendimentos = [];

let conteudoAtestado = ""
let conteudoComparecimento = ""
let conteudoEncaminhamento = ""
let conteudoProntuario = ""
let conteudoAnamineseI = ""
let conteudoAnamineseA = ""
let conteudoNeuroI = ""
let conteudoNeuroA = ""

// Função para atualizar o tempo do timer
function updateTimer() {
    if (!timerPaused) {
        timerSeconds++;
        const hours = Math.floor(timerSeconds / 3600);
        const minutes = Math.floor((timerSeconds % 3600) / 60);
        const seconds = timerSeconds % 60;
        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Evento de clique no botão de iniciar
startButton.addEventListener('click', () => {
    if (!timerInterval) {
        timerInterval = setInterval(updateTimer, 1000);
    }
});

// Evento de clique no botão de pausar
pauseButton.addEventListener('click', () => {
    timerPaused = !timerPaused;
});

// Evento de clique no botão de finalizar atendimento
stopButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    const nomePaciente = nomePacienteInput.value;
    if (nomePaciente) {
        const now = new Date();
        const dataHora = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        const tempoAtendimento = timerSeconds; // Tempo de atendimento em segundos

        // Criando um objeto para representar o paciente
        const paciente = {
            nome: nomePaciente,
            atendimentos: []
        };

        // Criando um objeto para representar o atendimento
        const atendimento = {
            tipo: formTitle.textContent,
            id_atendimento: "",
            id_agendamento: id_agendamento,
            id_paciente: id_paciente,
            conteudoAtestado,
            conteudoComparecimento,
            conteudoEncaminhamento,
            conteudoProntuario,
            conteudoAnamineseI,
            conteudoAnamineseA,
            conteudoNeuroI,
            conteudoNeuroA,
            dataHora: dataHora,
            tempo: tempoAtendimento,
            paciente: paciente // Referência para o paciente

        };



        fetch("/atendimento", {
            method: "POST",
            body: JSON.stringify({
                id_agendamento: atendimento.id_agendamento,
                id_paciente: atendimento.id_paciente,
                conteudoAtestado: atendimento.conteudoAtestado,
                conteudoComparecimento: atendimento.conteudoComparecimento,
                conteudoEncaminhamento: atendimento.conteudoEncaminhamento,
                conteudoProntuario: atendimento.conteudoProntuario,
                conteudoAnamineseI: atendimento.conteudoAnamineseI,
                conteudoAnamineseA: atendimento.conteudoAnamineseA,
                conteudoNeuroI: atendimento.conteudoNeuroI,
                conteudoNeuroA: atendimento.conteudoNeuroA,
                tempo: atendimento.tempo + "",
                dataHora: atendimento.dataHora
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json()).then(data => {
            atendimento.id_atendimento = data.id;
            alert("Atendimento Registrado com sucesso!")
            window.location.reload()
        }).catch(() => alert("Erro ao registrar atendimento"))

        // Adicionando o atendimento à lista de atendimentos do paciente
        paciente.atendimentos.push(atendimento);



        console.log(atendimento)

        // Adicionando o atendimento à lista geral de atendimentos
        atendimentos.push(atendimento);


    }
    // Limpa campos
    formTitle.textContent = '';
    nomePacienteInput.value = '';
    formContent.value = '';
    fileInput.value = '';
    timerSeconds = 0; // Zera o contador do timer
    updateTimer(); // Atualiza o timer
});



// Função para abrir o formulário correspondente
function openForm(title) {
    formTitle.textContent = title;

    // Define o conteúdo do textarea com base no título do formulário
    if (title === "Atestado") {
        formContent.value = conteudoAtestado;
    } else if (title === "Comparecimento") {
        formContent.value = conteudoComparecimento;
    } else if (title === "Encaminhamento") {
        formContent.value = conteudoEncaminhamento;
    } else if (title === "Prontuário") {
        formContent.value = conteudoProntuario;
    } else if (title === "Anamnese Terapia") {
        formContent.value = conteudoAnamineseI;
    } else if (title === "Anamnese Psicopedagoga") {
        formContent.value = conteudoAnamineseA;
    } else if (title === "Neuropsicológica Infanto-Juvenil") {
        formContent.value = conteudoNeuroI;
    } else if (title === "Neuropsicológica Adulto") {
        formContent.value = conteudoNeuroA;
    }

    selectedFormType = title;
    document.getElementById('formTitle').textContent = title;

    // Adiciona o texto fixo apenas quando o formulário é aberto
    if (fixedTexts[title]) {
        fixedText = fixedTexts[title];
        const nomePaciente = document.getElementById('nomePaciente').value;
        const content = fixedText.replace('${nomePaciente}', nomePaciente);

        // Substitui o conteúdo do textarea com o texto fixo
        if (!formContent.value) {
            formContent.value = content;
        }
    }

}



// function loadFormContentFromDatabase(content) {
//     formContent.value = content;
// }

function openAtendimentoDetails(atendimento) {
    // console.log(atendimento)
    conteudoAnaminese = atendimento.conteudoAnaminese
    conteudoAtestado = atendimento.conteudoAtestado
    conteudoComparecimento = atendimento.conteudoComparecimento
    conteudoEncaminhamento = atendimento.conteudoEncaminhamento
    conteudoProntuario = atendimento.conteudoProntuario
    conteudoAnamineseI = atendimento.conteudoAnamineseI
    conteudoAnamineseA = atendimento.conteudoAnamineseA
    conteudoNeuroI = atendimento.conteudoNeuroI
    conteudoNeuroA = atendimento.conteudoNeuroA

    // nomePacienteInput.value = atendimento.paciente.nome; // Usamos o nome do paciente associado ao atendimento
    nomePacienteInput.value = nome_paciente; // Usamos o nome do paciente associado ao atendimento

    const tempoAtendimento = atendimento.tempo;
    const hours = Math.floor(tempoAtendimento / 3600);
    const minutes = Math.floor((tempoAtendimento % 3600) / 60);
    const seconds = tempoAtendimento % 60;
    timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

}

formContent.addEventListener("change", e => {
    const title = formTitle.textContent;
    const content = e.target.value

    if (title === "Atestado") {
        conteudoAtestado = content;
    }

    if (title === "Comparecimento") {
        conteudoComparecimento = content;
    }
    if (title === "Encaminhamento") {
        conteudoEncaminhamento = content;
    }

    if (title === "Prontuário") {
        conteudoProntuario = content;
    }

    if (title === "Anamnese Terapia") {
        conteudoAnamineseI = content;
    }

    if (title === "Anamnese Psicopedagoga") {
        conteudoAnamineseA = content;
    }

    if (title === "Neuropsicológica Infanto-Juvenil") {
        conteudoNeuroI = content;
    }

    if (title === "Neuropsicológica Adulto") {
        conteudoNeuroA = content;
    }

})




async function getAtendimentos() {
    const response_atendimentos = await fetch(`/atendimento/${id_paciente}`)
    return response_atendimentos;
}

function getAllAtendimentos() {
    getAtendimentos().then(response => response.json()).then(data => {
        for (let index = 0; index < data.paciente.length; index++) {

            const listItemUpdated = document.createElement('li');
            listItemUpdated.textContent = `${data.paciente[index].dataHora} - ${nome_paciente}`;

            // Cria o botão "Visualizar"
            const viewButton = document.createElement('button');
            viewButton.textContent = 'Visualizar';
            viewButton.classList.add('visual-button');
            viewButton.addEventListener('click', () => openAtendimentoDetails(data.paciente[index]));

            // Adiciona o botão ao elemento <li>
            listItemUpdated.appendChild(viewButton);

            // Adiciona o elemento <li> à lista de histórico (historyList)
            historyList.appendChild(listItemUpdated);
        }

    })
}

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

// getAllAtendimentos();


let fixedText = ''; // Variável global para armazenar o texto fixo
let selectedFormType = '';

function toDataURL(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            var reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(xhr.response);
        } else {
            console.error("Failed to load image: " + url);
        }
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}



const fixedTexts = {
    "Atestado": `

    Atesto, para os devidos fins que ${nome_paciente} 
    
    RG.: (                          )
    
    realizou acompanhamento psicológico sob meus cuidados desde a data: (            ).



        Paulínia, (       ) de (       ) de (      )
        
        Atenciosamente,



        __________________________________
        Assinatura da psicóloga responsável

    `,
    "Comparecimento": `
        compareceu para:

        (  ) atendimento em Psicoterapia

        (  ) atendimento em Psicopedagogia

        (  ) sessão de orientação em Avaliação Neuropsicológica

        (  ) sessão em Avaliação Neuropsicológica

        (  ) sessão de Devolutiva de Avaliação Neuropsicológica

        (  ) acompanha o menor (                 )

        Nesta data, no período das (      ) às (      ) horas.

        Paulínia, (       ) de (       ) de (      )

        Atenciosamente,



        __________________________________
        Assinatura da psicóloga responsável

    `,

    "Encaminhamento": `

    Encaminho o(a) paciente ${nome_paciente} que se encontra em processo de Avaliação Neuropsicológica para (                ), devido a (                      ).  
    A disposição para maiores esclarecimentos.

     Paulínia, (       ) de (       ) de (      )

        Atenciosamente,



        __________________________________
        Assinatura da psicóloga responsável

    `,
    "Prontuário": ` Texto fixo para Prontuário com paciente ${nome_paciente}...`,


    "Anamnese Terapia": ` 
    Data  da entrevista : ____/____/_____

I - IDENTIFICAÇÃO
Nome da criança: ${nome_paciente}
Data de Nascimento: (      ) Local: (      )
CPF: (      )

Nome do pai: (      )Idade: (      )
CPF: (      )
Escolaridade: (      ) Profissão: (      )

Nome da mãe:(      ) Idade: (      )
CPF:(      )
Escolaridade: (      ) Profissão:(      )

Endereço: (      )
Telefones:(      )
Estado Civil dos pais:  (      )

Nº de irmãos / Sexo / Idades: (      )
 Filho: (    ) Biológico   (    ) Adotivo  
 (Se Adotivo) A criança é ciente de sua adoção? : (    )Sim      (    ) Não 

II -  Histórico: 
1) Concepção? (desejado, sentimento dos pais quando souberam , tempo de casado, antes de casa) (      )
2)Qual expectativa quanto ao sexo do bebê? (esperava menino ou menina? (      )
3) Ocorreu hemorragias, acidentes agressões, brigas ou discussões na fase pré-natal?(      )
4)A mãe ingeriu drogas durante a gestação? (cigarro, álcool, cocaína, psicotrópicos)(      )
5) Gestação: (    )Completa     (    )Prematura      Parto: (   )Normal     (    )Cesariana     (    )Induzido  
6) Saúde da mãe durante a gravidez:   
7 )Amamentação: (    )Materna      (    )Artificial  

III ) Desenvolvimento Infantil
1)	Apresentou atraso ou problema na fala? (    )N    (    )S  
2)	Dificuldades ou atraso no controle do esfíncter? (    )N    (    )S
3)	Tem enurese noturna e/ou diurna? (    )N    (    )S
4)	Seu desenvolvimento motor foi no tempo esperado? (    )N    (    )S    
5)	Perturbações (pesadelos, sonambulismo, agitação, etc.):  (    )N     (    )S     
6)	Possui hábitos especiais (requer a presença de alguém, medos, etc.): (    )N     (    )S  
7)	 Troca letras, fonemas? (    )N      (    )S     Quais? (      )
8)	Acidentes, operações, traumas etc.)  (      ) 

IV) Estado Atual da Criança: 
1) Apresenta alguma dificuldade?(      )
2)Quando sentou sem apoio? andou?(      )		falou?(      ) - Já gaguejou ou está gago?(      )
4) - É dependente nas atividades de vida diária?  
5) Desfralde? (      )
6)É destro ou canhoto? (      )

VI) Saúde: 
Apresenta algum problema de saúde atualmente? 	(      )			
 Toma alguma medicamento? (      )

V)  Escolaridade: 
1) Escola: (      )
2) Série:(      )
3) Já repetiu alguma série? (    )N     (    )S   
 
VI)  Sociabilidade:
1) Faz amigos com facilidade? (      )    Adapta-se facilmente ao meio? (      )
2)Distrações preferidas:  (      )
3) Como lida com as emoções? (      )
4) Sono:   (    ) Dorme sozinho  (    ) Dorme no quarto dos Pais 
5) Faz acompanhamento médico (    ) Psicológico    (    ) Outro 

Outras informações:



`,
    "Anamnese Psicopedagoga": `
    
Paciente: ${nome_paciente}     D.N: (      )

RG: (      ) CPF: (      )

Telefones: (      )  

Endereço: (      )

Escolaridade:(      )  Profissão:(      )

Queixas:





      `,
    "Neuropsicológica Infanto-Juvenil": `

1)	INFORMAÇÕES DE DADOS PESSOAIS
Paciente: ${nome_paciente}

Idade:(    )    	      Data de Nascimento: (    )  Sexo: (   )F   (   )M 

Naturalidade: (    ) Nacionalidade: (    )

Lateralidade:    destro (    )	    canhoto (    )	ambidestro (    )

Responsável 1 (sem abreviação): (    )

Idade: (    ) Profissão: (    )  

CPF: (            ) E-mail: (                   ) 

Responsável  2 (sem abreviação): (    )

Idade: (    ) Profissão: (    )

CPF: (            ) E-mail: (                   ) 

Irmãos (nome e idade): 
                               

2) QUEIXA OU MOTIVO DA AVALIAÇÃO

Queixa e motivo principal: 






Há quanto tempo ocorre?
(                       )

Outras queixas e motivos:







Há quanto tempo ocorre?
(                       )

Atitudes frente às queixas:

Do responsável 1: 


Do responsável 2:



3)   GESTAÇÃO E CONCEPÇÃO 

Antecedentes pessoais

A gestação foi planejada?  (   )Sim   (   )Não

Posição na ordem das gestações: (                                        )

Posição na ordem dos nascimentos: (                                        )

Gestação

Fez acompanhamento pré-natal? (   )Sim   (   )Não

Tomou ácido fólico durante a gestação? (   )Sim   (   )Não

Alterações nos exames durante a gestação: (                                        )

Esteve exposta à exames de rádioimagens? (   )Sim    (   )Não

Motivo: (                                        )

Alguma intercorrência durante a gestação? (   )Sim    (   )Não

Descreva a intercorrência: 




Doenças durante a gestação? 




Uso de medicamentos durante a gestação? Quais? 




Fumou, ingeriu álcool ou drogas durante a gestação? 
(  )Sim    (  ) Não 

Observações: (                                        )

Condições de Nascimento

Local de Nascimento:(                                        )

Com quantas semanas seu(sua) filho(a) nasceu? (                                )

Nota APGAR:(                                        )

Como foi o parto:  (  )Normal 	 (  )Cesariana   (  )Fórceps

Nasceu com o cordão umbilical enrolado no pescoço? 
(  )Sim   (  )Não          

Chorou ao nascer? (  )Sim   (  )Não

4 ) ALIMENTAÇÃO

Mamou no peito? (   )Sim    (   )Não   Até que idade?(             )

Como foi a passagem do peito para a mamadeira?(                          )

Como foi a passagem do peito/mamadeira para a papinha?(                      )

Que idade tinha quando iniciou com papinha?(                      )

Aceitou bem a passagem para alimentos sólidos? (   )Sim  (  )Não

Alguma vez rejeitou alimentos? (   )Sim  (  )Não 

Mastiga bem?  (   )Sim   (   )Não

Hoje tem hora para comer? (   )Sim  (  )Não 		

Come depressa?  (    )Sim   (   )Não

Come com independência? (   )Sim   (   )Não   

Desde que idade?(                                        ) 

Faz uso de talher? (   )Sim   (   )Não     Qual?(                            )   

Derrama alimentos ou suco enquanto se alimenta? (   )Sim   (   )Não    

São necessários recursos para manter seu filho sentado a mesa? (   )Sim    (  )Não 

Quais?(                                        )

Seu filho possuí alguma restrição alimentar? (  )Sim  (  )Não  

Quais? (                                        )

Como é a alimentação da criança? (Conte o que ela come; se precisa descascar o alimento ou não; 
quais suas preferências; come em qual posição etc.)




5) DESENVOLVIMENTO 

Sono

Dorme bem? (   )Sim  (   )Não     Observações: (               )

Dorme só ou acompanhado?(                                        )

Com quantas pessoas? (                                        )

Tem cama individual? (  )Sim  (  )Não 

Costuma acordar durante a noite? (   )Sim  (  )Não 

Tem medo de dormir sozinho? (   )Sim (   )Não 		

Tem sono agitado? (  )Sim  (  )Não

Chora à noite? (  )Sim  (  )Não	

Fala dormindo? (  )Sim  (  )Não

Range os dentes? (  )Sim  (  )Não 		              

Se movimenta muito durante o sono? (  )Sim  (  )Não

Ronca durante o sono? (  )Sim  (  )Não 			

É sonâmbulo? (  )Sim  (  )Não

Baba durante a noite? (  )Sim  (  )Não 			

Apresenta sudorese? (  )Sim  (  )Não

Condições para adormecer:



Deita-se em qual horário? (             )
Acorda em qual horário? (               )


Psicomotor
(Citar a idade em meses em que ocorreu cada fase)

Sorriu:(                                        )

Fixou a cabeça: (                                        )

Engatinhou: (                                        )

Sentou-se sozinho: (                                        )

Ficou de pé: (                                        )

Andou: (                                        )

Caia muito? (  )Sim  (  )Não

Qual parte do corpo batia? (                                        )


Linguagem
(Citar a idade em meses em que ocorreu cada fase)

Falou as primeiras palavras: (         )

Falou corretamente: (    ) 

Trocou letras?  (  )Sim  (  )Não 

Falou errado?  (   Sim  (  )Não     

Apresentou gagueira? (  )Sim  (  )Não     			

Fala frases completas? (  )Sim    (  )Não  

Você entende o que ele(a) conta ?  (  )Sim   (  )Não 	

Consegue manter um diálogo? (  )Sim  (  )Não

Possui questionamentos ou preocupações excessivas? (  )Sim  (  )Não   

Quais?(                                        )

Emite gritos ou barulhos diferentes semelhantes à fala? (  )Sim  (  )Não  

Apresenta ecolalia (repetição em eco de fala, frases ou ruídos)? (  )Sim (  )Não


Manipulações e Hábitos

Usou ou usa chupeta? (  )Sim   (  )Não     Durante quanto tempo? (               )

Chupou ou chupa o dedo? (  )Sim   (  )Não     Durante quanto tempo? (             )

Roeu ou rói as unhas? (  )Sim   (  )Não     Durante quanto tempo? (              )

Arranca ou já arrancou os cabelos? (  )Sim   (  )Não     Há tempo? (                )

Morde os lábios? (  )Sim   (  )Não     Há tempo? (                )

Teve ou tem tiques? (  )Sim  (  )Não  Quais?(                             )

Bate  a cabeça? (   )Sim  (   )Não 

Bate os pés? (   )Sim  (   )Não

Observações: (               )


6) CONTROLE DE ESFÍNCTERES

Com qual  idade parou de usar fraldas?(                            )

Controla fezes diurna? (  )Sim  (  )Não  

Controla fezes noturna?  (  )Sim  (  )Não   

Controla urina diurna? (  )Sim  (  )Não  

Controla urina noturna? (  )Sim  (  )Não  

Limpa-se sozinho? (  )Sim  (  )Não    

Tem independência para ir ao banheiro sozinho? (  )Sim  (  )Não 

Toma banho sozinho? (   )Sim  (  )Não    

Veste-se e despe-se sozinho? (  )Sim  (  )Não
                             
Observações: 




7)SOCIABILIDADE

Tem amigos? (   )Sim   (   )Não 

Faz amigos facilmente? (   )Sim  (   )Não

Prefere brincar sozinho(a) ou com amigos? 

Brinca de forma cooperativa? (   )Sim  (   )Não 

Se desinteressa logo dos brinquedos? (   )Sim  (   )Não

Onde gosta de brincar?(                                        )

Apresenta timidez adequada para sua idade? (   )Sim  (   )Não

Como são seus relacionamentos? (                                        )

Que tipos de brinquedos prefere? (                                        )

É excessivamente cuidadoso(a) com seus brinquedos? (   )Sim  (   )Não

Brinca e se relaciona com pessoas (   ) De sua idade  (   ) Mais velhas  (   ) Mais novas

Demonstra liderança nas brincadeiras e jogos? (   )Sim  (   )Não

Leva consigo algum brinquedo ou objeto específico? (   )Sim  (   )Não    Quais?  (                                        )

8) RELACIONAMENTO FAMILIAR

Responsável 1 e filho(a):(                                        )

Responsável 2 e filho(a): (                                        )

Criança/Adolescente com os irmãos: (                                        )

Conduta dos responsáveis diante das dificuldades da criança/adolescente?




9) SEXUALIDADE

Já demonstrou algum tipo de curiosidade sexual? (   )Sim  (   )Não

Qual atitude dos responsáveis? (                                        )

Já teve algum comportamento relacionado à atividade sexual? (   )Sim  (   )Não  

Qual idade?(                                        )

Qual foi a conduta dos responsáveis?


Foi feita educação sexual?


10) COMPORTAMENTO

Apresenta mudanças na expressão facial e no comportamento diante de uma situação frustrante?
(   )Sim  (   )Não  Qual? (                                                                )

Move-se com a mesma coordenação motora de uma criança/adolescente da mesma idade? (   )Sim  (   )Não 
Observações: (                          )

Pratica esporte? (   )Sim  (   )Não  Qual e quantas vezes por semana? (                          )


Aceita mudanças na rotina ? (   )Sim  (   )Não 
Observações: (                          )

Possui contato visual com as pessoas? (   )Sim  (   )Não   
Observações: (                          )

Possui resposta auditiva adequada para a idade? (   )Sim  (   )Não   
Observações: (                          )

A criança apresenta medo e nervosismo adequado para a situação e a idade? (   )Sim  (   )Não
Observações:(                          )

Qual o nível de atividade da criança?

(   ) Normal, nem mais e nem menos ativa que uma criança/adolescente da mesma idade semelhante.

(   ) Preguiçosa.

(   ) É bastante ativa.

(   ) Exibe extremos de atividade e de inatividade.

Expressa dores ou desconforto? (   )Sim  (   )Não   Quais?(                          )

Possui algum comportamento estereotipado (ações ou movimentos repetitivos de partes do corpo) 
(   )Sim  (   )Não   Quais?(                          )

Agride-se de alguma forma? (   )Sim  (   )Não   Descreva como: (                          )

Como reage a ordens?(                          )

É agressivo? (   )Sim  (   )Não  Descreva a agressividade que apresenta:(                 )

É teimoso? (   )Sim  (   )Não 	     

É carinhoso? (   )Sim  (   )Não 		

É autoritário? (   )Sim  (   )Não

É dependente? (   )Sim  (   )Não  Em quais situações?(                          )

11) SAÚDE

Toma as vacinas regularmente? (   )Sim (   )Não   Se “Não”, qual o motivo? (               )

Doenças até o momento:(                          )

Convulsões:(                          )

Desmaios:(                          )

Já ficou roxo alguma vez:(                          )

Já sofreu algum traumatismo? (                          )

Tratamentos neurológicos? Quais? (                          )

Tratamentos psiquiátricos?  (   )Sim (   )Não   Qual o motivo? (                          )


Toma algum medicamento? (   )Sim (   )Não  ((citar nome do medicamento,  dosagem e tempo de uso)




Já houveram internações ? (   )Sim (   )Não   Motivo?(                          )


Cirurgias ? (   )Sim (   )Não   Motivo?(                          )

Tratamentos realizados (fonoaudiológico, psicológico, pedagógico etc.) (   )Sim (   )Não 
Qual? 



Problemas de visão? (   )Sim  (   )Não Qual? (                          ) 

Problemas de audição? (   )Sim  (   )Não   Qual?(                          )

Teve infecções de ouvido recorrentes? (   )Sim  (   )Não

12) ANTECEDENTES FAMILIARES (Citar grau de parentesco)

Alguém ansioso na família? (                          )

Alguém com diagnóstico?(                          )

Quem?(                                            )

Deficiência Mental? (                          )

Alcoolismo/Drogas?(                          )

Epilepsia?(                          )

Alguém com dificuldade de aprendizagem ou desatenção? (                          )


13) ESCOLARIDADE

Nome da escola: (                          ) Telefone:(                          )

Série:(                          )Período: (                          )

Já ofereceu resistência para ficar na escola? (   )Sim  (   )Não

Gosta da escola? (   )Sim (   )Não 		

Gosta de estudar? (   )Sim (   )Não

Gosta da professora? (   )Sim (   )Não		 

Gosta de seus colegas? (   )Sim (   )Não

Qual seu rendimento escolar?(                          )

Faz as tarefas de casas? (   )Sim  (   )Não    Observações: (                          )

Tem dificuldades?  (   )Matemática	    (   )Escrita	    (   )Leitura 	   
(   )Em alguma matéria específica

Comportamento em sala de aula:(                          )

Mudou de escola?(   )Sim  (   )Não	Quantas vezes? (                          )

Já foi reprovado alguma vez?(   )Sim  (   )Não	

Qual ano escolar cursava? (                          )

Observações que julgar necessárias:




14) EXAMES E AVALIAÇÕES JÁ REALIZADAS
(Detalhe abaixo os exames e avaliações que seu filho(a) já realizou ou irá realizar, resumindo os resultados).




15) ROTINA
(Descreva abaixo o dia da(o) criança/adolescente).




Agradecemos o tempo dedicado!

     
    `,
    "Neuropsicológica Adulto": `     
Data  da entrevista : (      )

I - IDENTIFICAÇÃO

Nome: ${nome_paciente}

CPF: (              )

Endereço: (              ) CEP: (          )

E-mail:(              )

Idade: (      ) Data de Nascimento: (      )  Sexo: ( ) F ( ) M  

Naturalidade: (           ) Nacionalidade: (             )

Lateralidade: destro ( )   canhoto ( ) ambidestro ( )


Escolaridade: (              )

Total de anos cursados até o momento: (           )

Houve reprovações? (  )Sim  (  ) Não

Como considera seu rendimento acadêmico: (   )Ótimo        (   )Bom        (   )Regular        (   )Ruim

Situação conjugal: (   )solteiro(a)     (   )casado(a)/amasiado(a)     (   )separado(a)/divorciado(a)      (   )viúvo(a)

Nome do(a) companheiro(a): (                               )

Idade: (      ) Escolaridade: (          )

Ocupação Profissional Atual: (              )

Data de início na empresa atual: (            )

Descreva quais funções desempenha atualmente na empresa:






Ocupação profissional anterior: (                       )

Data de início: (       )	Data de desligamento:(         )

Descreva quais funções desempenhava na empresa:





Solicitante da Avaliação Neuropsicológica: (                 )

Hipótese diagnóstica do solicitante: (            )

Breve descrição das queixas e dificuldades: 








Início das queixas e dificuldades: (           )


Fisicos:
---------------------------------------------------------------------------------------------------
(  ) Dor de cabeça  |  (  ) Náusea e/ ou vômito |  
   
(   ) Fadiga excessiva | (   )escurecimento da vista

(   ) Desmaios  | (  ) Incontinência urinária ou urgência
    
(  )Problemas gastro-intestinais | (   )tremores e amortecimento	

(  ) Tiques e movimentos estranhos | (  ) Trombar em coisas/ objetos


Sensoriais:
---------------------------------------------------------------------------------------------------

(  ) Perda de sensibilidade | ( ) perda auditiva

(  ) Breves períodos de cegueira |  (  ) Uso aparelho auditivo

(  ) Sensibilidade a luz e brilho | (  ) Ouve barulhos estranhos

(  ) Ver coisas que não estão presentes | (  ) Chiado/ ruído no ouvido

(  ) Prejuízo visual | (  ) Problemas olfativos

(  ) uso de lentes de contato/óculos | (  ) Problemas gustativos

(  ) Visão turva | (  ) Dor no corpo

---------------------------------------------------------------------------------------------------

4)	INTELECTUAIS
Resolução de problemas
(   )dificuldade em realizar coisas novas			(   )dificuldade para fazer coisas na ordem certa
(   )dificuldade para resolver coisas domésticas  		(   )dificuldade em ter ações de modo rápido 
que a maioria das pessoas conseguiriam fazer		(   )dificuldade de planejamento prévio
(   )dificuldade para completar uma tarefa em 		(   )dificuldade de mudar de plano e adaptar-se
tempo considerado razoável				(   )desorganização maior que o usual     


Linguagem e habilidades matemáticas
(   )dificuldade para achar a palavra correta		(   )dificuldade para entender o que lê
(   )discurso incoerente			  		(   )dificuldade em escrever redações ou cartas (não    (   )dificuldade em entender o que os outro dizem            por  problemas motores)
(   )dificuldade para expressar o pensamento		(   )dificuldade em fazer cálculo (contas e trocos)

Habilidade não verbais
(   )dificuldade em distinguir direita e esquerda		(   )dificuldade em se vestir/despir-se
(   )dificuldade de fazer coisas que deveria ser capaz        (   )dificuldade para reconhecer pessoas e objetos
de fazer automaticamente (ex. escovar os dentes)           (   )perda de noção de tempo (dia, mês e ano)
(   )problemas para encontrar o caminho de casa ou
lugares conhecidos             

Consciência e Construção
(   )alta distração					(   )torna-se confuso facilmente e desorientado
(   )perde a linha de raciocínio facilmente  		(   )não se sente alerta e atento às coisas 
(   )dificuldade em fazer mais de uma coisa ao mesmo     (   )execução de tarefas requer mais esforço e 
tempo 							atenção que o usual

Memória
(   )esquece onde deixa seus pertences 			(   )esquece eventos recentes (o que fez ontem)
(   )esquece nome de pessoas conhecidas  		(   )esquece compromissos 
(   )esquece o que estava fazendo			(   )esquece eventos passados/antigos	
(   )esquece o que ia fazer ou para onde ia 		(   )depende que os outros o lembrem das coisas
(   )esquece a ordem dos acontecimentos		     

Humor, Comportamento e Personalidade
(   )tristeza e depressão			(   )leve 			(   )moderada		    (   )grave
(   )ansiedade e nervosismo  		(   )leve 			(   )moderada		    (   )grave
(   )estresse				(   )leve 			(   )moderada		    (   )grave	   
(   )falta de interesse em atividades prazerosas			(   )aumento da irritabilidade
(   )problemas para dormir (insônia, permanência)		(   )aumento da agressividade 
(   )pesadelos diários ou semanais				(   )irrita-se facilmente
(   )mais emotivo, chora facilmente	 			(   )euforia
(   )não se importa mais com as coisas como antes		(   )frustra-se facilmente
(   )menos inibição (faz coisas que antes não fazia)	(   )faz as coisas automaticamente (sem consciência)
(   )dificuldade em ser espontâneo				
(   )mudança de energia e disposição			(   )perda 			(   )aumento	
(   )mudança de apetite					(   )perda 			(   )aumento	
(   )mudança de interesse sexual				(   )perda 			(   )aumento

As pessoas de seu convívio, têm comentado sobre sua mudança de pensamento, comportamento, personalidade ou humor? Se SIM, como e o que dizem? 






Tem algo que você faz para diminuir suas dificuldades, deixando-as menos intensas, menos frequentes ou menores e que perceba que lhe ajuda? 







Tem algo que você perceba que faça com que sua dificuldade se acentue e seja mais difícil de lidar com ela? 








---------------------------------------------------------------------------------------------------

5)	HISTÓRICO MÉDICO PRÉVIO (se positivo, datar e descrever brevemente nas linhas abaixo)
(   )trauma craniano (TCE)		(   )alteração no colesterol		(   )diabetes
(   )outros traumas			(   )problemas cardíacos			(   )problemas de tireoide 
(   )acidentes ou quedas			(   )alteração na pressão			(   )cirurgias
(   )crise convulsiva			(   )internações				(   )derrames (AVC)	
(   )problemas psiquiátricos		(   )HIV, sífilis, meningite			(   )Outros: 
   



Medicação (citar quais, dosagem e tempo de uso)




Já fez outros tratamentos médicos? Quais? Por quê?




Já fez outros acompanhamentos (psicológico, fonoaudiológico, terapia ocupacional, fisioterapia)? Quais? Por quê? Por quanto tempo? Houve melhora?








Exames, testes e avaliações recentes
(   )tomografia				(   )ressonância magnética		(   )eletroencefalograma
(   )avaliação neuropsicológica		(   )avaliação fonoaudiológica		(   )eletrocardiograma 

6) HISTÓRICO DE USO DE SUBSTÂNCIA
(   )álcool		(   )uso atual	(   )uso prévio	(   )doses/semana: (                                              )
(   )tabagismo		(   )uso atual	(   )uso prévio	(   )doses/semana: (                                              )
(   )outras drogas	(   )uso atual	(   )uso prévio	(   )doses/semana:(                                              )

7) HISTÓRICO FAMILIAR (Se SIM, citar o grau de parentesco)
Diagnóstico de Ansiedade?(                                              )
Diagnóstico de Depressão? (                                              )
Diagnóstico de Síndrome ou Transtorno?(                                              )
Deficiência Mental? (                                              )
Alcoolismo/Drogas?(                                              )
Epilepsia?(                                              )
Alguém com dificuldade de aprendizagem ou desatenção?





8) LAZER E HÁBITOS SUSTENTADOS
Sono
Dorme bem? (   )Sim  (   )Não     Observações ou condições para adormecer:








Dorme só ou acompanhado?(                                              ) Com quantas pessoas? (                                      )
Tem cama individual? (  )Sim  (  )Não                        
Costuma acordar durante a noite? (   )Sim  (  )Não 
Tem medo de dormir sozinho(a)? (   )Sim (   )Não 


Dificuldade em iniciar o sono? (   )Sim (   )Não 
Tem sono agitado? (  )Sim  (  )Não
Range os dentes? (  )Sim  (  )Não
Movimenta-se muito durante o sono? (  )Sim  (  )Não

Acorda mais cedo e não volta a dormir? (  )Sim  (  )Não
Acorda várias vezes durante a noite? (  )Sim  (  )Não
Ronca durante o sono? (  )Sim  (  )Não
É sonâmbulo? (  )Sim  (  )Não

Apetite
Alguma alteração no apetite? (  )Sim  (  )Não
Alguma seletividade alimentar? (  )Sim  (  )Não
Observações: 




Leitura
O que lê? (                                              )
Quando lê? (                                              )

Atividade física

Qual? (                                              )
Com qual frequência? (                                              )
Desde quando?(                                              )

Atividades sociais 
De quais eventos sociais participa? (                                              )

Com qual frequência? (                                              )

O que costuma fazer em grupo?




Como se sente nas ocasiões sociais? 







Recebe ou faz visitas à amigos e familiares? (  )Sim  (  )Não 
Com qual frequência e como se sente nessas visitas? _








9) ROTINA E INFORMAÇÕES ADICIONAIS.
(Descreva abaixo seu dia a dia e outras informações que julgue serem importantes):








Agradecemos o tempo dedicado!

    
 `
};



function selectForm(formType) {
    selectedFormType = formType;
    fixedText = fixedTexts[formType] || '';

}

function generatePDF() {
    const title = document.getElementById('formTitle').textContent;
    const nomePaciente = document.getElementById('nomePaciente').value.trim() || 'documento';
    const fileName = `${title}_${nomePaciente}.pdf`;

    if (title) {
        toDataURL('/sistema/Logo/logo_lufcam.png', function (headerImage) {
            toDataURL('/sistema/Logo/logo_lufcam.png', function (footerImage) {
                const docDefinition = {
                    header: {
                        image: headerImage,
                        width: 90,
                        height: 90,
                        margin: [10, 0, 0, 0] // Ajusta o espaço acima do cabeçalho
                    },
                    footer: function (currentPage, pageCount) {
                        return {
                            columns: [

                                {
                                    text: [
                                        { text: "LUFCAM – CLÍNICA DE SAÚDE E BEM-ESTAR\n", fontSize: 8 },
                                        { text: "Av. Presidente Getúlio Vargas, nº 497 – Nova Paulínia - Paulínia/SP\n", fontSize: 8 },
                                        { text: "Instagram: @clinicalufcam E-mail: clinicalufcam@gmail.com Contato: +55 19 99910.0383", color: 'blue', decoration: 'underline', fontSize: 8 }
                                    ],
                                    alignment: 'center',
                                    margin: [0, 10, 0, 0] // Ajusta o espaço acima do rodapé
                                }
                            ],
                            margin: [0, 0, 0, 20] // Ajusta o espaço abaixo do rodapé
                        };
                    },
                    content: [],
                    pageMargins: [20, 60, 40, 60]
                };

                const formContentText = document.getElementById('formContent').value;

                if (title === 'Atestado') {
                    docDefinition.content = [
                        { text: "ATESTADO\n\n", alignment: 'center', fontSize: 16, bold: true, margin: [65, 50, 0, 20] },
                        { text: formContentText, margin: [85, 0, 0, 20] }
                    ];
                } else if (title === 'Comparecimento') {
                    docDefinition.content = [
                        { text: "DECLARAÇÃO DE COMPARECIMENTO\n\n", alignment: 'center', fontSize: 16, bold: true, margin: [85, 50, 0, 20] },
                        { text: `Declaro, para os devidos fins, que `, margin: [85, 0, 0, 20] },
                        { text: nomePaciente, bold: true, decoration: 'underline', margin: [85, 0, 0, 20] },
                        { text: formContentText, margin: [85, 0, 0, 20] }
                    ];
                } else if (title === 'Encaminhamento') {
                    docDefinition.content = [
                        { text: "ENCAMINHAMENTO\n\n", alignment: 'center', fontSize: 16, bold: true, margin: [85, 50, 0, 20] },
                        { text: formContentText, margin: [85, 0, 0, 20] }
                    ];
                } else if (title === 'Prontuário') {
                    docDefinition.content = [
                        { text: "Prontuário\n\n", alignment: 'center', fontSize: 16, bold: true, margin: [85, 50, 0, 20] },
                        { text: formContentText, margin: [85, 0, 0, 20] }
                    ];
                } else if (title === 'Anamnese Terapia') {
                    docDefinition.content = [
                        { text: "ANAMNESE INFANTIL\n", alignment: 'center', fontSize: 16, bold: true, margin: [85, 50, 0, 20] },
                        { text: "ENTREVISTA COM PAIS E/OU RESPONSÁVEIS\n\n", alignment: 'center', fontSize: 16, bold: true, margin: [85, 50, 0, 20] },
                        { text: `Conteúdo adicional para Anamnese: `, margin: [85, 0, 0, 20] },
                        { text: formContentText, margin: [85, 0, 0, 20] }
                    ];
                } else if (title === 'Anamnese Psicopedagoga') {
                    docDefinition.content = [
                        { text: "Anamnese  Psicoterapia - Adulto\n\n", alignment: 'center', fontSize: 16, bold: true, margin: [85, 50, 0, 20] },
                        { text: formContentText, margin: [85, 0, 0, 20] }
                    ];
                } else if (title === 'Neuropsicológica Infanto-Juvenil') {
                    docDefinition.content = [

                        { text: "Anamnese\n\n", alignment: 'center', fontSize: 16, bold: true, margin: [85, 50, 0, 20] },
                        { text: `Conteúdo adicional para Avaliação Neuropsicológica: `, margin: [85, 0, 0, 20] },
                        { text: formContentText, margin: [85, 0, 0, 20] }
                    ];
                } else if (title === 'Neuropsicológica Adulto') {

                    docDefinition.content = [
                        { text: "AVALIAÇÃO PSICOLÓGICA COM ENFOQUE NEUROPSICOLÓGICO\n\n", alignment: 'center', fontSize: 16, bold: true, margin: [85, 50, 0, 20] },
                        { text: formContentText, margin: [90, 0, 10, 0] },

                    ];
                }

                pdfMake.createPdf(docDefinition).download(fileName);
            });
        });
    } else {
        alert('O formulário não está selecionado corretamente.');
    }
}






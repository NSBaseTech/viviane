require('express-async-errors')

const SECRET = "Nayara bobona askdp[ asopdj opsad psapod iopasidp[ oas[pd kap"

const prisma = require("./prima")

const express = require("express")
const jsonwebtoken = require("jsonwebtoken")
const porta = 3001
const app = express()

const { fazedor_de_senha } = require("./hash")
const { enviarEmail } = require("./email")

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));


app.use("/viviane", express.static("viviane"))
app.use(express.json())

// Rota raiz redirecionando para a página de login
app.get('/', (req, res) => {
    res.redirect('/viviane/Login/Login.html');
});

app.get("/oi", (req, res) => {
    res.send(``)
})

app.post("/login", async (req, res) => {
    const user = await prisma.cadastro_user.findUniqueOrThrow({
        where: {
            Usuario: req.body.usuario
        }
    })
    if (user.Senha !== fazedor_de_senha(req.body.senha)) {
        throw new Error("Senha/Usuário incorreto")
    }

    const token = jsonwebtoken.sign({
        usuario: req.body.usuario
    }, SECRET)
    res.json({
        token
    })
})

app.post("/verify", async (req, res) => {
    const { usuario } = jsonwebtoken.verify(req.body.token, SECRET)
    const user = await prisma.cadastro_user.findUniqueOrThrow({
        where: {
            Usuario: usuario
        }
    })
    res.json(user)
})

app.post("/cadastrar_paciente", async (req, res) => {
    await prisma.cadastro_pacientes.create({
        data: req.body
    })

    res.status(201).json({
        message: "ok"
    })
})

app.put("/cadastrar_paciente/:id", async (req, res) => {
    await prisma.cadastro_pacientes.update({
        data: req.body,
        where: {
            id: req.params.id
        }
    })

    res.status(201).json({
        message: "ok"
    })
})

app.post("/agendamento", async (req, res) => {
    await prisma.agendamento.create({
        data: req.body
    })

    res.status(201).json({
        message: "ok"
    })

})

app.put("/agendamento", async (req, res) => {
    await prisma.agendamento.update({
        data: req.body,
        where: { id: req.body.id }
    })

    res.status(200).json({
        message: "ok"
    })

})

app.get("/agendamentos", async (req, res) => {
    const agendamentos = await prisma.agendamento.findMany({
        orderBy: {
            Horario_da_consulta: 'asc'
        },
        where: {
            NOT: {
                Status_da_Consulta: 'Cancelado'
            }
        }
    })
    res.status(201).json(agendamentos)
})

app.get("/agendamentos_filtrado", async (req, res) => {
    let filter = req.query.id;
    console.log(filter)
    const agendamentos_filtrados = await prisma.agendamento.findMany({
        orderBy: {
            Data_do_Atendimento: 'asc'
        },
        where: {
            Nome: filter, NOT: {
                Status_da_Consulta: 'Cancelado'
            }
        },
    })
    res.status(201).json(agendamentos_filtrados)
})

app.put("/agendamento_desabilitado", async (req, res) => {
    // STATUS - CANCELADO
    await prisma.agendamento.update({
        data: req.body,
        where: { id: req.body.id }
    })

    res.status(200).json({
        message: "ok"
    })
})

app.get("/pacientes", async (req, res) => {
    const pacientes = await prisma.cadastro_pacientes.findMany({
        orderBy: { Nome: 'asc' }
    })
    res.status(200).json(pacientes)
})

app.get("/pacientes/:id", async (req, res) => {
    const paciente = await prisma.cadastro_pacientes.findUniqueOrThrow({
        where: { id: req.params.id }
    })
    res.status(200).json(paciente)
})


app.delete("/pacientes", async (req, res) => {
    await prisma.cadastro_pacientes.delete({
        where: {
            id: req.body.id
        }
    })


    res.json({
        message: "ok"
    })

})

app.post("/cadastro_convenio", async (req, res) => {
    await prisma.cadastro_convenio.create({
        data: req.body,
    })


    res.status(201).json({
        message: "ok"
    })

})

app.post("/cadastro_user", async (req, res) => {

    req.body.Senha = fazedor_de_senha(req.body.Senha)

    await prisma.cadastro_user.create({
        data: req.body
    })


    res.status(201).json({
        message: "ok"
    })

})

app.put("/cadastrar_user/:id", async (req, res) => {
    await prisma.cadastro_user.update({
        data: req.body,
        where: {
            id: req.params.id
        }
    })

    res.status(201).json({
        message: "ok"
    })
})

app.post("/cadastro_espera", async (req, res) => {
    await prisma.cadastro_espera.create({
        data: req.body
    })

    res.status(201).json({
        message: "ok"
    })
})

const gerarNumero4Dig = () => Math.floor(Math.random() * 9000) + 1000

app.post("/gerar-recovery", async (req, res) => {
    try {
        const user = await prisma.cadastro_user.findUniqueOrThrow({
            where: {
                Usuario: req.body.usuario
            }
        })

        const recoveryCode = gerarNumero4Dig()

        await prisma.cadastro_user.update({
            where: {
                id: user.id
            },
            data: {
                recoveryCode
            }
        })

        await enviarEmail(user.Email, 'Recuperação de senha', `
        <p>seu código de recuperação é ${recoveryCode}</p>
      `)
    } finally {
        res.json({ message: 'ok' })
    }
})

app.post("/resetar-senha", async (req, res) => {
    try {
        await prisma.cadastro_user.update({
            where: {
                Usuario: req.body.usuario,
                recoveryCode: req.body.codigo
            },
            data: {
                Senha: fazedor_de_senha(req.body.senha),
                recoveryCode: null
            }
        })
    } catch (err) {
        console.error(err)
    } finally {
        res.json({ message: 'ok' })
    }
})

// Vou criar 4 rotas abaixo para o fluco de caixa: Criar, receber, editar e detelar.

// Rota Criar = app.post

app.post("/Fluxo_de_caixa", async (req, res) => {
    await prisma.Fluxo_de_caixa.create({
        data: req.body,
    })


    res.status(201).json({
        message: "ok"
    })

})

// Rota Receber = app.get

app.get("/Fluxo_de_caixa", async (req, res) => {
    try {
        const fluxos = await prisma.Fluxo_de_caixa.findMany();

        // Buscar consultas com Status 'Pago'
        const consultas = await prisma.Agendamento.findMany({
            where: {
                Status_do_pagamento: 'Pago',
            }
        });

        const pacietesCache = {};

        for (const consulta of consultas) {
            let nome = 'Não encontrado';  // Valor padrão

            if (consulta.Nome) {
                // Se o paciente não está no cache, busca no banco de dados
                if (!pacietesCache[consulta.Nome]) {
                    const pac = await prisma.cadastro_pacientes.findUnique({
                        where: { id: consulta.Nome }
                    });

                    // Armazenar o resultado no cache (mesmo que seja null)
                    pacietesCache[consulta.Nome] = pac || null;
                }

                // Verificar se há um paciente no cache antes de acessar 'Nome'
                if (pacietesCache[consulta.Nome]) {
                    nome = pacietesCache[consulta.Nome]?.Nome ?? 'Não encontrado';
                }
            }

            // Adiciona o fluxo relacionado à consulta
            fluxos.push({
                id: `con-${consulta.id}`,
                Descricao: `Atendimento: ${nome}`,
                Valor: String(consulta.Valor_da_Consulta),
                Tipo: 'Entrada',
                Especialista: consulta.Especialista,
                Data: consulta.Data_do_Atendimento
            });
        }

        // Retorna a lista completa de fluxos
        res.json(fluxos);
    } catch (error) {
        console.error("Erro na rota /Fluxo_de_caixa:", error);
        res.status(500).json({ error: "Erro no servidor" });
    }
});


// Rota Editar = app.put

app.put("/Fluxo_de_caixa", async (req, res) => {
    await prisma.Fluxo_de_caixa.update({
        data: req.body,
        where: {
            id: req.body.id
        }
    })


    res.json({
        message: "ok"
    })

})

// Rota Deletar = app.delet

app.delete("/Fluxo_de_caixa", async (req, res) => {
    await prisma.Fluxo_de_caixa.delete({
        where: {
            id: req.body.id
        }
    })


    res.json({
        message: "ok"
    })

})


app.get("/Lista_espera/:especialista", async (req, res) => {
    const lista_espera = await prisma.Espera.findMany({
        where: { 
            Especialista: req.params.especialista }
    })


    res.json(lista_espera)

})

app.post("/Lista_espera", async (req, res) => {
    await prisma.Espera.create({
        data: req.body,
    })


    res.status(201).json({
        message: "ok"
    })

})

app.delete("/Lista_espera/:id", async (req, res) => {
    try {
        await prisma.Espera.delete({
            where: {
                id: req.params.id
            }
        });
        res.json({ message: "ok" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao deletar item" });
    }
});


app.get("/users", async (_, res) => {
    const users = await prisma.cadastro_user.findMany()


    res.json(users)
})

app.post("/cadastro_prof", async (req, res) => {
    await prisma.cadastro_prof.create({
        data: req.body
    })

    res.status(201).json({
        message: "ok"
    })
})

app.get("/cadastro_prof/:especialista", async (req, res) => {
    const data = await prisma.cadastro_prof.findUnique ({
        where:{
            Especialista: req.params.especialista
        }
    })

    res.json(
        data
    )
})

app.put("/cadastro_prof/:especialista", async (req, res) => {
    const data = await prisma.cadastro_prof.update ({
        where:{
            Especialista: req.params.especialista
        }, data:req.body
    })

    res.json(
        data
    )
})

app.post("/atendimento", async (req, res) => {
    const newRecord = await prisma.atendimento.create({
        data: req.body
    })

    res.status(201).json({ id: newRecord.id })

})

app.get("/atendimento/:id", async (req, res) => {
    const paciente = await prisma.atendimento.findMany({
        where: { id_paciente: req.params.id }
    })
    res.status(200).json({ paciente })
})

app.put("/atendimento", async (req, res) => {
    await prisma.atendimento.update({
        data: req.body,
        where: {
            id: req.body.id
        }
    })


    res.json({
        message: "ok"
    })

})



app.post("/chat", async (req, res) => {
if (req.body.focus)
    await prisma.messages.updateMany({
        data: { visualizado: true },
        where: {
            from: req.body.to,
            to: req.body.from,
            visualizado: false,
        }
    })


    const messages = await prisma.messages.findMany({
        where: {
            OR: [
                { from: req.body.from, to: req.body.to },
                { to: req.body.from, from: req.body.to }
            ]
        },
        orderBy: { createdAt: 'asc' },
        take: -20
    })


    res.status(200).json(messages)
})

app.post("/chat/message", async (req, res) => {
    const message = await prisma.messages.create({
        data: req.body
    })

    res.status(200).json(message)
})


app.post("/chat/pendentes", async (req, res) => {

    const message = await prisma.messages.findMany({
        where: {
            visualizado: false,
            to: req.body.from
        }
    })

    const users = message.map(({from}) => from).reduce((acc, cur) => {
        if (acc.includes(cur)) return acc
        return [...acc, cur]
    }, [])

    res.status(200).json(users)
})

app.get('/agendamentos', (req, res) => {
    const { data } = req.query;

    appointments.find({
        Data_do_Atendimento: data
    }).toArray((err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
});




app.listen(porta, () => {
    console.log(`servidor rodando na porta ${porta}`)
})

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

    if (data.Secretaria) {
        // COISAS Q EU QUERO FAZER SE FOR SECRETARIA
    } else {
       // COISAS Q EU QUERO FAZER SE N FOR SECRETARIA
    }

    if (data.Profissional) {
        // COISAS Q EU QUERO FAZER SE FOR PROFISSIONAL
    } else {
       // COISAS Q EU QUERO FAZER SE N FOR PROFISSIONAL
    }
})().catch(console.error)

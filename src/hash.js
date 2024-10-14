const crypto=require("crypto")

function fazedor_de_senha(senha){
  return  crypto.createHash("sha256").update(senha).digest("hex")
}

module.exports={fazedor_de_senha}
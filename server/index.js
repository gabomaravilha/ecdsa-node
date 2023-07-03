const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { toHex } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const {secp256k1} = require("ethereum-cryptography/secp256k1");
const { keccak256 }= require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

const balances = {
  '020fe53b08cea7fce506ccbabb153edecf8701097aaf013c6c29b28276b3df4f58': 100, 
  // 621133a241cbf51fc58c67f745527a7d30e6e7313845e23a9eabb79e4f6fe349
  '03170164873031f9157832bec03e9ea76db745b1918545fe0a58076622929043fe': 50,
  // 8a8304eb7dab4d17926e99a8458ca723c5331ab99875ea0b6e918bd0d135803d
  '023fdd1351d7a49c87ab61c490e44ca1f1611308ace1aa7e9fd33d74e5bf308da5': 75,
  // 58d763eb81dc1209f00da4843d73e4899b5d8c5a45907f819490b27aeb710128
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});
/*
ask the user what is the privatekey so that sign the message and send to server
passing a signature rather done a wallet address this is the sender
*/ 


app.post("/send", (req, res) => {
  //get signature from the client-side application
  //recover the public address from the sgnature
  
  const { message, signature } = req.body;

  const messageHash = toHex(keccak256(Uint8Array.from(message)));
  sender=message.sender;
  recipient=message.recipient;
  amount=message.amount;
 

  //let's first check the signature
  const isSigner = secp256k1.verify(signature, messageHash, sender);

  if(isSigner){
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }else {
    res.status(400).send({ message: "you are not the signer!" });
  }
  
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}


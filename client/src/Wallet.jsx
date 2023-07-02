import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import {toHex, utf8ToBytes} from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256.js";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value
    setPrivateKey(privateKey);
    // const address = secp256k1.getPublicKey(sha256(utf8ToBytes(privateKey)))
    const address = toHex(secp256k1.getPublicKey(privateKey));
    setAddress(address)
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type an address, for example: 0x1" value={privateKey} onChange={onChange}></input>
      </label>
      <div>
        Address: {address}
      </div>


      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;

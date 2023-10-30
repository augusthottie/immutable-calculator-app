import React, { useState } from "react";
import Button from "./components/Button";
import passportInstance from "./baseConfig.js";
import { provider } from "@imtbl/sdk";
import web3 from "web3";

function App() {
 const [display, setDisplay] = useState("0");
  const [equation, setEquation] = useState()
  const [userEmail, setUserEmail] = useState('')
  const [userAddress, setUserAddress] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [idToken, setIdToken] = useState('')
  const [userNickname, setUserNickname] = useState('')
  const [transactionHash, setTransactionHash] = useState('')
  const [loading, setLoading] = useState(false);
 return (
  <div className="main">
  <div className="passport">
   <button className="Immutable-button"
       disabled={loading}
       onClick={async () => {
        setLoading(true);
         console.log("Hottie isn't too hot. She is ") //sanity check xD
         const provider = passportInstance.connectEvm();
         const accounts = await provider.request({ method: "eth_requestAccounts" });
         const personAddress = accounts[0] // ['0x...']
         setUserAddress(personAddress)
      
         const userInfo  = await passportInstance.getUserInfo()
         const email = userInfo.email
         setUserEmail(email)

         const nickname = userInfo.nickname
         setUserNickname(nickname)

         const accessToken = await passportInstance.getAccessToken();
         const accessTokenValue = accessToken;
         setAccessToken(accessTokenValue)

         const idToken  = await passportInstance.getIdToken();
         const idTokenValue = idToken;
         setIdToken(idTokenValue)

         //sanity check
         console.log({email})
         console.log({personAddress})
         console.log({nickname})
         console.log({idTokenValue})
         console.log({accessTokenValue})
         setLoading(false);
       }}
     >{!loading && 'Connect Passport'}{loading && 'Logging in...'}  </button>

     <button className="Immutable-button" onClick={ async () => {
      const provider = passportInstance.connectEvm();
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      const datavalue ='0x'
      const transactionHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            to: '0xd22b130df62009efA55ec78F59eBF7CF540d7A3F',
            data: web3.utils.asciiToHex(datavalue),
          }
        ]
      });
      const transactionHashValue = transactionHash;
      setTransactionHash(transactionHashValue)
   
      //sanity check
      console.log(transactionHash); // ['0x...']
      console.log(datavalue)
     }}>Transact</button>

     <button className="Immutable-button" onClick={ async () => {
       await passportInstance.logout();
       setUserAddress('')
       setUserEmail('')
       setUserNickname('')
       setAccessToken('')
       setIdToken('')
       setTransactionHash('')
       console.log("I was logged out succesfully")
     }}>Logout</button>
  </div>
  <div className="main-component">
<div class="user-info-container">
  <p class="user-info">User Email: { userEmail }</p>
  <p class="user-info">User Address: { userAddress }</p>
  <p class="user-info">User Nickname: { userNickname }</p>
  <p class="user-info"> Access Token: { accessToken }</p>
  <p class="user-info">Id Token: { idToken }</p>
  <p class="user-info">Transaction Hash: { transactionHash }</p>
</div>
<div className="App">
   <div className="calculator">
    <div className="display">{display}</div>
    <div className="buttons">
     <div className="buttonContainer">
      <Button text="AC" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
      <Button text="+/-" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
      <Button text="%" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
      <Button text="÷" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
     </div>
     <div className="buttonContainer">
      <Button text="7" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
      <Button text="8" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
      <Button text="9" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
      <Button text="x" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
     </div>
     <div className="buttonContainer">
      <Button text="4" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
      <Button text="5" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
      <Button text="6" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
      <Button text="-" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
     </div>
     <div className="buttonContainer">
      <Button text="1" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
      <Button text="2" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
      <Button text="3" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
      <Button text="+" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
     </div>
     <div className="buttonContainer">
      <Button text="0" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
      <Button text="." display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
      <Button text="=" display={display} setDisplay={setDisplay} equation={equation} setEquation={setEquation} />
     </div>
    </div>
   </div>
  </div>
</div>
  </div>
 );
}
export default App;
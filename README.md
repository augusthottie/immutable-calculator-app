# Immutable Passport Integration Guide

This guide provides step-by-step instructions for integrating Immutable Passport into a simple React application. It covers the connection process, getting user information, and how to initialise a transaction.
## Prerequisites

Before you begin, make sure you have the following:

- Immutable Passport credentials (client ID) from Immutable Developer Hub.
- Latest version of node.
- Basic React App.

## Integration with Immutable Passport
1. **Register Application**
   - Head over to [Immutable Hub](https://hub.immutable.com/) to register your App.
   - Make sure you save your ClientID, Callback URLs, and Logout URLs.
   - **Tip its better to test on localhost before deploying.
   - These are my example URLs :
   - - Logout URLs: http://localhost:3000
     - Callback URLs: http://localhost:3000/login
     - Client ID (example): L*********Pu5P1xUi
2. **Install/use latest version of node:**
   - If you don't have node installed, install here [node](https://nodejs.org/en/download)
   - To make sure you're using the latest version run this command:
   - ```js
      npm install -D @imtbl/sdk
     ```
- Should there be complications during the installation, try this troubleshooting commands:
- ```js
  rm -Rf node_modules
  npm cache clean --force
  npm i
  ```
3. **Install the typescript dependency**
   ```js
   npm install -D typescript ts-node
   ```
4. **Initialise Passport:**
   Next, we'll need to initialise the Passport client. For us to initialise it, we'll need an instance of an ImmutableConfiguration, which defines shared configuration across all the Immutable modules, such as      the environment. Create a js file to save the below code. I named mine `baseConfig.js`. We'll be using the Sandbox environment instead of Production. Make sure to replace, `YOUR_CLIENT_ID`, `redirectUri`, and `logoutRedirectUri`, with the same values you used to register your App!
- Example Code:
   ```js
   import { config, passport  } from '@imtbl/sdk';

   const passportInstance = new passport.Passport({
   baseConfig: new config.ImmutableConfiguration({
   environment: config.Environment.SANDBOX,
     }),
     clientId: '<YOUR_CLIENT_ID>',
     redirectUri: 'https://example.com',
     logoutRedirectUri: 'https://example.com/logout',
     audience: 'platform_api',
     scope: 'openid offline_access email transact'
   });
   export default passportInstance;
   ```
Note that the Passport constructor may throw the following error:
- Error Code: `INVALID_CONFIGURATION`
- Reason: The environment configuration or OIDC Configuration is incorrect.
- Solution: Verify that you are passing an environment configuration and OIDC configuration, and that all the mandatory properties have been set.
5. **Enable User Identity and get User Information:** Amazingly, Immutable Passport is an Open ID provider and uses the Open ID Connect protocol for authentication and authorization. Which means you can use your gmail, email, or Apple Id to sign in to the passport. Firstly we'll try and login to our application with Immutable passport. And to be able to do that we **need** to have the Passport module installed and initialised, which we did in the previous step. To initialise the passport provider, we'll be using the `Ethereum EIP-1193` standard. Using the EIP-1193 standard, we can use the same logic to interact with a user's Passport wallet as you would with any other Ethereum wallet.
Since i'm making this guide based on a React application, i'll need to install `react-dom`, and `react-router-dom` to be albe to route to `Callback URL` without issues. To install the routes library, use:
```js
npm install react-dom
npm install react-router-dom
```
After installing, make sure to import and add this example code in your `index.js` file:
```js
import {BrowserRouter as Router,Routes, Route} from 'react-router-dom'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} /> //is triggered when the logout button is clicked
        <Route path="/login" element={<Login />} /> //routes to login 
  </Routes>
    </Router>
  </React.StrictMode>
);
``` 
Time to actually code our login user logic and get user information, like email, user-address, nickname, idToken, and accessToken. To do this navigate to your `App.js` file and create a button with an `on-click` funtion, and import the PassportInstance from `baseConfig.js`. Here's my code that makes the above work:
```js
import passportInstance from "./baseConfig.js";

  //using useState() to display user details
  const [userEmail, setUserEmail] = useState('')
  const [userAddress, setUserAddress] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [idToken, setIdToken] = useState('')
  const [userNickname, setUserNickname] = useState('')

<button className="Immutable-button"
       disabled={loading}
       onClick={async () => {
        setLoading(true);
         console.log("Hottie isn't too hot. She is ") //sanity check xD
         const provider = passportInstance.connectEvm(); //connects to EVM 
         const accounts = await provider.request({ method: "eth_requestAccounts" }); //logs in with your account, eg. gmail
         const personAddress = accounts[0] // ['0x...']
         setUserAddress(personAddress)
      
         const userInfo  = await passportInstance.getUserInfo()
         const email = userInfo.email //gets your email
         setUserEmail(email)

         const nickname = userInfo.nickname
         setUserNickname(nickname) //gets your nickname, the value will be undefined if you have no nickname

         const accessToken = await passportInstance.getAccessToken();
         const accessTokenValue = accessToken;
         setAccessToken(accessTokenValue) //gets Access token

         const idToken  = await passportInstance.getIdToken();
         const idTokenValue = idToken;
         setIdToken(idTokenValue) // gets ID token

         //sanity check
         console.log({email})
         console.log({personAddress})
         console.log({nickname})
         console.log({idTokenValue})
         console.log({accessTokenValue})
         setLoading(false);
       }}
     >{!loading && 'Connect Passport'}{loading && 'Logging in...'}  </button>
```
**Here is a breakdown of what the code is doing:**
- When the button is clicked, it first logs a message to the console for debugging.
- It calls passportInstance.connectEvm() to connect to the Ethereum provider.
- It uses the provider to request the user's Ethereum account address and saves it to the personAddress variable.
- It calls the setUserAddress function to save the address in the application state.
- It calls passportInstance.getUserInfo() to get the user's profile information from Passport.
- It saves the email, nickname, and other profile data to variables.
- It calls setter functions like setUserEmail to save the profile data in the application state.
- It calls passportInstance.getAccessToken() and passportInstance.getIdToken() to get JWT authentication tokens from Passport.
- It saves the access and ID token values to variables and state.
- It logs all the retrieved user data to the console for debugging/verification.

 We also need to create a file to handle our Login logic. To do this, create a file called `Login.js`. Copy the code below to handle the logic:
```js
import { useEffect } from 'react';
import passportInstance from './baseConfig.js'

export default function Login() {
  useEffect(() => {
    async function handleLoginCallback() {
      if (!passportInstance) {
        return
      }
    try {
        console.log("login callback");
        await passportInstance.loginCallback();
    }
    catch (err) {
        console.error("login callback error", err);
    }
    }
    console.log("I will login")
    handleLoginCallback()
  }, []);

  return (
    <div/>
  );
}
```
**Here's a quick explanation of the code:**
- It imports the passportInstance object that contains Passport authentication logic.
- The useEffect hook runs on component mount.
- It defines an async handleLoginCallback function.
- This calls passportInstance.loginCallback() which handles the redirect back from the Passport login.
- It catches any errors and logs them.
- The effect calls this function to initialize the login callback handling.
- The component itself just returns empty div, its main purpose is the side-effect login handling.
  
Note, if you encounter any of the errors while trying to login in the Screenshot below, here's how to fix it:
![image](https://github.com/AugustHottie/immutable-intergration/assets/96122635/4192e445-071b-46f6-a1f1-0ad0a5197ee4)

- run `npm install assert`
- run `npm install crypto-browserify`
- run `npm install stream-browserify`
- run `npm install buffer`
- After installing them individually, add them in `webpack.config.js` file inside `node-modules` in `react-scripts`
- look for the config folder, inside the folder is the `webpack.config.js` file. Then ctrl+f and search for `fallback`, then add this code:
- ```js
  fallback:{
        "crypto": require.resolve("crypto-browserify"),	
        "stream": require.resolve("stream-browserify"),
      }
  ```
- Try logging in again, and you should be good to go!

6. **Logging out a User:** Similar to the login code, we have to create a button with an `on-click` function to handle states. Here's the code to do so:
```js
<button className="Immutable-button" onClick={ async () => {
       await passportInstance.logout();
       setUserAddress('')
       setUserEmail('')
       setUserNickname('')
       setAccessToken('')
       setIdToken('')
       console.log("I was logged out succesfully")
     }}>Logout</button>
```
 **Here's an explanation of what the code is doing:**
- We declare an async arrow function for the onClick handler of a button.
- Inside this, it calls passportInstance.logout() to log the user out of Passport.
- It resets all the user state variables like user address, email, nickname etc.
- This has the effect of clearing out the user's information and "logging them out" from the application's perspective.
- It logs a message to the console to confirm the logout occurred successfully.
So in summary, this is a React component that when clicked will call the Passport SDK to log the user out and clear any user state in the application, effectively logging them out of the app as well. The main logic is handled by the passportInstance.logout() call.

7. **Initiate a Transaction:** We'll be using the `eth_sendTransaction` method. With the following params:
   - Transaction: Object. A standard Ethereum transaction object. Only the following properties will be referenced:
   - i `to`: string. The destination address of the message.
   - ii `data`: string (optional). Either a byte string containing the associated data of the message, or in the case of a contract-creation transaction, the initialisation code.
   - iii `value`: string (optional). The value transferred for the transaction in wei, encoded as a hex string.
   - And just like login and logout, we will be using a button with the `on-click` function to handle the event.
   - Here's the example code:
     ```js
      <button className="Immutable-button" onClick={ async () => {
      const provider = passportInstance.connectEvm();
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      const datavalue ='0x'
      const transactionHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [
          {
            to: 'valid immutable addresss',
            data: web3.utils.asciiToHex(datavalue),
          }
        ]
      });
      const transactionHashValue = transactionHash;
      setTransactionHash(transactionHashValue)
      //sanity check
      console.log(transactionHash); // ['0x...']
     }}>Transact</button>
     ```
   - Notice we had to create a new varaible `dataValue` and cast it as string using `web3.utils.asciiToHex(datavalue)`  we do this to avoid the `invalid BigNumber string` error. So it is very important you cast the return value of data using `web3.utils.asciiToHex()`.
   - Notice, we also didn't use `value` as its optional.
   - You can choose to use it, but you'll most likely have to cast its value to string as well.
   - Another thing to note, make sure the address you're sending to is a valid immutable address and it has some test tokens, also the account you're sending from has test tokens too.
  
   **Here's a brief overview of what the code does:**
- The button onClick triggers an async function.
- It calls passportInstance.connectEvm() to get a provider instance.
- It uses the provider to request the user's accounts via eth_requestAccounts.
- It defines a data payload for the transaction.
- It calls eth_sendTransaction on the provider to submit a transaction to a specified contract address, with the data payload.
- The returned transaction hash is saved to a state variable.
- This transaction hash is logged to console for debugging.

In summary, when the button is clicked, the code uses the Passport Ethereum provider to have the user sign and submit a transaction containing the specified data to the blockchain. The transaction hash allows the application to track its status.
So it enables sending a basic Ethereum transaction using a user's Passport wallet, abstracting away some of the underlying complexity. The key aspects are getting the provider, requesting accounts, and calling eth_sendTransaction.

**Proof of Success 🎆**
- **Logging in with passport**
  ![image](https://github.com/AugustHottie/immutable-calculator-app/blob/main/images/image%20(2).png?raw=true)
- **Initiating a transaction**
  ![image](https://github.com/AugustHottie/immutable-calculator-app/blob/main/images/image.png?raw=true)
- **Confirming the transaction**
  ![image](https://github.com/AugustHottie/immutable-calculator-app/blob/main/images/image.png?raw=true)
  ![image](https://github.com/AugustHottie/immutable-calculator-app/blob/main/images/image%20(4).png?raw=true)

Note, if you encounter the issue below while trying to initiate a transaction, it means the network server is down, you can try again after a while and it should work fine.
![image](https://github.com/AugustHottie/immutable-calculator-app/assets/96122635/989c5c84-ea10-44ae-9d84-d7a1112e3479)

![image](https://github.com/AugustHottie/immutable-calculator-app/blob/main/images/image%20(5).png?raw=true)

### **Final Thoughts 🤔**

Congratulations! You've successfully integrated Immutable Passport into your React application. By following this guide, you've taken the first steps to leverage the power of Immutable's authentication and authorization services.

**Here are some final thoughts and tips:**

- **Testing on Localhost:** Before deploying your application, it's a good practice to thoroughly test it on localhost. This ensures that your integration with Immutable Passport works as expected in a controlled environment.
- **Keep Your Credentials Secure:** Ensure that your Immutable Passport credentials, such as the Client ID, are kept secure. Never expose them in your source code or public repositories.
- **Explore Further:** Immutable Passport offers various features and capabilities. Explore the official documentation to discover more ways to enhance your application. [Immutable Doc](https://docs.immutable.com/docs/zkEVM/overview)
- **Leverage Community Support:** If you run into challenges or have questions, don't hesitate to reach out to the community for support. Forums, chat channels, and online communities can be valuable resources. [Immutable Discord](https://discord.gg/c94zxHCv)

**View my Live Application:** [Immutable Calculator App](https://immutable-calculator-app.netlify.app/)

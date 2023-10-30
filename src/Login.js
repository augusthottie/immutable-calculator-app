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

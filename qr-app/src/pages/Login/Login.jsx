import style from "./Login.module.css";
import googleicon from "../../Images/google_g_logo.svg.png";
import arrow from "../../Images/right-arrow.png";
import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();

  // Sign in with google
  const signin = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
  }, []);

  return (
    <div className={style.upperblock}>
      <div className={style.block}>
        <h2>Sign in to your account</h2>
        <button onClick={signin}>
          <img className={style.googleicon} src={googleicon} /> Continue with
          Google
        </button>
        <p>or</p>
        <div className={style.inputblock}>
          <input type="password" name="" id="" placeholder="Email" />
          <img className={style.arrow} src={arrow} />
        </div>
      </div>
    </div>
  );
}

import style from "./Login.module.css";
import googleicon from "../../Images/google_g_logo.svg.png";
import arrow from "../../Images/right-arrow.png";
import { auth, provider,firestore } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Sign in with google
  const signin = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  const emailSignIn = async () => {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        await firestore.collection('url').doc(user.uid).set({
          email: user.email,
          password:user.password,
          qr:[]
          // Other user details you want to store
        });
      }
      console.log('User signed in:', user);
    } catch (error) {
      toast.error("Something went wrong. Please check your email and password.");
      console.error('Error signing in:', error);
      
    }
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
        <div className={style.inputblock}>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {/* <img className={style.arrow} src={arrow} /> */}
        </div>
        <div className={style.inputblock}>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button style={{ backgroundColor: "#3d3db3" }} onClick={emailSignIn}>Login</button>
        <p>or</p>
        <button onClick={signin}>
          <img className={style.googleicon} src={googleicon} /> Continue with
          Google
        </button>
        <span onClick={() => navigate("/signup")}>Create a new account</span>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </div>
  );
}

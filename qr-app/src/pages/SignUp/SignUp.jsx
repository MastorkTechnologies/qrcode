import style from "./SignUp.module.css";
import googleicon from "../../Images/google_g_logo.svg.png";
import arrow from "../../Images/right-arrow.png";
import { auth, provider,firestore } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";


export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Sign in with google
  const googleSignUp = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  const emailSignUp = async () => {
    if (password === confirmPassword && password.length >= 6) {
      console.log("length", password.length);
      try {
        const userCredential = await auth.createUserWithEmailAndPassword(
          email,
          password
        );
        const user = userCredential.user;

        if (user) {
          await firestore.collection('url').doc(user.uid).set({
            email: user.email,
            qr:[]
            // Other user details you want to store
          });
        }

        console.log("User signed up:", user);
        toast.success("Sucessfully signed in");
      } catch (error) {
        toast.error("Something went wrong. Please try again later.");
        console.error("Error signing up:", error);
      }
    } else if (password.length < 6) {
      toast.error("Password should be at least 6 characters long");
      console.error("Password shou ld be at least 6 characters long");
    } else {
      toast.error("Passwords do not match");
      console.error("Passwords do not match");
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
        <h2>Sign up to your account</h2>
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
        <div className={style.inputblock}>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button style={{ backgroundColor: "#3d3db3" }} onClick={emailSignUp}>
          Done
        </button>
        <p>or</p>
        <button onClick={googleSignUp}>
          <img className={style.googleicon} src={googleicon} /> Sign up with
          Google
        </button>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </div>
  );
}

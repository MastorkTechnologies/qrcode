import { useEffect, useState } from "react";
import style from "./Navbar.module.css";
import logo from "../../Images/QRCODE.png";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [signedIn, setSignedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSignedIn(true);
      } else {
        console.log("user is signed out", user);
      }
    });
  }, []);

  // Signout function
  const logout = () => {
    auth.signOut();
    setSignedIn(false);
  };

  return (
    <div className={style.block}>
      <div className={style.logo}>
        <img src={logo} />
      </div>
      <ul>
        <li>Features</li>
        <li>How it Works</li>
        <li>Use Cases</li>
        <li>FAQ</li>
      </ul>
      {signedIn === true ? (
        <button className={style.startbtn} onClick={logout}>
          Log Out
        </button>
      ) : (
        <button className={style.startbtn} onClick={() => navigate("/login")}>
          Log In
        </button>
      )}
    </div>
  );
}

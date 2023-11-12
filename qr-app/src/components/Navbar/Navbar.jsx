import { useEffect, useState } from "react";
import style from "./Navbar.module.css";
import logo from "../../Images/QRCODE.png";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [signedIn, setSignedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
    setShowMenu(windowWidth < 600);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [windowWidth]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setSignedIn(true);
      } else {
        console.log("user is signed out", user);
      }
    });
  }, []);

  const logout = () => {
    auth.signOut();
    setSignedIn(false);
    window.location.reload();
  };

  return (
    <div className={style.block}>
      <div className={style.logo}>
        <img src={logo} alt="Logo" />
      </div>
      <div className={style.menuIcon} onClick={() => setShowMenu(!showMenu)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      {windowWidth > 600 ? (<>
        <ul className={style.menu} style={{ display: showMenu ? "none" : "flex" }}>
          <li>Features</li>
          <li>How it Works</li>
          <li>Use Cases</li>
          <li>FAQ</li>
          
        </ul>
        {signedIn === true ? (
          <div className={style.userOptions} style={{ display: "flex", gap: "8px" }}>
            <li className={style.dashboardbtn} onClick={() => navigate("/dashboard")}>
              Dashboard
            </li>
            <li className={style.logoutbtn} onClick={logout}>
              Log Out
            </li>
          </div>
        ) : (
          <li className={style.startbtn} onClick={() => navigate("/login")}>
            Log In
          </li>
        )}
      </>) : (
        <ul className={style.menu} style={{ display: showMenu ? "none" : "flex" }}>
          <li>Features</li>
          <li>How it Works</li>
          <li>Use Cases</li>
          <li>FAQ</li>
          {signedIn === true ? (
            <div className={style.userOptions} style={{ display: "flex", gap: "8px" }}>
              <li className={style.dashboardbtn} onClick={() => navigate("/dashboard")}>
                Dashboard
              </li>
              <li className={style.logoutbtn} onClick={logout}>
                Log Out
              </li>
            </div>
          ) : (
            <li className={style.startbtn} onClick={() => navigate("/login")}>
              Log In
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

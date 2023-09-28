import style from "./Navbar.module.css"
import logo from "../../Images/QRCODE.png"

export default function Navbar(){
    return(
        <div className={style.block}>
            <div className={style.logo}>
                <img src={logo}/>
            </div>
            <ul>
                <li>Features</li>
                <li>How it Works</li>
                <li>Use Cases</li>
                <li>FAQ</li>
            </ul>
            <button className={style.startbtn}>Get Started</button>
        </div>
    )
}
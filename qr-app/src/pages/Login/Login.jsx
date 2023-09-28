import style from "./Login.module.css"
import googleicon from "../../Images/google_g_logo.svg.png"
import arrow from "../../Images/right-arrow.png"

export default function Login(){
    return(<div className={style.upperblock}>

        <div className={style.block}>
         <h2>Sign in to your account</h2>
         <button><img className={style.googleicon} src={googleicon} /> Continue with Google</button>
          <p>or</p>
          <div  className={style.inputblock}>

          <input type="password" name="" id="" placeholder="Email"   />
           <img className={style.arrow} src={arrow}/>
          </div>
        </div>
    </div>
    )
}
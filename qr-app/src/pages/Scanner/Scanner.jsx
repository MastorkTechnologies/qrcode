import style from "./Scanner.module.css"
import shoes from "../../Images/Sporting-Excellence-scanner.png"
import shoescannerbig from "../../Images/Sporting-Excellence-big.png"

export default function Scanner(){
    return(
        <div className={style.block}>
            <div className={style.left}>
             <div style={{marginTop:"20%"}} className={style.leftcard}>
                <img src={shoes}/>
             </div>
              <div className={style.leftcard}>
                 <p>+</p> 
              </div>
              <div className={style.leftcard}>
              <p>+</p> 
              </div>
              <div className={style.leftcard}>
              <p>+</p> 
              </div>
              <div className={style.leftcard}>
              <p>+</p> 
              </div>
              <div className={style.leftcard}>
              <p>+</p> 
              </div>
              <div className="leftcard">
              <p>+</p> 
              </div>
            </div>
            <div className={style.middle}>
              <div className={style.section1}>
                <div className={style.num}>1</div>
                <h3>Destination of your QR Code</h3>
                <input type={style.text} placeholder="https://" />
                <div style={{display:"flex",marginTop:"2%"}}>
                    <button className={style.url}>URL</button>
                    <button className={style.email}>EMAIL</button>

                </div>
              </div>

               <div className={style.section2}>
                <div className={style.num}>2</div>
                <h3>Style and Theme Your QR  Code</h3>
                 <div className={style.allqr}>
                       <img  src={shoes}/>
                       <img src={shoes}/>
                       <img src={shoes}/>
                       <img src={shoes}/>
                       <img src={shoes}/>
                       <img src={shoes}/>
                       <img src={shoes}/>
                       <img src={shoes}/>
                       <img src={shoes}/>
                       <img src={shoes}/>
                       <img src={shoes}/>
                       <img src={shoes}/>
                       <img src={shoes}/>
                       <img src={shoes}/>
                       <img src={shoes}/>
                       <img src={shoes}/>
                       <img src={shoes}/>
                       <img src={shoes}/>
                 </div>


               </div>

               <div className={style.section3}>
                <div className={style.num}>3</div>
                <h2>Set parameters</h2>
                <p>Params: The generated QR Code functionality is largely influenced by the parameters detailed below.</p>

                 <div className={style.parameter}>

                 </div>
               </div>
            </div>
            <div className={style.right}>
              <h2>Nike QR</h2>
                <div className={style.card}>
                    <img src={shoescannerbig}/>
                </div>
                <button >Generate</button>

            </div>

        </div>
    )
}
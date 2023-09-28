import style from "./Footer.module.css"


export default function Footer() {
    return (<>
    
        <div className={style.block}>
            <div className={style.top}>
                <div className={style.left}>
                    <h2>Revolutionize Your Brand with AI-Powered QR Codes Today!⚡</h2>
                </div>
                <div className={style.right}>
                    <button>Get Started</button>
                </div>

            </div>
            <div className={style.bottom}>
                <div className={style.one}>
                    <p>About QR Code</p>
                    <p className={style.onepara}>We generate your custom QR code. All that's left is for you to download it and start enhancing your brand's digital presence!</p>
                    <div className="icons"></div>
                </div>
                <div className={style.two}>
                    <p>Company
                    </p>   <ul>
                        <li>About</li>
                        <li>Features</li>
                        <li>Works</li>
                        <li>Career</li>

                    </ul>

                </div>
                <div className={style.two}>
                    <p>Help </p>
                    <ul><li>Customer Support</li>
                        <li>Delivery Details</li>
                        <li>Terms and Conditions</li>
                        <li>Privacy Policy</li>

                    </ul></div>
                <div className={style.two}>
                    <p>Resources </p>
                    <ul><li>Free eBooks</li>
                        <li>Development Tutorial</li>
                        <li>How to-Blog</li>
                        <li>Youtube </li>

                    </ul>
                </div>
            </div>

        </div>
    </>
    )
}
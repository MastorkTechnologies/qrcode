import { useEffect, useState } from "react"
import style from "./Landing.module.css"
import Navbar from "../components/Navbar/Navbar"
import star from "../Images/Star.png"
import shoes from "../Images/Sporting-Excellence.png (1).png"
import icon1 from "../Images/headphones-3 1.png"
import icon2 from "../Images/chart-3 1.png"
import icon3 from "../Images/board-2 1.png"
import icon4 from "../Images/archive-content 1.png"
import icon5 from "../Images/folder-favorite 1.png"
import icon6 from "../Images//chart-3 1.png"

import "../App.css"
import plus from "../Images/plus-circle.png"
import minus from "../Images/minus-circle.png"
import homeimg from "../Images/Group 113.png"
import grpProfile from "../Images/Group 116.png"
import Footer from "../components/Footer/Footer"
import { useNavigate } from "react-router-dom"
import { onAuthStateChanged } from "firebase/auth";
import { auth, storage } from "../firebase";
import shortid from 'shortid';
import { firestore } from '../firebase';
import QRCode from 'qrcode';


const QRCodeModal = ({ closePopup }) => {
    const [selected, setSelected] = useState('')
    const [originalUrl, setOriginalUrl] = useState('')
    const [shortUrl, setShortUrl] = useState('')
    const [showitems, setShowItems] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        setShortUrl(`${shortid.generate()}`)
    }, [])
    const saveImageToFirebase = async (canvas) => {
        const timestamp = Date.now();
        const filename = `qr-image-${timestamp}.png`;
        canvas.toBlob(async (blob) => {
            const storageRef = storage.ref();
            const imageRef = storageRef.child(`images/${filename}`);
            await imageRef.put(blob);
            const downloadURL = await imageRef.getDownloadURL();
            console.log('Image uploaded to Firebase:', downloadURL);
            // You can now save the downloadURL or use it as needed
            handleSaveToFirebase(downloadURL)
        });
    };

    const generateQR = async () => {
        const qrContent = shortUrl; // Your QR content here
        console.log("qrContent", qrContent)

        // Create a canvas element to hold the QR code image
        const qrCodeDataURL = await QRCode.toDataURL(qrContent, { width: 200 });

        // Create an image element to hold the QR code
        const qrCodeImage = new Image();
        qrCodeImage.src = qrCodeDataURL;

        qrCodeImage.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = qrCodeImage.width;
            canvas.height = qrCodeImage.height;
            const context = canvas.getContext('2d');
            context.drawImage(qrCodeImage, 0, 0);
            saveImageToFirebase(canvas);
        };

        setShowItems(true);
    };

    const handleSaveToFirebase = async (downloadurl) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = firestore.collection('url').doc(user.uid);
                const userDoc = await userDocRef.get();

                if (userDoc.exists) {
                    // If the document exists, update the QR array
                    const userData = userDoc.data();
                    const baseUrl = originalUrl; // Replace with actual base URL
                    const shorturl = shortUrl; // Replace with generated short URL
                    const qrLink = downloadurl; // Replace with QR code link
                    const date = new Date(); // Get the current date and time

                    const year = date.getFullYear(); // Get the year (e.g., 2023)
                    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Get the month (adding 1 as months are zero-based, and adding padding zero if needed)
                    const day = ('0' + date.getDate()).slice(-2); // Get the day (adding padding zero if needed)

                    const dateAdded = `${year}-${month}-${day}`;

                    // Construct the new QR object
                    const newQRObject = { baseUrl, shorturl, qrLink, dateAdded, selected };
                    console.log(newQRObject);

                    // Update the 'qr' array or create a new array if it doesn't exist
                    const updatedQRArray = userData.qr ? [...userData.qr, newQRObject] : [newQRObject];

                    // Set the updated 'qr' array back in the Firestore document
                    await userDocRef.set({ qr: updatedQRArray }, { merge: true });
                    navigate("/dashboard")
                    console.log('QR object added to Firestore');
                } else {
                    console.log('User document does not exist.');
                }
            } else {
                console.log('No user is currently signed in.');
            }
        } catch (error) {
            console.error('Error updating QR object:', error);
        }
    };

    function popUpClose() {
        closePopup();
        setSelected('');
    }

    return (
        <div className="modal" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <h2>Select QR Code Type</h2>
            <div className={style.wrapperNames}>
                <div className={style.standardqr} onClick={() => setSelected('static')} >Static QR</div>
                <div className={style.aiqr} onClick={() => setSelected('dynamic')}>Dynamic QR</div>
            </div>
            {(selected === 'static' || selected == 'dynamic') && <div className={style.qrcodecontainer}>
                <div className={style.originalurl}>
                    <label className={style.origheading} htmlFor="originalUrl">Original URL:</label>
                    <input
                        type="text"
                        className={style.originput}
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                    />
                </div>
                {/*showitems > 0 && <div className="qr-code" style={{display:"flex",margin:"2rem"}}>
            <QRCode value={shortUrl} size={128} fgColor="#000" bgColor="#fff" style={{margin:"auto"}}  /* onComplete={(dataUri) => setQRCodeUrl(dataUri)}* />
          </div>*/}
                <button style={{ alignSelf: "center" }} onClick={generateQR}>Save</button>
            </div>}
            <div style={{ border: "2px solid black", borderRadius: "10px", padding: "8px", marginTop: "2rem" }} onClick={popUpClose}>Close</div>
        </div>
    );
};

export default function Landing() {
    const navigate = useNavigate()
    const [signedIn, setSignedIn] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const openPopup = () => {
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setSignedIn(true);
            } else {
                console.log("user is signed out", user);
            }
        });
    }, []);






    function toggleMenu1() {
        console.log("yes i m clicked")
        const menu = document.getElementById("optionClass1");
        menu.classList.toggle("show");
    }
    function toggleMenu2() {
        const menu = document.getElementById("optionClass2");
        menu.classList.toggle("show");
    }
    function toggleMenu3() {
        const menu = document.getElementById("optionClass3");
        menu.classList.toggle("show");
    }
    function toggleMenu4() {
        const menu = document.getElementById("optionClass4");
        menu.classList.toggle("show");
    }
    return (
        <>
            <div className={style.mainOuter}>
                <Navbar />
                {showPopup && (
                    <div className={style.popup}>
                        <div className={style.popup_inner}>
                            <QRCodeModal closePopup={closePopup} />
                        </div>
                    </div>
                )}


                <div className={style.block1}>
                    <div className={style.leftB1}>
                        <h1>AI-Powered Custom QR Codes</h1>
                        <p style={{ margin: "0px" }}>Next-Level Branding with AI QR Code.</p>
                        <button className={style.getstarted} onClick={() => signedIn ? openPopup() : navigate("/login")}>Get Started</button>
                        <img className={style.star} src={star} />
                        <p style={{ fontWeight: "800", margin: "5px 0px 0px 0px" }}>Best QR code editor in market!</p>
                        <p>Consectetur adipiscing elit. Vehicula massa in enim luctus. Rutrum arcu, aliquam nulla tincidunt gravida. Cursus convallis dolor semper pretium ornare.</p>
                        <div className={style.detail}>
                            <img className={style.profile} />
                            <p>Priyanshu Kumar</p>
                        </div>
                    </div>
                    <div className={style.rightB1}>
                        <img src={homeimg} />
                    </div>
                </div>
                <div className={style.block2}>
                    <h2 className={style.headB2}>Features</h2>
                    <p className={style.paraB2}>Elevate your Brand with AI</p>

                    <div className={style.cardsBlock}>
                        <div className={style.cardleft}>
                            <img src={shoes} />
                            <div className={style.left2}>
                                <h2>AI-Enabled Personalization</h2>
                                <p>Leverage the power of artificial intelligence for unparalleled QR code customization. Our sophisticated AI algorithms craft distinctive QR codes that align perfectly with your brand aesthetics, setting you apart in a competitive marketplace.</p>
                            </div>
                        </div>
                        <div className={style.cardright}>
                            <div className={style.right2}>
                                <h2>Amplified
                                    Brand Cohesion</h2>
                                <p>Elevate your brand image with QR codes that extend beyond functionality. Our AI-enhanced QR codes seamlessly incorporate your brand's color palette and logo, fostering consistent brand presentation across diverse marketing platforms.</p>
                            </div>
                            <img src={shoes} />
                        </div>
                        <div className={style.cardleft}>
                            <img src={shoes} />
                            <div className={style.left2}>
                                <h2>Boosted
                                    Customer Interaction</h2>
                                <p>Augment customer engagement by transforming your marketing collateral into interactive experiences. Our AI-infused artistic QR codes are designed to captivate attention and spur more scans, fueling increased customer interaction and engagement.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.block3}>
                    <h2 className={style.headB3}>How it Works</h2>
                    <p className={style.paraB3}>Your Journey to create Unique QR Codes</p>
                    <div className={style.cardsB3}>
                        <div className={style.card}>
                            <div className={style.num}>1</div>
                            <p className={style.cardB3parahead}>Choose Your Destination</p>
                            <p className={style.cardB3para}>Tell us where you want your QR code to take people. It could be your website, a digital menu, your social media page, and more.</p>

                        </div>
                        <div className={style.card}>  <div className={style.num}>2</div>
                            <p className={style.cardB3parahead}>Define Your Style</p>
                            <p className={style.cardB3para}>Provide us with your brand details. Our AI will use this information to generate a custom QR code that harmonizes with your brand's visual identity.</p></div>
                        <div className={style.card}>  <div className={style.num}>3</div>
                            <p className={style.cardB3parahead}>Download and Deploy</p>
                            <p className={style.cardB3para}>We generate your custom QR code. All that's left is for you to download it and start enhancing your brand's digital presence!</p></div>
                    </div>
                </div>
                <div className={style.block4}>
                    <h2 className={style.headB4}>Use Cases</h2>
                    <p className={style.paraB4}>QR Code Impact through Use Cases</p>
                    <div className={style.cardsB4}>
                        <div className={style.cardB4}>
                            <img src={icon1} />
                            <p className={style.cardB4parahead}>Brand Promotion</p>
                            <p className={style.cardB4para}>Boost your brand with unique QR codes.</p>
                        </div>
                        <div className={style.cardB4}>
                            <img src={icon2} />
                            <p className={style.cardB4parahead}>Digital Ad Campaigns</p>
                            <p className={style.cardB4para}>Maximize ad ROI with engaging QR codes.</p>
                        </div>
                        <div className={style.cardB4}>
                            <img src={icon3} />
                            <p className={style.cardB4parahead}>Event Invitations</p>
                            <p className={style.cardB4para}>Intrigue guests with artistic QR invitations.</p>
                        </div>
                        <div className={style.cardB4}>
                            <img src={icon4} />
                            <p className={style.cardB4parahead}>Product Packaging</p>
                            <p className={style.cardB4para}>Enhance packaging with scannable art pieces.</p>
                        </div>
                        <div className={style.cardB4}>
                            <img src={icon5} />
                            <p className={style.cardB4parahead}>Business Cards</p>
                            <p className={style.cardB4para}>Make memorable connections with AI QR codes</p>
                        </div>
                        <div className={style.cardB4}>
                            <img src={icon6} />
                            <p className={style.cardB4parahead}>Online Ads</p>
                            <p className={style.cardB4para}>Drive engagement with interactive QR ads</p>
                        </div>
                        <div className={style.cardB4}>
                            <img src={icon4} />
                            <p className={style.cardB4parahead}>E-Commerce</p>
                            <p className={style.cardB4para}>Simplify shopping with QR code redirects</p>
                        </div>
                        <div className={style.cardB4}>
                            <img src={icon5} />
                            <p className={style.cardB4parahead}>Educational Resources</p>
                            <p className={style.cardB4para}>Facilitate learning with scannable resources</p>
                        </div>
                        <div className={style.cardB4}>
                            <img src={icon6} />
                            <p className={style.cardB4parahead}>Customer Reviews</p>
                            <p className={style.cardB4para}>Boost credibility with QR code-enabled review</p>
                        </div>

                    </div>
                </div>


                <div className="section8" style={{ paddingTop: "8em" }}>
                    <div className="heading8" style={{ paddingTop: "30px" }}>
                        <h2 className={style.headB2}>Frequently asked questions</h2>
                        <p className={style.paraB2}>Everything you need to know about the product.</p>
                    </div>


                    <div className="content8" style={{ marginTop: "2em" }}>
                        <div className="content8_inner" onClick={() => toggleMenu1()}>
                            <div className="wrapperB">
                                <h3>What makes these AI-powered QR codes unique?</h3>
                                <img src={plus} alt="img" />
                            </div>
                            <p id="optionClass1" className="dpclass">
                                Our AI-powered QR codes stand out because they're not just functional, but also aesthetically pleasing. The AI customization process ensures that each QR code aligns with your brand's visual identity, creating a cohesive brand experience. This isn't just a QR code; it's a unique piece of brand artwork.
                            </p>
                        </div>
                        <div className="content8_inner" onClick={() => toggleMenu2()}>
                            <div className="wrapperB">
                                <h3>How can AI-customized QR codes enhance my marketing?</h3>
                                <img src={plus} alt="img" />
                            </div>
                            <p id="optionClass2" className="dpclass">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet placeat provident reiciendis voluptatem quidem expedita soluta laborum quibusdam. Doloremque voluptate nobis nam possimus quas modi architecto nulla obcaecati cupiditate eligendi?
                            </p>
                        </div>
                        <div className="content8_inner" onClick={() => toggleMenu3()}>
                            <div className="wrapperB">
                                <h3>Are these AI-powered QR codes easy to integrate?</h3>
                                <img src={plus} alt="img" />
                            </div>
                            <p id="optionClass3" className="dpclass">
                                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta harum totam vero similique id voluptate expedita! Voluptas harum ex ipsam accusantium dicta blanditiis alias, quaerat minus aperiam, aut, modi perspiciatis?.
                            </p>
                        </div>
                        <div className="content8_inner" onClick={() => toggleMenu4()}>
                            <div className="wrapperB">
                                <h3>What kind of information can I encode in these QR codes?</h3>
                                <img src={plus} alt="img" />
                            </div>
                            <p id="optionClass4" className="dpclass">
                                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Possimus assumenda non praesentium explicabo exercitationem numquam laudantium natus, cum enim optio adipisci itaque quidem quis illum modi rem obcaecati dignissimos necessitatibus.
                            </p>
                        </div>



                    </div>

                </div>

                <div className={style.block6}>
                    <div>

                        <img src={grpProfile} />
                        <p className={style.cardB6parahead}>Still have questions?</p>
                        <p className={style.cardB6para}>Can’t find the answer you’re looking for? Please chat to our friendly team.</p>
                        <button>Get in touch</button>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    )
}
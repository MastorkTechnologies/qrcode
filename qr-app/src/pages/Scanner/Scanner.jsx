import style from "./Scanner.module.css"
import shoes from "../../Images/Sporting-Excellence-scanner.png"
import shoescannerbig from "../../Images/Sporting-Excellence-big.png"
import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode.react';
import shortid from 'shortid';
import { firestore,auth } from '../../firebase';
import { doc, getDoc, setDoc,add } from "firebase/firestore";
import ReactGA from "react-ga"
//import { client } from "@gradio/client";

export default function Scanner() {
  const [prompt, setPrompt] = useState("")
  const [negativePrompt, setNegativePrompt] = useState("")
  const [condscale, setcondscale] = useState()
  const [strength, setStrength] = useState()
  const [guidance, setGuidance] = useState()
  const [seed, setSeed] = useState()
  const [result, setresult] = useState()
  const [imageSrc, setImageSrc] = useState()
  const [showitems, setShowItems] = useState(false)
  const [qrCodeUrl, setQRCodeUrl] = useState('');



  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, [])

  useEffect(() => {

    const iframe = document.getElementById('myIframe');
    window.addEventListener('message', (event) => {
      if (event.origin === 'localhost:3000/scanner') {
        // Handle data received from the iframe
        const receivedData = event.data;
        console.log('Received data from iframe:', receivedData);
        setQRCodeUrl(receivedData)
      }
    });
  }, [])





  const [originalUrl, setOriginalUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');


  const generateShortUrl = () => {
    setShowItems(!showitems)
    setShortUrl(`${shortid.generate()}`);

  }
  const handleSaveToFirebase = async () => {
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
          const qrLink = 'hello'; // Replace with QR code link
  
          // Construct the new QR object
          const newQRObject = { baseUrl, shorturl, qrLink };
  
          // Update the 'qr' array or create a new array if it doesn't exist
          const updatedQRArray = userData.qr ? [...userData.qr, newQRObject] : [newQRObject];
  
          // Set the updated 'qr' array back in the Firestore document
          await userDocRef.set({ qr: updatedQRArray }, { merge: true });
  
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
  
  

  const handleprompt = (e) => {
    setPrompt(e.target.value)
  }
  const handlenegativeprompt = (e) => {
    setNegativePrompt(e.target.value)
  }
  const handlecondscale = (e) => {
    setcondscale(e.target.value)
  }
  const handlestrength = (e) => {
    setStrength(e.target.value)
  }
  const handleguidance = (e) => {
    setGuidance(e.target.value)
  }
  const handleseed = (e) => {
    setSeed(e.target.value)
  }




  /*const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const base64String = e.target.result;
        setImageSrc(base64String);
        
      };
      console.log(imageSrc)

      reader.readAsDataURL(file);
    }
  };*/




  /*const convertBase64ToImage = (base64String) => {
    // Check if a valid Base64 string is provided
    if (base64String && base64String.length > 0) {
      // Decode the Base64 string to binary data
      const binaryData = atob(base64String);

      // Create a Blob with the binary data and specify the image type
      const imageType = 'image/png'; // Change to your desired image type
      const blob = new Blob([binaryData], { type: imageType });

      // Create a URL for the Blob
      const imageUrl = URL.createObjectURL(blob);

      setImageSrc(imageUrl);
      console.log("Imagesrc", imageSrc)
    }
  };*/









  return (
    <div className={style.block}>
      <div className={style.left}>
        <div style={{ marginTop: "20%" }} className={style.leftcard}>
          <img src={shoes} />
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
          <div style={{ display: "flex", marginTop: "2%" }}>
            <button className={style.url}>URL</button>
            <button className={style.email}>EMAIL</button>

          </div>
        </div>

        <div className={style.section2}>
          <div className={style.num}>2</div>
          <h3>Style and Theme Your QR  Code</h3>
          <div className={style.allqr}>
            <img src={shoes} />
            <img src={shoes} />
            <img src={shoes} />
            <img src={shoes} />
            <img src={shoes} />
            <img src={shoes} />
            <img src={shoes} />
            <img src={shoes} />
            <img src={shoes} />
            <img src={shoes} />
            <img src={shoes} />
            <img src={shoes} />
            <img src={shoes} />
            <img src={shoes} />
            <img src={shoes} />
            <img src={shoes} />
            <img src={shoes} />
            <img src={shoes} />
          </div>

        </div>

        <iframe id="myIframe"
          src="http://localhost:3000/"  // Use the relative path to your HTML file
          title="Your Iframe"
          width="500"   // Set the desired width
          height="500"
        ></iframe>

       


        <div className="qr-code-container">
          <div className="original-url">
            <label htmlFor="originalUrl">Original URL:</label>
            <input
              type="text"
              id="originalUrl"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
            />
            <button onClick={() => generateShortUrl()}>Generate short url</button>
          </div>
          {showitems > 0 && <div className="short-url">
            <label>Short URL:</label>
            <span>{shortUrl}</span>
          </div>}
          {showitems > 0 && <div className="qr-code">
            <QRCode value={shortUrl} size={128} fgColor="#000" bgColor="#fff" /* onComplete={(dataUri) => setQRCodeUrl(dataUri)}*/ />
          </div>}
          <button onClick={handleSaveToFirebase}>Save</button>
        </div>
      </div>






      {/*<div className={style.section3}>
          <div className={style.num}>3</div>
          <h2>Set parameters</h2>
          <p>Params: The generated QR Code functionality is largely influenced by the parameters detailed below.</p>

          <div className={style.parameter}>
            <div className={style.container}>
              <div className={style.heading}>Prompt</div>
              <input type="text" onChange={handleprompt} />
            </div>
            <div className={style.container}>
              <div className={style.heading}>Negative Prompt</div>
              <input type="text" onChange={handlenegativeprompt} />
            </div>
            <div className={style.container}>
              <div className={style.heading}>Controlnet Conditioning Scale</div>
              <input type="number" onChange={handlecondscale} />
            </div>
            <div className={style.container}>
              <div className={style.heading}>Strength</div>
              <input type="number" onChange={handlestrength} />
            </div>
            <div className={style.container}>
              <div className={style.heading}>Guidance Scale</div>
              <input type="number" onChange={handleguidance} />
            </div>
            <div className={style.container}>
              <div className={style.heading}>Seed</div>
              <input type="number" onChange={handleseed} />
            </div>

          </div>
        </div>
      </div>
  */}
      <div className={style.right}>
        <h2>Nike QR</h2>
        <div className={style.card}>
          <img src={shoescannerbig} />
        </div>
        <button >Generate</button>

      </div>

    </div>
  )
}
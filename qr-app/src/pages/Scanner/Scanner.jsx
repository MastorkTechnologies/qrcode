import style from "./Scanner.module.css"
import React, { useState, useEffect } from 'react'
import shortid from 'shortid';
import { firestore, auth, storage } from '../../firebase';
import ReactGA from "react-ga"
import { Select, Slider } from 'antd';
import { getStorage, ref, uploadString } from 'firebase/storage';
import { Flex, Spin } from 'antd';
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

export default function Scanner() {
  const [prompt, setPrompt] = useState("")
 const navigate=useNavigate()
  const [condscale, setcondscale] = useState(0)
  const [strength, setStrength] = useState(0)
  const [guidance, setGuidance] = useState(0)
  const [seed, setSeed] = useState(0)
  const [result, setresult] = useState()
  const [imageSrc, setImageSrc] = useState()
  const [showitems, setShowItems] = useState(false)
  const [qrCodeUrl, setQRCodeUrl] = useState('');
  const [generateClick, setGenerateClick] = useState(false)
  const [base64, setBase64] = useState('')
  const [spinner, setSpinner] = useState(false)
  const [qrlink, setqrlink] = useState('')
  const [url, setUrl] = useState('')
  const [shortUrl,setShortUrl]=useState(`${shortid.generate()}`)



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







  const handleSaveToFirebase = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = firestore.collection('url').doc(user.uid);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
          const blob = await fetch(base64).then(res => res.blob());
  
        const timestamp = Date.now();
        const filename = `QR-image-${timestamp}.png`;
        const file = new File([blob], filename, { type: 'image/png' });
  
        const localURL = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = localURL;
        link.download = filename; // Set the filename to match the dynamically generated one
        link.click();
  
        const storageRef = storage.ref();
        const imageRef = storageRef.child(`images/${filename}`);
  
        const uploadTask = imageRef.put(file);
  
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Handle progress, if needed
          },
          (error) => {
            console.error('Error uploading the file to Firebase Storage:', error);
            setSpinner(false);
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              console.log('File uploaded to Firebase. Available at:', downloadURL);
              handleSaveSecond(downloadURL)
              
              
            });
          }
        );
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
  const handleSaveSecond=async(downloadurl)=>{
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = firestore.collection('url').doc(user.uid);
        const userDoc = await userDocRef.get();

        if (userDoc.exists) {
    // If the document exists, update the QR array
    const userData = userDoc.data();
    const baseUrl = url; // Replace with actual base URL
    const shorturl = shortUrl; // Replace with generated short URL
    const qrLink = downloadurl; // Replace with QR code link
    const date = new Date(); // Get the current date and time

    const year = date.getFullYear(); // Get the year (e.g., 2023)
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Get the month (adding 1 as months are zero-based, and adding padding zero if needed)
    const day = ('0' + date.getDate()).slice(-2); // Get the day (adding padding zero if needed)

    const dateAdded = `${year}-${month}-${day}`;

    // Construct the new QR object
    const newQRObject = { baseUrl, shorturl, qrLink, dateAdded };

    // Update the 'qr' array or create a new array if it doesn't exist
    const updatedQRArray = userData.qr ? [...userData.qr, newQRObject] : [newQRObject];

    // Set the updated 'qr' array back in the Firestore document
    await userDocRef.set({ qr: updatedQRArray }, { merge: true });

    console.log('QR object added to Firestore');
    navigate("/dashboard")
        }
      }
  }
  catch (error) {
    console.error('Error:', error);
  }
}



  const handleprompt = (e) => {
    setPrompt(e.target.value)
  }
  
  const handleurl = (e) => {
    setUrl(e.target.value)
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

  const handleGenerateCick = async () => {
    setSpinner(true);
    const postData = {
      url: shortUrl,
      prompt: prompt,
      controlnetConditioningScale: condscale,
      strength: strength,
      guidanceScale: guidance,
      seed: 5392011833,
    };
    console.log("postData",postData)
  
    try {
      const response = await fetch('http://localhost:3001', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log("Response String", responseData);
        console.log('Data sent successfully!');
        setBase64(responseData[0]);
        setSpinner(false);
        
      } else {
        console.error('Failed to send data.');
        setSpinner(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setSpinner(false);
    }

  };
  

  {/* const baseintoImage = (data) => {
    console.log("data", data)
    const base64 = data
    const pathToSaveImage = '../../Images/testImage.png'

    const path = converBase64ToImage(base64, pathToSaveImage)

  }*/}









  return (
    <>
      <Navbar />
      <div className={style.block}>
        {/*<div className={style.left}>
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
  </div>*/}
        <div className={style.middle}>
          <div className={style.section1}>
            <div className={style.num}>1</div>
            <h3>Destination of your QR Code</h3>
            <input type={style.text} placeholder="https://" onChange={handleurl} />
          </div>

          <div className={style.section1}>
            <div className={style.num}>2</div>
            <h3>Prompt</h3>
            <input type={style.text} placeholder="Prompt" onChange={handleprompt} />


          </div>

          {/*<div className={style.section2}>
          <div className={style.num}>2</div>
          <h3>Prompt</h3>
          <input type={style.text} placeholder="Enter text" />

          
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
  
          

  </div>*/}
          <div className={style.section3}>
            <div className={style.num}>3</div>
            <h2>Set parameters</h2>
            <p>Params: The generated QR Code functionality is largely influenced by the parameters detailed below.</p>
            <div className={style.contentOuter}>
              <div className={style.divone}>
                <div className={style.condscale}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>Controlnet Conditioning Scale</div>
                    <div className={style.valuestyle} >{condscale}</div>
                  </div>
                  <Slider defaultValue={0}  onChange={(value)=>setcondscale(value)} />
                </div>
                <div className={style.condscale}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>Strength</div>
                    <div className={style.valuestyle} >{strength}</div>
                  </div>
                  <Slider defaultValue={0}  onChange={(value)=>setStrength(value)} />
                </div>
                <div className={style.condscale}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>Guidance Scale</div>
                    <div className={style.valuestyle} >{guidance}</div>
                  </div>
                  <Slider defaultValue={0}  onChange={(value)=>setGuidance(value)} />
                </div>
              </div>
              <div className={style.divtwo}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>Seed</div>
                  <div className={style.valuestyle} >{seed}</div>
                </div>
                <Slider defaultValue={0}  onChange={(value)=>setSeed(value)} />
              </div>
              {/*<div className={style.divthree}>
              <label>Sampler</label><br></br>
              <Select
                defaultValue="DPM++ Karas SDE"
                style={{ width:"100%" }}
                options={[{ value: 'DPM++ Karas SDE', label: 'DPM++ Karas SDE' }]}
              />
            </div>*/}

            </div>
          </div>







          {/*<div className="qr-code-container">
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
            <QRCode value={shortUrl} size={128} fgColor="#000" bgColor="#fff" /* onComplete={(dataUri) => setQRCodeUrl(dataUri)}* />
          </div>}
          <button onClick={handleSaveToFirebase}>Save</button>
        </div>*/}
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
          {spinner === true && <Flex align="center" gap="middle">
            <Spin size="large" />
          </Flex>}
          {spinner === false && base64?.length > 0 && <div className={style.card}>
            <img style={{ width: "54%" }} src={base64} alt="base64 image" />
          </div>
          }

          <button onClick={handleGenerateCick}>Generate
          </button>

          <button onClick={handleSaveToFirebase}>Save</button>

        </div>

      </div>
      <Footer />
    </>

  )
}
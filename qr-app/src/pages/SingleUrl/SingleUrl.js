import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { firestore, auth } from "../../firebase";
import editButton from '../../Images/editButton.png'
import './SingleUrl.css'
import ReactGA from "react-ga4";
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';


const SingleUrl = () => {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const { selectedQR } = location.state;
    const navigate = useNavigate()



    const [editedQR, setEditedQR] = useState(selectedQR || {
        baseUrl: '',
        shorturl: '',
        qrLink: ''
        // Add other fields from the selectedQR as needed
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname });

    }, [window.location.pathname])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedQR({ ...editedQR, [name]: value });
    };

    const handleSaveChanges = async () => {
        try {
            if (user) {
                console.log("user", user)
                console.log("edited QR", editedQR)
                const docRef = firestore.collection('url').doc(user.uid);

                const doc = await docRef.get();
                if (doc.exists) {
                    const data = doc.data();
                    const updatedArray = data.qr.map(item => {
                        if (item.shorturl === selectedQR.shorturl) {
                            return editedQR;
                        }
                        return item;
                    });
                    console.log("updated array", updatedArray)

                    await docRef.update({ qr: updatedArray });
                    console.log('Changes saved to Firestore:', editedQR);
                    navigate('/dashboard')
                } else {
                    console.log('Document not found');
                }
            }
        } catch (error) {
            console.error('Error saving changes:', error);
        }
    };


    return (<>
    <Navbar/>
        <div className='single-outer'>
            <div className='single-headingouter'>
                <h2>Edit QR Details</h2>
            </div>
            <div className='single-contentouter'>
                <div className='single-contentinner'>
                    <div className='wrapperInputBox'>
                        URL
                    <input className='single-input' type="text" name="baseUrl" value={editedQR.baseUrl} onChange={handleInputChange} />
                    </div>
                    <img src={editButton} className='editButton' alt='Edit Image'/>
                </div>
                <img className='qr-image' src={editedQR.qrLink} alt='img'/>
                <button className='save-btn' onClick={handleSaveChanges}>Save Changes</button>
               
                </div>


                
            
            {/*<div className='analytics-outer'>
                <h3 style={{fontSize:"20px",textAlign:"center"}}>Analytics</h3>
                <div className='analytics-container'>
                    <div className='container1'>
                        <div className='innerContainer1'>
                            <div className='wrapper-head'>
                                <h3>Visits</h3>
                                <div className='data-info'>
                                    <div className='data-text'>Day</div>
                                    <div className='data-text'>Week</div>
                                    <div className='data-text'>Month</div>
                                    <div className='data-text'>Year</div>
                                    <div className='data-text'>All Times</div>
                                </div>
                            </div>
                            <div className='data-display'>
                                Hello
                            </div>

                        </div>
                        <div className='innerContainer2'>
                            <div className='inner1'>
                                <h3>Device</h3>
                                <div className='data-display2'>

                                </div>
                            </div>
                            <div className='inner1'>
                                <h3>Browser</h3>
                                <div className='data-display2'>
                                    
                                </div>
                            </div>
                            <div className='inner1'>
                                <h3>OS</h3>
                                <div className='data-display2'>
                                    
                                </div>
                            </div>

                        </div>

                    </div>
                    <div className='container2'>
                        <h3>Location</h3>
                        <div className='data-display3'>

                        </div>

                    </div>

                </div>
            </div>*/}
        </div>
        <Footer/>

        </>
    );
};

export default SingleUrl;

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { firestore, auth } from "../../firebase";
import './SingleUrl.css'
import ReactGA from "react-ga4";


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

    useEffect(()=>{
        ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    
      },[window.location.pathname])

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


    return (
        <div className='single-outer'>
            <div className='single-headingouter'>
                <h2>Edit QR Details</h2>
            </div>
            <div className='single-contentouter'>
                <label>
                    Base URL:
                    <input type="text" name="baseUrl" value={editedQR.baseUrl} onChange={handleInputChange} />
                </label>
                <label>
                    Short URL:
                    <input type="text" name="shorturl" value={editedQR.shorturl}  />
                </label>
                <label>
                    QR Link:
                    <input type="text" name="qrLink" value={editedQR.qrLink} onChange={handleInputChange} />
                </label>
                <button className='save-btn' onClick={handleSaveChanges}>Save Changes</button>
            </div>
        </div>
    );
};

export default SingleUrl;

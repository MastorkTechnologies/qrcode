import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore, auth } from "../../firebase";
import { useLocation } from 'react-router-dom';
import ReactGA from "react-ga4";
import './Dashboard.css'
import img1 from '../../Images/Sporting-Excellence-big.png'
import deleteIcon from "../../Images/deleteIcon.png"
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const Dashboard = () => {
    const [list, setList] = useState([]);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const getData = async (user) => {
        try {
            if (user) {
                const userDocRef = firestore.collection('url').doc(user.uid);
                const userDoc = await userDocRef.get();

                if (userDoc.exists) {
                    const userData = userDoc.data();
                    setList(userData.qr || []);
                }
            }
        } catch (error) {
            console.error('Error getting data:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                getData(user); // Get data after user is set
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        try {
            if (user) {
                const updatedList = list.filter(item => item.shorturl !== id); // Filter out the item to delete
                console.log("updatedlist", updatedList)
                const userDocRef = firestore.collection('url').doc(user.uid);
                await userDocRef.update({ qr: updatedList }); // Update the 'qr' array in Firestore
                setList(updatedList); // Update local state with the updated list
            }
        } catch (error) {
            console.error('Error deleting QR:', error);
        }
    };

    const handleEdit = async (id) => {
        const selectedQR = list.find(item => item.shorturl === id);
        if (selectedQR) {
            navigate(`/url/${user.uid}`, { state: { selectedQR } });
        }
    };
    const handleBoxClick = (val) => {
        ReactGA.send({ hitType: "pageview", page: val.shorturl });
        navigate(`/${val.shorturl}`)

        /* const absoluteURL = val.baseUrl.includes('http') ? val.baseUrl : `http://${val.baseUrl}`;
         window.open(absoluteURL, '_blank');*/
    }





    return (
        <>
        <Navbar/>
        <div className="dash-mainouter">
            <div className="dash-outer">
                <div className="dash-div1">
                    <div className="dash-heading">My QR Codes</div>
                    <div className="create-btn" onClick={()=>navigate("/scanner")}>Create new QR</div>

                </div>
                <div className="dash-div2">
                    {
                        list?.map((val, index) => (
                            <div key={index} className="innermain">
                                <img src={val.qrLink} alt="img" className="image" />
                                <div  onClick={() => handleBoxClick(val)} className="dash-listitem">{val.baseUrl}</div>
                                <div onClick={() => handleEdit(val.shorturl)} className="dash-listitem">Edit</div>
                                <div className="wrapperTD">
                                    <div className="date">{val?.dateAdded}</div>
                                    <div onClick={() => handleDelete(val.shorturl)} className="deleteIcon" ><img src={deleteIcon} alt="img"/></div>
                                </div>
                            </div>
                        ))
                    }

                </div>
            </div>
        </div>
        <Footer/>
        </>
    );
};

export default Dashboard;
/* <div className="dash-contentouter">
                
            </div>
            */

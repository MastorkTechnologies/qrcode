import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login/Login";
import Scanner from "./pages/Scanner/Scanner";
import SignUp from "./pages/SignUp/SignUp";
import ReactGA from "react-ga4";
import Dashboard from "./pages/Dashboard/Dashboard";
import SingleUrl from "./pages/SingleUrl/SingleUrl";
import { firestore, auth } from "./firebase";
import { useEffect,useState } from "react";

const track="G-LXVQ7339SV"
ReactGA.initialize(track);

const RedirectPage = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [selectedShortUrl, setSelectedShortUrl] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user && user.uid) {
      async function fetchData() {
        const docRef = firestore.collection('url').doc(user.uid);
        const doc = await docRef.get();

        if (doc.exists) {
          const userData = doc.data();
          const qrArray = userData.qr || [];
          console.log("location",location.pathname.substring(1))

          // Find the object with the selected shorturl
          const selectedQR = qrArray.find(item => item.shorturl === location.pathname.substring(1));

          if (selectedQR) {
            const absoluteURL = selectedQR.baseUrl.includes('http') ? selectedQR.baseUrl : `http://${selectedQR.baseUrl}`;
            window.location.replace(absoluteURL);
          } else {
            console.error('Original URL not found for the given short URL');
          }
        }
      }

      fetchData();
    }
  }, [user, location.pathname]);

  return <div>Redirecting...</div>;
};

function App() {
  useEffect(()=>{
    ReactGA.send({ hitType: "pageview", page: window.location.pathname });

  },[window.location.pathname])
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/scanner" element={<Scanner />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/url/:id" element={<SingleUrl />} />
      <Route path="/:id" element={<RedirectPage/>}/>
    </Routes>
  );
}

export default App;

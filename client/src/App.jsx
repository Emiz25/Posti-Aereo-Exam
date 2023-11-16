import {Navbar, Nav, Col, Container, Row, Button, Form, FormControl, Table, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import React from 'react';
import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import { Main } from './components/Homecomponents';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeRoute from './components/Homeroute';
import LogInRoute from './components/Loginroute';
import HomeLoggedRoute from './components/Homeloggedroute';
import BookedFlightsRoute from './components/Bookedflightsroute';
import NotFoundPage from './components/NotFoundPage';

import API from './API';
import './App.css'


const URL = 'http://localhost:3001/api';


function App() {

  const vettore = {
    seats: [
      { placeID: 0, row: 0, position: "", occupied: 0, userID: 0, flightID: 0 }
    ],
    totalSeats: 0,
    occupiedSeats: 0
  };

  const [seats, setSeats] = useState(vettore);
  const [tipoAereo, selezionaAereo]= useState();
  const [contatore, setContatore] = useState(0);
  const [fetchTerminata, setFetchTerminata] = useState(false);
  const [tipoVisualizzazione, setTipoVisualizzazione] = useState("inizio");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(undefined);
  const [pEffettuate, setpEffettuate] = useState(vettore);

  useEffect(() => {

if(tipoVisualizzazione === "local") { 

    API.showLocal()
      .then((q) => {
        setSeats(q);
        setFetchTerminata(true);



      })
  } else if(tipoVisualizzazione == "regional"){

    API.showRegional()
    .then((q) => {
      setSeats(q);
      setFetchTerminata(true);



    })

  }else if(tipoVisualizzazione == "international"){

    API.showInternational()
    .then((q) => {
      setSeats(q);
      setFetchTerminata(true);



    })

  }else if(tipoVisualizzazione == "inizio"){

    setTimeout(function() {
      console.log("Caricamento..");
      setFetchTerminata(true);
    }, 1500);


  }else if(tipoVisualizzazione == "loggato"){

    setSeats(vettore);
  
    API.showMyFlights()
    .then((q) => {
      setpEffettuate(q);
      setFetchTerminata(true);



    })


  }

  }, [tipoVisualizzazione]);

  const mostraLocal = () => {
    setTipoVisualizzazione("local"); 
  }
  const mostraRegional = () => {
    setTipoVisualizzazione("regional"); 
  }

  const mostraInternational = () => {
    setTipoVisualizzazione("international"); 
  }

  const mostraCasuale = (contatore, selectedOption) => {

    setContatore(contatore);
    selezionaAereo(selectedOption);
    setTipoVisualizzazione("casuale"); 

  }

  const mostraLoggato = () => {

    setTipoVisualizzazione("loggato"); 
  

  }

  
  const logSuccessfull = (user) =>{

    
    setUser(user);
    setLoggedIn(true);

  



  }

  const LogOut = async () => {

    setSeats(vettore);
    await API.logOut();
    setLoggedIn(false);
    setUser(undefined);

  }

  useEffect(()=> {
    const checkAuth = async() => {
      try {
        // here you have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch(err) {

      }
    };

    checkAuth();

  }, []);


      if (fetchTerminata) {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<NotFoundPage/>}/>
            <Route path='/' element={loggedIn? <Navigate replace to='/HomeUserLogged' />:<HomeRoute user={user} seats={seats} mostraLocal={mostraLocal} mostraRegional={mostraRegional} mostraInternational={mostraInternational} />} />
            <Route path='/HomeUserLogged' element={!loggedIn? <Navigate replace to='/login' />: <HomeLoggedRoute logOut = {LogOut} loggedin = {loggedIn} user={user} seats={seats} mostraLocal={mostraLocal} mostraRegional={mostraRegional} mostraInternational={mostraInternational} 
            pEffettuate={pEffettuate} mostraCasuale={mostraCasuale} mostraLoggato = {mostraLoggato} contatore={contatore} setSeats={setSeats}/>} />
            <Route path='/login' element={loggedIn? <Navigate replace to='/' />:  <LogInRoute logSuccessfull={logSuccessfull}/>} />
            <Route path='/BookedFlights' element={!loggedIn? <Navigate replace to='/login' />: <BookedFlightsRoute logOut = {LogOut} loggedin = {loggedIn} user={user} seats={seats} setpEffettuate={setpEffettuate}/>} />
          </Routes>

        </BrowserRouter>
      )
    }else {

      //si potrebbe anche fare all'interno del codice

      return (
        <>
          <Navbar.Brand style={{ fontSize: "80px" }} href="/">PostiAereo.com</Navbar.Brand>
          {!fetchTerminata && <div> <Spinner className='m-2' animation="border" role="status" />
          </div>}
        </>);

    }
}


export default App

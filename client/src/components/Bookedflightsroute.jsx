import React from 'react';
import MyHeader from './Navbarcomponents';
import Booked from './Bookedflightscomponents';
import {Container} from 'react-bootstrap';
import { useState, useEffect } from 'react';




function BookedFlightsRoute(props) {

    

    return(
   
        <Container fluid>
          <MyHeader loggedin = {props.loggedin} logOut = {props.logOut} user={props.user} logSuccessfull={props.logSuccessfull}/>
          <Booked user={props.user} seats = {props.seats} setpEffettuate={props.setpEffettuate}/>
        </Container>
      
      );

    
}

export default BookedFlightsRoute;
import React from 'react';
import MyHeader from './Navbarcomponents';
import {Main} from './Homeloggedcomponents';
import {Container} from 'react-bootstrap';


function HomeLoggedRoute(props) {

    
    return(
   
        <Container fluid>
          <MyHeader loggedin = {props.loggedin} logOut = {props.logOut} user={props.user} logSuccessfull={props.logSuccessfull}/>
          <Main user={props.user} seats = {props.seats} mostraLocal={props.mostraLocal} mostraRegional={props.mostraRegional} 
          pEffettuate={props.pEffettuate} mostraInternational={props.mostraInternational} mostraCasuale = {props.mostraCasuale} contatore={props.contatore} 
          setSeats={props.setSeats} mostraLoggato={props.mostraLoggato}/>
        </Container>
      
      );
}

export default HomeLoggedRoute;
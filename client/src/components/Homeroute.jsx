import React from 'react';
import MyHeader from './Navbarcomponents';
import {Main} from './Homecomponents';
import {Container} from 'react-bootstrap';


function HomeRoute(props) {

    
    return(
   
        <Container fluid>
          <MyHeader user={props.user} logSuccessfull={props.logSuccessfull}/>
          <Main seats = {props.seats} mostraLocal={props.mostraLocal} mostraRegional={props.mostraRegional} mostraInternational={props.mostraInternational}/>
        </Container>
      
      );
}

export default HomeRoute;
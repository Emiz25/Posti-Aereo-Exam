import React from 'react';
import { useState, useEffect } from 'react';
import { Navbar, Button, Form, Table, Alert, FormGroup } from 'react-bootstrap';
import { Link, useNavigate, useParams} from 'react-router-dom';
import API from '../API';




function LogInRoute(props) {

    const [errorMsg, setErrorMsg] = useState('');
    const [username, setUsername] = useState('Luigi11');
    const [password, setPassword] = useState('luigi');
    const navigate = useNavigate();


    async function loggati(e){
 
          try {
            const user = await API.logIn(e);  
            setErrorMsg('');
            props.logSuccessfull(user);
            navigate("/HomeUserLogged");
          } catch(err) {
            setErrorMsg('Email o/e password errata/i');
            console.log(err);
          }
      }


      function handleSubmit(event) {
        event.preventDefault();
        let valid = true;
        const e = { username, password };

    
        // Form validation
        if (username === '' && password != ''){
            setErrorMsg('Campo username vuoto!');
            valid = false;
        }else if (password == '' && username !='') {
            setErrorMsg('Campo password vuoto!');
            valid = false;
    
        }else if (username=='' && password == '') {
            setErrorMsg('Campi vuoti, inserisci dei valori!');
            valid = false;
    
        }
        if(valid)
        {
          
          loggati(e);
        } else {
     
          console.log("Errore");
        }


          
                          
          
        }
    
        
    return (
        <>
         <Navbar.Brand style={{ fontSize: "40px" }}>PostiAereo.com</Navbar.Brand>
         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-airplane-fill" viewBox="0 0 20 20 " style={{ marginBottom: "10px",  marginLeft: "20px" }} >
          <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Z" />
        </svg>
        {errorMsg? <Alert variant='danger' onClose={()=>setErrorMsg('')} dismissible>{errorMsg}</Alert> : false }
        <Form onSubmit={handleSubmit}>

        <Form.Group>
                <Form.Label>Username  </Form.Label>
                <Form.Control style={{paddingRight: "120px"}}type="text" placeholder="Username" name="username" value={username} onChange={ev => setUsername(ev.target.value)} />
            </Form.Group>
         

        <Form.Group controlId="formBasicPassword"  >
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
    
   
            <Button type='submit' variant="primary" style={{marginTop: "10px"}}>Login</Button>
            <Link to='/'>
            <Button variant='warning' style={{marginTop: "10px"}}  onClick={()=>navigate('/')}>Cancel</Button>
            </Link>

            </Form>
        </>
    );

        
}




export default LogInRoute;
import { Nav, Navbar, Button, Form, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MyHeader(props) {
    
    const [testo, setTesto] = useState('');
    const navigate = useNavigate();
    const name = props.user && props.user.name;
    const loggedIn = props.loggedin;

    
    return (
      <Navbar style={{ display: "flex", flexDirection: "row" }} bg="light" expand="lg" fixed="top">
        <Navbar.Brand style={{ fontSize: "30px", paddingLeft: "10px", marginLeft:'20px' }} href="/">PostiAereo.com</Navbar.Brand>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-airplane-fill" viewBox="0 0 20 20 " style={{ marginTop: "10px",  marginRight: "40px" }} >
          <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Z" />
        </svg>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" style={{marginLeft:'auto'}}>

        <Nav className="ml-auto">

            {loggedIn && (
              <>
                <Nav.Link style={{fontSize: '20px', marginRight: '30px'}} as={Link} to="/HomeUserLogged">Home</Nav.Link>
                <Nav.Link style={{fontSize: '20px'}} as={Link} to="/BookedFlights">Prenotazioni</Nav.Link>
              </>
            )}
        
          { loggedIn? <>
                    <Navbar.Text className='fs-5' style={{marginLeft:'100vh'}}>
                        {"Benvenuto: "+name}
                    </Navbar.Text>
            <Button className='mx-2' variant='danger' onClick={() => {
             
              navigate('/login');
              props.logOut();
            }}>Logout</Button>
                    </> : 
                    <Button className='mx-2' variant='warning' style={{marginLeft:'auto'}} onClick={()=> navigate('/login')}>Login</Button> }
                       </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
}

export default MyHeader;

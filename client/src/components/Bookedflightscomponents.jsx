import React from 'react';
import API from '../API';
import { useState, useEffect } from 'react';
import { Navbar, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BookedFlightsRoute from './Bookedflightsroute';
import { FaTrash } from 'react-icons/fa';

function Booked(props) {
  const [item, setItems] = useState([]);
  const [fetchTerminata, setFetchTerminata] = useState(false);

  useEffect(() => {
    API.showMyFlights().then((q) => {
      setItems(q);
      setFetchTerminata(true);
    });
  }, []);

  const getNomeVolo = (flightID) => {
    switch (flightID) {
      case 1:
        return 'Locale';
      case 2:
        return 'Regionale';
      case 3:
        return 'Internazionale';
    }
  };

  const getNumeroVolo = (flightName) => {
    switch (flightName) {
      case 'Locale':
        return 1;
      case 'Regionale':
        return 2;
      case 'Internazionale':
        return 3;
    }
  };

  if (fetchTerminata) {
    // Raggruppa gli elementi per tipologia di volo
    /*Regionale: Array(3), Internazionale: Array(1)}
Internazionale
: 
[{…}]
Regionale
: 
(3) [{…}, {…}, {…}]
[[Prototype]]
: 
Object */
    const groupedItems = item.reduce((acc, flight) => {
      const flightType = getNomeVolo(flight.flightID);
      if (!acc[flightType]) {
        acc[flightType] = [];
      }
      acc[flightType].push(flight);
      return acc;
    }, {});

    console.log(groupedItems);

    return (
      <div>
        <h1 style={{marginBottom: '20px', marginTop: '40px'}}>Le mie prenotazioni</h1>
        {Object.entries(groupedItems).map(([flightType, flights]) => (
          <div key={flightType} >
            <div className="d-flex align-items-center justify-content-center" >
            <h2>{flightType}</h2>
            <Button
              variant="danger"
              style={{ fontSize: '12px', padding: '5px 10px', marginLeft: '10px' }}
              onClick={() =>
                API.editSeats(0, getNumeroVolo(flightType), 0).then((q) => {
                  setItems(item.filter((seat) => seat.flightID !== getNumeroVolo(flightType)));
                  props.setpEffettuate(item.filter((seat) => seat.flightID !== getNumeroVolo(flightType)));
                })
              }
            >
              <FaTrash style={{ color: 'red' }} />
            </Button>
            </div>
            <table className="table" style={{ width: '90%', fontSize: '24px' }}>
              <thead className="thead-dark">
                <tr>
                  <th scope="col">Posto</th>
                  <th scope="col">Volo</th>
                  
                </tr>
              </thead>
              <tbody>
                {flights.map((flight, index) => (
                  <tr key={index}>
                    <td>
                      {flight.row}-{flight.position}
                    </td>
                    <td>{getNomeVolo(flight.flightID)}</td>
                    <td>
                
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        <Link to="/HomeUserLogged">
          <span
            style={{
              textDecoration: 'underline',
              color: 'black',
              cursor: 'pointer',
              marginBottom: '10px',
              marginTop: '100px',
            }}
          >
            Clicca qui per tornare alla home
          </span>
        </Link>
      </div>
    );
  } else {
    return (
      <>
        <Navbar.Brand style={{ fontSize: '80px' }} href="/">
          PostiAereo.com
        </Navbar.Brand>
        {!fetchTerminata && (
          <div>
            {' '}
            <Spinner className="m-2" animation="border" role="status" />
          </div>
        )}
      </>
    );
  }
}

export default Booked;
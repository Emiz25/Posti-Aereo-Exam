import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaChair } from 'react-icons/fa';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import API from '../API';
import { useEffect } from 'react';

function Seats(props) {
  const seats = props.seats;


   const renderSeats = () => {
    const rows = Math.max(...seats.seats.map((seat) => seat.row));

    const seatRows = [];
    for (let i = 1; i <= rows; i++) {
      const rowSeats = seats.seats.filter((seat) => seat.row === i);
      seatRows.push(
        <tr key={`row-${i}`}>
          {rowSeats.map((seat) => (
            <td
              key={`row-${seat.row}-col-${seat.position}`}
              style={{ backgroundColor: seat.occupied === 1 ? "red" : "inherit" }}
              className="seat"
            >
              <FaChair className="airplane-seat-icon" />
              <p>{`${seat.row}-${seat.position}`}</p>
            </td>
          ))}
        </tr>
      );
    }

    return seatRows;
  };

  return (
    <Table striped bordered>
      <tbody>{renderSeats()}</tbody>
    </Table>
  );
}

function Main(props) {
  return (
    <>
      <h3 style={{marginBottom: '10px', marginTop:'15%'}} >Benvenuto, ci sono 3 aerei disponibili...</h3>
      <div >
        
          <Button style={{marginRight: '10px'}}variant="primary" onClick={props.mostraLocal}>
            Locale
          </Button>
        
        
          <Button style={{marginRight: '10px'}} variant="primary" onClick={props.mostraRegional}>
            Regionale
          </Button>
      
      
          <Button variant="primary" onClick={props.mostraInternational}>
            Internazionale
          </Button>
    
      </div>
      <div>
        {props.seats.totalSeats !== 0 ? (
          <p style={{ marginTop: "25px" }}>
            {`Posti Occupati - ${props.seats.occupiedSeats} - Posti Totali - ${props.seats.totalSeats}`}
          </p>
        ) : (
          <h6 style={{ marginTop: "25px" }}>Seleziona un aereo.</h6>
        )}
      </div>
      <Seats seats={props.seats} />
    </>
  );
}

export { Seats, Main };
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Button, Table,Form, Alert } from 'react-bootstrap';
import Carrello from './Carrello';
import { Link } from 'react-router-dom';
import { FaChair } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import API from '../API';

/*Nell'esempio sopra, abbiamo aggiunto uno stato selectedSeats utilizzando il metodo useState. 
Questo stato conterrà l'elenco dei sedili selezionati. Quando un sedile viene cliccato, 
la funzione handleSeatClick viene chiamata con il sedile corrispondente come argomento. 
La funzione verifica se il sedile è già stato selezionato o meno e lo gestisce di conseguenza, 
aggiungendo o rimuovendo il sedile dall'array selectedSeats.

Nel rendering dei sedili, viene anche aggiunta una classe CSS "selected" al sedile se è presente nell'array selectedSeats, 
in modo da poter applicare uno stile visivo alla selezione.

Questo è solo un esempio di come gestire la selezione dei sedili e memorizzarli nello stato in React. 
Puoi adattarlo ulteriormente in base alle tue esigenze specifiche, ad esempio per implementare la logica del carrello. */


function Seats(props) {

  const seats = props.seats;
  const selectedSeats = props.selectedSeats;
  const setSelectedSeats = props.setSelectedSeats;
  const items = props.items;
  const setItems = props.setItems;
  const carrelloVisibile = props.carrelloVisibile;
  const setCarrelloVisibile = props.setCarrelloVisibile;
  const user = props.user;

 


  const handleSeatClick = (seat) => {



    // Verifica se il sedile è già selezionato
    const isSelected = selectedSeats.some(
      (selectedSeat) =>
        selectedSeat.row === seat.row && selectedSeat.position === seat.position
    );


    if (isSelected) {
      // Rimuovi il sedile dalla selezione
      const updatedSeats = selectedSeats.filter(
        (selectedSeat) =>
          selectedSeat.row !== seat.row ||
          selectedSeat.position !== seat.position
      );
      setSelectedSeats(updatedSeats);
      setItems(updatedSeats);
      
      
    } else {
      // Aggiungi il sedile alla selezione
      setSelectedSeats([...selectedSeats, seat]);
      
    }

  };

   const renderSeats = () => {
    const rows = Math.max(...seats.seats.map((seat) => seat.row));

    const seatRows = [];
    for (let i = 1; i <= rows; i++) {
      const rowSeats = seats.seats.filter((seat) => seat.row === i);
      seatRows.push(
        <tr key={`row-${i}`}>
          {rowSeats.map((seat) => (
            <td   style={{
                backgroundColor: selectedSeats.some(
                  (selectedSeat) =>
                    selectedSeat.row === seat.row &&
                    selectedSeat.position === seat.position
                ) 
                ? "yellow"
                : seat.occupied === 1
                ? "red"
                : ""
                  
                  
              }} key={`row-${seat.row}-col-${seat.position}`} className={`seat${
                selectedSeats.some(
                  (selectedSeat) =>
                    selectedSeat.row === seat.row &&
                    selectedSeat.position === seat.position
                )
                  ? "selected"
                  : ""
                  
              }`}
              onClick={() => {
                if (seat.occupied === 1) {
                  return null; 
                }
                handleSeatClick(seat);
              }}
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
    <div>
    <Table striped bordered>
      <tbody>{renderSeats()}</tbody>
    </Table>
    
    <Carrello seats={seats} setSelectedSeats ={setSelectedSeats}  user={user} setCarrelloVisibile={setCarrelloVisibile} 
    carrelloVisibile={carrelloVisibile} setItems={setItems} items ={items} selectedSeats={selectedSeats}/>
  </div>
    
  );
}

function Main(props) {

  //mi serve per chiudere i posti se aperti prima da parte di un utente non loggato

  useEffect(() => {
    props.mostraLoggato();
  }, []);


  const [selectedSeats, setSelectedSeats] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [items, setItems] = useState([]);
  const [carrelloVisibile, setCarrelloVisibile] = useState(false);
  const [number, setNumber] = useState(0);
  const [selectedOption, setCheckedItems] = useState(null);
  const [mostra, setMostra] = useState(false);
  const [occupati, setOccupati] = useState(0);
  const [totali, setTotali] = useState(0);
  


  function fetchData(value) {
    if (value === "1") {
      API.showLocal()
        .then(function(q) {
          console.log(q);
          setOccupati(q.occupiedSeats);
          setTotali(q.totalSeats);
          setMostra(true);
        })
        .catch(function(error) {
          console.log(error);
        });
    } else if (value === "2") {
      API.showRegional()
        .then(function(q) {
          console.log(q);
          setOccupati(q.occupiedSeats);
          setTotali(q.totalSeats);
          setMostra(true);
        })
        .catch(function(error) {
          console.log(error);
        });
    } else if (value === "3") {
      API.showInternational()
        .then(function(q) {
          console.log(q);
          setOccupati(q.occupiedSeats);
          setTotali(q.totalSeats);
          setMostra(true);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  }

  const handleOptionChange = (event) => {
    setCheckedItems(event.target.value);
    
  };

  function checkBotton(prenotazioni, valore) {

    for(let i=0; i< prenotazioni.length; i++){

      if(prenotazioni[i].flightID == valore){

        return true;

      }


    }

    
   }

  

  function handleSubmit(event) {
    event.preventDefault();
    
    API.bookCasual(number, selectedOption, occupati)
    .then((q) => {
      setItems(q);
      setSelectedSeats(q);
      console.log(q);
      setCarrelloVisibile(true);



    }).catch((error) => {

      console.log(error);
      setErrorMsg(error.errors[0].msg);
    });

    
   }


  return (
    <>
      <div style={{ background: "#f2f2f2", borderRadius: "5px", marginTop: '25%' , padding: '5px'}}>
      <h6 style={{ marginTop: "5px" }}>Prenotazione Manuale: Clicca uno dei tre aerei</h6>
      <div  >
        
        <Button disabled={checkBotton(props.pEffettuate, 1)} variant="primary" style={{margin: '10px'}} onClick={() => {
          props.mostraLocal();
          setSelectedSeats([]);
          setItems([]);
          setCarrelloVisibile(false);
        }}>
            Locale
          </Button>
        
        
        <Button disabled={checkBotton(props.pEffettuate, 2)} variant="primary" style={{margin: '10px'}} onClick={() => {
          props.mostraRegional();
          setSelectedSeats([]);
          setItems([]);
          setCarrelloVisibile(false);
          
        }}>
            Regionale
          </Button>
      
      
        <Button disabled={checkBotton(props.pEffettuate, 3)} variant="primary" style={{margin: '10px'}} onClick={() => {
          props.mostraInternational();
          setSelectedSeats([]);
          setItems([]);
          setCarrelloVisibile(false);
        }}>
            Internazionale
          </Button>


    
      </div>
      </div>

      <div>
      {errorMsg ? <Alert style={{marginTop: '20px'}}variant='danger' onClose={()=>setErrorMsg('')} dismissible>{errorMsg}</Alert> : false }
        {props.seats.totalSeats !== 0  ? (
          <p style={{ marginTop: "25px" }}>
            {`Posti Occupati - ${props.seats.occupiedSeats} - Posti Totali - ${props.seats.totalSeats} - Posti Richiesti -${selectedSeats.length}-`}
          </p>
        ) : (
          
          <div style={{ background: "#f2f2f2", borderRadius: "5px" }}>
              {mostra && (
                <p style={{ marginTop: "25px" }}>
                  {`Posti Occupati - ${occupati} - Posti Totali - ${totali} - Posti Richiesti -${number}-`}
                </p>
              )}
          <h6 style={{ marginTop: "25px" , padding: '5px'}}>Prenotazione Automatica: Inserisci il numero di posti</h6>
          <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Numero posti</Form.Label>
        <Form.Control
          type="number"
          name="seats"
          value={number}
          onChange={(ev) => setNumber(ev.target.value)}
          style={{ width: '20%', marginLeft: '40%' }}
        />
      </Form.Group>

      <Form.Group>
        <Form.Label>Scegli un tipo di volo:</Form.Label>
        <div>
          <label onClick={() => fetchData("1")}>
            <input
              type="radio"
              name="option"
              value="1"
              checked={selectedOption === '1'}
              onChange={handleOptionChange}
              disabled={checkBotton(props.pEffettuate, 1)}
            />
            Locale
          </label>
        </div>
        <div>
          <label onClick={() => fetchData("2")}>
            <input
              type="radio"
              name="option"
              value="2"
              checked={selectedOption === '2'}
              onChange={handleOptionChange}
              disabled={checkBotton(props.pEffettuate, 2)}
            />
            Regionale
          </label>
        </div>
        <div>
          <label onClick={() => fetchData("3")}>
            <input
              type="radio"
              name="option"
              value="3"
              checked={selectedOption === '3'}
              onChange={handleOptionChange}
              disabled={checkBotton(props.pEffettuate, 3)}
            />
            Internationale
          </label>
        </div>
      </Form.Group>

                <Button variant="primary" disabled={number === 0 || !selectedOption} style={{ marginTop: '10px', marginBottom: '10px' }} onClick={handleSubmit}>
                  Aggiorna Carrello
                </Button>
    </Form>
      
            
          </div>
        )}
      </div>
      <Seats mostraLoggato={props.mostraLoggato} user={props.user} 
      setCarrelloVisibile={setCarrelloVisibile} carrelloVisibile={carrelloVisibile} setItems={setItems} 
      items ={items} seats={props.seats} selectedSeats={selectedSeats} setSelectedSeats={setSelectedSeats} setSeats={props.setSeats}/>

    </>
  );
  
}

export { Seats, Main };
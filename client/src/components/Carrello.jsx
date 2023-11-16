import { Button } from 'react-bootstrap';
import { FaShoppingCart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../API';

function Carrello(props){

 
  const [bottoneVisibile, setBottoneVisibile] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
  const items = props.items;
  const setItems = props.setItems;
  const carrelloVisibile = props.carrelloVisibile;
  const setCarrelloVisibile = props.setCarrelloVisibile;
  const selectedSeats = props.selectedSeats;
  const setSelectedSeats = props.setSelectedSeats;
  const seats= props.seats;



  const getNomeVolo = (flightID) => {

    switch (flightID) {
        case 1:
          // Fai qualcosa per il caso 1
          return "Locale";
       
        case 2:

          return "Regionale";

        case 3:
    
          return "Internazionale";
   
      }


  }

  const aggiungiAlCarrello = () => {
    const nuoviElementi = [...items];
  for (const seat of props.selectedSeats) {
    const duplicato = nuoviElementi.find(item =>
      item.row === seat.row &&
      item.position === seat.position &&
      item.flightID === seat.flightID
    );
    if (!duplicato) {
      nuoviElementi.push(seat);

    }
  }
  setItems(nuoviElementi);
  setBottoneVisibile(true);
  };

  useEffect(() => {
    if (props.selectedSeats.length > 0) {
      aggiungiAlCarrello();
      setBottoneVisibile(true);
    
    }
  }, [props.selectedSeats]);

  const mostraNascondiCarrello = () => {
    setCarrelloVisibile(!carrelloVisibile);
  };

  async function Acquista() {

    let contatore = 0;
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 5000);

    try {
      await API.editSeats(1,props.selectedSeats, 1);
      navigate("/BookedFlights");
    } catch (error) {
      console.log("errore durante l'aggiornamento dei posti", error);
      const updatedSeats = selectedSeats.filter((selectedSeat) => {
/*{"error":[{"placeID":1,"rowCount":0},{"placeID":2,"rowCount":1}]} */
      
        return !items.some((item) => {
          if (
            selectedSeat.row === item.row &&
            selectedSeat.position === item.position
          ) {
            // Imposta il parametro "occupied" a 1 del sedile di "seats"
            const seatToUpdate = seats.seats.find(
              (seat) =>
                seat.row === selectedSeat.row &&
                seat.position === selectedSeat.position
            );
           
         

              for (let i = 0; i < error.error.length; i++) {
                
                if (error.error[i].placeID === seatToUpdate.placeID && error.error[i].rowCount === 0) {
                  seatToUpdate.occupied = 1;
                  contatore++;
                  console.log("Dentro", seatToUpdate);
                }
              }
            return true;
          }
          return false;
        });
      });

      seats.occupiedSeats =seats.occupiedSeats+ contatore;
      setSelectedSeats(updatedSeats);
      setItems([]);
      setShowMessage(true);

   
    }
  }


  return (
    <div>
          <h2>
              <FaShoppingCart style={{ marginRight: "10px", marginBottom: "8px"}} />
              Carrello
          </h2>
      <button disabled={!bottoneVisibile } onClick={mostraNascondiCarrello}>
        {carrelloVisibile ? 'Nascondi carrello' : 'Acquista'}
      </button>
      {carrelloVisibile && (
        <div>
          {items.map((item, index) => (
            <div style={{marginTop: '10px'}} key={index}>
              Posto: {item.row}-{item.position}, Volo = {getNomeVolo(item.flightID)}
            </div>
          ))}
          <div>
          {showMessage && <h3>Posti già occupati da un altro utente!</h3>}
        </div>
        <Button style={{marginTop: '10px'}}disabled={items.length === 0} onClick={Acquista}>Procedi all'acquisto!</Button>
        </div>
        
      )}
    </div>
  );
};


export default Carrello;
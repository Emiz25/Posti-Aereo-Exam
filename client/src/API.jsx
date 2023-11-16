

const apiurl = 'http://localhost:3001/api/';
async function showLocal() {
  const response = await fetch(new URL("locseats", apiurl));
  const data = await response.json();
  if (response.ok) {
    const { seats, totalSeats, occupiedSeats } = data;

    if (Array.isArray(seats)) {
      const mappedSeats = seats.map((e) => ({
        placeID: e.placeID,
        row: e.row,
        position: e.position,
        occupied: e.occupied,
        userID: e.userID,
        flightID: e.flightID,
      }));

      return {
        seats: mappedSeats,
        totalSeats: totalSeats,
        occupiedSeats: occupiedSeats,
      };
    } else {
      throw new Error("La risposta non contiene un array di posti.");
    }
  } else {
    throw data;
  }
}

  async function showRegional(){

    const response = await fetch(new URL("regseats",apiurl));
    const data = await response.json();
    if (response.ok) {
      const { seats, totalSeats, occupiedSeats } = data;
  
      if (Array.isArray(seats)) {
        const mappedSeats = seats.map((e) => ({
          placeID: e.placeID,
          row: e.row,
          position: e.position,
          occupied: e.occupied,
          userID: e.userID,
          flightID: e.flightID,
        }));
  
        return {
          seats: mappedSeats,
          totalSeats: totalSeats,
          occupiedSeats: occupiedSeats,
        };
      } else {
        throw new Error("La risposta non contiene un array di posti.");
      }
    } else {
      throw data;
    }
  }
  
  async function showInternational(){

    const response = await fetch(new URL("intseats",apiurl));
    const data = await response.json();
    if (response.ok) {
      const { seats, totalSeats, occupiedSeats } = data;
  
      if (Array.isArray(seats)) {
        const mappedSeats = seats.map((e) => ({
          placeID: e.placeID,
          row: e.row,
          position: e.position,
          occupied: e.occupied,
          userID: e.userID,
          flightID: e.flightID,
        }));
  
        return {
          seats: mappedSeats,
          totalSeats: totalSeats,
          occupiedSeats: occupiedSeats,
        };
      } else {
        throw new Error("La risposta non contiene un array di posti.");
      }
    } else {
      throw data;
    }
  }
  
  async function editSeats(tipologia, selectedSeat, occupied) { 
    
//tipologia 0 = elimina, 1 aggiungi

    const requestOptions = {
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' }, 
      credentials: 'include',
      body: JSON.stringify({tipologia,selectedSeat, occupied }) 
    };
  
    const response = await fetch(apiurl + "edit/",requestOptions);
    const seats = await response.json();
    if (response.ok) {
  
      console.log(response);
  
    }else{
  
      //throw new Error(JSON.stringify(seats));
      throw seats;
    }

}

async function bookCasual(contatore, tipoAereo, pOccupati) {

  const requestOptions = {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' }, 
    credentials: 'include',
    body: JSON.stringify({contatore, tipoAereo, pOccupati }) 
  };

  const response = await fetch(apiurl + "casual/", requestOptions);
  const data = await response.json();
  if (response.ok) {


      const seats = data.map((e) => ({
        placeID: e.placeID,
        row: e.row,
        position: e.position,
        occupied: e.occupied,
        userID: e.userID,
        flightID: e.flightID,
      }));

      return seats;
  
  } else {
    throw data;
  }
}

async function showMyFlights(){

  const requestOptions = {
    method: 'GET', 
    headers: { 'Content-Type': 'application/json' }, 
    credentials: 'include', 
  };

  const response = await fetch(apiurl + "myflights/",requestOptions);
  const seats = await response.json();
  if (response.ok) {

    if (Array.isArray(seats)) {
      const mappedSeats = seats.map((e) => ({
        placeID: e.placeID,
        row: e.row,
        position: e.position,
        occupied: e.occupied,
        userID: e.userID,
        flightID: e.flightID,
      }));

      return mappedSeats;
    } else {
      throw new Error("La risposta non contiene un array di posti.");
    }
  } else {
    throw seats;
  }
}


  
  
  async function logIn(credentials) {
    let response = await fetch(apiurl + 'sessions', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }
  
  async function logOut() {
    await fetch(apiurl+'sessions/current', {
      method: 'DELETE', 
      credentials: 'include' 
    });
  }
  
  
  async function getUserInfo() {
    const response = await fetch(apiurl+'sessions/current', {
      credentials: 'include'
    });
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
    }
  }
  
  

  
  const API = {showLocal, showRegional, showInternational, logIn, logOut, getUserInfo, editSeats, showMyFlights, bookCasual };
  export default API;  
'use strict';
/* Data Access Object (DAO) module for accessing questions and answers */

const sqlite = require('sqlite3');
const crypto = require('crypto');



// open the database
const db = new sqlite.Database('flights.db', (err) => {
  if (err) throw err;
});



// GET all seats from a plane
exports.listLocalSits = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM places WHERE flightID = 1';

    db.all(sql, (err, rows) => {
      if (err) {
        console.log("Errore nella query");
        reject(err);
        return;
      }

      const seats = rows.map((e) => {
        return {
          placeID: e.placeID,
          row: e.row,
          position: e.position,
          occupied: e.occupied,
          userID: e.userID,
          flightID: e.flightID
        };
      });

      const totalSeats = seats.length;
      const occupiedSeats = seats.reduce((count, seat) => count + seat.occupied, 0);

      resolve({
        seats: seats,
        totalSeats: totalSeats,
        occupiedSeats: occupiedSeats
      });
    });
  });
};


// GET all seats from a plane
exports.listRegionalSits = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM places WHERE flightID = 2';

    db.all(sql, (err, rows) => {
      if (err) {
        console.log("Errore nella query")
        reject(err);
        return;
      }

      const seats = rows.map((e) => {

        return {
          placeID: e.placeID,
          row: e.row,
          position: e.position,
          occupied: e.occupied,
          userID: e.userID,
          flightID: e.flightID
        };
      });

      const totalSeats = seats.length;
      const occupiedSeats = seats.reduce((count, seat) => count + seat.occupied, 0);
      //esegue un'operazione di riduzione sull'array seats
      /*La funzione di callback passata a reduce prende due parametri: count e seat. count è l'accumulatore
       che tiene traccia del valore parziale durante l'iterazione, mentre seat è l'elemento corrente dell'array seats.
      La funzione di callback somma il valore della proprietà occupied di ciascun elemento seat all'accumulatore count. 
    Inizialmente, l'accumulatore viene impostato a 0 mediante il secondo argomento di reduce. */
    /*Quindi, durante ogni iterazione, il valore di seat.occupied viene aggiunto all'accumulatore. Alla fine dell'iterazione, 
    il valore finale dell'accumulatore sarà il conteggio totale dei posti occupati nell'array seats. */

      resolve({
        seats: seats,
        totalSeats: totalSeats,
        occupiedSeats: occupiedSeats
      });

    });
  });
};


// GET all seats from a plane
exports.listInternationalSits = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM places WHERE flightID = 3';

    db.all(sql, (err, rows) => {
      if (err) {
        console.log("Errore nella query")
        reject(err);
        return;
      }

      const seats = rows.map((e) => {

        return {
          placeID: e.placeID,
          row: e.row,
          position: e.position,
          occupied: e.occupied,
          userID: e.userID,
          flightID: e.flightID
        };
      });


      const totalSeats = seats.length;
      const occupiedSeats = seats.reduce((count, seat) => count + seat.occupied, 0);

      resolve({
        seats: seats,
        totalSeats: totalSeats,
        occupiedSeats: occupiedSeats
      });

    });
  });
};

exports.listCasualSits = (contatore, tipoAereo) => {

  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM places WHERE flightID = ? AND occupied = 0 ORDER BY RANDOM() LIMIT ?';

    db.all(sql,[tipoAereo, contatore] ,(err, rows) => {
      if (err) {
        console.log("Errore nella query");
        reject(err);
        return;
      }

      const seats = rows.map((e) => {
        return {
          placeID: e.placeID,
          row: e.row,
          position: e.position,
          occupied: e.occupied,
          userID: e.userID,
          flightID: e.flightID
        };
      });



      resolve(seats);
    });
  });
};

exports.showMyFlights = (userID) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM places WHERE userID = ? AND occupied=1';

    db.all(sql,[userID], (err, rows) => {
      if (err) {
        console.log("Errore nella query")
        reject(err);
        return;
      }

      const seats = rows.map((e) => {

        return {
          placeID: e.placeID,
          row: e.row,
          position: e.position,
          occupied: e.occupied,
          userID: e.userID,
          flightID: e.flightID
        };
      });

      resolve(seats);

    });
  });
};

exports.checkSeats = (selectedSeats) => {
  if (Array.isArray(selectedSeats)) {
    const promises = selectedSeats.map(selectedSeat => {
      return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM places WHERE placeID=? AND occupied=0';

        db.all(sql, [selectedSeat.placeID], function (err, rows) {
          if (err) {
            reject(err);
            console.log("errore");
            return;
          }
          resolve({
            placeID: selectedSeat.placeID,
            rowCount: rows.length
          });
        });
      });
    });

    return Promise.all(promises);
  } else {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM places WHERE placeID=? AND userID IS NULL';

      db.all(sql, [selectedSeats.placeID], function (err, rows) {
        if (err) {
          reject(err);
          console.log("errore");
          return;
        }
        resolve({
          placeID: selectedSeats.placeID,
          rowCount: rows.length
        });
      });
    });
  }
};

exports.editSeats = (userID, selectedSeats, occupied, tipologia) => {
  //tipologia 0 = elimina, 1 aggiungi

  if (tipologia === 1) {
    if (Array.isArray(selectedSeats)) {
      const promises = selectedSeats.map(selectedSeat => {
        return new Promise((resolve, reject) => {
          const sql = 'UPDATE places SET occupied=?, userID=? WHERE placeID = ? AND userID IS NULL';

          db.run(sql, [occupied, userID, selectedSeat.placeID], function (err) {
            if (err) {
              reject(err);
              console.log("errore");
              return;
            }
            resolve(this.changes);
          });
        });
      });

      return Promise.all(promises);
    } else {
      return new Promise((resolve, reject) => {
        const sql = 'UPDATE places SET occupied=?, userID=? WHERE placeID = ? AND userID IS NULL';

        db.run(sql, [occupied, userID, selectedSeats], function (err) {
          if (err) {
            reject(err);
            console.log("errore");
            return;
          }
          resolve(this.changes);
        });
      });
    }
  } else {
    if (Array.isArray(selectedSeats)) {
      const promises = selectedSeats.map(selectedSeat => {
        return new Promise((resolve, reject) => {
          const sql = 'UPDATE places SET occupied=?, userID=NULL WHERE flightID = ?';
          console.log("eseguo query elimina per il posto:", selectedSeat);

          db.run(sql, [occupied, selectedSeat], function (err) {
            if (err) {
              reject(err);
              console.log("errore");
              return;
            }
            resolve(this.changes);
          });
        });
      });

      return Promise.all(promises);
    } else {
      return new Promise((resolve, reject) => {
        const sql = 'UPDATE places SET occupied=?, userID=NULL WHERE flightID = ?';

        db.run(sql, [occupied, selectedSeats], function (err) {
          if (err) {
            reject(err);
            console.log("errore");
            return;
          }
          resolve(this.changes);
        });
      });
    }
  }
};



exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
  const sql = 'SELECT * FROM users WHERE username = ?';
  db.get(sql, [username], (err, row) => {
  if (err) { reject(err); }
  else if (row === undefined) { resolve(false); }
  else {
  const user = {userID: row.userID, username: row.username,  name: row.name};
  const salt = row.salt;
  crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
  if (err) reject(err);
  if(!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword))
  resolve(false);
  else resolve(user);
  });
  }
  });
  });
  };
  
exports.getUserById = (userID) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE userID = ?';
      db.get(sql, [userID], (err, row) => {
        if (err) 
          reject(err);
        else if (row === undefined)
          resolve({error: 'User not found.'});
        else {

          const user = {userID: row.userID, username: row.username, name: row.name}
          resolve(user);
        }
    });
  });
};

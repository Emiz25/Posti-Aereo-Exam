'use strict';


const express = require('express');
const morgan = require('morgan'); // logging middleware
const {body, check, validationResult} = require('express-validator');
const dao = require('./dao'); // module for accessing the DB
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function(username, password, done) {
    dao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });
        
      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.userID);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  dao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});



const app = express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  };
app.use(cors(corsOptions));

const answerDelay = 2000;

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated())
    return next();
  
  return res.status(401).json({ error: 'Not authenticated'});
}

// enable sessions in Express
app.use(session({
  // set up here express-session
  secret: "a secret phrase of your choice",
  resave: false,
  saveUninitialized: false,
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  


/*** APIs ***/

// GET /api/seats  SHOW ALL seats 
app.get('/api/locseats', async(req, res) => {
  try {
  const result = await dao.listLocalSits();
  if(result.error)
      res.status(404).json(result);
    else
    setTimeout(()=>res.json(result), answerDelay/2);
  }catch(err) {
    res.status(500).end();
  }

});

app.get('/api/regseats', async(req, res) => {
  try {
  const result = await dao.listRegionalSits();
  if(result.error)
      res.status(404).json(result);
    else
    setTimeout(()=>res.json(result), answerDelay/2);
  }catch(err) {
    res.status(500).end();
  }

});

app.get('/api/intseats', async(req, res) => {
  try {
  const result = await dao.listInternationalSits();
  if(result.error)
      res.status(404).json(result);
    else
    setTimeout(()=>res.json(result), answerDelay/2);
  }catch(err) {
    res.status(500).end();
  }

});

// POST /api/seats  SHOW casual seats 
app.post('/api/casual/', [
  body('tipoAereo').isInt({ min: 1, max: 3 }),
  body('pOccupati').isInt(),
  body('contatore').custom((value, { req }) => {
    const tipoAereo = parseInt(req.body.tipoAereo);
    const pOccupati = parseInt(req.body.pOccupati);
    let massimoValoreContatore=0;

    console.log(pOccupati);

    if(tipoAereo == 1){
       massimoValoreContatore = 60 - pOccupati;

    }else if(tipoAereo == 2){
      massimoValoreContatore = 100 - pOccupati;

   }else if(tipoAereo == 3){
    massimoValoreContatore = 150 - pOccupati;

    }

 
    const minimoValoreContatore = 1;
   

    if (value < minimoValoreContatore || value > massimoValoreContatore) {
      throw new Error('Il valore del campo "Numero posti" non è valido, deve essere minore di: '+ massimoValoreContatore);
    }

    return true;
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const dati = req.body;

  try {
    const result = await dao.listCasualSits(dati.contatore, dati.tipoAereo);
    if (result.error)
      res.status(404).json(result);
    else
      setTimeout(() => res.json(result), answerDelay / 2);
  } catch (err) {
    res.status(500).end();
  }
});

app.get('/api/myflights/',isLoggedIn, [
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const seats = req.body;

  try {
    const numRowChanges = await dao.showMyFlights(req.user.userID);
    res.json(numRowChanges);

  } catch(err) {
    res.status(503).json({error: `Database error during the update of seats ${req.params.userID}.`});
  }

});


// PUT 
app.put('/api/edit/',isLoggedIn, [

  check('selectedSeat').isLength({ min: 1 }),
  check('tipologia').isInt({ min: 0, max: 1 }),
  check('occupied').isInt({ min: 0, max: 1 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({errors: errors.array()});
  }

  const seats = req.body;
  //tipologia 0 = elimina, 1 aggiungi

  try {

    const numSeatChecked = await dao.checkSeats(seats.selectedSeat);
    
    console.log(numSeatChecked);

    for(let i =0; i< numSeatChecked.length; i++){ //il for perchè quando la query dei due posti va male torna [0....0]

      if(numSeatChecked[i].rowCount == 0 ){
  
       
        //se il posto è occupato da un altro utente torno questo
        return  res.status(503).json({error: numSeatChecked});
  
      }
    }

    const numSeatChanges = await dao.editSeats(req.user.userID, seats.selectedSeat, seats.occupied, seats.tipologia);

  for(let i =0; i< numSeatChanges.length; i++){ //il for perchè quando la query dei due posti va male torna [0....0]

    if(numSeatChanges[i] == 0 ){

    
      //se il posto è occupato da un altro utente torno questo
      return res.status(503).json({error: `Booking Error Changes.`});;

    }
  }

  

    res.json("Posto Aggiornato!");

  } catch(err) {
    res.status(503).json({error: `Database error during the update of seats ${req.params.selectedSeat}.`});
  }

});


/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});





app.delete('/api/sessions/current', (req, res) => {
  req.logout( ()=> { res.end(); } );
});

app.get('/api/sessions/current', (req, res) => {  if(req.isAuthenticated()) {
  res.status(200).json(req.user);}
else
  /*res.status(401).json({error: 'Unauthenticated user!'})*/;;
});


/*** Other express-related instructions ***/

// Activate the server
app.listen(port, () => {
  console.log(`Benvenuto! React-PostiAereo-server listening at http://localhost:${port}`);
});
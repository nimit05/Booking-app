const { Router} = require('express');
const route = Router()
const {Seats,AvailableSeats}  = require("../../db")
const Sequelize = require('sequelize')
const {BookTicket,NonCons} = require('../../controllers/bookTickets')

route.post('/' , async(req,res) => {
  try {
    //required seats fetched from body of post request
    var numSeats = parseInt(req.body.numSeats);
    console.log(numSeats);
    var seats = [];

    if(numSeats > 7){
      throw new Error("You can only book 7 seats at a time")
    }
    
    //fetching row number in which seats will allot
    let row = await AvailableSeats.findOne({
      where: {
        Seats: {
          [Sequelize.Op.gte] : numSeats
        }
      }
    })

    //if there is no row with vacant seats equal to required seat find nearBy seats
    if(row == null){
     seats = await NonCons(numSeats);
    }
    else{
      //Updating seats left after allocation
      row.Seats = (row.Seats - parseInt(numSeats));
      row.save();
      seats = await BookTicket(numSeats,row.RowNum);
    }
    console.log(seats)
    res.status(200).send(seats)
    
  } 
  catch (error) {
    console.log(error.message)
    res.status(400).send({error: error.message})
  }

})

route.get('/' , async(req,res) => {
  try {
    const seats = await Seats.findAll();
    res.status(200).send(seats); 
  } catch (error) {
    res.status(400).send({error : error.message})
  }
  
})

route.put('/' , async(req,res) => {
  try {
    let seats = await Seats.findAll()

    for(let seat of seats){
      seat.Available = 1;
      seat.save();
    }

    let rows = await AvailableSeats.findAll()

    for(let x of rows){
      if(x.RowNum === 12){
        x.Seats = 3;
        x.save();
        continue;
      }
      x.Seats = 7;
      x.save();
    }

    res.send({seats,rows})

  } catch (error) {
    res.send(error.message)
  }
})

module.exports = {route}
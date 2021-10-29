const { Router} = require('express');
const route = Router()
const {Seats,AvailableSeats}  = require("../../db")
const Sequelize = require('sequelize')
const {BookTicket,NonCons} = require('../../controllers/bookTickets')

route.post('/' , async(req,res) => {
  try {
    //required seats fetched from body of post request
    var numSeats = req.body.numSeats;
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
    res.status(200).send(seats)
    
  } 
  catch (error) {
    console.log(error.message)
    res.send(error.message)
  }

})

route.get('/' , async(req,res) => {
  try {
    const seats = await Seats.findAll();
    res.status(200).send(seats); 
  } catch (error) {
    res.send(error.message)
  }
  
})

module.exports = {route}
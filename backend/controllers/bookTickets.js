const Sequelize = require("sequelize");
const {Seats,AvailableSeats} = require("../db")

const TicketAllotment = async(numSeats,rowNum) => {
  try {
    var temp = await Seats.findAll({
      limit : numSeats,
      where: {
        [Sequelize.Op.and] : [
          {RowNum : parseInt(rowNum)},
          {Available : 1}
        ]
      },
    })
    
    //making all selected seats unavailable
    for(seat of temp){
      seat.Available = 0;
      seat.save()
    }
    return temp;
  } catch (error) {
    return new Error("Ticket allotment error : " +  error.message)
  }
  
}

const BookTicket = async(numSeats) => {
  try {
    //fetching seatNumbers from Seats db

    let rows = await AvailableSeats.findAll({
      where: {
        Seats: {
          [Sequelize.Op.gte] : parseInt(numSeats)
        }
      },
    })

    rows.sort(function(a,b){
      return a.Seats - b.Seats
    })

    let temp = await TicketAllotment(numSeats,rows[0].RowNum);
    
    rows[0].Seats = (rows[0].Seats - parseInt(numSeats));
    rows[0].save();

    return temp;
  } catch (error) {
    throw Error(error.message)
  }
}

const NonCons = async(numSeats) => {
  try {
    var seats = [];
    //finding all rows in AvailableSeats db grater than 1 seat available
    let rows = await AvailableSeats.findAll({
      where: {
        Seats: {
          [Sequelize.Op.gte] : 1
        }
      },
      attributes: ['RowNum','Seats']
    })

    //sorting the rows array so that max consecutive gets booked 
    rows.sort(function(a,b){
    return b.Seats - a.Seats
    })

    //finding the total number of seats left
    let sum = 0;
    for(ro of rows){
      sum = parseInt(sum +ro.Seats);
    }
    
    //If seats left is less than required seats then throw error
    if(numSeats > sum){
      throw new Error(`Sorry only ${sum} left`)
    }

    let i = 0;

    // finding all seats by traversing on rows array
    while(numSeats != 0){
      //fetching seat number from ith row
      var temp = []
      const obj = await AvailableSeats.findOne({
        where: {
          Seats: {
            [Sequelize.Op.gte] : numSeats
          }
        },
      })
      if(obj){
        temp = await BookTicket(numSeats);
      }else{
        temp = await TicketAllotment(Math.min(numSeats,rows[i].Seats),rows[i].RowNum);

          //updating the seat left in ith row
        rows[i].Seats = (rows[i].Seats - temp.length);
        rows[i].save();
      }

    
     

      //adding seats of ith row in final answer
      seats = seats.concat(temp);
      i++;
      numSeats -= temp.length;

  }

  return seats;

  } catch (error) {
    if(error){
      throw error;
    }
    throw new Error("Error Occured During ticket booking")
  }
  
}

module.exports = {
  BookTicket,
  NonCons
}
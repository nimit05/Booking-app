const Sequelize = require("sequelize");
const {Seats,AvailableSeats} = require("../db")

const BookTicket = async(numSeats,rowNum) => {
  try {
    //fetching seatNumbers from Seats db
    var temp = await Seats.findAll({
      limit : numSeats,
      where: {
        [Sequelize.Op.and] : [
          {RowNum : rowNum},
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
    throw Error("error Ocurred while fetching seat number")
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
      let temp = await BookTicket(Math.min(numSeats,rows[i].Seats),rows[i].RowNum);

      //updating hte seat left in ith row
      rows[i].Seats = (rows[i].Seats - temp.length);
      rows[i].save();

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
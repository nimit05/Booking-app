const Sequelize = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

//setting up database
const db = new Sequelize({
  dialect: "mysql",
  host: process.env.aws_mysql_host,
  database: "booking_app",
  username: process.env.aws_mysql_username,
  password: process.env.aws_mysql_pass
});

//Created Seats Table
const Seats = db.define("seats", {
  SeatNum: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  Available: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  RowNum: {
    type: Sequelize.INTEGER
  }
});

//Created AvailableSeats Table
const AvailableSeats = db.define("availableSeats" , {
  RowNum: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  Seats : {
    type: Sequelize.INTEGER
  }
})

// // Inserting values in table
AvailableSeats.sync().then(async() => {
  let i = 1;
  while(i <= 11){
    try {
      await AvailableSeats.create({
        RowNum: i,
        Seats: 7
      });
    } catch (error) {
      console.log(error);
    }
    i++
  }

  await AvailableSeats.create({
    RowNum: 12,
    Seats: 3
  });

})

Seats.sync().then(async() => {
  let i = 1;
  let pos = i;
  while(i <= 80){
    try {
      pos = parseInt(i/7) + (i%7 == 0 ? 0 : 1);
      await Seats.create({
        SeatNum: parseInt(i),
        RowNum: pos
      });
    } catch (error) {
      console.log(error)
      break;
    }
    i++;
  }
 
});

module.exports =  {
  Seats,
  db,
  AvailableSeats
}
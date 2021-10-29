import React,{useState,useEffect} from 'react'
import styled from "styled-components";

const Book = () => {
  const [numSeats, setseat] = useState(null)
  const [seats, setseats] = useState([]);
  const [err, seterr] = useState("");
  const [success, setsuccess] = useState(false)
  const [allSeats, setallSeats] = useState([])

  const Handler = (data) => {

    //checking if number of seats users has added are valid or not
    if(parseInt(data.numSeats) <= 0){
      seterr("Please Enter a valid number");
      setsuccess(true);
      return;
    }

    //booking the seats
    fetch("/api/bookticket" ,{
      method : "POST",
      headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data) 
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.error){
        seterr(data.error)
      }else{
        setseats(data);
        
      }
      setsuccess(true);
    })
  }

  useEffect(() => {
    //getting all the seats from the database
   fetch("/api/bookticket")
   .then((res) => res.json())
   .then((data) => {
      if(data.error){
        seterr(data.error)
      }else{
        setallSeats(data);
      }
   })
  }, [success])


  const HandleBack = () => {
    setsuccess(false);
    seterr("");
  }
  
  return (
    <Container>
      <h2><b>SEAT RESERVATION APP</b></h2>
      
      {success ? (
        <>
          {/* if there will be any error show error else show seats booked  */}
          {err ? (
          <h3>{err}</h3>
          ) : (
            <div>
              <ErrDiv>You have booked your Seats Successfully</ErrDiv>
          
              {/* Showing the seat matrix */}
              <Matrix>
              {allSeats.map((e,i) => {
                let x = seats.find(ele => ele.SeatNum === e.SeatNum) !== undefined ? 1 : 0;
                var bg = e.Available ? "grey" : "red";
                if(x === 1){
                  bg = "green"
                }
                return (
                  <Seat key = {i} backgroundColor = {bg} margin = "5px 5px" >
                    {e.SeatNum}
                    </Seat>
                )
              }
              )}
              </Matrix>

              <MarkCont>
              <Mark>
                  <Seat backgroundColor = "grey" margin = "5px auto" />
                  Empty Seats
              </Mark>
              <Mark>
                  <Seat backgroundColor = "red" margin = "5px auto" />
                  Filled Seats
              </Mark>
              <Mark>
                  <Seat backgroundColor = "green" margin = "5px auto" />
                  Your Seat Numbers
              </Mark>
              </MarkCont>
              
            </div>
          )}
         
          <Button onClick = {HandleBack}>
             Book Again 
          </Button>

        </>
      ) : (
        <>
          <br />
          <h3>Enter number of seats you want to book</h3>
          <Input onChange = {(e) => setseat(e.target.value)} type="number" />
          <br />
          <Button onClick={() => Handler({numSeats})} >Book</Button>
        </>
      )}
         
    </Container>
  )
}

const Container = styled.div`
  width: 650px;
  // height: 500px;
  padding: 5px;
  background-color: white;
  opacity: 0.4;
  margin: 100px auto;
  text-align: center;
`

const Input = styled.input`
  background-color: black;
  border-radius: 5px;
  padding: 5px;
  color: white;
  width: 150px;
  font-size: 1.1rem;
  text-align: center;
`

const Button = styled.button`
  width: 150px;
  height: 35px;
  border-radius: 5px;
  background-color: black;
  cursor: pointer;
  color: white;
  margin: 40px;
  font-size: 1.2rem;
`

const Matrix = styled.div`
  width: 280px;
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  margin-bottom: 15px;
`
const Seat = styled.div`
  width: 20px;
  height: 20px;
  color: white;
  padding: 5px;
  margin: ${({margin}) => margin};
  background-color: ${({backgroundColor}) => backgroundColor};
  border-radius: 5px;
`

const MarkCont = styled.div`
  width: 400px;
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;
  margin-bottom: 15px;
`

const Mark = styled.div`
  display: flex;
  flex-direction: column;
  text-align : center;
  margin: 0 auto;
`

const ErrDiv = styled.div`
  color: white; 
`

export default Book
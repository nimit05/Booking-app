const { Router} = require('express')
const route = Router()

const ticketRouter = require('./bookTicket').route

route.use('/bookticket',ticketRouter);

module.exports = {route}
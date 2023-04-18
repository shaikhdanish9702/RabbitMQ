const express = require("express");
const app = express();
const amqp = require("amqplib");
const PORT = process.env.PORT || 4001;
app.use(express.json());
var channel, connection;  //global variables
async function connectQueue() {   
    try {
        connection = await amqp.connect("amqp://localhost:5672");
        channel    = await connection.createChannel()
        
        await channel.assertQueue("test-queue")
        
    } catch (error) {
        console.log(error)
    }
}
connectQueue()
async function sendData (data) {
    // send data to queue
    await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
        
    // close the channel and connection
    await channel.close();
    await connection.close(); 
}

app.get("/send-msg", (req, res) => {
    
    // data to be sent
    const data = {
        title  : "Six of Crows",
        author : "Leigh Burdugo"
    }
    sendData(data);  // pass the data to the function we defined
    console.log("A message is sent to queue")
    res.send("Message Sent"); //response to the API request
    
})
app.listen(PORT, () => console.log("Server running at port " + PORT));
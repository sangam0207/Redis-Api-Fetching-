const express = require("express");
const redis = require("redis");
const app = express();
const axios = require('axios');
let redisClient;

// Redis connection
(async () => {
    redisClient = redis.createClient();
    redisClient.on('error', (error) => console.log('redis error' + error));
    await redisClient.connect();
})();

app.get('/users', async(req, res) => {
    const cachedData = await redisClient.get('textDetails');
    if (cachedData) {
        res.send(JSON.parse(cachedData));
        return;
    }

  
    const fetchData = async() => {
        try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
            console.log(response.data)
            return (response.data);
        } catch (error) {
            console.log(error);
        }
    }
    const response = { status: 'success', data: await fetchData() };
    await redisClient.set('textDetails', JSON.stringify(response), 'EX', 5); 
 
        res.send(response)


})

app.listen(8000, () => {
    console.log('server started @ port 8000')
})

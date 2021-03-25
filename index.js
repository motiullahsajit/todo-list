const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
const uri = "mongodb+srv://todo:todo12345@cluster0.u8skd.mongodb.net/todo-list?retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())
app.get('/', (req, res) => {
    // res.send('hello I am working')
    res.sendFile(__dirname + '/index.html')
})


client.connect(err => {
    const todocollection = client.db("todo-list").collection("todo");

    app.get('/todo', (req, res) => {
        todocollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/todo/:id', (req, res) => {
        todocollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/addtodo', (req, res) => {
        const todo = req.body;
        todocollection.insertOne(todo)
            .then(result => {
                console.log('data added successfuly')
                // res.send('success')
                res.redirect('/')
            })
        // console.log(todo)

    })

    app.patch('/update/:id', (req, res) => {
        todocollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: { name: req.body.name }
            })
            .then(result => {
                res.send(result.modifiedCount > 0)
            })
    })

    app.delete('/delete/:id', (req, res) => {
        todocollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
        console.log(req.params.id);
    })


});



app.listen(3000);
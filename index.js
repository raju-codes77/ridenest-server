const express=require('express')
const dotenv=require('dotenv')
const cors=require ('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()

const uri = process.env.MONGODB_URI;
const app=express()

const PORT=process.env.PORT
app.use(cors())
app.use(express.json())
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db=client.db("ridenest")
    const carCollection=db.collection("car")
    const AllCarCollection=db.collection("all-cars")
    const bookingCollection=db.collection("bookings")

    app.get('/cars',async(req,res)=>{
        const result=await carCollection.find().toArray()
        res.json(result);
    })
    app.get('/all-cars',async(req,res)=>{
        const result=await AllCarCollection.find().toArray()
        res.json(result);
    })

    app.post('/cars',async(req,res)=>{
        const carData=req.body
       const result=await carCollection.insertOne(carData)

       res.json(result)
    })

    app.get('/all-cars/:id',async(req,res)=>{
      const {id}=req.params
      const result= await AllCarCollection.findOne({_id:new ObjectId(id)})
      res.json(result)
    })

   app.patch('/explore-cars/:id',async(req,res)=>{
      const {id}=req.params
      const updatedData= req.body
      const result=await carCollection.updateOne(
        {_id:new ObjectId(id)},
        {$set:updatedData}
      )
      res.json(result)
    })

    app.delete('/explore-cars/:id',async(req,res)=>{
      const {id}=req.params
      const result=await carCollection.deleteOne(
        {_id:new ObjectId(id)}
      )
      res.json(result)
    })
       app.get('/booking/:userId',async(req,res)=>{
      const {userId}=req.params;
      const result= await bookingCollection.find({userId:userId}).toArray();
      res.json(result)
    })

      app.post('/booking',async(req,res)=>{
        const bookingData=req.body
       const result=await bookingCollection.insertOne(bookingData)

       res.json(result)
    })
    
    app.delete('/booking/:_id',async(req,res)=>{
      const {_id}=req.params
      const result=await bookingCollection.deleteOne(
        {_id:_id}
      )
      res.json(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send("ridenest server is running fine")
})


app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})
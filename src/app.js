const app = require("./index")
const port = process.env.PORT

//server startup
app.listen(port,()=>{
    console.log('Server is up on port ' + port)
})
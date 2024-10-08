const express = require("express")
const app = express()
require("dotenv").config()
app.use(express.json())
const cors = require("cors")
const corsOptions = {
  origin: "https://wellnesswave-vp.netlify.app", // Allow only your frontend domain
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true, // If you need to send cookies or authentication headers
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
}

// Use CORS middleware
app.use(cors(corsOptions))
const { connection } = require("./Backend/config/db")
const { userRouter } = require("./Backend/routes/users.route")
const { todosRouter } = require("./Backend/routes/todos.route")
const { productRouter } = require("./Backend/routes/products.route")
const { cartRouter } = require("./Backend/routes/cart.route")
const { wishlistRouter } = require("./Backend/routes/wishlist.route")
const { myorderRouter } = require("./Backend/routes/myorder.route")

const port = Number(process.env.PORT) || 8080

app.use("/users", userRouter)
app.use("/todos", todosRouter)
app.use("/products", productRouter)
app.use("/cart", cartRouter)
app.use("/wishlist", wishlistRouter)
app.use("/myorder", myorderRouter)

app.get("/", (req, res) => {
  res.send("Welcome to Backend Of WellnessWave!")
})

app.listen(port, async () => {
  try {
    await connection
    console.log("Connected to the DB")
  } catch (error) {
    console.log(error)
    console.log("Failed to connect DB")
  }
  console.log(`Server is running at http://localhost:${port}`)
})

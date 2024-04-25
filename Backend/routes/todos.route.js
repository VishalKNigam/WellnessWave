const express = require("express");
const { UserModel } = require("../models/users.model");
const { TodoModel } = require("../models/todos.model");
const todosRouter = express.Router();

// All todos
todosRouter.get("/", async(req,res) => {
  let todos = await UserModel.findById({_id: req.body.userID}).populate("todos");
  res.send({todos: todos.todos});
});

// user registration thing are working here
todosRouter.post("/add", async(req,res) => {
 try {
    await TodoModel.insertMany([req.body]).then(async (todo, err) => {
        if(err){
            return console.log("err", err);
        }
        let user = await UserModel.findById(req.body.userID);
        user.todos.push(todo[0]._id);
        await UserModel.findByIdAndUpdate(req.body.userID, user);
    });
    res.send({msg: "Todo Added."})
 } catch (error) {
    res.send({err: error.message})
 }
});

// Todos Update Routes
todosRouter.patch("/update/:id", async (req, res) => {
  const {id} = req.params;
  await TodoModel.findByIdAndUpdate({_id:id},req.body);
  res.send({msg:"Todo Updated Sucessfully."})
});

// todos Delete Route
todosRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  try {
      await TodoModel.findByIdAndDelete(id);
      let todos = await UserModel.findById({ _id: req.body.userID }).populate("todos");
      todos.todos = todos.todos.filter((el) => {
        return el._id.toString() !== id;
      });
      todos = await UserModel.findByIdAndUpdate({ _id: req.body.userID }, todos).populate("todos");
      res.send({ msg: "Todo Deleted Sucessfully." })
  } catch (error) {
      res.send({ err: error.message })
  }
});




module.exports = {todosRouter};
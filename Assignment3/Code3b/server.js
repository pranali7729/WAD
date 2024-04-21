const express = require("express");
const mongoose = require("mongoose");
const User = require("./database");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/usercrudapp").then(() => {
    console.log("Connection to MongoDB successful");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

// Set up EJS as the view engine
app.set("view engine", "ejs");

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: false }));

// Route to render the index page with users list
app.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        res.render("index", {
            title: "HomePage",
            users: users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to handle user registration
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.redirect("/");
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to render the edit page for a user
app.get("/edit/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.redirect("/");
        }
        res.render("edit", { user });
    } catch (error) {
        console.error("Error fetching user for edit:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to update user information
app.post("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        await User.findByIdAndUpdate(id, { name, email, password });
        res.redirect("/");
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to delete a user
app.get("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.redirect("/");
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

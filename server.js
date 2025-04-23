import express from 'express';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import session from 'express-session';
//import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
//import pg from 'pg';

const print = console.log.bind();
const app = express();
dotenv.config();
const Port = 3000;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use('/node_modules', express.static('node_modules'));

app.use(session({
    secret: 'GreenPower',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 60 * 60 * 1000 // node session 1-hour
    }
}));

//^ Internal DB
// const db = new pg.Pool({
//     user: "green_powerdb_user",
//     host: "dpg-ctoui7dsvqrc73bbivjg-a",
//     database: "green_powerdb",
//     password: "uIAlGCShQiUTVXItxzE4ehNCmYjE07rG",
//     port: 5432,
// });

//^ External DB
// const db = new pg.Pool({
//     user: "saleh_user",
//     host: "dpg-ct48a13tq21c7391u9fg-a.oregon-postgres.render.com",
//     database: "saleh",
//     password: "zNbq9DV1Npuxo6BxfLjSHD9xZZJSacmO",
//     port: 5432,
//     ssl: {
//         rejectUnauthorized: false 
//     },
//     idleTimeoutMillis: 30000
// });

// db.connect()
//     .then(() => print("Database connected successfully"))
//     .catch(err => {
//         console.error("Database connection error:", err);
//         process.exit(1); // Exit if DB connection fails
//     });


//! Uncomment the following code to enable login and signup functionality
//app.get('/Login', (req, res) => res.render("Login"));
//app.get('/SignUp', (req, res) => res.render("SignUp"));

// app.post("/Login", async (req, res) => {
//     const { Email, password } = req.body;
//     try {
//         const query = "SELECT * FROM users WHERE Email = $1";
//         const values = [Email.toLowerCase()];
//         const result = await db.query(query.toLowerCase(), values);

//         if (result.rows.length > 0) {
//             const user = result.rows[0];
//             const passwordMatch = await bcrypt.compare(password, user.password);

//             if (passwordMatch) {
//                 req.session.user = user;
//                 return res.redirect("/Home");
//             }
//         }
//         res.render("Login", { error: "Invalid Email or password." });
//     } catch (error) {
//         console.error("Server error:", error);
//         res.render("Login", { error: "An internal server error occurred." });
//     }
// });

// app.post("/SignUp", async (req, res) => {
//     const { Email, Password, PhoneNumber, Username } = req.body;
//     try {
//         if (!Email || !Password || !PhoneNumber || !Username) {
//             return res.render("SignUp", { error: "All fields are required." });
//         }
//         const hashedPassword = await bcrypt.hash(Password, 10);
//         const query = "INSERT INTO users (Email, Password, Phonenumber, Username) VALUES ($1, $2, $3, $4)";
//         const values = [Email.toLowerCase(), hashedPassword, PhoneNumber, Username];

//         await db.query(query, values);
//         res.redirect("/Login");
//     } catch (error) {
//         console.error("Server error:", error);
//         res.render("SignUp", { error: "An internal server error occurred." });
//     }
// });

// // Middleware to check if user is logged in
// function isLoggedIn(req, res, next) {
//     if (req.session.user) {
//         return next();
//     }
//     res.redirect("/Login");
// }
//! Un-comment the above code to enable login and signup functionality

app.get('/', (req, res) => res.render("GetStarted"));
app.get('/About', (req, res) => res.render("About"));
app.get('/Courses', (req, res) => res.render("Courses"));
app.get('/Home', (req, res) => res.render("Home"));
app.get('/Project', (req, res) => res.render("Project"));
app.get('/Logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).send("Unable to log out.");
        }
        res.redirect("/GetStarted");
    });
});
app.listen(Port, () => print(`Server is running on http://localhost:${Port}`)); 
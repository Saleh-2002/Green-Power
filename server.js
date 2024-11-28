import express from 'express';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import session from 'express-session';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import pg from 'pg';

const print = console.log.bind();
const app = express();
const Port = process.env.PORT || 4000;
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use('/node_modules', express.static('node_modules'));
dotenv.config();

// Session setup
app.use(session({
    secret: 'GreenPower', 
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        maxAge: 60 * 60 * 1000 // 1-hour session expiration
    }
}));

const db = new pg.Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_DATABASE || "postgres",
    password: process.env.DB_PASSWORD || "Saleh2002",
    port: 5432,
});
//console.log(`DB Host: ${process.env.DB_HOST}`);
//console.log(`DB User: ${process.env.DB_USER}`);
//console.log(`DB Password: ${process.env.DB_PASSWORD}`); 
db.connect()
    .then(() => print("Database connected successfully"))
    .catch(err => {
        console.error("Database connection error:", err);
        process.exit(1); // Exit if DB connection fails
    });

app.listen(Port, () => {
    print(`Server is running on http://localhost:${Port}`);
});

// Routes
app.get('/', (req, res) => {
    res.render("GetStarted");
});

app.get('/Login', (req, res) => {
    res.render("Login");
});

app.post("/Login", async (req, res) => {
    const { Email, password } = req.body;
    try {
        const query = "SELECT * FROM users WHERE Email = $1";
        const values = [Email];

        const result = await db.query(query, values);

        if (result.rows.length > 0) {
            const user = result.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                req.session.user = user;
                return res.redirect("/Home");
            }
        }
        res.render("login", { error: "Invalid Email or password." });
    } catch (error) {
        console.error("Server error:", error);
        res.render("login", { error: "An internal server error occurred." });
    }
});

app.get('/SignUp', (req, res) => {
    res.render("SignUp");
});

app.post("/SignUp", async (req, res) => {
    const { Email, Password, PhoneNumber, Username } = req.body;
    try {
        if (!Email || !Password || !PhoneNumber || !Username) {
            return res.render("SignUp", { error: "All fields are required." });
        }
        const hashedPassword = await bcrypt.hash(Password, 10);
        const query = "INSERT INTO users (Email, Password, Phonenumber, Username) VALUES ($1, $2, $3, $4)";
        const values = [Email, hashedPassword, PhoneNumber, Username];
        
        const result = await db.query(query, values);
        res.redirect("/Login");
    } catch (error) {
        console.error("Server error:", error);
        res.render("SignUp", { error: "An internal server error occurred." });
    }
});


function isLoggedIn(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect("/Login"); 
}

app.get('/About', isLoggedIn, (req, res) => {
    res.render("About");
});

app.get('/Courses', isLoggedIn, (req, res) => {
    res.render("Courses");
});

app.get('/Home', isLoggedIn, (req, res) => {
    res.render("Home");
});

app.get('/Project', isLoggedIn, (req, res) => {
    res.render("Project");
});

app.get('/Logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).send("Unable to log out.");
        }
        res.redirect("/Login");
    });
});
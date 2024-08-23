import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Web Dev",
  password: "root",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;



async function all_users(){
  const result = await db.query("select * from users")
  let users = []
  result.rows.forEach((user)=>{
    users.push(user)
  })
  return users
}

async function user_visited_countries(user) {
  const result = await db.query("SELECT country_code FROM visited_countries as vc where user_id=$1",[user]);
  return result.rows
  
}

async function getCurrentUser() {
  let users = await all_users()
  return users.find((user) => user.id == currentUserId);
}

app.get("/", async (req, res) => {
  const currentUser = await getCurrentUser();
  const countries = await user_visited_countries(currentUser.id)
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: await all_users(),
    color: currentUser.color,
  });
});
app.post("/add", async (req, res) => {
  const input = req.body["country"];
  const currentUser = await getCurrentUser()
  const countries = await user_visited_countries(currentUser.id)

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows;
    
    try {
      for(const row of data){
        const countryCode = (row.country_code)
        const result = await db.query(
          "INSERT INTO visited_countries (country_code,user_id) VALUES ($1,$2)",
          [countryCode,currentUser.id]
        );
      }
      res.redirect("/");
    } catch (err) {
      res.render("index.ejs",{
        countries: countries,
        total: countries.length,
        users: await all_users(),
        color: currentUser.color,
        error: "The country already exists, try again!"
      })
    }
  } catch (err) {
    res.render("index.ejs",{
      countries: countries,
      total: countries.length,
      users: await all_users(),
      color: currentUser.color,
      error: "The country does not exists, try again!"
    })
  }
});

app.post("/user", async (req, res) => {
  if(req.body.add === "new"){
    res.render("new.ejs")
  } else {
    currentUserId = req.body.user
    res.redirect("/")
  }
});


app.post("/new", async (req, res) => {
  try {
    const user_name = req.body.name
    const user_color = req.body.color

    if(user_name  && user_color){ 
      await db.query("insert into users (name,color) values ($1,$2)",[user_name,user_color])
      res.redirect("/")
    }else{  
      res.status(400).send("Name and color are required.")
    }
  }catch(err){
    res.status(500).send("Internal server error");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

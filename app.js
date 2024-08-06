const express = require("express");
const mysql = require("mysql2");
const hbs = require("hbs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();


app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));


app.use(bodyParser.urlencoded({ extended: false }));

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	database: "chatbottests",
	password: "chatbottests"
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключено к базе данных MySQL');
});


app.get("/getAllItems", (req, res) => {
    db.query("SELECT * FROM items", (err, results) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            res.render('index', { header: "Error", body: "Ошибка получения данных" });
            return;
        }
        res.render('index', { items: results });
    });
});


app.get("/addItem", (req, res) => {
    res.render('addItem');
});


app.post("/addItem", (req, res) => {
    const { name, desc } = req.body;
    if (!name || !desc) {
        return res.json(null);
    }
    const newItem = { name, desc };
    db.query("INSERT INTO items SET ?", newItem, (err, result) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            return res.json(null);
        }
        newItem.id = result.insertId;
        res.json(newItem);
    });
});


app.get("/deleteItem", (req, res) => {
    res.render('deleteItem');
});


app.post("/deleteItem", (req, res) => {
    const id = parseInt(req.body.id);
    if (isNaN(id)) {
        return res.json(null);
    }
    db.query("DELETE FROM items WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            return res.json(null);
        }
        if (result.affectedRows === 0) {
            return res.json({});
        }
        res.json({ id });
    });
});

app.get("/updateItem", (req, res) => {
    res.render('updateItem');
});

app.post("/updateItem", (req, res) => {
    const id = parseInt(req.body.id);
    const { name, desc } = req.body;
    if (isNaN(id) || !name || !desc) {
        return res.json(null);
    }
    db.query("UPDATE items SET name = ?, desc = ? WHERE id = ?", [name, desc, id], (err, result) => {
        if (err) {
            console.error('Ошибка выполнения запроса:', err);
            return res.json(null);
        }
        if (result.affectedRows === 0) {
            return res.json({});
        }
        res.json({ id, name, desc });
    });
});

app.listen(3000, "127.0.0.1", () => {
    console.log("Сервер начал прием запросов по адресу http://localhost:3000");
});
const express = require("express");
const cors = require("cors");
const pool = require("./utils/db");
const errorHandler = require("./utils/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());

// Get the Artists

app.get("/artists", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM Artist LIMIT 1000");

    res.json({
      status: "success",
      data: result.rows || result[0],
    });
  } catch (error) {
    console.log(`Error occurred while retrieving artists`, error.message);
  }
});

app.post("/artists", async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Name is required",
      });
    }

    const idQuery = "SELECT MAX(artist_id) AS max_id FROM artist";
    const idResult = await pool.query(idQuery);

    let nextId = 1;

    if (idResult.rows[0].max_id) {
      nextId = idResult.rows[0].max_id + 1;
    }

    const query =
      "INSERT INTO artist (artist_id, name) VALUES ($1, $2) RETURNING *";
    const values = [nextId, name];

    const result = await pool.query(query, values);

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.log(`Error occurred while creating artist`);
    next({
      status: 500,
      message: "Failed to add artist",
      error: error,
    });
  }
});

app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

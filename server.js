// paquetes externos a instalar
import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; // Agregamos la importación de cors

// paquete interno de Node
import { readFile, writeFile } from "fs/promises";

const app = express();
const PORT = process.env.PORT || 3000;

const repertorioPath = "repertorio.json";

// Configuramos cors
app.use(cors());

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/canciones", async (req, res) => {
  try {
    // Leer el repertorio actual
    const repertorioData = await readFile(repertorioPath, "utf-8");
    const repertorio = JSON.parse(repertorioData);
    res.json(repertorio);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/canciones", async (req, res) => {
  try {
    const { title, artist } = req.body;

    // Leer el repertorio actual
    const repertorioData = await readFile(repertorioPath, "utf-8");
    const repertorio = JSON.parse(repertorioData);

    // Crear una nueva canción
    const newSong = { id: repertorio.length + 1, title, artist };

    // Agregar la nueva canción al repertorio
    repertorio.push(newSong);

    // Escribir el repertorio actualizado en el archivo
    await writeFile(
      repertorioPath,
      JSON.stringify(repertorio, null, 2),
      "utf-8"
    );

    // Enviar la nueva canción como respuesta
    res.json(newSong);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/canciones/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, artist, tone } = req.body;

    // Leer el repertorio actual
    const repertorioData = await readFile(repertorioPath, "utf-8");
    const repertorio = JSON.parse(repertorioData);

    const updatedRepertorio = repertorio.map((song) => {
      if (song.id === id) {
        song.title = title;
        song.artist = artist;
        song.tone = tone;
      }
      return song;
    });

    // Escribir el repertorio actualizado en el archivo
    await writeFile(
      repertorioPath,
      JSON.stringify(updatedRepertorio, null, 2),
      "utf-8"
    );

    res.status(200).send("Song updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/canciones/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    // Leer el repertorio actual
    const repertorioData = await readFile(repertorioPath, "utf-8");
    const repertorio = JSON.parse(repertorioData);

    const updatedRepertorio = repertorio.filter((song) => song.id !== id);

    // Escribir el repertorio actualizado en el archivo
    await writeFile(
      repertorioPath,
      JSON.stringify(updatedRepertorio, null, 2),
      "utf-8"
    );

    res.status(200).send("Song deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

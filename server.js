const express = require('express');
const multer  = require('multer');
const path = require('path');

const app = express();

// Configurar Multer para guardar archivos en la carpeta 'public'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Ruta para manejar la carga de archivos
app.post('/upload', upload.single('image'), (req, res) => {
  res.send('Imagen subida correctamente');
});

app.listen(3001, () => {
  console.log('Servidor en ejecución en http://localhost:3001');
});

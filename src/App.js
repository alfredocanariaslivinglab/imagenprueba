import React, { useState } from 'react';
import axios from 'axios';
import './style/prueba.css'

function App() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Por favor, seleccione una imagen');
      return;
    }

    try {
      const resizedFile = await resizeImage(file);
      await uploadImage(resizedFile);
    } catch (error) {
      console.error('Error al redimensionar y subir la imagen:', error);
      setMessage('Error al redimensionar y subir la imagen');
    }
  };

  const resizeImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxWidth = 2000;
          const maxHeight = 2000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.95);
        };
      };
    });
  };

  const uploadImage = async (resizedFile) => {
    const formData = new FormData();
    formData.append('image', resizedFile);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.status === 200) {
        setMessage('Imagen subida correctamente');
      } else {
        setMessage('Error al subir la imagen');
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      setMessage('Error al subir la imagen');
    }
  };

  return (
    <div className="app-container">
      <h1>Subir Imagen de prueba</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Subir</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;

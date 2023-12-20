document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("tbody");
  const addSongForm = document.getElementById("addSongForm"); // Funcion para agregar las acciones

  // Función para obtener y mostrar las canciones
  const obtenerCanciones = async () => {
    try {
      const response = await fetch("http://localhost:3000/canciones");
      const canciones = await response.json();
      mostrarCanciones(canciones);
    } catch (error) {
      console.error("Error al obtener canciones:", error);
    }
  };

  // Función para mostrar las canciones en la tabla
  const mostrarCanciones = (canciones) => {
    tableBody.innerHTML = ""; // Limpiar la tabla antes de mostrar nuevas canciones

    canciones.forEach((cancion) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <th scope="row">${cancion.id}</th>
        <td>${cancion.title}</td>
        <td>${cancion.artist}</td>
        <td>${cancion.tone}</td>
        <td>
        <button class="btn btn-info btn-sm" onclick="editarCancion(${cancion.id})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarCancion(${cancion.id})">Eliminar</button>
      </td>
      `;
      tableBody.appendChild(row);
    });
  };

  // Función para enviar una nueva canción al servidor
  const agregarCancion = async (title, artist, tone) => {
    try {
      const response = await fetch("http://localhost:3000/canciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, artist, tone }),
      });

      const nuevaCancion = await response.json();

      // Agregar la nueva canción a la tabla
      mostrarCanciones([...tableBody.children, nuevaCancion]);
    } catch (error) {
      console.error("Error al agregar la canción:", error);
    }
  };

  // Función para editar una canción
  window.editarCancion = async (id) => {
    const nuevoTitulo = prompt("Ingrese el nuevo título:");
    const nuevoArtista = prompt("Ingrese el nuevo artista:");
    const nuevoTono = prompt("Ingrese el nuevo tono:");

    if (nuevoTitulo !== null && nuevoArtista !== null) {
      try {
        const response = await fetch(`http://localhost:3000/canciones/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: nuevoTitulo, artist: nuevoArtista }),
        });

        if (response.ok) {
          console.log(`Canción con ID ${id} editada exitosamente.`);
          // Actualizar la tabla después de la edición
          obtenerCanciones();
        } else {
          console.error("Error al editar la canción:", response.statusText);
        }
      } catch (error) {
        console.error("Error al editar la canción:", error);
      }
    }
  };

  // Función para eliminar una canción
  window.eliminarCancion = async (id) => {
    const confirmacion = confirm(
      "¿Está seguro de que desea eliminar esta canción?"
    );

    if (confirmacion) {
      try {
        const response = await fetch(`http://localhost:3000/canciones/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          console.log(`Canción con ID ${id} eliminada exitosamente.`);
          // Actualizar la tabla después de la eliminación
          obtenerCanciones();
        } else {
          console.error("Error al eliminar la canción:", response.statusText);
        }
      } catch (error) {
        console.error("Error al eliminar la canción:", error);
      }
    }
  };

  // Event listener para el formulario de agregar canción
  addSongForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const artist = document.getElementById("artist").value;
    const tone = document.getElementById("tone").value;

    // Verificar si ambos campos están llenos antes de agregar la canción
    if (title && artist) {
      agregarCancion(title, artist, tone);

      // Limpiar el formulario después de agregar la canción
      addSongForm.reset();
    } else {
      alert("Por favor, complete todos los campos.");
    }
  });

  // Llamar a la función obtenerCanciones al cargar la página
  obtenerCanciones();
});

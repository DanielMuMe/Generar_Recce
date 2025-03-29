
    // Configuración de Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyA6u_-P7SA4ecwY64MzUvPcL0vHVjsFLTo",
      authDomain: "recce-f1a05.firebaseapp.com",
      projectId: "recce-f1a05",
      storageBucket: "recce-f1a05.firebasestorage.app",
      messagingSenderId: "1096750674284",
      appId: "1:1096750674284:web:daeb472b820f25ce6b0349"
    };

    // Inicializar Firebase
    const app = firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Función para generar una receta aleatoria
    function generarReceta() {
      const ingredientes = Array.from(document.getElementById("ingredientes").selectedOptions).map(option => option.value);
      if (ingredientes.length === 0) {
        alert("Por favor, selecciona al menos un ingrediente.");
        return;
      }

      const recetas = {
        pollo: "Pollo al horno con especias",
        pasta: "Pasta al pesto con tomate",
        tomate: "Ensalada de tomate y queso",
        queso: "Quesadillas con espinaca",
        espinaca: "Crema de espinaca"
      };

      let recetaGenerada = "";
      ingredientes.forEach(ingrediente => {
        recetaGenerada += `- ${recetas[ingrediente] || "Receta desconocida"}\n`;
      });

      document.getElementById("receta").innerText = recetaGenerada;

      // Guardar la receta en Firestore
      db.collection("recetas").add({
        receta: recetaGenerada,
        fecha: firebase.firestore.FieldValue.serverTimestamp()
      }).then(() => {
        console.log("Receta guardada en Firestore");
        cargarHistorial();
      });
    }

    // Cargar historial de recetas desde Firestore
    function cargarHistorial() {
      const historial = document.getElementById("historial");
      historial.innerHTML = ""; // Limpiar historial anterior

      db.collection("recetas").orderBy("fecha", "desc").get().then(snapshot => {
        snapshot.forEach(doc => {
          const li = document.createElement("li");
          li.textContent = doc.data().receta.replace(/\n/g, ", ");
          historial.appendChild(li);
        });
      });
    }

    // Cargar historial al iniciar la aplicación
    cargarHistorial();
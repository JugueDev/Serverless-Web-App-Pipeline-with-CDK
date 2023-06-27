function enviarValor() {
    var valor = document.getElementById('valorInput').value;
  
    // Realiza una petición a la API utilizando Fetch
    fetch('api/'+valor, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      // Muestra el resultado en la pantalla
      document.getElementById('resultado').innerHTML = "Resultado: "+data;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
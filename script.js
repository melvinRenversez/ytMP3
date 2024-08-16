async function sendData() {

    clientName = document.getElementById('name').value
    url = document.getElementById('url').value
  
    try {
      const response = await fetch('http://192.168.0.41:3000/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: clientName, url: url })
      });
  
      // Vérifier si la réponse est OK (code 2xx)
      if (response.ok) {
        const data = await response.json();{JSON.stringify(data)};
      }
    } catch (error) {
      // Afficher les erreurs éventuelles dans la console et l'interface utilisateur
      console.error('Erreur:', error);
    }
}

function MyMusic() {
  const clientName = encodeURIComponent(document.getElementById('name').value);
  const href = `/MyMusic/Mes Morceaux.html?name=${clientName}`;
  window.location.href = href;
}

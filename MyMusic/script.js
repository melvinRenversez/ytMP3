const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('name');
console.log(name);

files = document.getElementById('files');

async function getFiles() {

    files.innerHTML = 'Recupération des données ...';
  
    try {
      const response = await fetch('http://192.168.0.41:3000/getFiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: name })
      });
  
      // Vérifier si la réponse est OK (code 2xx)
        if (response.ok) {
            const data = await response.json();{JSON.stringify(data)};
            console.log(data);
            Music = data.files
            console.log(Music)
            files.innerHTML = ""
            Music.forEach(element => {
                console.log(element)
                x = element.split('.')
                console.log(x[1])
                if(x[1] == "mp3"){
                    files.innerHTML += element + '</br>'
                }
            });
            
        }
    } catch (error) {
      // Afficher les erreurs éventuelles dans la console et l'interface utilisateur
      console.error('Erreur:', error);
    }
}

getFiles();
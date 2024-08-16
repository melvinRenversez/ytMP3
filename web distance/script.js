async function downloadAndSend(event) {
    // Empêcher le rechargement de la page
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const url = document.getElementById('videoUrl').value.trim();
    const statusElement = document.getElementById('status');

    if (!name) {
        statusElement.textContent = 'Veuillez entrer un nom.';
        return;
    }

    if (!url) {
        statusElement.textContent = 'Veuillez entrer une URL.';
        return;
    }

    statusElement.textContent = 'Traitement en cours...';

    try {
        const response = await fetch('http://192.168.0.41:3000/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, url })
        });

        if (!response.ok) {
            throw new Error('Erreur de traitement du serveur.');
        }

        const data = await response.json();

        if (data.success) {
            statusElement.textContent = 'Téléchargement terminé.';
            // Rediriger l'utilisateur
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
            }
        } else {
            statusElement.textContent = `Erreur lors du téléchargement : ${data.message || 'Erreur inconnue.'}`;
        }
    } catch (error) {
        statusElement.textContent = `Erreur: ${error.message}`;
    }
}

// Attacher le gestionnaire d'événements au bouton
document.getElementById('submitButton').addEventListener('click', downloadAndSend);

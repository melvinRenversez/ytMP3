const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Configuration de CORS et body-parser
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Créez le répertoire de téléchargement s'il n'existe pas
const downloadDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir);
}

// Endpoint pour télécharger et convertir la vidéo YouTube en MP3
app.post('/download', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ success: false, message: 'URL manquante' });
    }

    // Nom du fichier MP3
    const outputPath = path.join(downloadDir, 'output.mp3');
    const ffmpegPath = 'C:/ffmpeg-master-latest-win64-gpl-shared/bin'; // Chemin vers le répertoire contenant ffmpeg.exe
    const command = `yt-dlp -x --audio-format mp3 --ffmpeg-location "${ffmpegPath}" -o "${outputPath}" "${url}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur: ${error.message}`);
            return res.status(500).json({ success: false, message: 'Erreur lors du téléchargement', error: error.message });
        }
        if (stderr) {
            console.error(`Erreur de stderr: ${stderr}`);
            return res.status(500).json({ success: false, message: 'Erreur lors du téléchargement', error: stderr });
        }

        // Répondre avec l'URL du fichier MP3
        res.json({
            success: true,
            downloadUrl: `/downloads/output.mp3`
        });
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur à l'écoute sur http://localhost:${port}`);
});

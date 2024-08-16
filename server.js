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
app.use(express.static('public')); // Sert les fichiers du répertoire 'public'

// Créez le répertoire de téléchargement s'il n'existe pas
const baseDownloadDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(baseDownloadDir)) {
    fs.mkdirSync(baseDownloadDir);
}

// Fonction pour obtenir le titre de la vidéo
function getVideoTitle(url, callback) {
    const command = `yt-dlp --get-title "${url}"`;
    
    exec(command, (error, stdout, stderr) => {
        if (error) {
            return callback(new Error(`Erreur lors de l'extraction du titre : ${error.message}`));
        }
        if (stderr) {
            console.error(`Stderr : ${stderr}`);
        }
        
        const title = stdout.trim();
        if (!title) {
            return callback(new Error('Titre de la vidéo introuvable.'));
        }
        callback(null, title);
    });
}

// Endpoint pour télécharger et convertir la vidéo YouTube en MP3
app.post('/download', (req, res) => {
    console.log(req.body);
    const { name, url } = req.body;
    const downloadDir = path.join(baseDownloadDir, name);

    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
    }

    const textFilePath = path.join(downloadDir, `${name}.txt`);

    fs.writeFile(textFilePath, name, (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erreur lors de la création du fichier texte.' });
        }

        getVideoTitle(url, (error, title) => {
            if (error) {
                return res.status(500).json({ success: false, message: 'Erreur lors de l\'extraction du titre de la vidéo.' });
            }

            const sanitizedFileName = title.replace(/[^a-zA-Z0-9-_]/g, '_') + '.mp3';
            const filePath = path.join(downloadDir, sanitizedFileName);
            const ffmpegLocation = 'C:/ffmpeg-master-latest-win64-gpl-shared/bin';
            const downloadCommand = `yt-dlp -x --audio-format mp3 --ffmpeg-location "${ffmpegLocation}" -o "${filePath}" "${url}"`;

            exec(downloadCommand, (error, stdout, stderr) => {
                if (error) {
                    return res.status(500).json({ success: false, message: 'Erreur lors du téléchargement ou de la conversion.' });
                }
                if (stderr) {
                    console.error(`Stderr : ${stderr}`);
                }

                console.log(`Stdout : ${stdout}`);
                res.status(200).json({ success: true, redirectUrl: '/mes_morceaux.html' });
            });
        });
    });
});

app.post('/getFiles', (req, res) => {
    console.log(req.body)
    const clientName = req.body.name;
    const folderPath = path.join(baseDownloadDir, clientName);

    console.log(clientName)
    console.log(folderPath)

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Erreur lors de la lecture du répertoire.', details: err.message });
        }
        res.status(200).json({ success: true, files: files });
    });
});

// Servir les fichiers statiques (téléchargements)
app.use('/downloads', express.static(baseDownloadDir));

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur à l'écoute sur http://localhost:${port}`);
});

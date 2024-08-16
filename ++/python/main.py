import yt_dlp
import os

def telecharger_video_yt_en_mp3(url, destination="."):
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': os.path.join(destination, '%(title)s.%(ext)s'),
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

    print("Téléchargement terminé.")

# Exemple d'utilisation
url = "https://youtu.be/xVKGXgHDMvQ?si=kBjvkACjHDkUW7Lt"
telecharger_video_yt_en_mp3(url, destination=".")

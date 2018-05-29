# bruceTest

Pour mettre en place le projet : 

BDD : 

Dans un premier temps, il te faudra une bdd mongodb en local, si ce n'est pas le cas : 

- se diriger vers : https://www.mongodb.com/download-center#community
- choisir la version et clique sur download

Une fois le téléchargement terminé, dirige toi vers le dossier bin du dossier que tu viens de télécharger avec trois terminal et utilise

- inscrit ./mongod sur l'un des deux terminal
- inscrit ./mongo sur le second terminal

Maintenant que les deux terminal tournent la connexion est faite, tu peux mettre le fichier Json jobs.json (pièce jointe) dans le dossier bin.

Si le fichier est importé tu peux inscrire dans le troisième terminal la ligne de commande suivante : 

./mongoimport -d bruceTest -c jobs jobs.json

Tu as maintenant terminé avec mongo, la bdd et la collection sont crées.

Node JS : 
- Clone le projet
- Lance un terminal et dirige toi vers le dossier du projet
- Une fois dans le projet, fait un "npm install"
- Et ensuite un npm start (script de lancement)
- Tu peux maintenant aller sur cette url = http://localhost:1606/

Il te sera demandé de remplir le input et d'appuyer sur "rechercher"

S'il y a un match ou plusieurs match avec l'Api une liste s'affichera, chaque ligne est cliquable et gardera en bdd le choix que tu as fait en bdd. (/search)

En cas de non match avec l'api, le text brut est enregistré et un compteur est incrémenté à chaque demande de ce text. (/learn)

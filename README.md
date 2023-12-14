# Nomade Secured Chat

Nomade est une application web de messagerie instantanée et sécurisée grâce au chiffrement PGP.
Créée avec l'environnement d'exécution NodeJS, elle permet à des utilisateurs inscrits et authentifiés de communiquer de manière confidentielle an chiffrant leurs messages à l'aide de PGP. 
Ainsi, les messages bénéficient de deux couches de chiffrement, l'une inhérente au protocole HTTPS et l'autre grâce à PGP.
Autrement dit, les messages ont au moins une couche de chiffrement lorsqu'ils transittent par le réseau et ne sont jamais stockés en clair dans la base de données.


**ATTENTION :** L'utilisation de cette application web nécéssite la mise en place d'un certificat **SSL/TLS** et le protocole **HTTPS** dans la mesure ou les clefs privées PGP des utilisateurs sont envoyées par le serveur.

# Présentation 

## Inscription

L'inscription s'effectue via un formulaire de saisie et nécéssite l'activation du compte par adresse email.

![register_1](https://github.com/DevBlocks42/Nomade/assets/136115859/983f3b6c-6982-45ba-94e6-fa32ef9f06c2)

![register_2](https://github.com/DevBlocks42/Nomade/assets/136115859/c201c650-612c-4b6f-8f3b-b759a7e56234)

![register_3](https://github.com/DevBlocks42/Nomade/assets/136115859/19f9437a-33e8-41e3-aabc-599e3c521ff9)

![register_4](https://github.com/DevBlocks42/Nomade/assets/136115859/afb03438-9e01-4cdd-9e56-1217200ef1d7)

## Connexion

![login](https://github.com/DevBlocks42/Nomade/assets/136115859/f0966a7e-ab1a-43a8-b04b-2aba352078e1)

## Profil utilisateur

Chaque compte dispose d'un profil avec des données que l'utilisateur peut parfois modifier.

![profile_1](https://github.com/DevBlocks42/Nomade/assets/136115859/5641ed29-8748-45f2-9669-8d14942b2f80)

![profile_2](https://github.com/DevBlocks42/Nomade/assets/136115859/6b06f943-7d94-42bd-951f-f95224c93470)

![profile_3](https://github.com/DevBlocks42/Nomade/assets/136115859/89bd4c38-ba39-4f73-8dae-d95696c88d71)

## Recherche par pseudonyme

Pour se trouver entre eux, les utilisateurs peuvent effectuer une recherche par pseudonyme et ensuite initier une discussion avec le déstinataire.

![messenger_search](https://github.com/DevBlocks42/Nomade/assets/136115859/30cbf302-2055-469d-a910-46fe22cf8ef2)
![messenger_search_2](https://github.com/DevBlocks42/Nomade/assets/136115859/90b21764-ce20-41e1-8f8a-49298b57207f)










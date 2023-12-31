- [Introduction](https://github.com/DevBlocks42/Nomade/blob/main/README.md#nomade-secured-chat)

- [Logiciels](https://github.com/DevBlocks42/Nomade/blob/main/README.md#logiciels)

- [Présentation](https://github.com/DevBlocks42/Nomade/blob/main/README.md#pr%C3%A9sentation)

- [Base de données](https://github.com/DevBlocks42/Nomade/blob/main/README.md#diagramme-relationnel-de-la-base-de-donn%C3%A9es)

- [Documentation](https://github.com/DevBlocks42/Nomade/blob/main/README.md#documentation-technique-des-modules)

# Nomade Secured Chat

Nomade est une application web de messagerie instantanée et sécurisée grâce au chiffrement PGP.
Créée avec l'environnement d'exécution NodeJS, elle permet à des utilisateurs inscrits et authentifiés de communiquer de manière confidentielle an chiffrant leurs messages à l'aide de PGP. 
Ainsi, les messages bénéficient de deux couches de chiffrement, l'une inhérente au protocole HTTPS et l'autre grâce à PGP.
Autrement dit, les messages ont au moins deux couches de chiffrement lorsqu'ils transittent par le réseau et ne sont jamais stockés en clair dans la base de données.
Uniquement les messages chiffrés sont envoyés au serveur, de cette façon, seul le déstinataire du message peut le déchiffrer avec sa clef privée.


**ATTENTION :** L'utilisation de cette application web nécéssite la mise en place d'un certificat **SSL/TLS** et le protocole **HTTPS** dans la mesure ou les clefs privées PGP des utilisateurs sont envoyées par le serveur.

# Logiciels

- NodeJS
- MySQL
- OpenPGP


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

## Discussions actives 

Chaque discussions à laquelle participe un utilisateur est répertoriée sur l'index de sa messagerie.

![messenger_discussions](https://github.com/DevBlocks42/Nomade/assets/136115859/2e9d5202-eee6-4821-abc9-b77484f3a4a9)

## Discussions entre utilisateurs (Alice et Bobby)

![discussion_1](https://github.com/DevBlocks42/Nomade/assets/136115859/9a6abdff-6177-44cf-8c5f-9bb97fdcd5d3)

![discussion_2](https://github.com/DevBlocks42/Nomade/assets/136115859/e0aca93e-58f5-4a99-8ad1-315b5ed674b9)

![discussion_3](https://github.com/DevBlocks42/Nomade/assets/136115859/10e6d0d3-a098-464b-ba94-37d9fb950b3e)

![discussion_4](https://github.com/DevBlocks42/Nomade/assets/136115859/e79e35be-b149-42e6-9765-60baa6edf105)

![discussion_5](https://github.com/DevBlocks42/Nomade/assets/136115859/122111ce-40b9-4389-9251-5f423d0ff486)

# Diagramme relationnel de la base de données

![db_relationnal_diagram](https://github.com/DevBlocks42/Nomade/assets/136115859/5dbb2879-24a3-47cf-b425-7b4249d45d69)

# Exemple de fonctionnement de la discussion

![Exemple](https://github.com/DevBlocks42/Nomade/assets/136115859/d8f82339-7164-43b2-aaa1-76133c730457)

# Documentation technique des modules

## user.js


`createUserAccount(configEmail, username, email, password, callback)`

`checkRegisterForm(configRegex, username, email, password, passwordConfirm)`

`checkActivation(hash, callback)`

`activateUser(hash, callback)`

`checkPassword(bcrypt, username, password, callback)`

`isActive(username, callback)`

`createUserSession(username, sessionIP)`

`getUserID(username)`

`getUserLoggedIPS(id)`

`async logUserIP(ip, id)`

`changeUsername(username, newName, callback)`

`changeUserEmail(configEmail, username, email)`

`changeUserPassword(bcrypt, username, newPassword)`

`changeUserDescription(username, description)`

`setUserAvatar(username, filePath)`

`deleteUserAccount(username)`

`findUser(username)`

`getUserPasswordHash(userid)`

`getUserName(userid)`

## discussion.js

`createDiscussion(user, fromID, toID, state)`

`discussionExists(fromID, toID)`

`getDiscussionID(fromID, toID)`

`getDiscussionCertificates(discussionID, issuerID, receiverID, callback)`

`addMessage(discussionID, encryptedMessage, callback)`

`getDiscussionMessages(discID)`

`getUserPublicKey(discID, userID)`

`getUserDiscussions(userid)`

`getDiscussionUserIDS(id)`

## database.js

`createConnection()`

## form.js

`print(files = false)`

## mailer.js

`sendMessage(title, message, destination)`










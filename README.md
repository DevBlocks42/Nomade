# Nomade Secured Chat

Nomade est une application web de messagerie instantanée et sécurisée grâce au chiffrement PGP.
Créée avec l'environnement d'exécution NodeJS, elle permet à des utilisateurs inscrits et authentifiés de communiquer de manière confidentielle an chiffrant leurs messages à l'aide de PGP. 
Ainsi, les messages bénéficient de deux couches de chiffrement, l'une inhérente au protocole HTTPS et l'autre grâce à PGP.
Autrement dit, les messages ont au moins une couche de chiffrement lorsqu'ils transittent par le réseau et ne sont jamais stockés en clair dans la base de données.


ATTENTION : L'utilisation de cette application web nécéssite la mise en place d'un certificat SSL/TLS et le protocole HTTPS dans la mesure ou les clefs privées PGP des utilisateurs sont envoyées par le serveur.

# Présentation 

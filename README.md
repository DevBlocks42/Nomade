# Nomade Secured Chat

Nomade est une application web de messagerie instantanée et sécurisée grâce au chiffrement PGP.
Créée avec l'environnement d'exécution NodeJS, elle permet à des utilisateurs inscrits et authentifiés de communiquer de manière confidentielle an chiffrant leurs messages à l'aide de PGP. 
Ainsi, les messages bénéficient de deux couches de chiffrement, l'une inhérente au protocole HTTPS et l'autre grâce à PGP.
Autrement dit, les messages ont au moins une couche de chiffrement lorsqu'ils transittent par le réseau et ne sont jamais stockés en clair dans la base de données.


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

<mxfile host="app.diagrams.net" modified="2023-12-14T16:07:39.911Z" agent="Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0" etag="ACIddpK8dCWJ0FkeMvZH" version="22.1.8" type="device">
  <diagram name="Page-1" id="Hr0r8Cbbp95C8EZxBnPu">
    <mxGraphModel dx="1434" dy="771" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="iNef2An1ivGxDfvHR7-c-1" value="Alice" style="html=1;whiteSpace=wrap;" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="110" height="50" as="geometry" />
        </mxCell>
        <mxCell id="iNef2An1ivGxDfvHR7-c-2" value="Bob" style="html=1;whiteSpace=wrap;" vertex="1" parent="1">
          <mxGeometry x="680" y="40" width="110" height="50" as="geometry" />
        </mxCell>
        <mxCell id="iNef2An1ivGxDfvHR7-c-6" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1" parent="1" source="iNef2An1ivGxDfvHR7-c-3" target="iNef2An1ivGxDfvHR7-c-4">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="iNef2An1ivGxDfvHR7-c-3" value="Serveur" style="html=1;whiteSpace=wrap;" vertex="1" parent="1">
          <mxGeometry x="259" y="750" width="310" height="120" as="geometry" />
        </mxCell>
        <mxCell id="iNef2An1ivGxDfvHR7-c-5" value="" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;" edge="1" parent="1" source="iNef2An1ivGxDfvHR7-c-4" target="iNef2An1ivGxDfvHR7-c-3">
          <mxGeometry relative="1" as="geometry" />
        </mxCell>
        <mxCell id="iNef2An1ivGxDfvHR7-c-4" value="Base de données" style="html=1;whiteSpace=wrap;" vertex="1" parent="1">
          <mxGeometry x="343" y="940" width="141" height="60" as="geometry" />
        </mxCell>
        <mxCell id="iNef2An1ivGxDfvHR7-c-7" value="" style="edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERzeroToMany;endFill=1;rounded=0;entryX=0.5;entryY=1;entryDx=0;entryDy=0;exitX=0;exitY=0.25;exitDx=0;exitDy=0;" edge="1" parent="1" source="iNef2An1ivGxDfvHR7-c-3" target="iNef2An1ivGxDfvHR7-c-1">
          <mxGeometry width="100" height="100" relative="1" as="geometry">
            <mxPoint x="160" y="710" as="sourcePoint" />
            <mxPoint x="460" y="320" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="iNef2An1ivGxDfvHR7-c-8" value="&lt;div style=&quot;font-size: 16px;&quot;&gt;Message chiffré avec la clef publique de Bob&lt;/div&gt;" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" vertex="1" connectable="0" parent="iNef2An1ivGxDfvHR7-c-7">
          <mxGeometry x="0.1758" y="-1" relative="1" as="geometry">
            <mxPoint y="2" as="offset" />
          </mxGeometry>
        </mxCell>
        <mxCell id="iNef2An1ivGxDfvHR7-c-10" value="" style="edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERzeroToMany;endFill=1;rounded=0;exitX=0;exitY=0.25;exitDx=0;exitDy=0;" edge="1" parent="1" source="iNef2An1ivGxDfvHR7-c-3">
          <mxGeometry width="100" height="100" relative="1" as="geometry">
            <mxPoint x="360" y="780" as="sourcePoint" />
            <mxPoint x="340" y="970" as="targetPoint" />
          </mxGeometry>
        </mxCell>
        <mxCell id="iNef2An1ivGxDfvHR7-c-13" value="" style="edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERzeroToMany;endFill=1;rounded=0;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=1;entryY=0.5;entryDx=0;entryDy=0;" edge="1" parent="1" source="iNef2An1ivGxDfvHR7-c-3" target="iNef2An1ivGxDfvHR7-c-4">
          <mxGeometry width="100" height="100" relative="1" as="geometry">
            <mxPoint x="360" y="840" as="sourcePoint" />
            <mxPoint x="640" y="1000" as="targetPoint" />
            <Array as="points">
              <mxPoint x="550" y="990" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="iNef2An1ivGxDfvHR7-c-14" value="" style="edgeStyle=entityRelationEdgeStyle;fontSize=12;html=1;endArrow=ERzeroToMany;endFill=1;rounded=0;" edge="1" parent="1">
          <mxGeometry width="100" height="100" relative="1" as="geometry">
            <mxPoint x="570" y="810" as="sourcePoint" />
            <mxPoint x="740" y="90" as="targetPoint" />
            <Array as="points">
              <mxPoint x="570" y="810" />
              <mxPoint x="560" y="470" />
            </Array>
          </mxGeometry>
        </mxCell>
        <mxCell id="iNef2An1ivGxDfvHR7-c-15" value="Déchiffrement du message d&#39;Alice avec la clef privée de Bob" style="edgeLabel;html=1;align=center;verticalAlign=middle;resizable=0;points=[];" vertex="1" connectable="0" parent="1">
          <mxGeometry x="729.9976949477207" y="19.997267770665303" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>













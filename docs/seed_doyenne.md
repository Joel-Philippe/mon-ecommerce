# Script d'importation Firestore pour La Doyenne

Ce script permet de peupler la base de données Firestore avec les catégories et produits de démonstration pour La Doyenne.

## Comment exécuter le script

### Prérequis
1. Avoir installé Node.js sur votre machine.
2. Avoir accès aux clés Firebase et les données appropriées dans votre environnement.
3. Installer le SDK Firebase Admin:
   ```bash
   npm install firebase-admin
   ```

### Exécution
1. Télécharger le script `seed_doyenne.js`.
2. Dans votre terminal, exécutez la commande suivante :
   ```bash
   node scripts/seed_doyenne.js
   ```

### Fonctionnalités du script
- **Création des catégories :** Le script crée les catégories définies à la racine de la collection `categories`. 
- **Ajout des produits :** Chaque produit est associé à sa catégorie correspondante dans la collection `products`.

### Note
- Le script ne modifie pas les données existantes dans la base de données, il ajoute uniquement de nouvelles entrées.

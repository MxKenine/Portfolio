# Portfolio — Quentin DUPREY

Site portfolio professionnel et dynamique, développé avec la stack MERN dans le cadre de la préparation du titre professionnel Développeur Web et Web Mobile (Fabrique Numérique Paloise).

Le site comprend une partie publique (présentation, projets, compétences/CV) et une partie administration protégée permettant de gérer dynamiquement le contenu du site.

## Stack technique

- **Frontend** : React (Vite), react-router-dom, Tailwind CSS, Daisyui, lucide-react
- **Backend** : Node.js, Express, Mongoose
- **Base de données** : MongoDB (MongoDB Atlas)
- **Authentification** : JWT, bcrypt
- **Stockage des images** : Cloudinary (via multer-storage-cloudinary)
- **Envoi d'emails** : Nodemailer
- **Déploiement** : Render.com (Web Service pour l'API, Static Site pour le frontend)

## Structure du projet

```
Projet-Portfolio/
├── client/          # Application React (Vite)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── .env
└── api/             # API Express
    ├── models/      # Schémas Mongoose (User, CV, Projet)
    ├── routes/
    ├── middlewares/ # verifyToken, upload (Multer/Cloudinary)
    └── .env
```

## Prérequis

- Node.js (v18 ou supérieur recommandé)
- Un compte [MongoDB Atlas](https://www.mongodb.com/atlas) et un cluster configuré
- Un compte [Cloudinary](https://cloudinary.com/) pour le stockage des images
- Un compte email applicatif pour l'envoi via Nodemailer (ex. Gmail avec mot de passe d'application)

## Installation en local

1. Cloner le dépôt :
   ```bash
   git clone <url-du-repo>
   cd Projet-Portfolio
   ```

2. Installer les dépendances du frontend :
   ```bash
   cd client
   npm install
   ```

3. Installer les dépendances du backend :
   ```bash
   cd ../api
   npm install
   ```

4. Créer les fichiers `.env` (voir section ci-dessous) dans `client/` et `api/`.

5. Lancer le backend :
   ```bash
   cd api
   npm run dev
   ```

6. Lancer le frontend (dans un autre terminal) :
   ```bash
   cd client
   npm run dev
   ```

Le site est alors accessible sur `http://localhost:5173` (ou le port indiqué par Vite), et l'API sur `http://localhost:3000` (ou le port défini dans `.env`).

## Variables d'environnement

### `api/.env`

```
PORT=3000
MONGODB_URI=<uri-de-connexion-mongodb-atlas>
JWT_SECRET=<clé-secrète-jwt>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
EMAIL_USER=<adresse-email-expéditrice>
EMAIL_PASS=<mot-de-passe-application>
```

### `client/.env`

```
VITE_BACK_URL=http://localhost:3000
```

⚠️ Ces fichiers `.env` ne doivent jamais être commités sur Git (ils sont inclus dans `.gitignore`).

## Fonctionnalités

- Consultation publique du profil, des projets et des compétences/CV
- Inscription et connexion (rôle `user` par défaut, validation du compte par email)
- Espace administrateur protégé (rôle `admin`, attribué manuellement en base) :
  - Gestion du profil et du CV (expériences, compétences, langues)
  - Gestion des projets (création, modification, suppression)
  - Upload d'images via Cloudinary
- Sécurité : mots de passe hachés (bcrypt), authentification par JWT, contrôle du rôle sur les routes sensibles

## Déploiement

Le projet est déployé sur [Render.com](https://render.com) :
- un **Web Service** pour l'API
- un **Static Site** pour le frontend

Chaque mise à jour du dépôt GitHub déclenche automatiquement un redéploiement.

## Guide d'utilisation de l'espace administrateur

1. Se rendre sur `/login` et se connecter avec un compte disposant du rôle `admin`
2. Depuis la sidenavbar de l'administration, accéder à la section souhaitée (Profil / CV / Projets)
3. Modifier les champs pré-remplis puis valider le formulaire pour enregistrer les changements
4. Pour ajouter un projet : renseigner le titre, la description, les tags, le lien, et téléverser une image (stockée automatiquement sur Cloudinary)
5. Pour supprimer un élément : utiliser le bouton de suppression associé, avec confirmation

## Auteur

Quentin DUPREY — projet réalisé dans le cadre du titre professionnel Développeur Web et Web Mobile, Fabrique Numérique Paloise (2026).
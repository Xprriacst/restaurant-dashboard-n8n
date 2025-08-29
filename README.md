# 🍽️ n8n Restaurant Data Processing Workflow

Un workflow n8n complet pour traiter automatiquement les données de restaurants avec scraping web et génération de descriptions IA.

## 📋 Vue d'ensemble

Ce projet automatise le traitement de données de restaurants haut de gamme ($100+) depuis Google Sheets, incluant :
- **Web scraping** des sites web des restaurants
- **Génération de descriptions marketing** via IA (Claude)
- **Interface web** pour visualiser les résultats en temps réel
- **API de test** pour développement et debugging

## 🏗️ Architecture

```
Google Sheets → Filtrage → Scraping Web → IA → API → Dashboard
     ↓              ↓           ↓        ↓     ↓        ↓
  Restaurants   $100+ only   HTML    Claude  HTTP   Interface
   (source)    (filtering)  (data)   (desc)  (API)    (web)
```

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v14+)
- n8n installé
- Comptes API : Claude (Anthropic), Google Sheets
- ngrok (pour tunnel local)

### Installation

1. **Cloner le repo**
```bash
git clone <repo-url>
cd Food-good-extraction
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer l'API de test**
```bash
npm start
```

4. **Exposer via ngrok** (nouveau terminal)
```bash
ngrok http 3000
```

5. **Importer le workflow dans n8n**
- Importer `workflow-corrected.json`
- Configurer les credentials (Google Sheets, Claude)
- Mettre à jour l'URL API avec l'URL ngrok

## 📁 Structure du Projet

```
├── workflow-corrected.json    # Workflow n8n corrigé
├── test-api.js               # API Express pour tests
├── public/
│   └── index.html           # Dashboard web
├── package.json             # Dépendances Node.js
└── README.md               # Documentation
```

## 🔧 Configuration

### Workflow n8n
- **Trigger** : Quotidien à 9h00
- **Source** : Google Sheets "restaurant_US"
- **Filtrage** : Restaurants $100+ uniquement
- **Limite test** : 2 restaurants (à changer pour production)

### API Endpoints
- `POST /restaurants` - Recevoir données restaurant
- `GET /api/restaurants` - Récupérer tous les restaurants
- `GET /stats` - Statistiques de l'API
- `GET /` - Dashboard web

## 🎯 Fonctionnalités

### Web Scraping
- Extraction du contenu HTML (body, menu, about)
- Récupération des images
- Meta descriptions
- Timeout 10s par site
- Gestion des erreurs (sites protégés, etc.)

### Génération IA
- **Modèle** : Claude 3.5 Haiku
- **Style** : Descriptions marketing premium en français
- **Format** : 3-4 phrases évocatrices
- **Fallback** : Description par défaut si pas de site web

### Dashboard Web
- **Temps réel** : Auto-refresh 30s
- **Statistiques** : Total, note moyenne, sites web
- **Design responsive** : Mobile et desktop
- **Cartes élégantes** : Affichage par restaurant

## 🔍 Debugging

### Logs API
L'API affiche des logs détaillés :
```
🔍 [timestamp] POST /restaurants
📋 Headers: {...}
📦 Body: {...}
✅ Restaurant reçu: [nom] - [ville]
```

### Interface de monitoring
- Dashboard web : `http://localhost:3000`
- Interface ngrok : `http://127.0.0.1:4040`

## 🛠️ Corrections Appliquées

### Problèmes résolus
- ✅ Mapping des champs (Title vs title)
- ✅ Configuration des nœuds Set vides
- ✅ Gestion d'erreurs moderne (onError)
- ✅ Expressions n8n corrigées
- ✅ Tunnel ngrok pour connectivité

### Performance
- **Traitement** : ~3-5 sec/restaurant
- **Total 19 restaurants** : ~2-3 minutes
- **Batch size** : 5 restaurants/lot

## 📊 Données Traitées

### Format d'entrée (Google Sheets)
```json
{
  "Title": "Nom du restaurant",
  "Address": "Adresse complète",
  "City": "Ville",
  "Website": "URL du site",
  "Price_Range": "$100+",
  "Ratings": 4.6,
  "Reviews": 4540
}
```

### Format de sortie (API)
```json
{
  "title": "Nom du restaurant",
  "address": "Adresse complète",
  "city": "Ville",
  "website": "URL du site",
  "description": "Description IA générée",
  "images": "URLs des images",
  "price_range": "$100+",
  "ratings": 4.6,
  "reviews": 4540
}
```

## 🚦 Production

### Avant mise en production
1. **Changer la limite** de 2 à 50 restaurants
2. **Remplacer l'URL ngrok** par une API permanente
3. **Ajouter authentification** si nécessaire
4. **Configurer monitoring** et alertes

### Scaling
- Base de données persistante (MongoDB, PostgreSQL)
- Queue system (Redis, Bull)
- Load balancing
- Caching (Redis)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📝 License

MIT License - voir LICENSE file pour détails.

## 🆘 Support

Pour questions et support :
- Issues GitHub
- Documentation n8n
- Documentation Claude API

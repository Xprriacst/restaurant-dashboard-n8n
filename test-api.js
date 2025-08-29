const express = require('express');
const app = express();
const port = 3000;

// Stockage en mémoire des restaurants reçus
let receivedRestaurants = [];

// Middleware pour parser le JSON
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static('public'));

// Middleware pour logger toutes les requêtes
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`\n🔍 [${timestamp}] ${req.method} ${req.path}`);
    console.log('📋 Headers:', JSON.stringify(req.headers, null, 2));
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('📦 Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Endpoint principal pour recevoir les données restaurant
app.post('/restaurants', (req, res) => {
    const timestamp = new Date().toISOString();
    
    try {
        // Validation basique des données
        const requiredFields = ['title', 'address', 'city'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            console.log(`❌ Champs manquants: ${missingFields.join(', ')}`);
            return res.status(400).json({
                error: 'Missing required fields',
                missing: missingFields,
                timestamp
            });
        }

        // Stocker le restaurant reçu
        const restaurantData = {
            id: `rest_${Date.now()}`,
            received_at: timestamp,
            ...req.body
        };
        receivedRestaurants.push(restaurantData);

        // Log des données reçues
        console.log('✅ Restaurant reçu:');
        console.log(`   📍 ${req.body.title} - ${req.body.city}`);
        console.log(`   💰 ${req.body.price_range || 'N/A'}`);
        console.log(`   ⭐ ${req.body.ratings || 'N/A'} (${req.body.reviews || 0} avis)`);
        console.log(`   🌐 ${req.body.website || 'Pas de site'}`);
        console.log(`   📝 Description: ${req.body.description ? req.body.description.substring(0, 100) + '...' : 'N/A'}`);
        console.log(`   🖼️  Images: ${req.body.images ? (Array.isArray(req.body.images) ? req.body.images.length : 1) : 0}`);

        // Simulation d'un traitement réussi
        const response = {
            success: true,
            message: 'Restaurant data received successfully',
            id: restaurantData.id,
            processed_at: timestamp,
            total_received: receivedRestaurants.length,
            data: {
                title: req.body.title,
                city: req.body.city,
                status: 'processed'
            }
        };

        res.status(200).json(response);
        console.log('✅ Réponse envoyée: 200 OK');

    } catch (error) {
        console.log('❌ Erreur lors du traitement:', error.message);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message,
            timestamp
        });
    }
});

// Endpoint pour simuler des erreurs (utile pour tester la gestion d'erreurs)
app.post('/restaurants/error', (req, res) => {
    console.log('🔥 Simulation d\'erreur demandée');
    res.status(500).json({
        error: 'Simulated server error',
        message: 'This is a test error for workflow debugging',
        timestamp: new Date().toISOString()
    });
});

// Endpoint pour récupérer tous les restaurants reçus
app.get('/api/restaurants', (req, res) => {
    res.json({
        total: receivedRestaurants.length,
        restaurants: receivedRestaurants.reverse() // Plus récents en premier
    });
});

// Endpoint pour les statistiques
app.get('/stats', (req, res) => {
    res.json({
        server: 'Test API for n8n workflow',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        total_restaurants_received: receivedRestaurants.length,
        endpoints: [
            'POST /restaurants - Receive restaurant data',
            'POST /restaurants/error - Simulate error',
            'GET /api/restaurants - Get all received restaurants',
            'GET /stats - This endpoint'
        ]
    });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
    console.log(`❓ Route non trouvée: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Endpoint not found',
        available_endpoints: [
            'POST /restaurants',
            'POST /restaurants/error',
            'GET /stats'
        ]
    });
});

// Démarrage du serveur
app.listen(port, '0.0.0.0', () => {
    console.log('🚀 API de test démarrée!');
    console.log(`📡 Serveur accessible sur:`);
    console.log(`   - Local: http://localhost:${port}`);
    console.log(`   - Réseau: http://192.168.1.20:${port}`);
    console.log('📋 Endpoints disponibles:');
    console.log('   POST http://192.168.1.20:3000/restaurants');
    console.log('   POST http://192.168.1.20:3000/restaurants/error');
    console.log('   GET  http://192.168.1.20:3000/stats');
    console.log('\n⚡ En attente des requêtes de votre workflow n8n...\n');
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
    console.log('\n🛑 Arrêt du serveur...');
    process.exit(0);
});

// ============================================================
// TechShop Backend — Peuplement initial de la base de données
// Fichier : config/seed.js
// Usage   : node config/seed.js
// ============================================================

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const connectDB = require('./db');

const User     = require('../models/User');
const Category = require('../models/Category');
const Product  = require('../models/Product');

const categoriesSeed = [
  { nom: 'Smartphones',        slug: 'smartphones',     icone: '📱', ordre: 1 },
  { nom: 'Ordinateurs',        slug: 'ordinateurs',     icone: '💻', ordre: 2 },
  { nom: 'Casques Audio',      slug: 'casques',         icone: '🎧', ordre: 3 },
  { nom: 'Montres Connectées', slug: 'montres',         icone: '⌚', ordre: 4 },
  { nom: 'Appareils Photo',    slug: 'appareils-photo', icone: '📷', ordre: 5 },
];

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Démarrage du seed...');

    // Nettoyage
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
    ]);
    console.log('🗑️  Collections nettoyées');

    // ---- Admin & Client de test ----------------------------
    const motDePasse = await bcrypt.hash('Admin@2025', 12);
    await User.create([
      {
        nom: 'NDAO', prenom: 'Boundia',
        email: 'admin@techshop.sn',
        motDePasse,
        role: 'admin',
      },
      {
        nom: 'DIABY', prenom: 'Fatoumata',
        email: 'client@techshop.sn',
        motDePasse: await bcrypt.hash('Client@2025', 12),
        role: 'client',
      },
    ]);
    console.log('👤 Utilisateurs créés');

    // ---- Catégories ----------------------------------------
    const cats = await Category.insertMany(categoriesSeed);
    const catMap = Object.fromEntries(cats.map(c => [c.slug, c._id]));
    console.log('📂 Catégories créées');

    // ---- Produits ------------------------------------------
    const produitsSeed = [
      {
        nom: 'iPhone 15 Pro', prix: 785000, stock: 15, badge: 'Nouveau',
        description: 'Le dernier iPhone avec puce A17 Pro, système de caméra pro avec zoom optique 5x, titane de qualité aérospatiale et écran Super Retina XDR 6,1".',
        categorie: catMap['smartphones'], vedette: true,
        note: 4.8, nombreAvis: 324,
        images: [{ url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80', principale: true }],
        specifications: new Map([['Processeur','Apple A17 Pro'],['Écran','6,1" Super Retina XDR'],['Stockage','256 Go'],['Batterie','3274 mAh'],['OS','iOS 17']]),
      },
      {
        nom: 'Samsung Galaxy S24 Ultra', prix: 885000, stock: 8, badge: 'Best-seller',
        description: 'Smartphone haut de gamme avec stylet S Pen intégré, écran Dynamic AMOLED 6,8" et quadruple caméra 200 MP.',
        categorie: catMap['smartphones'], vedette: false,
        note: 4.7, nombreAvis: 218,
        images: [{ url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80', principale: true }],
        specifications: new Map([['Processeur','Snapdragon 8 Gen 3'],['Écran','6,8" Dynamic AMOLED'],['Stockage','512 Go']]),
      },
      {
        nom: 'MacBook Pro 14" M3', prix: 1310000, stock: 5, badge: 'Top rated',
        description: 'MacBook Pro avec puce M3, écran Liquid Retina XDR 14,2" et jusqu\'à 18h d\'autonomie.',
        categorie: catMap['ordinateurs'], vedette: true,
        note: 4.9, nombreAvis: 156,
        images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', principale: true }],
        specifications: new Map([['Processeur','Apple M3'],['RAM','18 Go'],['Stockage','512 Go SSD']]),
      },
      {
        nom: 'Dell XPS 15', prix: 1050000, stock: 12, badge: null,
        description: 'Laptop premium avec écran OLED 4K 15,6", Intel Core i7 et NVIDIA RTX 4060.',
        categorie: catMap['ordinateurs'], vedette: false,
        note: 4.6, nombreAvis: 89,
        images: [{ url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80', principale: true }],
        specifications: new Map([['Processeur','Intel Core i7-13700H'],['RAM','32 Go DDR5'],['GPU','NVIDIA RTX 4060']]),
      },
      {
        nom: 'Sony WH-1000XM5', prix: 230000, stock: 20, badge: 'Best-seller',
        description: 'Casque over-ear avec la meilleure réduction de bruit du marché et 30h d\'autonomie.',
        categorie: catMap['casques'], vedette: true,
        note: 4.8, nombreAvis: 542,
        images: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80', principale: true }],
        specifications: new Map([['Type','Over-ear sans fil'],['Autonomie','30 heures'],['Bluetooth','5.2']]),
      },
      {
        nom: 'Apple Watch Series 9', prix: 282000, stock: 18, badge: 'Nouveau',
        description: 'Apple Watch Series 9 avec puce S9, écran Always-On 2000 nits et suivi santé complet.',
        categorie: catMap['montres'], vedette: true,
        note: 4.7, nombreAvis: 287,
        images: [{ url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80', principale: true }],
        specifications: new Map([['Processeur','Apple S9'],['Autonomie','18 heures'],['Étanchéité','50 mètres']]),
      },
      {
        nom: 'Sony Alpha 7 IV', prix: 1835000, stock: 3, badge: 'Pro',
        description: 'Appareil photo hybride plein format 33 MP, autofocus temps réel et vidéo 4K 60fps.',
        categorie: catMap['appareils-photo'], vedette: false,
        note: 4.9, nombreAvis: 64,
        images: [{ url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', principale: true }],
        specifications: new Map([['Capteur','Plein format 33 MP'],['Vidéo','4K 60fps'],['Stabilisation','5 axes IBIS']]),
      },
      {
        nom: 'AirPods Pro 2e génération', prix: 184000, stock: 25, badge: null,
        description: 'Écouteurs true wireless avec puce H2, réduction de bruit active 2x plus puissante.',
        categorie: catMap['casques'], vedette: false,
        note: 4.6, nombreAvis: 413,
        images: [{ url: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&q=80', principale: true }],
        specifications: new Map([['Type','In-ear True Wireless'],['Autonomie','6h + 24h (boîtier)'],['Résistance','IPX4']]),
      },
    ];

    await Product.insertMany(produitsSeed);
    console.log('📦 Produits créés');

    console.log('\n✅ Seed terminé avec succès !');
    console.log('🔑 Admin    : admin@techshop.sn   / Admin@2025');
    console.log('👤 Client   : client@techshop.sn  / Client@2025');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur seed :', err.message);
    process.exit(1);
  }
};

seed();

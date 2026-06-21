// ============================================================
// TechShop Backend — Contrôleur Authentification
// Fichier : controllers/authController.js
// ============================================================

const User        = require('../models/User');
const { genererToken } = require('../middleware/auth');
const { AppError }    = require('../middleware/errorHandler');

// ---- POST /api/auth/inscription -----------------------------
const inscription = async (req, res, next) => {
  try {
    const { nom, prenom, email, motDePasse } = req.body;

    // Vérifier si l'email existe déjà
    const existe = await User.findOne({ email: email.toLowerCase().trim() });
    if (existe) {
      return next(new AppError('Cet email est déjà associé à un compte.', 400));
    }

    // Créer l'utilisateur (hachage géré par le middleware Mongoose)
    const user = await User.create({ nom, prenom, email, motDePasse });

    const token = genererToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Compte créé avec succès.',
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// ---- POST /api/auth/connexion -------------------------------
const connexion = async (req, res, next) => {
  try {
    const { email, motDePasse } = req.body;

    if (!email || !motDePasse) {
      return next(new AppError('Email et mot de passe requis.', 400));
    }

    // Récupérer l'utilisateur avec le mot de passe (select: false par défaut)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+motDePasse');

    if (!user || !user.actif) {
      return next(new AppError('Identifiants invalides.', 401));
    }

    const valide = await user.comparerMotDePasse(motDePasse);
    if (!valide) {
      return next(new AppError('Identifiants invalides.', 401));
    }

    const token = genererToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Connexion réussie.',
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// ---- GET /api/auth/moi -------------------------------------
const moi = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return next(new AppError('Utilisateur introuvable.', 404));

    res.status(200).json({
      success: true,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// ---- PUT /api/auth/profil ----------------------------------
const mettreAJourProfil = async (req, res, next) => {
  try {
    const { nom, prenom, telephone, adresse } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { nom, prenom, telephone, adresse },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour.',
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
};

// ---- PUT /api/auth/changer-mot-de-passe -------------------
const changerMotDePasse = async (req, res, next) => {
  try {
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;

    const user = await User.findById(req.user._id).select('+motDePasse');
    const valide = await user.comparerMotDePasse(ancienMotDePasse);

    if (!valide) {
      return next(new AppError('Ancien mot de passe incorrect.', 400));
    }

    user.motDePasse = nouveauMotDePasse;
    await user.save();

    const token = genererToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Mot de passe modifié avec succès.',
      token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { inscription, connexion, moi, mettreAJourProfil, changerMotDePasse };

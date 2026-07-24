# CLIM & TV30 — Site vitrine

Site statique HTML / CSS / JS pour l'entreprise CLIM & TV30 (Saint-Hippolyte-du-Fort).

## Structure

```
├── index.html         # Page unique du site
├── styles.css         # Design system + composants
├── script.js          # Interactions (menu, filtres, lightbox, Google Reviews)
└── images/
    ├── models/        # Photos des modèles de climatisation
    └── *.jpg          # Photos des chantiers réels
```

## Activer les vrais avis Google

Par défaut, la section « Avis clients » affiche 3 témoignages de démonstration. Pour afficher automatiquement les vrais avis Google de l'établissement, il faut :

### 1. Obtenir une clé API Google Places

1. Va sur https://console.cloud.google.com/
2. Crée un projet (ou sélectionne-en un existant)
3. Active l'API **Places API (New)** dans le menu « APIs & Services » → « Library »
4. Crée une clé API : « Credentials » → « Create Credentials » → « API Key »
5. **Important** : restreins la clé à ton domaine
   - Application restrictions → **HTTP referrers**
   - Ajoute tes domaines : `climtv30.com/*`, `www.climtv30.com/*`, `jordanvalente.github.io/*`
   - API restrictions → **Places API (New)** uniquement

⚠️ La facturation doit être activée sur le projet. Google offre un crédit gratuit ; en usage normal pour un petit site vitrine, le coût reste à 0 €.

### 2. Trouver le Place ID de CLIM & TV30

- Ouvre https://developers.google.com/maps/documentation/places/web-service/place-id
- Cherche « Clim & TV30 Saint-Hippolyte-du-Fort »
- Copie le Place ID (format `ChIJxxxxxxxxxxxxxxx`)

### 3. Coller les valeurs dans `index.html`

Cherche ce bloc à la fin du fichier `index.html` :

```html
<script>
    window.GOOGLE_REVIEWS_CONFIG = {
        apiKey:  'REMPLACER_PAR_CLE_API_GOOGLE',
        placeId: 'REMPLACER_PAR_PLACE_ID'
    };
</script>
```

Remplace les deux chaînes par tes vraies valeurs, commit, push. Les avis Google se chargent alors automatiquement au scroll (avec note globale, nombre d'avis, lien vers Google).

### Fallback

Si la clé n'est pas configurée, ou si l'API est indisponible, les 3 avis de démonstration restent affichés — le site n'est jamais cassé.

## Déploiement

Le site est statique — aucun serveur nécessaire. Options :

- **GitHub Pages** : `Settings → Pages → Deploy from branch main / root`
- **Netlify / Vercel** : déploiement auto à chaque push
- **Hébergement classique** : upload FTP des fichiers

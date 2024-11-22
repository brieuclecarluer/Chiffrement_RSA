function genererCles(p, q) {
    //debugage à cause de problemes lors des tests
    //on verifie si p et q sont premiers
    //c'est possible de changer leur valeur pour tester plus bas sur cette page
    if (!estPremier(p) || !estPremier(q)) {
        throw new Error("Les valeurs de p et q doivent être des nombres premiers.");
    }
    //on verifie si p et q sont differents et du coup n est different de 0
    if (p === q) {
        throw new Error("p et q doivent être différents.");
    }
    const n = p * q;
    const phi = (p - 1) * (q - 1);

    //generer un nombre aléatoire(pour les points bonus)
    //on commence par 3 car 1 n'est pas premier et 2 n'est pas securisé
    let K_pub = genererNombreAleatoire(3, phi - 1);
    //le pgcd de K_pub et phi doit etre 1 pour etre premier 
    while (pgcd(K_pub, phi) !== 1) {
        K_pub = genererNombreAleatoire(3, phi - 1);
    }

    const K_priv = modInverse(K_pub, phi);

    return {
        clePublique: { K_pub, n },
        clePrivee: { K_priv, n },
    };
}

// Fonction pour générer un nombre entier aléatoire, 
//ca simplifie l'implementation d'un nombre aleatoire premier avec phi
function genererNombreAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//On verifie si le nombre est premier pour p et q   
function estPremier(nombre) {
    if (nombre <= 1) return false;
    for (let i = 2; i <= Math.sqrt(nombre); i++) {
        if (nombre % i === 0) return false;
    }
    return true;
}

//PGCD du premier cours
function pgcd(a, b) {
    while (b !== 0) {
        const reste = a % b;
        a = b;
        b = reste;
    }
    return a;
}

//fonction pour trouver l'inverse modulaire du premier cours
//Modification de la fonction pour qu'elle retourne un nombre positif, 
//j'ai ajouté une condition pour vérifier si x1 est négatif car 
//l'inverse modulaire est incorrect si le dernier calcul de x1 dépasse les bornes.
function modInverse(a, mod) {
    let [m0, t, q] = [mod, 0, 0];
    let [x0, x1] = [0, 1];
    if (mod === 1) {
        return 0; // L'inverse modulaire de 1 est 0
    }
    while (a > 1) {
        q = Math.floor(a / mod);
        [a, mod] = [mod, a % mod]; // On met à jour a et mod
        [x0, x1] = [x1 - q * x0, x0]; // On calcule les coefficients de Bézout
    }
    return x1 < 0 ? x1 + m0 : x1; // Si x1 est négatif, on ajoute donc m0 pour obtenir un résultat positif
}

// fonction pour l'exponentiation modulaire à l'aide du cours 
function exponentiationModulaire(base, exposant, mod) {
    if (mod === 1) return 0; // Toute puissance mod 1 est 0
    if (exposant < 0) {
        base = modInverse(base, mod); // Si l'exposant est négatif, on inverse la base et rend l'exposant positif
        exposant = -exposant;
    }
    let resultat = 1; // Le résultat initial est 1
    base = base % mod; // Réduit la base modulo mod pour éviter des nombres trop grands
    while (exposant > 0) {
        if (exposant % 2 === 1) {
            resultat = (resultat * base) % mod; // Si l'exposant est impair, on multiplie par la base
        }
        exposant = Math.floor(exposant / 2); // Réduit l'exposant en le divisant par 2
        base = (base * base) % mod; // On élève la base au carré modulo mod
    }
    return resultat;
}

// Fonction de chiffrement
function chiffrer(message, clePublique) {
    const { K_pub, n } = clePublique;
    if (message >= n) {
        throw new Error("Le message doit être inférieur à n.");
        //Le message doit être inférieur à n sinon le modulo marche pas
    }
    return exponentiationModulaire(message, K_pub, n);
}

// Fonction de déchiffrement
function dechiffrer(chiffre, clePrivee) {
    const { K_priv, n } = clePrivee;
    return exponentiationModulaire(chiffre, K_priv, n);
}

// Test du code
const p = 61; //si modification de p et q:
const q = 53; // verfier que p et q sont premiers sinon une erreur sera renvoyée
const cles = genererCles(p, q);

const message = 42; 
const chiffre = chiffrer(message, cles.clePublique);
const dechiffre = dechiffrer(chiffre, cles.clePrivee);

console.log("Cle publique :", cles.clePublique);
console.log("Cle privé :", cles.clePrivee);
console.log("Message :", message);
console.log("Message chiffré :", chiffre);
console.log("Message déchiffré :", dechiffre);

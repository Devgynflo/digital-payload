# Mise en place du payload CMS

1. Création du fichier server.ts
2. Appel de la fonction getPayloadClient()
3. Configuration du payload.config avec notamment la partie route , les meta et le connecteur mongoose
4. Utilisation et création du fichier next-utils
5. Extension du tsconfig.server.json
6. Création du nodemon et utilisation dans le script

En résume installation des package

```
npm i cross-env dotenv express payload ts-node nodemon
```

et les dépendances

```
npm i @types/express @payloadcms/bundler-webpack @payloadcms/db-mongodb @payloadcms/richtext-slate
```

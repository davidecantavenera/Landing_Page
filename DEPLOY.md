# 🚀 Deploy su GitHub Pages

## File da caricare su GitHub

Carica questi file e cartelle:

```
✅ DA CARICARE:
├── index.html
├── README.md
├── .gitignore
├── assets/
│   ├── css/
│   ├── js/
│   ├── img/
│   └── files/
├── _posts/
├── blog/
│   ├── editor.html
│   ├── build-blog.js
│   └── README.md
├── package.json
├── package-lock.json
└── github-repos.js

❌ NON CARICARE:
├── node_modules/     (troppo grande, si rigenera con npm install)
├── *.bak*            (file di backup)
└── .DS_Store         (già nel .gitignore)
```

## Setup GitHub Pages

### 1. Crea il repository
```bash
# Nella cartella del progetto
git init
git add .
git commit -m "Initial commit: Personal academic website"
```

### 2. Crea repo su GitHub
- Vai su github.com
- Crea nuovo repository: `tuousername.github.io` (per sito principale)
  - Oppure: `nome-progetto` (per sito progetto)
- NON inizializzare con README

### 3. Collega e pusha
```bash
git remote add origin https://github.com/tuousername/tuousername.github.io.git
git branch -M main
git push -u origin main
```

### 4. Attiva GitHub Pages
- Vai su Settings > Pages
- Source: Deploy from a branch
- Branch: main / (root)
- Save

Il sito sarà disponibile su: `https://tuousername.github.io`

## Workflow per aggiornamenti

### Aggiungere un nuovo post
1. Apri `blog/editor.html` nel browser
2. Scrivi il post
3. Salva il file `.md` in `_posts/`
4. Esegui: `npm run build:blog`
5. Commit e push:
```bash
git add .
git commit -m "Add new blog post"
git push
```

### Aggiornare le repository
```bash
npm run update:repos
git add index.html
git commit -m "Update GitHub repositories"
git push
```

## GitHub Actions (Opzionale - Automatico)

Vuoi automatizzare il build del blog? Crea `.github/workflows/build-blog.yml`:

```yaml
name: Build Blog

on:
  push:
    paths:
      - '_posts/**'
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm install
        
      - name: Build blog
        run: npm run build:blog
        
      - name: Update repos
        run: npm run update:repos
        
      - name: Commit changes
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add index.html
          git diff --quiet && git diff --staged --quiet || git commit -m "Auto-update blog and repos"
          
      - name: Push changes
        uses: ad-m/github-push-action@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          branch: main
```

Con questo, ogni volta che aggiungi un post in `_posts/`, GitHub lo processa automaticamente!

## Note importanti

1. **Prima del deploy**: Esegui `npm run build:blog` per generare i post
2. **node_modules**: Non caricare su GitHub (è nel .gitignore)
3. **Dominio custom**: Puoi aggiungere un dominio personalizzato in Settings > Pages
4. **HTTPS**: GitHub Pages fornisce HTTPS automaticamente
5. **Tempo deploy**: Ci vogliono 1-2 minuti dopo il push

## Troubleshooting

**Il sito non si vede?**
- Controlla Settings > Pages che sia attivo
- Aspetta 2-3 minuti dopo il primo push
- Verifica che `index.html` sia nella root

**I post non appaiono?**
- Esegui `npm run build:blog` prima di pushare
- Verifica che i file `.md` siano in `_posts/`

**Le repo non si aggiornano?**
- Esegui `npm run update:repos` manualmente
- Oppure usa GitHub Actions per automatizzare

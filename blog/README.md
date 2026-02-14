# 📝 Blog System

Questa cartella contiene tutti i file per gestire il blog.

## File

- **editor.html** - Editor visuale per creare nuovi post
- **build-blog.js** - Script che converte Markdown in HTML

## Come usare

1. **Creare un nuovo post:**
   - Apri `blog/editor.html` nel browser
   - Scrivi il post con preview in tempo reale
   - Clicca "Salva Post"
   - Sposta il file scaricato in `_posts/`
   - Il blog si aggiorna automaticamente!

2. **Il watch è attivo:**
   - Monitora automaticamente la cartella `_posts/`
   - Ogni modifica rigenera il blog istantaneamente

## Comandi

```bash
# Genera il blog manualmente
npm run build:blog

# Avvia il watch automatico (già attivo)
npm run watch:blog
```

## Struttura Post

I post devono avere questo formato:

```markdown
---
title: "Titolo del Post"
date: 2024-02-14
excerpt: "Breve descrizione"
---

# Contenuto

Il tuo contenuto in Markdown...
```

L'ora e timezone vengono aggiunte automaticamente al momento della pubblicazione.

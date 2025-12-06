# Luffarschack

Ett fem-i-rad-spel byggt med React och Vite.

## Funktioner

- 🎮 30×30 spelplan
- 🤖 AI-motståndare med Minimax-algoritm
- 👥 Spelare vs Spelare-läge
- ✨ Modern, responsiv design

## Utveckling

```bash
# Installera beroenden
npm install

# Starta utvecklingsserver
npm run dev

# Bygg för produktion
npm run build

# Förhandsgranska produktionsbygge
npm run preview
```

## Deploy till Coolify

Projektet är konfigurerat för Coolify med Nixpacks.

### Steg

1. Pusha koden till GitHub/GitLab
2. I Coolify, skapa en ny "Application"
3. Välj ditt repo och branch
4. Build Pack: **Nixpacks** (auto-detekteras)
5. Sätt port till **3000** (eller annan om du ändrat `PORT`)
6. Klicka Deploy

### Manuella inställningar (om det behövs)

- **Build Command:** `npm run build`
- **Start Command:** `npm run start`
- **Port:** `3000`

Projektet inkluderar `nixpacks.toml` som konfigurerar allt automatiskt.


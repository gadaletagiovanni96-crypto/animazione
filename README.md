# Gestionale Animazione

Stack: React 18 + React Router · Node/Express · MongoDB (Mongoose) · Zod · JWT

## Struttura
server/src
  config/       env + connessione DB
  models/       schemi Mongoose (User, Event, Material, Period, Availability, Notification)
  validators/   schemi Zod per body/query
  middleware/   authenticate, requireRole, validate, errorHandler
  routes/       un router per risorsa, montati in routes/index.js
  controllers/  strato HTTP sottile (req → service → res)
  services/     logica di dominio (conflitti, notifiche, quantità materiale)
  utils/        ApiError, asyncHandler, costanti
client/src
  api/          client HTTP + moduli per risorsa
  context/      AuthContext
  hooks/        useAsync, useNotifications
  routes/       AppRouter + ProtectedRoute (guard per ruolo)
  layouts/      MainLayout
  pages/        una pagina per route
  components/   ui/, layout/, events/

## Regole di dominio
- Evento confermato ✅ = materiale "sistemato" + presa visione del responsabile dell'evento. Se cambiano materiale o data, "sistemato" torna a falso; se cambiano data/ora/luogo le prese visione si azzerano.
- Ruoli: animatore · responsabile (gestisce eventi, squadre, materiale, apre i periodi) · titolare (tutto ciò che fa il responsabile + vede le disponibilità di tutti + può rimuoverle + gestisce gli account titolare).
- Periodo di disponibilità = giorni da compilare + termine per rispondere. Fino al termine ognuno modifica liberamente le proprie risposte (disponibile / non disponibile, anche per un intervallo di giorni con motivo).
  Dopo il termine si può solo AGGIUNGERE disponibilità: non si toglie e non si segna indisponibilità. Solo il titolare può rimuovere la risposta di un'altra persona (che viene avvisata).
- Le risposte (anche indisponibile) compaiono nella composizione della squadra. Al primo avvio l'admin esistente viene promosso a titolare.

## Google Calendar (opzionale)
Ogni impegno viene creato/aggiornato/eliminato su un calendario Google condiviso dell'agenzia (titolo, orario, luogo, squadra, materiale).
1. Google Cloud Console → nuovo progetto → abilita "Google Calendar API".
2. Crea un Service Account → chiave JSON → salvala in server/google-service-account.json (NON committarla).
3. Su Google Calendar crea un calendario "Agenzia" → Impostazioni → Condividi con → email del service account → permesso "Apporta modifiche agli eventi".
4. Copia l'ID calendario in GOOGLE_CALENDAR_ID (.env). Se le variabili sono vuote la sincronizzazione è disattivata.
5. Ogni animatore aggiunge il calendario sul proprio telefono (Google Calendar → "Iscriviti al calendario").
La sync è a senso unico (gestionale → Google) e non blocca mai l'app se Google non risponde.

## Avvio
server: cp .env.example .env && npm install && npm run dev
client: npm install && npm run dev      (http://localhost:5173)
Primo avvio: responsabile admin@agenzia.it / admin123 (da .env). Cambialo.

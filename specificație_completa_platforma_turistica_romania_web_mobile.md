# SPECIFICAȚIE COMPLETĂ – PLATFORMĂ TURISTICĂ ROMÂNIA (PRODUCTION READY)

**Scop:** acest document este un set de **instrucțiuni stricte** care trebuie furnizate unui agent de cod (ex: Claude Code) pentru a construi o aplicație **web + mobile**, bilingvă **RO/EN**, stabilă, scalabilă și gata de producție.

❗ Nu este MVP. ❗ Nu sunt prototipuri. ❗ Nu se acceptă cod incomplet.

---

## 1. STACK TEHNIC OBLIGATORIU

### 1.1 Frontend Web
- React 18+
- TypeScript strict (`strict: true`)
- Vite sau Next.js (preferat Next.js App Router)
- TailwindCSS + shadcn/ui
- React Query (TanStack Query)
- i18n: `react-i18next`

### 1.2 Mobile
- React Native (Expo)
- TypeScript strict
- Design shared cu web (theme tokens comune)
- i18n identic cu web

### 1.3 Backend
- Node.js 20+
- NestJS
- REST API (OpenAPI/Swagger obligatoriu)
- Autentificare JWT

### 1.4 Bază de date
- PostgreSQL
- ORM: Prisma
- Migrații obligatorii

### 1.5 Stocare imagini (GRATUIT LA ÎNCEPUT)
- **Cloudinary Free Tier**
  - Upload securizat
  - CDN
  - Transformări automate

❗ NU se salvează imagini în DB sau local.

---

## 2. TIPURI DE UTILIZATORI (CLAR DEFINITE)

### 2.1 Utilizator FĂRĂ LOGIN (Guest)
- Poate vedea:
  - Proprietăți
  - Vile
  - Hoteluri
  - Obiective turistice
  - Detalii județ / oraș
- Nu poate contacta direct

### 2.2 Client Autentificat (SUBSCRIPȚIE ANUALĂ)
- Rol: `CLIENT`
- Poate:
  - Adăuga / edita proprietăți
  - Urca poze
  - Selecta județ / oraș
  - Vizualiza statistici

### 2.3 Admin
- Rol: `ADMIN`
- Poate:
  - Aproba / respinge proprietăți
  - Gestiona utilizatori
  - Gestiona obiective turistice
  - Moderare conținut

---

## 3. MODEL DE DATE (PRISMA – OBLIGATORIU)

### 3.1 Județ
- id
- nume_ro
- nume_en

### 3.2 Oraș
- id
- judet_id
- nume_ro
- nume_en

### 3.3 Obiectiv Turistic
- id
- judet_id
- oras_id (opțional)
- titlu_ro
- titlu_en
- descriere_ro
- descriere_en
- coordonate

### 3.4 Proprietate
- id
- tip (hotel | vila | pensiune | cabană)
- titlu
- descriere
- judet_id
- oras_id
- coordonate
- pret_noapte
- imagini[]
- owner_id
- status (draft | pending | approved)

### 3.5 User
- id
- email
- parola_hash
- rol
- subscription_active

---

## 4. FUNCȚIONALITĂȚI OBLIGATORII

### 4.1 Bilingv (RO / EN)
- Tot conținutul tradus
- Fallback logic corect

### 4.2 Filtrare Avansată
- Județ
- Oraș
- Tip proprietate
- Preț
- Apropiere obiective turistice

### 4.3 Hartă
- Google Maps sau Mapbox
- Markere pentru proprietăți + obiective

### 4.4 Admin Panel
- UI separat (`/admin`)
- Protejat prin rol
- CRUD complet

---

## 5. DESIGN (NON-NEGOCIABIL)

- Design modern (inspirat Booking / Airbnb)
- Grid responsive
- Dark mode (opțional)
- Carduri curate
- Imagini mari, optimizate

❗ UI-ul trebuie să fie **production-grade**, nu demo.

---

## 6. DATE DE TEST (SEED DB – OBLIGATORIU)

### 6.1 Județe
- Maramureș
- Brașov
- Cluj
- Constanța

### 6.2 Proprietăți (exemple)
- Hotel în Brașov
- Vilă în Borșa
- Pensiune în Cluj-Napoca

### 6.3 Obiective
- Cascada Cailor
- Castelul Bran
- Salina Turda

---

## 7. PAȘI CLARI DE IMPLEMENTARE (PENTRU DEVELOPER)

1. Inițializează monorepo
2. Configurează TypeScript strict
3. Creează schema Prisma
4. Rulează migrațiile
5. Seed DB cu date test
6. Configurează Cloudinary
7. Creează API REST
8. Integrează auth + roluri
9. Creează UI Web
10. Creează UI Mobile
11. Testează toate flow-urile
12. Elimină orice warning / error

---

## 8. REGULI PENTRU CLAUDE CODE (CRITICE)

- Nu genera cod incomplet
- Nu lăsa TODO
- Nu ignora erori TS
- Nu folosi `any`
- Codul trebuie să ruleze
- Respectă structura

Dacă ceva este ambiguu → alege varianta **mai sigură și mai scalabilă**.

---

## 9. DEFINIȚIA FINALĂ DE „GATA”

Aplicația este considerată completă când:
- Web + Mobile funcționează
- DB este populată
- Admin poate gestiona tot
- Guest poate explora complet
- Design este premium
- Nu există erori la build

---

## 10. PROMPT FINAL PENTRU CLAUDE CODE

"Construiește aplicația EXACT conform acestui document. Tratează-l ca specificație contractuală. Codul trebuie să fie production-ready, fără erori, fără presupuneri."


# Supabase Setup Instructions

Om de Assets functionaliteit te laten werken, moeten er database tabellen en storage buckets worden ingesteld in Supabase:

## 1. Database Tabellen

Voer het volgende SQL script uit in de Supabase SQL Editor (kopieer de inhoud van `supabase_setup.sql`):

Dit maakt twee tabellen aan:
- `system_assets` - Voor platform template afbeeldingen (alleen-lezen voor gebruikers)
- `user_assets` - Voor gebruiker uploads (volledig beheer per gebruiker)

## 2. Storage Buckets

Maak **drie aparte buckets** aan in Storage:

### A. System Assets Bucket (voor template afbeeldingen)

1. Ga naar **Storage** > **Buckets**
2. Klik op **New bucket**
3. Naam: `system-assets`
4. **Public bucket: JA** (zodat template afbeeldingen publiek toegankelijk zijn)
5. File size limit: 50MB
6. Allowed MIME types: `image/*`

**Storage Policy voor system-assets:**
1. Ga naar **Storage** > **Policies**  
2. Klik op **New Policy** voor de `system-assets` bucket
3. Policy name: `Public read access`
4. Policy definition:
   ```sql
   (bucket_id = 'system-assets'::text)
   ```
5. Alleen **SELECT** aanvinken
6. **Save policy**

### B. User Assets Bucket (voor gebruiker uploads - PRIVAAT)

1. Klik op **New bucket**
2. Naam: `user-assets`
3. **Public bucket: NEE** (privaat voor beveiliging)
4. File size limit: 50MB
5. Allowed MIME types: `image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document`

**Storage Policy voor user-assets:**
1. Ga naar **Storage** > **Policies**
2. Klik on **New Policy** voor de `user-assets` bucket  
3. Policy name: `User asset access`
4. Policy definition:
   ```sql
   (bucket_id = 'user-assets'::text)
   ```
5. **INSERT, SELECT, UPDATE, DELETE** allemaal aanvinken (voor nu)
6. **Save policy**

### C. Published Presentations Bucket (voor gedeelde presentaties)

1. Klik op **New bucket**
2. Naam: `published-presentations`
3. **Public bucket: JA** (zodat share links werken)
4. File size limit: 100MB
5. Allowed MIME types: `image/*,application/pdf`

**Storage Policy voor published-presentations:**
1. Ga naar **Storage** > **Policies**
2. Klik on **New Policy** voor de `published-presentations` bucket  
3. Policy name: `Public presentation access`
4. Policy definition:
   ```sql
   (bucket_id = 'published-presentations'::text)
   ```
5. Alleen **SELECT** aanvinken
6. **Save policy**

## 3. Verificatie

Na de setup zou de Assets tab moeten werken met:
- ✅ Drie categorieën: "Systeem" en "Mijn Assets"  
- ✅ Upload functionaliteit voor user assets (met signed URLs)
- ✅ System assets zijn alleen-lezen (niet verwijderbaar)
- ✅ User assets zijn volledig beheerbaar en privaat
- ✅ Presentaties kunnen gepubliceerd worden naar publieke bucket

## 4. Template Assets Toevoegen

Om de standaard template assets toe te voegen:
1. Upload afbeeldingen naar de `system-assets` bucket via Supabase dashboard
2. Voeg metadata toe aan de `system_assets` tabel via SQL Editor

Bijvoorbeeld:
```sql
INSERT INTO public.system_assets (name, original_name, file_path, url, type, size, category, description)
VALUES (
  'cumlaude-logo.png',
  'cumlaude-logo.png', 
  'system/cumlaude-logo.png',
  'https://[your-project].supabase.co/storage/v1/object/public/system-assets/system/cumlaude-logo.png',
  'image/png',
  25600,
  'images',
  'CUMLAUDE.AI logo voor templates'
);
```
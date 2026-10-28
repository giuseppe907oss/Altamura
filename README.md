# La Cucina di Altamura — sito web

Nuovo sito di [lacucinadialtamura.it](https://lacucinadialtamura.it): una sola pagina statica,
senza WordPress e senza plugin. Basta caricare i file su qualsiasi hosting (anche Hostinger).

```
index.html            la pagina
assets/css/style.css  stile (tema chiaro e scuro automatico)
assets/js/main.js     menu mobile e la "bilancia" del banco
assets/img/           foto e logo (dal sito originale, ottimizzati in WebP)
```

Per vederlo in locale: `python3 -m http.server` nella cartella e apri http://localhost:8000.

## Da controllare prima di pubblicare

- **Orari**: il sito vecchio riportava sia "Lun–Dom 07:00–22:00" sia altri orari del template.
  Qui c'è 07:00–22:00 tutti i giorni.
- **Piatti del banco** (sezione "Componi il tuo assaggio"): sono esempi di specialità pugliesi
  con pesi indicativi. Cambiali in `index.html` con i piatti veri (attributi `data-name` e `data-g`).
- **Cantina**: i vitigni citati (Primitivo, Negroamaro, Nero di Troia) sono esempi.
- **Privacy policy**: il link punta ancora alla pagina del vecchio sito.

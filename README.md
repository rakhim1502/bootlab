# BootLab — kompyuterning yoqilish jarayoni simulyatori

Noutbuk va stol kompyuterining **Power tugmasidan ish stoli tayyor bo‘lishigacha** bo‘lgan jarayonini
ichki qismlar (anakart, CPU, RAM, SSD, UEFI/BIOS, GPU, sovitish, batareya/PSU) bilan animatsiyada
ko‘rsatuvchi interaktiv o‘quv sayti.

> Diqqat: bu soddalashtirilgan o‘quv modeli. Haqiqiy kompyuterlarda bosqichlar bir-biriga qisman ustma-ust
> tushadi va ularning tartibi hamda davomiyligi uskuna va operatsion tizimga qarab farq qiladi.

## Texnologiyalar

- React 19 + Vite
- Tailwind CSS 4 (`@tailwindcss/vite`)
- Lucide React (ikonkalar)
- Backend yo‘q, Docker yo‘q — faqat statik sayt.

## Ishga tushirish

```bash
npm install
npm run dev        # http://localhost:5173
```

Ishlab chiqarish uchun yig‘ish va tekshirish:

```bash
npm run build      # natija: dist/
npm run preview    # dist/ ni lokal serverda ko‘rish (http://localhost:4173)
```

## Boshqaruv

| Amal | Tugma | Klaviatura |
|------|-------|------------|
| Yoqish / o‘chirish | Power | `P` |
| Pauza / davom | Pauza | `Bo‘sh joy` |
| Keyingi / oldingi bosqich | ⏭ / ⏮ | `→` (`N`) / `←` |
| Qayta boshlash | Reset | `R` |
| Tezlik 0.5× / 1× / 2× | tezlik tugmalari | `1` / `2` / `3` |
| Qurilma: noutbuk / stol kompyuteri | yuqori o‘ng | `L` / `D` |
| Qism tanlovini bekor qilish | ✕ | `Esc` |

- Chap paneldagi bosqichni bosish — simulyatsiya shu bosqichga o‘tadi.
- Chizmadagi istalgan qismni bosish (yoki `Tab` bilan tanlab `Enter`) — o‘ng panelda uning vazifasi ko‘rsatiladi.
- Qurilma almashtirilganda simulyatsiya qayta boshlanadi.
- `prefers-reduced-motion` yoqilgan bo‘lsa, ventilyator va signal impulslari aylanmaydi/harakatlanmaydi,
  faqat yorishish bilan holat ko‘rsatiladi.

## Arxitektura

```
src/
  data/stages.js            # 8 bosqich: davomiylik, faol qismlar, signallar, ekran holati, izohlar
  data/parts.js             # qismlar va ularning tushuntirishlari
  hooks/useSimulation.js    # yagona vaqt holati (t), status, tezlik, boshqaruv funksiyalari
  components/
    devices/parts.jsx       # qayta ishlatiladigan SVG qismlar (CPU, RAM, Fan, Trace, Screen ...)
    devices/LaptopSvg.jsx   # noutbuk chizmasi va signal yo‘llari
    devices/DesktopSvg.jsx  # stol kompyuteri chizmasi va signal yo‘llari
    StageList.jsx           # chap panel — bosqichlar
    InfoPanel.jsx           # o‘ng panel — bosqich izohi, jurnal, qism haqida
    Controls.jsx            # pastki panel — boshqaruv va progress
  App.jsx                   # joylashuv, qurilma tanlovi, klaviatura
```

Barcha animatsiya (ventilyator burchagi, signal impulslari, ekran spinneri, progress) bitta `t` qiymatiga
bog‘langan: `t` faqat `running` holatida `requestAnimationFrame` orqali oshadi, shuning uchun pauza hammasini
bir vaqtda to‘xtatadi, tezlik esa `t` ning o‘sish koeffitsiyentidir.

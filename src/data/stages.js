// 8 ta yoqilish bosqichi. Har bir bosqich: davomiyligi (soniya, 1× tezlikda),
// yorishadigan qismlar, signallar (qaysi yo‘ldan harakat qiladi) va ekran holati.
export const STAGES = [
  {
    id: 'power',
    title: 'Quvvat berish',
    short: 'Quvvat',
    duration: 3,
    active: ['power', 'psu', 'battery', 'board', 'fan'],
    signals: ['power->psu', 'psu->board'],
    screen: 'off',
    summary: 'Power tugmasi quvvat manbaini uyg‘otadi va anakartga barqaror kuchlanish beriladi.',
    details: [
      'Power tugmasi anakartdagi boshqaruv sxemasiga qisqa signal yuboradi.',
      'PSU (yoki batareya nazoratchisi) 12V / 5V / 3.3V kuchlanishlarni hosil qiladi.',
      'Kuchlanish barqarorlashgach “Power Good” signali chiqadi va CPU reset holatidan chiqariladi.',
      'Ventilyator aylana boshlaydi.',
    ],
    log: ['PWR_BTN bosildi', 'PSU: +12V +5V +3.3V OK', 'POWER_GOOD → CPU reset bo‘shatildi'],
  },
  {
    id: 'uefi',
    title: 'UEFI ishga tushadi',
    short: 'UEFI',
    duration: 3,
    active: ['board', 'cpu', 'uefi', 'fan', 'psu', 'battery'],
    signals: ['uefi->cpu'],
    screen: 'off',
    summary: 'CPU birinchi buyruqni UEFI flesh-xotirasidan o‘qiydi va mikrodastur ishga tushadi.',
    details: [
      'CPU “reset vektori” manzilidan boshlanadi — u UEFI mikrosxemasiga ishora qiladi.',
      'UEFI o‘z-o‘zini dastlabki sozlaydi: chipset, taymerlar, quvvat rejimlari.',
      'Sozlamalar (yuklash tartibi, soat, xavfsiz yuklash) NVRAM dan o‘qiladi.',
    ],
    log: ['CPU: reset vektori 0xFFFFFFF0', 'UEFI SEC/PEI fazalari', 'NVRAM sozlamalari o‘qildi'],
  },
  {
    id: 'post',
    title: 'POST — uskuna tekshiruvi',
    short: 'POST',
    duration: 4,
    active: ['board', 'cpu', 'uefi', 'ram', 'gpu', 'screen', 'fan', 'psu', 'battery'],
    signals: ['cpu->ram', 'cpu->gpu', 'gpu->screen'],
    screen: 'logo',
    summary: 'UEFI RAM, GPU, klaviatura va boshqa qurilmalarni tekshiradi; ekranda logotip paydo bo‘ladi.',
    details: [
      'POST (Power-On Self-Test) — xotira hajmini aniqlash va tekshirish.',
      'GPU topiladi va boshlang‘ich video rejim o‘rnatiladi — ekranda ishlab chiqaruvchi logotipi.',
      'Klaviatura, USB, SSD kabi qurilmalar ro‘yxatga olinadi.',
      'Xatolik bo‘lsa — signal (beep) yoki xato kodi ko‘rsatiladi.',
    ],
    log: ['RAM: 16384 MB OK', 'GPU: aniqlandi, video rejim o‘rnatildi', 'USB/NVMe qurilmalar ro‘yxati'],
  },
  {
    id: 'bootloader',
    title: 'Bootloader yuklanadi',
    short: 'Bootloader',
    duration: 3,
    active: ['board', 'cpu', 'uefi', 'ssd', 'screen', 'fan', 'psu', 'battery'],
    signals: ['ssd->cpu'],
    screen: 'logo',
    summary: 'UEFI SSD dagi EFI bo‘limidan OS yuklovchisini (bootloader) topib ishga tushiradi.',
    details: [
      'Yuklash tartibiga ko‘ra SSD tanlanadi va undagi EFI tizim bo‘limi ochiladi.',
      'Yuklovchi fayl (masalan, Windows Boot Manager yoki GRUB) RAMga o‘qiladi.',
      'Xavfsiz yuklash yoqilgan bo‘lsa, yuklovchining raqamli imzosi tekshiriladi.',
      'Boshqaruv UEFI dan bootloaderga o‘tadi.',
    ],
    log: ['Boot order: NVMe SSD', 'EFI/Boot/bootx64.efi topildi', 'Secure Boot: imzo tasdiqlandi'],
  },
  {
    id: 'kernel',
    title: 'Yadro RAMga yuklanadi',
    short: 'Yadro',
    duration: 4,
    active: ['board', 'cpu', 'ssd', 'ram', 'screen', 'fan', 'psu', 'battery'],
    signals: ['ssd->ram', 'ram->cpu'],
    screen: 'spinner',
    summary: 'Bootloader operatsion tizim yadrosini SSD dan RAMga ko‘chiradi va unga boshqaruvni beradi.',
    details: [
      'Yadro (kernel) fayli va boshlang‘ich drayverlar to‘plami SSD dan o‘qiladi.',
      'Ular RAMga joylashtiriladi — endi CPU buyruqlarni RAMdan bajaradi.',
      'Yadro xotirani boshqarishni, jarayonlarni rejalashtirishni va uzilishlarni sozlaydi.',
      'Ekranda yuklanish indikatori aylanadi.',
    ],
    log: ['kernel → RAM (0x100000)', 'Xotira boshqaruvi faollashdi', 'Jarayon rejalashtiruvchisi ishga tushdi'],
  },
  {
    id: 'drivers',
    title: 'Drayverlar va xizmatlar',
    short: 'Drayverlar',
    duration: 4,
    active: ['board', 'cpu', 'ssd', 'ram', 'gpu', 'screen', 'fan', 'psu', 'battery'],
    signals: ['ssd->ram', 'cpu->gpu', 'cpu->ssd'],
    screen: 'spinner',
    summary: 'Yadro uskuna drayverlarini yuklaydi va tizim xizmatlarini ishga tushiradi.',
    details: [
      'Grafik, tarmoq, ovoz, saqlash kabi drayverlar SSD dan RAMga yuklanadi.',
      'GPU to‘liq rejimga o‘tadi — ekran ruxsati va yangilanish chastotasi sozlanadi.',
      'Fon xizmatlari ishga tushadi: tarmoq, xavfsizlik, yangilanish, qidiruv.',
      'Fayl tizimi tekshiriladi va ulanadi.',
    ],
    log: ['nvme, usb, hid drayverlari', 'GPU drayveri: 1920×1080 @ 60Hz', 'Tarmoq xizmati ishga tushdi'],
  },
  {
    id: 'session',
    title: 'Foydalanuvchi sessiyasi',
    short: 'Sessiya',
    duration: 3,
    active: ['board', 'cpu', 'ram', 'gpu', 'screen', 'ssd', 'fan', 'psu', 'battery'],
    signals: ['cpu->gpu', 'gpu->screen'],
    screen: 'login',
    summary: 'Kirish oynasi ko‘rsatiladi; foydalanuvchi tasdiqlangach, uning sessiyasi yaratiladi.',
    details: [
      'Sessiya menejeri kirish oynasini chizadi.',
      'Parol yoki PIN tekshiriladi, foydalanuvchi profili SSD dan o‘qiladi.',
      'Foydalanuvchi uchun alohida muhit (sessiya) yaratiladi va avtomatik dasturlar ishga tushadi.',
    ],
    log: ['Login oynasi', 'Foydalanuvchi: tasdiqlandi', 'Profil yuklandi'],
  },
  {
    id: 'desktop',
    title: 'Ish stoli tayyor',
    short: 'Ish stoli',
    duration: 3,
    active: ['board', 'cpu', 'ram', 'gpu', 'screen', 'ssd', 'fan', 'psu', 'battery'],
    signals: ['cpu->gpu', 'gpu->screen', 'ram->cpu'],
    screen: 'desktop',
    summary: 'Grafik qobiq yuklanadi va ish stoli ko‘rinadi — kompyuter ishlashga tayyor.',
    details: [
      'Grafik qobiq (Explorer, GNOME, KDE va h.k.) ish stolini, panelni va belgilarni chizadi.',
      'Barcha qismlar barqaror rejimda: CPU buyruqlarni bajaradi, RAM dasturlarni saqlaydi, GPU tasvir chiqaradi.',
      'Ventilyator haroratga qarab sekinlashadi.',
    ],
    log: ['Grafik qobiq yuklandi', 'Ish stoli tayyor ✓'],
  },
]

export const TOTAL_DURATION = STAGES.reduce((s, st) => s + st.duration, 0)

// Bosqichning boshlanish vaqti (soniya, 1× tezlikda)
export const STAGE_STARTS = STAGES.reduce((acc, st, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + STAGES[i - 1].duration)
  return acc
}, [])

export function stageIndexAt(t) {
  if (t >= TOTAL_DURATION) return STAGES.length - 1
  let i = STAGES.length - 1
  while (i > 0 && t < STAGE_STARTS[i]) i--
  return i
}

// Bosqich ichidagi progress 0..1
export function stageProgressAt(t) {
  const i = stageIndexAt(t)
  const local = t - STAGE_STARTS[i]
  return Math.min(1, Math.max(0, local / STAGES[i].duration))
}

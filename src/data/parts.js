// Qurilma qismlari va ularning o‘quv izohlari.
export const PARTS = {
  power: {
    id: 'power',
    name: 'Power tugmasi',
    role: 'Yoqilish signalini beradi',
    detail:
      'Power tugmasi bosilganda anakartdagi quvvat boshqaruvi sxemasiga qisqa signal yuboriladi. ' +
      'Bu signal quvvat manbaiga (PSU yoki batareya nazoratchisi) “to‘liq quvvat ber” buyrug‘ini beradi.',
    stages: [0],
  },
  psu: {
    id: 'psu',
    name: 'Quvvat bloki (PSU)',
    role: 'Tarmoq tokini barqaror kuchlanishga aylantiradi',
    detail:
      'PSU 220V o‘zgaruvchan tokni 12V, 5V va 3.3V doimiy kuchlanishlarga aylantiradi. ' +
      'Kuchlanish barqarorlashgach “Power Good” signali yuboriladi — shundan keyingina CPU ishga tushishi mumkin.',
    stages: [0, 1, 2, 3, 4, 5, 6, 7],
  },
  battery: {
    id: 'battery',
    name: 'Batareya va zaryad nazoratchisi',
    role: 'Noutbukni avtonom quvvatlaydi',
    detail:
      'Batareya nazoratchisi hujayralar kuchlanishini tekshiradi va anakart uchun kerakli kuchlanishlarni hosil qiladi. ' +
      'Adapter ulangan bo‘lsa, quvvat undan olinadi, batareya esa zaryadlanadi.',
    stages: [0, 1, 2, 3, 4, 5, 6, 7],
  },
  board: {
    id: 'board',
    name: 'Anakart',
    role: 'Barcha qismlarni bog‘lovchi asos',
    detail:
      'Anakart — CPU, RAM, SSD, GPU va boshqa qismlarni elektr yo‘llar (shinalar) orqali bog‘laydigan plata. ' +
      'Unda chipset, UEFI mikrosxemasi va quvvat boshqaruv sxemalari joylashgan.',
    stages: [0, 1, 2, 3, 4, 5, 6, 7],
  },
  cpu: {
    id: 'cpu',
    name: 'Protsessor (CPU)',
    role: 'Barcha buyruqlarni bajaradi',
    detail:
      'CPU quvvat olgach, “reset vektori” deb ataladigan qat’iy manzildan birinchi buyruqni o‘qiydi — bu manzil UEFI mikrosxemasiga ishora qiladi. ' +
      'Shundan boshlab CPU dasturiy ta’minotni ketma-ket bajaradi: UEFI, bootloader, yadro, dasturlar.',
    stages: [1, 2, 3, 4, 5, 6, 7],
  },
  uefi: {
    id: 'uefi',
    name: 'UEFI / BIOS mikrosxemasi',
    role: 'Birinchi ishga tushuvchi dastur',
    detail:
      'UEFI (eski nomi BIOS) — anakartdagi kichik flesh-xotirada saqlangan dastur. ' +
      'U uskunani tekshiradi (POST), sozlamalarni o‘qiydi va operatsion tizim yuklovchisini (bootloader) topib ishga tushiradi.',
    stages: [1, 2, 3],
  },
  ram: {
    id: 'ram',
    name: 'Operativ xotira (RAM)',
    role: 'Ishlayotgan dasturlar va yadro joylashadigan tezkor xotira',
    detail:
      'RAM — vaqtinchalik xotira: quvvat o‘chsa, ma’lumot yo‘qoladi. ' +
      'POST bosqichida tekshiriladi, keyin bootloader yadroni SSD dan aynan shu yerga ko‘chiradi. ' +
      'Barcha ishlayotgan dasturlar RAMda joylashadi.',
    stages: [2, 4, 5, 6, 7],
  },
  ssd: {
    id: 'ssd',
    name: 'SSD (doimiy xotira)',
    role: 'OS, dasturlar va fayllar saqlanadigan joy',
    detail:
      'SSD — quvvat o‘chganda ham ma’lumotni saqlaydigan xotira. ' +
      'Unda EFI bo‘limi (bootloader), operatsion tizim yadrosi, drayverlar va foydalanuvchi fayllari joylashgan.',
    stages: [3, 4, 5, 6, 7],
  },
  gpu: {
    id: 'gpu',
    name: 'Grafik protsessor (GPU)',
    role: 'Tasvirni ekranga chiqaradi',
    detail:
      'GPU POST bosqichida aniqlanadi va UEFI logotipini ko‘rsatadi. ' +
      'Yadro grafik drayverni yuklagach, GPU to‘liq rejimda ishlaydi va ish stolini chizadi.',
    stages: [2, 5, 6, 7],
  },
  fan: {
    id: 'fan',
    name: 'Sovitish tizimi',
    role: 'CPU va GPU ni qizib ketishdan saqlaydi',
    detail:
      'Ventilyator quvvat berilishi bilan aylana boshlaydi. ' +
      'UEFI va keyin OS harorat sensorlariga qarab aylanish tezligini boshqaradi.',
    stages: [0, 1, 2, 3, 4, 5, 6, 7],
  },
  screen: {
    id: 'screen',
    name: 'Ekran',
    role: 'Natijani ko‘rsatadi',
    detail:
      'Ekran POST paytida ishlab chiqaruvchi logotipini, keyin yuklanish indikatorini, so‘ng kirish oynasi va ish stolini ko‘rsatadi.',
    stages: [2, 3, 4, 5, 6, 7],
  },
}

export const PART_LIST = Object.values(PARTS)

# CLAUDE.md — Ustabaşı

Bu dosya, Claude Code'un bu proje üzerinde çalışırken her oturumda bilmesi gereken
bağlamı, kuralları ve hedefleri içerir. Yeni bir özellik eklerken veya kod yazarken
buradaki kurallara uy.

> **Dil notu:** Bu projede teknik konuşmaları Türkçe yürütüyoruz. Açıklamaları,
> commit mesajlarını ve yorumları Türkçe yazabilirsin. Değişken/fonksiyon isimleri
> İngilizce olsun (kod standardı).

---

## 1. Proje Özeti

**Ustabaşı**, tarayıcıda çalışan 2D bir platform (platformer) oyunudur.

- **Tema:** İnşaat / şantiye. Oyuncu bir *ustabaşı* karakterini yönetir; engelleri
  aşar, platformlardan atlar, tehlikelerden kaçar.
- **Hedef platform:** Web tarayıcısı (masaüstü öncelikli, mobil dokunmatik ileride).
- **Dil:** TypeScript (JavaScript çıktısına derlenir).

---

## 2. Teknoloji Yığını (Tech Stack)

| Katman            | Seçim                          | Not |
|-------------------|--------------------------------|-----|
| Dil               | TypeScript                     | `strict: true` |
| Oyun motoru       | Phaser 3                       | Arcade Physics kullan |
| Build / Dev araç  | Vite                           | HMR + hızlı derleme |
| Paket yöneticisi  | npm                            | `package-lock.json` commit'lenir |
| Lint / Format     | ESLint + Prettier              | |

> Bu seçimler değişebilir. Eğer bir alternatif (ör. PixiJS, saf Canvas) tercih
> edilirse bu tabloyu güncelle.

---

## 3. Klasör Yapısı

```
ustabasi/
├── public/                 # Statik dosyalar (favicon vb.)
├── src/
│   ├── main.ts             # Giriş noktası, Phaser.Game konfigürasyonu
│   ├── config.ts           # Oyun ayarları (çözünürlük, fizik, sabitler)
│   ├── scenes/             # Phaser Scene'leri
│   │   ├── BootScene.ts        # İlk yükleme/ayar
│   │   ├── PreloadScene.ts     # Asset yükleme + yükleme çubuğu
│   │   ├── MenuScene.ts        # Ana menü
│   │   ├── GameScene.ts        # Asıl oynanış
│   │   └── UIScene.ts          # Skor/can gibi HUD (GameScene üstünde paralel)
│   ├── objects/            # Oyun nesneleri (sınıflar)
│   │   ├── Player.ts            # Ustabaşı karakteri
│   │   ├── Enemy.ts
│   │   └── Collectible.ts       # Toplanabilir (ör. tuğla, alet)
│   ├── systems/            # Oyun sistemleri (input, ses, kayıt vb.)
│   │   ├── InputManager.ts
│   │   └── ScoreManager.ts
│   ├── types/              # Paylaşılan TypeScript tipleri
│   └── utils/              # Yardımcı fonksiyonlar
├── assets/                 # Kaynak görseller, tilemap, ses (build'e kopyalanır)
│   ├── sprites/
│   ├── tilemaps/
│   └── audio/
├── index.html
├── tsconfig.json
├── vite.config.ts
├── package.json
└── CLAUDE.md
```

> Yeni bir dosya oluştururken bu yapıya sadık kal. Bir Scene mi, bir oyun nesnesi mi,
> yoksa bir sistem mi olduğuna karar verip doğru klasöre koy.

---

## 4. Mimari Kurallar

- **Her Phaser Scene kendi dosyasında** olur ve `Phaser.Scene`'den türer.
- **Oyun nesneleri sınıf olarak** yazılır (ör. `Player extends Phaser.Physics.Arcade.Sprite`).
  Mantığı Scene içine gömme; nesnenin kendi sınıfına taşı.
- **Sabitler `config.ts` içinde** toplanır (yerçekimi, oyuncu hızı, zıplama gücü vb.).
  Kodun içine "magic number" serpiştirme.
- **Asset anahtarları (key) merkezi tutulur.** Aynı string'i ('player', 'tiles' vb.)
  birden fazla yerde elle yazmak yerine sabit olarak tanımla.
- Render ve mantık ağırlıklı işler için Phaser'ın yaşam döngüsünü kullan:
  `preload()` → asset, `create()` → kurulum, `update()` → her karede mantık.

---

## 5. Kodlama Standartları

- TypeScript `strict` modda. `any` kullanmaktan kaçın; gerekirse açıkça gerekçelendir.
- Değişken / fonksiyon / sınıf isimleri **İngilizce ve açıklayıcı**.
  - Sınıf: `PascalCase` → `class PlayerController`
  - Fonksiyon / değişken: `camelCase` → `jumpVelocity`
  - Sabit: `UPPER_SNAKE_CASE` → `MAX_FALL_SPEED`
- Fonksiyonlar kısa ve tek bir işe odaklı olsun.
- Karmaşık mantık için kısa Türkçe yorum eklemekte sakınca yok.
- Commit'lerden önce `npm run lint` ve `npm run typecheck` temiz geçmeli.

---

## 6. Komutlar

```bash
npm install        # Bağımlılıkları kur
npm run dev        # Geliştirme sunucusu (Vite, HMR ile)
npm run build      # Üretim derlemesi (dist/ klasörüne)
npm run preview    # Build çıktısını yerelde önizle
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit ile tip kontrolü
```

> Bu komutlar `package.json` içindeki script'lerle eşleşmeli. Script eklersen
> buraya da ekle.

---

## 7. Oynanış Hedefleri (MVP)

İlk sürümde (Minimum Çalışan Ürün) şunlar olmalı:

1. Sağ/sol hareket + zıplama yapan bir oyuncu (klavye: ok tuşları veya WASD).
2. Yerçekimi ve platformlarla çarpışma (Arcade Physics).
3. En az bir oynanabilir bölüm (tilemap tabanlı).
4. Toplanabilir bir nesne (ör. tuğla/alet) ve basit bir skor.
5. Başlangıç menüsü → oyun → oyun bittiğinde yeniden başlama akışı.

Sonraki aşamalar (MVP'den sonra): düşmanlar, can sistemi, ses efektleri,
birden fazla bölüm, mobil dokunmatik kontroller.

---

## 8. Claude için Çalışma Talimatları

- Büyük bir değişiklikten önce **kısaca planını söyle**, **bana sor** sonra uygula.
- Yeni bir özellik eklerken mümkünse mevcut yapıyı bozmadan, ilgili klasöre uygun
  şekilde ekle.
- Bir şeyden emin değilsen tahmin yürütüp ilerlemek yerine **bana sor**.
- Kod yazdıktan sonra ne yaptığını ve nasıl test edebileceğimi kısaca özetle.
- Henüz hazır olmayan asset'ler için Phaser'ın çizdiği basit şekiller (renkli
  dikdörtgenler) ile placeholder kullan; sonra gerçek görsellerle değiştiririz.

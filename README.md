# WhatsApp Sohbet Görüntüleyici

> **ÖNEMLİ GİZLİLİK BİLGİSİ**: Bu uygulama tüm verileri yalnızca tarayıcınızın yerel depolama alanında ve IndexedDB'de saklar. Hiçbir veri sunucuya gönderilmez veya bulutta depolanmaz. Sohbet verileriniz ve medya dosyalarınız daima cihazınızda kalır.

WhatsApp Sohbet Görüntüleyici, WhatsApp'tan dışa aktarılmış sohbet metinlerini (`.txt` veya `.zip` formatında) görüntülemek için geliştirilmiş modern bir web uygulamasıdır. Uygulama hem bireysel hem de grup sohbetlerini destekler ve resim, video, ses ve belge gibi medya dosyalarını görüntüleyebilir.

<p align="center">
<a href="https://www.buymeacoffee.com/yourname"><img src="https://img.buymeacoffee.com/button-api/?text=Bana bir kahve ısmarla&emoji=&slug=yourname&button_colour=40DCA5&font_colour=ffffff&font_family=Poppins&outline_colour=000000&coffee_colour=FFDD00" height="40px"></a>
</p>

![Uygulama Önizleme](https://placeholder-for-app-screenshot.png)

## 🚀 Özellikler

- 🔒 **Tam Gizlilik**: Tüm veriler yerel olarak işlenir, hiçbir şey sunucuya gönderilmez
- 💬 **WhatsApp Benzeri Arayüz**: Tanıdık, kullanımı kolay arayüz
- 👥 **Katılımcı Filtreleme**: Belirli kişilerin mesajlarını görüntüleme
- 🌓 **Karanlık/Aydınlık Mod**: Göz yorgunluğunu azaltan tema seçenekleri
- 📱 **Responsive Tasarım**: Mobil ve masaüstü cihazlarda sorunsuz çalışır
- 🖼️ **Medya Desteği**: Resim, video, ses, GIF ve belge görüntüleme
- 🔍 **Medya Önizleme**: Medya dosyalarını tam ekran görüntüleme
- 🔄 **Kullanıcı Kimliği Değiştirme**: Farklı kullanıcı perspektiflerini görüntüleme
- ⚡ **Performans Optimizasyonu**: Büyük sohbetlerde bile hızlı yükleme

## 📋 Kullanım Kılavuzu

### Sohbet Dosyasını Dışa Aktarma (WhatsApp'tan)

1. WhatsApp'ı açın ve görüntülemek istediğiniz sohbeti seçin
2. Üç nokta simgesine tıklayın > **Diğer** > **Sohbeti Dışa Aktar**
3. **Medya olmadan** veya **Medya dahil** seçeneğini belirleyin
4. Oluşturulan `.txt` veya `.zip` dosyasını kaydedin

### Uygulamayı Kullanma

1. Ana sayfada "Dosya Seç" düğmesine tıklayın
2. WhatsApp'tan dışa aktardığınız `.txt` veya `.zip` dosyasını seçin
3. Dosya yüklenirken bekleyin (medya içeren dosyalar daha uzun sürebilir)
4. Sohbet yüklendikten sonra mesajları görüntüleyin ve gezinin

### İpuçları

- **Katılımcı Filtreleme**: Grup sohbetlerinde, belirli bir kişinin mesajlarını görmek için üst kısımdaki isim butonlarına tıklayın
- **Kimlik Değiştirme**: Sağ üstteki menü düğmesinden "Kimliğinizi Değiştirin" seçeneğini kullanarak sohbetteki farklı kişilerin perspektifinden mesajları görüntüleyin
- **Medya Önizleme**: Resimlere, videolara veya diğer medya dosyalarına tıklayarak tam ekran görüntüleyin
- **Kademeli Yükleme**: Büyük sohbetlerde, performans için başlangıçta sınırlı sayıda mesaj gösterilir. Daha fazla mesaj yüklemek için "Daha eski mesajları yükle" düğmesini kullanın

## 🛠️ Kurulum ve Geliştirme

### Gereksinimler

- Node.js (v14 veya üstü)
- npm veya yarn

### Yerel Kurulum

```bash
# Repoyu klonlayın
git clone https://github.com/kullanici/whatsapp-chat-viewer.git
cd whatsapp-chat-viewer

# Bağımlılıkları yükleyin
npm install
# veya
yarn install

# Geliştirme sunucusunu başlatın
npm run dev
# veya
yarn dev
```

Uygulama http://localhost:3000 adresinde çalışacaktır.

### Dağıtım (Build)

```bash
# Üretim için build alın
npm run build
# veya
yarn build

# Üretim sunucusunu başlatın
npm start
# veya
yarn start
```

## 🧩 Nasıl Çalışır?

1. **Veri İşleme**: WhatsApp sohbet dosyaları düzenli ifadeler (regex) kullanılarak ayrıştırılır
2. **Veri Depolama**: Metin verileri `localStorage`'da, medya dosyaları `IndexedDB`'de saklanır
3. **UI Render**: Next.js ve React kullanılarak modern, performanslı bir kullanıcı arayüzü oluşturulur
4. **Medya İşleme**: Medya dosyaları Blob/URL API'leri kullanılarak tarayıcıda işlenir

## 🤝 Katkıda Bulunma

Katkılar her zaman hoş karşılanır! Lütfen:

1. Bu repoyu forklayın
2. Özellik dalınızı oluşturun (`git checkout -b yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Dalınızı ana repoya push edin (`git push origin yeni-ozellik`)
5. Bir Pull Request oluşturun

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## ☕ Bana Destek Olun

Eğer bu proje işinize yaradıysa ve geliştirme çalışmalarını desteklemek istiyorsanız, bana bir kahve ısmarlayabilirsiniz:

<p align="center">
<a href="https://www.buymeacoffee.com/raventrk"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="50px"></a>
</p>

---

Oluşturucu: [Adınız] - [Web siteniz/GitHub profiliniz]

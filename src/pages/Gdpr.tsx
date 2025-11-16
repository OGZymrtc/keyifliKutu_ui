import React from 'react';

export default function Kvkk() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-gray-800 px-6 py-16">
      <main className="max-w-5xl mx-auto space-y-10">
        <h1 className="text-4xl font-extrabold text-amber-700 mb-6">
          🛡️ Kişisel Verilerin Korunması Hakkında Bilgilendirme (KVKK)
        </h1>
        <p className="text-gray-700 leading-relaxed">
          Keyifli Kutu olarak kullanıcılarımızın kişisel verilerini korumayı önemsiyoruz. 
          Bu sayfa, KVKK kapsamında kişisel verilerinizin işlenme amaçları, haklarınız ve korunma yöntemleri hakkında bilgilendirme amacı taşımaktadır.
        </p>

        <section className="bg-white rounded-3xl p-8 shadow-md border border-amber-100 space-y-4">
          <h2 className="text-2xl font-semibold text-amber-700">📌 Veri Sorumlusu Bilgileri</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Şirket Adı: Keyifli Kutu</li>
            <li>Adres: Örnek Sokak No:1, İstanbul</li>
            <li>E-posta: kvkk@keyiflikutu.com</li>
            <li>Telefon: +90 123 456 78 90</li>
          </ul>
        </section>

        <section className="bg-white rounded-3xl p-8 shadow-md border border-amber-100 space-y-4">
          <h2 className="text-2xl font-semibold text-amber-700">🗂️ İşlenen Kişisel Veriler ve Amaçlar</h2>
          <p className="text-gray-700 leading-relaxed">
            Şu anda web sitemizde **kullanıcı kaydı veya ödeme alınmamaktadır**. Dolayısıyla kişisel verileriniz sisteme doğrudan kaydedilmez. 
            Web sitemizi ziyaret ettiğinizde toplanan veriler yalnızca site kullanım analitiği (IP adresi, tarayıcı bilgisi, ziyaret edilen sayfalar vb.) amacıyla anonim olarak işlenir.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-8 shadow-md border border-amber-100 space-y-4">
          <h2 className="text-2xl font-semibold text-amber-700">💡 Kullanıcı Hakları</h2>
          <p className="text-gray-700 leading-relaxed">
            KVKK kapsamında kullanıcılarımızın aşağıdaki hakları vardır:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Kişisel verilerine erişim talep etme</li>
            <li>Verilerin düzeltilmesini isteme</li>
            <li>Verilerin silinmesini talep etme</li>
            <li>Verilerin işlenmesine itiraz etme</li>
          </ul>
          <p className="text-gray-700 mt-2">
            Ziyaret sırasında anonim toplanan veriler için bu haklar sınırlı olup, detaylı bilgi için bize e-posta yoluyla ulaşabilirsiniz.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-8 shadow-md border border-amber-100 space-y-4">
          <h2 className="text-2xl font-semibold text-amber-700">📩 İletişim ve Talepler</h2>
          <p className="text-gray-700 leading-relaxed">
            KVKK ile ilgili sorularınızı veya taleplerinizi aşağıdaki iletişim bilgileri üzerinden bize iletebilirsiniz:
          </p>
          <ul className="text-gray-700 mt-2">
            <li>📧 E-posta: kvkk@keyiflikutu.com</li>
            <li>📞 Telefon: +90 123 456 78 90</li>
            <li>🏢 Adres: Örnek Sokak No:1, İstanbul</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
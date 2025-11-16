import React from "react";

export default function PartnerimizOl() {
    return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-gray-800 px-6 py-16">
            <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-amber-100">
                    <div className="flex flex-col lg:flex-row items-center gap-6">
                        <div className="flex-1">
                            <h1 className="text-4xl lg:text-5xl font-extrabold text-amber-700">🤝 Partnerimiz Ol</h1>
                            <p className="mt-4 text-gray-700 text-lg">Birlikte daha fazla insana keyifli anlar yaşatalım. Markanızı Keyifli Kutu topluluğuyla buluşturun, deneyimlerinizi öne çıkarın ve birlikte yeni hikâyeler yaratalım.</p>

                            <div className="mt-6 flex gap-3">
                                <a href="#form" className="inline-block bg-gradient-to-r from-orange-500 to-orange-400 hover:bg-amber-600 text-white px-5 py-3 rounded-full font-semibold">Başvur</a>
                                <a href="#iletisim" className="inline-block border border-amber-200 px-5 py-3 rounded-full text-amber-700">İletişime Geç</a>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/3 rounded-2xl overflow-hidden shadow-lg">
                            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80" alt="partnerlik" className="w-full h-56 object-cover" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">
                <section className="bg-white rounded-3xl p-8 shadow-md border border-amber-100">
                    <h2 className="text-2xl font-bold text-amber-700">💡 Neden Partner Olmalısınız?</h2>
                    <div className="mt-4 grid md:grid-cols-3 gap-6">
                        <div className="p-4 rounded-lg border-2 border-amber-100">
                            <h4 className="font-semibold">Yeni kitlelere ulaşın</h4>
                            <p className="mt-2 text-gray-700">Keyifli Kutu topluluğuyla markanızı tanıştırın, etkinliklerinizi ve ürünlerinizi hedef kitlemizle buluşturun.</p>
                        </div>
                        <div className="p-4 rounded-lg border-2 border-amber-100">
                            <h4 className="font-semibold">Deneyim bazlı görünürlük</h4>
                            <p className="mt-2 text-gray-700">Ürün ve hizmetlerinizi deneyim odaklı kampanyalarla ön plana çıkarın; kullanıcıların kalbinde yer edinin.</p>
                        </div>
                        <div className="p-4 rounded-lg border-2 border-amber-100">
                            <h4 className="font-semibold">Geri bildirim ve gelişim</h4>
                            <p className="mt-2 text-gray-700">Katılımcı geri bildirimleri sayesinde sunduğunuz deneyimi geliştirebilirsiniz.</p>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-3xl p-8 shadow-md border border-amber-100">
                    <h2 className="text-2xl font-bold text-amber-700">📋 İş Birliği Süreci</h2>
                    <ol className="mt-4 list-decimal list-inside text-gray-700 space-y-3">
                        <li><strong>Başvuru:</strong> Aşağıdaki formu doldurun — temel bilgiler ve iş birliği fikrinizi paylaşın.</li>
                        <li><strong>İlk Değerlendirme:</strong> Ekibimiz kısa süre içinde başvurunuzu inceler ve geri dönüş yapar.</li>
                        <li><strong>Görüşme:</strong> Uygun bulunan başvurularla detaylı bir görüşme planlanır (online veya yüz yüze).</li>
                        <li><strong>Test & Pilot:</strong> Küçük çaplı bir pilot ile deneyimi test ederiz ve gerekli düzenlemeleri yaparız.</li>
                        <li><strong>Yayın:</strong> Deneyiminiz platformumuzda ve/veya kutularımızda yer alır.</li>
                    </ol>
                </section>

                <section id="form" className="bg-white rounded-3xl p-8 shadow-md border border-amber-100">
                    <h2 className="text-2xl font-bold text-amber-700">📩 İş Birliği Başvuru Formu</h2>
                    <p className="mt-2 text-gray-700">Formu doldurun; ekip arkadaşlarımız en kısa sürede sizinle iletişime geçsin.</p>

                    <form className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="p-3 rounded-lg border" placeholder="Şirket / Marka Adı" />
                        <input className="p-3 rounded-lg border" placeholder="Yetkili Kişi (Ad Soyad)" />
                        <input className="p-3 rounded-lg border" placeholder="E-posta Adresi" type="email" />
                        <input className="p-3 rounded-lg border" placeholder="Telefon Numarası" />
                        <input className="p-3 rounded-lg border" placeholder="Şehir" />
                        <select className="p-3 rounded-lg border">
                            <option>İş Birliği Türü: Etkinlik</option>
                            <option>İş Birliği Türü: Ürün</option>
                            <option>İş Birliği Türü: Deneyim</option>
                            <option>İş Birliği Türü: Sponsorluk</option>
                            <option>İş Birliği Türü: Diğer</option>
                        </select>

                        <textarea className="p-3 rounded-lg border md:col-span-2" rows={5} placeholder="Kısa Açıklama — Bizi tanıtın, ne sunuyorsunuz?" />

                        <div className="md:col-span-2 flex items-center justify-end gap-3">
                            <button type="button" className="bg-gradient-to-r from-orange-500 to-orange-400 hover:bg-amber-600 text-white px-6 py-3 rounded-full font-semibold">Gönder ve İletişime Geç</button>
                        </div>
                    </form>
                </section>

                <section id="iletisim" className="bg-white rounded-3xl p-8 shadow-md border border-amber-100">
                    <h2 className="text-2xl font-bold text-amber-700">📞 Daha Fazla Bilgi</h2>
                    <p className="mt-2 text-gray-700">Sorularınız veya acil iş birliği talepleriniz için doğrudan bize ulaşabilirsiniz:</p>
                    <ul className="mt-4 text-gray-700">
                        <li>📧 partner@keyiflikutu.com</li>
                        <li>📱 Instagram: @keyiflikutu</li>
                    </ul>
                </section>
            </main>
        </div>
    );
}
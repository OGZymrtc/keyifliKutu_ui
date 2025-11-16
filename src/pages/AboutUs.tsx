import React from "react";
import exampleBox from "../assets/example_box.webp"

export default function AboutPage() {
    return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white text-gray-800 px-6 py-16">
            {/* HERO */}
            <header className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 flex flex-col lg:flex-row items-center gap-12">
                    <div className="w-full lg:w-1/2">
                        <h1 className="text-5xl lg:text-6xl font-extrabold text-amber-700 leading-tight drop-shadow-sm">
                            🌿 Bizim Hikayemiz
                        </h1>
                        <p className="mt-6 text-lg lg:text-xl text-gray-700 leading-relaxed">
                            Keyifli Kutu, küçük mutlulukları büyük anlamlara dönüştüren bir topluluk fikriyle doğdu. İçten, samimi ve paylaşmaya değer anları çoğaltmak için buradayız.
                        </p>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=1200&q=80"
                            alt="Keyifli anlar"
                            className="rounded-3xl shadow-2xl border-4 border-white object-cover h-96 w-full"
                        />
                    </div>
                </div>
            </header>

            {/* CONTENT SECTIONS */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                {/* Nasıl Başladık */}
                <section className="bg-white/80 backdrop-blur-md rounded-3xl p-10 shadow-xl border border-amber-100">
                    <h2 className="text-3xl font-bold text-amber-700 mb-6">✨ Nasıl Başladık?</h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Biz bu yola daha yeni çıktık… ama içimizde kocaman bir heyecan, sıcacık bir merak ve büyük bir hayal var. Bir gün dedik ki:
                        <em> “Artık aynı şeyleri yapmaktan sıkıldık, hayatımıza biraz keyif katalım!”</em>
                    </p>
                    <p className="mt-4 text-gray-700 text-lg">
                        O an fikir doğdu: <strong>Keyifli Kutu.</strong> Her kutunun, her etkinliğin ve her deneyimin ardında bir gülümseme, bir huzur, bir anı var.
                    </p>
                </section>

                {/* Amacımız */}
                <section id="amacimiz" className="bg-white rounded-3xl p-10 shadow-md border border-orange-100">
                    <h2 className="text-3xl font-bold text-amber-800 mb-4">💛 Amacımız</h2>
                    <p className="text-gray-800 text-lg leading-relaxed">
                        Amacımız çok basit ama özel: Türkiye’nin her köşesinde insanlara keyifli anlar yaşatmak. 🎈 Hayatı biraz daha paylaşılabilir, daha içten ve sıcak hale getirmek istiyoruz.
                    </p>
                    <p className="mt-4 text-gray-700 text-lg">
                        İlk adımımızı herkesin kolayca ulaşabileceği <strong>ücretsiz aktiviteleri</strong> paylaşarak attık. Böylece hem herkes faydalanabiliyor hem de bizim gibi düşünen keyifli bir topluluk oluşturuyoruz.
                    </p>
                    <p className="mt-4 text-gray-700 text-lg">
                        Açık konuşmak gerekirse, şu anda amacımız yalnızca mutluluk yaymak değil — sizden öğrenmek, fikirlerinizi duymak ve birlikte büyümek. Sizin deneyimleriniz, Keyifli Kutu’nun yönünü belirleyecek.
                    </p>
                </section>

                {/* Birlikte Gelişiyoruz */}
                <section className="bg-white rounded-3xl p-10 shadow-md border border-orange-100">
                    <h2 className="text-3xl font-bold text-amber-700 mb-4">🌼 Birlikte Gelişiyoruz</h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Bu yolculuğun başındayız ama hayallerimiz büyük. Şu anda sizlere daha fazla keyifli deneyim sunabilmek için partnerlerle görüşüyor, özenle seçilmiş markalarla iş birlikleri kuruyoruz.
                    </p>
                    <p className="mt-4 text-gray-700 text-lg">
                        Her gün yeni yerler keşfetmen, farklı atölyelere katılman, yeni tatlar denemen ve yeni insanlar tanıman için çalışıyoruz. 🌻
                    </p>
                </section>

                {/* Keyifli Kutu */}
                <section className="bg-white rounded-3xl p-10 shadow-md border border-orange-100">
                    <h2 className="text-3xl font-bold text-amber-800 mb-4">🎁 Keyifli Kutu’ya Doğru</h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Bu yolculuğun en heyecan verici kısmı: <strong>Keyifli Kutu’nun kendisi!</strong> Yakında yalnızca deneyimlerle değil, özenle hazırlanmış kutularla da karşınızda olacağız.
                    </p>
                    <p className="mt-4 text-gray-700 text-lg">
                        Her kutuda sevgiyle seçilmiş ürünler, ilham veren temalar ve küçük sürprizlerle dolu bir dünya yer alacak. Sadece bir hediye değil; sevdiklerinize “iyi ki varsın” demenin en güzel hali olacak. 💛
                    </p>
                    <img
                        src={exampleBox}
                        alt="Keyifli kutu örneği"
                        className=" shadow-lg border border-white object-cover w-full"
                    />
                </section>

                {/* Geleceğe Bakış */}
                <section className="bg-white rounded-3xl p-10 shadow-md border border-orange-100">
                    <h2 className="text-3xl font-bold text-amber-700 mb-4">🌸 Geleceğe Bakış</h2>
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Keyifli Kutu bizim için sadece bir marka değil — bir yaşam biçimi. Birlikte keyifli anlar biriktirmek, paylaşmak ve büyümek istiyoruz. Henüz yolun başındayız ama sizin desteğinizle Türkiye’nin dört bir yanında “keyifli” izler bırakacağız.
                    </p>
                    <blockquote className="mt-6 border-l-4 border-amber-300 pl-5 italic text-amber-800 text-lg">
                        “Gelecek bol kahkahalı, bol sürprizli ve bolca keyifli olacak.” 🌿
                    </blockquote>
                </section>

            </main>
        </div>
    );
}
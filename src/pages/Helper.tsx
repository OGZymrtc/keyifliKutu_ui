import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FloatingHelper() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            {/* Floating button */}
            <div className="fixed right-6 bottom-6 z-50">
                <button
                    onClick={() => setOpen(!open)}
                    aria-expanded={open}
                    aria-controls="helper-panel"
                    className="flex items-center gap-3 bg-gradient-to-r from-orange-500 to-orange-400  hover:bg-amber-600 text-white font-semibold px-4 py-3 rounded-full shadow-2xl focus:outline-none focus:ring-4 focus:ring-amber-200 transition"
                    title="Yardım al"
                >
                    <span className="text-xl">💬</span>
                    <span className="hidden sm:inline">Yardımcı Olalım?</span>
                </button>
            </div>

            {/* Panel */}
            <div
                id="helper-panel"
                className={`fixed right-6 bottom-20 z-40 w-80 sm:w-96 transition-transform duration-300 ${open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"
                    }`}
            >
                <div className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
                    <div className="p-4 border-b border-amber-50">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-amber-700">Nasıl yardımcı olabiliriz?</h3>
                                <p className="text-sm text-gray-600 mt-1">Etkinlikler, partnerlik ya da rezervasyon hakkında soruların mı var?</p>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded"
                                aria-label="Kapat"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="p-4">
                        {/* Quick actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => navigate("/products")}
                                className="text-left px-3 py-2 rounded-lg hover:bg-amber-50 border border-amber-100"
                            >
                                🔍 Etkinlikleri Keşfet
                            </button>
                            <button
                                onClick={() => navigate("/beOurPartner")}
                                className="text-left px-3 py-2 rounded-lg hover:bg-amber-50 border border-amber-100"
                            >
                                🤝 Partner Olmak İstiyorum
                            </button>
                            <a href="#iletisim"  onClick={() => navigate("/beOurPartner")} className="block text-left px-3 py-2 rounded-lg hover:bg-amber-50 border border-amber-100">
                                📩 Bize Mesaj Gönder
                            </a>
                        </div>

                        {/* Simple contact form (optional) */}
                        <form className="mt-4 grid gap-2">
                            <input className="p-2 rounded-md border" placeholder="Adınız" />
                            <input className="p-2 rounded-md border" placeholder="E-posta" type="email" />
                            <textarea className="p-2 rounded-md border" rows={2} placeholder="Kısa mesajınız..." />
                            <div className="flex justify-end">
                                <button type="button" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full">
                                    Gönder
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="p-3 text-xs text-gray-500 border-t border-amber-50">
                        <strong>Not:</strong> Mesajınız bize ulaşacaktır; en kısa sürede dönüş yapacağız.
                    </div>
                </div>
            </div>
        </>
    );
}
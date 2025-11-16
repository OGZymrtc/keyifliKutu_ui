import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="bg-gray-900 text-white py-12"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Marka */}
          <div>
            <h3 className="text-2xl font-bold mb-2">KeyifliKutu</h3>
            <p className="text-gray-400">Keyifli Anlar Burada Başlar ✨</p>
          </div>

          {/* KVKK */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Hakkımızda</h4>
            <Link to="/gdpr" className="block text-gray-400 hover:text-orange-400 transition-colors">
              KVKK Politikası
            </Link>
          </div>

          {/* Sosyal Medya */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Sosyal Medya</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/120px-Facebook_f_logo_%282019%29.svg.png" className="h-6" />
                <span>Facebook</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/120px-Instagram_logo_2016.svg.png" className="h-6" />
                <span>Instagram</span>
              </div>
              <div className="flex items-center gap-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/X_logo.jpg" className="h-6" />
                <span>X</span>
              </div>
            </div>
          </div>

          {/* Ödeme & Mobil */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Ödeme Yöntemleri</h4>
            <div className="flex gap-2 mb-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png" className="h-6" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/25/Troy_logo.png" className="h-6" />
            </div>

            <h4 className="text-lg font-semibold mb-2">Mobil Uygulama</h4>
            <div className="flex gap-2">
              <img src="https://upload.wikimedia.org/wikipedia/commons/archive/3/3c/20170219160110%21Download_on_the_App_Store_Badge.svg" className="h-8" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" className="h-8" />
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-500 text-sm border-t border-white/20 pt-4">
          © 2025 KeyifliKutu. Tüm hakları saklıdır.
        </div>
      </div>
    </motion.footer>

  );
};

import FileUpload from '../components/FileUpload';
import { Metadata } from 'next';
import ThemeToggle from '../components/ThemeToggle';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'WhatsApp Sohbet Görüntüleyici',
  description: 'WhatsApp sohbet yedeklerinizi kolayca görüntülemenizi sağlayan modern ve kullanıcı dostu uygulama',
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Header - Modern Glass Effect */}
      <header className="bg-emerald-600/90 backdrop-blur-lg dark:bg-emerald-700/80 text-white shadow-lg sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto py-4 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold">WhatsApp Sohbet Görüntüleyici</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link 
              href="https://github.com/raventrk" 
              target="_blank"
              className="hidden md:flex items-center text-sm font-medium bg-white/10 hover:bg-white/20 rounded-full px-4 py-1.5 transition-all duration-300"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section with Glassmorphism */}
      <section className="relative bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 dark:from-emerald-800 dark:via-teal-900 dark:to-emerald-950 py-24">
        <div className="absolute inset-0 bg-[url('https://i.pinimg.com/originals/97/c0/07/97c00759d90d786d9b6a65b35bd2be9f.jpg')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a]/20 dark:to-[#0a0a0a]/80"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              WhatsApp Sohbetleriniz <span className="text-yellow-300 dark:text-yellow-200">Modern</span> Bir Arayüzle
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed max-w-2xl mx-auto">
              Sohbet yedeğinizi yükleyin, gizliliğinizi koruyarak tüm mesajlarınızı ve medyalarınızı görüntüleyin.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <a 
                href="#upload" 
                className="w-full sm:w-auto px-8 py-4 bg-white text-emerald-700 rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none text-center"
              >
                Hemen Başla
              </a>
              <a 
                href="#features" 
                className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 text-center"
              >
                Özellikler
              </a>
            </div>
          </div>
        </div>
      </section>
      
      {/* Wave Divider */}
      <div className="relative h-24 bg-gray-50 dark:bg-[#0a0a0a] -mt-10">
        <svg className="absolute bottom-0 w-full h-24 transform translate-y-1 fill-current text-gray-50 dark:text-[#0a0a0a]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
      
      {/* Main Content */}
      <main className="flex-grow pt-8 pb-20">
        {/* Upload Section */}
        <section id="upload" className="container mx-auto px-6 mb-24">
          <div className="bg-white dark:bg-[#111111] rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto transform hover:shadow-3xl transition-all duration-500">
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-8 md:p-12">
                <div className="max-w-md">
                  <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
                    Sohbetinizi Yükleyin
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">
                    WhatsApp sohbet yedeğinizi (.txt veya .zip) yükleyin ve anında görüntüleyin.
                    <span className="block mt-3 text-sm opacity-80 px-4 py-3 bg-gray-50 dark:bg-[#0a0a0a]/80 rounded-xl">Verileriniz sadece cihazınızda işlenir, sunucuya gönderilmez.</span>
                  </p>
                  
                  <FileUpload />
                </div>
              </div>
              
              <div className="w-full md:w-1/2 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-700 dark:to-teal-900 p-8 md:p-12 flex items-center justify-center">
                <div className="relative w-64 h-96 bg-white/10 backdrop-blur-md rounded-3xl p-4 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    {/* WhatsApp benzeri arkaplan */}
                    <div className="absolute inset-0 bg-[url('https://i.pinimg.com/originals/97/c0/07/97c00759d90d786d9b6a65b35bd2be9f.jpg')] opacity-5"></div>
                    
                    {/* Üst kısım */}
                    <div className="absolute top-0 left-0 right-0 h-16 bg-emerald-600 dark:bg-emerald-800 flex items-center px-4 z-10">
                      <div className="w-8 h-8 rounded-full bg-white/20 mr-3"></div>
                      <div className="text-white font-medium">Sohbet Önizleme</div>
                    </div>
                    
                    {/* Mesaj balonları */}
                    <div className="absolute top-20 left-0 right-0 bottom-0 p-4 overflow-hidden">
                      <div className="p-3 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl bg-white/90 dark:bg-[#222] shadow-sm max-w-[70%] mb-4 text-sm text-gray-800 dark:text-gray-200">
                        Merhaba! Nasılsın?
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">10:20</div>
                      </div>
                      
                      <div className="p-3 rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl bg-emerald-100 dark:bg-emerald-800 shadow-sm max-w-[70%] ml-auto mb-4 text-sm text-emerald-800 dark:text-emerald-100">
                        İyiyim, teşekkürler! Sen?
                        <div className="text-xs text-emerald-700/70 dark:text-emerald-300/70 text-right mt-1">10:21</div>
                      </div>
                      
                      <div className="p-3 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl bg-white/90 dark:bg-[#222] shadow-sm max-w-[70%] mb-4 text-sm text-gray-800 dark:text-gray-200">
                        Ben de iyiyim. Bu uygulama harika görünüyor!
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">10:22</div>
                      </div>
                      
                      <div className="p-3 rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl bg-emerald-100 dark:bg-emerald-800 shadow-sm max-w-[70%] ml-auto mb-4 text-sm text-emerald-800 dark:text-emerald-100">
                        Evet, sohbetleri görüntülemek çok kolay!
                        <div className="text-xs text-emerald-700/70 dark:text-emerald-300/70 text-right mt-1">10:23</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="container mx-auto px-6 mb-24">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 mb-4">Özellikleri Keşfedin</span>
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
              Öne Çıkan Özellikler
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              WhatsApp Sohbet Görüntüleyici sohbet geçmişinizi kolayca incelemeniz için modern araçlar sunar.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#111111] rounded-2xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:translate-y-[-5px] border border-gray-100/10 dark:border-gray-800/50">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/20 mb-6">
                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Kolay Kullanım</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sohbet dosyanızı sürükleyip bırakın veya tıklayarak seçin. Gerisi otomatik olarak hallolur.
              </p>
            </div>
            
            <div className="bg-white dark:bg-[#111111] rounded-2xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:translate-y-[-5px] border border-gray-100/10 dark:border-gray-800/50">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/20 mb-6">
                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Gizlilik Odaklı</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Tüm işlemler cihazınızda gerçekleşir. Hiçbir veri sunucuya gönderilmez veya saklanmaz.
              </p>
            </div>
            
            <div className="bg-white dark:bg-[#111111] rounded-2xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:translate-y-[-5px] border border-gray-100/10 dark:border-gray-800/50">
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/20 mb-6">
                <svg className="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">Modern Tasarım</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Aydınlık ve karanlık tema seçenekleri ile her zaman göz yormayan bir görüntüleme deneyimi.
              </p>
            </div>
          </div>
        </section>
        
        {/* How to Use Section with Modern Card Layout */}
        <section className="container mx-auto px-6 mb-24">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 mb-4">Kullanım Kılavuzu</span>
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Nasıl Kullanılır?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              WhatsApp sohbetlerinizi görüntülemek için aşağıdaki basit adımları izleyin
            </p>
          </div>
          
          <div className="bg-white dark:bg-[#111111] rounded-3xl shadow-2xl p-10 border border-gray-100/10 dark:border-gray-800/50 max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xl shadow-sm">1</div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">WhatsApp&apos;ta görüntülemek istediğiniz sohbeti açın</h4>
                  <p className="text-gray-600 dark:text-gray-400">İster bireysel sohbet, ister grup sohbeti olsun.</p>
                </div>
              </div>
              
              <div className="w-full border-t border-gray-100 dark:border-gray-800 my-4"></div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xl shadow-sm">2</div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Sağ üst köşedeki üç nokta menüsüne tıklayın</h4>
                  <p className="text-gray-600 dark:text-gray-400">Bu menüden diğer seçeneklere erişebilirsiniz.</p>
                </div>
              </div>
              
              <div className="w-full border-t border-gray-100 dark:border-gray-800 my-4"></div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xl shadow-sm">3</div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">&quot;Diğer&quot; &gt; &quot;Sohbeti Dışa Aktar&quot; seçeneğini seçin</h4>
                  <p className="text-gray-600 dark:text-gray-400">WhatsApp, sohbeti dışa aktarmanıza izin verecektir.</p>
                </div>
              </div>
              
              <div className="w-full border-t border-gray-100 dark:border-gray-800 my-4"></div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xl shadow-sm">4</div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">&quot;Medya olmadan&quot; veya &quot;Medya ile&quot; seçeneğini belirleyin</h4>
                  <p className="text-gray-600 dark:text-gray-400">Medya ile seçeneği, fotoğraf ve videoları zip dosyası olarak dışa aktarır.</p>
                </div>
              </div>
              
              <div className="w-full border-t border-gray-100 dark:border-gray-800 my-4"></div>
              
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-shrink-0 w-14 h-14 bg-emerald-100 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xl shadow-sm">5</div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Oluşturulan dosyayı yukarıdaki alana sürükleyip bırakın</h4>
                  <p className="text-gray-600 dark:text-gray-400">Dosyanız işlendikten sonra modern bir arayüzde görüntülenecektir.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer with Developer Info */}
      <footer className="bg-white dark:bg-[#0f0f0f] border-t border-gray-200 dark:border-gray-800/50 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl text-gray-700 dark:text-gray-200 font-semibold">WhatsApp Sohbet Görüntüleyici</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                WhatsApp sohbetlerinizi güvenli ve modern bir arayüzle görüntülemenizi sağlayan açık kaynaklı bir uygulama.
              </p>
              <div className="flex items-center space-x-4">
                <a href="https://github.com/raventrk" target="_blank" rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500 transition-all hover:scale-110">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://0xrvn.com/" target="_blank" rel="noopener noreferrer" 
                  className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500 transition-all hover:scale-110">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18V19.93ZM17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Hızlı Bağlantılar</h4>
              <ul className="space-y-3">
                <li><a href="#upload" className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500 transition-colors">Sohbet Yükle</a></li>
                <li><a href="#features" className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500 transition-colors">Özellikler</a></li>
                <li><a href="https://github.com/raventrk" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500 transition-colors">GitHub</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Destek Ol</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Bu projeyi beğendiyseniz, geliştiriciye bir kahve ısmarlayabilirsiniz.
              </p>
              <a href="https://www.buymeacoffee.com/raventrk" target="_blank" rel="noopener noreferrer" 
                 className="inline-block transform hover:scale-105 transition-transform">
                <Image 
                  src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=❤️&slug=raventrk&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" 
                  alt="Buy Me A Coffee" 
                  width={160} 
                  height={40}
                  className="h-10"
                  unoptimized
                />
              </a>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800/50 flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; {new Date().getFullYear()} Geliştirici: <a href="https://0xrvn.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:underline">raventrk</a>. Tüm hakları saklıdır.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <a href="https://0xrvn.com/" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500 transition-colors">0xrvn.com</a>
              <a href="https://github.com/raventrk" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500 transition-colors">GitHub</a>
              <a href="https://www.buymeacoffee.com/raventrk" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500 transition-colors">Buy Me a Coffee</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

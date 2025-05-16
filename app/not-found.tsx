import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2">Sayfa Bulunamadı</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
          <Link 
            href="/" 
            className="inline-block px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-md transition-colors"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </div>
  );
} 
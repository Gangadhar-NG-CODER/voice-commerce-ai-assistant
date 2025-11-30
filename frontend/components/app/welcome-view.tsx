import { Button } from '@/components/livekit/button';

function WelcomeImage() {
  return (
    <svg
      width="80"
      height="80"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-xl"
    >
      {/* Shopping bag */}
      <path
        d="M16 20L12 56H52L48 20H16Z"
        stroke="#10b981"
        strokeWidth="3"
        fill="rgba(16, 185, 129, 0.1)"
        strokeLinejoin="round"
      />
      <path
        d="M22 20V16C22 10.5 26.5 6 32 6C37.5 6 42 10.5 42 16V20"
        stroke="#10b981"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="32" r="2" fill="#34d399" />
      <circle cx="40" cy="32" r="2" fill="#34d399" />
    </svg>
  );
}

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  return (
    <div ref={ref} className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-8">
        <div className="w-full max-w-4xl space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <WelcomeImage />
              </div>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-white">
              VOICE COMMERCE
            </h1>
            
            <p className="text-xl text-emerald-300 font-medium">
              Shop Smarter with AI Voice Assistant
            </p>
          </div>

          {/* Main Content Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/20 shadow-2xl">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="text-5xl mb-2">🎤</div>
                <h3 className="text-white font-bold">Speak Naturally</h3>
                <p className="text-emerald-300 text-sm">Just talk to browse and order products</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-5xl mb-2">🤖</div>
                <h3 className="text-white font-bold">AI Assistant</h3>
                <p className="text-emerald-300 text-sm">Powered by Murf Falcon TTS</p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="text-5xl mb-2">⚡</div>
                <h3 className="text-white font-bold">Instant Orders</h3>
                <p className="text-emerald-300 text-sm">Fast, seamless checkout</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={onStartCall} 
              className="group relative px-16 py-5 text-2xl font-black bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-2xl shadow-emerald-500/50 transform hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10">🛍️ {startButtonText}</span>
              <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity"></div>
            </Button>
          </div>

          {/* Product Categories */}
          <div className="text-center">
            <p className="text-emerald-300 text-sm mb-3">Available Products</p>
            <div className="flex justify-center gap-3 flex-wrap">
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-emerald-500/30">☕ Mugs</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-emerald-500/30">👕 T-Shirts</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-emerald-500/30">🧥 Hoodies</span>
              <span className="px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm border border-emerald-500/30">🎒 Accessories</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

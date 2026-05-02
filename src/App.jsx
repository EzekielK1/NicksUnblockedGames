import { useState, useMemo, useEffect } from "react";
import { Gamepad2, Search, X, Maximize2, ExternalLink, Filter, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import gamesData from "./games.json";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = ["All", ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || game.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // Handle escape key to close game
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setSelectedGame(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-bg-dark/80 backdrop-blur-lg border-b border-white/5 py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}>
          <div className="p-2 bg-brand-primary/10 rounded-lg group-hover:bg-brand-primary/20 transition-colors">
            <Gamepad2 className="w-8 h-8 text-brand-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase italic">Nexus<span className="text-brand-primary">Games</span></h1>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500">Unblocked v1.0.4</p>
          </div>
        </div>

        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search for a game..."
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary/40 transition-all placeholder:text-slate-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Hero / Categories */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-primary" />
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Categories</h2>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat 
                    ? "bg-brand-primary text-bg-dark" 
                    : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Game Grid */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-4 h-4 text-brand-secondary" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
              {searchQuery ? `Search Results (${filteredGames.length})` : "Featured Games"}
            </h2>
          </div>

          {filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredGames.map((game, idx) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative"
                >
                  <div 
                    onClick={() => setSelectedGame(game)}
                    className="glass-panel overflow-hidden rounded-2xl cursor-pointer hover:neon-glow transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98]"
                  >
                    <div className="aspect-video relative overflow-hidden bg-slate-800">
                      <img 
                        src={game.thumbnail || `https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400&h=225&auto=format&fit=crop`}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <div className="bg-brand-primary text-bg-dark p-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <Maximize2 className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest">{game.category}</span>
                      </div>
                      <h3 className="font-bold text-lg group-hover:text-brand-primary transition-colors">{game.title}</h3>
                      <p className="text-sm text-slate-400 line-clamp-2 mt-1">{game.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="inline-block p-4 bg-white/5 rounded-full mb-4">
                <Gamepad2 className="w-12 h-12 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-400">No games found matches your search.</h3>
              <button 
                onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                className="mt-4 text-brand-primary hover:underline underline-offset-4"
              >
                Clear all filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 mt-20 bg-card-bg/20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
             <h2 className="text-xl font-bold tracking-tight text-white uppercase italic">Nexus<span className="text-brand-primary">Games</span></h2>
             <p className="text-sm text-slate-500 mt-2 max-w-xs">A modern gateway for unblocked gaming. Play your favorite titles anywhere, anytime.</p>
          </div>
          <div className="flex gap-12 font-mono text-xs uppercase tracking-widest text-slate-500">
            <div>
              <p className="mb-4 text-slate-300">Infrastructure</p>
              <ul className="space-y-2">
                <li>Static Hosting</li>
                <li>JSON Database</li>
                <li>Iframe Engine</li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-slate-300">Community</p>
              <ul className="space-y-2">
                <li className="hover:text-brand-primary cursor-pointer transition-colors">Submit Game</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">Report Bug</li>
                <li className="hover:text-brand-primary cursor-pointer transition-colors">Discord</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-600 uppercase tracking-widest">
          <p>© 2026 NEXUS CORE SYSTEMS. ALL RIGHTS RESERVED.</p>
          <p>STYLIZED BY ANTIGRAVITY</p>
        </div>
      </footer>

      {/* Game Portal Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-bg-dark/95 backdrop-blur-xl"
          >
            <motion.div
              layoutId={selectedGame.id}
              className="w-full max-w-6xl h-full flex flex-col glass-panel rounded-3xl overflow-hidden relative shadow-2xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-4 md:p-6 border-b border-white/10 flex items-center justify-between bg-bg-dark/50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-brand-primary/10 rounded-lg">
                    <Gamepad2 className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold italic uppercase">{selectedGame.title}</h2>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">{selectedGame.category} // Session Active</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    title="Open in new tab"
                    onClick={() => window.open(selectedGame.iframeUrl, '_blank')}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-full transition-colors text-slate-400"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-black relative">
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="p-4 px-6 md:px-8 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                <div className="flex gap-6">
                  <span>SECURE_IFRAME_PORTAL_ACTIVE</span>
                  <span className="hidden md:inline">ENCRYPTED_STREAM_V3</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary pulse" />
                  <span>CONNECTED TO {selectedGame.id.toUpperCase()}_NODE</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

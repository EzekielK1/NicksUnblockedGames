
function gameApp() {
  return {
    allGames: [],
    searchQuery: '',
    activeCategory: 'All',
    selectedGame: null,
    categories: ['All'],
    
    async init() {
      console.log("Initializing NicksUnblockedGames...");
      try {
        // Use a relative path that works on both local dev and GitHub Pages subpaths.
        // We fetch 'games.json' relative to the current location.
        const response = await fetch('games.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        this.allGames = await response.json();
        
        // Extract categories
        const cats = new Set(this.allGames.map(g => g.category));
        this.categories = ['All', ...Array.from(cats)].sort();
        
        console.log("Games loaded:", this.allGames.length);
        this.refreshIcons();
      } catch (e) {
        console.error("Failed to load games:", e);
        // Fallback sample game if fetch fails
        this.allGames = [{
          id: 'error',
          title: 'Data Load Error',
          description: 'Could not load games.json. Please ensure it is present in the public folder.',
          iframeUrl: '',
          category: 'Error'
        }];
      }
      
      this.$watch('searchQuery', () => this.refreshIcons());
      this.$watch('activeCategory', () => this.refreshIcons());
    },
    
    get filteredGames() {
      return this.allGames.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                            game.description.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory = this.activeCategory === 'All' || game.category === this.activeCategory;
        return matchesSearch && matchesCategory;
      });
    },
    
    openGame(game) {
      if (!game.iframeUrl) return;
      this.selectedGame = game;
      this.refreshIcons();
    },
    
    toggleFullscreen() {
      const container = this.$refs.gameContainer;
      if (!container) return;

      if (!document.fullscreenElement) {
        container.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    },
    
    closeGame() {
      this.selectedGame = null;
    },
    
    resetFilters() {
      this.searchQuery = '';
      this.activeCategory = 'All';
    },
    
    refreshIcons() {
      this.$nextTick(() => {
        if (window.lucide) {
          window.lucide.createIcons();
        }
      });
    }
  }
}
window.gameApp = gameApp;

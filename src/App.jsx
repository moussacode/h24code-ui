import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'

const App = () => {
  const [snippets, setSnippets] = useState([]);
  const [filteredSnippets, setFilteredSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [filter, setFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Configuration de l'API
  const API_BASE_URL = 'https://h24code-api.onrender.com/api';

  // Styles avec responsive amélioré
  const styles = {
    container: {
      minHeight: '100vh',
      width: '100%',
      background: '#ffffff',
      fontFamily: "poppins, sans-serif",
      color: '#1f2328',
    },
    header: {
      background: '#f6f8fa',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '15px 0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    },
    headerContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '10px'
    },
    brandSection: {
      fontSize: '18px',
      textAlign: 'start',
      fontWeight: 'bold',
      color: '#1f2328',
      minWidth: '200px'
    },
    brandSubtitle: {
      fontSize: '11px',
      fontWeight: 'normal',
      color: '#1f2328'
    },
    addButton: {
      background: 'white',
      color: '#1f2328',
      border: '2px solid #d1d9e0',
      padding: '10px 20px',
      borderRadius: '25px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
      whiteSpace: 'nowrap'
    },
    hero: {
      textAlign: 'center',
      padding: '30px 15px 40px',
      color: '#1f2328'
    },
    heroTitle: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: 'bold',
      marginBottom: '20px',
      lineHeight: '1.2'
    },
    heroSubtitle: {
      fontSize: 'clamp(1rem, 3vw, 1.3rem)',
      opacity: 0.9,
      marginBottom: '30px',
      maxWidth: '600px',
      margin: '0 auto 30px',
      lineHeight: '1.5'
    },
    searchBar: {
      maxWidth: '500px',
      margin: '0 auto',
      position: 'relative',
      padding: '0 15px'
    },
    searchInput: {
      width: '100%',
      padding: '12px 45px 12px 15px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '25px',
      outline: 'none',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      boxSizing: 'border-box'
    },
    searchIcon: {
      position: 'absolute',
      right: '30px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '18px',
      color: '#667eea'
    },
    mainContent: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 15px 60px'
    },
    filtersSection: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '30px',
      flexWrap: 'wrap',
      padding: '0 10px'
    },
    filterChip: {
      padding: '8px 16px',
      background: 'rgba(255, 255, 255, 0.9)',
      color: '#2c3e50',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontWeight: '500',
      fontSize: '14px',
      minWidth: 'fit-content'
    },
    filterChipActive: {
      padding: '8px 16px',
      background: 'white',
      color: '#667eea',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      fontWeight: '600',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      fontSize: '14px',
      minWidth: 'fit-content'
    },
    snippetsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))',
      gap: '20px',
      padding: '0 5px'
    },
    snippetCard: {
      background: '#ffffff',
      borderRadius: '15px',
      border: '1px solid #e9ecef',
      padding: '20px',
      boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    },
    snippetHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '15px',
      flexWrap: 'wrap',
      gap: '10px'
    },
    snippetTitle: {
      fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: '8px',
      lineHeight: '1.3',
      wordBreak: 'break-word'
    },
    snippetCategory: {
      padding: '4px 12px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      whiteSpace: 'nowrap'
    },
    categoryPHP: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white'
    },
    categoryHTML: {
      background: 'linear-gradient(135deg, #f093fb, #f5576c)',
      color: 'white'
    },
    categoryCSS: {
      background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
      color: 'white'
    },
    snippetDescription: {
      color: '#6c757d',
      marginBottom: '15px',
      lineHeight: '1.5',
      fontSize: '14px',
      wordBreak: 'break-word'
    },
    snippetCode: {
      background: '#1e1e1e',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '0',
      fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
      fontSize: '13px',
      lineHeight: '1.5',
      maxHeight: '300px',
      overflowY: 'auto',
      overflowX: 'auto',
      marginBottom: '15px',
      position: 'relative'
    },
    codeHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#2d2d2d',
      padding: '8px 12px',
      borderBottom: '1px solid #404040',
      borderTopLeftRadius: '8px',
      borderTopRightRadius: '8px'
    },
    codeLanguage: {
      color: '#569cd6',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    codeContent: {
      padding: '16px',
      color: '#d4d4d4',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      background: '#1e1e1e'
    },
    copyButton: {
      background: '#007acc',
      color: 'white',
      border: 'none',
      padding: '6px 12px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    copyButtonSuccess: {
      background: '#28a745',
      color: 'white'
    },
    fullCopyButton: {
      background: 'linear-gradient(135deg, #007acc, #0066cc)',
      color: 'white',
      border: 'none',
      padding: '10px 16px',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px'
    },
    message: {
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontWeight: '500',
      fontSize: '14px'
    },
    messageSuccess: {
      background: 'linear-gradient(135deg, #d4edda, #c3e6cb)',
      color: '#155724',
      border: '1px solid #c3e6cb'
    },
    messageError: {
      background: 'linear-gradient(135deg, #f8d7da, #f5c6cb)',
      color: '#721c24',
      border: '1px solid #f5c6cb'
    },
    loading: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#1f2328',
      fontSize: '1.1em'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#1f2328'
    },
    emptyStateTitle: {
      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
      fontWeight: 'bold',
      marginBottom: '15px'
    },
    // Media queries simulées avec des styles adaptatifs
    '@media (max-width: 768px)': {
      headerContent: {
        flexDirection: 'column',
        gap: '15px',
        textAlign: 'center'
      },
      addButton: {
        padding: '8px 16px',
        fontSize: '13px'
      },
      hero: {
        padding: '20px 10px 30px'
      },
      filtersSection: {
        gap: '8px',
        padding: '0 5px'
      },
      filterChip: {
        padding: '6px 12px',
        fontSize: '12px'
      },
      filterChipActive: {
        padding: '6px 12px',
        fontSize: '12px'
      },
      snippetsGrid: {
        gridTemplateColumns: '1fr',
        gap: '15px'
      },
      snippetCard: {
        padding: '15px'
      }
    }
  };

  // Charger les snippets
  const loadSnippets = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/snippets`, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSnippets(data);
        setFilteredSnippets(data);
      } else {
        showMessage('Erreur lors du chargement des snippets', 'error');
      }
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('Erreur de connexion au serveur', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Filtrer et rechercher
  const filterAndSearch = () => {
    let filtered = snippets;
    
    if (filter) {
      filtered = filtered.filter(snippet => snippet.category === filter);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(snippet => 
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredSnippets(filtered);
  };

  // État pour les confirmations de copie
  const [copyStates, setCopyStates] = useState({});

  // Copier le code avec confirmation locale
  const copyCode = async (code, snippetId, event) => {
    try {
      await navigator.clipboard.writeText(code);
      
      // Marquer ce snippet comme copié
      setCopyStates(prev => ({
        ...prev,
        [snippetId]: true
      }));

      // Réinitialiser après 2 secondes
      setTimeout(() => {
        setCopyStates(prev => ({
          ...prev,
          [snippetId]: false
        }));
      }, 2000);

    } catch (error) {
      showMessage('Erreur lors de la copie', 'error');
    }
  };

  // Fonction pour colorer la syntaxe (basique)
  const highlightCode = (code, category) => {
    // Coloration basique selon le langage
    const colors = {
      keyword: '#569cd6',
      string: '#ce9178',
      comment: '#6a9955',
      function: '#dcdcaa',
      variable: '#9cdcfe',
      tag: '#569cd6',
      attribute: '#92c5f7',
      value: '#ce9178'
    };

    let highlighted = code;

    if (category === 'PHP') {
      // Mots-clés PHP
      highlighted = highlighted.replace(/\b(function|class|public|private|protected|static|return|if|else|foreach|for|while|echo|print|var|const|namespace|use)\b/g, `<span style="color: ${colors.keyword}">$1</span>`);
      // Chaînes
      highlighted = highlighted.replace(/(["'])([^"']*)\1/g, `<span style="color: ${colors.string}">$1$2$1</span>`);
      // Variables
      highlighted = highlighted.replace(/(\$\w+)/g, `<span style="color: ${colors.variable}">$1</span>`);
    } else if (category === 'HTML') {
      // Balises HTML
      highlighted = highlighted.replace(/(&lt;\/?[^&gt;]+&gt;)/g, `<span style="color: ${colors.tag}">$1</span>`);
    } else if (category === 'CSS') {
      // Sélecteurs CSS
      highlighted = highlighted.replace(/([.#]?[\w-]+)(\s*{)/g, `<span style="color: ${colors.function}">$1</span>$2`);
      // Propriétés
      highlighted = highlighted.replace(/([\w-]+)(\s*:)/g, `<span style="color: ${colors.attribute}">$1</span>$2`);
    }

    return highlighted;
  };

  // Afficher un message
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  // Charger les snippets au montage
  useEffect(() => {
    loadSnippets();
  }, []);

  // Filtrer quand les critères changent
  useEffect(() => {
    filterAndSearch();
  }, [filter, searchTerm, snippets]);

  // Statistiques
  const stats = {
    total: snippets.length,
    php: snippets.filter(s => s.category === 'PHP').length,
    html: snippets.filter(s => s.category === 'HTML').length,
    css: snippets.filter(s => s.category === 'CSS').length
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.brandSection}>
            H24Code Partage
            <div style={styles.brandSubtitle}>By Moussa Ali Mchangama</div>
          </div>

          <Link to="/add-snippet" style={styles.addButton}>
            Ajouter un Snippet
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>
          Partage ton Code 
        </h1>
        <p style={styles.heroSubtitle}>
          Une collection de code partagés gratuitement par la communauté.
        </p>
        
        <div style={styles.searchBar}>
          <input
            type="text"
            placeholder="Rechercher du code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <span style={styles.searchIcon}>🔍</span>
        </div>
      </section>

      {/* Contenu principal */}
      <main style={styles.mainContent}>
        {/* Message */}
        {message.text && (
          <div style={{
            ...styles.message,
            ...(message.type === 'success' ? styles.messageSuccess : styles.messageError)
          }}>
            {message.text}
          </div>
        )}

        {/* Filtres */}
        <div style={styles.filtersSection}>
          <button
            onClick={() => setFilter('')}
            style={filter === '' ? styles.filterChipActive : styles.filterChip}
            onMouseEnter={(e) => {
              if (filter !== '') {
                e.target.style.background = 'white';
                e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== '') {
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            Tous ({stats.total})
          </button>
          <button
            onClick={() => setFilter('PHP')}
            style={filter === 'PHP' ? styles.filterChipActive : styles.filterChip}
            onMouseEnter={(e) => {
              if (filter !== 'PHP') {
                e.target.style.background = 'white';
                e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== 'PHP') {
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            PHP ({stats.php})
          </button>
          <button
            onClick={() => setFilter('HTML')}
            style={filter === 'HTML' ? styles.filterChipActive : styles.filterChip}
            onMouseEnter={(e) => {
              if (filter !== 'HTML') {
                e.target.style.background = 'white';
                e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== 'HTML') {
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            HTML ({stats.html})
          </button>
          <button
            onClick={() => setFilter('CSS')}
            style={filter === 'CSS' ? styles.filterChipActive : styles.filterChip}
            onMouseEnter={(e) => {
              if (filter !== 'CSS') {
                e.target.style.background = 'white';
                e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (filter !== 'CSS') {
                e.target.style.background = 'rgba(255, 255, 255, 0.9)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            CSS ({stats.css})
          </button>
        </div>

        {/* Grille des snippets */}
        {loading ? (
          <div style={styles.loading}>
            Chargement des snippets...
          </div>
        ) : filteredSnippets.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyStateTitle}>
              {searchTerm || filter ? 'Aucun résultat trouvé' : 'Aucun snippet pour le moment'}
            </h3>
            <p>
              {searchTerm || filter 
                ? 'Essayez d\'ajuster vos critères de recherche' 
                : 'Commencez par ajouter votre premier snippet !'}
            </p>
          </div>
        ) : (
          <div style={styles.snippetsGrid}>
            {filteredSnippets.map((snippet) => (
              <div
                key={snippet.id}
                style={styles.snippetCard}
                onMouseEnter={(e) => {
                  if (window.innerWidth > 768) {
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth > 768) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)';
                  }
                }}
              >
                <div style={styles.snippetHeader}>
                  <div style={{ flex: 1 }}>
                    <h3 style={styles.snippetTitle}>
                      {snippet.title}
                    </h3>
                    <span style={{
                      ...styles.snippetCategory,
                      ...(snippet.category === 'PHP' ? styles.categoryPHP :
                          snippet.category === 'HTML' ? styles.categoryHTML :
                          styles.categoryCSS)
                    }}>
                      {snippet.category}
                    </span>
                  </div>
                </div>
                
                <p style={styles.snippetDescription}>
                  {snippet.description || 'Aucune description disponible'}
                </p>
                
                <div style={styles.snippetCode}>
                  <div style={styles.codeHeader}>
                    <span style={styles.codeLanguage}>
                      {snippet.category.toLowerCase()}
                    </span>
                    <button
                      onClick={(e) => copyCode(snippet.code, snippet.id, e)}
                      style={{
                        ...styles.copyButton,
                        ...(copyStates[snippet.id] ? styles.copyButtonSuccess : {})
                      }}
                      onMouseEnter={(e) => {
                        if (!copyStates[snippet.id]) {
                          e.target.style.background = '#0088cc';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!copyStates[snippet.id]) {
                          e.target.style.background = '#007acc';
                        }
                      }}
                    >
                      {copyStates[snippet.id] ? (
                        <>
                          <span>✓</span>
                          Copié !
                        </>
                      ) : (
                        <>
                          <span>📋</span>
                          Copier
                        </>
                      )}
                    </button>
                  </div>
                  <div 
                    style={styles.codeContent}
                    dangerouslySetInnerHTML={{
                      __html: highlightCode(
                        snippet.code
                          .replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;'), 
                        snippet.category
                      )
                    }}
                  />
                </div>
                <button
                  onClick={(e) => copyCode(snippet.code, snippet.id, e)}
                  style={{
                    ...styles.fullCopyButton,
                    ...(copyStates[snippet.id] ? { background: 'linear-gradient(135deg, #28a745, #20c997)' } : {})
                  }}
                  onMouseEnter={(e) => {
                    if (!copyStates[snippet.id]) {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(0, 122, 204, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!copyStates[snippet.id]) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {copyStates[snippet.id] ? (
                    <>
                      <span></span>
                      Code copié avec succès !
                    </>
                  ) : (
                    <>
                      <span></span>
                      Copier tout le code
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AddSnippetPage = () => {
  const navigate = useNavigate()
  const API_BASE_URL = 'https://h24code-api.onrender.com/api'

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    code: ''
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) return // éviter les double clics
    setLoading(true)

    try {
      const response = await fetch(`${API_BASE_URL}/snippets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      console.log(result)

      if (response.ok) {
        showMessage('Snippet ajouté avec succès !', 'success')
        setFormData({ title: '', description: '', category: '', code: '' })
        setTimeout(() => navigate('/'), 1500)
      } else {
        const errorMsg = result.errors ?
          Object.values(result.errors).flat().join(', ') :
          (result.error || 'Erreur lors de l\'ajout')
        showMessage(errorMsg, 'error')
      }
    } catch (error) {
      console.error('Erreur:', error)
      showMessage('Erreur de connexion au serveur', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Compter les lignes de code
  const getCodeStats = (code) => {
    const lines = code.split('\n').length;
    const chars = code.length;
    return { lines, chars };
  };

  // Gérer les tabulations dans le textarea
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const value = e.target.value;
      
      // Insérer 2 espaces au lieu d'une tabulation
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      
      setFormData(prev => ({
        ...prev,
        code: newValue
      }));
      
      // Repositionner le curseur
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px 15px 40px',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa'
    },
    header: {
      marginBottom: '25px',
      textAlign: 'center',
      padding: '0 10px'
    },
    title: {
      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
      fontWeight: 'bold',
      color: '#1f2328',
      marginBottom: '10px',
      lineHeight: '1.3'
    },
    backButton: {
      display: 'inline-block',
      color: '#667eea',
      textDecoration: 'underline',
      cursor: 'pointer',
      fontWeight: '500',
      fontSize: '14px',
      padding: '5px 0',
      transition: 'color 0.2s ease'
    },
    form: {
      backgroundColor: 'white',
      padding: 'clamp(20px, 4vw, 30px)',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #e9ecef'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#1f2328',
      fontSize: '14px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '15px',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box',
      fontFamily: 'inherit'
    },
    textarea: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '15px',
      minHeight: '120px',
      resize: 'vertical',
      fontFamily: "'Fira Code', 'Courier New', monospace",
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box',
      lineHeight: '1.5'
    },
    codeTextarea: {
      minHeight: '300px',
      fontSize: '14px',
      background: '#1e1e1e',
      color: '#d4d4d4',
      border: '2px solid #333',
      fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
      lineHeight: '1.6',
      padding: '16px',
      borderRadius: '8px',
      resize: 'vertical'
    },
    codeContainer: {
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '2px solid #e9ecef',
      transition: 'border-color 0.2s ease'
    },
    codeHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#2d2d2d',
      padding: '8px 16px',
      borderBottom: '1px solid #404040'
    },
    codeLanguageLabel: {
      color: '#569cd6',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    codeStats: {
      color: '#888',
      fontSize: '11px'
    },
    codeEditor: {
      width: '100%',
      minHeight: '300px',
      padding: '16px',
      border: 'none',
      outline: 'none',
      resize: 'vertical',
      fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
      fontSize: '14px',
      lineHeight: '1.6',
      background: '#1e1e1e',
      color: '#d4d4d4',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e9ecef',
      borderRadius: '8px',
      fontSize: '15px',
      backgroundColor: 'white',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box',
      fontFamily: 'inherit'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: '15px',
      marginTop: '30px',
      flexWrap: 'wrap'
    },
    button: {
      flex: 1,
      minWidth: '140px',
      padding: '12px 20px',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      border: 'none',
      transition: 'all 0.2s ease',
      minHeight: '48px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    cancelButton: {
      backgroundColor: '#f8f9fa',
      color: '#495057',
      border: '2px solid #dee2e6'
    },
    submitButton: {
      backgroundColor: loading ? '#a5b4fc' : '#667eea',
      color: 'white',
      border: '2px solid transparent'
    },
    message: {
      padding: '15px 20px',
      borderRadius: '8px',
      marginBottom: '25px',
      fontWeight: '500',
      fontSize: '14px',
      border: '1px solid transparent'
    },
    messageSuccess: {
      backgroundColor: '#d4edda',
      color: '#155724',
      borderColor: '#c3e6cb'
    },
    messageError: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      borderColor: '#f5c6cb'
    },
    // Styles pour mobile
    '@media (max-width: 768px)': {
      container: {
        padding: '15px 10px 30px'
      },
      form: {
        padding: '20px 15px'
      },
      buttonGroup: {
        flexDirection: 'column',
        gap: '12px'
      },
      button: {
        minWidth: 'auto',
        width: '100%'
      }
    }
  }

  const showMessage = (text, type) => {
    setMessage({ text, type })
    setTimeout(() => {
      setMessage({ text: '', type: '' })
    }, 5000)
  }

  const { lines, chars } = getCodeStats(formData.code);

  // Styles dynamiques pour les focus et hover
  const inputFocusStyle = {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
  }

  const buttonHoverStyles = {
    cancel: {
      backgroundColor: '#e9ecef',
      borderColor: '#adb5bd'
    },
    submit: {
      backgroundColor: loading ? '#a5b4fc' : '#5a67d8',
      transform: loading ? 'none' : 'translateY(-1px)',
      boxShadow: loading ? 'none' : '0 4px 12px rgba(102, 126, 234, 0.3)'
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Ajouter un nouveau snippet</h1>
        <div 
          style={styles.backButton} 
          onClick={() => navigate('/')}
          onMouseEnter={(e) => e.target.style.color = '#5a67d8'}
          onMouseLeave={(e) => e.target.style.color = '#667eea'}
        >
          ← Retour à l'accueil
        </div>
      </div>

      {message.text && (
        <div style={{
          ...styles.message,
          ...(message.type === 'success' ? styles.messageSuccess : styles.messageError)
        }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Titre *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Ex: Fonction de validation email"
            style={styles.input}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef'
              e.target.style.boxShadow = 'none'
            }}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Brève explication de ce que fait le code..."
            style={styles.textarea}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Catégorie *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            style={styles.select}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef'
              e.target.style.boxShadow = 'none'
            }}
            required
          >
            <option value="">-- Choisir une catégorie --</option>
            <option value="PHP">PHP</option>
            <option value="HTML">HTML</option>
            <option value="CSS">CSS</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Code *</label>
          <div style={{
            ...styles.codeContainer,
            borderColor: document.activeElement?.name === 'code' ? '#667eea' : '#e9ecef'
          }}>
            <div style={styles.codeHeader}>
              <span style={styles.codeLanguageLabel}>
                {formData.category ? formData.category.toLowerCase() : 'code'}
              </span>
              <span style={styles.codeStats}>
                {lines} lignes • {chars} caractères
              </span>
            </div>
            <textarea
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Entrez votre code ${formData.category || ''} ici...

Astuce: Utilisez Tab pour indenter`}
              style={styles.codeEditor}
              required
            />
          </div>
        </div>

        <div style={styles.buttonGroup}>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{ ...styles.button, ...styles.cancelButton }}
            onMouseEnter={(e) => Object.assign(e.target.style, buttonHoverStyles.cancel)}
            onMouseLeave={(e) => Object.assign(e.target.style, styles.cancelButton)}
            disabled={loading}
          >
            Annuler
          </button>

          <button
            type="submit"
            style={{ ...styles.button, ...styles.submitButton }}
            onMouseEnter={(e) => {
              if (!loading) Object.assign(e.target.style, buttonHoverStyles.submit)
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#667eea'
                e.target.style.transform = 'none'
                e.target.style.boxShadow = 'none'
              }
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                
                Enregistrement...
              </>
            ) : (
              <>
               
                Sauvegarder
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddSnippetPage
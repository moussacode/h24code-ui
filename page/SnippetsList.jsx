import { Link } from 'react-router-dom';

export default function SnippetsList() {
  return (
    <div>
      <h1>Mes Snippets</h1>
      <Link to="/add-snippet">
        <button>Ajouter un snippet</button>
      </Link>
      {/* Liste des snippets */}
    </div>
  );
}
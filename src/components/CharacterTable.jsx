import { useState, useEffect } from 'react';
import axios from 'axios';

function CharacterTable() {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    name: '',
    status: '',
    species: '',
    gender: ''
  });
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Filter options
  const statusOptions = ['', 'Alive', 'Dead', 'Unknown'];
  const speciesOptions = ['', 'Human', 'Alien', 'Humanoid', 'Robot', 'Unknown'];
  const genderOptions = ['', 'Male', 'Female', 'Genderless', 'Unknown'];

  useEffect(() => {
    fetchCharacters();
  }, [currentPage, filters]);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        ...(filters.name && { name: filters.name }),
        ...(filters.status && { status: filters.status.toLowerCase() }),
        ...(filters.species && { species: filters.species }),
        ...(filters.gender && { gender: filters.gender.toLowerCase() })
      }).toString();

      const response = await axios.get(
        `https://rickandmortyapi.com/api/character/?${queryParams}`
      );
      setCharacters(response.data.results);
      setTotalPages(response.data.info.pages);
    } catch (error) {
      console.error('Error fetching characters:', error);
      setCharacters([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setCurrentPage(1);
  };

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
  };

  return (
    <div className="container">
      <div className="filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Filter by name..."
            value={filters.name}
            onChange={(e) => handleFilterChange('name', e.target.value)}
            className="filter-input"
          />
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="filter-select"
          >
            <option value="">Status: All</option>
            {statusOptions.slice(1).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={filters.species}
            onChange={(e) => handleFilterChange('species', e.target.value)}
            className="filter-select"
          >
            <option value="">Species: All</option>
            {speciesOptions.slice(1).map(species => (
              <option key={species} value={species}>{species}</option>
            ))}
          </select>

          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className="filter-select"
          >
            <option value="">Gender: All</option>
            {genderOptions.slice(1).map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <table className="character-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Status</th>
                <th>Species</th>
                <th>Gender</th>
              </tr>
            </thead>
            <tbody>
              {characters.map((character) => (
                <tr
                  key={character.id}
                  onClick={() => handleCharacterClick(character)}
                  className="character-row"
                >
                  <td>
                    <img
                      src={character.image}
                      alt={character.name}
                      width="50"
                      height="50"
                    />
                  </td>
                  <td>{character.name}</td>
                  <td>{character.status}</td>
                  <td>{character.species}</td>
                  <td>{character.gender}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          {selectedCharacter && (
            <div className="character-detail">
              <h2>{selectedCharacter.name}</h2>
              <img
                src={selectedCharacter.image}
                alt={selectedCharacter.name}
                width="200"
              />
              <p>Status: {selectedCharacter.status}</p>
              <p>Species: {selectedCharacter.species}</p>
              <p>Gender: {selectedCharacter.gender}</p>
              <p>Origin: {selectedCharacter.origin.name}</p>
              <p>Location: {selectedCharacter.location.name}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CharacterTable; 
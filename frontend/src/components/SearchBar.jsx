import React, { useCallback, useState } from 'react';
import { Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/useUserStore';
import { debounce } from 'lodash';

const SearchBar = () => {
  const { searchUser, searchedUsers, clearUsers } = useUserStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const debouncedSearch = useCallback(
    debounce(async (value) => {
      if (value.length === 0) {
        clearUsers();
        return;
      }
      await searchUser(value);
    }, 500),
    []
  );

  const handleSearch = (e) => {
    const value = e.target.value.trim();
    setQuery(value);
    debouncedSearch(value);
  }

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setQuery('');
    clearUsers();
  };

  return (
    <div className="relative w-auto">
      {/* Search Input */}
      <div className="flex items-center border border-base-300 rounded-lg px-3 py-2 bg-base-100 shadow-md focus-within:ring-2 focus-within:ring-primary transition-all">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search users..."
          className="ml-2 w-full outline-none bg-transparent placeholder:text-gray-400"
        />
      </div>

      {/* Search Results Dropdown */}
      {Array.isArray(searchedUsers) && searchedUsers.length > 0 && (
        <ul className="absolute left-0 mt-2 w-full text-black bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto divide-y divide-gray-200 z-50">
          {searchedUsers.map((user) => (
            <li
              key={user._id}
              className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-2 transition-all"
              onClick={() => handleUserClick(user._id)}
            >
              <User className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-gray-700">{user.userName}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;

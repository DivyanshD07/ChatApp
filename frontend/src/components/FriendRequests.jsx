import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useFriendStore } from "../store/useFriendStore.js";
import { FaUserFriends } from "react-icons/fa";

const FriendRequests = () => {
  const { friendRequests, fetchFriendRequests, respondToRequest } = useFriendStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchFriendRequests();
  }, [fetchFriendRequests]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Friend Requests Icon */}
      <button onClick={() => setDropdownOpen(!dropdownOpen)} className="relative">
        <FaUserFriends className="text-2xl text-gray-700 hover:text-blue-600 transition" />
        {friendRequests.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-xs text-white w-3 h-3 rounded-full"></span>
        )}
      </button>

      {/* Dropdown for Friend Requests */}
      {dropdownOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-white text-black shadow-lg rounded-lg border">
          <h3 className="text-lg font-bold p-2 border-b">Friend Requests</h3>
          {friendRequests.length === 0 ? (
            <p className="p-2 text-gray-600">No friend requests</p>
          ) : (
            friendRequests.map((request) => (
              <div key={request._id} className="p-2 flex items-center justify-between">
                <Link to={`/profile/${request.from}`} className="flex items-center">
                  <img src={request.from.profilePic} alt={request.from.userName} className="w-10 h-10 rounded-full mr-2" />
                  <div className="flex flex-col">
                    <span className="font-medium">{request.from.userName}</span>
                    <span className="font-thin text-xs">{request.from.fullName}</span>
                  </div>
                </Link>
                <div>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2 hover:bg-green-600"
                    onClick={() => respondToRequest(req.from, "accept")}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    onClick={() => respondToRequest(req.from, "reject")}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FriendRequests;

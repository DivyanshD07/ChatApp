import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useFriendStore } from "../store/useFriendStore.js";
import { FaUserFriends } from "react-icons/fa";

const FriendRequests = () => {
  const { friendRequests, fetchFriendRequests, respondToRequest } = useFriendStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchFriendRequests();
  }, [fetchFriendRequests]);

  return (
    <div className="relative">
      {/* Friend Requests Icon */}
      <button onClick={() => setDropdownOpen(!dropdownOpen)} className="relative">
        <FaUserFriends className="text-2xl text-gray-700 hover:text-blue-600 transition" />
        {friendRequests.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-xs text-white w-3 h-3 rounded-full"></span>
        )}
      </button>

      {/* Dropdown for Friend Requests */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded-lg border">
          <h3 className="text-lg font-bold p-2 border-b">Friend Requests</h3>
          {friendRequests.length === 0 ? (
            <p className="p-2 text-gray-600">No friend requests</p>
          ) : (
            friendRequests.map((req) => (
              <div key={req.from} className="p-2 flex items-center justify-between">
                <Link to={`/profile/${req.from}`} className="flex items-center">
                  <img src={req.profilePic} alt={req.userName} className="w-10 h-10 rounded-full mr-2" />
                  <span className="font-medium">{req.userName}</span>
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

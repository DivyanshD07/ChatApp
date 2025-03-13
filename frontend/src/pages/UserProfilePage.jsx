import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { useFriendStore } from "../store/useFriendStore";

const UserProfilePage = () => {
  const { userId } = useParams();
  const { userProfile, getUserProfile, isLoadingUserProfile } = useUserStore();
  const { sendFriendRequest } = useFriendStore();

  console.log("User ID from params:", userId);

  useEffect(() => {
    getUserProfile(userId);
  }, [userId]);

  if (isLoadingUserProfile) {
    return <p className="text-center text-gray-500 mt-4">Loading user profile...</p>;
  }

  if (!userProfile) {
    return <p className="text-center text-gray-500 mt-4">User not found.</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-500">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-xl font-bold">
            {userProfile.profilePic ? (<img src={userProfile.profilePic} alt="profilePic" className="rounded-full size-16" />) : userProfile.userName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">{userProfile.userName}</h2>
            <p className="text-gray-600 text-sm">Email: {userProfile.email}</p>
          </div>
        </div>

        <button
          onClick={() => sendFriendRequest(userId)}
          className="mt-4 w-full bg-primary text-white font-medium py-2 rounded-lg shadow-md hover:bg-primary/90 transition-all"
        >
          Send Friend Request
        </button>
      </div>
    </div>
  );
};

export default UserProfilePage;

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaBell } from "react-icons/fa";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([{ id: 1, message: "New Products Added!" }]); 
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      dispatch(logout());
      navigate("/");
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-menu")) setIsDropdownOpen(false);
      if (!event.target.closest(".notification-menu")) setShowNotifications(false);
    };

    if (isDropdownOpen || showNotifications) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen, showNotifications]);

  return (
    <div className="w-full bg-gray-200 text-fuchsia-800 flex justify-between items-center p-4 shadow-md">
      
    
      <div className="flex items-center w-1/3">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-400 rounded-md focus:ring focus:ring-fuchsia-400"
        />
      </div>

      <div className="flex items-center gap-4">
        
      
        <div className="relative notification-menu">
          <button onClick={toggleNotifications} className="relative">
            <FaBell className="text-2xl cursor-pointer hover:text-fuchsia-600 transition duration-300" />
            {notifications.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

       
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
              <h3 className="text-sm font-semibold px-3 pb-2 border-b">Notifications</h3>
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div key={notif.id} className="p-2 text-gray-700 text-sm border-b last:border-none">
                    {notif.message}
                  </div>
                ))
              ) : (
                <p className="p-3 text-gray-500 text-sm">No new notifications</p>
              )}
            </div>
          )}
        </div>

      
        <div className="relative dropdown-menu">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 focus:outline-none transition duration-300 cursor-pointer border border-b-fuchsia-800 rounded px-2 py-1"
          >
            <FaUserCircle className="text-2xl" />
            <span className="font-medium">{user?.name || "User"}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-800 ml-12">{user?.name}</p>
                <p className="text-xs text-gray-600 ml-12">{user?.email}</p>
              </div>
              <div className="py-2">
                <button
                  onClick={handleLogout}
                  className="border border-red-600 text-left px-4 py-1 ml-16 font-medium text-red-600 hover:bg-gray-200 rounded cursor-pointer transition duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Navbar;

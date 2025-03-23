import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const UserManagment = () => {   
    const navigate = useNavigate()
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const email = user.email

    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // (`${import.meta.env.VITE_API_URL}/register`, userInfo)
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
                setUsers(response.data);
            } catch (error) {
                toast.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    // Handle actions (block, unblock, delete)

    const handleAction = async (action) => {
        try {
          const res =  await axios.post(`${import.meta.env.VITE_API_URL}/users/action`, { action, userIds: selectedUsers, email });
          console.log(res);
            window.location.reload(); // Refresh the page to reflect changes
        } catch (error) {
            // toast.error('Error performing action:', error);
            if (error.response) {
                // Handle 401 Unauthorized (e.g., redirect to login)
                if (error.response.status === 401) {
                    toast.error('Unauthorized. Please log in again.');
                    navigate('/'); // Redirect to the login page
                } 
                // Handle blocked users (assuming the server responds with a 403 status)
                else if (error.response.status === 400 && error.response.data.message === 'User is blocked') {
                    toast.error('Your account has been blocked.');
                    navigate('/'); // Redirect to the login page
                } 
                // Handle other errors
                else {
                    toast.error(error.response.data?.message || 'An error occurred');
                }
            } else {
                // Handle network errors or other issues
                toast.error('Network error. Please try again.');
            }
        }
    };

    const handleLogout =()=>{
        localStorage.removeItem("user")
        navigate('/')
    }
    


    return (
        <div className="p-4">
            {/* logout button */}
            <button onClick={()=>handleLogout()} class=" flex justify-self-end bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                Logout
                </button>
            {/* Toolbar */}
            <div className="flex space-x-2 mb-4">
                <button
                    onClick={() => handleAction('block')}
                    className="flex gap-2 items-center justify-center border-1 border-blue-500 rounded-md py-2 px-2 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                 <span><FaLock size={20} /></span>   Block 
                </button>
                <button
                    onClick={() => handleAction('unblock')}
                    className="border-1 border-blue-500 rounded-md py-2 px-4 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                   <FaLockOpen size={20} />
                </button>
                <button
                    onClick={() => handleAction('delete')}
                    className="border-1 border-red-700 rounded-md py-2 px-4 text-red-700 hover:bg-red-700 hover:text-white"
                >
                   <RiDeleteBin6Line  size={20}/>
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border text-left">
                                <input
                                    type="checkbox"
                                    onChange={(e) =>
                                        setSelectedUsers(e.target.checked ? users.map((u) => u.id) : [])
                                    }
                                />
                            </th>
                            <th className="px-4 py-2 border text-left">Name</th>
                            <th className="px-4 py-2 border text-left">Email</th>
                            <th className="px-4 py-2 border text-left">Last Login</th>
                            <th className="px-4 py-2 border text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2 border">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={(e) =>
                                            setSelectedUsers(
                                                e.target.checked
                                                    ? [...selectedUsers, user.id]
                                                    : selectedUsers.filter((id) => id !== user.id)
                                            )
                                        }
                                    />
                                </td>
                                <td className="px-4 py-2 border">{user.name}</td>
                                <td className="px-4 py-2 border">{user.email}</td>
                                <td className="px-4 py-2 border">
                                    {new Date(user.last_login_time).toLocaleString()}
                                </td>
                                <td className={`px-4 py-2 border border-black ${user.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>{user.status.toUpperCase()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagment;
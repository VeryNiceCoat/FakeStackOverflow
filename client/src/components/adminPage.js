import React, { useState, useEffect } from 'react'
import Axios from 'axios'

const AdminPage = props => {
    const [users, setUsers] = useState([])
    useEffect(() => {
        // Fetch the user data when the component mounts
        const fetchUsers = async () => {
            try {
                const response = await Axios.get('http://localhost:8000/users/getAllUsers', { withCredentials: true });
                setUsers(response.data); // Set the user data in state
            } catch (error) {
                console.error('Error fetching users:', error);
                // Handle errors here (e.g., show a message to the user)
            }
        };

        fetchUsers();
    }, []);

    const handleUserClick = (userId) => {

    }
    return (
        <div className='pfp-sidebar'>
            <h2>ALL USERS</h2>
            {users.map(user => (
                    <li key={user._id}>
                        <button onClick={() => handleUserClick(user._id)}>
                            {user.name} - {user.email}
                        </button>
                    </li>
                ))}
        </div>
        
    )
}

export default AdminPage
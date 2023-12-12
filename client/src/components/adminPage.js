import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import UserPagesForAdmin from './userPagesForAdmin'

const AdminPage = props => {
    const [users, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const [showAdminUserPages, setShowAdminUserPages] = useState(false)
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

        // console.log(userId);
        setSelectedUser(userId)
        console.log('new selectedUser')
        console.log(selectedUser)
        setShowAdminUserPages(true)

    }
    return (
        <div id='admin-profile-list'>
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
            <div>
                {selectedUser && <UserPagesForAdmin uid={selectedUser}/>}
            </div>
        </div>
        
    )
}

export default AdminPage
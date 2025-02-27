// Component Imports
import UserList from '@views/apps/user/list'

// Fungsi untuk mengambil data user dari API
const getUserData = async () => {
  const res = await fetch("http://localhost:3000/api/apps/user-list")
  
  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }

  return res.json()
}

const UserListApp = async () => {
  // Mengambil data dari API
  const data = await getUserData()

  /*const mappedData = data.users.map(user => ({
    id: user.id,
    fullName: user.name, // mapping API "name" to "fullName"
    username: user.email, // for example, using email as username
    avatar: user.image,
    role: user.roles?.[0] || 'USER', // default role if none exists
    currentPlan: 'Basic', // set a default plan or map from your API if available
    billing: '$0', // set billing info as needed
    status: user.emailVerified ? 'active' : 'pending'
  }))*/

  return <UserList userData={data.users} />
}

export default UserListApp

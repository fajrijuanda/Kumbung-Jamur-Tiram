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

  return <UserList userData={data.users} />
}

export default UserListApp

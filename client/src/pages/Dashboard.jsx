import { Navigate } from "react-router-dom"

export default function Dashboard() {

    const islogged = true
    const token = localStorage.getItem('token')

    if (!token) {
        return <Navigate to={'connexion'} />
    }

    return (
        <div>Dashboard</div>
    )
}
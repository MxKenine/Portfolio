import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

    export default function Editprofil() {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `${BACK_URL}/admin`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, avatar, phone, where, email }),
        },
      );

      console.log("STATUS:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.log("ERROR BODY:", errorText);
        throw new Error("Couldn't add project");
      }
      const data = await response.json();
      console.log(data);
      navigate("/projects");
    } catch (err) {
      console.log(err);
    }
  }


    async function getAdminData() {
        try {
            const response = await fetch('${BACK_URL}/admin', {
                method: 'GET',
                credentials: "include"
            })
            if (!response.ok) {
                throw new Error('Accès refusé')
            }
            const data = await response.json()
            console.log(data) 
            setUsers(data.users)

        } catch (err) {
            console.log(err)
            navigate('/login')
        }
    }
    async function getUser() {
        try {
            const response = await fetch ('${BACK_URL}/admin/edit-profil', {
                method: 'PATCH',
                credentials: "include"
            })
            if (!response.ok) {
                throw new Error('Accès refusé')
            }
            const data = await response.json()
            setUsers(data.users)

        } catch (err) {
            console.log(err)
            navigate('/login')
        }
    }

    useEffect(() => {
        getAdminData()
        getUser()
    }, [])
    
  return (
    <>
    <div>Editprofil</div>
     <main>
      <form onSubmit={handleSubmit}>
        <h1>Modifier le profil</h1>
        <input
          type="text"
          placeholder="Prénom"
          value={users.firstName}
          onChange={(e) => setUsers(users.firstName, e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nom"
          onChange={(e) => setUsers.lastName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Téléphone"
          onChange={(e) => setUsers.phone(e.target.value)}
        />
        <button type="submit">Enregistrer</button>
      </form>
    </main>
    </>
  )
}
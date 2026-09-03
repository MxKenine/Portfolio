import React, { useEffect, useState } from 'react'

export default function Hotpot() {
    const [users, setUsers] = useState([])
    const [cvs, setCvs] = useState([])
    const [revealed, setRevealed] = useState({})
    const [loadingId, setLoadingId] = useState(null)

    async function getData() {
        try {
            const [usersRes, cvsRes] = await Promise.all([
                fetch(`http://localhost:3000/members`),
                fetch(`http://localhost:3000/cvs`),
            ])
            if (!usersRes.ok || !cvsRes.ok) throw new Error('Erreur de chargement')

            const usersData = await usersRes.json()
            const cvsData = await cvsRes.json()

            setUsers(usersData.users)
            setCvs(cvsData.cvs)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    async function revealContact(userId) {
        setLoadingId(userId)
        try {
            const response = await fetch(`http://localhost:3000/members/${userId}/contact`)
            if (!response.ok) throw new Error('Impossible de récupérer les coordonnées')
            const data = await response.json()
            setRevealed({ ...revealed, [userId]: data })
        } catch (err) {
            console.log(err)
        } finally {
            setLoadingId(null)
        }
    }

    function getCvForUser(userId) {
        return cvs.find(cv => cv.user === userId)
    }

    return (
        <>
            <div>Hotpot</div>
            {users.map(user => {
                const cv = getCvForUser(user._id)

                return (
                    <div key={user._id} style={{ border: '1px solid #ddd', padding: '10px', margin: '8px 0' }}>
                        <p>Prénom : {user.firstname || "Non renseigné"}</p>
                        <p>Nom : {user.lastname || "Non renseigné"}</p>
                        <p>Lieux : {user.where || "Non renseigné"}</p>
                        <p>Avatar : {user.avatar || "Non renseigné"}</p>

                        {revealed[user._id] ? (
                            <>
                                <p>Email : {revealed[user._id].email}</p>
                                <p>Téléphone : {revealed[user._id].phone || "Non renseigné"}</p>
                            </>
                        ) : (
                            <button onClick={() => revealContact(user._id)} disabled={loadingId === user._id}>
                                {loadingId === user._id ? "Chargement..." : "Afficher les coordonnées"}
                            </button>
                        )}

                        {cv && (
                            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                                <h4>{cv.title}</h4>

                                {cv.links?.length > 0 && (
                                    <p>
                                        Liens :{' '}
                                        {cv.links.map((link, i) => (
                                            <a key={i} href={link} target="_blank" rel="noreferrer" style={{ marginRight: '8px' }}>
                                                {link}
                                            </a>
                                        ))}
                                    </p>
                                )}

                                {cv.experiences?.length > 0 && (
                                    <>
                                        <p><strong>Expériences</strong></p>
                                        {cv.experiences.map((exp, i) => (
                                            <div key={i} style={{ marginBottom: '6px' }}>
                                                <p>{exp.title} — {exp.company} ({exp.startDate} - {exp.endDate})</p>
                                                <p>{exp.description}</p>
                                                {exp.tags?.length > 0 && <p>{exp.tags.join(', ')}</p>}
                                            </div>
                                        ))}
                                    </>
                                )}

                                {cv.skills?.length > 0 && (
                                    <>
                                        <p><strong>Compétences</strong></p>
                                        {cv.skills.map((skill, i) => (
                                            <p key={i}>{skill.name} — {skill.level}%</p>
                                        ))}
                                    </>
                                )}

                                {cv.languages?.length > 0 && (
                                    <>
                                        <p><strong>Langues</strong></p>
                                        {cv.languages.map((lang, i) => (
                                            <p key={i}>{lang.name} {lang.label && `(${lang.label})`} — {lang.level}/3</p>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
        </>
    )
}
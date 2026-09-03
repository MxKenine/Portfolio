import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const emptyExperience = { title: '', company: '', startDate: '', endDate: '', description: '', tags: [] }
const emptySkill = { name: '', level: 50 }
const emptyLanguage = { name: '', level: 1, label: '' }

export default function EditCv({ cv, userId, onCancel, onUpdated }) {
    const [formData, setFormData] = useState({
        links: cv?.links?.length ? cv.links : [''],
        experiences: cv?.experiences?.length ? cv.experiences : [],
        skills: cv?.skills?.length ? cv.skills : [],
        languages: cv?.languages?.length ? cv.languages : [],
    })
    const [error, setError] = useState(null)
    const [saving, setSaving] = useState(false)
    const navigate = useNavigate()

    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // --- Liens ---
    function updateLink(index, value) {
        const links = [...formData.links]
        links[index] = value
        setFormData({ ...formData, links })
    }
    function addLink() {
        setFormData({ ...formData, links: [...formData.links, ''] })
    }
    function removeLink(index) {
        setFormData({ ...formData, links: formData.links.filter((_, i) => i !== index) })
    }

    // --- Expériences ---
    function updateExperience(index, field, value) {
        const experiences = [...formData.experiences]
        experiences[index] = { ...experiences[index], [field]: value }
        setFormData({ ...formData, experiences })
    }
    function updateExperienceTags(index, value) {
        const tags = value.split(',').map(t => t.trim()).filter(Boolean)
        updateExperience(index, 'tags', tags)
    }
    function addExperience() {
        setFormData({ ...formData, experiences: [...formData.experiences, { ...emptyExperience }] })
    }
    function removeExperience(index) {
        setFormData({ ...formData, experiences: formData.experiences.filter((_, i) => i !== index) })
    }

    // --- Compétences ---
    function updateSkill(index, field, value) {
        const skills = [...formData.skills]
        skills[index] = { ...skills[index], [field]: field === 'level' ? Number(value) : value }
        setFormData({ ...formData, skills })
    }
    function addSkill() {
        setFormData({ ...formData, skills: [...formData.skills, { ...emptySkill }] })
    }
    function removeSkill(index) {
        setFormData({ ...formData, skills: formData.skills.filter((_, i) => i !== index) })
    }

    // --- Langues ---
    function updateLanguage(index, field, value) {
        const languages = [...formData.languages]
        languages[index] = { ...languages[index], [field]: field === 'level' ? Number(value) : value }
        setFormData({ ...formData, languages })
    }
    function addLanguage() {
        setFormData({ ...formData, languages: [...formData.languages, { ...emptyLanguage }] })
    }
    function removeLanguage(index) {
        setFormData({ ...formData, languages: formData.languages.filter((_, i) => i !== index) })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setSaving(true)
        try {
            const payload = {
                ...formData,
                links: formData.links.filter(l => l.trim() !== ''),
            }
            const response = await fetch(`http://localhost:3000/cv/${userId}`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    navigate('/login')
                    return
                }
                throw new Error('Échec de la mise à jour du CV')
            }
            const data = await response.json()
            onUpdated(data.cv)
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '15px', display: 'flex', flexDirection: 'column', gap: '15px' }}>

            {/* Liens */}
            <fieldset>
                <legend>Liens</legend>
                {formData.links.map((link, i) => (
                    <div key={i} style={{ display: 'flex', gap: '5px' }}>
                        <input value={link} onChange={e => updateLink(i, e.target.value)} placeholder="https://..." />
                        <button type="button" onClick={() => removeLink(i)}>Retirer</button>
                    </div>
                ))}
                <button type="button" onClick={addLink}>+ Ajouter un lien</button>
            </fieldset>

            {/* Expériences */}
            <fieldset>
                <legend>Expériences</legend>
                {formData.experiences.map((exp, i) => (
                    <div key={i} style={{ border: '1px dashed #aaa', padding: '10px', marginBottom: '10px' }}>
                        <input placeholder="Intitulé du poste" value={exp.title}
                            onChange={e => updateExperience(i, 'title', e.target.value)} />
                        <input placeholder="Entreprise" value={exp.company}
                            onChange={e => updateExperience(i, 'company', e.target.value)} />
                        <input placeholder="Début (ex: 2024)" value={exp.startDate}
                            onChange={e => updateExperience(i, 'startDate', e.target.value)} />
                        <input placeholder="Fin (ex: Actuellement)" value={exp.endDate}
                            onChange={e => updateExperience(i, 'endDate', e.target.value)} />
                        <textarea placeholder="Description" value={exp.description}
                            onChange={e => updateExperience(i, 'description', e.target.value)} />
                        <input placeholder="Tags séparés par virgule (React, Node.js)"
                            value={exp.tags.join(', ')}
                            onChange={e => updateExperienceTags(i, e.target.value)} />
                        <button type="button" onClick={() => removeExperience(i)}>Supprimer cette expérience</button>
                    </div>
                ))}
                <button type="button" onClick={addExperience}>+ Ajouter une expérience</button>
            </fieldset>

            {/* Compétences */}
            <fieldset>
                <legend>Compétences</legend>
                {formData.skills.map((skill, i) => (
                    <div key={i} style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <input placeholder="Nom" value={skill.name}
                            onChange={e => updateSkill(i, 'name', e.target.value)} />
                        <input type="range" min="0" max="100" value={skill.level}
                            onChange={e => updateSkill(i, 'level', e.target.value)} />
                        <span>{skill.level}%</span>
                        <button type="button" onClick={() => removeSkill(i)}>Retirer</button>
                    </div>
                ))}
                <button type="button" onClick={addSkill}>+ Ajouter une compétence</button>
            </fieldset>

            {/* Langues */}
            <fieldset>
                <legend>Langues</legend>
                {formData.languages.map((lang, i) => (
                    <div key={i} style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <input placeholder="Nom" value={lang.name}
                            onChange={e => updateLanguage(i, 'name', e.target.value)} />
                        <input placeholder="ex: Langue maternelle, Niveau B2" value={lang.label}
                            onChange={e => updateLanguage(i, 'label', e.target.value)} />
                        <input type="range" min="0" max="3" value={lang.level}
                            onChange={e => updateLanguage(i, 'level', e.target.value)} />
                        <span>{lang.level}/3</span>
                        <button type="button" onClick={() => removeLanguage(i)}>Retirer</button>
                    </div>
                ))}
                <button type="button" onClick={addLanguage}>+ Ajouter une langue</button>
            </fieldset>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <button type="submit" disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</button>
                <button type="button" onClick={onCancel}>Annuler</button>
            </div>
        </form>
    )
}
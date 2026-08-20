import React from 'react'
import Infoperso from './components_cv/Infosperso'
import Profilepro from './components_cv/Profilepro'
import Langages from './components_cv/Langages'
import Comppro from './components_cv/Comppro'
import Xppro from './components_cv/Xppro'
import Formations from './components_cv/Formations'

export default function Voircv() {
  return (
    <>
    <div>Voircv</div>
    <Infoperso />
    <Profilepro />
    <Langages />
    <Comppro />
    <Xppro />
    <Formations />
    </>
  )
}

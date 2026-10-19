import { useState } from 'react'
import './css/main.css'
import Header from './component/Header.jsx'
import Footer from './component/Footer.jsx'
import Hero from './component/Hero.jsx'

function App() {

  return (
    <div className="wrapper">
      <Header />
      <Hero />
      <Footer />
    </div>
  )
}

export default App

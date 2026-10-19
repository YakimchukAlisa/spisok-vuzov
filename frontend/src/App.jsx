import { useState } from 'react'
import './css/main.css'
import Header from './component/Header.jsx'
import Footer from './component/Footer.jsx'
import Hero from './component/Hero.jsx'
import CardVuz from "./component/VuzCard.jsx";
import vuzData from './DATA/cardVuz.json'

function App() {

  return (
    <div className="wrapper">
      <Header />
      <Hero />
      <div className = "container">
        <div className="vuz-list">
        {vuzData.map((vuz) => (
          <CardVuz 
            key={vuz.id}       // Обязательно указываем key для React
            data={vuz}         // Передаем данные конкретного вуза
          />
        ))}
      </div>
      </div>
      <Footer />
    </div>
  )
}

export default App

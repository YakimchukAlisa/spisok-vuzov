import React, { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import professionsData from './DATA/professions.json';
import SphereCard from './component/SphereCard';
import PopularBlock from './component/PopularBlock';
import CareerTestBlock from './component/CareerTestBlock';
import { getSpheres, getSpheresWithCounts  } from './api/api.js';
import './css/catalogPage.css';

export default function CatalogPage() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [spheresData, setSpheresData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isSpecialties = location.pathname === '/specialties';
  const type = isSpecialties ? 'specialty' : 'profession';
  const title = isSpecialties ? 'Специальности' : 'Профессии';

  useEffect(() => {
     const fetchSpheres = async () => {
       try {
         const data = await getSpheresWithCounts();
         setSpheresData(data);
       } catch (err) {
         console.error('Ошибка:', err);
       } finally {
         setIsLoading(false);
       }
     };
     fetchSpheres();
   }, []);

   const spheresWithCounts = useMemo(() => {
     return spheresData.filter(sphere =>
       sphere.name.toLowerCase().includes(searchQuery.toLowerCase())
     );
   }, [searchQuery, spheresData]);

  const currentData = professionsData; // пока из JSON

  return (
    <div className="container" style={{ padding: '64px 20px' }}>
      <div className='title-and-catalog'>
        <h1 className="text-32b">{title}</h1>

        <div className="catalog-grid">
          {spheresWithCounts.length > 0 ? (
            spheresWithCounts.map((sphere) => (
              <SphereCard
                key={sphere.id}
                sphere={sphere}
                count={sphere.count}
                type={type}
              />
            ))
          ) : (
            <p className="text-20r">Ничего не найдено</p>
          )}
        </div>

        <PopularBlock
          items={currentData}
          title={isSpecialties ? 'Популярные специальности' : 'Популярные профессии'}
          type={type}
        />
        <CareerTestBlock />
      </div>
    </div>
  );
}
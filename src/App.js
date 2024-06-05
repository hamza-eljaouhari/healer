import React, { useState } from 'react';
import './App.css';
import symptomHerbMap from './db.js';  // Make sure to export symptomHerbMap from db.js

const symptomOptions = Object.keys(symptomHerbMap).map(key => ({
  value: key,
  label: symptomHerbMap[key].name,
}));

function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [suggestedIngredients, setSuggestedIngredients] = useState({
    herbs: [],
    vitamins: [],
    minerals: [],
    amino_acids: []
  });
  const [selectedHerbs, setSelectedHerbs] = useState([]);
  const [symptomIntensity, setSymptomIntensity] = useState(1);
  const [useSymptomInput, setUseSymptomInput] = useState(true);
  const [meals, setMeals] = useState([]);
  const [products, setProducts] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState("");
  const [activeTab, setActiveTab] = useState('herbs');
  const [language, setLanguage] = useState('en');

  const handleSymptomsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSymptoms(selected);
  };

  const handleIntensityChange = (e) => {
    setSymptomIntensity(e.target.value);
  };

  const handleImageUpload = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleOptionChange = () => {
    setUseSymptomInput(!useSymptomInput);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const herbs = [];
    const vitamins = [];
    const minerals = [];
    const amino_acids = [];
    if (useSymptomInput) {
      symptoms.forEach(symptom => {
        if (symptomHerbMap[symptom]) {
          herbs.push(...symptomHerbMap[symptom].herbs);
          vitamins.push(...symptomHerbMap[symptom].vitamins);
          minerals.push(...symptomHerbMap[symptom].minerals);
          amino_acids.push(...symptomHerbMap[symptom].amino_acids);
        }
      });
    }
    setSuggestedIngredients({ herbs, vitamins, minerals, amino_acids });
    setLoading(false);
  };

  const handleHerbSelection = (herb) => {
    setSelectedHerbs(prevSelected => 
      prevSelected.includes(herb) ? prevSelected.filter(h => h !== herb) : [...prevSelected, herb]
    );
  };

  const handleSearchProducts = async () => {
    const mockProducts = selectedHerbs.map((herb, index) => ({
      id: index,
      name: `Best ${herb} product`,
      link: `https://www.amazon.com/s?k=${herb}&tag=your-affiliate-tag`,
      image: `https://via.placeholder.com/150?text=${herb}`,
    }));

    setProducts(mockProducts.slice(0, 5));
  };

  const handleSearchMeals = async () => {
    const mockMeals = selectedHerbs.map((herb, index) => ({
      id: index,
      name: `Meal rich in ${herb}`,
      description: `Description of meal rich in ${herb}`
    }));

    setMeals(mockMeals);
  };

  const getSuggestedDuration = () => {
    switch (symptomIntensity) {
      case '1':
        return '1 week';
      case '2':
        return '1-2 weeks';
      case '3':
        return '2-4 weeks';
      case '4':
        return '4-6 weeks';
      case '5':
        return '1-3 months';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Herbal Remedy Suggester</h1>
      <div className="mb-4">
        <label htmlFor="language" className="block font-medium mb-2">Select Language:</label>
        <select
          id="language"
          value={language}
          onChange={handleLanguageChange}
          className="w-full border border-gray-300 rounded-md py-2 px-3"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
        </select>
      </div>
      <button 
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded" 
        onClick={handleOptionChange}
      >
        {useSymptomInput ? (language === 'en' ? 'Switch to Image Upload' : 'Passer à l\'analyse d\'image') : (language === 'en' ? 'Switch to Symptom Input' : 'Passer à la saisie des symptômes')}
      </button>
      <form onSubmit={handleSubmit}>
        {useSymptomInput ? (
          <>
            <div className="mb-4">
              <label htmlFor="symptoms" className="block font-medium mb-2">
                {language === 'en' ? 'Select your symptoms:' : 'Sélectionnez vos symptômes :'}
              </label>
              <select
                id="symptoms"
                multiple
                value={symptoms}
                onChange={handleSymptomsChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              >
                {symptomOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label[language]}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="intensity" className="block font-medium mb-2">
                {language === 'en' ? 'Symptom Intensity:' : 'Intensité des symptômes :'}
              </label>
              <input
                type="range"
                id="intensity"
                min="1"
                max="5"
                value={symptomIntensity}
                onChange={handleIntensityChange}
                className="w-full h-full custom-range"
              />
              <div className="flex justify-between text-sm mt-1">
                <span>{language === 'en' ? 'Light' : 'Léger'}</span>
                <span>{language === 'en' ? 'Remarkable' : 'Remarquable'}</span>
                <span>{language === 'en' ? 'Moderate' : 'Modéré'}</span>
                <span>{language === 'en' ? 'Strong' : 'Fort'}</span>
                <span>{language === 'en' ? 'Intense' : 'Intense'}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="imageUpload" className="block font-medium mb-2">
                {language === 'en' ? 'Upload your nutritional analysis image:' : 'Téléchargez votre image d\'analyse nutritionnelle :'}
              </label>
              <input 
                type="file" 
                id="imageUpload" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="w-full border border-gray-300 rounded-md py-2 px-3"
              />
            </div>
          </>
        )}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
        >
          {language === 'en' ? 'Get Suggestions' : 'Obtenir des suggestions'}
        </button>
      </form>
      {loading && <p>{language === 'en' ? 'Loading...' : 'Chargement...'}</p>}
      {suggestedIngredients.herbs.length > 0 || suggestedIngredients.vitamins.length > 0 || suggestedIngredients.minerals.length > 0 || suggestedIngredients.amino_acids.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">{language === 'en' ? 'Suggested Ingredients:' : 'Ingrédients suggérés :'}</h2>
          <div className="mb-4 overflow-x-auto">
            <ul className="flex border-b border-gray-200">
              <li className={`mr-1 ${activeTab === 'herbs' ? 'border-blue-500' : ''}`}>
                <button
                  className={`bg-white h-16 w-24 text-blue-500 hover:text-blue-800 font-semibold ${activeTab === 'herbs' ? 'border-l border-t border-r border-gray-500 rounded-t' : 'border-b border-gray-200'}`}
                  onClick={() => setActiveTab('herbs')}
                >
                  {language === 'en' ? 'Herbs' : 'Herbes'}
                </button>
              </li>
              <li className={`mr-1 ${activeTab === 'vitamins' ? 'border-blue-500' : ''}`}>
                <button
                  className={`bg-white h-16 w-24 text-blue-500 hover:text-blue-800 font-semibold ${activeTab === 'vitamins' ? 'border-l border-t border-r border-gray-500 rounded-t' : 'border-b border-gray-200'}`}
                  onClick={() => setActiveTab('vitamins')}
                >
                  {language === 'en' ? 'Vitamins' : 'Vitamines'}
                </button>
              </li>
              <li className={`mr-1 ${activeTab === 'minerals' ? 'border-blue-500' : ''}`}>
                <button
                  className={`bg-white h-16 w-24 text-blue-500 hover:text-blue-800 font-semibold ${activeTab === 'minerals' ? 'border-l border-t border-r border-gray-500 rounded-t' : 'border-b border-gray-200'}`}
                  onClick={() => setActiveTab('minerals')}
                >
                  {language === 'en' ? 'Minerals' : 'Minéraux'}
                </button>
              </li>
              <li className={`${activeTab === 'amino_acids' ? 'border-blue-500' : ''}`}>
                <button
                  className={`bg-white h-16 w-24 text-blue-500 hover:text-blue-800 font-semibold ${activeTab === 'amino_acids' ? 'border-l border-t border-r border-gray-500 rounded-t' : 'border-b border-gray-200'}`}
                  onClick={() => setActiveTab('amino_acids')}
                >
                  {language === 'en' ? 'Amino Acids' : 'Acides Aminés'}
                </button>
              </li>
            </ul>
          </div>
          <div className="bg-white p-4 border border-t-0 rounded-b-lg">
            {activeTab === 'herbs' && (
              <div>
                <h2 className="text-xl font-bold mb-4">{language === 'en' ? 'Herbs' : 'Herbes'}</h2>
                <ul className="list-disc pl-4">
                  {suggestedIngredients.herbs.map((herb, index) => (
                    <li key={index}>
                      <label>
                        <input 
                          type="checkbox" 
                          value={herb.name[language]} 
                          onChange={() => handleHerbSelection(herb.name[language])} 
                        /> {herb.name[language]}
                      </label>
                      <ul className="list-disc pl-6">
                        {herb.aliments.map((aliment, idx) => (
                          <li key={idx}>
                            <strong>{aliment.name[language]}:</strong> {aliment.description[language]}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'vitamins' && (
              <div>
                <h2 className="text-xl font-bold mb-4">{language === 'en' ? 'Vitamins' : 'Vitamines'}</h2>
                <ul className="list-disc pl-4">
                  {suggestedIngredients.vitamins.map((vitamin, index) => (
                    <li key={index}>
                      <label>
                        <input 
                          type="checkbox" 
                          value={vitamin.name[language]} 
                          onChange={() => handleHerbSelection(vitamin.name[language])} 
                        /> {vitamin.name[language]}
                      </label>
                      <ul className="list-disc pl-6">
                        {vitamin.aliments.map((aliment, idx) => (
                          <li key={idx}>
                            <strong>{aliment.name[language]}:</strong> {aliment.description[language]}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'minerals' && (
              <div>
                <h2 className="text-xl font-bold mb-4">{language === 'en' ? 'Minerals' : 'Minéraux'}</h2>
                <ul className="list-disc pl-4">
                  {suggestedIngredients.minerals.map((mineral, index) => (
                    <li key={index}>
                      <label>
                        <input 
                          type="checkbox" 
                          value={mineral.name[language]} 
                          onChange={() => handleHerbSelection(mineral.name[language])} 
                        /> {mineral.name[language]}
                      </label>
                      <ul className="list-disc pl-6">
                        {mineral.aliments.map((aliment, idx) => (
                          <li key={idx}>
                            <strong>{aliment.name[language]}:</strong> {aliment.description[language]}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeTab === 'amino_acids' && (
              <div>
                <h2 className="text-xl font-bold mb-4">{language === 'en' ? 'Amino Acids' : 'Acides Aminés'}</h2>
                <ul className="list-disc pl-4">
                  {suggestedIngredients.amino_acids.map((amino, index) => (
                    <li key={index}>
                      <label>
                        <input 
                          type="checkbox" 
                          value={amino.name[language]} 
                          onChange={() => handleHerbSelection(amino.name[language])} 
                        /> {amino.name[language]}
                      </label>
                      <ul className="list-disc pl-6">
                        {amino.aliments.map((aliment, idx) => (
                          <li key={idx}>
                            <strong>{aliment.name[language]}:</strong> {aliment.description[language]}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <p className="mt-2">{language === 'en' ? 'Suggested duration:' : 'Durée suggérée:'} {getSuggestedDuration()}</p>
          <button
            onClick={handleSearchProducts}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded mt-4"
          >
            {language === 'en' ? 'Search Products' : 'Rechercher des produits'}
          </button>
          <button
            onClick={handleSearchMeals}
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded mt-4 ml-2"
          >
            {language === 'en' ? 'Search Meals' : 'Rechercher des repas'}
          </button>
        </div>
      ) : (
        <p className="mt-6 p-4">{language === 'en' ? 'No suggestions found for the selected symptoms.' : 'Aucune suggestion trouvée pour les symptômes sélectionnés.'}</p>
      )}
      {products.length > 0 && (
        <div className="mt-6 p-4">
          <h2 className="text-xl font-bold mb-2">{language === 'en' ? 'Top Products:' : 'Meilleurs produits:'}</h2>
          <ul className="list-disc pl-4">
            {products.map(product => (
              <li key={product.id}>
                <a href={product.link} target="_blank" rel="noopener noreferrer">
                  <img src={product.image} alt={product.name} className="w-16 h-16 inline-block mr-2" />
                  {product.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {meals.length > 0 && (
        <div className="mt-6 p-4">
          <h2 className="text-xl font-bold mb-2">{language === 'en' ? 'Top Meals:' : 'Meilleurs repas:'}</h2>
          <ul className="list-disc pl-4">
            {meals.map(meal => (
              <li key={meal.id}>
                <strong>{meal.name}:</strong> {meal.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

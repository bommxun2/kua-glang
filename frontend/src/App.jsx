import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage.jsx';
import RecipeDetail from './components/RecipeDetail/RecipeDetail.jsx';
import CreateRecipe from './components/CreateRecipe/CreateRecipe.jsx';
import EditIngredient from './components/EditIngredient/EditIngredient.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recipe/:id" element={<RecipeDetail />} />
      <Route path="/create-recipe" element={<CreateRecipe />} />
      <Route path="/edit-ingredient/:id" element={<EditIngredient />} />
      {/* เพิ่ม Route อื่นๆ ตามต้องการ */}
    </Routes>
  );
}

export default App;

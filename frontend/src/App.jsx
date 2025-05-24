import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage.jsx';
import RecipeDetail from './components/RecipeDetail/RecipeDetail.jsx';
import CreateRecipe from './components/CreateRecipe/CreateRecipe.jsx';
import EditIngredient from './components/EditIngredient/EditIngredient.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import EditProfilePage from './pages/ProfilePage/EditProfilePage.jsx';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home"; // ✅ import หน้าใหม่

import Competition from './competition.jsx';
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recipe/:id" element={<RecipeDetail />} />
      <Route path="/create-recipe" element={<CreateRecipe />} />
      <Route path="/edit-ingredient/:id" element={<EditIngredient />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/edit-profile" element={<EditProfilePage />} />
      <Route path="/competition" element={<Competition />} /> {/* ✅ หน้าระดับ/แงค์ */}
      {/* เพิ่ม Route อื่นๆ ตามต้องการ */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} /> {/* ✅ เพิ่ม path หลัง login */}
    </Routes>
  );
}

export default App;

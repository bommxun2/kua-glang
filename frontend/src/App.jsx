import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage.jsx';
import AddFolder from './components/AddFolder/AddFolder.jsx';
import RecipeDetail from './components/RecipeDetail/RecipeDetail.jsx';
import CreateRecipe from './components/CreateRecipe/CreateRecipe.jsx';
import EditIngredient from './components/EditIngredient/EditIngredient.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import EditProfilePage from './pages/ProfilePage/EditProfilePage.jsx';
import EditFieldPage from './pages/ProfilePage/EditFieldPage.jsx';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home"; //  import หน้าใหม่
import CommunityPage from './pages/CommunityPage/CommunityPage.jsx';
import CreatePostPage from './pages/CreatePostPage/CreatePostPage.jsx';
import EditPostPage from './pages/EditPostPage/EditPostPage.jsx';  
import FollowingPage from './pages/FollowingPage/FollowingPage.jsx'; 
import EditProfileImagePage from './pages/ProfilePage/EditProfileImage.jsx';
import Competition from './pages/Competition.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/add-folder/:id" element={<AddFolder />} />
      <Route path="/recipe/:id" element={<RecipeDetail />} />
      <Route path="/create-recipe" element={<CreateRecipe />} />
      <Route path="/edit-ingredient/:id" element={<EditIngredient />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/edit-profile" element={<EditProfilePage />} />
      <Route path="/edit/:field" element={<EditFieldPage />} />
      <Route path="/competition" element={<Competition />} /> {/* หน้าระดับ/แงค์ */}
      {/* เพิ่ม Route อื่นๆ ตามต้องการ */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} /> {/* เพิ่ม path หลัง login */}
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/community/create" element={<CreatePostPage />} />
      <Route path="/community/edit/:postId" element={<EditPostPage />} />
      <Route path="/community/following" element={<FollowingPage />} />
      <Route path="/edit/profile_url" element={<EditProfileImagePage />} />
    </Routes>
  );
}

export default App;

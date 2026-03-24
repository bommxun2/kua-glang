import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage.jsx';
import AddFolder from './components/AddFolder/AddFolder.jsx';
import RecipeDetail from './components/RecipeDetail/RecipeDetail.jsx';
import CreateRecipe from './components/CreateRecipe/CreateRecipe.jsx';
import CreateFood from './components/CreateRecipe/CreateFood.jsx';
import EditFolder from './components/EditFolder/EditFolder.jsx';
import EditFood from './components/EditFood/EditFood.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import EditProfilePage from './pages/ProfilePage/EditProfilePage.jsx';
import EditFieldPage from './pages/ProfilePage/EditFieldPage.jsx';
import Login from "./pages/Login";
import Register from "./pages/Register";
import CommunityPage from "./pages/CommunityPage/CommunityPage.jsx";
import CreatePostPage from "./pages/CreatePostPage/CreatePostPage.jsx";
import EditPostPage from "./pages/EditPostPage/EditPostPage.jsx";
import FollowingPage from "./pages/FollowingPage/FollowingPage.jsx";
import Competition from "./pages/Competition.jsx";
import HistoryScreen from "./components/History/History.jsx";
import AddShareItemScreen from "./components/AddShareItem/AddShareItem.jsx";
import ShareScreen from "./components/Share/Share.jsx";
import { useAuth } from "./contexts/AuthContext";

import { Navigate, useLocation } from "react-router-dom";
import EditProfileImagePage from './pages/ProfilePage/EditProfileImage.jsx';


function RequireAuth({ children }) {
  const { userId, isAuthReady } = useAuth();
  const location = useLocation();

  //console.log("userId:", userId, "isAuthReady:", isAuthReady);
  if (!isAuthReady) return null; 
  if (!userId) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}

function App() {
  const { userId, isAuthReady } = useAuth();
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={
        <RequireAuth>
          <HomePage />
        </RequireAuth>
      } />
      <Route path="/add-folder/:id" element={<RequireAuth><AddFolder /></RequireAuth>} />
      <Route path="/edit-folder/:folderId" element={<RequireAuth><EditFolder /></RequireAuth>} />
      <Route path="/recipe/:folderId" element={<RequireAuth><RecipeDetail /></RequireAuth>} />
      <Route path="/create-recipe" element={<RequireAuth><CreateRecipe /></RequireAuth>} />
      <Route path="/create-food/:folderId" element={<RequireAuth><CreateFood /></RequireAuth>} />
      <Route path="/edit-food/:folderId" element={<RequireAuth><EditFood /></RequireAuth>} />
      <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="/edit-profile" element={<RequireAuth><EditProfilePage /></RequireAuth>} />
      <Route path="/edit/:field" element={<RequireAuth><EditFieldPage /></RequireAuth>} />
      <Route path="/competition" element={<RequireAuth><Competition /></RequireAuth>} />
      <Route path="/community" element={<RequireAuth><CommunityPage /></RequireAuth>} />
      <Route path="/community/create" element={<RequireAuth><CreatePostPage /></RequireAuth>} />
      <Route path="/community/edit/:postId" element={<RequireAuth><EditPostPage /></RequireAuth>} />
      <Route path="/community/following" element={<RequireAuth><FollowingPage /></RequireAuth>} />
      <Route path="/history" element={<RequireAuth><HistoryScreen /></RequireAuth>} />
      <Route path="/add-share-item" element={<RequireAuth><AddShareItemScreen /></RequireAuth>} />
      <Route path="/share" element={<RequireAuth><ShareScreen /></RequireAuth>} />

      <Route path="/edit/profile_url" element={<RequireAuth><EditProfileImagePage /></RequireAuth>} />


         <Route
        path="/"
        element={
          isAuthReady ? (
            userId ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          ) : (
            <div>Loading...</div>
          )
        }
      />
    </Routes>
  );
}

export default App;

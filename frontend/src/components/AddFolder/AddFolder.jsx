import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './AddFolder.css';
import axios from 'axios';

const AddFolder = () => {
  const [folderName, setFolderName] = useState('');
  const [description, setDescription] = useState('');
  const [foodList, setFoodList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.previousData) {
      setFolderName(location.state.previousData.folderName);
      setDescription(location.state.previousData.description);
    }

    if (location.state?.foodItem && location.state?.foodList) {

      const combinedList = [...location.state.foodList, location.state.foodItem];


      const uniqueList = combinedList.filter(
        (item, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.foodName === item.foodName &&
              t.quantity === item.quantity &&
              t.unit === item.unit
          )
      );

      setFoodList(uniqueList);
    } else if (location.state?.foodList) {

      setFoodList(location.state.foodList);
    }
  }, [location.state]);


  console.log(foodList);

  const handleAddFolder = async () => {
    const userId = localStorage.getItem('userId') || "RPZ3";

    try {
      const updatedFoodList = await Promise.all(
        foodList.map(async (food) => {
          if (!food.img_url) {
            return [];
          }
          const img_inform = {
            fileName: food.img_url.fileName,
            contentType: food.img_url.contentType,
          }

          const { data } = await axios.post(
            `https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/image/upload-url`,
            img_inform
          );

          await fetch(data.uploadUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': food.img_url.contentType,
            },
            body: food.img_url.Blob,
          });

          return {
            ...food,
            img_url: data.fileUrl,
          };
        })
      );

      const payload = {
        folderName,
        description,
        quantity: updatedFoodList.length.toString().padStart(2, '0'),
        food: updatedFoodList,
        img_url: updatedFoodList[0]?.img_url || '',
        created_at: new Date().toISOString(),
      };

      const res = await axios.post(
        `https://8i2v8q86ld.execute-api.us-east-1.amazonaws.com/kua-api/folder/${userId}`,
        payload
      );
      console.log('บันทึกสำเร็จ', res.data);
      setFolderName('');
      setDescription('');
      setFoodList([]);
      navigate(-1);
    } catch (err) {
      console.error('เกิดข้อผิดพลาด', err);
      alert('บันทึกไม่สำเร็จ');
    }
  };


  return (
    <>
      <div className="header-folder">
        <div className="back-icon-folder" onClick={() => navigate(-1)} role="button" tabIndex={0}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </div>
        <h1>เพิ่มรายการอาหาร</h1>
      </div>

      <div className="add-folder-container">
        <label>
          ชื่อรายการ * :
          <input
            type="text"
            placeholder="ชื่อรายการ"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            className="folder-input"
          />
        </label>
        <label>
          คำอธิบาย * :
          <input
            type="text"
            placeholder="คำอธิบาย"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="folder-input"
          />
        </label>

        <div>
          <label className="add-item-label">เพิ่มอาหารหรือวัตถุดิบ :</label>
          <button
            className="add-folder-button"
            onClick={() =>
              navigate('/create-recipe', {
                state: {
                  from: 'add-folder',
                  previousData: {
                    folderName,
                    description,
                    foodList,
                  },
                },
              })
            }

          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="white" className="add-folder-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>

          <ul>
            {foodList.map((food, index) => (
              <li
                className='food-list-preview'
                key={index}
                style={{ marginBottom: '8px' }}
              >
                {food.foodName} {food.quantity} {food.unit}
                <button
                  className='delete-food-button'
                  onClick={() => {
                    const confirmed = window.confirm(`คุณต้องการลบ "${food.foodName}" หรือไม่ ?`);
                    if (confirmed) {
                      const updatedList = foodList.filter((_, i) => i !== index);
                      setFoodList(updatedList);
                    }
                  }}
                >
                  ลบ
                </button>
              </li>
            ))}
          </ul>

        </div>

        <div className="form-actions">
          <button onClick={handleAddFolder} className="save-button">บันทึก</button>
        </div>
      </div>
    </>
  );
};

export default AddFolder;

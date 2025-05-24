import React, {useState} from "react";
import './Profile.css'

//This file contain ui button for choosing range of time to display statistic data
//**THIS IS NOT FINAL VERSION**

const PeriodSelector = () => {
    const [selected, setSelected] = useState('all');
    const labels = {all: 'ทั้งหมด', month: 'เดือน', week:'สัปดาห์', day:'วัน'};

    return (
        <div className="period-selector">
            {Object.keys(labels).map(key => (
                <button
                    key={key}
                    onClick={() => setSelected(key)}
                    className={selected === key ? 'active':''}
                >
                    {labels[key]}   
                </button>
            ))}
        </div>
    );
};

export default PeriodSelector;
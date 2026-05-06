import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';


export default async function Shed2Remove() {
    //take all the lines form the database 
    const navigate = useNavigate();
    const [lines, setLines] = useState([]);

    return (
        <div>
            <h1>Shed2 Remove</h1>
        </div>
    );
}
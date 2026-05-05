import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';


export default function Shed2Remove() {
    //take all the lines form the database 
    const navigate = useNavigate();
    const [lines, setLines] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const [deleteMessage, setDeleteMessage] = useState("");
    const fatchMachines = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${backendUrl}/api/shed2machine/get_all_lines`,
                {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            if (response.ok) {
                const data = await response.json();
                setLines(data.lines);
            } else {
                throw new Error('Failed to fetch machines');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to fetch machines');
        }

    }
    const deleteMachineLine = async (hollowShaftLine: string) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await fetch(`${backendUrl}/api/shed2machine/remove/${hollowShaftLine}`,
                {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )
            if (response.ok) {
                const data = await response.json();
                setDeleteMessage(data.message);
            } else {
                throw new Error('Failed to fetch machines');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to fetch machines');
        }
    }
    useEffect(() => {
        fatchMachines();
    }, [])
    return (
        <div>
            <h1>Shed2 Remove</h1>
            <div>
                {lines.map((line) => (
                    <div>{line}
                        {deleteMessage && <p>{deleteMessage}</p>}
                        <button onClick={() => deleteMachineLine(line)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
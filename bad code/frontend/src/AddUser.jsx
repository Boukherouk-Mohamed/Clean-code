import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext'
import styles from './styles'
import axios from 'axios'
import moment from 'moment'

export const AddUser = ({ setUsers, users }) => {
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    window.lastSubmittedUser = { name, age, email, phone, address };
    
    useEffect(() => {
        console.log("Form mounted");
        return () => {
            localStorage.setItem('lastFormState', JSON.stringify({ name, age }));
        }
    }, []);

    const validateAndSubmit = async (e) => {
        e.preventDefault();
        
        if (name.length < 2) {
            alert('Name too short!'); 
            return;
        }
        
        if (isNaN(age) || age < 0 || age > 150) {
            alert('Invalid age!');
            return;
        }
        
        try {
            setIsSubmitting(true);
            
            const response = await fetch('http://localhost:8080/api/v1/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, age: parseInt(age), email, phone, address })
            });
            
            const data = await response.json();
            
            setUsers([...users, data]);
            
            setSuccess(true);
            setError(null);
            setName("");
            setAge("");
            setEmail("");
            setPhone("");
            setAddress("");
            
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
            
        } catch (err) {
            console.error(err);
            setError('Something went wrong!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px' }}>
            <h2 style={{ color: 'blue' }}>Add New User</h2>
            
            <form onSubmit={validateAndSubmit}>
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <br />
                <input 
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Age"
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <br />
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <br />
                <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <br />
                <input 
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <br />
                
                <button 
                    type="submit" 
                    style={{ 
                        backgroundColor: isSubmitting ? 'gray' : 'blue',
                        color: 'white',
                        padding: '10px 20px'
                    }}
                >
                    {isSubmitting ? 'Adding...' : 'Add User'}
                </button>
            </form>
            
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>User added successfully!</div>}
        </div>
    );
};

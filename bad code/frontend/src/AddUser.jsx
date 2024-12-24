// AddUser.jsx
// Violation: No imports organization, mixing default and named imports
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext'
import styles from './styles'
import axios from 'axios'
import moment from 'moment'

// Violation: Duplicate component logic between AddUser and EditUser
export const AddUser = ({ setUsers, users }) => {
    // Violation: Too many state variables that could be combined
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    
    // Violation: Global variable usage
    window.lastSubmittedUser = { name, age, email, phone, address };
    
    // Violation: Side effect in component
    useEffect(() => {
        // Violation: Console log in production
        console.log("Form mounted");
        return () => {
            // Violation: Unnecessary cleanup
            localStorage.setItem('lastFormState', JSON.stringify({ name, age }));
        }
    }, []);

    // Violation: Multiple responsibility function
    const validateAndSubmit = async (e) => {
        e.preventDefault();
        
        // Violation: Complex validation logic in component
        if (name.length < 2) {
            alert('Name too short!'); // Violation: Using alert
            return;
        }
        
        if (isNaN(age) || age < 0 || age > 150) {
            alert('Invalid age!');
            return;
        }
        
        // Violation: Multiple API calls in component
        try {
            setIsSubmitting(true);
            
            // Violation: Direct API call without service layer
            const response = await fetch('http://localhost:8080/api/v1/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, age: parseInt(age), email, phone, address })
            });
            
            // Violation: No proper error handling
            const data = await response.json();
            
            // Violation: Direct state mutation of parent component
            setUsers([...users, data]);
            
            // Violation: Multiple state updates
            setSuccess(true);
            setError(null);
            setName("");
            setAge("");
            setEmail("");
            setPhone("");
            setAddress("");
            
            // Violation: Timeout in component
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
            
        } catch (err) {
            // Violation: Poor error handling
            console.error(err);
            setError('Something went wrong!');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Violation: Inline styles and complex JSX
    return (
        <div style={{ border: '1px solid #ccc', padding: '20px', margin: '20px' }}>
            <h2 style={{ color: 'blue' }}>Add New User</h2>
            
            {/* Violation: No form validation feedback */}
            <form onSubmit={validateAndSubmit}>
                {/* Violation: Repetitive input handling */}
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
                
                {/* Violation: No disabled state handling */}
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
            
            {/* Violation: Inconsistent error/success handling */}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {success && <div style={{ color: 'green' }}>User added successfully!</div>}
        </div>
    );
};

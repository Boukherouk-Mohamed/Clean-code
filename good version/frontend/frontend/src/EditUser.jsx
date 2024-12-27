
// EditUser.jsx
// Violation: Duplicated code from AddUser
export const EditUser = ({ user, setUsers, users, onCancel }) => {
    // Violation: Copy-pasted state management
    const [name, setName] = useState(user.name || "");
    const [age, setAge] = useState(user.age || "");
    const [email, setEmail] = useState(user.email || "");
    const [phone, setPhone] = useState(user.phone || "");
    const [address, setAddress] = useState(user.address || "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    
    // Violation: Unnecessary effect
    useEffect(() => {
        if (user) {
            setName(user.name);
            setAge(user.age);
            setEmail(user.email);
            setPhone(user.phone);
            setAddress(user.address);
        }
    }, [user]);
    
    // Violation: Duplicated validation logic
    const handleUpdate = async (e) => {
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
            
            // Violation: Direct API call
            const response = await fetch(`http://localhost:8080/api/v1/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, age: parseInt(age), email, phone, address })
            });
            
            const updatedUser = await response.json();
            
            // Violation: Complex state update logic in component
            setUsers(users.map(u => u.id === user.id ? updatedUser : u));
            
            // Violation: Direct DOM manipulation
            document.getElementById('editForm').style.display = 'none';
            
            onCancel();
            
        } catch (err) {
            console.error(err);
            setError('Update failed!');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Violation: Duplicated JSX structure
    return (
        <div id="editForm" style={{ 
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
        }}>
            <h2>Edit User</h2>
            
            <form onSubmit={handleUpdate}>
                <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <br />
                <input 
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <br />
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <br />
                <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <br />
                <input 
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ marginBottom: '10px', padding: '5px' }}
                />
                <br />
                
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                        type="submit"
                        style={{ 
                            backgroundColor: isSubmitting ? 'gray' : 'blue',
                            color: 'white',
                            padding: '10px 20px'
                        }}
                    >
                        {isSubmitting ? 'Updating...' : 'Update User'}
                    </button>
                    
                    <button 
                        type="button"
                        onClick={onCancel}
                        style={{ 
                            backgroundColor: 'red',
                            color: 'white',
                            padding: '10px 20px'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
            
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
};
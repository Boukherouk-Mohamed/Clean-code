import { useState } from "react";

export const EditUser = ({ user, setUsers, users, onCancel }) => {
    const [n, setName] = useState( "");
    const [a, setAge] = useState( "");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleUpdate = async (e) => {
        e.preventDefault();

        // Basic validation
        if (n.length < 2) {
            alert("Name must be at least 2 characters long.");
            return;
        }

        if (isNaN(a) || a < 0 || a > 150) {
            alert("Age must be a valid number between 0 and 150.");
            return;
        }

        try {
            setIsSubmitting(true);

            // Update user via API
            const response = await fetch(`http://localhost:8080/api/v1/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ n, a: parseInt(a, 10) }),
            });

            if (!response.ok) {
                throw new Error("Failed to update user.");
            }

            const updatedUser = await response.json();

            // Update the users state
            setUsers(users.map((u) => (u.id === user.id ? updatedUser : u)));

            // Close the form
            onCancel();
        } catch (err) {
            console.error(err);
            setError("Update failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                backgroundColor: "white",
                padding: "20px",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
            }}
        >
            <h2>Edit User</h2>
            <form onSubmit={handleUpdate}>
                <div style={{ marginBottom: "10px" }}>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={n}
                            onChange={(e) => setName(e.target.value)}
                            style={{ marginLeft: "10px", padding: "5px" }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>
                        Age:
                        <input
                            type="number"
                            value={a}
                            onChange={(e) => setAge(e.target.value)}
                            style={{ marginLeft: "10px", padding: "5px" }}
                        />
                    </label>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: isSubmitting ? "gray" : "blue",
                            color: "white",
                            padding: "10px 20px",
                        }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Updating..." : "Update"}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        style={{
                            backgroundColor: "red",
                            color: "white",
                            padding: "10px 20px",
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
            {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
        </div>
    );
};

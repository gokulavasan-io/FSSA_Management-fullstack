import { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "student",
  });
  const [members, setMembers] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/member/members/");
        setMembers(response.data);
      } catch (error) {
        setMessage("Failed to fetch members");
      }
    };
    fetchMembers();
  }, [message]); // Triggered when the message state changes (for updates)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/member/add_member/", formData);
      setMessage("Member added successfully!");
      setFormData({ name: "", email: "", role: "student" });
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to add member");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/member/delete-member/${id}/`);
      setMessage("Member deleted successfully!");
    } catch (error) {
      setMessage("Failed to delete member");
    }
  };


  return (
    <div>
      <h2>Admin - Manage Members</h2>
      {message && <p>{message}</p>}
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Admin</option>
          <option value="teacher">Coach</option>
        </select>
        <button type="submit">Add Member</button>
      </form>

      <h3>Existing Members</h3>
      <ul>
        {members.map((member) => (
          <li key={member.id}>
            <p>{member.name} - {member.email} ({member.role})</p>
            <button onClick={() => handleDelete(member.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;

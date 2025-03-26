import React, { useState, useEffect } from "react";
import ProfileCard from "./ProfileCard";
import { format } from "date-fns";
import { getMembers } from "../../../../../api/adminAPI";
import { useMainContext } from "../../../../../Context/MainContext";

function Team() {
  const { setSelectedSubject, setSelectedKey } = useMainContext();

  const [members, setMembers] = useState([]);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  function formatData(usersData) {
    return usersData
      .filter((user) => user.id != userId)
      .map((user) => {
        return {
          image: user.image_link,
          name: user.name || "",
          email: user.email,
          role: user.role_name,
          section: user.section_name,
          date: format(new Date(user.created_at), "dd/MMM/yy"),
        };
      });
  }

  useEffect(() => {
    setSelectedKey(null);
    setSelectedSubject({ id: null, subject_name: "Your Team" });
    setUserId(localStorage.getItem("userId"));
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await getMembers();
      setMembers(formatData(response));
    } catch (error) {
      console.error("Error fetching members:", error);
  
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
      {members.map((member) => (
        <ProfileCard user={member} />
      ))}
    </div>
  );
}

export default Team;

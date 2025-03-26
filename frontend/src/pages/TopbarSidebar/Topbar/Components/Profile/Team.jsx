import React,{useState,useEffect} from 'react'
import ProfileCard from './ProfileCard';
import { format } from "date-fns";
import { getMembers } from '../../../../../api/adminAPI';


function Team() {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    function formatData(usersData) {
          return usersData.map(user=>{
                return {
                    "image":user.image,
                    "name":user.name||"",
                    "email":user.email,
                    "role":user.role_name,
                    "section":user.section_name,
                    "date":format(new Date(user.created_at), "dd/MMM/yy")
                }
            })
    }

    useEffect(() => {
        fetchMembers();
      }, []);
    
      const fetchMembers = async () => {
        try {
          const response = getMembers()
          console.log(response);
          setMembers(formatData(response.data));
          setLoading(false);
        } catch (error) {
          console.error("Error fetching members:", error);
          message.error("Failed to load members.");
          setLoading(false);
        }
      };

  return (
    <div style={{display:"flex",flexWrap:"wrap",gap:10}} >
        {members.map(member=><ProfileCard  user={member} />)}
    </div>
    
  )
}

export default Team


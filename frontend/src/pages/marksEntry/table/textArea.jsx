import React, { useState } from 'react';

export default function TextArea({aboutTest, setAboutTest,setIsEdited,previousAboutTest,isSaved}) {
  const [isFocused, setIsFocused] = useState(false); 

  const handleChange = (e) => {
    setAboutTest(e.target.value);
    setIsEdited(true);
    if( e.target.value.trim()==previousAboutTest){
        setIsEdited(false);
    }
  };

  const handleFocus = () => {
    setIsFocused(true); 
  };

  const handleBlur = () => {
    setIsFocused(false); 
  };

  const blue = {
    400: '#3399FF',
    600: '#0072E5',
  };

  const grey = {
    200: '#DAE2ED',
    300: '#C7D0DD',
    500: '#9DA8B7',
  };

  return (
    <textarea
      aria-label="empty textarea"
      placeholder={isSaved ?  "No data provided":"Write about the Test ..." }
      value={aboutTest} // Controlled input value
      onChange={handleChange} // Update state on text change
      onFocus={handleFocus} // Trigger when the textarea is focused
      onBlur={handleBlur} 
      style={{
        boxSizing: 'border-box',
        width: '320px',
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: '0.875rem',
        fontWeight: '400',
        lineHeight: '1.5',
        padding: '12px',
        borderRadius: '10px', // More rounded corners for modern look
        color: '#1C2025', // Dark grey color for text
        background: '#f8f9fa', // Light background for a clean look
        border: `1px solid ${isFocused ? blue[400] : grey[300]}`, // Subtle border, blue on focus
        boxShadow: isFocused ? `0 0 8px 0 ${blue[400]}` : 'none', // Glowing blue shadow on focus
        outline: 'none', // Remove default outline
        transition: 'border-color 0.3s, box-shadow 0.3s ease', 
        minHeight:"50px"
      }}
    />
  );
}

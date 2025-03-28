import React from 'react'
import dayjs from 'dayjs';
import { addRemark } from "../../../../api/attendanceAPI";
import '../../Styles/addCommentDialog.css'


export const addRemarkAction = (studentId,date,studentName,remark,refetchAttendance) => {
 
  const remarkInfo = document.getElementById("remarkInfo");
  const formattedDate = dayjs(date).format('DD/MM/YYYY');
  remarkInfo.innerHTML=`${studentName} - ${formattedDate}`

  showDialog((remark) => {
    const remarkData = {
      student_id: studentId,
      date: date,
      remark: remark,
    };
    saveRemark(remarkData, refetchAttendance)
  },remark);
};


export function showDialog(onSubmit,remark) {
  const dialogContainer = document.getElementById("dialog-container");
  const cancelButton = document.getElementById("cancel-button");
  const submitButton = document.getElementById("submit-button");
  const remarkInput = document.getElementById("remark-input");
  if (remark) {
    remarkInput.value=remark
  }

  dialogContainer.style.display = "block";

  const closeDialog = () => {
    dialogContainer.style.display = "none";
    remarkInput.value = "";
  };

  cancelButton.onclick = closeDialog;

  submitButton.onclick = () => {
    const remark = remarkInput.value.trim();
    if (remark) {
      onSubmit(remark);
      closeDialog();
    } else {
      alert("Remark cannot be empty!");
    }
  };
}

export async function saveRemark(remarkData,refetchAttendance) {
  try {
    await addRemark(remarkData);
    alert("remark added successfully")
    refetchAttendance()
  } catch (error) {
    console.error("Error adding remark:", error);
    alert("Failed to add remark.");
  }
}


export default function CommentDialog() {
  return (
    <div id="dialog-container">
    <div id="dialog-overlay"></div>
    <div id="dialog-box">
        <h3>Add Your Comment</h3>
        <p id="remarkInfo"></p>
        <textarea id="remark-input" placeholder="Write your comment here..."></textarea>
        <div className="dialog-buttons">
            <button id="cancel-button">Cancel</button>
            <button id="submit-button">Submit</button>
        </div>
    </div>
</div>

  )
}

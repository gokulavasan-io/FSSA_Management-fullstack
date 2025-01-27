import axios from "axios";
import API_PATHS from '../../../constants/apiPaths';
import dayjs from 'dayjs';


export const addRemarkAction = (studentId,date,studentName,remark) => {
  const remarkInfo = document.getElementById("remarkInfo");
  const formattedDate = dayjs(date).format('DD/MM/YYYY');
  remarkInfo.innerHTML=`${studentName} - ${formattedDate}`

  showDialog((remark) => {
    const remarkData = {
      student_id: studentId,
      date: date,
      remark: remark,
    };
    saveRemark(remarkData);
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

export async function saveRemark(remarkData) {
  try {
    await axios.post(API_PATHS.ADD_REMARK, remarkData);
    
  } catch (error) {
    console.error("Error adding remark:", error);
    alert("Failed to add remark.");
  }
}


import html2canvas from "html2canvas";

/** 
 * @param {ref} reportCardRef - ref of the report card component
 * @param {string} studentName - name of the student
 * @param {string} sectionName - name of the section
*/

const downloadReportCard = async (reportCardRef,studentName,sectionName) => {
    if (!reportCardRef.current) return;
    const canvas = await html2canvas(reportCardRef.current);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${studentName}-${sectionName}.png`;
    link.click();
  };

export default downloadReportCard;
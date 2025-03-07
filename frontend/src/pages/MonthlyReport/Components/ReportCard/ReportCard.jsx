import React from "react";
import "../../Styles/ReportCard.css";
const ReportCard = React.forwardRef((props, ref) => {
  let names = {
    Student: "Gokulavasan",
    Teacher: "Mr. xxx & Mrs. yyy",
  };
  let sec_mon_year = { Section: "A", Month: "Jan", Year: 2025 };

  return (
    <>
      <div className="reportCard" ref={ref}>
        <div className="header">
          <img
            src="../../../../../public/assets/images/FSSA_logo.jpg"
            className="fssaLogo"  alt="Freshworks STS software academy logo"
          />
        </div>
        <div className="studentDetail_container">
          <h2 className="title">✨ Student Report Card ✨</h2>
          <div className="studentDetail">
            {Object.keys(names).map((name, index) => (
              <div className="nameDetail" key={index}>
                <h3>{`${name}'s name`}</h3>
                <div className="name">
                  <span>{names[name]}</span>
                </div>
              </div>
            ))}
            <div className="sec_mon_year">
              {Object.keys(sec_mon_year).map((el, index) => (
                <div key={index}>
                  <h3>{el}</h3>
                  <span>{sec_mon_year[el]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* <div id="c" style={{ width: "100%" }}></div> */}


        <div className="marksContainer_1">
          <h2 className="title" >Grades</h2>
          <div className="marksContainer_2">
              <div className="marksHeader">
                <div className="title">{`${names["Student"]}'s Score`} </div>
                <div className="title">Class Average</div>
              </div>
              <div className="marksContainer_3" >
                  <div className="academicMarks" >
                    <div className="subject">
                      <div className="studentMark">
                        <h3 className="subjectName" >English</h3>
                        <span>56</span>
                      </div>
                      <div className="classAvgMark" >78</div>
                    </div>
                  </div>
                  <div className="marksFooter" ></div>
              </div>
          </div>
        </div>


        <div className="footer">
          <img src="../../../../../public/assets/images/Report_card_footer.jpg" alt="report_card_footer" />
        </div>
      </div>
    </>
  );
});

export default ReportCard;

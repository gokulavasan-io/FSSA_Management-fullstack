import React from "react";
import "../../Styles/ReportCard.css";
import { categoryColor, categoryMark } from "../../../../constants/MarkCategory";

const ReportCard = React.forwardRef((props, ref) => {
  let { names, sec_mon_year, marks, absentBehavior } = props;

  const getBgColor = (mark) => {
    if (mark <= categoryMark.redEndValue) return categoryColor["Not Good"].bg;
    else if (mark <= categoryMark.yellowEndValue)
      return categoryColor["Good"].bg;
    else return categoryColor["Very Good"].bg;
  };
  const getColor = (mark) => {
    if (mark <= categoryMark.redEndValue)
      return categoryColor["Not Good"].color;
    else if (mark <= categoryMark.yellowEndValue)
      return categoryColor["Good"].color;
    else return categoryColor["Very Good"].color;
  };

  return (
    <>
      <div className="reportCard" ref={ref}>
        <div className="header">
          <img
            src="../../../../../public/assets/images/FSSA_logo.jpg"
            className="fssaLogo"
            alt="Freshworks STS software academy logo"
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

        <div className="marksContainer_1">
          <h2 className="title">Grades</h2>
          <div className="marksContainer_2">
            <div className="marksHeader">
              <div className="title">{`${names["Student"]}'s Score`} </div>
              <div className="title">Class Average</div>
            </div>
            <div className="marksContainer_3">
              <div className="academicMarks">
                {Object.keys(marks).map((subject) => (
                  <div className="subject" key={subject}>
                    <div className="studentMark">
                      <h3 className="subjectName">{subject}</h3>
                      <span
                        style={{
                          backgroundColor: getBgColor(
                            marks[subject]?.studentMark
                          ),
                          color: getColor(marks[subject]?.studentMark),
                        }}
                      >
                        {marks[subject]?.studentMark}
                      </span>
                    </div>
                    <div className="classAvgMark">
                      <span
                        style={{
                          backgroundColor: getBgColor(marks[subject]?.classAvg),
                          color: getColor(marks[subject]?.classAvg),
                        }}
                      >
                        {marks[subject]?.classAvg}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="line">
                  <span></span>
                </div>

                {Object.keys(absentBehavior).map((subject) => (
                  <div className="subject" key={subject}>
                    <div className="studentMark">
                      <h3 className="subjectName">{subject}</h3>
                      <span
                        style={{
                          backgroundColor: getBgColor(absentBehavior[subject]),
                          color: getColor(absentBehavior[subject]),
                        }}
                      >
                        {absentBehavior[subject]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="markRange">
                {Object.keys(categoryColor).map((category) => (
                  <div>
                    <span
                      className="markColor"
                      style={{ backgroundColor: categoryColor[category].bg }}
                    ></span>
                    <span>{category}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="footer">
          <img
            src="../../../../../public/assets/images/Report_card_footer.jpg"
            alt="report_card_footer"
          />
        </div>
      </div>
    </>
  );
});

export default ReportCard;

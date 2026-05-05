import React from "react";
import { SegmentedControl } from "@mantine/core";
import { useState, useEffect } from "react";
import { Modal, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  getLocalMarks,
  getLocalStudents,
  getLocalSubjects,
  getSubjectMax,
  getSubjectPass,
  saveLocalExamMarks,
  setLocalStudents,
  setLocalSubjects,
} from "../../utils/localDemoData";

function EnterMarks() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [marks, setMarks] = useState({});
  const [activeExam, setActiveExam] = useState("unit1");


useEffect(() => {
  fetch("http://localhost:5001/students")
    .then(res => res.json())
    .then(data => {
      setStudents(data);
      setLocalStudents(data);
    })
    .catch(() => {
      setStudents(getLocalStudents());
    });

  fetch("http://localhost:5001/subjects")
    .then(res => res.json())
    .then(data => {
      setSubjects(data);
      setLocalSubjects(data);
    })
    .catch(() => {
      setSubjects(getLocalSubjects());
    });

  fetch(`http://localhost:5001/marks/${activeExam}`)
    .then(res => res.json())
    .then(data => {

      const formatted = {};

      data.forEach((row) => {
        if (!formatted[row.roll_no]) {
          formatted[row.roll_no] = {};
        }

        formatted[row.roll_no][row.name] = row[`${activeExam}_marks`];
      });

      const localMarks = getLocalMarks();
      if (!data.length) {
        setMarks(localMarks);
        return;
      }

      const updatedMarks = {
        ...localMarks,
        [activeExam]: formatted
      };

      setMarks(updatedMarks);
      localStorage.setItem("marks", JSON.stringify(updatedMarks));
    })
    .catch(() => {
      setMarks(getLocalMarks());
    });

}, [activeExam]);

  const handleMarkChange = (rollNo, subjectName, value) => {
    const updatedMarks = { ...marks };

    if (!updatedMarks[activeExam]) {
      updatedMarks[activeExam] = {};
    }
    if (!updatedMarks[activeExam][rollNo]) {
      updatedMarks[activeExam][rollNo] = {};
    }

    updatedMarks[activeExam][rollNo][subjectName] = Number(value);

    setMarks(updatedMarks);
  };

  const handleSaveMarks = () => {
    const updatedMarks = saveLocalExamMarks(activeExam, marks[activeExam] || {});
    setMarks(updatedMarks);

    notifications.show({
      title: "Marks Saved",
      message: "Marks saved locally for quick demo and offline fallback",
      color: "green",
    });
  };

  const getPassMarks = (subjects) => {
    return getSubjectPass(subjects, activeExam);
  };

  const getMaxMarks = (subjects) => {
    return getSubjectMax(subjects, activeExam);
  };

  return (
    <div className="marks-cointainer">
      <h2>Enter Marks</h2>
      <br />
      <SegmentedControl
      fullWidth
      size="lg"
      radius="xl"
        value={activeExam}
        onChange={setActiveExam}
        data={[
          { label: "Unit 1", value: "unit1" },
          { label: "Unit 2", value: "unit2" },
          { label: "Term 1", value: "term1" },
          { label: "Term 2", value: "term2" },
        ]}
      />
    <br />
      <div>
        Enter Marks for <b>{activeExam}</b>
      </div>

      <table className="marks-table">
        <thead>
          <tr style={{ backgroundColor: "lavender" }}>
            <th>Roll No</th>
            <th>Student Name</th>
            {subjects.map((sub, i) => (
              <th key={i}>
                {sub.name}
                <br />
                <small>max {getMaxMarks(sub)}</small>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {students.map((std, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{std.name}</td>

              {subjects.map((sub, subIndex) => {
                const value = marks?.[activeExam]?.[std.roll_no]?.[sub.name] || "";

                const isFail = value !== "" && value < getPassMarks(sub);

                return (
                  <td key={subIndex}>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        handleMarkChange(std.roll_no, sub.name, e.target.value)
                      }
                      style={{
                        border: isFail ? "2px solid red" : "",
                        borderRadius: "6px",
                        padding: "5px",
                        width: "60px",
                      }}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Buttons */}
      <div style={{ marginTop: "20px" }}>
        <Button
          variant="light"
          color="rgba(255, 239, 181, 1)"
          radius="xl"
          onClick={handleSaveMarks}
        >
          Save All Marks
        </Button>
      </div>
    </div>
  );
}

export default EnterMarks;

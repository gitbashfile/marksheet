import React from "react";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import {
  addLocalSubject,
  deleteLocalSubject,
  getLocalGrades,
  getLocalSubjects,
  setLocalSubjects,
} from "../../utils/localDemoData";

function Configuration() {
  const [subjects, setSubjects] = useState([]);
  const [grades] = useState(getLocalGrades);
  const [opened, { open, close }] = useDisclosure(false);

  const [subjectName, setSubjectName] = useState("");
  const [u1Max, setU1Max] = useState("");
  const [u1Pass, setU1Pass] = useState("");
  const [u2Max, setU2Max] = useState("");
  const [u2Pass, setU2Pass] = useState("");
  const [t1Max, setT1Max] = useState("");
  const [t1Pass, setT1Pass] = useState("");
  const [t2Max, setT2Max] = useState("");
  const [t2Pass, setT2Pass] = useState("");

  useEffect(() => {
    fetch("http://localhost:5001/subjects")
    .then(res => res.json())
    .then(data => {
      setSubjects(data)
      setLocalSubjects(data)
    })
    .catch(() => setSubjects(getLocalSubjects()))
  }, []);

  const handleAddSubject = async () => {
    if (!subjectName) return;

    const newSubject = {
      name: subjectName,
      unit1_max: u1Max,
      unit1_pass: u1Pass,
      unit2_max: u2Max,
      unit2_pass: u2Pass,
      term1_max: t1Max,
      term1_pass: t1Pass,
      term2_max: t2Max,
      term2_pass: t2Pass
    };
    const localSubjects = addLocalSubject(newSubject);

    try {
      await fetch("http://localhost:5001/subjects",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },
        body: JSON.stringify(newSubject)
      }
    )

    fetch("http://localhost:5001/subjects")
    .then(res => res.json())
    .then(data => {
      setSubjects(data)
      setLocalSubjects(data)
    })
    .catch(() => setSubjects(localSubjects))
    } catch {
      setSubjects(localSubjects)
    }

    setSubjectName("");
    setU1Max("");
    setU1Pass("");
    setU2Max("");
    setU2Pass("");
    setT1Max("");
    setT1Pass("");
    setT2Max("");
    setT2Pass("");
    close()
  };

  const handleSubjectDelete = async (id) => {
    const localSubjects = deleteLocalSubject(id);

    try {
      await fetch(`http://localhost:5001/subjects/${id}`, {
      method: "DELETE",
    });

    fetch("http://localhost:5001/subjects")
      .then(res => res.json())
      .then(data => {
        setSubjects(data)
        setLocalSubjects(data)
      })
      .catch(() => setSubjects(localSubjects));
    } catch {
      setSubjects(localSubjects);
    }
  };

  return (
    <div className="config-cointainer">
      <h2>Subjects And Marks Configuration</h2>
      <div className="table-scroll">
        <table className="config-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Subjects</th>
              <th colSpan={2}>Unit 1</th>
              <th colSpan={2}>Unit 2</th>
              <th colSpan={2}>Term 1</th>
              <th colSpan={2}>Term 2</th>
              <th>Action</th>
            </tr>
            <tr>
              <th></th>
              <th></th>
              <th>Max</th>
              <th>Pass</th>
              <th>Max</th>
              <th>Pass</th>
              <th>Max</th>
              <th>Pass</th>
              <th>Max</th>
              <th>Pass</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{sub.name}</td>
                <td>{sub.unit1_max}</td>
                <td>{sub.unit1_pass}</td>
                <td>{sub.unit2_max}</td>
                <td>{sub.unit2_pass}</td>
                <td>{sub.term1_max}</td>
                <td>{sub.term1_pass}</td>
                <td>{sub.term2_max}</td>
                <td>{sub.term2_pass}</td>
                <td>
                  <button onClick={() => handleSubjectDelete(sub.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal opened={opened} onClose={close} size={"auto"} centered>
        <div>
          <h3>Edit / Add Subjects</h3>
          <div className="form-cointainer">
            <div>
              <label>Subject Name</label>
              <input
                type="text"
                name="subject"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>
            <div className="form-marks">
              <div>
                <label>Unit 1 Max</label>
                <input
                  type="number"
                  value={u1Max}
                  onChange={(e) => setU1Max(e.target.value)}
                />
              </div>
              <div>
                <label>Unit 1 Pass</label>
                <input
                  type="number"
                  value={u1Pass}
                  onChange={(e) => setU1Pass(e.target.value)}
                />
              </div>
              <div>
                <label>Unit 2 Max</label>
                <input
                  type="number"
                  value={u2Max}
                  onChange={(e) => setU2Max(e.target.value)}
                />
              </div>
              <div>
                <label>Unit 2 Pass</label>
                <input
                  type="number"
                  value={u2Pass}
                  onChange={(e) => setU2Pass(e.target.value)}
                />
              </div>
              <div>
                <label>Term 1 Max</label>
                <input
                  type="number"
                  value={t1Max}
                  onChange={(e) => setT1Max(e.target.value)}
                />
              </div>
              <div>
                <label>Term 1 Pass</label>
                <input
                  type="number"
                  value={t1Pass}
                  onChange={(e) => setT1Pass(e.target.value)}
                />
              </div>
              <div>
                <label>Term 2 Max</label>
                <input
                  type="number"
                  value={t2Max}
                  onChange={(e) => setT2Max(e.target.value)}
                />
              </div>
              <div>
                <label>Term 2 Pass</label>
                <input
                  type="number"
                  value={t2Pass}
                  onChange={(e) => setT2Pass(e.target.value)}
                />
              </div>
            </div>
            <Button variant="light" color="rgba(255, 239, 181, 1)" radius="xl" onClick={handleAddSubject}>Add Subject</Button>
          </div>
        </div>
      </Modal>
      <div className="page-action">
        <Button variant="light" color="rgba(255, 239, 181, 1)" radius="xl" onClick={open}>Add New Subject</Button>
      </div>
      <div className="grades-card">
        <h3>Grade Thresholds</h3>
        <p className="subtext">
          Grade is calculated on overall percentage across all subjects
        </p>

        <div className="table-scroll">
          <table className="grades-table">
            <thead>
              <tr>
                <th>Grade</th>
                <th>Minimum %</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade, index) => (
                <tr key={index}>
                  <td>
                    <span className={`grade-badge ${grade.class}`}>
                      {grade.name}
                    </span>
                  </td>
                  <td>{grade.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default Configuration;

import React from "react";
import { useState, useEffect } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import {
  addLocalStudent,
  deleteLocalStudent,
  getLocalStudents,
  setLocalStudents,
} from "../../utils/localDemoData";

function Student() {
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [opened, { open, close }] = useDisclosure(false);

 useEffect(() => {
  fetch("http://localhost:5001/students")
  .then(res => res.json())
  .then(data => {
    setStudents(data)
    setLocalStudents(data)
  })
  .catch(() => setStudents(getLocalStudents()))
 }, [])

  const handleAddStudent = async () => {
    if(!studentClass || !studentName) return

    const newStudent = {
      name: studentName,
      class: studentClass
    };

    const localStudents = addLocalStudent(newStudent);

    try {
      await fetch("http://localhost:5001/students", {
      method:"POST",
      headers:{
        "Content-Type": "application/json"
      },
      body:JSON.stringify(newStudent),
    })

    fetch("http://localhost:5001/students")
    .then(res => res.json())
    .then(data => {
      setStudents(data)
      setLocalStudents(data)
    })
    .catch(() => setStudents(localStudents))
    } catch {
      setStudents(localStudents)
    }

    setStudentName("")
    setStudentClass("")
    close()

  }

  const handlDeleteStudent = async (roll_no) => {
    const localStudents = deleteLocalStudent(roll_no);

    try {
      await fetch(`http://localhost:5001/students/${roll_no}`,{
      method:"DELETE"
    })

    fetch("http://localhost:5001/students")
    .then(res => res.json())
    .then(data => {
      setStudents(data)
      setLocalStudents(data)
    })
    .catch(() => setStudents(localStudents))
    } catch {
      setStudents(localStudents)
    }
  }

  return (
    <div className="student-cointainer">
      <h2>Students</h2>
      <div className="table-scroll">
        <table className="std-table">
          <thead>
            <tr style={{ backgroundColor: "lavender" }}>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((std, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{std.name}</td>
                <td>{std.class}</td>
                <td>
                  <button onClick={() => handlDeleteStudent(std.roll_no)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal opened={opened} onClose={close} title="Add Student" centered>
        <div className="std-form">
          <div>
            <div>
              <label>Student Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            <div>
              <label>Class</label>
              <input
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
              />
            </div>
          </div>
          <Button
            variant="light"
            color="rgba(255, 239, 181, 1)"
            radius="xl"
            onClick={handleAddStudent}
          >
            + Add Student
          </Button>
        </div>
      </Modal>
      <div className="page-action">
        <Button
          variant="light"
          color="rgba(255, 239, 181, 1)"
          radius="xl"
          onClick={open}
        >
          Add New Student
        </Button>
      </div>
    </div>
  );
}

export default Student;

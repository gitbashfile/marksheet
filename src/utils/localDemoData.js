const STUDENTS_KEY = "students";
const SUBJECTS_KEY = "subjects";
const MARKS_KEY = "marks";
const GRADES_KEY = "grades";
const SEED_KEY = "marksheetDemoDataSeeded";

export const defaultGrades = [
  { name: "Failed", min: 0, label: "Below 35%", class: "badge-failed" },
  { name: "Second Class", min: 35, label: "35% and above", class: "badge-second" },
  { name: "First Class", min: 60, label: "60% and above", class: "badge-first" },
  { name: "Merit", min: 85, label: "85% and above", class: "badge-merit" },
];

const demoStudents = [
  { roll_no: 1, name: "Aarav Sharma", class: "BBA First Year" },
  { roll_no: 2, name: "Meera Khan", class: "BBA First Year" },
  { roll_no: 3, name: "Rohan Patel", class: "BBA First Year" },
];

const demoSubjects = [
  {
    id: 1,
    name: "Accounting",
    unit1_max: 20,
    unit1_pass: 7,
    unit2_max: 20,
    unit2_pass: 7,
    term1_max: 80,
    term1_pass: 28,
    term2_max: 100,
    term2_pass: 35,
  },
  {
    id: 2,
    name: "Economics",
    unit1_max: 20,
    unit1_pass: 7,
    unit2_max: 20,
    unit2_pass: 7,
    term1_max: 80,
    term1_pass: 28,
    term2_max: 100,
    term2_pass: 35,
  },
  {
    id: 3,
    name: "Business Law",
    unit1_max: 20,
    unit1_pass: 7,
    unit2_max: 20,
    unit2_pass: 7,
    term1_max: 80,
    term1_pass: 28,
    term2_max: 100,
    term2_pass: 35,
  },
];

const demoMarks = {
  unit1: {
    1: { Accounting: 16, Economics: 15, "Business Law": 14 },
    2: { Accounting: 12, Economics: 17, "Business Law": 16 },
    3: { Accounting: 8, Economics: 11, "Business Law": 6 },
  },
  unit2: {
    1: { Accounting: 15, Economics: 14, "Business Law": 17 },
    2: { Accounting: 13, Economics: 16, "Business Law": 15 },
    3: { Accounting: 9, Economics: 10, "Business Law": 8 },
  },
  term1: {
    1: { Accounting: 64, Economics: 61, "Business Law": 58 },
    2: { Accounting: 52, Economics: 66, "Business Law": 62 },
    3: { Accounting: 34, Economics: 39, "Business Law": 27 },
  },
  term2: {
    1: { Accounting: 78, Economics: 74, "Business Law": 81 },
    2: { Accounting: 68, Economics: 72, "Business Law": 70 },
    3: { Accounting: 44, Economics: 41, "Business Law": 33 },
  },
};

const readJson = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const seedDemoDataOnce = () => {
  if (localStorage.getItem(SEED_KEY)) return;

  if (!localStorage.getItem(STUDENTS_KEY)) writeJson(STUDENTS_KEY, demoStudents);
  if (!localStorage.getItem(SUBJECTS_KEY)) writeJson(SUBJECTS_KEY, demoSubjects);
  if (!localStorage.getItem(MARKS_KEY)) writeJson(MARKS_KEY, demoMarks);
  if (!localStorage.getItem(GRADES_KEY)) writeJson(GRADES_KEY, defaultGrades);

  localStorage.setItem(SEED_KEY, "true");
};

export const getLocalStudents = () => readJson(STUDENTS_KEY, []);
export const setLocalStudents = (students) => writeJson(STUDENTS_KEY, students);

export const getLocalSubjects = () => readJson(SUBJECTS_KEY, []);
export const setLocalSubjects = (subjects) => writeJson(SUBJECTS_KEY, subjects);

export const getLocalMarks = () =>
  readJson(MARKS_KEY, { unit1: {}, unit2: {}, term1: {}, term2: {} });
export const setLocalMarks = (marks) => writeJson(MARKS_KEY, marks);

export const getLocalGrades = () => readJson(GRADES_KEY, defaultGrades);

export const addLocalStudent = ({ name, class: studentClass }) => {
  const students = getLocalStudents();
  const nextRollNo = Math.max(0, ...students.map((student) => Number(student.roll_no) || 0)) + 1;
  const newStudent = { roll_no: nextRollNo, name, class: studentClass };
  const updatedStudents = [...students, newStudent];
  setLocalStudents(updatedStudents);
  return updatedStudents;
};

export const deleteLocalStudent = (rollNo) => {
  const students = getLocalStudents().filter((student) => String(student.roll_no) !== String(rollNo));
  const marks = getLocalMarks();

  Object.keys(marks).forEach((exam) => {
    delete marks[exam][rollNo];
  });

  setLocalStudents(students);
  setLocalMarks(marks);
  return students;
};

export const addLocalSubject = (subject) => {
  const subjects = getLocalSubjects();
  const nextId = Math.max(0, ...subjects.map((item) => Number(item.id) || 0)) + 1;
  const newSubject = { id: nextId, ...subject };
  const updatedSubjects = [...subjects, newSubject];
  setLocalSubjects(updatedSubjects);
  return updatedSubjects;
};

export const deleteLocalSubject = (id) => {
  const subject = getLocalSubjects().find((item) => String(item.id) === String(id));
  const subjects = getLocalSubjects().filter((item) => String(item.id) !== String(id));
  const marks = getLocalMarks();

  if (subject) {
    Object.keys(marks).forEach((exam) => {
      Object.keys(marks[exam]).forEach((rollNo) => {
        delete marks[exam][rollNo][subject.name];
      });
    });
  }

  setLocalSubjects(subjects);
  setLocalMarks(marks);
  return subjects;
};

export const saveLocalExamMarks = (exam, examMarks) => {
  const marks = getLocalMarks();
  marks[exam] = examMarks;
  setLocalMarks(marks);
  return marks;
};

export const getSubjectMax = (subject, exam) => subject[`${exam}_max`] ?? subject[`${exam}Max`] ?? "";
export const getSubjectPass = (subject, exam) => subject[`${exam}_pass`] ?? subject[`${exam}Pass`] ?? "";

export const marksRowsToLocalShape = (rows, students) => {
  const formattedMarks = {
    unit1: {},
    unit2: {},
    term1: {},
    term2: {},
  };

  rows.forEach((row) => {
    const student = students.find((item) => item.roll_no === row.roll_no);
    const rollNo = student?.roll_no ?? row.roll_no;

    if (!formattedMarks.unit1[rollNo]) formattedMarks.unit1[rollNo] = {};
    if (!formattedMarks.unit2[rollNo]) formattedMarks.unit2[rollNo] = {};
    if (!formattedMarks.term1[rollNo]) formattedMarks.term1[rollNo] = {};
    if (!formattedMarks.term2[rollNo]) formattedMarks.term2[rollNo] = {};

    formattedMarks.unit1[rollNo][row.subject] = row.unit1_marks;
    formattedMarks.unit2[rollNo][row.subject] = row.unit2_marks;
    formattedMarks.term1[rollNo][row.subject] = row.term1_marks;
    formattedMarks.term2[rollNo][row.subject] = row.term2_marks;
  });

  return formattedMarks;
};

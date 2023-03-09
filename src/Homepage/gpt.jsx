import React, { useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Button, Grid, TextField, Typography } from '@mui/material';
import './gpt.css';

const GROUP_SIZE = 15;
const LEAVE_CAPACITY = 3;
const LEAVE_DURATION = 1;
const MAX_LEAVE_PEOPLE = 5;
const MONTHS_IN_YEAR = 12;

function LeaveScheduler() {
  const [leaveSchedule, setLeaveSchedule] = useState({});
  const [remainingMonths, setRemainingMonths] = useState(MONTHS_IN_YEAR);
  const [errorMessage, setErrorMessage] = useState(null);
  const [finalReport,setFinalReport]=useState([]);
  let index=0

  // setFinalReport(query => [...finalReport, query])

  function handleScheduleLeaves() {
    // Initialize a list of available people
    const availablePeople = [];

    // Iterate over each person in the group
    for (let person = 1; person <= GROUP_SIZE; person++) {
      // Check if the person has leave days remaining
      if (!leaveSchedule[person] || leaveSchedule[person] < LEAVE_CAPACITY) {
        // Add the person to the list of available people
        availablePeople.push(person);
      }
    }

    if (GROUP_SIZE * LEAVE_CAPACITY> MONTHS_IN_YEAR*MAX_LEAVE_PEOPLE) {
      // setErrorMessage(`Completed all the leaves in ${MONTHS_IN_YEAR - remainingMonths + 1} months`);
      setErrorMessage(`Cannot assign leaves to ${GROUP_SIZE} people in ${MONTHS_IN_YEAR} months`);
      return;
    }

    // Randomly select up to MAX_LEAVE_PEOPLE from the list of available people
    const leavePeople = availablePeople.sort(() => Math.random() - 0.5).slice(0, MAX_LEAVE_PEOPLE);

    var query=[]
    // Update the leave schedule for the selected people
    for (const person of leavePeople) {
      // Increment the leave days for the selected person
      if (!leaveSchedule[person]) {
        leaveSchedule[person] = LEAVE_DURATION;
        query.push("Person "+person+" will be on leave for month "+(13-remainingMonths));
        
      } else {
        leaveSchedule[person] += LEAVE_DURATION;
        query.push("Person "+person+" will be on leave for month "+(13-remainingMonths));
      }
      // console.log(query)
      // setFinalReport(finalReport => ([...finalReport, query]));
    }
    setFinalReport(finalReport => ([...finalReport,query]));
    // console.log(finalReport)
    

    // Decrement the remaining months
    setRemainingMonths(remainingMonths - 1);

    // Check if all people have completed their leaves
    let allCompleted = true;
    for (let person = 1; person <= GROUP_SIZE; person++) {
      if (!leaveSchedule[person] || leaveSchedule[person] < LEAVE_CAPACITY) {
        allCompleted = false;
        break;
      }
    }

    // console.log(availablePeople)

    // Check if there are enough months remaining for all people to complete their leaves
    if (availablePeople.length==0) {
      // If not, set an error message
      // setErrorMessage('Not enough months are available for all people to complete their leaves');
      // return;
      setRemainingMonths(0);
      setErrorMessage(`Completed all the leaves in ${MONTHS_IN_YEAR - remainingMonths } months`);
      return;
    }

    // Update the leave schedule state
    setLeaveSchedule({ ...leaveSchedule });
  }

  function handleReset() {
    // Reset the state
    setLeaveSchedule({});
    setRemainingMonths(MONTHS_IN_YEAR);
    setErrorMessage(null);
    setFinalReport([]);
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Leave Scheduler</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">
          There are {GROUP_SIZE} people in a group, all having leave capacity of {LEAVE_CAPACITY} months,
          they can take leave for {LEAVE_DURATION} month at a time. Only {MAX_LEAVE_PEOPLE} people can be on
          a leave in a month. Generate a schedule so that all {GROUP_SIZE} people can complete their {LEAVE_CAPACITY}
          month leaves in a year
          </Typography>
      </Grid>
      <Grid item xs={12}>
        <Button id="submitButton" variant="contained" color="primary" onClick={handleScheduleLeaves} disabled={remainingMonths === 0}>
          Schedule Leave
        </Button>
        <Button id="resetButton" variant="contained" onClick={handleReset}>
          Reset
        </Button>
      </Grid>
      {errorMessage && (
        <Grid item xs={12}>
          <Typography variant="body1" color="error">
            {errorMessage}
          </Typography>
        </Grid>
      )}
      <Grid item xs={12}>
        <Typography variant="body1">
          Remaining Months: {remainingMonths}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h5">Leave Schedule</Typography>
        <table align='center' width='80%'>
          <thead>
            <tr>
              <th>Person</th>
              {[...Array(LEAVE_CAPACITY)].map((_, index) => (
                <th key={index}>Month {index + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(GROUP_SIZE)].map((_, personIndex) => (
              <tr key={personIndex}>
                <td>{personIndex + 1}</td>
                {[...Array(LEAVE_CAPACITY)].map((_, monthIndex) => (
                  <td key={monthIndex}>
                    {leaveSchedule[personIndex + 1] && leaveSchedule[personIndex + 1] >= monthIndex + 1 ? 'X' : '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div>
        {
          finalReport.map(query=>(
        <Accordion id={index++}>
        <AccordionSummary
          expandIcon={"↓"}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
        <Typography>Month {index}</Typography>
        </AccordionSummary>
          {
            query.map(subQuery=>(<AccordionDetails><Typography>{subQuery}</Typography></AccordionDetails>))
          }
      </Accordion>
      ))
        }
        </div>
      </Grid>
    </Grid>
    
  );
}

export default LeaveScheduler;

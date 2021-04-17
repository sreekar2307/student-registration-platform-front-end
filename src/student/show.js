import React, {useEffect} from 'react';
import api from "../config/axios";

export default function StudentShow(props) {
    const {studentId} = props.match.params
    const [student, setStudent] = React.useState(null);
    useEffect(() => {
        api.get(`students/${studentId}`).then(({data}) => {
            setStudent(data.student)
        })
    }, [student])
    return (
        student && (<div>
            <h1>Student {studentId}</h1>
            <span>{JSON.stringify(student)}</span>
        </div>)
    )
}
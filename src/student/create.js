import React from 'react';
import api from "../config/axios";
import {
    Chip,
    FormControl,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    withStyles
} from "@material-ui/core";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import {getHandleChange, goBack, handleCourseChange, handleDegreeChange, MenuProps, styles} from "./show";

class StudentCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            student: {
                name: '',
                email: '',
                degree: {name: ''},
                courses: [],
                enrollmentNo: ''
            },
            courses: [],
            degrees: [],
            deleting: false,
            saving: false,
            errors: null
        }
    }

    componentDidMount() {
        api.get('degrees').then(({data}) => {
            const {degrees} = data
            this.setState({
                ...this.state,
                degrees,
                errors: null
            })
        }).catch(err => {
            this.setState({
                ...this.state,
                errors: err.response.data
            })
        })
    }

    onSave = () => {
        this.setState({
            ...this.state,
            saving: true,
        })
        api.post(`students/`, {
            student: {
                "name": this.state.student.name,
                "enrollment_no": this.state.student.enrollmentNo,
                "email": this.state.student.email,
                "degree_id": this.state.student.degree ? null : this.state.student.degree.id,
                "course_ids": this.state.student.courses.map(course => course.id)
            }
        }).then(() => {
            this.setState({
                ...this.state,
                errors: null,
                saving: false,
            })
        }).catch(err => {
            this.setState({
                ...this.state,
                saving: false,
                errors: err.response.data,
            })
        })

    }

    render() {
        const {classes} = this.props
        const {student, degrees, courses, saving, errors} = this.state;
        return (
            <div className={classes.root}>
                <div>
                    {errors ? <Chip color="secondary" label={JSON.stringify(errors)}/> : <br/>}
                    <Grid
                        container
                        direction="row"
                        justify="flex-start"
                        alignItems="center"
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            size="large"
                            onClick={goBack.bind(this)}
                        >
                            Go Back
                        </Button>
                    </Grid>
                    <TextField
                        id={`student-name`}
                        label="Name"
                        style={{margin: 8}}
                        placeholder="name of the student"
                        helperText="Please enter the name of the student"
                        fullWidth
                        onChange={getHandleChange.call(this, 'name')}
                        value={student.name}
                        margin="normal"
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id={`student-email`}
                        label="Email"
                        style={{margin: 8}}
                        placeholder="Email address of the student"
                        helperText="Please enter the email address of the student"
                        fullWidth
                        value={student.email}
                        onChange={getHandleChange.call(this, 'email')}
                        margin="normal"
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id={`student-enrollmentNumber`}
                        label="Enrollment Number"
                        style={{margin: 8}}
                        placeholder="Enrollment Number of the student"
                        helperText="Please enter the Enrollment Number address of the student"
                        fullWidth
                        value={student.enrollmentNo}
                        onChange={getHandleChange.call(this, 'enrollmentNo')}
                        margin="normal"
                        required
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <FormControl className={classes.formControl}>
                        <InputLabel>Degree</InputLabel>
                        <Select
                            fullWidth
                            id={`student-degree`}
                            value={student.degree && student.degree.name}
                            onChange={handleDegreeChange.bind(this)}
                        >
                            <MenuItem value={null}>
                                <em>None</em>
                            </MenuItem>
                            {degrees.map((degree, index) => {
                                return <MenuItem value={degree.name} key={degree.name}
                                                 id={`student-${degree.id}-${index}`}>{degree.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel>Courses</InputLabel>
                        <Select
                            fullWidth
                            id={`student-courses`}
                            multiple
                            value={student.courses.map(course => course.name)}
                            input={<Input id="select-multiple-chip"/>}
                            placeholder="Courses Enrolled by the Student"
                            onChange={handleCourseChange.bind(this)}
                            renderValue={(selected) => (
                                <div className={classes.chips}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} className={classes.chip}/>
                                    ))}
                                </div>
                            )}
                            MenuProps={MenuProps}
                        >
                            {courses.map((course) => (
                                <MenuItem key={`student-courses-${course.name}`} value={course.name}>
                                    {course.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Grid
                        container
                        direction="row"
                        justify="space-between"
                        alignItems="center"
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={this.onSave}
                            disabled={saving}
                            startIcon={<SaveIcon/>}
                        >
                            Create
                        </Button>
                    </Grid>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(StudentCreate)
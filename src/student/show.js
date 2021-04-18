import React from 'react';
import api from "../config/axios";
import {
    Chip,
    CircularProgress,
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
import DeleteIcon from '@material-ui/icons/Delete';

export const styles = (theme) => ({
    root: {
        display: 'flex',
        padding: '1em',
        flexWrap: 'wrap',
        width: '75%'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '25ch',
    },
    formControl: {
        margin: theme.spacing(1),
        width: "100%"
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    },
    noLabel: {
        marginTop: theme.spacing(3),
    },
    button: {
        margin: theme.spacing(1),
    },
})

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

class StudentShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            student: null,
            courses: [],
            degrees: [],
            deleting: false,
            saving: false,
            errors: null
        }
    }

    componentDidMount() {
        const studentId = this.props.match.params['studentId']
        api.get(`students/${studentId}`).then(({data}) => {
            const {student} = data
            this.setState({
                ...this.state,
                errors: null,
                student: {
                    id: student.id,
                    name: student.name,
                    email: student.email,
                    enrollmentNo: student['enrollment_no'],
                    courses: student.courses,
                    degree: student.degree,
                }
            });
            api(`degrees/${student.degree.id}/courses`).then(({data}) => {
                this.setState({
                    ...this.state,
                    errors: null,
                    courses: data.courses,
                })
            }).catch(err => {
                this.setState({
                    ...this.state,
                    errors: err.response.data
                })
            })
        }).catch(err => {
            this.setState({
                ...this.state,
                errors: err.response.data
            })
        })
        api.get('degrees').then(({data}) => {
            const {degrees} = data
            this.setState({
                ...this.state,
                errors: null,
                degrees
            })
        }).catch(err => {
            this.setState({
                ...this.state,
                errors: err.response.data
            })
        })
    }

    onDelete = () => {
        this.setState({
            ...this.state,
            deleting: true,
            errors: null
        })
        api.delete(`students/${this.state.student.id}`).then(() => {
            this.setState({
                ...this.state,
                saving: false,
                errors: null
            })
            this.props.history.push(`/students`)
        }).catch(err => {
            this.setState({
                ...this.state,
                deleting: false,
                errors: err.response.data
            })
        })
    }

    onSave = () => {
        this.setState({
            ...this.state,
            saving: true,
            errors: null
        })
        api.put(`students/${this.state.student.id}`, {
            student: {
                "name": this.state.student.name,
                "enrollment_no": this.state.student.enrollmentNo,
                "email": this.state.student.email,
                "degree_id": this.state.student.degree ? this.state.student.degree.id : -1,
                "course_ids": this.state.student.courses.map(course => course.id)
            }
        }).then((resp) => {
            console.log(resp)
            this.setState({
                ...this.state,
                saving: false,
                errors: null
            })
        }).catch(err => {
            console.log(err)
            this.setState({
                ...this.state,
                saving: false,
                errors: err.response.data
            })
        })

    }

    onCreateNew = () => {
        this.props.history.push(`/students/create`);
    }


    render() {
        const {classes} = this.props
        const {student, degrees, courses, deleting, saving, errors} = this.state;
        const studentId = this.props.match.params['studentId']
        if (!student) {
            return <CircularProgress/>
        }
        return (
            <div className={classes.root}>
                <div>
                    {errors ? <Chip color="secondary" label={JSON.stringify(errors)}/> : <br/>}
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
                            size="large"
                            onClick={goBack.bind(this)}
                        >
                            Go Back
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            size="large"
                            onClick={this.onCreateNew}
                        >
                            Create New
                        </Button>
                    </Grid>
                    <TextField
                        id={`${studentId}-Id`}
                        label="Id"
                        style={{margin: 8}}
                        fullWidth
                        value={student.id}
                        margin="normal"
                        disabled
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id={`${studentId}-name`}
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
                        id={`${studentId}-email`}
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
                        id={`${studentId}-enrollmentNumber`}
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
                            id={`${studentId}-degree`}
                            value={student.degree ? student.degree.name : null}
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
                            id={`${studentId}-courses`}
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
                            color="secondary"
                            className={classes.button}
                            onClick={this.onDelete}
                            disabled={deleting}
                            startIcon={<DeleteIcon/>}
                        >
                            Delete
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={this.onSave}
                            disabled={saving}
                            startIcon={<SaveIcon/>}
                        >
                            Save
                        </Button>
                    </Grid>
                </div>
            </div>
        )
    }
}

export function getHandleChange(field) {
    return event => this.setState({
        ...this.state,
        student: {
            ...this.state.student,
            [field]: event.target.value
        }
    })
}

export function handleDegreeChange(event) {
    if (event.target.value) {
        const degree = this.state.degrees.find(degree => event.target.value === degree.name)
        this.setState({
            ...this.state,
            student: {
                ...this.state.student,
                degree: degree,
                courses: []
            }
        })
        api.get(`degrees/${degree.id}/courses`).then(({data}) => {
            this.setState({
                ...this.state,
                courses: data.courses,
            })
        })
    } else {
        this.setState({
            ...this.state,
            courses: [],
            student: {
                ...this.state.student,
                degree: null,
                courses: []
            }
        })
    }
}

export function handleCourseChange(event) {
    const courses = this.state.courses.map(course => {
        if (event.target.value.find(newCourse => newCourse === course.name)) {
            return course
        }
        return null;
    }).filter(course => course !== null)
    this.setState({
        ...this.state,
        student: {
            ...this.state.student,
            courses: courses
        }
    })
}

export function goBack() {
    this.props.history.goBack()
}

export default withStyles(styles)(StudentShow)
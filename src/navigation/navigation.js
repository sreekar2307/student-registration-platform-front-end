import React from "react";
import {Route, withRouter, Switch} from "react-router-dom";
import StudentList from "../student/list";
import StudentShow from "../student/show";
import StudentCreate from "../student/create";

class Navigation extends React.Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route path="/students/create" exact component={StudentCreate}/>
                    <Route path="/students/:studentId" exact component={StudentShow}/>
                    <Route path="/students" exact component={StudentList}/>
                    <Route path="/" exact component={StudentList}/>
                </Switch>
            </div>
        )
    }
}

export default withRouter(Navigation);
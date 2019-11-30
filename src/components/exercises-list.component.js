import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Exercise = props => (
  <tr>
    <td>{props.exercise.username}</td>
    <td>{props.exercise.description}</td>
    <td>{props.exercise.duration}</td>
    <td>{props.exercise.date.substring(0, 10)}</td>
    <td>
      <Link to={"/edit/" + props.exercise._id}>edit</Link> |{" "}
      <a
        href="#"
        onClick={() => {
          props.deleteExercise(props.exercise._id);
        }}
      >
        delete
      </a>
    </td>
  </tr>
);

const Aggregation = props => (
  <tr>
    <td>{props.total._id}</td>
    <td>{props.total.total}</td>
  </tr>
);
export default class ExercisesList extends Component {
  constructor(props) {
    super(props);

    this.deleteExercise = this.deleteExercise.bind(this);

    this.state = { exercises: [], total: [] };
  }

  componentDidMount() {
    axios
      .get("http://localhost:5000/exercises/")
      .then(response => {
        this.setState({ exercises: response.data });
      })
      .catch(error => {
        console.log(error);
      });

    axios
      .get("http://localhost:5000/exercises/total")
      .then(response => {
        this.setState({ total: response.data });
      })
      .catch(error => {
        console.log(error);
      });
  }

  deleteExercise(id) {
    axios.delete("http://localhost:5000/exercises/" + id).then(response => {
      console.log(response.data);
    });

    this.setState({
      exercises: this.state.exercises.filter(el => el._id !== id)
    });
  }

  exerciseList() {
    return this.state.exercises.map(currentexercise => {
      return (
        <Exercise
          exercise={currentexercise}
          deleteExercise={this.deleteExercise}
          key={currentexercise._id}
        />
      );
    });
  }

  aggregationFunc() {
    try {
      return this.state.total.map(data => {
        return <Aggregation total={data} />;
      });
    } catch (e) {
      return "";
    }
  }

  render() {
    return (
      <>
        <div className="content">
          <h3>Logged Exercises</h3>
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th>Username</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{this.exerciseList()}</tbody>
          </table>
        </div>
        <div className="content">
          <h3>Aggregation:</h3>
          <h6>Match: Run & Groupby: name(itsmejkumar)</h6>
          <table className="table">
            <thead className="thead-light">
              <tr>
                <th>Username</th>
                <th>Total Duration</th>
              </tr>
            </thead>
            <tbody>{this.aggregationFunc()}</tbody>
          </table>
        </div>
      </>
    );
  }
}

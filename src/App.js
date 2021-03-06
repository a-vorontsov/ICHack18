import React, { Component } from 'react';
import './App.css';
import Confetti from 'react-confetti';
const request = require('superagent');
const Spinner = require('react-spinkit');

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shirt: "",
      spinner: false,
      title: true,
      image: "",
      file: ""
    }
    this.onImage = this.onImage.bind(this);
    this.getIfShirt = this.getIfShirt.bind(this);
    this.onReset = this.onReset.bind(this);
  }
  async getIfShirt(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const target = e.target;
      this.setState({image: target.result});
    }
    reader.readAsDataURL(file);
    this.setState({
      spinner: true,
      title: false
    });
    const req = request
      .post('https://southcentralus.api.cognitive.microsoft.com/customvision/v1.1/Prediction/faec218d-a294-4b22-9e35-4dd925c0ba7c/image')
      .set('Prediction-Key', '143515aaa0e343e1918dce96217a6d34')
      .set("Accept", "application/json")
      .set("Content-type", "multipart/form-data");
    const res = await req.send(file);
    const response = JSON.parse(res.text);
    let prediction;
    if ((response.Predictions[0].Tag === "T-shirts") && (response.Predictions[0].Probability > 0.5)) {
      prediction = `T-Shirt`
    } else {
      prediction = "Not T-Shirt"
    }
    this.setState({
      shirt: prediction,
      spinner: false
    });
  }
  onReset(event) {
    event.preventDefault();
    this.setState({
      shirt: "",
      title: true,
      image: ""
    });
  }
  onImage(event) {
    event.preventDefault();
    const input = event.currentTarget;
    let file = input.files[0];
    this.getIfShirt(file);
  }
  render() {
    return (
      <div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: "100%", height: "100%" }}>
          {
            (() => {
              if (this.state.shirt === "T-Shirt") {
                return (
                  <Confetti width={window.innerWidth} numberOfPieces={500} height={window.innerHeight}/>
                )
              }
            })()
          }
        </div>
        <div>
          {
            (() => {
              if (!!this.state.title) {
                return (
                  <label htmlFor={"camera"}>
                    <div className="container">
                      <div className="btn btn--camera">
                        <h3 className="title-text">
                          <img src="https://png.icons8.com/small/50/000000/t-shirt.png" alt="icon"/><br/>OR NOT<br/><img src="https://png.icons8.com/small/50/000000/t-shirt.png" alt="icon"/>
                        </h3>
                      </div>
                    </div>
                  </label>
                )
              }
            })()
          }
          {
            (() => {
              if (this.state.image !== "") {
                return <img className="image" alt="Camera" src={this.state.image}/>
              }
            })()
          }
          {
            (() => {
              if (!!this.state.spinner) {
                return (
                    <div className="container">
                      <div className="btn btn--camera">
                        <h3 className="title-text">
                          <Spinner name="pulse" color="#7044a1"/>
                        </h3>
                      </div>
                    </div>
                ); 
              } else if (this.state.shirt === "T-Shirt") {
                return (
                  <div className="container">
                    <div className="btn btn--camera">
                      <h1 className="title-text shirt">
                        T-Shirt
                      </h1>
                      <p style={{paddingTop: "2em"}} onClick={this.onReset}>Another one?</p>
                    </div>
                  </div>
                )
              } else if (this.state.shirt === "Not T-Shirt") {
                return (
                  <div className="container">
                    <div className="btn btn--camera">
                      <h1 className="title-text not-shirt">
                       Not<br/>T-Shirt 
                      </h1>
                      <p style={{paddingTop: "2em"}} onClick={this.onReset}>Another one?</p>
                    </div>
                  </div>
                )
              }
            })()
          }
        </div>
        <input onChange={this.onImage}
               className="hidden"
               id="camera"
               type="file"
               accept="image/*"
               capture
               ref="fileInput"/>
      </div>
    );
  }
}

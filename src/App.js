import React from 'react';
import './App.css';
import Navigation from "./components/Navigation/Navigation.js"
import Logo from "./components/Logo/Logo.js"
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm.js"
import Rank from "./components/Rank/Rank.js"
import Particles from 'react-particles-js';
import Clarifai from 'clarifai'; //api
import FaceRecognition from "./components/FaceRecognition/FaceRecognition.js"
import Signin from "./components/Signin/Signin.js"
import Register from "./components/Register/Register.js"

const app = new Clarifai.App({
  apiKey: '5de2aa67ade34327820167088fd96de6'
});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
  input: "",
  imageUrl: "",
  box: {},
  // keeps track of where we are on the page
  route: "signin",
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState
  }

  // use to check if information loaded
  // componentDidMount() {
  //   fetch('http://localhost:3000')
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  // }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.join
      }
    })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    // console.log(width, height);
    // returning an object
    return (
      {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    )
  }

  displayFaceBox = (box) => {
    console.log(box)
    this.setState({
      box: box
    })
  }

  onInputChange = (event) => {
    const { value } = event.target;
    this.setState({
      input: value
    })
  }

  onPictureSubmit = (event) => {
    event.preventDefault()
    this.setState({
      imageUrl: this.state.input
    })
    app.models
      // cant predict this.state.imgUrl for advance reasons
      .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then((response) => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              //dont want to change the entire user object, want to update the entries only
              this.setState(Object.assign(this.state.user, { entries: count }))
            })
            .catch(console.log())
        }
        // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
        return this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => {
        return console.log(err);
      })
  }

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState)
    } else if (route === "home") {
      this.setState({
        isSignedIn: true
      })
    }
    this.setState({
      // second route is equal to what is passed in
      route: route
    });
  }

  render() {
    //destructure
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles
          className="particles"
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === "home" ?
          <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit} />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
          : (route === "signin"
            //passes in this.onRouteChange, if onClick occurs, it will run function in Signin component
            ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    )
  }
}

export default App;

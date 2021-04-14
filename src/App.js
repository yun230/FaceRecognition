import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Navigation from './Components/Navigation/Navigation';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import './App.css';

const app=new Clarifai.App({
  apiKey:'db3eee763e754f4c995dc14f1b63da61'
});


const particlesOptions={
  particles: {
    number: {
      value:50,
      density: {
        enable:true,
        value_area:500
      }
    }
}
}

class App extends Component {

  constructor (){
    super();
    this.state={
      input: '',
      imageUrl:'',
      box: {},
      route: 'signin'
    }
  }

 
  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }



  onButtonSubmit=() =>{
    this.setState({imageUrl: this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
     this.state.input)
     .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
     .catch(err => console.log(err));
    }
  
    onRouteChange=(route)=>{
      this.setState({route: route});
    }
  
  render(){
  return (
    <div className="App">
      <Particles className='particles'
                params={particlesOptions} />
      <Navigation onRouteChange={this.onRouteChange}/>
      {this.state.route==='signin' 
      ? <Signin onRouteChange={this.onRouteChange}/>
      :<div>
      <Logo/>
      <Rank/>
      <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/> 
      <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/> 
      </div>
      }
    </div>
  );
    }
}

export default App;

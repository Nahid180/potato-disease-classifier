
import { useEffect, useState, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import './App.css';

function App(){
    const [isModelLoading, setisModelLoading] = useState();
    const [model, setModel] = useState();
    const [imageURL, setImageURL] = useState();
    const [result, setResult] = useState();
    //const [confidence, setConfidence] = useState();
    const imageref = useRef();
    const classNames = ['Early Blight', 'Healthy', 'Late Blight']
    const url = "https://cdn.jsdelivr.net/gh/nahid180/potato-disease-model/model.json";

    const loadModel = async () =>{
        setisModelLoading(true);
        try{
            const model = await tf.loadGraphModel(url);
            setModel(model);
            console.log('success');
            setisModelLoading(false);
        } catch (error){
            console.log(error);
            setisModelLoading(false);
        }
    }
    useEffect(() => {
        loadModel()
    }, [])
    if (isModelLoading){
        return <h1 className="preloader">Model is loading...</h1>
    }
    const uploadImage = (e) =>{
        const {files} = e.target;
        if (files.length > 0){
            const url = URL.createObjectURL(files[0])
            setImageURL(url)
            console.log(url);
        } else{
            setImageURL(null)
        }
    }
    const indentify = async ()=>{
        const image = tf.browser.fromPixels(imageref.current, 3).resizeBilinear([224,224]).expandDims(0);
        const prediction = model.predict(image).dataSync();
        const max_val = Math.max(...prediction);
        //setConfidence(max_val*100)
        setResult(classNames[prediction.indexOf(max_val)]);
        
    }
    return(
        <div className="container">
            {result? <h1 className="result">Chance of {result}</h1> : <h1 className="result">Results will appear here</h1>} <br />
            <div className="inputHolder">
                <input type="file" className="inputfile" name="file" id="file" accept="image/*" capture = "camera" onChange={uploadImage}/>
                <label for="file"><i class="fa fa-upload"></i>  <b>Upload</b></label>
            </div><br />
            <div>
                {imageURL && <img className="preview" src={imageURL} sizes="" crossOrigin="anonymous" alt="loaded-pic" ref={imageref} />}
                <br />
                <div className="button-container">
                    {imageURL && <button className="predict" onClick={indentify}>Predict</button>}
                </div>
            </div>
        </div>
    )
}

export default App;
import { json } from "express";
import WeavoAI from "../schema-renderer/ai-models/ai-wrapper.js";

let runtest = (message) => {
    console.log("Running AI test...");
    let model = new WeavoAI()
    model.check_model_status().then((isRunning) => {
        if (!isRunning) {
            model.start_ai_server().then(() => {
                console.log("AI server started, waiting for it to be ready...");
                console.log("Sending message to AI:", message);
                // model.chat(message).then((response) => {
                //     console.log("AI Response:", response);
                // });
            });
        } 
        // else {
        //     console.log("AI server is already running.")
        //     model.chat(message).then((response) => {
        //         console.log("AI Response:", JSON.stringify(response));
        //     });
        // }
    });
};

export default runtest;




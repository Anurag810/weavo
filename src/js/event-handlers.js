import listners from './listners.js';
import a from './listners.js';

const handleListners = (listeners, event) => {
    if(Object.keys(listners || {}).length === 0) { console.log("No listeners found"); return; }

    if (event.type === "click" && listners.onClick) {
        a.onClick(event, "Hello, WeavoAI!");
    } else {
        console.log("No matching listener for event type:", event.type);
    }
}

export default handleListners;


export default {
    "onClick": function (event, message) {
        fetch(`http://localhost:3000/api/ai?message=${encodeURIComponent(message)}`)
            .then(response => response.json())
            .then(data => {
                console.log("AI Response:", data);
            })
            .catch(error => {
                console.error("Error fetching AI response:", error);
            });
    },
    "setState": function (event, stateKey, value) {
        console.log("Setting state", stateKey, "to", value);
        // Here you would implement logic to update the state of your application
    }
}
// import React, {useState, useEffect} from 'react';
import React from 'react';
import Axios from 'axios';
// import { Question, Tid, Answer } from '../models/temp.js';
//submit answer: insert answer in ans collection => go to specific question => update answer array with question

/**
 * This is for the answer form. When the user clicks submit, the answer should be automatically added to the question view. 
 * CALL WITH <AnswerForm question={question} model={GlobalModel} /> in order for it to work properly
 */
const AnswerForm = ({question, onSubmit}) => {
    // const [answers, setAnswers] = useState([]);
    // useEffect(() => {
    //     async function fetchAnswers() {
    //         try {
    //             const answersCollectionResponse = await Axios.get('http://localhost:8000/answers');
    //             const answersCollection = answersCollectionResponse.data;
    //             setAnswers(answersCollection);
    //         } catch (error) {
    //             console.error("error fetching answers in components/answerForm.js", error);
    //         }
    //     }
    
    //     fetchAnswers();
    // }, [props.showAForm, props.showPostView]);

    /**
     * Creates an Answer object given the submission form and calls addAnswerToQuestion which should add answer to the model
     * @param {User Submittion (submit button)} event Click on submit button
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        const username = event.target.formUsername.value;
        const answerBody = event.target.answerBody.value;

        if (containsInvalidLink(answerBody)) {
            alert('Please ensure that all hyperlinks are in the correct format and contain valid URLs.');
            return; // Stop here and don't continue with the form submission
        }

        const newAnswerData = {
            text: answerBody,
            ans_by: username
        }

        const newAnswer = await Axios.post('http://localhost:8000/answers', newAnswerData);
        
        const questionID = question._id;
        await Axios.put(`http://localhost:8000/questions/${questionID}`, {
                answerID: newAnswer.data._id // //specify what answer to add
            }).then(
                onSubmit()
            );
        if (updateQuestionResponse === undefined){
            console.log("error");
        }

    }

    // render() {
        return (
            <div id="answerFormContainer">
                <form id="answerForm" onSubmit={handleSubmit}>
                    <label htmlFor="formUsernameAnswer">Username:*</label>
                    <input type="text" id="formUsernameAnswer" name="formUsername" required />

                    <label htmlFor="answerBody">Answer:*</label>
                    <textarea id="answerBody" name="answerBody" rows="4" required></textarea>
            
                    <button type="submit">Post Answer</button>
                </form>
            </div>

        );
    // }
}

export default AnswerForm;

function containsInvalidLink(text) {

    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
        const linkText = match[1];
        const url = match[2];
        // try {
        //     // Throws if URL is invalid
        //     new URL(linkUrl);
        // } catch (_) {
        //     // If URL is invalid, or no URL is present
        //     return true;
        // }
        // Check if linkText exists and is not just whitespace
        if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
            return true;  // Invalid hyperlink detected
        }
        if (!linkText.trim()) {
            return true;
        }
    }
    // Checks if there are any lone brackets without valid URL format
    // if (text.includes('[') || text.includes(']') || text.includes('(') || text.includes(')')) {
    //     return true;
    // }
    return false;
}
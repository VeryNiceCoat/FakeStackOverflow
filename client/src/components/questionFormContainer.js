// import React, { useEffect, useState } from 'react';
import React from 'react';
import Axios from 'axios';
// import { Question, Tid, Answer } from '../models/temp';

/**
 * Question Form, what happens when you click ask a question
 */
const QuestionFormContainer = ({onSubmit}) => {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         model: props.model
    //     };
    // }
    const handleSubmit = async (event) => {
        // // Prevent the default form submission
        event.preventDefault();

        // // Extract values from form elements
        const title = event.target.questionTitle.value;
        const text = event.target.questionBody.value;
        const username = event.target.formUsername.value;
        const rawTagNames = event.target.formTags.value.split(' '); // Split by whitespace to get tags
        const tagNames = rawTagNames.map(name => name.toLowerCase());

        if (!containsInvalidLink(text)) {
            alert('Please ensure that all hyperlinks are in the correct format and contain valid URLs.');
            return; // Stop here and don't continue with the form submission
        }

            const tagsCollectionResponse = await Axios.get('http://localhost:8000/tags');
            const tagsCollection = await tagsCollectionResponse.data;
            const updatedTagsCollection = [...tagsCollection]; //what we add it to.
            const tagsIds = [];
            //we need to check if this tag already exists in the model
            for (const tagName of tagNames){
                let existingTag = updatedTagsCollection.find(tag => tag.name === tagName);
                if (existingTag) {
                    tagsIds.push(existingTag._id);
                } else {
                    const newTagData = { name: tagName };
                    const newTagResponse = await Axios.post('http://localhost:8000/tags', newTagData);
                    const newTag = newTagResponse.data;
                    updatedTagsCollection.push(newTag); // Update the tags collection
                    tagsIds.push(newTag._id);
                }
            }
            if (tagsIds.length === 0) {
                console.error('No tags were created or fetched.');
                return;
            }
            const newQuestionData = {
                title: title,
                text: text,
                tags: tagsIds, //this is an array. we break it up in the questionRoute.js
                asked_by: username
            }
    
            await Axios.post('http://localhost:8000/questions', newQuestionData).then( function (res){
                if(res.status === 201){
                    console.log(res.status);
                } else {
                    console.error("error code: ", res.status);
                }
                onSubmit(); //lets questionView component know that submit occurred
            })

    }

    // render() {
        return (
            <div id="questionFormContainer">
                <form id="questionForm" onSubmit={handleSubmit}>
                    <label htmlFor="questionTitle">Question Title:*</label>
                    <p>Limit titles to 100 characters or less.</p>
                    <input type="text" id="questionTitle" name="questionTitle" pattern=".{0,100}" required title="Max 100 characters"/>

                    <label htmlFor="questionBody">Question:*</label>
                    <textarea id="questionBody" name="questionBody" rows="4" required></textarea>

                    <label htmlFor="formTags">Tags:*</label>
                    <p>Add keywords separated by whitespace. 5 tags max, no more than 10 characters per tag</p>
                    <input type="text" id="formTags" name="formTags" pattern="^(?:\b\w{1,10}\b\s*){1,5}$" required title="Up to 5 tags, each no longer than 10 characters, separated by whitespace." />

                    <label htmlFor="formUsername">Username:*</label>
                    <input type="text" id="formUsername" name="formUsername" required />

                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    // }
}

export default QuestionFormContainer;

/**
 * Checks if the text contains an invalid markdown-style link
 * @param {string} text The text to check
 * @returns {boolean} True if there's an invalid link, false otherwise
 */
function containsInvalidLink(text) {
  // Match markdown link syntax [text](hyperlink)
  const regex = /\[([^\]]*?)\]\((.*?)\)/g;
  let match;
  let isValid = true; // Assume the text is valid to start with

  // Find all markdown links in the text
  while ((match = regex.exec(text)) !== null) {
    // Check if the hyperlink part is empty or doesn't start with the correct protocol
    if (!match[2].trim() || !(match[2].startsWith('http://') || match[2].startsWith('https://'))) {
      isValid = false; // Mark as invalid if any link is empty or has the wrong protocol
      break; // Exit the loop on first invalid link
    }
  }

  // If there are no markdown links at all, check if the text contains empty parentheses
  if (isValid && !regex.exec(text) && /\(\s*\)/.test(text)) {
    isValid = false; // Mark as invalid if empty parentheses are found
  }

  return isValid;
}


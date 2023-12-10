import React, { useState, useEffect } from 'react'
import TagForQuestionInMainPage from './tagForQuestionInMainPage'
import Axios from 'axios'

const QuestionEditable = (
    { question, onTitleClick, onhandleTagOnMainPageClicked },
    props
) => {
    const [selectedTags, setSelectedTags] = useState([])
    const [votes, setVotes] = useState(question.votes)

    useEffect(() => {
        const fetchRelevantTags = async () => {
        try {
            const res = await Axios.get(`http://localhost:8000/tags`)
            const relevantTags = res.data.filter(tag =>
            question.tags.some(questionTags => questionTags === tag._id)
            )
            setSelectedTags(relevantTags)
        } catch (error) {
            console.error('error fetching tags in components/question.js', error)
        }
        }
        fetchRelevantTags()
    }, [question.tags, question.views])

    const handleTitleClick = () => {
        onTitleClick()
    }

    const handleUpvote = async () => {
        try {
        const response = await Axios.put(
            `http://localhost:8000/questions/${question._id}/upVote`,
            {},
            { withCredentials: true }
        )
        setVotes(response.data.votes)
        } catch (error) {
        // window.alert(error)
        window.alert(error.response.data)
        // window.alert(error.message);
        }
    }

    const handleDownvote = async () => {
        try {
        const response = await Axios.put(
            `http://localhost:8000/questions/${question._id}/downVote`,
            {},
            { withCredentials: true }
        )
        setVotes(response.data.votes)
        } catch (error) {
        window.alert(error.response.data)
        // console.error('Error during upvote', error)
        }
    }

    return (
        <div id='questionContainer'>
        <div id='view-stats'>
            <div id='total-answers'>{question.answers.length} answers</div>
            <div id='total-views'>{question.views} views</div>
            <div>{votes} votes</div>
        </div>
        <div>
            <button onClick={handleUpvote}>UPVOTE</button>
        </div>
        <div>
            <button onClick={handleDownvote}>DOWNVOTE</button>
        </div>
        <div id='title-and-tags'>
            <div id='question-title' onClick={handleTitleClick}>
            Question Title: {question.title}
            </div>
            <div>Question Summary: {question.summary}</div>
            {/* <div id='appendOtherTagsHere'>
            {selectedTags.map(tag => (
                <TagForQuestionInMainPage
                key={tag._id}
                onSearch={props.onSearch}
                tag={tag}
                onhandleTagOnMainPageClicked={onhandleTagOnMainPageClicked}
                />
            ))}
            </div> */}
        </div>
        <div id='submitter-info'>
            {question.username} asked {formatDate(question.ask_date_time)}
        </div>
        </div>
    )
    }

    export default QuestionEditable

    const formatDate = askedDate => {
    const dateAskedDate = new Date(askedDate)
    const currentDate = new Date()
    const timeDifferenceInSeconds = Math.floor(
        (currentDate - dateAskedDate) / 1000
    )
    const hours = currentDate.getHours().toString().padStart(2, '0')
    const minutes = currentDate.getMinutes().toString().padStart(2, '0')
    const formattedTime = `${hours}:${minutes}`
    if (timeDifferenceInSeconds < 60) {
        return `${timeDifferenceInSeconds} seconds ago`
    } else if (timeDifferenceInSeconds < 3600) {
        const minutes = Math.floor(timeDifferenceInSeconds / 60)
        return `${minutes} minute${minutes > 1 ? 's' : ''} minutes ago`
    } else if (timeDifferenceInSeconds < 86400) {
        const hours = Math.floor(timeDifferenceInSeconds / 3600)
        return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else if (currentDate.getFullYear() === dateAskedDate.getFullYear()) {
        const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
        ]
        const month = monthNames[dateAskedDate.getMonth()]
        const day = dateAskedDate.getDate()
        return `${month} ${day} at ${formattedTime}`
    } else {
        const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
        ]
        const month = monthNames[dateAskedDate.getMonth()]
        const day = dateAskedDate.getDate()
        const year = dateAskedDate.getFullYear()
        return `${month} ${day}, ${year} at ${formattedTime}`
    }
}
